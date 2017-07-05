package com.zte.ums.bcp.orm.framework.extension.demo;

import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.extension.PostQueryRecExtension;
import com.zte.ums.bcp.orm.framework.request.entry.RequestQueryRecord;
import com.zte.ums.bcp.orm.framework.response.entry.QueryResponseInfo;

/**
 * 查询扩展ORM操作后接口测试
 * @author 10191081
 *
 */
@Service("postQueryRecUser1ExtensionService")
public class PostQueryRecUser1ExtensionService implements
		PostQueryRecExtension {


	@Override
	public QueryResponseInfo afterQueryRecordExtension(HttpServletRequest request,
			RequestQueryRecord requestQueryRecord, QueryResponseInfo queryResultRecord) throws OrmException {
		//查询ORM操作返回结果
		List<Map<String, Object>> rows = queryResultRecord.getRows();
		logger.info("返回结果rows：" + rows.toString());
		//扩展点操作，给查询结果的第一条记录加上当前时间
		Map<String, Object> map = rows.get(0);
		Date date = new Date(System.currentTimeMillis());
		map.put("查询时间", date);
		return queryResultRecord;
	}
	private static final Logger logger = LogManager.getLogger(PostQueryRecUser1ExtensionService.class);
}
