package com.zte.ums.bcp.orm.tabledata.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.transaction.annotation.Transactional;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.AddRecordCondition;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.DataExpression;
import com.zte.ums.bcp.orm.framework.request.entry.RequestAddRecord;
import com.zte.ums.bcp.orm.framework.sql.service.InsertSqlSplicingService;
import com.zte.ums.bcp.orm.framework.systemproperty.service.DatabasePropertyService;
import com.zte.ums.bcp.orm.tabledata.dao.GeneralMapper;
import com.zte.ums.bcp.orm.tablemessage.service.AbstractTableMessageSqlService;
import com.zte.ums.bcp.orm.utils.ResultUtils;
import com.zte.ums.bcp.orm.utils.SpringContextUtils;

public abstract class OrmAddRecordService implements AddRecordService {
    private static final Logger dMsg = Logger.getLogger(OrmAddRecordService.class.getName());
    
    @Resource
    protected GeneralMapper generalMapper;

    @Resource
    private AbstractTableMessageSqlService tableMessageSqlService;
    
    @Resource
    private InsertSqlSplicingService insertSqlSplicingService;
    
    @Resource
    private DatabasePropertyService databasePropertyService;
    
    @Resource
    private SpringContextUtils springContextUtils;

    @Override
    @Transactional(rollbackFor=Exception.class)
    public Map<String, Object> addRecord(RequestAddRecord requestAddRecord) throws OrmException {
        Map<String, Object> resultMap = new HashMap<String, Object>();
        List<String> sqlList = insertSqlSplicingService.getMultiInsertSqlForMultidata(requestAddRecord);
        List<AddRecordCondition> addRecords = requestAddRecord.getAddRecordConditions();
        
        String dbName=requestAddRecord.getDatabaseName();
        dbName = StringUtils.isNotBlank(dbName) ? dbName : databasePropertyService.getMainDataBaseName();
        List<String> priKeys = new LinkedList<String>();
        String tableName = requestAddRecord.getTableName();
        Map<String, Boolean> primaryColumnMap = getPrimaryColumnMap(tableName, dbName);
        String autoIncreasedColumn = getAutoIncreasedColumn(primaryColumnMap);
        for (Iterator<String> iterator2 = sqlList.iterator(); iterator2.hasNext();) {
            String sql =  iterator2.next();
            resultMap = insertRecord(primaryColumnMap, addRecords.get(0).getDataExpressions(), sql, priKeys, tableName, autoIncreasedColumn);
            addRecords.remove(0);
        }
        return resultMap;
    }

	private String getAutoIncreasedColumn(Map<String, Boolean> primaryColumnMap) {
		String autoIncreasedColumn = null;
        Iterator<Map.Entry<String, Boolean>> iterator = primaryColumnMap.entrySet().iterator();
        while (iterator.hasNext()) {
			Map.Entry<String, Boolean> entry = (Map.Entry<String, Boolean>) iterator.next();
			if (entry.getValue().booleanValue() == true) {
				autoIncreasedColumn = entry.getKey();
			}
		}
		return autoIncreasedColumn;
	}
    
    private Map<String, Object> insertRecord(
    		Map<String, Boolean> primaryColumnMap, 
    		List<DataExpression> dataExpressionList,
			String sql,
			List<String> priKeys,
			String tableName, String autoIncreasedColumn) throws OrmException {
		Map<String, Object> priKeyValMap = new LinkedHashMap<String, Object>();

		List<String> columnNameList = new ArrayList<String>();
		for (int i = 0; i < dataExpressionList.size(); i++) {
			DataExpression dataExpression = dataExpressionList.get(i);
			String field = dataExpression.getField();
			String value = dataExpression.getValue();
			columnNameList.add(field);
			if (primaryColumnMap.containsKey(field)) {
				priKeys.add(value);
				priKeyValMap.put(field, priKeys);
			}
		}

		try {
			int i = generalMapper.insert(sql);
			if (i > 0) {
				if (null != autoIncreasedColumn && !columnNameList.contains(autoIncreasedColumn)) {
					int autoIncrementVal = selectAutoIncrementVal();
					priKeys.add(String.valueOf(autoIncrementVal));
					priKeyValMap.put(autoIncreasedColumn, priKeys);
				}
				return ResultUtils.insertSuccess(priKeyValMap);
			} else {
				return ResultUtils.returnFail("插入数据失败");
			}
		} catch (Exception e) {
			dMsg.error(e.getMessage(), e);
			throw new OrmException("插入数据失败" + e.getLocalizedMessage(), e);
		}
	}

	protected Map<String, Boolean> getPrimaryColumnMap(String tableName, String dbName) {
        String primaryKeySql = tableMessageSqlService.getPrimaryKeySql(tableName, dbName);
        List<LinkedHashMap<String, String>> priKeyList = generalMapper.selectPriKeySql(primaryKeySql);
		return toColumnInfoList(priKeyList, tableName);
	}
    
    protected abstract Map<String, Boolean> toColumnInfoList(List<LinkedHashMap<String, String>> priKeyList, String tableName);

	protected abstract int selectAutoIncrementVal();

	@Override
    public Map<String, Object> execute(String sql, String db) throws Exception {
        if (StringUtils.isNotBlank(db)) {
            generalMapper.insert("use " + db + ";");
        }
        generalMapper.insert(sql);
        return ResultUtils.insertSuccess(new HashMap<String, Object>());
    }
}
