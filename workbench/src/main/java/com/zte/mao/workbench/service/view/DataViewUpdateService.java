package com.zte.mao.workbench.service.view;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.workbench.entity.model.DataViewBase;
import com.zte.mao.workbench.entity.model.DataViewInfo;
import com.zte.mao.workbench.service.SQLExecute;
import com.zte.mao.workbench.service.SQLPackageService;
import com.zte.mao.workbench.service.orm.DataViewBaseService;

@Service
public class DataViewUpdateService {
    private static Logger logger = Logger.getLogger(DataViewUpdateService.class);
    @Resource
    private SQLExecute sqlExecute;
    @Resource
    private DataViewCreateService dataViewCreateService;
    @Resource
    private DataViewDeleteService dataViewDeleteService;
    @Resource
    private SQLPackageService sQLPackageService;
    @Resource
    private DataViewBaseService dataViewBaseService;
    
    
    public CommonResponse update(String dataViewInfoContent, String tenantId) {
        try {
            if (StringUtils.isBlank(dataViewInfoContent)) {
                String errorMessage = "data is empty.";
                logger.error(errorMessage);
                return new CommonResponse(CommonResponse.STATUS_FAIL, errorMessage);
            }
            DataViewInfo dataViewInfo = dataViewCreateService.getDataViewInfo(dataViewInfoContent);
            Set<String> viewIds = new HashSet<String>();
            viewIds.add(dataViewInfo.getDataViewBase().getId());
            dataViewInfo = handleDataViewBase(dataViewInfo, tenantId, viewIds);
            sqlExecute.executeMultipleSql(getSqls(tenantId, dataViewInfo, viewIds));
            return new CommonResponse(CommonResponse.STATUS_SUCCESS, CommonResponse.MESSAGE_SUCCESS);
        } catch (JsonProcessingException e) {
            logger.error(e.getMessage(), e);
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        } catch (MaoCommonException e) {
            logger.error(e.getMessage(), e);
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        }
    }


    private DataViewInfo handleDataViewBase(DataViewInfo dataViewInfo, String tenantId, Set<String> viewIds)
            throws MaoCommonException {
        List<DataViewBase> dataViewBases = dataViewBaseService.getDataViewBases(viewIds, tenantId);
        if (dataViewBases.isEmpty()) {
            String errorMessage = "data is not exist.";
            logger.error(errorMessage);
            throw new MaoCommonException(errorMessage);
        }
        DataViewBase dataViewBase = dataViewInfo.getDataViewBase();
        DataViewBase oldDataViewBase = dataViewBases.get(0);
        dataViewBase.setCreateTime(oldDataViewBase.getCreateTime())
                    .setCreator(oldDataViewBase.getCreator())
                    .setUpdateTime(new Date());
        dataViewInfo.setDataViewBase(dataViewBase);
        return dataViewInfo;
    }


    private List<String> getSqls(String tenantId, DataViewInfo dataViewInfo,
            Set<String> viewIds) throws MaoCommonException {
        List<String> sqls = new ArrayList<String>();
        sqls.add(sQLPackageService.packageUseDataBaseSql(tenantId));
        sqls.addAll(dataViewDeleteService.getDeleteSqlsAndDropViewSqls(viewIds));
        sqls.addAll(dataViewCreateService.getSqls(dataViewInfo));
        return sqls;
    }
}
