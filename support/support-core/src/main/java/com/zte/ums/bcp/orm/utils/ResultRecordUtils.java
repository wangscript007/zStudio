package com.zte.ums.bcp.orm.utils;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.zte.ums.bcp.orm.framework.response.entry.AddReponseInfo;
import com.zte.ums.bcp.orm.framework.response.entry.PrimaryKey;
import com.zte.ums.bcp.orm.framework.response.entry.QueryResponseInfo;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseInfo;

/**
 * ORM数据库操作返回结果工具类，封装返回结果
 * @author 10191081
 *
 */
@Component
public class ResultRecordUtils {
	
	/**
	 * 更新和删除接口ORM操作返回结果
	 * @param resultRec  ORM数据库操作返回结果Map对象
	 * @return
	 */
	public ResponseInfo getDelAndUpdateResult(Map<String, Object> resultRec) {
		ResponseInfo resultRecord = new ResponseInfo();
		int status = (Integer) resultRec.get(ConstantUtils.STATUS);
		String message = (String) resultRec.get(ConstantUtils.MESSAGE);
		resultRecord.setStatus(status);
		resultRecord.setMessage(message);
		
		return resultRecord;
	}
	
	/**
	 * 新增接口ORM操作返回结果
	 * @param resultRec  ORM数据库操作返回结果Map对象
	 * @param addResultRecord  二次开发扩展点返回对象
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public AddReponseInfo getAddResultRecord(Map<String, Object> resultRec, AddReponseInfo addResultRecord) {
		PrimaryKey primaryKey = new PrimaryKey();
		int status = (Integer) resultRec.get(ConstantUtils.STATUS);
		String message = (String) resultRec.get(ConstantUtils.MESSAGE);
		Map<String, Object> primaryKeyMap = (Map<String, Object>) resultRec.get("primaryKey");
		Set<String> keySet = primaryKeyMap.keySet();
		String key = "";
		if (keySet != null && keySet.size() > 0) {
			key =  keySet.iterator().next().toString();
		}
		List<String> idsList = (List<String>) primaryKeyMap.get(key);
		List<String> ids = new ArrayList<String>();
		if (idsList != null && idsList.size() > 0) {
			for (Iterator<String> iterator=idsList.iterator(); iterator.hasNext();) {
				String id = iterator.next();
				ids.add(id);
			}
		}
		primaryKey.setId(ids);
		
		addResultRecord.setStatus(status);
		addResultRecord.setMessage(message);
		addResultRecord.setPrimaryKey(primaryKey);
		return addResultRecord;
	}
	
	/**
	 * 查询接口ORM操作返回结果
	 * @param resultRec  ORM数据库操作返回结果Map对象
	 * @param queryResultRecord  二次开发扩展点返回对象
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public QueryResponseInfo getQueryResultRecord(Map<String, Object> resultRec, QueryResponseInfo queryResultRecord) {
		List<Map<String, Object>> rowsList = new ArrayList<Map<String,Object>>();
		int total = (Integer) resultRec.get("total");
		int status = (Integer) resultRec.get("status");
		List<Object> objectsList = (List<Object>) resultRec.get("rows");
		if (objectsList != null && objectsList.size() > 0) {
			for (Iterator<Object> iterator=objectsList.iterator(); iterator.hasNext();) {
				Map<String, Object> objectMap = (Map<String, Object>) iterator.next();
				if (objectMap != null) {
					rowsList.add(objectMap);
				}
			}
		}
		
		queryResultRecord.setTotal(total);
		queryResultRecord.setStatus(status);
		queryResultRecord.setRows(rowsList);
		return queryResultRecord;
	}
}
