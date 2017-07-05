package com.zte.ums.bcp.orm.tablemessage.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.zte.dataservice.mongoextension.dao.MongoMetaDataHelper;
import com.zte.ums.bcp.orm.constant.IJsonConstant;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.response.entry.QueryTableNamesResponseInfo;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseInfo;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseStatus;
import org.apache.log4j.Logger;

@Service(value="queryTableNameService")
public class MongoQueryTableNameService implements QueryTableNameService {
	private static final Logger dMsg = Logger.getLogger(MongoQueryTableNameService.class.getName());
    @Resource
    private MongoMetaDataHelper mongoMetaDataHelper;
	
    public ResponseInfo getTableName(String database) {
        try {
            return getTableNameJson(mongoMetaDataHelper.queryTableName(database));
        } catch (OrmException e) {
            return new ResponseInfo(ResponseStatus.STATUS_FAIL, e.getLocalizedMessage());
        }
    }

	public QueryTableNamesResponseInfo getTableNameJson(
			List<LinkedHashMap<String, String>> tablenames) throws OrmException {
		StringBuilder tableNamesBuilder = new StringBuilder();
		List<String> tableNameList = new ArrayList<String>();

		for (Map<String, String> map : tablenames) {
			tableNameList.add(map.get("TABLE_NAME"));
		}

		Collections.sort(tableNameList);

		for (String tableName : tableNameList) {
			tableNamesBuilder.append(tableName).append(" ");
		}
		String substring = "";
		if (tableNamesBuilder.length() > 0) {
			substring = tableNamesBuilder.substring(0,
					tableNamesBuilder.length() - 1);
		}
		dMsg.debug("获取的表名:" + substring);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put(IJsonConstant.TABLENAMES, substring);
		return new QueryTableNamesResponseInfo(1, "", substring);
	}
}
