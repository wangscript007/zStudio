package com.zte.mao.workbench.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.workbench.entity.model.DataModelItem;

@Service
public class SQLPackageService {
    private static Logger logger = Logger.getLogger(SQLPackageService.class.getName());

    public String packageUseDataBaseSql(String tenantId) throws MaoCommonException {
        if (StringUtils.isBlank(tenantId)) {
            String message = "tenantId is null or empty.";
            logger.error(message);
            throw new MaoCommonException(message);
        }
        StringBuilder useDataBaseSql = new StringBuilder();
        if (StringUtils.isNotBlank(tenantId)) {
            useDataBaseSql.append("use ")
                          .append(packageDatabaseNameSqlFragment(tenantId));
        }
        return useDataBaseSql.toString();
    }
    
    public String getCreateTableSql(List<DataModelItem> dataModelItems, String modelId, String tenantId) throws MaoCommonException {
        if (StringUtils.isBlank(modelId)) {
            String message = "modelId is null or empty.";
            logger.error(message);
            throw new MaoCommonException(message);
        }
        if (CollectionUtils.isEmpty(dataModelItems)) {
            String message = "dataModelItems Collection is null or empty.";
            logger.error(message);
            throw new MaoCommonException(message);
        }
        StringBuilder tableCreateSql = new StringBuilder();
        tableCreateSql.append("CREATE TABLE ")
                      .append(packageTableNameSqlFragment(modelId, tenantId)).append(" (")
                      .append(getCreateSQLColumnInfos(dataModelItems, false))
                      .append(") ENGINE=InnoDB DEFAULT CHARSET=utf8");
        return tableCreateSql.toString();
    }

    public StringBuilder getCreateSQLColumnInfos(List<DataModelItem> dataModelItems, boolean isLineSeparator) {
        StringBuilder tableCreateSql = new StringBuilder();
        List<DataModelItem> keyColumns = new ArrayList<DataModelItem>();
        List<DataModelItem> generalColumns = new ArrayList<DataModelItem>();
        for (int i = 0, len = dataModelItems.size(); i < len; i++) {
            DataModelItem dataModelItem = dataModelItems.get(i);
            if (dataModelItem.getColumnKey() == 1) {
                keyColumns.add(dataModelItem);
            } else {
                generalColumns.add(dataModelItem);
            }
        }
        for (int i = 0, len = generalColumns.size(); i < len; i++) {
            DataModelItem dataModelItem = generalColumns.get(i);
            tableCreateSql.append(getCreateColumnInfo(dataModelItem));
            if (i != len - 1) {
                tableCreateSql.append(",");
                if (isLineSeparator) {
                    tableCreateSql.append(System.getProperty("line.separator"));
                }
            }
        }
        if (CollectionUtils.isNotEmpty(keyColumns)) {
            if (CollectionUtils.isNotEmpty(generalColumns)) {
                tableCreateSql.append(",");
                if (isLineSeparator) {
                    tableCreateSql.append(System.getProperty("line.separator"));
                }
            }
            keyColumns = sortKeyColumns(keyColumns);
            List<String> keys = new ArrayList<String>();
            for (int i = 0, len = keyColumns.size(); i < len; i++) {
                DataModelItem dataModelItem = keyColumns.get(i);
                boolean isAutoIncrement = false;
                if (isIdAndTypeIsBigintOrInt(dataModelItem)) {
                    isAutoIncrement = true;
                }
                tableCreateSql.append(getCreatePrimaryKeyColumnInfo(dataModelItem, isAutoIncrement));
                tableCreateSql.append(",");
                if (isLineSeparator) {
                    tableCreateSql.append(System.getProperty("line.separator"));
                }
                keys.add(dataModelItem.getId());
            }
            tableCreateSql.append("PRIMARY KEY (")
                          .append(packagePrimarykeys(keys))
                          .append(")");
            if (isLineSeparator) {
                tableCreateSql.append(System.getProperty("line.separator"));
            }
        }
        return tableCreateSql;
    }

    public StringBuilder getKeyColumnsCreateTableSql(List<DataModelItem> keyColumns) {
        StringBuilder tableCreateSql = new StringBuilder();
        keyColumns = sortKeyColumns(keyColumns);
        List<String> keys = new ArrayList<String>();
        for (int i = 0, len = keyColumns.size(); i < len; i++) {
            DataModelItem dataModelItem = keyColumns.get(i);
            tableCreateSql.append(",")
                          .append(System.getProperty("line.separator"));
            
            boolean isAutoIncrement = false;
            if (isIdAndTypeIsBigintOrInt(dataModelItem)) {
                isAutoIncrement = true;
            }
            tableCreateSql.append(getCreatePrimaryKeyColumnInfo(dataModelItem, isAutoIncrement));
            keys.add(dataModelItem.getId());
        }
        tableCreateSql.append(",")
                      .append(System.getProperty("line.separator"))
                      .append("PRIMARY KEY (")
                      .append(packagePrimarykeys(keys))
                      .append(")")
                      .append(System.getProperty("line.separator"));
        return tableCreateSql;
    }

    private List<DataModelItem> sortKeyColumns(List<DataModelItem> keyColumns) {
        List<DataModelItem> newKeyColumns = new ArrayList<DataModelItem>();
        for (int i = 0; i < keyColumns.size(); i++) {
            DataModelItem dataModelItem = keyColumns.get(i);
            if (isIdAndTypeIsBigintOrInt(dataModelItem)) {
                newKeyColumns.add(dataModelItem);
                keyColumns.remove(i);
            }
        }
        
        for (DataModelItem dataModelItem: keyColumns) {
            newKeyColumns.add(dataModelItem);
        }
        
        return newKeyColumns;
    }
    
    private boolean isIdAndTypeIsBigintOrInt(DataModelItem dataModelItem) {
        String id = "id";
        if ((id.equals(dataModelItem.getId()) || id.toUpperCase().equals(dataModelItem.getId()))
                && (dataModelItem.getType() == DataModelItem.ENUM_TYPE_BIGINT || dataModelItem.getType() == DataModelItem.ENUM_TYPE_INTERGE)) {
            return true;
        }
        return false;
    }
    
    public StringBuilder getCreateColumnInfo(DataModelItem dataModelItem) {
        StringBuilder tableCreateSql = getCreateColumnBaseInfo(dataModelItem);
        tableCreateSql.append(packageTableColumnDefaultSqlFragment(dataModelItem));
        return tableCreateSql;
    }
    
    public StringBuilder getCreateColumnBaseInfo(DataModelItem dataModelItem) {
        StringBuilder tableCreateSql = new StringBuilder();
        tableCreateSql.append(packageColumnNameSqlFragment(dataModelItem.getId())
                      .append(" ")
                      .append(getColumnType(dataModelItem.getType(), dataModelItem.getLenth(), dataModelItem.getDecimal())))
                      .append(" ");
        return tableCreateSql;
    }
    
    public StringBuilder getCreatePrimaryKeyColumnInfo(DataModelItem dataModelItem, boolean isAutoIncrement) {
        StringBuilder tableCreateSql = getCreateColumnBaseInfo(dataModelItem);
        tableCreateSql.append(packageTablePrimaryKeyColumnDefaultSqlFragment(dataModelItem, isAutoIncrement));
        return tableCreateSql;
    }
    
    private StringBuilder packageTablePrimaryKeyColumnDefaultSqlFragment(DataModelItem dataModelItem, boolean isAutoIncrement) {
        if (isAutoIncrement) {
            return new StringBuilder("NOT NULL AUTO_INCREMENT");
        }
        return new StringBuilder("NOT NULL");
    }
    
    private StringBuilder packageTableColumnDefaultSqlFragment(DataModelItem dataModelItem) {
        if (StringUtils.isNotBlank(dataModelItem.getDefaultValue()) && !"null".equals(dataModelItem.getDefaultValue())) {
            StringBuilder tableCreateSql = new StringBuilder();
            tableCreateSql.append("DEFAULT ").append(packageValueSqlFragment(dataModelItem.getDefaultValue()));
            return tableCreateSql;
        }
        if (dataModelItem.isNull()) {
            return new StringBuilder("DEFAULT NULL");
        }
        return new StringBuilder("NOT NULL");
    }
    
    public StringBuilder packageColumnNameSqlFragment(String columnName) {
        StringBuilder columnSqlFragment = new StringBuilder();
        columnSqlFragment.append("`")
                         .append(columnName)
                         .append("`");
        return columnSqlFragment;
    }
    
    public StringBuilder packageColumnNameSqlFragment(String tableName, String columnName) {
        if (StringUtils.isBlank(tableName)) {
            return packageColumnNameSqlFragment(columnName);
        }
        StringBuilder columnSqlFragment = new StringBuilder();
        columnSqlFragment.append(packageTableNameSqlFragment(tableName))
                         .append(".")
                         .append(packageColumnNameSqlFragment(columnName));
        return columnSqlFragment;
    }
    
    public StringBuilder packageTableNameSqlFragment(String tableName, String tenantId) {
        if (StringUtils.isBlank(tenantId)) {
            return packageTableNameSqlFragment(tableName);
        }
        
        StringBuilder columnSqlFragment = new StringBuilder();
        columnSqlFragment.append(packageDatabaseNameSqlFragment(tenantId))
                         .append(".")
                         .append(packageTableNameSqlFragment(tableName));
        return columnSqlFragment;
        
    }

    public StringBuilder packageTableNameSqlFragment(String tableName) {
        StringBuilder columnSqlFragment = new StringBuilder();
        columnSqlFragment.append("`")
                         .append(tableName)
                         .append("`");
        return columnSqlFragment;
    }
    
    private String packageDatabaseNameSqlFragment(String tenantId) {
        StringBuilder databaseNameSqlFragment = new StringBuilder();
        if (StringUtils.isNotBlank(tenantId)) {
            databaseNameSqlFragment.append("`")
                             .append("d_tenant_")
                             .append(tenantId)
                             .append("`");
        }
        return databaseNameSqlFragment.toString();
    }
    
    private StringBuilder packageValueSqlFragment(String value) {
        StringBuilder valueSqlFragment = new StringBuilder();
        valueSqlFragment.append("'");
        if (StringUtils.isNotBlank(value)) {
            valueSqlFragment.append(value.replace("'", "''"));
        }
        valueSqlFragment.append("'");
        return valueSqlFragment;
    }
    
    public String packageDropTableSql(String tableName, String tenantId) {
        StringBuilder deleteSqlFragment = new StringBuilder();
        deleteSqlFragment.append("DROP TABLE IF EXISTS ")
                         .append(packageTableNameSqlFragment(tableName, tenantId));
        return deleteSqlFragment.toString();
    }
    
    public String packageDropViewSql(String tableName, String tenantId) {
        StringBuilder deleteSqlFragment = new StringBuilder();
        deleteSqlFragment.append("DROP VIEW IF EXISTS ")
                         .append(packageTableNameSqlFragment(tableName, tenantId));
        return deleteSqlFragment.toString();
    }
    
    public StringBuilder packagePrimarykeys(List<String> keys) {
        StringBuilder keysBuilder = new StringBuilder();
        if (CollectionUtils.isNotEmpty(keys)) {
            int len = keys.size() - 1;
            for (int i = 0; i < len; i++) {
                keysBuilder.append(packageColumnNameSqlFragment(keys.get(i)))
                           .append(",");
            }
            keysBuilder.append(packageColumnNameSqlFragment(keys.get(len)));
        }
        return keysBuilder;
    }
    
    private StringBuilder getColumnType(int type, int columnLength, int decimal) {
        if (type == DataModelItem.ENUM_TYPE_STRING) {
            StringBuilder columnType = new StringBuilder();
            columnType.append("varchar(")
                .append(columnLength)
                .append(")");
            return columnType;
        }
        if (type == DataModelItem.ENUM_TYPE_LONG_STRING) {
            StringBuilder columnType = new StringBuilder();
            columnType.append("varchar(")
                .append(columnLength)
                .append(")");
            return columnType;
        }
        if (type == DataModelItem.ENUM_TYPE_BOOLEAN) {
            StringBuilder columnType = new StringBuilder();
            columnType.append("int(")
                .append(columnLength)
                .append(")");
            return columnType;
        }
        if (type == DataModelItem.ENUM_TYPE_INTERGE) {
            StringBuilder columnType = new StringBuilder();
            columnType.append("int(")
                .append(columnLength)
                .append(")");
            return columnType;
        }
        if (type == DataModelItem.ENUM_TYPE_FLOAT) {
            StringBuilder columnType = new StringBuilder();
            columnType.append("float(")
                .append(columnLength)
                .append(",")
                .append(decimal)
                .append(")");
            return columnType;
        }
        if (type == DataModelItem.ENUM_TYPE_BIGINT) {
            StringBuilder columnType = new StringBuilder();
            columnType.append("bigint(")
                .append(columnLength)
                .append(")");
            return columnType;
        }
        if (type == DataModelItem.ENUM_TYPE_DOUBLE) {
            StringBuilder columnType = new StringBuilder();
            columnType.append("double(")
                .append(columnLength)
                .append(",")
                .append(decimal)
                .append(")");
            return columnType;
        }
        return new StringBuilder("datetime");
    }
}
