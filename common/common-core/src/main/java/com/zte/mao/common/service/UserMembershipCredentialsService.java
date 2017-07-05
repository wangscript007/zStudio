package com.zte.mao.common.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.base.OrmQueryCondition;
import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.common.response.DataResponse;
import com.zte.mao.common.session.SessionManager;
//import com.zte.ums.bcp.orm.tabledata.dao.GeneralMapper;
import org.apache.log4j.Logger;

@Service
public class UserMembershipCredentialsService {
	private static final Logger dmsg = Logger.getLogger(UserMembershipCredentialsService.class.getName());
	@Resource
	private OrmDao ormDao;
	
	@Resource
	private SessionManager sessionManager;
	
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
			dmsg.error(e.getMessage());
			return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
		}
	}
}
