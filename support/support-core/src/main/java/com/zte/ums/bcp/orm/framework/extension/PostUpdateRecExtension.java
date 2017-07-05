package com.zte.ums.bcp.orm.framework.extension;

import javax.servlet.http.HttpServletRequest;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.request.entry.RequestUpdateRecord;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseInfo;

/**
 * ORM-Server 数据更新后扩展点接口
 * @author 10191081
 *
 */
public interface PostUpdateRecExtension {

	/**
	 * 
	 * @param requestUpdateRecord  更新请求数据对象
	 * @param resultRecord  更新请求ORM操作返回结果数据对象
	 * @return
	 */
	ResponseInfo afterUpdateRecordExtension(HttpServletRequest request, RequestUpdateRecord requestUpdateRecord, ResponseInfo resultRecord) throws OrmException;
}
