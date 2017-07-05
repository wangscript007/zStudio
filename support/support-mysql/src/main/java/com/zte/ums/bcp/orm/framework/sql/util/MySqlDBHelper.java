package com.zte.ums.bcp.orm.framework.sql.util;

import org.springframework.stereotype.Service;

@Service(value = "dbHelper")
public class MySqlDBHelper extends DBHelper {
    @Override
    public String getDatabaseName(String databaseName) {
        return "`" + databaseName + "`";
    }

    @Override
    public String getTableName(String tableName) {
        return "`" + tableName + "`";
    }

    @Override
    public String getFieldName(String fieldName) {
        return "`" + fieldName + "`";
    }
}
