package com.zte.ums.bcp.orm.framework.extension;

import javax.servlet.http.HttpServletRequest;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.request.entry.RequestUpdateRecord;

/**
 * ORM-Server扩展点接口，用于更新数据
 * @author 10191081
 *
 */
public interface PreUpdateRecExtension {
	
	/**
	 * 更新数据扩展方法
	 * @param requestUpdateRecord  更新记录请求对象
	 * @return 二次开发后的更新记录请求
	 */
	RequestUpdateRecord preUpdateRecordExtension(HttpServletRequest request, RequestUpdateRecord requestUpdateRecord) throws OrmException;
}
