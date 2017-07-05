package com.zte.mao.workbench.service.view;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.workbench.def.TDataViewAssociated;
import com.zte.mao.workbench.def.TDataViewAssociatedConditon;
import com.zte.mao.workbench.def.TDataViewInfo;
import com.zte.mao.workbench.def.TDataViewItem;
import com.zte.mao.workbench.dto.DataExpression;
import com.zte.mao.workbench.entity.model.DataViewAssociated;
import com.zte.mao.workbench.entity.model.DataViewAssociatedConditon;
import com.zte.mao.workbench.entity.model.DataViewBase;
import com.zte.mao.workbench.entity.model.DataViewInfo;
import com.zte.mao.workbench.entity.model.DataViewItem;
import com.zte.mao.workbench.service.SQLExecute;
import com.zte.mao.workbench.service.SQLPackageService;
import com.zte.mao.workbench.utils.DateUtil;
import com.zte.mao.workbench.utils.IdUtils;

@Service
public class DataViewCreateService {
    private static Logger logger = Logger.getLogger(DataViewCreateService.class);
    @Resource
    private SQLExecute sqlExecute;
    @Resource
    private SQLPackageService sQLPackageService;
    
    public CommonResponse create(String dataViewInfoContent, String tenantId) {
        try {
            if (StringUtils.isBlank(dataViewInfoContent)) {
                String errorMessage = "data is empty.";
                logger.error(errorMessage);
                return new CommonResponse(CommonResponse.STATUS_FAIL, errorMessage);
            }
            List<String> sqls = new ArrayList<String>();
            sqls.add(sQLPackageService.packageUseDataBaseSql(tenantId));
            sqls.addAll(getSqls(getDataViewInfo(dataViewInfoContent)));
            sqlExecute.executeMultipleSql(sqls);
            return new CommonResponse(CommonResponse.STATUS_SUCCESS, CommonResponse.MESSAGE_SUCCESS);
        } catch (JsonProcessingException e) {
            logger.error(e.getMessage(), e);
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        } catch (MaoCommonException e) {
            logger.error(e.getMessage(), e);
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        }
    }

    public DataViewInfo getDataViewInfo(String dataViewInfoContent) throws JsonProcessingException, IOException {
        JsonNode dataViewInfoJsonNode = new ObjectMapper().readTree(dataViewInfoContent);
        DataViewInfo dataViewInfo = new DataViewInfo();
        dataViewInfo.setDataViewBase(getDataViewBase(dataViewInfoJsonNode.get("dataViewBase")))
                    .setDataViewItems(getDataViewItems(dataViewInfoJsonNode.get("dataViewItems")))
                    .setDataViewAssociateds(getDataViewAssociateds(dataViewInfoJsonNode.get("dataViewAssociateds")));
        return dataViewInfo;
    }
    
    public List<String> getSqls(DataViewInfo dataViewInfo) throws MaoCommonException {
        List<String> sqls = new ArrayList<String>();
        sqls.addAll(getInsertSqls(dataViewInfo));
        sqls.add(getCreateViewSql(dataViewInfo));
        return sqls;
    }
    
    private String getCreateViewSql(DataViewInfo dataViewInfo) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("CREATE VIEW ")
                  .append(sQLPackageService.packageTableNameSqlFragment(dataViewInfo.getDataViewBase().getId()))
                  .append(" AS ")
                  .append(getViewSql(dataViewInfo));
        return sqlBuilder.toString();
    }
    
    public String getViewSql(DataViewInfo dataViewInfo) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT ")
                  .append(getViewColumnsSqlFragment(dataViewInfo.getDataViewItems()))
                  .append(" FROM ")
                  .append(sQLPackageService.packageTableNameSqlFragment(dataViewInfo.getDataViewBase().getMainTableName()))
                  .append(getViewTableAssociatedSqlFragment(dataViewInfo.getDataViewAssociateds()));
        return sqlBuilder.toString();
    }
    
    private String getViewTableAssociatedSqlFragment(List<DataViewAssociated> dataViewAssociateds) {
        StringBuilder sqlBuilder = new StringBuilder();
        for (DataViewAssociated dataViewAssociated: dataViewAssociateds) {
            sqlBuilder.append(" ")
                      .append(dataViewAssociated.getAssociatedType())
                      .append(" ")
                      .append(dataViewAssociated.getAssociatedTableName())
                      .append(" ON ")
                      .append(getViewTableAssociatedCondtionSqlFragment(dataViewAssociated.getDataViewAssociatedConditons()));
        }
        
        return sqlBuilder.toString();
    }
    
    private String getViewTableAssociatedCondtionSqlFragment(List<DataViewAssociatedConditon> dataViewAssociatedConditons) {
        StringBuilder sqlBuilder = new StringBuilder();
        for (int i = 0, len = dataViewAssociatedConditons.size(); i < len; i++) {
            DataViewAssociatedConditon dataViewAssociatedConditon = dataViewAssociatedConditons.get(i);
            if (i != 0) {
                sqlBuilder.append(" AND ");
            }
            sqlBuilder.append(sQLPackageService.packageColumnNameSqlFragment(dataViewAssociatedConditon.getMainTableName(), dataViewAssociatedConditon.getMainColumnName()))
                      .append(dataViewAssociatedConditon.getComparison())
                      .append(sQLPackageService.packageColumnNameSqlFragment(dataViewAssociatedConditon.getChildTableName(), dataViewAssociatedConditon.getChildColumnName()));
        }
        
        return sqlBuilder.toString();
    }
    
    private String getViewColumnsSqlFragment(List<DataViewItem> dataViewItems) {
        StringBuilder sqlBuilder = new StringBuilder();
        for (int i = 0, len = dataViewItems.size(); i < len; i++) {
            DataViewItem dataViewItem = dataViewItems.get(i);
            if (i != 0) {
                sqlBuilder.append(",");
            }
            sqlBuilder.append(sQLPackageService.packageTableNameSqlFragment(dataViewItem.getTableName()))
                      .append(".")
                      .append(sQLPackageService.packageColumnNameSqlFragment(dataViewItem.getId()))
                      .append(" AS ")
                      .append(sQLPackageService.packageColumnNameSqlFragment(dataViewItem.getAlisaName()));
        }
        return sqlBuilder.toString();
    }
    
    private List<DataViewAssociatedConditon> getDataViewAssociatedConditons(JsonNode dataViewAssociatedConditonsContent) {
        List<DataViewAssociatedConditon> dataViewAssociatedConditons = new ArrayList<DataViewAssociatedConditon>();
        for (Iterator<JsonNode> iterator = dataViewAssociatedConditonsContent.elements(); iterator.hasNext();) {
            JsonNode conditonJsonNode = iterator.next();
            DataViewAssociatedConditon dataViewAssociatedConditon = new DataViewAssociatedConditon();
            dataViewAssociatedConditon.setChildColumnName(conditonJsonNode.get("childColumnName").asText());
            dataViewAssociatedConditon.setChildTableName(conditonJsonNode.get("childTableName").asText());
            dataViewAssociatedConditon.setComparison(conditonJsonNode.get("comparison").asText());
            dataViewAssociatedConditon.setMainColumnName(conditonJsonNode.get("mainColumnName").asText());
            dataViewAssociatedConditon.setMainTableName(conditonJsonNode.get("mainTableName").asText());
            dataViewAssociatedConditons.add(dataViewAssociatedConditon);
        }
        return dataViewAssociatedConditons;
    }
    
    private List<DataViewAssociated> getDataViewAssociateds(JsonNode dataViewAssociatedsContent) {
        List<DataViewAssociated> dataViewAssociateds = new ArrayList<DataViewAssociated>();
        for (Iterator<JsonNode> iterator = dataViewAssociatedsContent.elements(); iterator.hasNext();) {
            JsonNode dataViewAssociatedJsonNode = iterator.next();
            DataViewAssociated dataViewAssociated = new DataViewAssociated();
            dataViewAssociated.setAssociatedType(dataViewAssociatedJsonNode.get("associatedType").asText());
            dataViewAssociated.setDataViewAssociatedConditons(getDataViewAssociatedConditons(dataViewAssociatedJsonNode.get("dataViewAssociatedConditons")));
            dataViewAssociated.setAssociatedTableName(dataViewAssociatedJsonNode.get("associatedTableName").asText());
            dataViewAssociateds.add(dataViewAssociated);
        }
        return dataViewAssociateds;
        
    }
    
    private List<DataViewItem> getDataViewItems(JsonNode dataViewItemsContent) {
        List<DataViewItem> dataViewItems = new ArrayList<DataViewItem>();
        for (Iterator<JsonNode> iterator = dataViewItemsContent.elements(); iterator.hasNext();) {
            JsonNode item = iterator.next();
            DataViewItem dataViewItem = new DataViewItem();
            dataViewItem.setAlisaName(item.get("alisaName").asText())
                        .setId(item.get("id").asText())
                        .setTableName(item.get("tableName").asText());
            dataViewItems.add(dataViewItem);
        }
        return dataViewItems;
    }
    
    private DataViewBase getDataViewBase(JsonNode dataViewBaseContent) {
        DataViewBase dataViewBase = new DataViewBase();
        Date nowTime = new Date();
        dataViewBase.setId(dataViewBaseContent.get("id").asText())
                    .setCreateTime(nowTime)
                    .setUpdateTime(nowTime)
                    .setCreator(dataViewBaseContent.get("creator").asText())
                    .setMainTableName(dataViewBaseContent.get("mainTableName").asText());
        return dataViewBase;
    }
    
    private List<String> getInsertSqls(DataViewInfo dataViewInfo) {
        List<String> sqls = new ArrayList<String>();
        sqls.add(getInsertDataViewBaseSql(dataViewInfo.getDataViewBase()));
        sqls.addAll(getInsertDataViewAssociatedSqls(dataViewInfo.getDataViewAssociateds(), dataViewInfo.getDataViewBase().getId()));
        sqls.addAll(getInsertDataViewItemSqls(dataViewInfo.getDataViewItems(), dataViewInfo.getDataViewBase().getId()));
        return sqls;
    }
    
    private String getInsertDataViewBaseSql(DataViewBase dataViewBase) {
        List<DataExpression> dataExpressions = new ArrayList<DataExpression>();
        if (dataViewBase.getUpdateTime() != null) {
            dataExpressions.add(new DataExpression(TDataViewInfo.COL_NAME_UPDATE_TIME, DateUtil.format(dataViewBase.getUpdateTime(), DateUtil.PATTERN_YYYY_MM_DD_HH_MM_SS)));
        }
        dataExpressions.add(new DataExpression(TDataViewInfo.COL_NAME_CREATE_TIME, DateUtil.format(dataViewBase.getCreateTime(), DateUtil.PATTERN_YYYY_MM_DD_HH_MM_SS)));
        dataExpressions.add(new DataExpression(TDataViewInfo.COL_NAME_CREATOR, dataViewBase.getCreator()));
        dataExpressions.add(new DataExpression(TDataViewInfo.COL_NAME_ID, dataViewBase.getId()));
        dataExpressions.add(new DataExpression(TDataViewInfo.COL_NAME_MAIN_TABLE_NAME, dataViewBase.getMainTableName()));
        return getInsertSql(TDataViewInfo.NAME, dataExpressions);
    }
    
    private List<String> getInsertDataViewAssociatedSqls(List<DataViewAssociated> dataViewAssociateds, String viewId) {
        List<String> sqls = new ArrayList<String>();
        for (DataViewAssociated dataViewAssociated: dataViewAssociateds) {
            String id = IdUtils.getUUid();
            sqls.add(getInsertDataViewAssociatedSql(dataViewAssociated, viewId, id));
            sqls.addAll(getInsertDataViewAssociatedConditonSqls(dataViewAssociated.getDataViewAssociatedConditons(), viewId, id));
        }
        return sqls;
    }
    
    private String getInsertDataViewAssociatedSql(DataViewAssociated dataViewAssociated, String viewId, String id) {
        List<DataExpression> dataExpressions = new ArrayList<DataExpression>();
        dataExpressions.add(new DataExpression(TDataViewAssociated.COL_NAME_ASSOCIATED_TYPE, dataViewAssociated.getAssociatedType()));
        dataExpressions.add(new DataExpression(TDataViewAssociated.COL_NAME_ID, id));
        dataExpressions.add(new DataExpression(TDataViewAssociated.COL_NAME_VIEW_ID, viewId));
        dataExpressions.add(new DataExpression(TDataViewAssociated.COL_NAME_ASSOCIATED_TABLE_NAME, dataViewAssociated.getAssociatedTableName()));
        return getInsertSql(TDataViewAssociated.NAME, dataExpressions);
    }
    
    private List<String> getInsertDataViewAssociatedConditonSqls(List<DataViewAssociatedConditon> dataViewAssociatedConditons, String viewId, String associatedId) {
        List<String> sqls = new ArrayList<String>();
        for (DataViewAssociatedConditon dataViewAssociatedConditon: dataViewAssociatedConditons) {
            sqls.add(getInsertDataViewAssociatedConditonSql(dataViewAssociatedConditon, viewId, associatedId));
        }
        return sqls;
    }
    
    private String getInsertDataViewAssociatedConditonSql(DataViewAssociatedConditon dataViewAssociatedConditon, String viewId, String associatedId) {
        List<DataExpression> dataExpressions = new ArrayList<DataExpression>();
        dataExpressions.add(new DataExpression(TDataViewAssociatedConditon.COL_NAME_CHILD_COLUMN_NAME, dataViewAssociatedConditon.getChildColumnName()));
        dataExpressions.add(new DataExpression(TDataViewAssociatedConditon.COL_NAME_CHILD_TABLE_NAME, dataViewAssociatedConditon.getChildTableName()));
        dataExpressions.add(new DataExpression(TDataViewAssociatedConditon.COL_NAME_COMPARISON, dataViewAssociatedConditon.getComparison()));
        dataExpressions.add(new DataExpression(TDataViewAssociatedConditon.COL_NAME_MAIN_COLUMN_NAME, dataViewAssociatedConditon.getMainColumnName()));
        dataExpressions.add(new DataExpression(TDataViewAssociatedConditon.COL_NAME_MAIN_TABLE_NAME, dataViewAssociatedConditon.getMainTableName()));
        dataExpressions.add(new DataExpression(TDataViewAssociatedConditon.COL_NAME_VIEW_ID, viewId));
        dataExpressions.add(new DataExpression(TDataViewAssociatedConditon.COL_NAME_ASSOCIATED_ID, associatedId));
        return getInsertSql(TDataViewAssociatedConditon.NAME, dataExpressions);
    }
    
    
    private List<String> getInsertDataViewItemSqls(List<DataViewItem> dataViewItems, String viewId) {
        List<String> sqls = new ArrayList<String>();
        for (DataViewItem dataViewItem: dataViewItems) {
            sqls.add(getInsertDataViewItemSql(dataViewItem, viewId));
        }
        return sqls;
    }
    
    private String getInsertDataViewItemSql(DataViewItem dataViewItem, String viewId) {
        List<DataExpression> dataExpressions = new ArrayList<DataExpression>();
        dataExpressions.add(new DataExpression(TDataViewItem.COL_NAME_ALISA_NAME, dataViewItem.getAlisaName()));
        dataExpressions.add(new DataExpression(TDataViewItem.COL_NAME_ID, dataViewItem.getId()));
        dataExpressions.add(new DataExpression(TDataViewItem.COL_NAME_TABLE_NAME, dataViewItem.getTableName()));
        dataExpressions.add(new DataExpression(TDataViewItem.COL_NAME_VIEW_ID, viewId));
        return getInsertSql(TDataViewItem.NAME, dataExpressions);
    }
    
    private String getInsertSql(String tableName, List<DataExpression> dataExpressions) {
        StringBuilder insertColumnSqlFragment = new StringBuilder();
        StringBuilder insertValueSqlFragment = new StringBuilder();
        
        for (int i = 0, len = dataExpressions.size(); i < len; i++) {
            DataExpression dataExpression = dataExpressions.get(i);
            if (i != 0) {
                insertColumnSqlFragment.append(",");
                insertValueSqlFragment.append(",");
            }
            insertColumnSqlFragment.append(sQLPackageService.packageColumnNameSqlFragment(dataExpression.getField()));
            insertValueSqlFragment.append(packageValueSqlFragment(dataExpression.getValue()));
        }
        
        StringBuilder insertSql = new StringBuilder();
        insertSql.append("INSERT INTO ")
                 .append(sQLPackageService.packageTableNameSqlFragment(tableName))
                 .append(" (")
                 .append(insertColumnSqlFragment)
                 .append(") VALUES (")
                 .append(insertValueSqlFragment)
                 .append(")");
        return insertSql.toString();
    }
    
    private StringBuilder packageValueSqlFragment(String value) {
        if (value == null) {
            return null;
        }
        StringBuilder valueSqlFragment = new StringBuilder();
        valueSqlFragment.append("'")
                        .append(value.replace("'", "''"))
                        .append("'");
        return valueSqlFragment;
    }
}