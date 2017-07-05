package com.zte.ums.bcp.orm.tablemessage.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.constant.MultiTableDifinitionTable;
import com.zte.ums.bcp.orm.constant.SingleTableDefinitionTable;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.sql.keyword.PublicKeyword;
import com.zte.ums.bcp.orm.framework.sql.util.DBHelper;
import com.zte.ums.bcp.orm.framework.systemproperty.service.DatabasePropertyService;

@Service
public abstract class AbstractTableMessageSqlService extends PublicKeyword {
    @Resource
    private DatabasePropertyService databasePropertyService;
    @Resource
    private DBHelper dbHelper;

    /**
     * SELECT stdt.TABLE_NAME AS `TABLE_NAME`, stdt.DESCRIPTION AS
     * `DESCRIPTION`, stdt.TABLE_TYPE AS `TABLE_TYPE` FROM
     * SINGLE_TABLE_DEFINITION_TABLE stdt UNION SELECT mtdt.ID AS `TABLE_NAME`,
     * mtdt.DESCRIPTION AS `DESCRIPTION`, '2' AS `TABLE_TYPE` FROM
     * MULTI_TABLE_DEFINITION_TABLE mtdt WHERE mtdt.SCENE = 1
     * 
     * @return
     */
    public String getQueryTableNameSqlFromUser(String databaseName,
            boolean multiTable) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder = sqlBuilder
                .append(KEY_SELECT)
                .append(" mtdt.TABLE_NAME AS TABLE_NAME, mtdt.DESCRIPTION AS DESCRIPTION, mtdt.TABLE_TYPE AS 'TABLE_TYPE' ")
                .append(KEY_FROM)
                .append(getTableName(databaseName, SingleTableDefinitionTable.TABLE_NAME));
        if (multiTable == true) {
            sqlBuilder
                    .append(KEY_UNION)
                    .append(KEY_SELECT)
                    .append(" mtdt.ID AS 'TABLE_NAME', mtdt.DESCRIPTION AS 'DESCRIPTION', '2' AS 'TABLE_TYPE' ")
                    .append(KEY_FROM)
                    .append(getTableName(databaseName, MultiTableDifinitionTable.TABLE_NAME))
                    .append(KEY_WHERE).append(" mtdt.SCENE = 1");
        }
        return sqlBuilder.toString();
    }

    /**
     * 根据数据库不同获取表名，
     * @param databaseName
     * @param tableName
     * @return
     */
    private String getTableName(String databaseName, String tableName) {
        StringBuilder sqlBuilder = new StringBuilder();
        if(databaseName != null && databaseName.length() > 0) {
            sqlBuilder.append(dbHelper.getDatabaseName(databaseName)).append(".");
        }
        sqlBuilder.append(tableName).append(" mtdt ");
        return sqlBuilder.toString();
    }

    /**
     * 根据数据库名查询系统表
     * 
     * @param dbname
     * @return
     */
    public abstract String getQueryTableNameSqlFromSystem(List<String> dbnames , boolean existMultiTable) throws OrmException;

    public abstract String isExistMultiTable(String dbname);

    public abstract String getTableField(String tablename, String dbname);

    public abstract String getMultiField(String resourceid, String dbname) throws OrmException;

    public abstract String getPrimaryKeySql(String tablename, String dbname);

    public abstract String getDatabaseName(String databaseName);
}