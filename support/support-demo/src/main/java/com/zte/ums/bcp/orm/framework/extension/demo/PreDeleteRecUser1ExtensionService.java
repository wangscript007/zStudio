package com.zte.ums.bcp.orm.framework.extension.demo;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.extension.PreDeleteRecExtension;
import com.zte.ums.bcp.orm.framework.request.entry.RequestDeleteRecord;

/**
 * 删除扩展ORM操作前接口测试
 * @author 10191081
 *
 */
@Service("preDeleteRecUser1ExtensionService")
public class PreDeleteRecUser1ExtensionService implements PreDeleteRecExtension {

	@Override
	public RequestDeleteRecord preDeleteRecordExtension(HttpServletRequest request,
			RequestDeleteRecord requestDeleteRecord) throws OrmException {
		logger.info("ORM操作前数据表名:" + requestDeleteRecord.getTableName());
		//扩展点实现操作，修改表名
		requestDeleteRecord.setTableName("zbaoxiao_chenbo");
		logger.info("修改删除的表名为:" + requestDeleteRecord.getTableName());
		return requestDeleteRecord;
	}
	private static final Logger logger = LogManager.getLogger(PreDeleteRecUser1ExtensionService.class);
}
