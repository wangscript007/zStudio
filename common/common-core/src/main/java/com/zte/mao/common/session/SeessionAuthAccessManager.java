package com.zte.mao.common.session;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.zte.mao.common.service.SqlExecuteService;

/**
 * 业务进程功能鉴权
 * @author 10191081
 *
 */
@Service
public class SeessionAuthAccessManager {
	
	@Resource
	private SqlExecuteService sqlExecuteService;

	/**
	 * 判断当前登录用户是否有对当前url的操作权限
	 * @param loginName 
	 * @param tenantId
	 * @param url
	 * @return true有操作权限，false没有操作权限
	 */
	public boolean isAuthOperatorRes(String loginName, Long tenantId, String url) {
		boolean isAuthOperator = true;
		String sql = "SELECT DISOPERATOR_KEYS FROM role WHERE ID = (SELECT ROLE_ID FROM sm_user_table WHERE LOGIN_NAME='" + loginName + "')";
		
		try {
			Map results = sqlExecuteService.executeSQL(sql, SqlExecuteService.OPERATOR_QUERY, String.valueOf(tenantId));
			StringBuilder keyBuilder = new StringBuilder();
			if(sqlExecuteService.getStatus(results).equals(SqlExecuteService.STATUS_SUCCESS)) {
				List list = (List)results.get("rows");
				if(list.size() > 0) {
					
					for(int j = 0;j<list.size();j++){
						Map record = (Map)list.get(j);
						String disoperatorId = record.get("DISOPERATOR_KEYS").toString();
						String[] disoperatorIds = null;
						if (disoperatorId != null) {
							disoperatorIds = disoperatorId.split(",");
							for (int i=0; i<disoperatorIds.length; i++) {
								if (i != (disoperatorIds.length -1)) {
									keyBuilder.append("'").append(disoperatorIds[i]).append("'").append(",");
								} else {
									keyBuilder.append("'").append(disoperatorIds[i]).append("'");
								}
							}
						}
					}
				}
			}
			
			if (null != keyBuilder.toString() && !"".equals(keyBuilder.toString())) { 
				String sqlOperator = "SELECT URL FROM OPERATOR_RES WHERE `KEY` in("+ keyBuilder + ")";
				Map oResults = sqlExecuteService.executeSQL(sqlOperator, SqlExecuteService.OPERATOR_QUERY, String.valueOf(tenantId));
				
				if(sqlExecuteService.getStatus(oResults).equals(SqlExecuteService.STATUS_SUCCESS)) {
					List olist = (List)oResults.get("rows");
					if(olist.size() > 0) {
						for(int i = 0;i<olist.size();i++){
							Map record = (Map)olist.get(i);
							String oUrl = record.get("URL").toString();
							if (url.equals(oUrl)) {  //当前访问url与资源操作表的queryUrl是同一个，表示没有对当前url的操作权限
								isAuthOperator = false;
								return isAuthOperator;
							} else {
								isAuthOperator = true;
							}
						}
					}
				}
				
			} else { //有所有的操作权限
				isAuthOperator = true;
			}
		
		} catch (Exception e) {
			dmsg.error(e.getCause().getLocalizedMessage());
		}
		
		return isAuthOperator;
	}
	
	private static final Logger dmsg = Logger.getLogger(SeessionAuthAccessManager.class.getName());
}
