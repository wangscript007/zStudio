package com.zte.mao.common.service.register;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.config.ConfigManage;
import com.zte.mao.common.entity.CommonConst;
import com.zte.mao.common.http.HttpRequestUtils;
import com.zte.mao.common.process.ProcessResBean;
import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.common.service.CommonEnvService;
import com.zte.mao.common.service.SqlExecuteService;
import com.zte.mao.common.util.CipherUtil;
import org.apache.log4j.Logger;

@Service
public class TenantRegisterService {
	
	private static Logger logger = Logger.getLogger(TenantRegisterService.class.getName());

	@Resource
	private CommonEnvService commonEnvService;
	
	@Resource
	private TenantIdManager tenantIdManager;
	
	@Resource
    private HttpRequestUtils requestUtils;
	
	@Resource
	private SqlExecuteService sqlExecuteService;

	@Resource
	private TenantSchema tenantSchema;
	
	@Resource
	private OrmDao ormDao;

	private String platformType = ConfigManage.getInstance().getPlatformType();
	
	@SuppressWarnings("rawtypes")
	public boolean isNotExistsTenantName(String username) throws Exception {
		String sql = "SELECT COUNT(1) COUNT FROM TENANT WHERE NAME='" + username + "'";
		Map data = sqlExecuteService.executeSQL(sql, SqlExecuteService.OPERATOR_QUERY, null);
		if(sqlExecuteService.getStatus(data).equals(SqlExecuteService.STATUS_SUCCESS)) {
			List list = (List) data.get("rows");
			if (list.size() > 0) {
				if(String.valueOf(((Map)list.get(0)).get("COUNT")).equals("0")) {
					return true;
				}
			}
		}
		return false;
	}

	public CommonResponse tenantRegister(String tenantName, String password) {
		CommonResponse response = new CommonResponse(CommonResponse.STATUS_SUCCESS, "租户注册成功。");
		
		if(platformType.equals(CommonConst.PLATFORM_TYPE_MOCK)) {
			response.setStatus(CommonResponse.STATUS_FAIL);
			response.setMessage("租户注册失败，模拟平台不允许自动创建租户。");
			return response;
		}
		
		// 1. 写tenant表
		try {
			String dbid = getDBID();
			String tenantId = String.valueOf(tenantIdManager.getNextTenantId()) + dbid;
			writeTenant(tenantName, tenantId);
	
			// 2. 写user表：admin@ZTE + password
			String loginName = "admin@" + tenantName;
			password = CipherUtil.encrypt(loginName + CipherUtil.decryptFromBrowser(password));
			writeUser(tenantId, loginName,password);
			
			// 3. 调用接口，创建数据库
			tenantSchema.createTenantSchema(tenantId, dbid);
			
			// 4. 写用户数据到租库
			writeTenantUserTable(tenantId, tenantName,password);
		}
		catch(Exception e) {
			logger.error(e.getMessage(), e);
			response.setStatus(CommonResponse.STATUS_FAIL);
			response.setMessage("租户注册失败，请联系管理员 " + e.getMessage());
		}
		return response;
	}
	
	/**
	 * 添加用户数据到租户库
	 * @param tenantId
	 * @param tenantName
	 * @param password
	 * @throws Exception
	 */
	private void writeTenantUserTable(String tenantId, String tenantName, String password) throws Exception {
		Map<String, String> data = new HashMap<String, String>();
		data.put("TENANT_ID", tenantId);
		data.put("LOGIN_NAME", "admin@" + tenantName);
		data.put("PASSWORD", password);
		data.put("USERNAME", "admin@" + tenantName);
		ormDao.add("SM_USER_TABLE", data, tenantId);
		if(platformType.equals(CommonConst.PLATFORM_TYPE_DESIGN)) {
			ormDao.setPlatformType(CommonConst.PLATFORM_TYPE_MOCK).add("SM_USER_TABLE", data, tenantId);
		}
	}

	/**
	 * 写租户库
	 * @param username
	 * @param tenantId
	 * @throws Exception
	 */
	private void writeTenant(String username, String tenantId) throws Exception {
		Map<String, String> data = new HashMap<String, String>();
		Timestamp time = new Timestamp(System.currentTimeMillis());
		String create_time = time.toString();
		data.put("ID", tenantId);
		data.put("NAME", username);
		data.put("CREATE_TIME", create_time);
		ormDao.add("TENANT", data, tenantId);
		if(platformType.equals(CommonConst.PLATFORM_TYPE_DESIGN)) {
			ormDao.setPlatformType(CommonConst.PLATFORM_TYPE_MOCK).add("TENANT", data, tenantId);
		}
	}
	
	private void writeUser(String tenantId, String loginName, String password) throws Exception {
		Map<String, String> data = new HashMap<String, String>();
		DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Timestamp time = new Timestamp(System.currentTimeMillis());
		String regist_time = sdf.format(time);
		data.put("TENANT_ID", tenantId);
		data.put("LOGIN_NAME", loginName);
		data.put("PASSWORD", password);
		data.put("REGIST_TIME", regist_time);
		ormDao.add("USER", data, null);
		if(platformType.equals(CommonConst.PLATFORM_TYPE_DESIGN)) {
			ormDao.setPlatformType(CommonConst.PLATFORM_TYPE_MOCK).add("USER", data, null);
		}
	}

	@SuppressWarnings("rawtypes")
	private String getDBID() throws Exception {
		String dbid = "0";
		String sql = "SELECT ID FROM PROCESS_RES WHERE MODULE='" + ProcessResBean.PROCESS_MODULE_DB + "' AND STATUS='2' AND USED_CAPACITY < CAPACITY";
		Map results = sqlExecuteService.executeSQL(sql, SqlExecuteService.OPERATOR_QUERY, null);
		
		if(sqlExecuteService.getStatus(results).equals(SqlExecuteService.STATUS_SUCCESS)) {
			List list = (List)results.get("rows");
			if(list.size() > 0) {
				String id = ((Map)list.get(0)).get("ID").toString();
				if(StringUtils.isNotBlank(id)) {
					dbid = id;
				}
				
			}
			if(dbid.equals("0")) {
				throw new Exception("get DB id failed, data is null, sql:" + sql);
			}
		}
		else {
			throw new Exception("get DB id failed, sql:" + sql);
		}
		String zeroString = "";
		if (dbid.length() < 3) {
			int zeroSize = 3 - dbid.length();
			for (int i = 0; i < zeroSize; i++) {
				zeroString += "0";
			}
		}
		return zeroString + dbid;
	}

}
