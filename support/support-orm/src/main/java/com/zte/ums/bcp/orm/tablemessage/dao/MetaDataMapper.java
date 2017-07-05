package com.zte.ums.bcp.orm.tablemessage.dao;

import java.util.LinkedHashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MetaDataMapper {
    List<LinkedHashMap<String, String>> queryTableName(@Param("sql") String sql);

    List<LinkedHashMap<String, String>> queryResourceId();

    List<LinkedHashMap<String, Object>> querytablefield(@Param("sql") String sql);

    List<LinkedHashMap<String, Object>> queryMultiField(@Param("sql") String params);
    
    LinkedHashMap<String, String> findResourceId(@Param("resourceid") String resourceid, @Param("database") String database);

    int isExistMultiTable (@Param("sql") String sql);
}
