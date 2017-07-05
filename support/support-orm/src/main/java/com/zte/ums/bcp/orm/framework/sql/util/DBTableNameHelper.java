package com.zte.ums.bcp.orm.framework.sql.util;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class DBTableNameHelper {
    @Resource(name = "dbHelper")
    private DBHelper dbHelper;

    public String getTableName(String databaseName, String tableName, boolean isMultiTable) {
        if (StringUtils.isBlank(tableName)) {
            return "";
        }
        if (isMultiTable) {
            return tableName;
        }
        if (StringUtils.isBlank(databaseName)) {
            return dbHelper.getTableName(tableName);
        }
        return dbHelper.getDatabaseName(databaseName) + "." + dbHelper.getTableName(tableName);
    }
}
