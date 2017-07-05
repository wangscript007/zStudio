package com.zte.ums.bcp.orm.framework.json.requestjsonparse.service;

import java.io.IOException;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.WhereCondition;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.constant.WhereConditionJsonKeyConstant;

@Service
public class DeleteRecordJsonParseService extends AbstractJsonParseService{
    @Resource
    private WhereConditionJsonParseService whereConditionJsonParseService;
    
    public WhereCondition parseDeleteRecordJson(String deleteRecordJson)
            throws OrmException {

        try {
            return getWhereCondition(new ObjectMapper()
                    .readTree(deleteRecordJson));
        } catch (JsonProcessingException e) {
            throw new OrmException(e);
        } catch (IOException e) {
            throw new OrmException(e);
        }
    }

    /*public String parseDatabase(String deleteRecordJson) throws OrmException{
        try {
            JsonNode jsonNode = new ObjectMapper().readTree(deleteRecordJson);
            if (jsonNode.has(DeleteRecordJsonKeyConstant.DATABASE)) {
                String string = jsonNode.get(DeleteRecordJsonKeyConstant.DATABASE).asText();
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
    
    public WhereCondition parseDeleteRecordJson(JsonNode deleteRecordJson) throws OrmException {
        return getWhereCondition(deleteRecordJson);
    }

    private WhereCondition getWhereCondition(JsonNode deleteRecordJsonCondition) throws OrmException {
        WhereCondition simpleWhereCondition = new WhereCondition();

        if (!deleteRecordJsonCondition.isNull() && deleteRecordJsonCondition.has(WhereConditionJsonKeyConstant.KEY_CONDITION)) {
            simpleWhereCondition = whereConditionJsonParseService.parseWhereConditionJson(deleteRecordJsonCondition.get(WhereConditionJsonKeyConstant.KEY_CONDITION));
        }
        return simpleWhereCondition;
    }
}
