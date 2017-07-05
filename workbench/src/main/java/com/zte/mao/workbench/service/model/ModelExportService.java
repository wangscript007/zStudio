package com.zte.mao.workbench.service.model;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.service.CommonEnvService;
import com.zte.mao.common.util.FileUtil;
import com.zte.mao.workbench.controller.DataModelController;
import com.zte.mao.workbench.entity.model.DataModelBaisc;
import com.zte.mao.workbench.entity.model.DataModelGroup;
import com.zte.mao.workbench.entity.model.DataModelInfo;
import com.zte.mao.workbench.entity.model.DataModelItem;
import com.zte.mao.workbench.entity.model.template.DataModelTemplate;
import com.zte.mao.workbench.service.orm.DataModelGroupService;
import com.zte.mao.workbench.service.orm.DataModelInfoService;
import com.zte.mao.workbench.service.orm.DataModelItemService;
import com.zte.mao.workbench.utils.DateUtil;
import com.zte.mao.workbench.utils.ZipUtils;

@Service
public class ModelExportService {
	private static final Logger logger = Logger.getLogger(ModelExportService.class);
	@Resource
	private DataModelInfoService dataModelInfoService;
	@Resource
	private DataModelItemService dataModelItemService;
    @Resource
    private DataModelGroupService dataModelGroupService;
    @Resource
    private CommonEnvService commonEnvService;
	private static final String SUFFIX = ".json";

	@SuppressWarnings("unchecked")
	public void exportAllDataModel (String modelIdStr,HttpServletRequest request,HttpServletResponse response) throws MaoCommonException{
        try {
            if (StringUtils.isBlank(modelIdStr)) {
                logger.error("未指定导出的数据模型编号。");
                throw new MaoCommonException("未指定导出的数据模型编号。");
            }
            String tenantId = DataModelController.getTenantId();
            ObjectMapper mapper = new ObjectMapper();
            Set<String> modelIds = mapper.readValue(modelIdStr, Set.class);
            Set<DataModelBaisc> modelBasicSet = dataModelInfoService.getDataModelInfos(modelIds, tenantId);
            Map<String, List<DataModelItem>> modelItemMap = dataModelItemService.getDataModelItems(modelIds);
            Map<String, List<DataModelGroup>> itemGroupMap = dataModelGroupService.getGroupMap(modelIds);
            String dateCode = System.currentTimeMillis() + "_" + Math.round(Math.random());
            for (DataModelBaisc modelBasic : modelBasicSet) {
                String modelId = modelBasic.getId();
                if (modelItemMap.containsKey(modelId) == false) {
                    logger.warn("模型不存在。Model ID: " + modelId);
                    continue;
                }
                DataModelInfo dataModelInfo = new DataModelInfo();
                dataModelInfo.setBaisc(modelBasic);
                dataModelInfo.setItemList(modelItemMap.get(modelId));
                dataModelInfo.setGroupList(itemGroupMap.get(modelId));
                exportDataModel(dataModelInfo, dateCode, request);
            }
            createModelZip(tenantId, dateCode, request);
            downloadLocal(tenantId, dateCode, request, response);
            deleteDataModelsFile(tenantId, dateCode, request);
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
            throw new MaoCommonException(e);
        }
    }
	
    public String exportModelItemGroups(DataModelTemplate modelTemplate, String modelId) throws MaoCommonException {
        ObjectMapper mapper = new ObjectMapper();
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            mapper.setDateFormat(sdf);
            mapper.setSerializationInclusion(Include.NON_NULL);
            mapper.enable(SerializationFeature.INDENT_OUTPUT);
            String conntent = mapper.writeValueAsString(modelTemplate);
            String relativePath = "runtime" + File.separator
                                + "model" + File.separator
                                + DataModelController.getTenantId() + File.separator
                                + "layout-template" + File.separator
                                + DateUtil.getTimestamp()  + File.separator
                                + modelId + SUFFIX;
            String tempFilePath = commonEnvService.getAppHomePath() + relativePath;
            File file = new File(tempFilePath);
            FileUtils.forceDeleteOnExit(file);
            FileUtils.writeStringToFile(file, conntent, "UTF-8");
            return relativePath;
        } catch (JsonProcessingException e) {
            logger.error(e.getMessage(),e);
            throw new MaoCommonException( "导出面板分组失败。"+e.getMessage());
        } catch (IOException e) {
            logger.error(e.getMessage(),e);
            throw new MaoCommonException( "导出面板分组失败。"+e.getMessage());
        }
    }

    private void deleteDataModelsFile(String tenantId, String dateCode, HttpServletRequest request) throws IOException {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(FileUtil.getApplicationRealPath(request))
		             .append(tenantId)
		             .append("_")
		             .append(dateCode);
		File file = new File(stringBuilder.toString());
		if(file.exists()){
			FileUtils.forceDelete(file);
		}
	}

	private void exportDataModel(DataModelInfo dataModelInfo,String dateCode,
			HttpServletRequest request) throws MaoCommonException {
		ObjectMapper mapper = new ObjectMapper();
		try {
			SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			mapper.setDateFormat(sdf);
			mapper.setSerializationInclusion(Include.NON_NULL);
			String dataModelFileContent = mapper.writeValueAsString(dataModelInfo);
			String tenantId = DataModelController.getTenantId();
			String fileName = dataModelInfo.getBaisc().getId();
			saveFileToTemp(fileName,tenantId,dateCode,request, dataModelFileContent);
		} catch (JsonProcessingException e) {
			logger.error(e.getMessage(),e);
			throw new MaoCommonException( "导出数据模型错误！"+e.getMessage());
		} catch (IOException e) {
			logger.error(e.getMessage(),e);
			throw new MaoCommonException( "导出数据模型错误！"+e.getMessage());
		}
	}


	private void saveFileToTemp(String fileName,String tenantId,
			String dateCode, HttpServletRequest request, String fileContent)throws IOException{
		StringBuilder stringBuilder = new StringBuilder();
		stringBuilder.append(FileUtil.getApplicationRealPath(request))
		             .append(tenantId)
		             .append("_")
		             .append(dateCode)
		             .append(File.separator)
		             .append("TempDataModelFile")
		             .append(File.separator)
		             .append(fileName)
		             .append(SUFFIX);
		File file = new File(stringBuilder.toString());
		FileUtils.writeStringToFile(file, fileContent, "UTF-8");
	}

	private void createModelZip(String tenantId,String dateCode,
			HttpServletRequest request) throws IOException{
		StringBuilder stringBuilder = new StringBuilder();
		String sourceFilePath = stringBuilder.append(FileUtil.getApplicationRealPath(request))
				                            .append(tenantId)
				                            .append("_")
				                            .append(dateCode)
				                            .append(File.separator)
				                            .append("TempDataModelFile")
				                            .append(File.separator)
				                            .toString();
		stringBuilder = new StringBuilder();
		String zipFilePath = stringBuilder.append(FileUtil.getApplicationRealPath(request))
				                          .append(tenantId)
				                          .append("_")
				                          .append(dateCode)
				                          .append(File.separator)
				                          .append("DataModelZipFile")
				                          .append(".zip")
				                          .toString();
		ZipUtils.fileToZip(sourceFilePath, zipFilePath);
	}

	private void downloadLocal(String tenantId,String dateCode,HttpServletRequest request, HttpServletResponse response) throws MaoCommonException, FileNotFoundException{
		String fileName = "DataModelFile.zip".toString(); 
		StringBuilder stringBuilder = new StringBuilder();
		stringBuilder.append(FileUtil.getApplicationRealPath(request))
		             .append(tenantId)
				     .append("_")
				     .append(dateCode)
				     .append(File.separator)
				     .append("DataModelZipFile")
				     .append(".zip");
		InputStream inStream = new FileInputStream(stringBuilder.toString());
		response.reset();
		response.addHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
		byte[] b = new byte[100];
		int len;
		try {
			while ((len = inStream.read(b)) > 0)
				response.getOutputStream().write(b, 0, len);
			inStream.close();
		} catch (IOException e) {
			logger.error(e.getMessage(),e);
			throw new MaoCommonException( "导出数据模型错误！"+e.getMessage());
		}
	}
}
