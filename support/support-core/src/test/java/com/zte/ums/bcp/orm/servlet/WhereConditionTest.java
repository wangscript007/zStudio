package com.zte.ums.bcp.orm.servlet;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;


public class WhereConditionTest {
    KeyValue keyValue1 = new KeyValue();
    KeyValue keyValue2 = new KeyValue();
    KeyValue keyValue3 = new KeyValue();

    @Before
    public void setUp() {
        keyValue1 = new KeyValue();
        keyValue1.setKey("b");
        keyValue1.setValue("1");
        keyValue1.setCompartion(">");

        keyValue2 = new KeyValue();
        keyValue2.setKey("a");
        keyValue2.setValue("1");
        keyValue2.setCompartion("=");

        keyValue3 = new KeyValue();
        keyValue3.setKey("c");
        keyValue3.setValue("1");
        keyValue3.setCompartion("<");
    }

    @Test
    public void testAEqules1() {
        String sqlString = keyValue2.getSql();
        Assert.assertEquals("a=1", sqlString);
        System.out.println(sqlString);
    }

    @Test
    public void testBGreaterThan1() {
        String sqlString = keyValue1.getSql();
        Assert.assertEquals("b>1", sqlString);
    }

    @Test
    public void test1LayerSql() {
        WhereCondition whereCondition = new WhereCondition();
        whereCondition.setKeyValues(new KeyValue[] { keyValue1, keyValue2 });
        whereCondition.setLogic("and");
        String sqlString = whereCondition.getSql();

        Assert.assertEquals("b>1 and a=1", sqlString);
    }

    @Test
    public void test2LayerSql() {
        WhereCondition whereCondition = new WhereCondition();
        whereCondition.setKeyValues(new KeyValue[] { keyValue1, keyValue2 });
        whereCondition.setLogic("and");

        WhereCondition whereConditionWith2LayerCondition = new WhereCondition();
        whereConditionWith2LayerCondition.setKeyValues(new KeyValue[] { keyValue3 });
        whereConditionWith2LayerCondition.setLogic("or");
        whereConditionWith2LayerCondition.setWhereConditon(whereCondition);
        String sqlString = whereConditionWith2LayerCondition.getSql();

        Assert.assertEquals("c<1 or (b>1 and a=1)", sqlString);
    }
}
