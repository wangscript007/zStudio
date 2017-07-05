package com.zte.mao.common.service.register;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.zte.mao.common.service.CommonEnvService;
import com.zte.mao.common.service.SqlExecuteService;
import org.apache.log4j.Logger;

@Service
public class TenantIdManager {

	private static final int TENANT_INIT_ID = 10000;

	private static Logger logger = Logger.getLogger(TenantIdManager.class.getName());
	
	private long currentTenantId = TENANT_INIT_ID;
	
	@Resource
	CommonEnvService envService;
	
	@Resource
	private SqlExecuteService sqlExecuteService;

	public TenantIdManager() {
	}
	
	@SuppressWarnings("rawtypes")
	public void initTenantId() {
		String sql = "SELECT MAX(ID) AS MAX_ID FROM TENANT";
		try {
			Map results = sqlExecuteService.executeSQL(sql, SqlExecuteService.OPERATOR_QUERY, null);
			if(sqlExecuteService.getStatus(results).equals(SqlExecuteService.STATUS_SUCCESS)) {
				List list = (List)results.get("rows");
				if(list.size() > 0) {
					Object object = ((Map)list.get(0)).get("MAX_ID");
					if(object != null) {
						String id = object.toString();
						if(StringUtils.isNotBlank(id) 
								&& !id.equals("0")
								&& !id.equals("null")) {
							currentTenantId = Long.parseLong(id.substring(0, id.length()-3));
						}
					}
				}
			}
		}
		catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
	}
	
	public synchronized long getNextTenantId() {
		if(currentTenantId == TENANT_INIT_ID) {
			initTenantId();
		}
		currentTenantId++;
		return currentTenantId;
	}
}
