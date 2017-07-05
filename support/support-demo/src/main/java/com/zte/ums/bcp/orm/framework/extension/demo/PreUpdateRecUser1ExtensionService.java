package com.zte.ums.bcp.orm.framework.extension.demo;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.extension.PreUpdateRecExtension;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.UpdateCondition;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.DataExpression;
import com.zte.ums.bcp.orm.framework.request.entry.RequestUpdateRecord;

/**
 * 更新扩展ORM操作前接口测试
 * @author 10191081
 *
 */
@Service("preUpdateRecUser1ExtensionService")
public class PreUpdateRecUser1ExtensionService implements PreUpdateRecExtension {

	@Override
	public RequestUpdateRecord preUpdateRecordExtension(HttpServletRequest request,
			RequestUpdateRecord requestUpdateRecord) throws OrmException {
		//修改更新条件，新增一条更新项id，并将原来的id修改为12121
		List<UpdateCondition> updateConditions = requestUpdateRecord.getUpdateConditions();
		List<DataExpression> dataExpressions = updateConditions.get(0).getDataExpressions();
		DataExpression dataExpression = new DataExpression();
//		DataExpression oldDataExpression = dataExpressions.get(0);
		logger.info("条件修改前为：" + dataExpression.getField() + ":" + dataExpression.getValue());
		dataExpression.setField("id");
		dataExpression.setValue("12121");
		logger.info("条件修改后为：" + dataExpression.getField() + ":" + dataExpression.getValue());
		dataExpressions.add(dataExpression);
		
		//更新客户端传入的条件
		UpdateCondition updateCondition = new UpdateCondition();
		updateCondition.setDataExpressions(dataExpressions);
		updateConditions.add(updateCondition);
		requestUpdateRecord.setUpdateConditions(updateConditions);
		return requestUpdateRecord;
	}
	private static final Logger logger = LogManager.getLogger(PreUpdateRecUser1ExtensionService.class);
}
