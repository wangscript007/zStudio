package com.zte.mao.common.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.base.OrmQueryCondition;
import com.zte.mao.common.entity.UserSimpleEntity;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.common.response.DataResponse;
import com.zte.mao.common.session.SessionManager;
import com.zte.mao.common.util.CipherUtil;

@Service("loginMaoUserService")
public class LoginUserService {
    private static Logger logger = Logger.getLogger(LoginUserService.class.getName());
    
    @Resource
    private OrmDao ormDao;
    
    @Resource
    private SessionManager sessionManager;

	private Map<String, String> getUserInfo(String userName,String tenantId) throws MaoCommonException {
        if (StringUtils.isBlank(userName)
        		|| StringUtils.isBlank(tenantId)) {
            return new HashMap<String, String>();
        }
        List<OrmQueryCondition> conditions = new ArrayList<OrmQueryCondition>();
        OrmQueryCondition condition = new OrmQueryCondition();
        condition.setCname("LOGIN_NAME").setValue(userName);
        conditions.add(condition);
		List<Map<String, String>> data = ormDao.getData("SM_USER_TABLE", "USERID,PASSWORD".split(","), conditions , OrmDao.OPERATOR_AND, tenantId);
		if(data.size() > 0) {
			return data.get(0);
		}
		return new HashMap<String, String>();
    }
    
    public CommonResponse getResultMap(HttpServletRequest request) throws Exception {
		UserSimpleEntity user = sessionManager.checkSignin(request);
        Map<String, Object> userMap = new HashMap<String, Object>();
        String loginName = user.getLoginName();
        String tenantId = String.valueOf(user.getTenantId());
        userMap.put("username", loginName);
		userMap.put("tenantId", tenantId);
        Map<String, String> userInfoMap = getUserInfo(loginName,tenantId);
		userMap.put("userid", userInfoMap.get("USERID"));
		userMap.put("password", decryptPassword(loginName,userInfoMap.get("PASSWORD")));
		userMap.put("isDemo", user.isDemo());
        return new DataResponse(userMap);
	}
    
	public CommonResponse getUserMembershipCredentialsService(HttpServletRequest request) {
		try {
			String id = sessionManager.getTenantId(request);
			String name = sessionManager.getLoginName(request);
			String[] columns = "USER_ID,LOGIN_NAME,ROLE_ID,PROJECT_ID,PART_ID,POST_ID,RANK_ID".split(",");
			List<OrmQueryCondition> conditions = new ArrayList<OrmQueryCondition>();
			OrmQueryCondition condition = new OrmQueryCondition();
			condition.setCname("LOGIN_NAME").setValue(name);
			conditions.add(condition);
			List<Map<String, String>> data = ormDao.getData("view_user_membership_credentials", columns, conditions, OrmDao.OPERATOR_AND, id);
			return new DataResponse(data);
			
		} catch (Exception e) {
			logger.error(e.getMessage());
			return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
		}
	}
	/**
	 * 获取数据库用户名密码，通过解码获取原密码字符串
	 * @param password
	 * @return
	 */
	public String decryptPassword(String userName,String password){
		String code = CipherUtil.decrypt(password);
		return code.replaceAll(userName, "");
	}
}
