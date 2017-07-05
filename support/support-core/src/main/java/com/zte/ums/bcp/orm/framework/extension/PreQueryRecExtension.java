package com.zte.ums.bcp.orm.framework.extension;

import javax.servlet.http.HttpServletRequest;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.request.entry.RequestQueryRecord;

/**
 * ORM-Server扩展点接口，用于查询数据
 * @author 10191081
 *
 */
public interface PreQueryRecExtension {

	/**
	 * 数据查询扩展接口
	 * @param requestQueryRecord   查询记录请求对象
	 * @return 二次开发后的查询记录请求
	 */
	RequestQueryRecord preQueryRecordExtension(HttpServletRequest request, RequestQueryRecord requestQueryRecord) throws OrmException;
}
