package com.zte.ums.bcp.orm.tabledata.service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service(value="addRecordService")
public class MySqlAddRecordService extends OrmAddRecordService {

	protected int selectAutoIncrementVal() {
		return generalMapper.selectMysqlAutoIncrementVal();
	}

	@Override
	protected Map<String, Boolean> toColumnInfoList(
			List<LinkedHashMap<String, String>> priKeyList, String tableName) {
		Map<String, Boolean> primaryColumnMap = new HashMap<String, Boolean>();
		for (int i = 0; i < priKeyList.size(); i++) {
			LinkedHashMap<String, String> map = priKeyList.get(i);
			String columnName = map.get("columnName");
			boolean isAutoIncreased = false;
			String extra = map.get("extra");
			if (StringUtils.equals(extra, "auto_increment")) {
				isAutoIncreased = true;
			}
			primaryColumnMap.put(columnName, isAutoIncreased);
		}
		return primaryColumnMap;
	}
}
