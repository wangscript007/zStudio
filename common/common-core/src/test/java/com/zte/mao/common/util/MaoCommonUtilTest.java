package com.zte.mao.common.util;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

public class MaoCommonUtilTest {

    @Test
    public void testMetaDataURLParse() throws Exception {
//        Class<CommonDataSourceIntercepter> class1 = CommonDataSourceIntercepter.class;
//        Object instance = class1.newInstance();
//        Method method = class1.getDeclaredMethod("parseTableNameFromURL", new Class[] { String.class });
//        method.setAccessible(true);
//
//        Object result = method.invoke(instance, new Object[] { "/common/orm/metadata/table/table1" });
//        assertEquals("table1", result);

        String tableName = MaoCommonUtil.parseTableNameFromURL("/common/orm/metadata/table/table1");
        assertEquals("table1", tableName);
    }

    @Test
    public void testTableURLParse() throws Exception {
//        Class<CommonDataSourceIntercepter> class1 = CommonDataSourceIntercepter.class;
//        Object instance = class1.newInstance();
//        Method method = class1.getDeclaredMethod("parseTableNameFromURL", new Class[] { String.class });
//        method.setAccessible(true);
//
//        Object result = method.invoke(instance, new Object[] { "/common/orm/table/table1" });
//
//        assertEquals("table1", result);

        String tableName = MaoCommonUtil.parseTableNameFromURL("/common/orm/table/table1");
        assertEquals("table1", tableName);
    }

    @Test
    public void testTablesURLParse() throws Exception {
        String tableName = MaoCommonUtil.parseTableNameFromURL("/common/orm/tables/table1");
        assertEquals("table1", tableName);
    }

}
