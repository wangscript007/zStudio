package com.zte.ums.bcp.orm.utils;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.zte.ums.bcp.orm.constant.IJsonConstant;
import org.apache.log4j.Logger;

public class TypeReplaceUtil {
    private static final Logger dMsg = Logger.getLogger(TypeReplaceUtil.class.getName());

    public static List<LinkedHashMap<String, String>> replaceDateType(
            List<LinkedHashMap<String, String>> list) {
        for (int i = 0; i < list.size(); i++) {
            Map<String, String> map = list.get(i);
            String string = map.get("data_type");
            if (null != string && string.length() > 0) {
                if (string.indexOf("int") >= 0) {
                    string = "int";
                    map.put("data_type", string);
                }
                if (string.indexOf("varchar") >= 0
                        || string.indexOf("time") >= 0
                        || string.indexOf("date") >= 0) {
                    string = "string";
                    map.put("data_type", string);
                }
                if (string.indexOf("float") >= 0
                        || string.indexOf("double") >= 0) {
                    string = "double";
                    map.put("data_type", string);
                }
            } else {
                dMsg.error(map.get(IJsonConstant.COLUMN_NAME) + "字段类型为空.");
            }
        }
        return list;
    }

    public static List<LinkedHashMap<String, Object>> replaceMySqlDateType(
            List<LinkedHashMap<String, Object>> list) {
        if (null != list) {
              for (int i = 0; i < list.size(); i++) {
                  Map<String, Object> map = list.get(i);
                  Object dataType = map.get("data_type");
                  if (null != dataType && ((String) dataType).length() > 0) {
                      // tinyint smallint mediumint int integer bigint bit real
                      // decimal numeric
                      // blob 二进制 binary
                      if (((String) dataType).indexOf("int") >= 0
                              || ((String) dataType).indexOf("blob") >= 0
                              || ((String) dataType).indexOf("binary") >= 0) {
                          dataType = "int";
                          map.put("data_type", dataType);
                      }
                      // double float
                      if (((String) dataType).indexOf("float") >= 0
                              || ((String) dataType).indexOf("double") >= 0) {
                          dataType = "double";
                          map.put("data_type", dataType);
                      }
                      // char varchar date time year timestamp datetime
                      if (((String) dataType).indexOf("char") >= 0
                              || ((String) dataType).indexOf("time") >= 0
                              || ((String) dataType).indexOf("date") >= 0
                              || ((String) dataType).indexOf("year") >= 0) {
                          dataType = "string";
                          map.put("data_type", dataType);
                      }
                      // tinytext ENUM 是一个字符串对象 SET是一个字符串对象，可以有零或多个值 point 点，坐标
                      // multipoint linestring multilinestring geometry 几何结构
                      // polygon
                      // multipolygon longtext mediumtext text
                      // geometrycollection
                      if (((String) dataType).indexOf("text") >= 0
                              || ((String) dataType).indexOf("point") >= 0
                              || ((String) dataType).indexOf("string") >= 0
                              || ((String) dataType).indexOf("geometry") >= 0
                              || ((String) dataType).indexOf("geometry") >= 0) {
                          dataType = "string";
                          map.put("data_type", dataType);
                      }
                  } else {
                      dMsg.error(map.get(IJsonConstant.COLUMN_NAME) + "字段类型为空.");
                  }
              }
        }
          
        return list;
    }
    
    public static List<LinkedHashMap<String, String>> replaceSqlServerDateType(
            List<LinkedHashMap<String, String>> list) {
        if (null != list) {
            for (int i = 0; i < list.size(); i++) {
                Map<String, String> map = list.get(i);
                String dataType = map.get("data_type");
                if (null != dataType && dataType.length() > 0) {

                    // bigint int smallint tinyint
                    // bit imagemoney smallmoney
                    if (dataType.indexOf("int") >= 0
                            || dataType.indexOf("money") >= 0) {
                        dataType = "int";
                        map.put("data_type", dataType);
                    }
                    // float
                    if (dataType.indexOf("float") >= 0) {
                        dataType = "double";
                        map.put("data_type", dataType);
                    }
                    // date datetime datetime2 datetimeoffset smalldatetime
                    // time timestamp
                    // char nchar ntext nvarchar text varchar nvarchar(MAX)
                    // varchar(MAX)
                    if (dataType.indexOf("date") >= 0
                            || dataType.indexOf("time") >= 0
                            || dataType.indexOf("char") >= 0
                            || dataType.indexOf("text") >= 0) {
                        dataType = "string";
                        map.put("data_type", dataType);
                    }
                    // xml varbinary binary uniqueidentifier sysname sql_variant
                    // real numeric hierarchyid geography decimal
                    if (dataType.indexOf("xml") >= 0
                            || dataType.indexOf("binary") >= 0
                            || dataType.indexOf("uniqueidentifier") >= 0
                            || dataType.indexOf("sysname") >= 0
                            || dataType.indexOf("sql_variant") >= 0
                            || dataType.indexOf("real") >= 0
                            || dataType.indexOf("numeric") >= 0
                            || dataType.indexOf("hierarchyid") >= 0
                            || dataType.indexOf("geography") >= 0
                            || dataType.indexOf("decimal") >= 0) {
                        dataType = "string";
                        map.put("data_type", dataType);
                    }
                } else {
                    dMsg.error(map.get(IJsonConstant.COLUMN_NAME) + "字段类型为空.");
                }
            }
        }
        
        return list;
    }
    
    public static List<LinkedHashMap<String, String>> replaceDateType(
            List<LinkedHashMap<String, String>> list, String dbType) {
        if ((ConstantUtils.MYSQL).equals(dbType)) {
            for (int i = 0; i < list.size(); i++) {
                Map<String, String> map = list.get(i);
                String dataType = map.get("data_type");
                if (null != dataType && dataType.length() > 0) {
                    // tinyint smallint mediumint int integer bigint bit real
                    // decimal numeric
                    // blob 二进制 binary
                    if (dataType.indexOf("int") >= 0
                            || dataType.indexOf("blob") >= 0
                            || dataType.indexOf("binary") >= 0) {
                        dataType = "int";
                        map.put("data_type", dataType);
                    }
                    // double float
                    if (dataType.indexOf("float") >= 0
                            || dataType.indexOf("double") >= 0) {
                        dataType = "double";
                        map.put("data_type", dataType);
                    }
                    // char varchar date time year timestamp datetime
                    if (dataType.indexOf("char") >= 0
                            || dataType.indexOf("time") >= 0
                            || dataType.indexOf("date") >= 0
                            || dataType.indexOf("year") >= 0) {
                        dataType = "string";
                        map.put("data_type", dataType);
                    }
                    // tinytext ENUM 是一个字符串对象 SET是一个字符串对象，可以有零或多个值 point 点，坐标
                    // multipoint linestring multilinestring geometry 几何结构
                    // polygon
                    // multipolygon longtext mediumtext text
                    // geometrycollection
                    if (dataType.indexOf("text") >= 0
                            || dataType.indexOf("point") >= 0
                            || dataType.indexOf("string") >= 0
                            || dataType.indexOf("geometry") >= 0
                            || dataType.indexOf("geometry") >= 0) {
                        dataType = "string";
                        map.put("data_type", dataType);
                    }
                } else {
                    dMsg.error(map.get(IJsonConstant.COLUMN_NAME) + "字段类型为空.");
                }
            }
        } else if ((ConstantUtils.SQLSERVER).equals(dbType)) {
            for (int i = 0; i < list.size(); i++) {
                Map<String, String> map = list.get(i);
                String dataType = map.get("data_type");
                if (null != dataType && dataType.length() > 0) {

                    // bigint int smallint tinyint
                    // bit imagemoney smallmoney
                    if (dataType.indexOf("int") >= 0
                            || dataType.indexOf("money") >= 0) {
                        dataType = "int";
                        map.put("data_type", dataType);
                    }
                    // float
                    if (dataType.indexOf("float") >= 0) {
                        dataType = "double";
                        map.put("data_type", dataType);
                    }
                    // date datetime datetime2 datetimeoffset smalldatetime
                    // time timestamp
                    // char nchar ntext nvarchar text varchar nvarchar(MAX)
                    // varchar(MAX)
                    if (dataType.indexOf("date") >= 0
                            || dataType.indexOf("time") >= 0
                            || dataType.indexOf("char") >= 0
                            || dataType.indexOf("text") >= 0) {
                        dataType = "string";
                        map.put("data_type", dataType);
                    }
                    // xml varbinary binary uniqueidentifier sysname sql_variant
                    // real numeric hierarchyid geography decimal
                    if (dataType.indexOf("xml") >= 0
                            || dataType.indexOf("binary") >= 0
                            || dataType.indexOf("uniqueidentifier") >= 0
                            || dataType.indexOf("sysname") >= 0
                            || dataType.indexOf("sql_variant") >= 0
                            || dataType.indexOf("real") >= 0
                            || dataType.indexOf("numeric") >= 0
                            || dataType.indexOf("hierarchyid") >= 0
                            || dataType.indexOf("geography") >= 0
                            || dataType.indexOf("decimal") >= 0) {
                        dataType = "string";
                        map.put("data_type", dataType);
                    }
                } else {
                    dMsg.error(map.get(IJsonConstant.COLUMN_NAME) + "字段类型为空.");
                }
            }
        }
        return list;
    }
}
