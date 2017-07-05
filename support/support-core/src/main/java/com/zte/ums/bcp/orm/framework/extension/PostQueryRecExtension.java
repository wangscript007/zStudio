package com.zte.ums.bcp.orm.framework.extension;

import javax.servlet.http.HttpServletRequest;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.request.entry.RequestQueryRecord;
import com.zte.ums.bcp.orm.framework.response.entry.QueryResponseInfo;

/**
 * ORM-Server扩展点接口，用于ORM数据库操作后进行二次开发
 * @author 10191081
 *
 */
public interface PostQueryRecExtension {

	/**
	 * 
	 * @param requestQueryRecord  查询请求数据对象
	 * @param queryResultRecord  查询请求ORM操作返回结果数据对象
	 * @return
	 */
	QueryResponseInfo afterQueryRecordExtension(HttpServletRequest request, RequestQueryRecord requestQueryRecord, QueryResponseInfo queryResultRecord) throws OrmException;
}
