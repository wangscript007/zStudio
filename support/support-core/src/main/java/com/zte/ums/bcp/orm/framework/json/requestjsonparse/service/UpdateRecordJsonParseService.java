package com.zte.ums.bcp.orm.framework.json.requestjsonparse.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.NullNode;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.UpdateCondition;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.constant.UpdateRecordJsonKeyConstant;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.DataExpression;

@Service
public class UpdateRecordJsonParseService extends AbstractJsonParseService{
   
    @Resource
    private AbstractJsonParseService addRecordJsonParseService;
    @Resource
    private WhereConditionJsonParseService whereConditionJsonParseService;
    
    public List<UpdateCondition> parseUpdateRecordJson(String updateRecordJson) throws OrmException {
        
        try {
            return analyzeUpdateRecordJson(new ObjectMapper().readTree(updateRecordJson));
        } catch (JsonProcessingException e) {
            throw new OrmException(e);
        } catch (IOException e) {
            throw new OrmException(e);
        }
    }
    
    /*public String parseDataBaseJson(String updateRecordJson) throws OrmException{
        try {
            JsonNode jsonNode = new ObjectMapper().readTree(updateRecordJson);
            if (jsonNode.has(UpdateRecordJsonKeyConstant.DATABASE)) {
                String string = jsonNode.get(UpdateRecordJsonKeyConstant.DATABASE).asText();
                return string;
            } else {
                return "";
            }
        } catch (JsonProcessingException e) {
            throw new OrmException(e);
        } catch (IOException e) {
            throw new OrmException(e);
        }
    }*/
    
    public List<UpdateCondition> parseUpdateRecordJson(JsonNode updateRecordJson) throws OrmException {
        return analyzeUpdateRecordJson(updateRecordJson);
    }
    
    private List<UpdateCondition> analyzeUpdateRecordJson(JsonNode updateRecordJson) throws OrmException {
        List<UpdateCondition> updateRecords = new ArrayList<UpdateCondition>();
        if (updateRecordJson.has(UpdateRecordJsonKeyConstant.KEY_RECORDS)) {
            JsonNode recordsJsonNode = updateRecordJson.get(UpdateRecordJsonKeyConstant.KEY_RECORDS);
            if (null != recordsJsonNode) {
                for (Iterator<JsonNode> records = recordsJsonNode.iterator(); records.hasNext();) {
                    JsonNode record = records.next();
                    if (!record.isNull()) {
                        updateRecords.add(parseUpdateOneRecordJson(record));
                    }
                }
            }
        } else {
            updateRecords.add(parseUpdateOneRecordJson(updateRecordJson));
        }
        return updateRecords;
    }
    
    private UpdateCondition parseUpdateOneRecordJson(JsonNode updateOneRecordJson) throws OrmException {
        UpdateCondition updateRecord = new UpdateCondition();
        if (updateOneRecordJson.has(UpdateRecordJsonKeyConstant.KEY_COLUMNS)) {
            updateRecord.setDataExpressions(parseOneRecordJson(updateOneRecordJson.get(UpdateRecordJsonKeyConstant.KEY_COLUMNS)));
        }
        
        if (updateOneRecordJson.has(UpdateRecordJsonKeyConstant.KEY_CONDITION)) {
            //updateRecord.setSimpleWhereCondition(simpleWhereConditionJsonParseService.parseSimpleWhereConditionJson(updateOneRecordJson.get(UpdateRecordJsonKeyConstant.KEY_CONDITION)));
            updateRecord.setWhereCondition(whereConditionJsonParseService.parseWhereConditionJson(updateOneRecordJson.get(UpdateRecordJsonKeyConstant.KEY_CONDITION)));
        }
        
        return updateRecord;
    }
    
    private List<DataExpression> parseOneRecordJson(JsonNode oneRecordJson) {
        List<DataExpression> dataExpressions = new ArrayList<DataExpression>();
        
        for (Iterator<Entry<String, JsonNode>> oneRecordJsonFields = oneRecordJson.fields();oneRecordJsonFields.hasNext();) {
            Entry<String, JsonNode> oneRecordJsonFieldEntry = oneRecordJsonFields.next();
            if (null != oneRecordJsonFieldEntry.getKey() && !oneRecordJsonFieldEntry.getKey().isEmpty()) {
                
                DataExpression dataExpression = new DataExpression();
                JsonNode valueNode = oneRecordJsonFieldEntry.getValue();
                if (valueNode instanceof NullNode) {
                    dataExpression.setValue(null);
                } else {
                    dataExpression.setValue(valueNode.asText());
                }
                dataExpression.setField(oneRecordJsonFieldEntry.getKey());
                dataExpressions.add(dataExpression);
            }
        }
        return dataExpressions;
    }

}
