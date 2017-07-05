package com.zte.ums.bcp.orm.tabledata.service;

import java.io.IOException;
import java.util.Map;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.zte.ums.bcp.orm.exception.OrmException;

public interface MultiTableModelService {
    Map<String, Object> getDefinitionNames() throws OrmException;

    ObjectNode getDefinitionModel(String definitionName) throws OrmException;

    JsonNode insertModel(String jsonData) throws JsonProcessingException, IOException, OrmException;

    JsonNode updateModel(String jsonData) throws JsonProcessingException, IOException, OrmException;

    void deleteModel(String definitionName) throws OrmException;}
