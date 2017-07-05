package com.zte.mao.workbench.service.view;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.workbench.def.TDataViewAssociated;
import com.zte.mao.workbench.def.TDataViewAssociatedConditon;
import com.zte.mao.workbench.def.TDataViewInfo;
import com.zte.mao.workbench.def.TDataViewItem;
import com.zte.mao.workbench.service.SQLExecute;
import com.zte.mao.workbench.service.SQLPackageService;

@Service
public class DataViewDeleteService {
    private static Logger logger = Logger.getLogger(DataViewDeleteService.class);
    @Resource
    private SQLPackageService sQLPackageService;
    @Resource
    private SQLExecute sqlExecute;
    
    
    @SuppressWarnings("unchecked")
    public CommonResponse delete(String viewIds, String tenantId) {
        try {
            if (StringUtils.isNotBlank(viewIds)) {
                List<String> sqls = new ArrayList<String>();
                sqls.add(sQLPackageService.packageUseDataBaseSql(tenantId));
                sqls.addAll(getDeleteSqlsAndDropViewSqls(new ObjectMapper().readValue(viewIds, Set.class)));
                sqlExecute.executeMultipleSql(sqls);
            }
            return new CommonResponse(CommonResponse.STATUS_SUCCESS, CommonResponse.MESSAGE_SUCCESS);
        } catch (JsonParseException e) {
            logger.error(e.getMessage(), e);
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        } catch (JsonMappingException e) {
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
    
    public List<String> getDeleteSqlsAndDropViewSqls(Set<String> viewIds) {
        List<String> sqls = new ArrayList<String>();
        sqls.addAll(getDeleteSqls(viewIds));
        sqls.addAll(getDropViewSqls(viewIds));
        return sqls;
    }
    
    private List<String> getDeleteSqls(Set<String> viewIds) {
        List<String> sqls = new ArrayList<String>();
        sqls.add(packageDeleteSql(viewIds, TDataViewInfo.NAME, TDataViewInfo.COL_NAME_ID));
        sqls.add(packageDeleteSql(viewIds, TDataViewAssociated.NAME, TDataViewAssociated.COL_NAME_VIEW_ID));
        sqls.add(packageDeleteSql(viewIds, TDataViewAssociatedConditon.NAME, TDataViewAssociatedConditon.COL_NAME_VIEW_ID));
        sqls.add(packageDeleteSql(viewIds, TDataViewItem.NAME, TDataViewItem.COL_NAME_VIEW_ID));
        return sqls;
    }
    
    private List<String> getDropViewSqls(Set<String> viewIds) {
        List<String> sqls = new ArrayList<String>();
        for (String viewId: viewIds) {
            sqls.add(getDropViewSql(viewId));
        }
        return sqls;
    }
    
    private String getDropViewSql(String viewId) {
        StringBuilder dropViewSqlBuilder = new StringBuilder();
        dropViewSqlBuilder.append("DROP VIEW IF EXISTS ")
                          .append(viewId);
        return dropViewSqlBuilder.toString();
    }
    
    private String packageDeleteSql(Set<String> viewIds, String tableName, String columnName) {
        StringBuilder deleteSql = new StringBuilder();
        deleteSql.append("DELETE FROM ")
                 .append(tableName)
                 .append(" WHERE ")
                 .append(columnName)
                 .append(" IN (")
                 .append(packageInCondition(viewIds))
                 .append(")");
        return deleteSql.toString();
    }
    
    private StringBuilder packageInCondition(Set<String> viewIds) {
        StringBuilder inConditionValue = new StringBuilder();
        List<String> ids = new ArrayList<String>(viewIds);
        for (int i = 0, len = ids.size(); i < len; i++) {
            if (i != 0) {
                inConditionValue.append(",");
            }
            inConditionValue.append(packageValueSqlFragment(ids.get(i)));
        }
        return inConditionValue;
    }
    
    private StringBuilder packageValueSqlFragment(String value) {
        StringBuilder valueSqlFragment = new StringBuilder();
        valueSqlFragment.append("'")
                        .append(value.replace("'", "''"))
                        .append("'");
        return valueSqlFragment;
    }
}
