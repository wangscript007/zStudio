package com.zte.ums.bcp.orm.framework.extension;

import javax.servlet.http.HttpServletRequest;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.request.entry.RequestDeleteRecord;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseInfo;

/**
 * ORM-Server数据删除操作后扩展点接口
 * @author 10191081
 *
 */
public interface PostDeleteRecExtension {

	/**
	 * 
	 * @param requestDeleteRecord  删除请求数据对象
	 * @param resultRecord  删除ORM操作返回结果对象
	 * @return
	 */
	ResponseInfo afterDeleteRecordExtension(HttpServletRequest request, RequestDeleteRecord requestDeleteRecord, ResponseInfo resultRecord) throws OrmException;
}
