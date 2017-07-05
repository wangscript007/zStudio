package com.zte.ums.bcp.orm.test;

import java.io.IOException;

import org.junit.Test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.WhereCondition;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.service.WhereConditionJsonParseService;

public class WhereCondition1Test {

//	
//	@Test
//	public void jsonParse() throws IOException, OrmException {
//		String str = "{\"condition\":{\"and\":[{\"cname\":\"a\",\"value\":\"1\",\"compare\":\"=\"},{\"and\":[{\"cname\":\"b\",\"value\":\"1\",\"compare\":\"=\"},{\"cname\":\"c\",\"value\":\"1\",\"compare\":\"=\"}]},{\"or\":[{\"cname\":\"b\",\"value\":\"1\",\"compare\":\"=\"},{\"cname\":\"c\",\"value\":\"1\",\"compare\":\"=\"}]}]}}";
//		
//		WhereCondition whereCondition = new WhereConditionJsonParseService().parseWhereConditionJson(str);
//		System.out.println("++++++++++++++++++++++++++++++++");
//		System.out.println(str);
//		System.out.println("++++++++++++++++++++++++++++++++");
//		//System.out.println(whereCondition.getSql());
//		System.out.println("++++++++++++++++++++++++++++++++");
//		ObjectMapper objectMapper2 = new ObjectMapper();
//		
//		String ritString = objectMapper2.writeValueAsString(whereCondition);
//		System.out.println(ritString);
//	}
}
