package com.zte.mao.workbench.controller;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.common.session.SessionManager;
import com.zte.mao.workbench.entity.model.DataModelInfo;
import com.zte.mao.workbench.json.ModelParser;
import com.zte.mao.workbench.response.model.DataModelDefinition;
import com.zte.mao.workbench.service.DataModelAssociatedInformationService;
import com.zte.mao.workbench.service.DataModelService;
import com.zte.mao.workbench.service.model.ModelCreateService;
import com.zte.mao.workbench.service.model.ModelDeleteService;
import com.zte.mao.workbench.service.model.ModelExportService;
import com.zte.mao.workbench.service.model.ModelImportService;
import com.zte.mao.workbench.service.model.ModelUpdateService;
import com.zte.mao.workbench.service.model.ModelValidateService;

@RestController
@RequestMapping("/model")
public class DataModelController {
    private static ThreadLocal<String> tenantId = new ThreadLocal<String>();
    
    private static Logger logger = Logger.getLogger(DataModelController.class);

    @Resource
    private DataModelService dataModelService;
    @Resource
    private ModelParser modelParser;
    @Resource
    private ModelCreateService modelCreateService; 
    @Resource
    private ModelUpdateService modelUpdateService; 
    @Resource
    private DataModelAssociatedInformationService dataModelAssociatedInformationService;
    @Resource
    private ModelDeleteService modelDeleteService;
    @Resource
    private ModelValidateService modelValidateSercie;
    @Resource
    private ModelExportService modelExportService;
    @Resource
    private ModelImportService modelImportService;
    @Resource
    private SessionManager sessionManager;
    
    @RequestMapping(value = "api/def", method = RequestMethod.GET)
    public List<DataModelDefinition> queryModelDefinition(
            @RequestParam(value = "process-package-id", required = false) String processPacketId,
            @RequestParam(value = "model-id", required = false) String modelId_in,
            HttpServletRequest request) throws MaoCommonException {
        saveTenantId(request);
        return dataModelService.queryDataModelDefinition(processPacketId, modelId_in);
    }

    private void saveTenantId(HttpServletRequest request) throws MaoCommonException {
        try {
            tenantId.set(sessionManager.getTenantId(request));
        } catch (Exception e) {
            logger.error(e.getMessage());
            throw new MaoCommonException(e);
        }
    }

    @RequestMapping(value = "config-file", method = RequestMethod.GET)
    public List<Map<String, String>> getConfigFileList(HttpServletRequest request) throws MaoCommonException {
        saveTenantId(request);
        return dataModelService.getConfigFileList();
    }

    public static String getTenantId() {
        return tenantId.get();
    }

    @RequestMapping(value = "create", method = RequestMethod.POST)
    public CommonResponse createModel(
            @RequestBody(required=true) String json,
            HttpServletRequest request) {
        try {
            saveTenantId(request);
            DataModelInfo modelInfo = modelParser.parseCreateOrUpdate(json, "create");
            return modelCreateService.create(modelInfo, 0);
        } catch (MaoCommonException e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        }
    }

    @RequestMapping(value = "update", method = RequestMethod.PUT)
    public CommonResponse updateModel(
            @RequestBody(required=true) String json,
            HttpServletRequest request) {
        try {
            saveTenantId(request);
            DataModelInfo modelInfo = modelParser.parseCreateOrUpdate(json,"update");
            return modelUpdateService.update(modelInfo);
        } catch (MaoCommonException e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        }
    }
    
    @RequestMapping(value = "delete", method = RequestMethod.DELETE)
    public CommonResponse deleteDataModel(HttpServletRequest request, 
    		@RequestParam("modelId") String modelId) {
    	try {
            saveTenantId(request);
            modelValidateSercie.validateModel("delete",modelId);
            return modelDeleteService.deleteDataModel(modelId);
        } catch (MaoCommonException e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        }
    }
    
    @RequestMapping(value = "validate",method = RequestMethod.GET)
    public CommonResponse validateModel(
    		HttpServletRequest request,
    		@RequestParam("validateType") String type,
    		@RequestParam("modelId") String modelIdStr) {
    	try {
            saveTenantId(request);
            modelValidateSercie.validateModel(type,modelIdStr);
            return new CommonResponse(CommonResponse.STATUS_SUCCESS, CommonResponse.MESSAGE_SUCCESS);
        } catch (MaoCommonException e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getLocalizedMessage());
        }
		
    }
    
    @RequestMapping(value = "delete/table", method = RequestMethod.DELETE)
    public CommonResponse deleteTable(HttpServletRequest request, @RequestParam(value = "tableName", required = true) String tableName) {
        return dataModelAssociatedInformationService.deleteTable(request, tableName);
    }
    
    @RequestMapping(value = "publish", method = RequestMethod.PUT)
    public CommonResponse createTableByModel(HttpServletRequest request, @RequestParam(value = "modelId", required = true) String modelId) {
        return dataModelAssociatedInformationService.createTableByModel(request, modelId);
    }
    
    @RequestMapping(value = "execute/sql", method = RequestMethod.PUT)
    public CommonResponse sqlExecute(HttpServletRequest request, @RequestBody String sql) {
        try {
            saveTenantId(request);
            return dataModelAssociatedInformationService.executeSql(sql);
        } catch (MaoCommonException e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        }
    }
    
    @RequestMapping(value = "upload/globalization", method = RequestMethod.POST)
    public CommonResponse uploadGlobalization (HttpServletRequest request,  @RequestParam("files") MultipartFile[] files) {
        try {
            saveTenantId(request);
            return dataModelService.uploadConfigFiles(files);
        } catch (MaoCommonException e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getLocalizedMessage());
        }
    }
    
    @RequestMapping(value = "export", method = RequestMethod.GET)
    public void exportDataModel(@RequestParam("modelId") String modelId,
    		HttpServletRequest request,
    		HttpServletResponse response) throws MaoCommonException {
    	saveTenantId(request);
    	modelExportService.exportAllDataModel(modelId, request,response);
    }
    
    @RequestMapping(value = "upload/dataModel", method = RequestMethod.POST)
    public CommonResponse uploadDataModel (
    		HttpServletRequest request,  
    		@RequestParam("files") MultipartFile[] files)  {
        try {
            saveTenantId(request);
            return modelImportService.uploadDataModel(request,files);
        } catch (MaoCommonException e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getLocalizedMessage());
        }
    }

    @RequestMapping(value = "layout-template/download", method = RequestMethod.GET)
    public CommonResponse downloadLayoutTemplate(
            @RequestParam("model-info") String modelInfoJson,
            HttpServletRequest request) throws MaoCommonException {
        saveTenantId(request);
        DataModelInfo modelInfo = modelParser.parseCreateOrUpdate(modelInfoJson, "create");
        return dataModelService.downloadLayoutTemplate(modelInfo);
    }
}
