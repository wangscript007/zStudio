package com.zte.mao.common.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.base.OrmQueryCondition;
import com.zte.mao.common.base.OrmQueryOrder;
import com.zte.mao.common.config.ConfigManage;
import com.zte.mao.common.entity.CommonConst;
import com.zte.mao.common.entity.UserEntity;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.util.CipherUtil;

@Service
public class TenantUserServiceImpl implements UserService {

	private static Logger logger = Logger.getLogger(TenantUserServiceImpl.class
			.getName());

	@Resource
	private OrmDao ormDao;

	private String platformType = ConfigManage.getInstance().getPlatformType();

	@Override
	public void add(UserEntity user) throws Exception {
		if (user == null) {
			logger.error("error:User add failure,entity is null !");
			throw new Exception("User add failure,entity is null !");
		}

		Map<String, String> data = new HashMap<String, String>();
		data.put("TENANT_ID", user.getTenant_id());
		data.put("LOGIN_NAME", user.getLogin_name());
		data.put("PASSWORD", user.getPassword());
		data.put("MOBILE", user.getMobile());
		data.put("EMAIL", user.getEmail());
		data.put("ROLE_ID", String.valueOf(user.getRole_id()));
		data.put("GENDER", user.getGender());
		data.put("BIRTH_DATE", user.getBirth_date());
		data.put("PICTURE", user.getPicture());
		data.put("REAL_NAME", user.getReal_name());
		data.put("NICK_NAME", user.getNick_name());
		data.put("TAG", user.getTag());
		data.put("STATUS", String.valueOf(user.getStatus()));
		data.put("SIGNATURE", user.getSignature());
		data.put("DESCRIPTION", user.getDescription());
		data.put("USERNAME", user.getLogin_name());
		data.put("FULLNAME", user.getFullname());

		ormDao.add("SM_USER_TABLE", data, user.getTenant_id());
		if (platformType.equals(CommonConst.PLATFORM_TYPE_DESIGN)) {
			ormDao.setPlatformType(CommonConst.PLATFORM_TYPE_MOCK).add(
					"SM_USER_TABLE", data, user.getTenant_id());
		}
	}

	@Override
	public void update(UserEntity user) throws Exception {
		if (user == null) {
			throw new Exception("error:User entity is null!");
		}

		List<OrmQueryCondition> conditions = new ArrayList<OrmQueryCondition>();

		OrmQueryCondition tenant = new OrmQueryCondition();
		tenant.setCname("TENANT_ID");
		tenant.setCompare("=");
		tenant.setValue(user.getTenant_id());
		conditions.add(tenant);

		OrmQueryCondition cname = new OrmQueryCondition();
		cname.setCname("LOGIN_NAME");
		cname.setCompare(OrmQueryCondition.COMPARE_EQUALS);
		cname.setValue(user.getLogin_name());
		conditions.add(cname);

		Map<String, String> data = new HashMap<String, String>();
		data.put("TENANT_ID", user.getTenant_id());
		data.put("LOGIN_NAME", user.getLogin_name());
		data.put("PASSWORD", user.getPassword());
		data.put("MOBILE", user.getMobile());
		data.put("EMAIL", user.getEmail());
		data.put("ROLE_ID", String.valueOf(user.getRole_id()));
		data.put("GENDER", user.getGender());
		data.put("BIRTH_DATE", user.getBirth_date());
		data.put("PICTURE", user.getPicture());
		data.put("REAL_NAME", user.getReal_name());
		data.put("NICK_NAME", user.getNick_name());
		data.put("TAG", user.getTag());
		data.put("STATUS", String.valueOf(user.getStatus()));
		data.put("SIGNATURE", user.getSignature());
		data.put("DESCRIPTION", user.getDescription());
		data.put("USERNAME", user.getLogin_name());
		data.put("FULLNAME", user.getFullname());

		ormDao.update("SM_USER_TABLE", data, conditions, "and",
				user.getTenant_id());
	}

	@Override
	public void delete(String tenantId, String loginName) throws Exception {
		if (loginName == null || loginName.isEmpty()) {
			throw new Exception("error:login_name is null!");
		}
		ormDao.delete("SM_USER_TABLE", OrmQueryCondition.generatorCondition()
				.setCname("LOGIN_NAME").setValue(loginName), tenantId);
	}

	@Override
    public List<UserEntity> getUsers(String tenantId, String loginName) throws SQLException, MaoCommonException {
        List<Map<String, String>> data = queryUserList(tenantId, loginName);
        List<UserEntity> users = new ArrayList<UserEntity>();
        for (Map<String, String> record : data) {
            UserEntity user = new UserEntity();
            user = getUser(user, record);
            users.add(user);
        }

        return users;
    }
	
    public List<UserEntity> getFilterUsers(String tenantId, String loginName) throws SQLException, MaoCommonException {
        List<Map<String, String>> data = queryUserList(tenantId, loginName);
        List<UserEntity> users = new ArrayList<UserEntity>();
        for (Map<String, String> record : data) {
            String login_name = record.get("LOGIN_NAME");
            String[] splitNames = login_name.split("@");
            if (splitNames[0].contains(loginName)) {
                UserEntity user = new UserEntity();
                user = getUser(user, record);
                users.add(user);
            }
        }

        return users;
    }

	@Override
	public boolean isUserExist(String tenantId, String loginName)
			throws Exception {
		String[] columns = new String[] { "EMAIL" };
		List<OrmQueryCondition> conditions = OrmQueryCondition.getConditions();
		conditions.add(OrmQueryCondition.generatorCondition().setCname("TENANT_ID").setValue(tenantId));
		conditions.add(OrmQueryCondition.generatorCondition().setCname("LOGIN_NAME").setValue(loginName));
		List<Map<String, String>> data = ormDao.getData("SM_USER_TABLE",
				columns, conditions, OrmDao.OPERATOR_AND, tenantId);
		if (data != null && data.size() > 0) {
			return true;
		}
		return false;
	}
	
    private List<Map<String, String>> queryUserList(String tenantId, String loginName) throws MaoCommonException {
        String[] columns = new String[] { "EMAIL", "LOGIN_NAME", "MOBILE", "TENANT_ID", "PASSWORD", "ROLE_ID",
                "GENDER", "BIRTH_DATE", "PICTURE", "REAL_NAME", "NICK_NAME", "TAG", "STATUS", "CREATE_TIME",
                "MODIFY_TIME", "SIGNATURE", "DESCRIPTION", "USERNAME", "FULLNAME" };

        List<OrmQueryCondition> conditions = new ArrayList<OrmQueryCondition>();

        OrmQueryCondition tenant = new OrmQueryCondition();
        tenant.setCname("TENANT_ID");
        tenant.setCompare("=");
        tenant.setValue(tenantId);
        conditions.add(tenant);

        if (loginName != null && !loginName.isEmpty()) {
            OrmQueryCondition cname = new OrmQueryCondition();
            cname.setCname("LOGIN_NAME");
            loginName = loginName.replaceAll("'", "''");
            cname.setCompare(OrmQueryCondition.COMPARE_LIKE);
            cname.setValue("%" + loginName + "%");
            conditions.add(cname);
        }

        List<OrmQueryOrder> orders = new ArrayList<OrmQueryOrder>();
        orders.add(new OrmQueryOrder("CREATE_TIME", OrmQueryOrder.ORDER_DESC));
        List<Map<String, String>> data = ormDao.getData("SM_USER_TABLE", columns, conditions, OrmDao.OPERATOR_AND,
                orders, tenantId);

        return data;
    }
	
	private UserEntity getUser(UserEntity user, Map<String, String> record) {
	    user.setEmail(record.get("EMAIL"));
        user.setLogin_name(record.get("LOGIN_NAME"));
        user.setMobile(record.get("MOBILE"));
        user.setTenant_id(record.get("TENANT_ID"));
        String password = CipherUtil.decrypt(record.get("PASSWORD"));
        if (password != null && !password.isEmpty()) {
            if (password.length() > user.getLogin_name().length()) {
                password = password.substring(password.indexOf(user
                        .getLogin_name()) + user.getLogin_name().length());
            }
        }
        user.setPassword(CipherUtil.encrypt(password));
        if (!StringUtils.isEmpty(record.get("ROLE_ID"))
                && !record.get("ROLE_ID").equalsIgnoreCase("null")) {
            user.setRole_id(Integer.parseInt(record.get("ROLE_ID")));
        }
        user.setGender(record.get("GENDER"));
        user.setBirth_date(record.get("BIRTH_DATE"));
        user.setPicture(record.get("PICTURE"));
        user.setReal_name(record.get("REAL_NAME"));
        user.setNick_name(record.get("NICK_NAME"));
        user.setTag(record.get("TAG"));
        if (!StringUtils.isEmpty(record.get("STATUS"))
                && !record.get("STATUS").equalsIgnoreCase("null")) {
            user.setStatus(Integer.parseInt(record.get("STATUS")));
        }
        user.setCreate_time(record.get("CREATE_TIME"));
        user.setModify_time(record.get("MODIFY_TIME"));
        user.setSignature(record.get("SIGNATURE"));
        user.setDescription(record.get("DESCRIPTION"));
        user.setUsername(record.get("USERNAME"));
        user.setFullname(record.get("FULLNAME")); 
        
        return user;
	}
}
