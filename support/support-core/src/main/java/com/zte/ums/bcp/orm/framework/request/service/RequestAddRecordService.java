package com.zte.ums.bcp.orm.framework.request.service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.service.AddRecordJsonParseService;
import com.zte.ums.bcp.orm.framework.request.entry.RequestAddRecord;

@Service
public class RequestAddRecordService {

	@Resource
	private AddRecordJsonParseService addRecordJsonParseService;
	
	public RequestAddRecord getRequestAddRecord(HttpServletRequest request, String tableName, String addRecordJson) throws OrmException {
		
		RequestAddRecord requestAddRecord = new RequestAddRecord();
		requestAddRecord.setTableName(tableName);
		requestAddRecord.setAddRecordConditions(addRecordJsonParseService.parseAddRecordJson(addRecordJson));
		requestAddRecord.setDatabaseName(addRecordJsonParseService.parseDataBaseJson(request, addRecordJson));
		
		return requestAddRecord;
	}
}
