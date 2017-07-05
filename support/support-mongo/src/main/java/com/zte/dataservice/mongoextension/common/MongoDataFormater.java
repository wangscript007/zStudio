package com.zte.dataservice.mongoextension.common;

import java.text.SimpleDateFormat;
import java.util.LinkedHashMap;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.mongodb.BasicDBObject;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.ComparableAssignedField;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.DataExpression;
import org.apache.log4j.Logger;

@Service
public class MongoDataFormater {
    private static final Logger dMsg = Logger.getLogger(MongoDataFormater.class.getName());

	/**
	 * 格式化文档值
	 * 
	 * @param expressions 输入数据
	 * @param metaFieldsInfo 文档元数据
	 * @return
	 * @throws OrmException
	 */
    public BasicDBObject formatFieldValue(List<DataExpression> expressions,
            List<LinkedHashMap<String, Object>> metaFieldsInfo) throws OrmException {
        BasicDBObject doc = new BasicDBObject();
        for (DataExpression exp : expressions) {
            doc.append(exp.getField(), this.getFormatedFieldValue(this.getFieldType(metaFieldsInfo, exp.getField()), exp.getValue()));
        }
        return doc;
    }

	/**
	 * 格式化查询条件
	 * 
	 * @param comparableAssignedField
	 * @param metaFieldsInfo
	 * @return
	 * @throws OrmException
	 */
	public Object formatConditionValue(
			ComparableAssignedField comparableAssignedField,
			List<LinkedHashMap<String, Object>> metaFieldsInfo)
			throws OrmException {
		return this.getFormatedFieldValue(this.getFieldType(metaFieldsInfo,
				comparableAssignedField.getField().getName()),
				comparableAssignedField.getValue().get(0));
	}

	/**
	 * 获取字段类型
	 * 
	 * @param metaFieldsInfo 文档元数据
	 * @param field 数据字段
	 * @return
	 */
    private String getFieldType(List<LinkedHashMap<String, Object>> metaFieldsInfo, String field) {
        if (metaFieldsInfo.isEmpty()) {
            return "string";
        }

        String fieldType = "";
        for (LinkedHashMap<String, Object> fieldInfo : metaFieldsInfo) {
            if (fieldInfo.get("column_name").toString().equalsIgnoreCase(field)) {
                fieldType = fieldInfo.get("data_type").toString();
                break;
            }
        }

        return fieldType;
    }

	/**
	 * 格式化字段值
	 * 
	 * @param fieldType 字段类型
	 * @param value 字段值
	 * @return
	 * @throws OrmException
	 */
    private Object getFormatedFieldValue(String fieldType, String value) throws OrmException {
        if (StringUtils.isBlank(fieldType)) {
            return value;
        }
        try {
            if (fieldType.equalsIgnoreCase("date")) {
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                return simpleDateFormat.parse(value);
            }
            if (fieldType.equalsIgnoreCase("bool")) {
                return Boolean.valueOf(value);
            }
            if (fieldType.equalsIgnoreCase("double")) {
                return Double.valueOf(value);
            }
            if (StringUtils.startsWithIgnoreCase(fieldType, "int")) {
                return Integer.valueOf(value);
            }
        } catch (Exception err) {
            dMsg.error(err.getMessage(), err);
            throw new OrmException(err.getMessage());
        }
        return value;
    }
}
