package com.zte.ums.bcp.orm.tabledata.service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service(value="addRecordService")
public class MsSqlAddRecordService extends OrmAddRecordService {

	protected int selectAutoIncrementVal() {
		return generalMapper.selectMSsqlAutoIncrementVal();
	}

	@Override
	protected Map<String, Boolean> toColumnInfoList(
			List<LinkedHashMap<String, String>> priKeyList, String tableName) {
		LinkedHashMap<String, String> autoIncrementCol = generalMapper.getAutoIncrementCol(tableName);
		String autoColName = null;
		if (autoIncrementCol != null) {
			autoColName = autoIncrementCol.get("name");
		}

		Map<String, Boolean> primaryColumnMap = new HashMap<String, Boolean>();
		for (int i = 0; i < priKeyList.size(); i++) {
			LinkedHashMap<String, String> map = priKeyList.get(i);
			String columnName = map.get("priKeyColName");
			boolean isAutoIncreased = false;
			if (StringUtils.equals(autoColName, columnName)) {
				isAutoIncreased = true;
			}
			primaryColumnMap.put(columnName, new Boolean(isAutoIncreased));
		}
		return primaryColumnMap;
	}
}
