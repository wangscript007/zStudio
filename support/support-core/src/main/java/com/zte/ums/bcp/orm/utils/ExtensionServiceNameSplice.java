package com.zte.ums.bcp.orm.utils;

import javax.annotation.Resource;

import org.springframework.stereotype.Component;

@Component
public class ExtensionServiceNameSplice {

	@Resource
	private SpringContextUtils springContextUtils;
	
	/**
	 * 获取扩展点接口的拼接串
	 * @param databaseName
	 * @param tableName
	 * @param flag
	 * @return
	 */
	public String getTableNameExtensionService(String databaseName, String tableName, String dmlType, String type) {
		StringBuilder extensionService = new StringBuilder();
		String newDatabaseName = "";
		String newTableName = "";
		if (!databaseName.isEmpty() && !"".equals(databaseName)) {
			newDatabaseName = databaseName.substring(0, 1).toUpperCase() + databaseName.substring(1);
		}
		if (!tableName.isEmpty() && !"".equals(tableName)) {
			newTableName = tableName.substring(0, 1).toUpperCase() + tableName.substring(1);
		}
		
		extensionService.append(type);
        if ("add".equals(dmlType)) {
        	extensionService.append("InsertRec");
        } else if ("update".equals(dmlType)) {
        	extensionService.append("UpdateRec");
        } else if ("delete".equals(dmlType)) {
        	extensionService.append("DeleteRec");
        } else if ("query".equals(dmlType)) {
        	extensionService.append("QueryRec");
        }
        extensionService.append(newDatabaseName).append(newTableName).append("ExtensionService");
		return extensionService.toString();
	}
}
