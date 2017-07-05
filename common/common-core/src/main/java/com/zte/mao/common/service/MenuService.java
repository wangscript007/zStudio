package com.zte.mao.common.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.base.OrmQueryCondition;
import com.zte.mao.common.entity.CommonConst;
import com.zte.mao.common.entity.MenuEntity;
import com.zte.mao.common.exception.MaoCommonException;

import org.apache.log4j.Logger;

@Service
public class MenuService {
    private static Logger logger = Logger.getLogger(MenuService.class.getName());
    
    @Resource
    private SqlExecuteService sqlExecuteService;
    
	@Resource
	private OrmDao ormDao;
    
    private String menuTbname = "TENANT_MENU";
    
    

    public String getMenuTbname() {
		return menuTbname;
	}



	public void setMenuTbname(String menuTbname) {
		this.menuTbname = menuTbname;
	}
	
	public void setSqlExecuteService(SqlExecuteService sqlExecuteService) {
		this.sqlExecuteService = sqlExecuteService;
	}

	/**
     * 获取租户菜单
     * 
     * @param tenantId
     * @return
     * @throws Exception
     */
    @SuppressWarnings("rawtypes")
	public List<MenuEntity> getMenu(String tenantId, String loginName) throws Exception {
        List<MenuEntity> resultObj = new ArrayList<MenuEntity>();
        String sql = "SELECT `KEY`,NAME,PARENT_KEY,URL,`ORDER` FROM "+menuTbname+" WHERE STATUS = 1";
        sql += " ORDER BY `ORDER`";
        
        try {
        	Map results = sqlExecuteService.executeSQL(sql, SqlExecuteService.OPERATOR_QUERY, tenantId);
			if(sqlExecuteService.getStatus(results).equals(SqlExecuteService.STATUS_SUCCESS)) {
				List list = (List)results.get("rows");
				List<Map<String, String>> disOperatorKeys = getUserDisOperatorKeys(
						loginName, tenantId);
				if(list.size() > 0) {
					for(int i=0;i<list.size();i++){
						Map record = (Map) list.get(i);
						String key = record.get("KEY").toString();
						if (isOperatorDisabled(disOperatorKeys, key)) {
							continue;
						}
						MenuEntity me = new MenuEntity();
		                me.setKey(record.get("KEY").toString());
		                me.setName(record.get("NAME").toString());
		                Object parent = record.get("PARENT_KEY");
		                String parentKey = "";
						if(parent != null) {
							parentKey = parent.toString();
		                }
		                me.setParent_key(parentKey);
		                me.setUrl(record.get("URL").toString());
		                me.setOrder((Integer)record.get("ORDER"));
		                resultObj.add(me);
					}
				}
			}

        } catch (SQLException e) {
            logger.error(e.getMessage(), e);
            throw e;
        } 
        return resultObj;
    }
    
	/**
	 * 查询用户禁用权限
	 * 
	 * @param loginName
	 * @param tenantId
	 * @return
	 * @throws MaoCommonException
	 */
	public List<Map<String, String>> getUserDisOperatorKeys(String loginName,
			String tenantId) throws MaoCommonException {
		String[] columns = new String[] { "DISOPERATOR_KEYS" };

		List<OrmQueryCondition> conditions = new ArrayList<OrmQueryCondition>();
		OrmQueryCondition name = new OrmQueryCondition();
		name.setCname("LOGIN_NAME");
		name.setCompare("=");
		name.setValue(loginName);
		conditions.add(name);

		return ormDao.getData("view_user_role", columns, conditions, "and",
				tenantId);
	}
	
	/**
	 * 
	 * @param disOperatorKeyList
	 * @param key
	 * @return
	 */
	public boolean isOperatorDisabled(
			List<Map<String, String>> disOperatorKeyList, String key) {
		if (disOperatorKeyList == null || disOperatorKeyList.isEmpty()) {
			return false;
		}

		boolean hasKey = true;
		for (Map<String, String> operator : disOperatorKeyList) {
			if (!(operator.get("DISOPERATOR_KEYS") + ",").contains(key + ",")) {
				hasKey = false;
				break;
			}
		}

		return hasKey;
	}
}
