package com.zte.ums.bcp.orm.framework.extension.demo;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.extension.PostUpdateRecExtension;
import com.zte.ums.bcp.orm.framework.request.entry.RequestUpdateRecord;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseInfo;

/**
 * 更新扩展ORM操作后接口测试
 * @author 10191081
 *
 */
@Service("postUpdateRecUser1ExtensionService")
public class PostUpdateRecUser1ExtensionService implements
		PostUpdateRecExtension {

	@Override
	public ResponseInfo afterUpdateRecordExtension(HttpServletRequest request,RequestUpdateRecord requestUpdateRecord, ResponseInfo resultRecord) throws OrmException {
		int status = 0;
		String message = null;
		if (resultRecord != null) {
			status = resultRecord.getStatus();
			message = resultRecord.getMessage();
		}
		logger.info("更新接口ORM操作后返回状态：" + status + ", 消息：" + message);
		return resultRecord;
	}
	private static final Logger logger = LogManager.getLogger(PostUpdateRecUser1ExtensionService.class);
}
