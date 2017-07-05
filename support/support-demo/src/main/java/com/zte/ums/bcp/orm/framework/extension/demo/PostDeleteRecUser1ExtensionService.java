package com.zte.ums.bcp.orm.framework.extension.demo;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.extension.PostDeleteRecExtension;
import com.zte.ums.bcp.orm.framework.request.entry.RequestDeleteRecord;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseInfo;

/**
 * 删除扩展ORM操作后接口测试
 * @author 10191081
 *
 */
@Service("postDeleteRecUser1ExtensionService")
public class PostDeleteRecUser1ExtensionService implements
		PostDeleteRecExtension {

	@Override
	public ResponseInfo afterDeleteRecordExtension(HttpServletRequest request,
			RequestDeleteRecord requestDeleteRecord, ResponseInfo resultRecord) throws OrmException {
		//扩展点实现逻辑，给ORM操作后的返回结果加上当前时间
		Date date = new Date(System.currentTimeMillis());
		resultRecord.setMessage(date + " 操作结果：" + resultRecord.getMessage());
		logger.info(resultRecord.getMessage());
		return resultRecord;
	}
	
	private static final Logger logger = LogManager.getLogger(PostDeleteRecUser1ExtensionService.class);
}
