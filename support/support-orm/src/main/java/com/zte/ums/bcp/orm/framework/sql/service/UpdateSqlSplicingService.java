package com.zte.ums.bcp.orm.framework.sql.service;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.I18n;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.UpdateCondition;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.DataExpression;
import com.zte.ums.bcp.orm.framework.request.entry.RequestUpdateRecord;
import com.zte.ums.bcp.orm.framework.sql.keyword.PublicKeyword;
import com.zte.ums.bcp.orm.framework.sql.util.DBHelper;
import com.zte.ums.bcp.orm.framework.sql.util.DBTableNameHelper;
import com.zte.ums.bcp.orm.framework.sql.util.SpecialHandlingUtil;
import com.zte.ums.bcp.orm.framework.systemproperty.service.DatabasePropertyService;

@Service
public class UpdateSqlSplicingService {

    @Resource
    private WhereContionSqlSplicingService whereContionSqlSplicingService;

    @Resource
    private DatabasePropertyService databasePropertyService;
    @Resource
    private DBTableNameHelper dbTableNameHelper;
    @Resource(name = "dbHelper")
    private DBHelper dbHelper;
    @Resource
    private I18n i18n;

    public List<String> splicingUpdateSql(RequestUpdateRecord requestUpdateRecord) throws OrmException {
        if (requestUpdateRecord == null) {
            throw new IllegalArgumentException(i18n.i18n(I18n.INVALID_PARAMETER, "requestUpdateRecord"));
        }
        String tableName = requestUpdateRecord.getTableName();
        if (StringUtils.isBlank(tableName)) {
            throw new OrmException(i18n.i18n(I18n.MISS_ATTRIBUTE, "requestUpdateRecord.tableName"));
        }
        List<UpdateCondition> updateConditionList = requestUpdateRecord.getUpdateConditions();
        if (CollectionUtils.isEmpty(updateConditionList)) {
            throw new OrmException(i18n.i18n(I18n.MISS_ATTRIBUTE, "requestUpdateRecord.updateConditionList"));
        }
        String databaseName = requestUpdateRecord.getDatabaseName();
        List<String> updateSqlList = new ArrayList<String>();
        for (UpdateCondition updateCondition : updateConditionList) {
            List<DataExpression> dataExpressions = updateCondition.getDataExpressions();
            if (CollectionUtils.isEmpty(dataExpressions)) {
                continue;
            }
            String fieldSqlSegment = getUpdateFieldSqlSegment(dataExpressions);
            String mainSqlSegment = getUpdateMainSqlSegment(dbTableNameHelper.getTableName(databaseName, tableName, false));
            String conditinSqlSegment = whereContionSqlSplicingService.splicingWhereContionSql(updateCondition.getWhereCondition());
            updateSqlList.add(mainSqlSegment + " " + fieldSqlSegment + " " + conditinSqlSegment);
        }
        return updateSqlList;
    }

    private String getUpdateMainSqlSegment(String tableName) {
        return PublicKeyword.KEY_UPDATE + " " + tableName + " " + PublicKeyword.KEY_SET;
    }

    private String getUpdateFieldSqlSegment(List<DataExpression> dataExpressions) {
        StringBuilder updateOneSqlFieldsStringBuilder = new StringBuilder();
        for (int i = 0; i < dataExpressions.size(); i++) {
            DataExpression dataExpression = dataExpressions.get(i);
            if (null != dataExpression.getField() && !dataExpression.getField().isEmpty()) {
                updateOneSqlFieldsStringBuilder.append(dbHelper.getFieldName(dataExpression.getField()));
                updateOneSqlFieldsStringBuilder.append("=");
                String value = dataExpression.getValue();
                if (value == null) {
                    updateOneSqlFieldsStringBuilder.append("null");
                } else {
                    updateOneSqlFieldsStringBuilder.append("'").append(SpecialHandlingUtil.handlingValueWithSingleQuotes(value)).append("'");
                }
                if (i != (dataExpressions.size() - 1)) {
                    updateOneSqlFieldsStringBuilder.append(" , ");
                }
            }
        }
        return updateOneSqlFieldsStringBuilder.toString();
    }
}
