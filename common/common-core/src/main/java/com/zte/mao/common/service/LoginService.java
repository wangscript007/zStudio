package com.zte.mao.common.service;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.base.OrmQueryCondition;
import com.zte.mao.common.entity.CommonConst;
import com.zte.mao.common.entity.UserSimpleEntity;
import com.zte.mao.common.exception.MaoCommonException;

@Service
public class LoginService {
	@Resource
	CommonEnvService envService;
	
	@Resource 
	private OrmDao ormDao;

	/**
	 * 登陆，返回Entity实例
	 * 
	 * @param loginName
	 * @param password
	 * @return
	 * @throws Exception 
	 */
	public UserSimpleEntity login(String loginName, String password) throws Exception {
		List<OrmQueryCondition> conditions = OrmQueryCondition.getConditions();
		conditions.add(OrmQueryCondition.generatorCondition().setCname("LOGIN_NAME").setValue(loginName));
		conditions.add(OrmQueryCondition.generatorCondition().setCname("PASSWORD").setValue(password));
		List<Map<String, String>> data = ormDao.getData("USER", "TENANT_ID,LOGIN_NAME,PASSWORD,MOBILE,EMAIL".split(","), conditions, OrmDao.OPERATOR_AND, null);
		
		if (data.size() == 0) {
			// 如果使用租户名登录，这个时候需要提示用户使用说明登录
			List<OrmQueryCondition> tenantConditions = OrmQueryCondition.getConditions();
			if (loginName.indexOf("@") > -1) {
				throw new MaoCommonException("用户名或者密码错误，请检查后重新登录");
			}

			tenantConditions.add(OrmQueryCondition.generatorCondition().setCname("NAME").setValue(loginName));
			List<Map<String, String>> result = ormDao.getData("TENANT", new String[] { "id" }, tenantConditions, OrmDao.OPERATOR_AND, null);
			if (!result.isEmpty()) {
				throw new MaoCommonException("请使用正确的登录名admin@" + loginName + "登录");
			} else {
				throw new MaoCommonException("请先注册项目后才能登录使用系统");
			}
		}
		
		Map<String, String> map = data.get(0);
		long tenantId = Long.parseLong(map.get("TENANT_ID"));
		boolean isDemoTenant = isDemoTenant(tenantId);
		return new UserSimpleEntity(tenantId, map.get("LOGIN_NAME"), map.get("EMAIL"), map.get("MOBILE"), isDemoTenant);
	}
	
	private boolean isDemoTenant(long tenantId) throws MaoCommonException {
		List<OrmQueryCondition> tenantConditions = OrmQueryCondition.getConditions();
		tenantConditions.add(OrmQueryCondition.generatorCondition().setCname("ID").setValue(String.valueOf(tenantId)));
		List<Map<String, String>> result = ormDao.getData("TENANT", new String[] { "ID", "TYPE" }, tenantConditions, OrmDao.OPERATOR_AND, null);
		
		if (result.isEmpty()) {
			throw new MaoCommonException("用户名或者密码错误，请检查后重新登录");
		}
		
		Map<String, String> map = result.get(0);
		int type = Integer.parseInt(map.get("TYPE"));
		return type == CommonConst.TENANT_TYPE_DEMO;
	}
}
