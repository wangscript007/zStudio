package com.zte.ums.bcp.orm.framework.sql.service;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.I18n;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.WhereCondition;
import com.zte.ums.bcp.orm.framework.request.entry.RequestDeleteRecord;
import com.zte.ums.bcp.orm.framework.sql.keyword.PublicKeyword;
import com.zte.ums.bcp.orm.framework.sql.util.DBHelper;
import com.zte.ums.bcp.orm.framework.sql.util.DBTableNameHelper;

@Service
public class DeleteSqlSplicingService {
    @Resource
    private WhereContionSqlSplicingService whereContionSqlSplicingService;
    @Resource
    private DBTableNameHelper dbTableNameHelper;
    @Resource(name = "dbHelper")
    private DBHelper dbHelper;
    @Resource
    private I18n i18n;
    
    public String splicingDeleteSql(RequestDeleteRecord requestDeleteRecord) throws OrmException {
        if (requestDeleteRecord == null) {
            throw new IllegalArgumentException(i18n.i18n(I18n.INVALID_PARAMETER, "requestDeleteRecord"));
        }
        String tableName = requestDeleteRecord.getTableName();
        if (StringUtils.isBlank(tableName)) {
            throw new OrmException(i18n.i18n(I18n.MISS_ATTRIBUTE, "requestDeleteRecord.tableName"));
        }
        String databaseName = requestDeleteRecord.getDatabaseName();
        String mainSqlSegment = getDeleteMainSqlSegment(dbTableNameHelper.getTableName(databaseName, tableName, false));
        WhereCondition whereCondition = requestDeleteRecord.getWhereCondition();
        String conditionSqlSegment = whereContionSqlSplicingService.splicingWhereContionSql(whereCondition);
        return mainSqlSegment + " " + conditionSqlSegment;
    }

    private String getDeleteMainSqlSegment(String tableName) {
        return PublicKeyword.KEY_DELETE + " " + PublicKeyword.KEY_FROM + " " + tableName;
    }
}
