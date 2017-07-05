package com.zte.ums.bcp.orm.tablemessage.service;

import java.io.IOException;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.I18n;
import com.zte.ums.bcp.orm.tabledata.service.MultiTableModelService;

@Service(value = "multiTableModelService")
public class MongoMultiTableModelService implements MultiTableModelService {
    @Resource
    private I18n i18n;

    @Override
    public Map<String, Object> getDefinitionNames() throws OrmException {
        throw new UnsupportedOperationException(i18n.i18n(I18n.UNSUPPORT_OPERATION, "MongoMultiTableModelService.getDefinitionNames()", "MongoDB"));
        
    }

    @Override
    public ObjectNode getDefinitionModel(String definitionName) throws OrmException {
        throw new UnsupportedOperationException(i18n.i18n(I18n.UNSUPPORT_OPERATION, "MongoMultiTableModelService.getDefinitionModel()", "MongoDB"));
    }

    @Override
    public JsonNode insertModel(String jsonData) throws JsonProcessingException, IOException, OrmException {
        throw new UnsupportedOperationException(i18n.i18n(I18n.UNSUPPORT_OPERATION, "MongoMultiTableModelService.insertModel()", "MongoDB"));
    }

    @Override
    public JsonNode updateModel(String jsonData) throws JsonProcessingException, IOException, OrmException {
        throw new UnsupportedOperationException(i18n.i18n(I18n.UNSUPPORT_OPERATION, "MongoMultiTableModelService.updateModel()", "MongoDB"));
    }

    @Override
    public void deleteModel(String definitionName) throws OrmException {
        throw new UnsupportedOperationException(i18n.i18n(I18n.UNSUPPORT_OPERATION, "MongoMultiTableModelService.deleteModel()", "MongoDB"));
    }

}
