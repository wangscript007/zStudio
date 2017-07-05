package com.zte.ums.bcp.orm.tablemessage.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.I18n;
import com.zte.ums.bcp.orm.tabledata.service.MultiTableService;
import org.apache.log4j.Logger;

@Service(value = "multiTableService")
public class MongoMultiTableService implements MultiTableService {
	private static final Logger dMsg = Logger.getLogger(MongoMultiTableService.class.getName());
    @Resource
    private I18n i18n;

	public Map<String, Object> queryInstance(String definitionName, String param)
			throws JsonProcessingException, IOException, OrmException {
        throw new UnsupportedOperationException(i18n.i18n(I18n.UNSUPPORT_OPERATION, "MongoMultiTableService.queryInstance()", "MongoDB"));
	}

    @Override
    public Map<String, Object> insertInstance(String definitionName, String jsonData) throws JsonProcessingException,
            IOException, OrmException {
        throw new UnsupportedOperationException(i18n.i18n(I18n.UNSUPPORT_OPERATION, "MongoMultiTableService.insertInstance()", "MongoDB"));
    }

    @Override
    public void deleteInstance(String definitionName, String param) throws JsonProcessingException, IOException,
            OrmException {
        throw new UnsupportedOperationException(i18n.i18n(I18n.UNSUPPORT_OPERATION, "MongoMultiTableService.deleteInstance()", "MongoDB"));
    }

    @Override
    public Map<String, Object> updateInstance(String definitionName, String param, String jsonData)
            throws JsonProcessingException, IOException, OrmException {
        throw new UnsupportedOperationException(i18n.i18n(I18n.UNSUPPORT_OPERATION, "MongoMultiTableService.updateInstance()", "MongoDB"));
    }

    @Override
    public List<Map<String, Object>> queryInstanceArray(String definitionName, String param, String limit)
            throws JsonProcessingException, IOException, OrmException {
        throw new UnsupportedOperationException(i18n.i18n(I18n.UNSUPPORT_OPERATION, "MongoMultiTableService.queryInstanceArray()", "MongoDB"));
    }
}
