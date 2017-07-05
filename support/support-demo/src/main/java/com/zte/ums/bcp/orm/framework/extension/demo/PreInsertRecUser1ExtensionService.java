package com.zte.ums.bcp.orm.framework.extension.demo;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.extension.PreInsertRecExtension;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.AddRecordCondition;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.DataExpression;
import com.zte.ums.bcp.orm.framework.request.entry.RequestAddRecord;

/**
 * 新增扩展ORM操作前接口测试
 * @author 10191081
 *
 */
@Service("preInsertRecUser1ExtensionService")
public class PreInsertRecUser1ExtensionService implements PreInsertRecExtension {

	@Override
	public RequestAddRecord preAddRecordExtension(HttpServletRequest request,
			RequestAddRecord requestAddRecord) throws OrmException {
		logger.info("table name:" + requestAddRecord.getTableName());
		List<AddRecordCondition> addRecordConditions = requestAddRecord.getAddRecordConditions();
		AddRecordCondition addRecordCondition = addRecordConditions.get(0);
		List<DataExpression> dataExpressions = addRecordCondition.getDataExpressions();
		
		//扩展业务：给新增的第一条数据加上一列数据
		DataExpression dataExpression = new DataExpression();
		dataExpression.setField("birthdytime");
		dataExpression.setValue(simpleDateFormat.format(new Date(System.currentTimeMillis())));
		dataExpressions.add(dataExpression);
		
		requestAddRecord.setAddRecordConditions(addRecordConditions);
		return requestAddRecord;
	}
	SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	private static final Logger logger = LogManager.getLogger(PreInsertRecUser1ExtensionService.class);

}
