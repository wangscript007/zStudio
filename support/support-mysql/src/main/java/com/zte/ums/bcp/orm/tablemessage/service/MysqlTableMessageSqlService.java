package com.zte.ums.bcp.orm.tablemessage.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.constant.MultiTableDifinitionTable;
import com.zte.ums.bcp.orm.constant.MultiTableMetadataTable;
import com.zte.ums.bcp.orm.constant.SingleTableDefinitionTable;

@Service(value = "tableMessageSqlService")
public class MysqlTableMessageSqlService extends AbstractTableMessageSqlService {

    @Override
    public String getTableField(String tablename, String dbname) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder = sqlBuilder.append(KEY_SELECT)
                .append(" character_maximum_length, column_type, ")
                .append(" column_name, column_default, column_key, data_type, ")
                .append(" if(is_nullable='NO','0','1')  AS is_nullable, ")
                .append(" data_type AS original_data_type, extra, ")
                .append(" numeric_precision, numeric_scale ")
                .append(KEY_FROM)
                .append(" information_schema.COLUMNS ")
                .append(KEY_WHERE).append(" table_name = '")
                .append(tablename).append("' ").append(KEY_AND)
                .append(" TABLE_SCHEMA ='").append(dbname).append("' ")
                .append(KEY_ORDER_BY).append(" ordinal_position ");
        return sqlBuilder.toString();
    }

    @Override
    public String getMultiField(String resourceid, String dbname) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder = sqlBuilder
                .append(KEY_SELECT)
                .append(" ")
                .append(KEY_DISTINCT)
                .append(" mtmt.resource_column_name column_name,ic.character_maximum_length,ic.data_type ")
                .append(KEY_FROM).append(" ").append(dbname).append(".")
                .append(MultiTableMetadataTable.TABLE_NAME).append(" mtmt ")
                .append(KEY_LEFT_JOIN)
                .append(" information_schema.`COLUMNS` ic ")
                .append(KEY_ON)
                .append(" ic.TABLE_NAME = mtmt.table_name ")
                .append(KEY_AND)
                .append(" ic.COLUMN_NAME = mtmt.table_column_name ")
                .append(KEY_AND)
                .append(" ic.TABLE_SCHEMA = mtmt.DATABASE_NAME ")
                .append(KEY_WHERE).append(" mtmt.resource_id='")
                .append(resourceid).append("' ")
                .append(KEY_ORDER_BY).append(" column_name ");
        return sqlBuilder.toString();
    }

    @Override
    public String getPrimaryKeySql(String tablename, String dbname) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder = sqlBuilder.append(KEY_SELECT)
                .append(" column_name columnName, extra extra ")
                .append(KEY_FROM)
                .append(" INFORMATION_SCHEMA.columns ")
                .append(KEY_WHERE).append(" TABLE_SCHEMA='")
                .append(dbname).append("' ").append(KEY_AND)
                .append(" TABLE_NAME = '").append(tablename).append("' ")
                .append(KEY_AND).append(" COLUMN_KEY = 'PRI'");
        return sqlBuilder.toString();
    }


    @Override
    public String getQueryTableNameSqlFromSystem(List<String> dbnames, boolean existMultiTable) {
        
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder = sqlBuilder.append(KEY_SELECT);
        if (dbnames.size() > 1) {
            sqlBuilder.append(" CONCAT(TABLE_SCHEMA,'.',table_name)");
        }
        sqlBuilder.append(" TABLE_NAME ");
        sqlBuilder.append(KEY_FROM);
        sqlBuilder.append(" information_schema.TABLES ");
        sqlBuilder.append(KEY_WHERE).append(" TABLE_SCHEMA ");
        sqlBuilder.append(KEY_IN);
        sqlBuilder.append(" (");
        for (int i = 0; i < dbnames.size(); i++) {
            if (i != 0) {
                sqlBuilder.append(",");
            }
            sqlBuilder.append("'");
            sqlBuilder.append(dbnames.get(i));
            sqlBuilder.append("'");
        }
        sqlBuilder.append(") ");
        sqlBuilder.append(KEY_AND);
        sqlBuilder.append(" table_name ").append(KEY_NOT_IN);
        sqlBuilder.append(" ('");
        sqlBuilder.append(MultiTableDifinitionTable.TABLE_NAME);
        sqlBuilder.append("', '");
        sqlBuilder.append(MultiTableMetadataTable.TABLE_NAME);
        sqlBuilder.append("', '");
        sqlBuilder.append(SingleTableDefinitionTable.TABLE_NAME);
        sqlBuilder.append("')");
        sqlBuilder.append(" ");
        if (existMultiTable == true) {
            sqlBuilder.append(KEY_UNION);
            sqlBuilder.append(" ");
            sqlBuilder.append(KEY_SELECT);
            sqlBuilder.append(" ");
            sqlBuilder.append("ID TABLE_NAME");
            sqlBuilder.append(" ");
            sqlBuilder.append(KEY_FROM);
            sqlBuilder.append(" ");
            sqlBuilder.append(MultiTableDifinitionTable.TABLE_NAME);
        }
        return sqlBuilder.toString();
    }

    @Override
    public String isExistMultiTable(String dbname) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append(KEY_SELECT)
                  .append(" count(*) ")
                  .append(KEY_FROM)
                  .append(" information_schema.TABLES ")
                  .append(KEY_WHERE)
                  .append(" TABLE_SCHEMA ")
                  .append(" = ")
                  .append("'" + dbname + "'")
                  .append(KEY_AND)
                  .append(" table_name ")
                  .append(KEY_IN)
                  .append(" ( ")
                  .append(" 'multi_table_definition_table' ,")
                  .append(" 'multi_table_metadata_table' ")
                  .append(" ) ");
        return sqlBuilder.toString();
    }

    @Override
    public String getDatabaseName(String databaseName) {
        return databaseName;
    }
}
