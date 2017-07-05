package com.zte.ums.bcp.orm.framework.json.requestjsonparse.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.AddRecordCondition;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.constant.AddRecordJsonKeyConstant;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.DataExpression;

@Service
public class AddRecordJsonParseService extends AbstractJsonParseService {
	
    public List<AddRecordCondition> parseAddRecordJson(String addRecordJson) throws OrmException {
		
		try {
			return parseColumnsJson(new ObjectMapper().readTree(addRecordJson));
		} catch (JsonProcessingException e) {
		    throw new OrmException(e);
		} catch (IOException e) {
		    throw new OrmException(e);
		}
	}
	
	public List<AddRecordCondition> parseAddRecordJson(JsonNode addRecordJson) {
		return parseColumnsJson(addRecordJson);
	}
	
	private List<AddRecordCondition> parseColumnsJson(JsonNode addRecordJson) {
		
		JsonNode recordJsonNode = addRecordJson.get(AddRecordJsonKeyConstant.KEY_COLUMNS);
		List<AddRecordCondition> addRecords = new ArrayList<AddRecordCondition>();
		if (recordJsonNode.isObject()) {
			addRecords.add(parseOneRecordJson(recordJsonNode));
		} else if(recordJsonNode.isArray()) {
			Iterator<JsonNode> multiRecordJsons = recordJsonNode.iterator();
			while (multiRecordJsons.hasNext()) {
				addRecords.add(parseOneRecordJson(multiRecordJsons.next()));
			}
		}
		
		return addRecords;
	}
	
	private AddRecordCondition parseOneRecordJson(JsonNode oneRecordJson) {
		Iterator<Entry<String, JsonNode>> oneRecordJsonFields = oneRecordJson.fields();
		List<DataExpression> dataExpressions = new ArrayList<DataExpression>();
		while (oneRecordJsonFields.hasNext()) {
			Entry<String, JsonNode> oneRecordJsonFieldEntry = oneRecordJsonFields.next();
			if (null != oneRecordJsonFieldEntry.getKey() && !oneRecordJsonFieldEntry.getKey().isEmpty()
					&& (!oneRecordJsonFieldEntry.getValue().isNull() && !oneRecordJsonFieldEntry.getValue().asText().isEmpty())) {
				
				DataExpression dataExpression = new DataExpression();
				dataExpression.setValue(oneRecordJsonFieldEntry.getValue().asText());
				dataExpression.setField(oneRecordJsonFieldEntry.getKey());
				
				dataExpressions.add(dataExpression);
			}
		}
		AddRecordCondition addRecord = new AddRecordCondition();
		addRecord.setDataExpressions(dataExpressions);
		
		return addRecord;
	}
}
