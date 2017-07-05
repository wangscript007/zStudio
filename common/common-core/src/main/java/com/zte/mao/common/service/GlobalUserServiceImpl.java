package com.zte.mao.common.service;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.base.OrmQueryCondition;
import com.zte.mao.common.config.ConfigManage;
import com.zte.mao.common.entity.CommonConst;
import com.zte.mao.common.entity.UserEntity;

import org.apache.log4j.Logger;

@Service
public class GlobalUserServiceImpl implements UserService {
    private static Logger logger = Logger.getLogger(
            GlobalUserServiceImpl.class.getName());
    @Resource
    private CommonEnvService commService;
    
    @Resource
    private OrmDao ormDao;
    
    private String platformType = ConfigManage.getInstance().getPlatformType();

    @Override
    public void add(UserEntity user) throws Exception {
        if (user == null) {
            logger.error("error:user add failure,entity is null !");
            throw new Exception("User add failure,entity is null !");
        }
        Map<String, String> data = new HashMap<String, String>();
        DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Timestamp time = new Timestamp(System.currentTimeMillis());
		String regist_time = sdf.format(time);
		data.put("TENANT_ID", user.getTenant_id());
		data.put("LOGIN_NAME", user.getLogin_name());
		data.put("PASSWORD", user.getPassword());
		data.put("MOBILE", user.getMobile());
		data.put("EMAIL", user.getEmail());
		//data.put("SUB_COMPANY_ID", String.valueOf(user.getSub_company_id()));
		data.put("REGIST_TIME", regist_time);
        ormDao.add("USER", data, null);
        if(platformType.equals(CommonConst.PLATFORM_TYPE_DESIGN)) {
        	ormDao.setPlatformType(CommonConst.PLATFORM_TYPE_MOCK).add("USER", data, null);
        }
    }

    @Override
    public void update(UserEntity user) throws Exception {
        if (user == null) {
            throw new Exception("error:user entity is null!");
        }
        Map<String, String> data = new HashMap<String, String>();
        DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Timestamp time = new Timestamp(System.currentTimeMillis());
		String regist_time = sdf.format(time);
		data.put("PASSWORD", user.getPassword());
		data.put("MOBILE", user.getMobile());
		data.put("EMAIL", user.getEmail());
		//data.put("SUB_COMPANY_ID", String.valueOf(user.getSub_company_id()));
		data.put("REGIST_TIME", regist_time);
		List<OrmQueryCondition> conditions = OrmQueryCondition.getConditions();
		conditions.add(OrmQueryCondition.generatorCondition().setCname("TENANT_ID").setValue(user.getTenant_id()));
		conditions.add(OrmQueryCondition.generatorCondition().setCname("LOGIN_NAME").setValue(user.getLogin_name()));
		ormDao.update("USER", data, conditions , OrmDao.OPERATOR_AND, null);
		if(platformType.equals(CommonConst.PLATFORM_TYPE_DESIGN)) {
        	ormDao.setPlatformType(CommonConst.PLATFORM_TYPE_MOCK).update("USER", data, conditions , OrmDao.OPERATOR_AND, null);
        }
    }

    @Override
    public void delete(String tenantId, String login_name) throws Exception {
        if (login_name == null || login_name.isEmpty()) {
            throw new Exception("error:login_name is null!");
        }
        ormDao.delete("USER", OrmQueryCondition.generatorCondition().setCname("LOGIN_NAME").setValue(login_name), null);
        if(platformType.equals(CommonConst.PLATFORM_TYPE_DESIGN)) {
        	ormDao.setPlatformType(CommonConst.PLATFORM_TYPE_MOCK).delete("USER", OrmQueryCondition.generatorCondition().setCname("LOGIN_NAME").setValue(login_name), null);
        }
    }

	@Override
    public List<UserEntity> getUsers(String tenantId, String login_name) throws Exception {
        List<OrmQueryCondition> conditions = OrmQueryCondition.getConditions();
        if(tenantId !=null && !tenantId.isEmpty()){
        	conditions.add(OrmQueryCondition.generatorCondition().setCname("TENANT_ID").setValue(tenantId));
        }
        if (login_name != null && !login_name.isEmpty()) {
        	conditions.add(OrmQueryCondition.generatorCondition().setCname("LOGIN_NAME").setCompare(OrmQueryCondition.COMPARE_LIKE).setValue("'%" + login_name + "%'"));
        }
        String[] columns = "TENANT_ID,lOGIN_NAME,PASSWORD,EMAIL,MOBILE".split(",");
        List<Map<String, String>> list = ormDao.getData("USER", columns, conditions, OrmDao.OPERATOR_AND, null);
        List<UserEntity> users = new ArrayList<UserEntity>();
		if(list.size() > 0) {
			for(int i=0;i<list.size();i++){
				Map<String, String> rs = list.get(i);
				UserEntity user = new UserEntity();
                user.setEmail(rs.get("EMAIL"));
                user.setLogin_name(rs.get("lOGIN_NAME"));
                user.setMobile(rs.get("MOBILE"));
                user.setTenant_id(rs.get("TENANT_ID"));
                user.setPassword(rs.get("PASSWORD"));
                users.add(user);
			}
		}
        return users;
    }

	@Override
	public boolean isUserExist(String tenantId, String login_name)
			throws Exception {
		// TODO Auto-generated method stub
		return false;
	}


}
