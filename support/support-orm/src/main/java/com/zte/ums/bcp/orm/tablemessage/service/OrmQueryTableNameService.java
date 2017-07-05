package com.zte.ums.bcp.orm.tablemessage.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.constant.IJsonConstant;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.response.entry.QueryTableNamesResponseInfo;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseInfo;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseStatus;
import com.zte.ums.bcp.orm.framework.systemproperty.service.DatabasePropertyService;
import com.zte.ums.bcp.orm.tablemessage.dao.MetaDataMapper;
import org.apache.log4j.Logger;

@Service(value="queryTableNameService")
public class OrmQueryTableNameService implements QueryTableNameService {
    private static final Logger dMsg = Logger.getLogger(OrmQueryTableNameService.class.getName());

    @Resource
    private MetaDataMapper metaDataMapper;

    @Resource
    private DatabasePropertyService databasePropertyService;

    @Resource(name = "tableMessageSqlService")
    private AbstractTableMessageSqlService tableMessageSqlService;

    @Resource(name = "multiTableUtilService")
    private MultiTableUtilService multiTableUtilService;
    public ResponseInfo getTableName(String database) {
        try {
            String sql = "";
            // 该分支只查询数据库中multi_table_definition_table、single_table_definition_table表存储的数据
            // 为bcp特殊需求，不支持多数据库，如果request中传入了database参数，则返回制定数据库数据
            String dbName = databasePropertyService.getDBName(database);
            boolean isMultiTable = multiTableUtilService.isValidMultTable(dbName);
            if (databasePropertyService.isSchemaTable()) {
                sql = tableMessageSqlService.getQueryTableNameSqlFromUser(database, isMultiTable);
            } else {
                List<String> databaseNames = databasePropertyService.getAllDBNames(database);
                sql = tableMessageSqlService.getQueryTableNameSqlFromSystem(databaseNames, isMultiTable);
            }
            List<LinkedHashMap<String, String>> tablenames = metaDataMapper.queryTableName(sql);
            return getTableNameJson(tablenames);
        } catch (OrmException e) {
            dMsg.error(e.getMessage(), e);
            return new ResponseInfo(ResponseStatus.STATUS_FAIL, e.getLocalizedMessage());
        }
    }

    public QueryTableNamesResponseInfo getTableNameJson(
            List<LinkedHashMap<String, String>> tablenames) throws OrmException {
        StringBuilder tableNamesBuilder = new StringBuilder();
        List<String> tableNameList = new ArrayList<String>();

        for (Map<String, String> map : tablenames) {
            tableNameList.add(map.get("TABLE_NAME"));
        }

        Collections.sort(tableNameList);

        for (String tableName : tableNameList) {
            tableNamesBuilder.append(tableName).append(" ");
        }
        String substring = "";
        if (tableNamesBuilder.length() > 0) {
            substring = tableNamesBuilder.substring(0,
                    tableNamesBuilder.length() - 1);
        }
        dMsg.debug("获取的表名:" + substring);
        Map<String, Object> map = new HashMap<String, Object>();
        map.put(IJsonConstant.TABLENAMES, substring);
        return new QueryTableNamesResponseInfo(1, "", substring);
    }
}
