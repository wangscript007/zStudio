package com.zte.ums.bcp.orm.tablemessage.service;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.LinkedHashMap;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.response.entry.QueryTableFieldResponseInfo;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseInfo;
import com.zte.ums.bcp.orm.framework.systemproperty.constant.DBConst;
import com.zte.ums.bcp.orm.framework.systemproperty.service.DatabasePropertyService;
import com.zte.ums.bcp.orm.tablemessage.dao.MetaDataMapper;

/**
 * <p>文件名称: QueryTableFieldServiceTest.java </p>
 * <p>文件描述: 无</p>
 * <p>版权所有: 版权所有(C)2015</p>
 * <p>公    司: 深圳市中兴通讯股份有限公司</p>
 * <p>内容摘要: 无</p>
 * <p>其他说明: 无</p>
 * <p>创建日期：2015-11-18</p>
 * <p>完成日期：2015-11-18</p>
 * <p>修改记录1: // 修改历史记录，包括修改日期、修改者及修改内容</p>
 * <pre>
 *    修改日期：
 *    版 本 号：
 *    修 改 人：
 *    修改内容：
 * </pre>
 * <p>修改记录2：…</p>
 * @version 1.0
 * @author zxj
 */
public class QueryTableFieldServiceTest {
    private MetaDataMapper metaDataMapper;
    private DatabasePropertyService propertyService;
    private MsSqlTableMessageSqlService mssqlService;
    private OrmQueryTableFieldService tableFieldService;
    private MultiTableUtilService multiTableUtilService;
    
    private String databaseName = "uep4x";
    private String resourceName = "student";
    private String sql = "SELECT character_maximum_length, data_type,  column_name FROM information_schema.COLUMNS WHERE table_name = 'student' AND TABLE_SCHEMA ='uep4x' ORDER BY column_name ";
    private String failedMessage = "查询的表在当前数据库中不存在！";
    @Before
    public void setUp() {
        metaDataMapper = mock(MetaDataMapper.class);
        propertyService = mock(DatabasePropertyService.class);
        mssqlService = mock(MsSqlTableMessageSqlService.class);
        multiTableUtilService = mock(MultiTableUtilService.class);

        tableFieldService = new OrmQueryTableFieldService();
        tableFieldService.setUT_MetaDataMapper(metaDataMapper);
        tableFieldService.setUT_DatabasePropertyService(propertyService);
        tableFieldService.setUT_TableMessageSqlService(mssqlService);
        tableFieldService.setUT_multiTableUtilService(multiTableUtilService);
        
        when(mssqlService.getDatabaseName(databaseName)).thenReturn(databaseName);
    }

    /** 未查询到结果场景 **/
    @Test
    public void should_throw_OrmExcepption_when_failed_to_find_resource() {
        // give
        when(multiTableUtilService.isValidMultTable(databaseName)).thenReturn(true);
        doThrow(new RuntimeException("MockException")).when(metaDataMapper).findResourceId(resourceName, databaseName);
        should_return_failed("MockException");
    }

    @Test
    public void should_return_empty_on_single_table_when_databaseType_invaild() {
        mock_find_muiltResource_return_empty();
        when(propertyService.getDbSchema()).thenReturn("");
        should_return_failed(failedMessage);
    }

    @Test
    public void should_return_empty_on_multi_table_when_databaseType_invaild() {
        mock_find_muiltResource_return_value();
        when(propertyService.getDbSchema()).thenReturn("");
        should_return_failed(failedMessage);
    }

    @Test
    public void should_return_empty_on_mssql_single_table_when_query_table_field_exception() {
        // give
        mock_find_muiltResource_return_empty();
        doThrow(new RuntimeException("MockException")).when(metaDataMapper).querytablefield(sql);
        should_return_empty_on_mssql_single_table("MockException");
    }

    @Test
    public void should_return_empty_on_mssql_multi_table_when_query_table_field_exception() {
        // give
        mock_find_muiltResource_return_value();
        doThrow(new RuntimeException("MockException")).when(metaDataMapper).queryMultiField(sql);
        should_return_empty_on_mssql_multi_table("MockException");
    }

    private void should_return_empty_on_mssql_single_table(String message) {
        when(mssqlService.getTableField(resourceName, databaseName)).thenReturn(sql);
        should_return_empty_on_mssql(message);
    }

    private void should_return_empty_on_mssql_multi_table(String message) {
        try {
            when(mssqlService.getMultiField(resourceName, databaseName)).thenReturn(sql);
        } catch (OrmException e) {
            Assert.fail(e.getLocalizedMessage());
            return;
        }
        should_return_empty_on_mssql(message);
    }

    private void should_return_empty_on_mssql(String message) {
        mock_mssql();
        should_return_failed(message);
    }

    private void should_return_failed(String message) {
        // when
    	ResponseInfo responseInfo = tableFieldService.getTableField(resourceName, databaseName);
        // then
    	ResponseInfo expectedResponseInfo = new ResponseInfo(ResponseInfo.STATUS_FAIL, message);
        assertEquals(expectedResponseInfo, responseInfo);
    }

    @Test
    public void should_return_fields_on_mssql_signle_table_when_find_empty_multiResource() {
        mock_find_muiltResource_return_empty();
        should_return_fields_on_mssql_signle_table();
    }

    @Test
    public void should_return_fields_on_mssql_signle_table_when_find_null_multiResource() {
        mock_find_muiltResource_return_null();
        should_return_fields_on_mssql_signle_table();
    }

    @Test
    public void should_return_fields_on_mssql_multi_table_when_find_empty_multiResource() {
        mock_find_muiltResource_return_value();
        should_return_fields_on_mssql_multi_table();
    }

    private void should_return_fields_on_mssql_signle_table() {
        mock_mssql();
        when(mssqlService.getTableField(resourceName, databaseName)).thenReturn(sql);
        should_return_fields_on_signle_table();
    }

    private void should_return_fields_on_mssql_multi_table() {
        mock_mssql();
        try {
            when(mssqlService.getMultiField(resourceName, databaseName)).thenReturn(sql);
        } catch (OrmException e) {
            Assert.fail(e.getLocalizedMessage());
            return;
        }
        should_return_fields_on_multi_table();
    }

    private void should_return_fields_on_signle_table() {
        when(metaDataMapper.querytablefield(sql)).thenReturn(getStudenTableFiledList());
        should_return_fields();
    }

    private void should_return_fields_on_multi_table() {
        when(metaDataMapper.queryMultiField(sql)).thenReturn(getStudenTableFiledList());
        should_return_fields();
    }

    private void should_return_fields() {
        // when
    	ResponseInfo resultResponseInfo = tableFieldService.getTableField(resourceName, databaseName);

        // then
    	QueryTableFieldResponseInfo expectedResponseInfo = new QueryTableFieldResponseInfo();
    	expectedResponseInfo.setStatus(QueryTableFieldResponseInfo.STATUS_SUCCESS);
    	expectedResponseInfo.setMessage(QueryTableFieldResponseInfo.DEFAULT_SUCCESS_MESSAGE);
    	expectedResponseInfo.setFieldInfos(getStudenTableFiledList());
        assertEquals(expectedResponseInfo, resultResponseInfo);
    }

    private void mock_mssql() {
        when(propertyService.getDbSchema()).thenReturn(DBConst.MSSQL);
    }

    private void mock_find_muiltResource_return_empty() {
        when(metaDataMapper.findResourceId(resourceName, databaseName)).thenReturn(new LinkedHashMap<String, String>());
    }

    private void mock_find_muiltResource_return_null() {
        when(metaDataMapper.findResourceId(resourceName, databaseName)).thenReturn(null);
    }

    private void mock_find_muiltResource_return_value() {
        when(multiTableUtilService.isValidMultTable(databaseName)).thenReturn(true);

        LinkedHashMap<String, String> multiTableDef = new LinkedHashMap<String, String>();
        multiTableDef.put("res", resourceName);
        when(metaDataMapper.findResourceId(resourceName, databaseName)).thenReturn(multiTableDef);
    }

    private ArrayList<LinkedHashMap<String, Object>> getStudenTableFiledList() {
        ArrayList<LinkedHashMap<String, Object>> fieldList  = new ArrayList<LinkedHashMap<String,Object>>();
        LinkedHashMap<String,Object> fieldMap1 = new LinkedHashMap<String, Object>();
        fieldMap1.put("character_maximum_length", 100);
        fieldMap1.put("data_type", "string");
        fieldMap1.put("column_name", "name");
        fieldList.add(fieldMap1);
        LinkedHashMap<String,Object> fieldMap2 = new LinkedHashMap<String, Object>();
        fieldMap2.put("character_maximum_length", 4);
        fieldMap2.put("data_type", "int");
        fieldMap2.put("column_name", "id");
        fieldList.add(fieldMap2);
        return fieldList;
    }
}
