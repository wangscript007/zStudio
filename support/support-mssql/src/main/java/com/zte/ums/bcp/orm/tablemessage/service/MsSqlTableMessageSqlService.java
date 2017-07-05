package com.zte.ums.bcp.orm.tablemessage.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.constant.MultiTableDifinitionTable;
import com.zte.ums.bcp.orm.constant.MultiTableMetadataTable;
import com.zte.ums.bcp.orm.constant.SingleTableDefinitionTable;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.sql.keyword.MsSqlKeyword;
import com.zte.ums.bcp.orm.framework.systemproperty.service.DatabasePropertyService;
import com.zte.ums.bcp.orm.tabledata.dao.GeneralMapper;
import com.zte.ums.bcp.orm.utils.ConstantUtils;

@Service(value = "tableMessageSqlService")
public class MsSqlTableMessageSqlService extends AbstractTableMessageSqlService {
    @Resource
    private GeneralMapper generalMapper;
    @Resource
    private DatabasePropertyService databasePropertyService;

    @Override
    public String getTableField(String tablename, String dbname) {
        StringBuilder sqlBuilder = new StringBuilder();
        if (StringUtils.isNotBlank(dbname.trim())) {
            sqlBuilder.append(KEY_SELECT);
            sqlBuilder.append(" uSysColumns.name AS column_name,");
            sqlBuilder.append(" uSysColumns.length AS character_maximum_length,");
            sqlBuilder.append(" usystypes.name AS data_type ");
            sqlBuilder.append(KEY_FROM);
            sqlBuilder.append(" ");
            sqlBuilder.append(dbname);
            sqlBuilder.append("..SysObjects uSysObjects ");
            sqlBuilder.append(KEY_LEFT_JOIN);
            sqlBuilder.append(" ");
            sqlBuilder.append(dbname);
            sqlBuilder.append("..SysColumns uSysColumns ON uSysObjects.id = uSysColumns.id ");
            sqlBuilder.append(KEY_LEFT_JOIN);
            sqlBuilder.append(" systypes usystypes ON usystypes.xusertype = uSysColumns.xusertype ");
            sqlBuilder.append(KEY_WHERE);
            sqlBuilder.append(" uSysObjects.XType in ('u','v') ");
            sqlBuilder.append(KEY_AND);
            sqlBuilder.append(" uSysObjects.name='");
            sqlBuilder.append(tablename);
            sqlBuilder.append("' ");
            sqlBuilder.append(KEY_ORDER_BY);
            sqlBuilder.append(" uSysColumns.name");
        }
        
        return sqlBuilder.toString();
    }

    @Override
    public String getMultiField(String resourceid, String dbname) throws OrmException {
        StringBuilder stringSqlBuilder = new StringBuilder();
        if (StringUtils.isNotBlank(resourceid)
                && StringUtils.isNotBlank(dbname)) {
            StringBuilder sql = new StringBuilder();
            sql.append(KEY_SELECT);
            sql.append(" ");
            sql.append(KEY_DISTINCT);
            sql.append(" metadatatable.DATABASE_NAME AS DATABASE_NAME,");
            sql.append(" metadatatable.TABLE_NAME AS TABLE_NAME ");
            sql.append(KEY_FROM).append(" ");
            sql.append(dbname);
            sql.append(".");
            sql.append(MsSqlKeyword.KEY_DBO);
            sql.append(".");
            sql.append("MULTI_TABLE_METADATA_TABLE metadatatable");
            sql.append(" ");
            sql.append(KEY_WHERE);
            sql.append(" ");
            sql.append("metadatatable.RESOURCE_ID=");
            sql.append("'");
            sql.append(resourceid);
            sql.append("'");
            List<LinkedHashMap<String, String>>  metadatatableResult = generalMapper.selectBySql(sql.toString());
            if (null != metadatatableResult) {
                Set<String> databaseSet = new HashSet<String>();
                for (LinkedHashMap<String, String> metadatatable: metadatatableResult) {
                    if (StringUtils.isNotBlank(metadatatable.get("DATABASE_NAME"))) {
                        databaseSet.add(metadatatable.get("DATABASE_NAME"));
                    }
                }
                if (databaseSet.size() == 0) {
                    databaseSet.add(databasePropertyService.getMainDataBaseName());
                }
                Map<String, String> databaseTable = new HashMap<String, String>();
                for (String databaseName: databaseSet) {
                    StringBuilder stringBuilder = new StringBuilder();
                    for (LinkedHashMap<String, String> metadatatable: metadatatableResult) {
                        if (null != metadatatable.get("DATABASE_NAME") && databaseName.equals(metadatatable.get("DATABASE_NAME"))) {
                            stringBuilder.append(",");
                            stringBuilder.append("'");
                            stringBuilder.append(metadatatable.get("TABLE_NAME"));
                            stringBuilder.append("'");
                        } else if (null == metadatatable.get("DATABASE_NAME")) {
                            stringBuilder.append(",");
                            stringBuilder.append("'");
                            stringBuilder.append(metadatatable.get("TABLE_NAME"));
                            stringBuilder.append("'");
                        }
                    }
                    databaseTable.put(databaseName, stringBuilder.toString().replaceFirst(",", ""));
                }
                StringBuilder sqlBuilder = new StringBuilder();
                for (Map.Entry<String, String> entry : databaseTable.entrySet()) {
                    sqlBuilder.append(" ");
                    sqlBuilder.append(KEY_UNION);
                    sqlBuilder.append(" ");
                    sqlBuilder.append(KEY_SELECT);
                    sqlBuilder.append(" uSysObjects.name");
                    sqlBuilder.append("+'");
                    sqlBuilder.append(ConstantUtils.FIELDCONNECTOR);
                    sqlBuilder.append("'+");
                    sqlBuilder.append("uSysColumns.name AS column_name,");
                    sqlBuilder.append(" uSysColumns.length AS character_maximum_length,");
                    sqlBuilder.append(" usystypes.name AS data_type");
                    sqlBuilder.append(" ");
                    sqlBuilder.append(KEY_FROM);
                    sqlBuilder.append(" ");
                    sqlBuilder.append(entry.getKey());
                    sqlBuilder.append("..SysObjects uSysObjects ");
                    sqlBuilder.append(KEY_LEFT_JOIN);
                    sqlBuilder.append(" ");
                    sqlBuilder.append(entry.getKey());
                    sqlBuilder.append("..SysColumns uSysColumns ON uSysObjects.id = uSysColumns.id ");
                    sqlBuilder.append(KEY_LEFT_JOIN);
                    sqlBuilder.append(" systypes usystypes ON usystypes.xusertype = uSysColumns.xusertype ");
                    sqlBuilder.append(KEY_WHERE);
                    sqlBuilder.append(" (uSysObjects.XType = 'U' OR uSysObjects.XType = 'V') ");
                    sqlBuilder.append(KEY_AND);
                    sqlBuilder.append(" uSysObjects.name IN (");
                    sqlBuilder.append(entry.getValue());
                    sqlBuilder.append(")");
                }
                
                stringSqlBuilder.append(KEY_SELECT);
                stringSqlBuilder.append(" ");
                stringSqlBuilder.append(KEY_DISTINCT);
                stringSqlBuilder.append(" * ");
                stringSqlBuilder.append(KEY_FROM);
                stringSqlBuilder.append(" (");
                stringSqlBuilder.append(sqlBuilder.toString().replaceFirst(new StringBuilder(" ").append(KEY_UNION).append(" ").toString(), ""));
                stringSqlBuilder.append(") resourceResult");
                stringSqlBuilder.append(" ");
                stringSqlBuilder.append(KEY_ORDER_BY);
                stringSqlBuilder.append(" resourceResult.column_name");
                
            }
        }
        
        return stringSqlBuilder.toString();
    }

    @Override
    public String getPrimaryKeySql(String tablename, String dbname) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder = sqlBuilder.append(KEY_SELECT)
                .append(" name priKeyColName ").append(KEY_FROM)
                .append(" SysColumns ").append(KEY_WHERE)
                .append(" id=Object_Id('").append(tablename).append("') ")
                .append(KEY_AND).append(" colid in (")
                .append(KEY_SELECT).append(" colid ")
                .append(KEY_FROM).append(" sysindexkeys ")
                .append(KEY_WHERE).append(" id=Object_Id('")
                .append(tablename).append("'))");
        return sqlBuilder.toString();
    }


    @Override
    public String getQueryTableNameSqlFromSystem(List<String> dbnames, boolean existMultiTable) throws OrmException {
        StringBuilder sqlStringBuilder = new StringBuilder();
        for (int i = 0; i < dbnames.size(); i++) {
            if (i != 0) {
                sqlStringBuilder.append(" ");
                sqlStringBuilder.append(KEY_UNION);
                sqlStringBuilder.append(" ");
            }
            sqlStringBuilder.append(KEY_SELECT);
            sqlStringBuilder.append(" ");
            if (dbnames.size() > 1) {
                sqlStringBuilder.append("'");
                sqlStringBuilder.append(dbnames.get(i));
                sqlStringBuilder.append("'");
                sqlStringBuilder.append("+'.'+");
            }
            sqlStringBuilder.append("name ");
            sqlStringBuilder.append(KEY_AS);
            sqlStringBuilder.append(" ");
            sqlStringBuilder.append("TABLE_NAME");
            sqlStringBuilder.append(" ");
            sqlStringBuilder.append(KEY_FROM);
            sqlStringBuilder.append(" ");
            sqlStringBuilder.append(dbnames.get(i));
            sqlStringBuilder.append("..sysobjects");
            sqlStringBuilder.append(" ");
            sqlStringBuilder.append(KEY_WHERE);
            sqlStringBuilder.append(" xtype in ('u', 'v') ");
            if (databasePropertyService.getMainDataBaseName().equals(dbnames.get(i))) {
                sqlStringBuilder.append(" ");
                sqlStringBuilder.append(KEY_AND);
                sqlStringBuilder.append(" ");
                sqlStringBuilder.append("name");
                sqlStringBuilder.append(" ");
                sqlStringBuilder.append(KEY_NOT_IN);
                sqlStringBuilder.append(" ");
                sqlStringBuilder.append("('");
                sqlStringBuilder.append(MultiTableDifinitionTable.TABLE_NAME).append("', '");
                sqlStringBuilder.append(MultiTableMetadataTable.TABLE_NAME).append("', '");
                sqlStringBuilder.append(SingleTableDefinitionTable.TABLE_NAME).append("')");
            }
        }

        sqlStringBuilder.append(" ");
        if (existMultiTable == true) {
            sqlStringBuilder.append(KEY_UNION);
            sqlStringBuilder.append(" ");
            sqlStringBuilder.append(KEY_SELECT);
            sqlStringBuilder.append(" ");
            sqlStringBuilder.append("ID TABLE_NAME");
            sqlStringBuilder.append(" ");
            sqlStringBuilder.append(KEY_FROM);
            sqlStringBuilder.append(" ");
            sqlStringBuilder.append(databasePropertyService.getMainDataBaseName());
            sqlStringBuilder.append(".").append(MsSqlKeyword.KEY_DBO).append(".");
            sqlStringBuilder.append(MultiTableDifinitionTable.TABLE_NAME);
        }
        return sqlStringBuilder.toString();
    }

    @Override
    public String isExistMultiTable(String dbname) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append(KEY_SELECT);
        sqlBuilder.append(" count(*) ");
        sqlBuilder.append(KEY_FROM);
        sqlBuilder.append(" sysobjects ");
        sqlBuilder.append(KEY_WHERE);
        sqlBuilder.append("  name  ").append(KEY_IN);
        sqlBuilder.append(" ( ");
        sqlBuilder.append(" 'multi_table_definition_table' ,");
        sqlBuilder.append(" 'multi_table_metadata_table' "); 
        sqlBuilder.append(" ) ");
        return sqlBuilder.toString();
    }

    @Override
    public String getDatabaseName(String databaseName) {
        return databaseName + "." + MsSqlKeyword.KEY_DBO;
    }
}
