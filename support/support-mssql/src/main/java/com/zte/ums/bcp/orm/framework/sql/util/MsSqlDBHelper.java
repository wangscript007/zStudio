package com.zte.ums.bcp.orm.framework.sql.util;

import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.framework.sql.keyword.MsSqlKeyword;

@Service(value = "dbHelper")
public class MsSqlDBHelper extends DBHelper {
    @Override
    public String getFieldName(String fieldName) {
        return fieldName;
    }

    @Override
    public String getDatabaseName(String databaseName) {
        return databaseName + "." + MsSqlKeyword.KEY_DBO;
    }

    @Override
    public String getTableName(String tableName) {
        return tableName;
    }
}
