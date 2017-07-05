package com.zte.ums.bcp.orm.framework.extension;

import javax.servlet.http.HttpServletRequest;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.request.entry.RequestAddRecord;

/**
 * ORM-Server扩展点接口，用于新增数据
 * @author 10191081
 *
 */
public interface PreInsertRecExtension {

	/**
	 * 数据新增扩展接口
	 * @param requestAddRecord  新增记录请求对象
	 * @return 二次开发后的新增记录请求
	 */
	RequestAddRecord preAddRecordExtension(HttpServletRequest request, RequestAddRecord requestAddRecord) throws OrmException;
}
