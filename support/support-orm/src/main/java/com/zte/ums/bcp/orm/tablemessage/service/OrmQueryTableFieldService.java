package com.zte.ums.bcp.orm.tablemessage.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.response.entry.QueryTableFieldResponseInfo;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseInfo;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseStatus;
import com.zte.ums.bcp.orm.framework.systemproperty.service.DatabasePropertyService;
import com.zte.ums.bcp.orm.tablemessage.dao.MetaDataMapper;
import com.zte.ums.bcp.orm.utils.TypeReplaceUtil;
import org.apache.log4j.Logger;

@Service(value="queryTableFieldService")
public class OrmQueryTableFieldService implements QueryTableFieldService {
    private static final Logger dMsg = Logger.getLogger(OrmQueryTableFieldService.class.getName());
    private static Map<String, List<LinkedHashMap<String, Object>>> fieldDefMap = new HashMap<String, List<LinkedHashMap<String, Object>>>();
    @Resource
    private MetaDataMapper metaDataMapper;
    @Resource
    private DatabasePropertyService databasePropertyService;
    @Resource(name="tableMessageSqlService")
    private AbstractTableMessageSqlService tableMessageSqlService;
    @Resource(name = "multiTableUtilService")
    private MultiTableUtilService multiTableUtilService;

    public ResponseInfo getTableField(String tableName, String databaseName) {
        List<LinkedHashMap<String, Object>> list = new ArrayList<LinkedHashMap<String, Object>>();

        try {
            if (!StringUtils.isNotBlank(databaseName)) {
                databaseName = databasePropertyService.getMainDataBaseName();
            }
            boolean multTableResource = false;
            boolean isMultiTable = multiTableUtilService.isValidMultTable(databaseName);
            if (isMultiTable) {
                multTableResource = isMultTableResource(tableName, tableMessageSqlService.getDatabaseName(databaseName));
            }
            if (multTableResource) {
                list = multiTableField(tableName, databaseName);
            } else {
                list = singleTableField(tableName, databaseName);
            }
        } catch (OrmException e) {
            return new ResponseInfo(ResponseStatus.STATUS_FAIL, e.getLocalizedMessage());
        }
        return new QueryTableFieldResponseInfo(ResponseStatus.STATUS_SUCCESS, QueryTableFieldResponseInfo.DEFAULT_SUCCESS_MESSAGE, list);
    }

    private boolean isMultTableResource(String tableName, String databaseName) throws OrmException{
        Map<String, String> multiTableDef;
        try {
            multiTableDef = metaDataMapper.findResourceId(tableName, databaseName);
            if (null != multiTableDef && !multiTableDef.isEmpty()) {
                return true;
            }
            return false;
        } catch (Exception e) {
            dMsg.error(e.getMessage(), e);
            throw new OrmException(e.getLocalizedMessage(), e.getCause());
        }
    }

    private List<LinkedHashMap<String, Object>> multiTableField(String resourceId, String databaseName) throws OrmException {
        List<LinkedHashMap<String, Object>> replaceList = new ArrayList<LinkedHashMap<String, Object>>();
        replaceList = getMultiTableField(resourceId, databaseName);
        if (null == replaceList || replaceList.isEmpty()) {
            throw new OrmException("查询的表在当前数据库中不存在！");
        }
        fieldDefMap.put(resourceId, replaceList);
        dMsg.info(resourceId + "的字段信息:" + replaceList.toString());
        return replaceList;
    }

    private List<LinkedHashMap<String, Object>> singleTableField(String tableName, String databaseName)
            throws OrmException {
        List<LinkedHashMap<String, Object>> replaceList = new ArrayList<LinkedHashMap<String, Object>>();
        replaceList = getSingleTableField(tableName, databaseName);
        if (null == replaceList || replaceList.isEmpty()) {
            throw new OrmException("查询的表在当前数据库中不存在！");
        }
        fieldDefMap.put(tableName, replaceList);
        dMsg.info(tableName + "的字段信息:" + replaceList.toString());
        return replaceList;
    }

    public Map<String, List<LinkedHashMap<String, Object>>> getFieldCacheMap() {
        return fieldDefMap;
    }

    private List<LinkedHashMap<String, Object>> getSingleTableField(String tableName, String databaseName)
            throws OrmException {
        String sql = tableMessageSqlService.getTableField(tableName, databaseName);
        try {
            return TypeReplaceUtil.replaceMySqlDateType(metaDataMapper.querytablefield(sql));
        } catch (Exception e) {
            dMsg.error(e.getMessage(), e);
            throw new OrmException(e.getLocalizedMessage(), e);
        }
    }

    private List<LinkedHashMap<String, Object>> getMultiTableField(String resourceId, String databaseName)
            throws OrmException {
        String sql = tableMessageSqlService.getMultiField(resourceId, databaseName);
        try {
            return TypeReplaceUtil.replaceMySqlDateType(metaDataMapper.queryMultiField(sql));
        } catch (Exception e) {
            dMsg.error(e.getMessage(), e);
            throw new OrmException(e);
        }
    }

    public void setUT_MetaDataMapper(MetaDataMapper metaDataMapper) {
        this.metaDataMapper = metaDataMapper;
    }

    public void setUT_DatabasePropertyService(DatabasePropertyService databasePropertyService) {
        this.databasePropertyService = databasePropertyService;
    }

    public void setUT_TableMessageSqlService(AbstractTableMessageSqlService tableMessageSqlService) {
        this.tableMessageSqlService = tableMessageSqlService;
    }

    public void setUT_multiTableUtilService(MultiTableUtilService multiTableUtilService) {
        this.multiTableUtilService = multiTableUtilService;
    }

    public LinkedHashMap<String, String> findMutilTable(String tableName, String databaseName) throws OrmException {
        try {
            return metaDataMapper.findResourceId(tableName, databaseName);
        } catch (Exception e) {
            dMsg.error(e.getMessage(), e);
            throw new OrmException(e.getLocalizedMessage(), e.getCause());
        }
    }

    public boolean isMutilTable(String tableName, String databaseName) throws OrmException {
        boolean isMultiTable = multiTableUtilService.isValidMultTable(databaseName);
        if (isMultiTable) {
            if (this.findMutilTable(tableName, databaseName) != null) {
                return true;
            }
        }
        return false;
    }
}
