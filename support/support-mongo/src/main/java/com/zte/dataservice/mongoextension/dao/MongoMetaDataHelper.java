package com.zte.dataservice.mongoextension.dao;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.mongodb.CommandResult;
import com.mongodb.DB;
import com.zte.ums.bcp.orm.exception.OrmException;

@Service
public class MongoMetaDataHelper extends MongoHelperBase {
	/**
	 * 查询数据库表名称
	 * 
	 * @param dataBase
	 * @return
	 * @throws OrmException
	 */
	public List<LinkedHashMap<String, String>> queryTableName(String dataBase)
			throws OrmException {
		DB db = this.getDB(dataBase);
		Set<String> dbnames = db.getCollectionNames();
		List<LinkedHashMap<String, String>> mapList = new ArrayList<LinkedHashMap<String, String>>();
		for (String dbname : dbnames) {
			LinkedHashMap<String, String> map = new LinkedHashMap<String, String>();
			map.put("TABLE_NAME", dbname);
			mapList.add(map);
		}
		return mapList;
	}

	/**
	 * 查询数据库字段
	 * 
	 * @param tableName
	 * @param dataBase
	 * @return
	 * @throws OrmException
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List<LinkedHashMap<String, Object>> queryTableField(
			String tableName, String dataBase) throws OrmException {
		DB db = this.getDB(dataBase);
		CommandResult re = db.doEval("return db.getCollectionInfos({name:'"
				+ tableName + "'});");

		List<LinkedHashMap> tablesInfo = (List<LinkedHashMap>) re.get("retval");
		LinkedHashMap options = (LinkedHashMap) tablesInfo.get(0)
				.get("options");
		LinkedHashMap validator = (LinkedHashMap) options.get("validator");
		List<LinkedHashMap<String, Object>> lst = new ArrayList<LinkedHashMap<String, Object>>();
		for (Object key : validator.keySet()) {
			LinkedHashMap<String, Object> map = new LinkedHashMap<String, Object>();
			map.put("character_maximum_length", "null");
			map.put("column_name", key);

			LinkedHashMap fieldType = (LinkedHashMap) validator.get(key);
			if (fieldType != null) {
				map.put("data_type", fieldType.get("$type"));
			}

			lst.add(map);
		}

		return lst;
	}

}
