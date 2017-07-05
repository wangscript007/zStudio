package com.zte.ums.bcp.orm.tablemessage.service;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.tablemessage.dao.MetaDataMapper;


@Service(value = "multiTableUtilService")
public class MultiTableUtilService {
    private Map<String, Boolean> validMultTableMap = new HashMap<String, Boolean>();

    @Resource
    private MetaDataMapper metaDataMapper;

    @Resource(name = "tableMessageSqlService")
    private AbstractTableMessageSqlService tableMessageSqlService;

    public synchronized boolean isValidMultTable(String databaseName) {
        synchronized (validMultTableMap) {
            if (validMultTableMap.containsKey(databaseName) == false) {
                init(databaseName);
            }
        }
        return validMultTableMap.get(databaseName).booleanValue();
    }

    private void init(String databaseName) {
        String existMultiTableSql = tableMessageSqlService.isExistMultiTable(databaseName);
        int existMultiTable = metaDataMapper.isExistMultiTable(existMultiTableSql);
        validMultTableMap.put(databaseName, isExistMultiTable(existMultiTable));
    }

    private Boolean isExistMultiTable(int existMultiTable) {
        return new Boolean(existMultiTable >= 2);
    }
}
