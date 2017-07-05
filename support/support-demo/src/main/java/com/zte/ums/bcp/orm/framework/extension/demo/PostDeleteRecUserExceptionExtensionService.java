package com.zte.ums.bcp.orm.framework.extension.demo;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.extension.PostDeleteRecExtension;
import com.zte.ums.bcp.orm.framework.request.entry.RequestDeleteRecord;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseInfo;
@Service("postDeleteRecUserExceptionExtensionService")
public class PostDeleteRecUserExceptionExtensionService implements
		PostDeleteRecExtension {

	@Override
	public ResponseInfo afterDeleteRecordExtension(HttpServletRequest request,
			RequestDeleteRecord requestDeleteRecord, ResponseInfo resultRecord)
			throws OrmException {
		// 扩展点实现逻辑，给ORM操作后的返回结果加上当前时间
		logger.error("测试抛异常");
		throw new OrmException("测试抛异常");
	}

	private static final Logger logger = LogManager
			.getLogger(PostDeleteRecUserExceptionExtensionService.class);
}