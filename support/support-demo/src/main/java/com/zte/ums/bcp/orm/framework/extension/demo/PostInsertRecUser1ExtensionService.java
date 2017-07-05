package com.zte.ums.bcp.orm.framework.extension.demo;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.extension.PostInsertRecExtension;
import com.zte.ums.bcp.orm.framework.request.entry.RequestAddRecord;
import com.zte.ums.bcp.orm.framework.response.entry.AddReponseInfo;

/**
 * 新增接口ORM操作后二次开发接口实现，注解命名为类名的第一个字母小写
 * @author 10191081
 *
 */
@Service("postInsertRecUser1ExtensionService")
public class PostInsertRecUser1ExtensionService implements
		PostInsertRecExtension {

	@Override
	public AddReponseInfo afterAddRecordExtension(HttpServletRequest request,
			RequestAddRecord requestAddRecord, AddReponseInfo addResultRecord) throws OrmException {
		logger.info("message:" + addResultRecord.getMessage() + ", primary key:" + addResultRecord.getPrimaryKey().getId().toString());
		return addResultRecord;
	}
	
	private static final Logger logger = LogManager.getLogger(PostInsertRecUser1ExtensionService.class);

}
