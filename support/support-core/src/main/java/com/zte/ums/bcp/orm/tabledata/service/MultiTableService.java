package com.zte.ums.bcp.orm.tabledata.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.zte.ums.bcp.orm.exception.OrmException;

public interface MultiTableService {
    Map<String, Object> queryInstance(String definitionName, String param) throws JsonProcessingException, IOException, OrmException;

    Map<String, Object> insertInstance(String definitionName, String jsonData) throws JsonProcessingException, IOException, OrmException;

    void deleteInstance(String definitionName, String param) throws JsonProcessingException, IOException, OrmException;

    Map<String, Object> updateInstance(String definitionName, String param, String jsonData) throws JsonProcessingException, IOException, OrmException;

    List<Map<String, Object>> queryInstanceArray(String definitionName, String param, String limit) throws JsonProcessingException, IOException, OrmException;
}
