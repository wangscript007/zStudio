package com.zte.ums.bcp.orm.framework.extension;

import javax.servlet.http.HttpServletRequest;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.request.entry.RequestDeleteRecord;

/**
 * ORM-Server扩展点接口，用于删除数据
 * @author 10191081
 *
 */
public interface PreDeleteRecExtension {
	
	/**
	 * 删除记录扩展方法
	 * @param requestDeleteRecord 删除记录请求对象
	 * @return 二次开发后的删除记录请求
	 */
	RequestDeleteRecord preDeleteRecordExtension(HttpServletRequest request, RequestDeleteRecord requestDeleteRecord) throws OrmException;
}
