package com.zte.ums.bcp.orm.framework.sql.service;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.I18n;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.AddRecordCondition;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.DataExpression;
import com.zte.ums.bcp.orm.framework.request.entry.RequestAddRecord;
import com.zte.ums.bcp.orm.framework.sql.keyword.PublicKeyword;
import com.zte.ums.bcp.orm.framework.sql.util.DBHelper;
import com.zte.ums.bcp.orm.framework.sql.util.DBTableNameHelper;
import com.zte.ums.bcp.orm.framework.sql.util.SpecialHandlingUtil;
import org.apache.log4j.Logger;

@Service
public class InsertSqlSplicingService {
    private static final Logger dMsg = Logger.getLogger(InsertSqlSplicingService.class.getName());
    @Resource
    private DBTableNameHelper dbTableNameHelper;
    @Resource(name = "dbHelper")
    private DBHelper dbHelper;
    @Resource
    private I18n i18n;

	public List<String> getMultiInsertSqlForMultidata(RequestAddRecord requestAddRecord) throws OrmException {
        if (requestAddRecord == null) {
            throw new IllegalArgumentException(i18n.i18n(I18n.INVALID_PARAMETER, "requestAddRecord"));
        }
        String tableName = requestAddRecord.getTableName();
        if (StringUtils.isBlank(tableName)) {
            throw new OrmException(i18n.i18n(I18n.MISS_ATTRIBUTE, "requestAddRecord.tableName"));
        }
        List<AddRecordCondition> addRecordConditionList = requestAddRecord.getAddRecordConditions();
        if (addRecordConditionList == null || addRecordConditionList.isEmpty()) {
            throw new OrmException(i18n.i18n(I18n.MISS_ATTRIBUTE, "requestAddRecord.addRecordConditions"));
        }
        String databaseName = requestAddRecord.getDatabaseName();
		List<String> insertSqlList = new ArrayList<String>();
        for (AddRecordCondition addRecordCondition : addRecordConditionList) {
            List<DataExpression> dataExpressions = addRecordCondition.getDataExpressions();
            if (CollectionUtils.isEmpty(dataExpressions)) {
                dMsg.warn("....");
                continue;
            }
            String mainSqlSegment = getInsertMainSqlSegment(dbTableNameHelper.getTableName(databaseName,tableName, false));
            String valueSqlSegment = getInsertValueSqlSegment(dataExpressions);
            insertSqlList.add(mainSqlSegment+valueSqlSegment);
        }
        if (insertSqlList.isEmpty()) {
            throw new OrmException(i18n.i18n(I18n.MISS_ATTRIBUTE, "requestAddRecord.addRecordConditions"));
		}
		return insertSqlList;
	}
	
    private String getInsertMainSqlSegment(String tableName) {
        return PublicKeyword.KEY_INSERT_INTO + " " + tableName;
    }
	
	private String getInsertValueSqlSegment(List<DataExpression> dataExpressions) {
		StringBuilder insertSqlColumnAndValueSegment = new StringBuilder();
		StringBuilder columnBuilder = new StringBuilder();
		columnBuilder.append("(");
		StringBuilder valueBuilder = new StringBuilder();
		valueBuilder.append("(");
		if (null != dataExpressions && !dataExpressions.isEmpty()) {
			 for (int i = 0; i < dataExpressions.size(); i++) {
				 columnBuilder.append(dbHelper.getFieldName(dataExpressions.get(i).getField()));
				 valueBuilder.append("'");
				 valueBuilder.append(SpecialHandlingUtil.handlingValueWithSingleQuotes(dataExpressions.get(i).getValue()));
				 valueBuilder.append("'");
				 if (i != (dataExpressions.size() - 1)) {
					 columnBuilder.append(",");
					 valueBuilder.append(",");
				 }
			}
		 }
		columnBuilder.append(")");
		valueBuilder.append(")");
		insertSqlColumnAndValueSegment.append(columnBuilder);
		insertSqlColumnAndValueSegment.append(" ");
		insertSqlColumnAndValueSegment.append(PublicKeyword.KEY_VALUES);
		insertSqlColumnAndValueSegment.append(" ");
		insertSqlColumnAndValueSegment.append(valueBuilder);
		return insertSqlColumnAndValueSegment.toString();
	}
}
