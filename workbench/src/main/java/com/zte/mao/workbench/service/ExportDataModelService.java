package com.zte.mao.workbench.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.workbench.def.TDataModelInfo;
import com.zte.mao.workbench.def.TDataModelItem;
import com.zte.mao.workbench.entity.model.DataModelBaisc;
import com.zte.mao.workbench.entity.model.DataModelForm;
import com.zte.mao.workbench.entity.model.DataModelItem;
import com.zte.mao.workbench.service.orm.DataModelFormService;
import com.zte.mao.workbench.service.orm.DataModelInfoService;
import com.zte.mao.workbench.service.orm.DataModelItemService;

@Service
public class ExportDataModelService {
    private static Logger logger = Logger.getLogger(ExportDataModelService.class.getName());
    @Resource
    private DataModelFormService dataModelFormService;
    @Resource
    private DataModelInfoService dataModelInfoService;
    @Resource
    private DataModelItemService dataModelItemService;
    @Resource
    private SQLPackageService sQLPackageService;
    @Resource
    private SQLExecute sQLExecute;
    private String tableNameKey = "TABLE_NAME";
    private String tableTypeKey = "TABLE_TYPE";
    private String tableTypeValueBaseTable = "BASE TABLE";
    private String tableTypeValueView = "VIEW";
    
    public String exportDataModel(String appId, String tenantId) throws MaoCommonException {
        List<StringBuilder> stringBuilders = exportDataModelInfo(appId, tenantId);
        if (CollectionUtils.isNotEmpty(stringBuilders)) {
            StringBuilder sqlStringBuilder = new StringBuilder();
            int len = stringBuilders.size() - 1;
            String regex = "-- ########################";
            for (int i = 0; i < len; i++) {
                sqlStringBuilder.append(stringBuilders.get(i))
                             .append(System.getProperty("line.separator"))
                             .append(regex)
                             .append(System.getProperty("line.separator"));
            }
            sqlStringBuilder.append(stringBuilders.get(len));
            return sqlStringBuilder.toString();
        }
        
        return "";
    }
    
    private StringBuilder packageInsertSql(String tableName, StringBuilder columnsSqlFragment, StringBuilder valuesSqlFragment) {
        StringBuilder insertHeadSqlFragment = new StringBuilder();
        insertHeadSqlFragment.append("INSERT INTO ")
                     .append(sQLPackageService.packageTableNameSqlFragment(tableName, null))
                     .append(" (")
                     .append(columnsSqlFragment)
                     .append(") VALUES ")
                     .append(valuesSqlFragment)
                     .append(";");
        return insertHeadSqlFragment;
    }
    
    public Set<DataModelBaisc> getDataModelInfos(String appId, String tenantId) throws MaoCommonException {
        Set<DataModelForm> dataModelForms = dataModelFormService.getDataModelFormsByAppId(appId, tenantId);
        Set<String> dataModelIds = new HashSet<String>();
        for (DataModelForm dataModelForm: dataModelForms) {
            dataModelIds.add(dataModelForm.getModelId());
        }
        if (CollectionUtils.isNotEmpty(dataModelIds)) {
            return dataModelInfoService.getDataModelInfos(dataModelIds, tenantId);
        }
        return new HashSet<DataModelBaisc>();
    }
    
    
    
    private List<StringBuilder> exportDataModelInfo(String appId, String tenantId) throws MaoCommonException {
        List<StringBuilder> sqlSet = new ArrayList<StringBuilder>();
        if (StringUtils.isNotBlank(appId) && StringUtils.isNotBlank(tenantId)) {
            Set<DataModelBaisc> dataModelInfos = getDataModelInfos(appId, tenantId);
            if (CollectionUtils.isNotEmpty(dataModelInfos)) {
                StringBuilder columnsSqlFragment = new StringBuilder();
                columnsSqlFragment.append(getDataModelInsertColumnsSqlFragment());
                Set<String> modelIdsSet = new HashSet<String>();
                StringBuilder valuesSqlFragment = new StringBuilder();
                List<DataModelBaisc> dataModelInfoList = new ArrayList<DataModelBaisc>(dataModelInfos);
                for (int i = 0, len = dataModelInfoList.size(); i < len; i++) {
                    DataModelBaisc dataModelInfo = dataModelInfoList.get(i);
                    valuesSqlFragment.append(getDataModelInsertValueSqlFragment(dataModelInfo));
                    if (len - 1 != i) {
                        valuesSqlFragment.append(",");
                    }
                    modelIdsSet.add(dataModelInfo.getId());
                }
                
                StringBuilder whereConditionSqlFragment = new StringBuilder();
                whereConditionSqlFragment.append(TDataModelInfo.COL_NAME_ID)
                                         .append(" IN (")
                                         .append(packageWhereCondtionValues(modelIdsSet))
                                         .append(")");
                sqlSet.add(packageDeleteSql(TDataModelInfo.NAME, whereConditionSqlFragment));
                sqlSet.add(packageInsertSql(TDataModelInfo.NAME, columnsSqlFragment, valuesSqlFragment));
                sqlSet.addAll(exportDataModelAssociationData(dataModelInfos, tenantId));
            }
        }
        
        return sqlSet;
    }

    private StringBuilder getDataModelInsertValueSqlFragment(DataModelBaisc dataModelInfo) {
        String [] tDataModelInfoTableColValues = {
                dataModelInfo.getId(),      dataModelInfo.getDescription(),
                dataModelInfo.getName(),    String.valueOf(dataModelInfo.getScene()),
                DateFormatUtils.format(dataModelInfo.getCreateTime(), "yyyy-MM-dd HH:mm:ss"),
                dataModelInfo.getCreator(), dataModelInfo.getI18n(),
                dataModelInfo.getScript(),  dataModelInfo.getBindTable(),
                DateFormatUtils.format(dataModelInfo.getUpdateTime(), "yyyy-MM-dd HH:mm:ss")
        };
        StringBuilder valueSqlFragment = new StringBuilder();
        valueSqlFragment.append("(");
        for (int i = 0, len = tDataModelInfoTableColValues.length; i < len; i++) {
            if (i != 0) {
                valueSqlFragment.append(",");
            }
            valueSqlFragment.append(packageValueSqlFragment(tDataModelInfoTableColValues[i]));
        }
        valueSqlFragment.append(")");
        return valueSqlFragment;
    }

    private StringBuilder getDataModelInsertColumnsSqlFragment() {
        String [] tDataModelInfoTableColumns = {
                TDataModelInfo.COL_NAME_ID,              TDataModelInfo.COL_NAME_DESCRIPTION,
                TDataModelInfo.COL_NAME_NAME,            TDataModelInfo.COL_NAME_SCENE,
                TDataModelInfo.COL_NAME_CREATE_TIME,     TDataModelInfo.COL_NAME_CREATOR,
                TDataModelInfo.COL_NAME_I18N,            TDataModelInfo.COL_NAME_SCRIPT,
                TDataModelInfo.COL_NAME_BIND_TABLE_NAME, TDataModelInfo.COL_NAME_UPDATE_TIME
        };
        StringBuilder columnsSqlFragment = new StringBuilder();
        for (int i = 0, len = tDataModelInfoTableColumns.length; i < len; i++) {
            if (i != 0) {
                columnsSqlFragment.append(",");
            }
            columnsSqlFragment.append(sQLPackageService.packageColumnNameSqlFragment(tDataModelInfoTableColumns[i]));
        }
        return columnsSqlFragment;
    }

    private List<StringBuilder> exportDataModelItem(Set<DataModelBaisc> dataModelInfos, String tenantId) throws MaoCommonException {
        if (CollectionUtils.isEmpty(dataModelInfos) || StringUtils.isBlank(tenantId)) {
            return new ArrayList<StringBuilder>();
        }
        
        Set<String> modelIds = getModelIds(dataModelInfos);
        Set<DataModelItem> dataModelItemSet = dataModelItemService.getDataModelItems(modelIds, tenantId);
        if (CollectionUtils.isEmpty(dataModelItemSet)) {
            return new ArrayList<StringBuilder>();
        }
        
        StringBuilder columnsSqlFragment = new StringBuilder();
        columnsSqlFragment.append(getDataModelItemInsertColumnsSqlFragment());
        StringBuilder valuesSqlFragment = new StringBuilder();
        for (DataModelItem dataModelItem : dataModelItemSet) {
            valuesSqlFragment.append(getDataModelItemInsertValueSqlFragment(dataModelItem)).append(",");
        }
        valuesSqlFragment.delete(valuesSqlFragment.length() - 1, valuesSqlFragment.length());
        StringBuilder whereConditionSqlFragment = new StringBuilder();
        whereConditionSqlFragment.append(TDataModelItem.COL_NAME_MODEL_ID)
                                 .append(" IN (")
                                 .append(packageWhereCondtionValues(modelIds))
                                 .append(")");
        
        List<StringBuilder> sqlList = new ArrayList<StringBuilder>();
        sqlList.add(packageDeleteSql(TDataModelItem.NAME, whereConditionSqlFragment));
        sqlList.add(packageInsertSql(TDataModelItem.NAME, columnsSqlFragment, valuesSqlFragment));
        sqlList.addAll(getCreateTableSqls(dataModelInfos, dataModelItemSet, tenantId));
        
        return sqlList;
    }

    private List<DataModelBaisc> ascendingOrder(List<DataModelBaisc> dataModelInfos, List<Map<String, Object>> tableNameAndTableTypes) {
        List<DataModelBaisc> dataModelBaiscReturns = new ArrayList<DataModelBaisc>();
        List<DataModelBaisc> dataModelBaiscViews = new ArrayList<DataModelBaisc>();
        for (DataModelBaisc dataModelBaisc: dataModelInfos) {
            boolean isVIew = false;
            for (Map<String, Object> map: tableNameAndTableTypes) {
                if (dataModelBaisc.getBindTable().equals(String.valueOf(map.get(tableNameKey)))
                        && tableTypeValueView.equals(String.valueOf(map.get(tableTypeKey)))) {
                    dataModelBaiscViews.add(dataModelBaisc);
                    isVIew = true;
                    break;
                }
            }
            if (isVIew == false) {
                dataModelBaiscReturns.add(dataModelBaisc);
            }
        }
        
        for (int i = 0; i < dataModelBaiscViews.size(); i++) {
            for (int j = 0; j < dataModelBaiscViews.size() - i - 1; j++) {
                if (dataModelBaiscViews.get(j).getCreateTime().getTime() < dataModelBaiscViews.get(j + 1).getCreateTime().getTime()) {
                    DataModelBaisc temp = dataModelBaiscViews.get(j);
                    dataModelBaiscViews.set(j, dataModelBaiscViews.get(j + 1));
                    dataModelBaiscViews.set(j + 1, temp);
                }
                
            }
        }
        dataModelBaiscReturns.addAll(dataModelBaiscViews);
        return dataModelBaiscReturns;
    }
    
    private List<StringBuilder> getCreateTableSqls(Set<DataModelBaisc> dataModelInfos, Collection<DataModelItem> dataModelItems, String tenantId) throws MaoCommonException {
        List<DataModelBaisc> listSceneExistTableBaiscs = new ArrayList<DataModelBaisc>();
        List<DataModelBaisc> listSceneNewTableBaiscs = new ArrayList<DataModelBaisc>();
        List<DataModelBaisc> listSceneScriptBaiscs = new ArrayList<DataModelBaisc>();
        List<String> listSceneScriptTableNames = new ArrayList<String>();
        for (DataModelBaisc dataModelInfo: dataModelInfos) {
            if (dataModelInfo.getScene() == DataModelBaisc.ENUM_SCENE_EXIST_TABLE) {
                listSceneExistTableBaiscs.add(dataModelInfo);
            } else if(dataModelInfo.getScene() == DataModelBaisc.ENUM_SCENE_NEW_TABLE) {
                listSceneNewTableBaiscs.add(dataModelInfo);
            } else if (dataModelInfo.getScene() == DataModelBaisc.ENUM_SCENE_SCRIPT) {
                listSceneScriptBaiscs.add(dataModelInfo);
                listSceneScriptTableNames.add(dataModelInfo.getBindTable());
            }
        }
        
        Set<String> bindTables = new HashSet<String>();
        for (int i = 0; i < listSceneExistTableBaiscs.size(); i++) {
            boolean isFind = false;
            DataModelBaisc modelBaisc = listSceneExistTableBaiscs.get(i);
            for (DataModelBaisc dataModelBaisc: listSceneNewTableBaiscs) {
                if (modelBaisc.getBindTable().equals(dataModelBaisc.getBindTable())) {
                    isFind = true;
                }
            }
            if (isFind == false) {
                for (DataModelBaisc dataModelBaisc: listSceneScriptBaiscs) {
                    if (modelBaisc.getBindTable().equals(dataModelBaisc.getBindTable())) {
                        isFind = true;
                    }
                }
            }
            if (isFind) {
                listSceneExistTableBaiscs.remove(i);
            } else {
                bindTables.add(modelBaisc.getBindTable());
            }
        }
        List<Map<String, Object>> tableNameAndTableTypes = new ArrayList<Map<String,Object>>();
        if (listSceneScriptTableNames.isEmpty() == false) {
            tableNameAndTableTypes = getTableNameAndTableType(tenantId, listSceneScriptTableNames);
        }
        List<DataModelBaisc> dataModelBaiscs = new ArrayList<DataModelBaisc>();
        dataModelBaiscs.addAll(listSceneNewTableBaiscs);
        dataModelBaiscs.addAll(listSceneExistTableBaiscs);
        dataModelBaiscs.addAll(ascendingOrder(listSceneScriptBaiscs, tableNameAndTableTypes));
        List<StringBuilder> sqlList = new ArrayList<StringBuilder>();
        for (DataModelBaisc dataModelBaisc: dataModelBaiscs) {
             sqlList.addAll(getCreateTableSql(dataModelItems, dataModelBaisc, tableNameAndTableTypes));
        }
        return sqlList;
    }

    private List<StringBuilder> getCreateTableSql(Collection<DataModelItem> dataModelItems, DataModelBaisc dataModelBaisc, List<Map<String, Object>> tableNameAndTableTypes) {
        if (dataModelBaisc.getScene() == DataModelBaisc.ENUM_SCENE_SCRIPT) {
            List<StringBuilder> sqlList = new ArrayList<StringBuilder>();
            for (Map<String, Object> tableNameAndTableType: tableNameAndTableTypes) {
                if (dataModelBaisc.getBindTable().equals(String.valueOf(tableNameAndTableType.get(tableNameKey)))) {
                    if (tableTypeValueBaseTable.equals(String.valueOf(tableNameAndTableType.get(tableTypeKey)))) {
                        sqlList.add(packageDropTableSql(dataModelBaisc.getBindTable()));
                    } else if (tableTypeValueView.equals(String.valueOf(tableNameAndTableType.get(tableTypeKey)))) {
                        sqlList.add(packageDropViewSql(dataModelBaisc.getBindTable()));
                    }
                    break;
                }
            }
            
            sqlList.add(new StringBuilder(dataModelBaisc.getScript()));
            return sqlList;
        }
        
        List<StringBuilder> sqlList = new ArrayList<StringBuilder>();
        StringBuilder tableCreateSql = new StringBuilder();
        tableCreateSql.append("CREATE TABLE ");
        if (dataModelBaisc.getScene() == DataModelBaisc.ENUM_SCENE_EXIST_TABLE) {
            tableCreateSql.append("IF NOT EXISTS ");
        } else {
            sqlList.add(packageDropTableSql(dataModelBaisc.getBindTable()));
        }
        tableCreateSql.append(sQLPackageService.packageTableNameSqlFragment(dataModelBaisc.getBindTable(), null));
        List<DataModelItem> currentDataModelItems = new ArrayList<DataModelItem>();
        for (DataModelItem dataModelItem: dataModelItems) {
            if (dataModelItem.getModelId().equals(dataModelBaisc.getId())) {
                currentDataModelItems.add(dataModelItem);
            }
        }
        tableCreateSql.append(" (")
                      .append(System.getProperty("line.separator"))
                      .append(sQLPackageService.getCreateSQLColumnInfos(currentDataModelItems, true))
                      .append(") ENGINE=InnoDB DEFAULT CHARSET=utf8;");
        sqlList.add(tableCreateSql);
        return sqlList;
    }

    private StringBuilder getDataModelItemInsertValueSqlFragment(DataModelItem dataModelItem) {
        String [] tDataModelItemTableColValues = {
                String.valueOf(dataModelItem.getDecimal()), String.valueOf(dataModelItem.getDefaultValue()),
                dataModelItem.getId(),                      String.valueOf(dataModelItem.isNull() ? 0 : 1), 
                String.valueOf(dataModelItem.getLenth()),   dataModelItem.getModelId(),
                dataModelItem.getName(),                    String.valueOf(dataModelItem.getType())
        };
        StringBuilder valueSqlFragment = new StringBuilder();
        valueSqlFragment.append("(");
        for (int i = 0, len = tDataModelItemTableColValues.length; i < len; i++) {
            if (i != 0) {
                valueSqlFragment.append(",");
            }
            valueSqlFragment.append(packageValueSqlFragment(tDataModelItemTableColValues[i]));
        }
        valueSqlFragment.append(")");
        return valueSqlFragment;
    }

    private StringBuilder getDataModelItemInsertColumnsSqlFragment() {
        String [] tDataModelItemTableColumns = {
                TDataModelItem.COL_NAME_DECIMAL, TDataModelItem.COL_NAME_DEFAULT,
                TDataModelItem.COL_NAME_ID,      TDataModelItem.COL_NAME_IS_NULL,
                TDataModelItem.COL_NAME_LENGTH,  TDataModelItem.COL_NAME_MODEL_ID,
                TDataModelItem.COL_NAME_NAME,    TDataModelItem.COL_NAME_TYPE
        };
        StringBuilder columnsSqlFragment = new StringBuilder();
        for (int i = 0, len = tDataModelItemTableColumns.length; i < len; i++) {
            if (i != 0) {
                columnsSqlFragment.append(",");
            }
            columnsSqlFragment.append(sQLPackageService.packageColumnNameSqlFragment(tDataModelItemTableColumns[i]));
        }
        return columnsSqlFragment;
    }

    private Set<String> getModelIds(Set<DataModelBaisc> dataModelInfos) {
        Set<String> modelIds = new HashSet<String>();
        for (DataModelBaisc dataModelBaisc: dataModelInfos) {
            modelIds.add(dataModelBaisc.getId());
        }
        return modelIds;
    }
    
    private List<StringBuilder> exportDataModelAssociationData(Set<DataModelBaisc> dataModelInfos, String tenantId) throws MaoCommonException {
        List<StringBuilder> sqlSet = new ArrayList<StringBuilder>();
        if (CollectionUtils.isNotEmpty(dataModelInfos) && StringUtils.isNotBlank(tenantId)) {
            sqlSet.addAll(exportDataModelItem(dataModelInfos, tenantId));
        }
        return sqlSet;
    }

    private StringBuilder packageValueSqlFragment(String value) {
        if (StringUtils.isNotBlank(value) && !"null".equals(value)) {
            StringBuilder valueSqlFragment = new StringBuilder();
            valueSqlFragment.append("'")
                            .append(value.replace("'", "''"))
                            .append("'");
            return valueSqlFragment;
        }
        
        return new StringBuilder("null");
    }
    
    private StringBuilder packageDeleteSql(String tableName, StringBuilder whereConditionSqlFragment) {
        StringBuilder deleteSqlFragment = new StringBuilder();
        deleteSqlFragment.append("DELETE FROM ")
                     .append(sQLPackageService.packageTableNameSqlFragment(tableName, null))
                     .append(" WHERE ")
                     .append(whereConditionSqlFragment)
                     .append(";");
        return deleteSqlFragment;
    }
    
    private StringBuilder packageDropTableSql(String tableName) {
        StringBuilder deleteSqlFragment = new StringBuilder();
        deleteSqlFragment.append(sQLPackageService.packageDropTableSql(tableName, null))
                         .append(";");
        return deleteSqlFragment;
    }
    
    private StringBuilder packageDropViewSql(String viewName) {
        StringBuilder deleteSqlFragment = new StringBuilder();
        deleteSqlFragment.append(sQLPackageService.packageDropViewSql(viewName, null))
                         .append(";");
        return deleteSqlFragment;
    }
    
    private List<Map<String, Object>> getTableNameAndTableType(String tenantId, List<String> tableNames, String tableType) throws MaoCommonException {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("SELECT")
                     .append(" aaa.TABLE_NAME, aaa.TABLE_TYPE")
                     .append(" FROM information_schema.`TABLES` aaa")
                     .append(" WHERE aaa.TABLE_SCHEMA='d_tenant_")
                     .append(tenantId)
                     .append("'")
                     .append(" AND aaa.TABLE_NAME IN (");
        for (int i = 0, len = tableNames.size(); i < len; i++) {
            if (i != 0) {
                stringBuilder.append(",");
            }
            stringBuilder.append("'")
                         .append(tableNames.get(i))
                         .append("'");
        }
        stringBuilder.append(")");
        if (StringUtils.isNotBlank(tableType)) {
            stringBuilder.append(" AND aaa.TABLE_TYPE='")
                         .append(tableType)
                         .append("'");
        }
        List<String> sqls = new ArrayList<String>();
        sqls.add(stringBuilder.toString());
        return sQLExecute.executeMultipleDifferentTypesSql(sqls);
    }
    
    private List<Map<String, Object>> getTableNameAndTableType(String tenantId, List<String> tableNames) throws MaoCommonException {
        return getTableNameAndTableType(tenantId, tableNames, null);
    }
    
    
    private StringBuilder packageWhereCondtionValues(Set<String> valueSet) {
        StringBuilder valuesBuilder = new StringBuilder();
        if (CollectionUtils.isNotEmpty(valueSet)) {
            List<String> values = new ArrayList<String>(valueSet);
            int len = values.size() - 1;
            for (int i = 0; i < len; i++) {
                valuesBuilder.append(packageValueSqlFragment(values.get(i)))
                             .append(",");
            }
            valuesBuilder.append(packageValueSqlFragment(values.get(len)));
        }
        return valuesBuilder;
    }
}
