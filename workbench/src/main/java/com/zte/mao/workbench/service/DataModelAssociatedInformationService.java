package com.zte.mao.workbench.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.common.response.DataResponse;
import com.zte.mao.common.session.SessionManager;
import com.zte.mao.workbench.controller.DataModelController;
import com.zte.mao.workbench.entity.model.DataModelItem;
import com.zte.mao.workbench.service.orm.DataModelInfoService;
import com.zte.mao.workbench.service.orm.DataModelItemService;
import com.zte.mao.workbench.service.orm.SingleTableDefinitionTableService;

@Service
public class DataModelAssociatedInformationService {
    private static final Logger logger = Logger.getLogger(DataModelAssociatedInformationService.class);
    @Resource
    private DataModelInfoService dataModelInfoService;
    @Resource
    private DataModelItemService dataModelItemService;
    @Resource
    private SQLPackageService sQLPackageService;
    @Resource
    private SingleTableDefinitionTableService singleTableDefinitionTableService;
    @Resource
    private SessionManager sessionManager;
    @Resource
    private SQLExecute sQLExecute;
    private static final Collection<String> denyWords = Arrays.asList(new String[]{"DROP","DELETE","TRUNCATE","INSERT","UPDATE"});
    private static final Collection<String> includeWords = Arrays.asList(new String[]{"CREATE VIEW IF NOT EXISTS", "CREATE TABLE IF NOT EXISTS", "CREATE TABLE", "CREATE VIEW"});
    
    public CommonResponse deleteDataModelAssociatedInformation(HttpServletRequest request, String modelId) {
        try {
            if (StringUtils.isNotBlank(modelId)) {
                String tenantId = getTenantId(request);
	            String [] ids = modelId.split("_");
	            for(String id : ids){
	            	sQLExecute.executeOneSql(sQLPackageService.packageDropTableSql(id, tenantId));
//	                singleTableDefinitionTableService.deleteSingleTableDefinitionTablesById(modelId, tenantId);
	                dataModelItemService.deleteDataModelItemsByModelId(id, tenantId);
	                dataModelInfoService.deleteDataModelInfosByModelId(id, tenantId);
	            }
            }
            return new CommonResponse();
        } catch (MaoCommonException e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        }
    }
    
    private String getTenantId(HttpServletRequest request) throws MaoCommonException {
        try {
            return sessionManager.getTenantId(request);
        } catch (Exception e) {
            logger.error(e.getMessage());
            throw new MaoCommonException(e);
        }
    }
    
    public CommonResponse deleteTable(HttpServletRequest request, String tableName) {
        try {
            String tenantId = getTenantId(request);
            List<String> sqlList = new ArrayList<String>();
            sqlList.add(sQLPackageService.packageUseDataBaseSql(tenantId));
            sqlList.addAll(getTableNameAndTableType(tenantId, tableName));
            if (sqlList.size() > 1) {
                sQLExecute.executeMultipleSql(sqlList);
            }
            return new CommonResponse(CommonResponse.STATUS_SUCCESS, CommonResponse.MESSAGE_SUCCESS);
        } catch (MaoCommonException e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        }
    }
    
    private List<String> getTableNameAndTableType(String tenantId, String tableName) throws MaoCommonException {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("SELECT")
                     .append(" aaa.TABLE_NAME, aaa.TABLE_TYPE")
                     .append(" FROM information_schema.`TABLES` aaa")
                     .append(" WHERE aaa.TABLE_SCHEMA='d_tenant_")
                     .append(tenantId)
                     .append("'")
                     .append(" AND aaa.TABLE_NAME='")
                     .append(tableName)
                     .append("'");
        List<String> sqls = new ArrayList<String>();
        sqls.add(stringBuilder.toString());
        List<Map<String, Object>> executeMultipleDifferentTypesSql = sQLExecute.executeMultipleDifferentTypesSql(sqls);
        if (executeMultipleDifferentTypesSql == null || executeMultipleDifferentTypesSql.isEmpty()) {
            return new ArrayList<String>();
        }
        
        List<String> sqlList = new ArrayList<String>();
        Map<String, Object> map = executeMultipleDifferentTypesSql.get(0);
        Object tableType = map.get("TABLE_TYPE");
        if ("VIEW".equals(tableType)) {
            sqlList.add(sQLPackageService.packageDropViewSql(tableName, tenantId));
            return sqlList;
        }
        if ("BASE TABLE".equals(tableType)) {
            sqlList.add(sQLPackageService.packageDropTableSql(tableName, tenantId));
            return sqlList;
        }
        
        return new ArrayList<String>();
    }
    
    @SuppressWarnings("unchecked")
    public CommonResponse executeSql(String sqlStr) {
        if  (StringUtils.isBlank(sqlStr)) {
            String errMessage = "data is empty or null.";
            logger.error(errMessage);
            return new CommonResponse(CommonResponse.STATUS_FAIL, errMessage);
        }
        try {
            Map<String, String> readValue = new ObjectMapper().readValue(sqlStr, Map.class);
            
            List<String> requestSqls = handleSql(Arrays.asList(readValue.get("sql").split(";")));
            CommonResponse commonResponse = isQualifiedSql(requestSqls);
            if (commonResponse.getStatus() == CommonResponse.STATUS_FAIL) {
                return commonResponse;
            }
            List<String> sqls = new ArrayList<String>();
            sqls.add(sQLPackageService.packageUseDataBaseSql(DataModelController.getTenantId()));
            sqls.addAll(requestSqls);
            sQLExecute.executeMultipleSql(sqls);
            return new DataResponse(CommonResponse.STATUS_SUCCESS, CommonResponse.MESSAGE_SUCCESS, getTableNameOrViewNames(requestSqls));
        } catch (JsonParseException e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        } catch (JsonMappingException e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        } catch (IOException e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        } catch (MaoCommonException e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        }
    }
    
    @SuppressWarnings("unchecked")
    public Object executeQuerySql(String sqlStr, int offset, int limit) {
        if  (StringUtils.isBlank(sqlStr)) {
            String errMessage = "data is empty or null.";
            logger.error(errMessage);
            return new CommonResponse(CommonResponse.STATUS_FAIL, errMessage);
        }
        try {
            Map<String, String> readValue = new ObjectMapper().readValue(sqlStr, Map.class);
            
            List<String> queryDataSqls = new ArrayList<String>();
            String useDataBaseSql = sQLPackageService.packageUseDataBaseSql(DataModelController.getTenantId());
            queryDataSqls.add(useDataBaseSql);
            String sql = readValue.get("sql");
            StringBuilder queryDatasql = new StringBuilder(sql);
            queryDatasql.append(" LIMIT ")
                        .append(offset)
                        .append(",")
                        .append(limit);
            
            queryDataSqls.add(queryDatasql.toString());
            
            List<String> queryCountSqls = new ArrayList<String>();
            queryCountSqls.add(useDataBaseSql);
            StringBuilder qeurycountSql = new StringBuilder();
            String dataCountColumnName = "dataCount";
            qeurycountSql.append("SELECT ")
                         .append("count(*) ")
                         .append(dataCountColumnName)
                         .append(" FROM (")
                         .append(sql)
                         .append(") AS table_")
                         .append(new Date().getTime());
            queryCountSqls.add(qeurycountSql.toString());
            
            Map<String, Object> reustData = new  HashMap<String, Object>();
            reustData.put(CommonResponse.STATUS_STR, CommonResponse.STATUS_SUCCESS);
            reustData.put(CommonResponse.MESSAGE_STR, CommonResponse.MESSAGE_SUCCESS);
            reustData.put("rows", sQLExecute.executeQuerySqlUseDatabase(queryDataSqls));
            reustData.put("total", sQLExecute.executeQuerySqlUseDatabase(queryCountSqls).get(0).get(dataCountColumnName));
            
            return reustData;
        } catch (JsonParseException e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        } catch (JsonMappingException e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        } catch (IOException e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        } catch (MaoCommonException e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        }
    }

    private CommonResponse isQualifiedSql(List<String> requestSqls) {
        List<String> includeWordList = new ArrayList<String>(includeWords);
        for (int i = 0; i < requestSqls.size(); i++) {
            String sql = requestSqls.get(i);
            if (!(isContainsKeyOrkeyLower(sql, includeWordList.get(0))
                    || isContainsKeyOrkeyLower(sql, includeWordList.get(1))
                    || isContainsKeyOrkeyLower(sql, includeWordList.get(2))
                    || isContainsKeyOrkeyLower(sql, includeWordList.get(3)))) {
                return new CommonResponse(CommonResponse.STATUS_FAIL, "只允许执行创建表或者视图的语句。");
            }
        }
        return new CommonResponse(CommonResponse.STATUS_SUCCESS, CommonResponse.MESSAGE_SUCCESS);
    }

    private List<String> handleSql(List<String> requestSqls) {
        List<String> sqls = new ArrayList<String>();
        for (int i = 0, len = requestSqls.size(); i < len; i++) {
            String sql = requestSqls.get(i);
            String newSql = sql.replaceAll("\r\n", " ")
                               .replaceAll("\n", " ")
                               .replaceAll("\r", " ")
                               .replaceAll("\t", " ")
                               .replaceAll(System.getProperty("line.separator"), " ")
                               .replaceAll(" +", " ")
                               .trim();
            if (StringUtils.isNotBlank(newSql)) {
                sqls.add(newSql);
            }
        }
        return sqls;
    }

    private List<String> getTableNameOrViewNames(List<String> createSqls) {
        List<String> resultData = new ArrayList<String>();
        List<String> includeWordList = new ArrayList<String>(includeWords);
        for (String sql: createSqls) {
            if (isContainsKeyOrkeyLower(sql, includeWordList.get(0))) {
                resultData.add(getTableOrViewName(sql, includeWordList.get(0)));
            } else if (isContainsKeyOrkeyLower(sql, includeWordList.get(1))) {
                resultData.add(getTableOrViewName(sql, includeWordList.get(1)));
            } else if (isContainsKeyOrkeyLower(sql, includeWordList.get(2))) {
                resultData.add(getTableOrViewName(sql, includeWordList.get(2)));
            } else if (isContainsKeyOrkeyLower(sql, includeWordList.get(3))) {
                resultData.add(getTableOrViewName(sql, includeWordList.get(3)));
            } else {
                
            }
        }
        return resultData;
    }

    private String getTableOrViewName(String sql, String includeWord) {
        StringBuilder regex = new StringBuilder("(?i)");
        regex.append(includeWord);
        return sql.replaceAll(regex.toString(), "")
                  .trim()
                  .replace("(", " ")
                  .split(" ")[0]
                  .replace("`", "");
    }
    
    public boolean isContainsKeyOrkeyLower(String sql, String key) {
        Pattern pattern = Pattern.compile(key, Pattern.CASE_INSENSITIVE); 
        Matcher matcher = pattern.matcher(sql);
        return matcher.find();
    }
    
    public CommonResponse createTableByModel(HttpServletRequest request, String modelId) {
        try {
            List<String> sqls = new ArrayList<String>();
            String tenantId = getTenantId(request);
            Set<DataModelItem> dataModelItems = dataModelItemService.getDataModelItems(new HashSet<String>(Arrays.asList(new String [] {modelId})), tenantId);
            sqls.add(sQLPackageService.packageUseDataBaseSql(tenantId));
            sqls.add(sQLPackageService.packageDropTableSql(modelId, tenantId));
            sqls.add(sQLPackageService.getCreateTableSql(new ArrayList<DataModelItem>(dataModelItems), modelId, tenantId));
            sQLExecute.executeMultipleSql(sqls);
            return new CommonResponse(CommonResponse.STATUS_SUCCESS, CommonResponse.MESSAGE_SUCCESS);
        } catch (MaoCommonException e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        }
    }
}
