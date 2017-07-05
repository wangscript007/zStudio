package com.zte.ums.bcp.orm.framework.extension;

import javax.servlet.http.HttpServletRequest;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.request.entry.RequestAddRecord;
import com.zte.ums.bcp.orm.framework.response.entry.AddReponseInfo;

/**
 * ORM-Server After，对数据库操作后的扩展接口
 * @author 10191081
 *
 */
public interface PostInsertRecExtension {

	/**
	 * 新增接口ORM操作返回结果
	 * @param requestAddRecord  新增请求数据对象
	 * @param addResultRecord   新增ORM操作返回结果数据对象
	 * @return
	 */
	AddReponseInfo afterAddRecordExtension(HttpServletRequest request, RequestAddRecord requestAddRecord, AddReponseInfo addResultRecord) throws OrmException;
}
