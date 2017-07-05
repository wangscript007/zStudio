package com.zte.ums.bcp.orm.framework.json.requestjsonparse.service;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.constant.AddRecordJsonKeyConstant;

public abstract class AbstractJsonParseService {
	
    public String parseDataBaseJson(HttpServletRequest request, String addRecordJson)
			throws OrmException {
		String database = null;
		if(request != null) {
			database = request.getParameter("database");		
		}
		if(database != null) {
			return database;
		}

		try {
			JsonNode jsonNode = new ObjectMapper().readTree(addRecordJson);
			if (jsonNode.has(AddRecordJsonKeyConstant.DATABASE)) {
				String string = jsonNode.get(AddRecordJsonKeyConstant.DATABASE)
						.asText();
				return string;
			} else {
				return "";
			}
		} catch (JsonProcessingException e) {
			throw new OrmException(e);
		} catch (IOException e) {
			throw new OrmException(e);
		}
	}

}