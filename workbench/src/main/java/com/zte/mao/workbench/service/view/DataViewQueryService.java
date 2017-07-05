package com.zte.mao.workbench.service.view;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.common.response.DataResponse;
import com.zte.mao.workbench.entity.model.DataViewInfo;
import com.zte.mao.workbench.service.SQLExecute;
import com.zte.mao.workbench.service.SQLPackageService;
import com.zte.mao.workbench.service.orm.DataViewInfoService;

@Service
public class DataViewQueryService {
    private static Logger logger = Logger.getLogger(DataViewQueryService.class);
    @Resource
    private DataViewInfoService dataViewInfoService;
    @Resource
    private DataViewCreateService dataViewCreateService;
    @Resource
    private SQLPackageService sQLPackageService;
    @Resource
    private SQLExecute sQLExecute;
    
    @SuppressWarnings("unchecked")
    public CommonResponse load(String ids, String tenantId) {
        try {
            Set<String> ViewIds = new HashSet<String>();
            if (StringUtils.isNotBlank(ids)) {
                ViewIds = new ObjectMapper().readValue(ids, Set.class);
            }
            List<DataViewInfo> dataViewInfos = dataViewInfoService.getDataViewInfos(ViewIds, tenantId);
            return new DataResponse(DataResponse.STATUS_SUCCESS, DataResponse.MESSAGE_SUCCESS, dataViewInfos);
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
    
    public Object executeQueryView(String dataViewInfoContent, int offset, int limit, String tenantId) {
        if  (StringUtils.isBlank(dataViewInfoContent)) {
            String errMessage = "data is empty or null.";
            logger.error(errMessage);
            return new CommonResponse(CommonResponse.STATUS_FAIL, errMessage);
        }
        try {
            List<String> queryDataSqls = new ArrayList<String>();
            String useDataBaseSql = sQLPackageService.packageUseDataBaseSql(tenantId);
            queryDataSqls.add(useDataBaseSql);
            String sql = dataViewCreateService.getViewSql(dataViewCreateService.getDataViewInfo(dataViewInfoContent));
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
}