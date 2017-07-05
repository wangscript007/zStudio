package com.zte.ums.bcp.orm.framework.json.requestjsonparse.service;

import java.io.IOException;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.WhereCondition;

public class WhereConditionJsonParseServiceTest {

	private WhereConditionJsonParseService whereConditionJsonParseService;
	
	@Before
	public void getWhereConditionJsonParseService() {
		whereConditionJsonParseService = new WhereConditionJsonParseService();
	}
	
//	@Test
//	public void parseWhereConditionJsonTest() throws JsonProcessingException, IOException, OrmException {
//		String str = "{\"condition\":{\"and\":[{\"cname\":\"a\",\"value\":\"1\",\"compare\":\"=\"},{\"and\":[{\"cname\":\"b\",\"value\":\"1\",\"compare\":\"=\"},{\"cname\":\"c\",\"value\":\"1\",\"compare\":\"=\"}]},{\"or\":[{\"cname\":\"b\",\"value\":\"1\",\"compare\":\"=\"},{\"cname\":\"c\",\"value\":\"1\",\"compare\":\"=\"}]}]}}";
//		
//		WhereCondition whereCondition = whereConditionJsonParseService.parseWhereConditionJson(str);
//		String result = "{\"logic\":\"and\",\"keyValues\":[{\"key\":\"a\",\"value\":\"1\",\"compartion\":\"=\"}],\"whereConditions\":[{\"logic\":\"and\",\"keyValues\":[{\"key\":\"b\",\"value\":\"1\",\"compartion\":\"=\"},{\"key\":\"c\",\"value\":\"1\",\"compartion\":\"=\"}],\"whereConditions\":[]},{\"logic\":\"or\",\"keyValues\":[{\"key\":\"b\",\"value\":\"1\",\"compartion\":\"=\"},{\"key\":\"c\",\"value\":\"1\",\"compartion\":\"=\"}],\"whereConditions\":[]}]}";
//		
//		Assert.assertEquals(result, new ObjectMapper().writeValueAsString(whereCondition));
//		System.out.println(result);
//	}
}
