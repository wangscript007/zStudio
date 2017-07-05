package com.zte.ums.bcp.orm.framework.sql.util;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.Field;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.Function;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.FunctionField;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.IFunctionParameter;
import com.zte.ums.bcp.orm.utils.ConstantUtils;

@Service
public class DBTableFieldHelper {
    @Resource
    private DBTableNameHelper dbTableNameHelper;
    @Resource(name = "dbHelper")
    private DBHelper dbHelper;

    public String getTableFieldSql(Field field) {
        if (field instanceof FunctionField) {
            return getFunctionFieldSql((FunctionField) field);
        }
        String fieldName = dbHelper.getFieldName(field.getName());

        String tableName = dbTableNameHelper.getTableName(field.getDatabaseName(), field.getTableName(), false);
        if (StringUtils.isNotBlank(tableName)) {
            fieldName = tableName + "." + fieldName;
        }
        return fieldName;
    }

    private String getFunctionFieldSql(FunctionField field) {
        Function function = field.getFunction();
        String functionName = function.getName();
        IFunctionParameter[] parameters = function.getParameters();
        String sql = functionName + "(";
        for (IFunctionParameter parameter : parameters) {
            sql += dbHelper.getFieldName(parameter.getValue()) + ",";
        }
        return sql.substring(0, (sql.length() - 1)) + ")";
    }

    public String getTableFieldASFieldName(Field field) {
        String fieldName = field.getName();
        if (field instanceof FunctionField) {
            fieldName = ((FunctionField) field).getFunction().getAlias();
        }
        if (StringUtils.isBlank(fieldName)) {
            return "";
        }
        return dbHelper.getFieldName(getPrefix(field) + fieldName);
    }

    private String getPrefix(Field field) {
        String tableName = field.getTableName();
        if (StringUtils.isBlank(tableName)) {
            return "";
        }
        String prefix = "";
        String databaseName = field.getDatabaseName();
        if (StringUtils.isNotBlank(databaseName)) {
            prefix += databaseName + ConstantUtils.FIELDCONNECTOR;
        }
        prefix += tableName + ConstantUtils.FIELDCONNECTOR;
        return prefix;
    }
}
