package com.zte.ums.bcp.orm.framework.extension.demo;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.extension.PreQueryRecExtension;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.Field;
import com.zte.ums.bcp.orm.framework.request.entry.RequestQueryRecord;

/**
 * 查询扩展ORM操作前接口测试
 * @author 10191081
 *
 */
@Service("preQueryRecUser1ExtensionService")
public class PreQueryRecUser1ExtensionService implements PreQueryRecExtension {


	@Override
	public RequestQueryRecord preQueryRecordExtension(HttpServletRequest request,
			RequestQueryRecord requestQueryRecord) throws OrmException {
		List<Field> fields = requestQueryRecord.getQueryCondition().getFields();
		logger.info("扩展前调用查询条件：" + getExtensionCond(fields));
		//扩展点实现，去掉查询项的第一项
		fields.remove(0);
		logger.info("去掉查询条件第一项后查询条件：" + getExtensionCond(fields));
		return requestQueryRecord;
	}
	
	private String getExtensionCond(List<Field> fields) {
		StringBuilder sb = new StringBuilder();
		for (Field field : fields) {
			String databaseName = field.getDatabaseName();
			String tableName = field.getTableName();
			String name = field.getName();
			if (databaseName != null) 
				sb.append(databaseName).append(".");
			if (tableName != null)
				sb.append(tableName).append(".");
			if (name != null)
				sb.append(name).append(",");
		}
		sb.substring(0, sb.toString().length() - 1);
		return sb.toString();
	}
	private static final Logger logger = LogManager.getLogger(PreQueryRecUser1ExtensionService.class);
}
