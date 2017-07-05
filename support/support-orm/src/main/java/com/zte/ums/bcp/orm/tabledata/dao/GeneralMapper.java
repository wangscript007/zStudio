package com.zte.ums.bcp.orm.tabledata.dao;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
@Repository
public interface GeneralMapper {
    
    int insert(@Param("sql") String sql);
    
    int delete(@Param("sql") String sql);
    
    List<LinkedHashMap<String, String>> select(@Param("sql") String sql);
    
    int update(@Param("sql") String sql);
    
    List<LinkedHashMap<String, String>> relatequery(@Param("sql") String sql);
    
    int inserts(@Param("sql") String sql);
    
    List<LinkedHashMap<String, String>> selectBySql(@Param("sql") String sql);

    int selectCount(@Param("sql") String sql);
    
    List<LinkedHashMap<String, String>> selectPriKeySql(@Param("sql") String sql);
    
    int selectMysqlAutoIncrementVal();
    
    int selectMSsqlAutoIncrementVal();
    
    //int insertss(@Param("name")String name, @Param("id")int id);
    
    int insertss(HashMap map);
    
    List<Map> selectKey();
    
    List<LinkedHashMap<String, String>> sqlServerInsert(@Param("tablename")String tablename, @Param("keystring")String keystring, @Param("valuestring")String valuestring, @Param("output")String output);
    
    LinkedHashMap<String, String> getAutoIncrementCol(@Param("tablename")String tablename);

    List<LinkedHashMap<Object, Object>> testSelect();
      
        
}
