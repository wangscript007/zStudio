package com.zte.ums.bcp.orm.framework.json.requestjsonparse.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.AddRecordCondition;

public class AddRecordJsonParseServiceTest {

	private ObjectMapper objectMapper;
	
	private AddRecordJsonParseService addRecordJsonParseService;
	
	@Before
	public void getAddRecordJsonParseService() {
		addRecordJsonParseService = new AddRecordJsonParseService();
		objectMapper = new ObjectMapper();
	}
	
	@Test
	public void addOneRecordJson() throws OrmException, JsonProcessingException {
		String addOneRecordJson = "{\"columns\":{\"id\":\"1555\",\"sex\":\"8888888\"}}";
		List<AddRecordCondition> addRecords = addRecordJsonParseService.parseAddRecordJson(addOneRecordJson);
		String result = objectMapper.writeValueAsString(addRecords);
		System.out.println(result);
	}
	
	@Test
	public void addMultiRecordJson() throws JsonProcessingException, IOException, OrmException {
		String addMultiRecordJson = "{\"columns\":[{\"sex\":\"man\",\"name\":\"xiaohong\"},{\"name\":\"xiaohong\",\"sex\":\"man\"},{\"sex\":\"man\",\"name\":\"xiaohong\"}]}";
		List<AddRecordCondition> addRecords = addRecordJsonParseService.parseAddRecordJson(addMultiRecordJson);

		AddRecordCondition expectAddRecord = new AddRecordCondition();
		List<AddRecordCondition> expectAddRecordList = new ArrayList<AddRecordCondition>();
		expectAddRecordList.add(expectAddRecord);

//		assertEquals(addRecords, expectAddRecordList);
//		String result = objectMapper.writeValueAsString(addRecords);
//		System.out.println(result);
	}
}
