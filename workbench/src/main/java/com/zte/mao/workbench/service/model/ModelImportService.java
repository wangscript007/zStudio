package com.zte.mao.workbench.service.model;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.Enumeration;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.workbench.controller.DataModelController;
import com.zte.mao.workbench.entity.model.DataModelInfo;
import com.zte.mao.workbench.service.orm.DataModelInfoService;

@Service
public class ModelImportService {
	private static final Logger logger = Logger.getLogger(DataModelInfoService.class);

	@Resource
	private ModelCreateService modelCreateService;
	@Resource
	private ModelValidateService modelValidateService;

	public CommonResponse uploadDataModel(HttpServletRequest request, MultipartFile[] files)  {
		if (ArrayUtils.isNotEmpty(files)) {
			CommonResponse commonResponse = null;
			String zipFileName = files[0].getOriginalFilename();
			String packageName = zipFileName.split("\\.")[0];
			if(packageName.contains("(") &&packageName.contains(")")){
				packageName = packageName.substring(0,packageName.indexOf("(")).trim();
			}
			String currentTime = System.currentTimeMillis() + "";
			String path = request.getServletContext().getRealPath("");
			String zipOutPath = path + "TempDataModelZip"+File.separator 
					+ DataModelController.getTenantId() + "_" + currentTime;
			File dataModelZipFile = new File(zipOutPath, zipFileName);
			if (!dataModelZipFile.exists()) {
				dataModelZipFile.mkdirs();
			}
			try {
				files[0].transferTo(dataModelZipFile);
				commonResponse = readDataModelZip(dataModelZipFile.getAbsolutePath());
				FileUtils.forceDelete(new File(zipOutPath));
			} catch (IllegalStateException e) {
				logger.error(e.getMessage(), e);
				return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
			} catch (IOException e) {
				logger.error(e.getMessage(), e);
				return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
			} catch (MaoCommonException e) {
				logger.error(e.getMessage(), e);
				return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
			}
			return commonResponse;
		}
		return new CommonResponse(CommonResponse.STATUS_FAIL, "请上传数据模型压缩包文件！");

	}

	private CommonResponse readDataModelZip(String dataModelZipPath) throws MaoCommonException  {  
		ZipFile zipFile = null;
		CommonResponse commonResponse = null;
		StringBuilder idRepeatErrorStringBuilder = new StringBuilder();
		StringBuilder tableNotExistErrorBuilder = new StringBuilder();
		StringBuilder errorBuilder = new StringBuilder();
		String tenantId = DataModelController.getTenantId();
		try {
			zipFile = new ZipFile(dataModelZipPath);
			for (Enumeration<? extends ZipEntry> e = zipFile.entries(); e.hasMoreElements();){
				ZipEntry entry=e.nextElement();
				if(entry.getName().toLowerCase().endsWith(".json")){
					ObjectMapper mapper = new ObjectMapper();
					JsonNode jsonNode = mapper.readTree(zipFile.getInputStream(entry));
					JsonNode basicNode = jsonNode.findPath("baisc");
					((ObjectNode)basicNode).put("createTime", 0);
					((ObjectNode)basicNode).put("updateTime", 0);
					DataModelInfo dataModelInfo = mapper.readValue(jsonNode.toString(), DataModelInfo.class);
					for(int i=0,len=dataModelInfo.getItemList().size() ; i < len ; i++){
						if(dataModelInfo.getItemList().get(i).getDefaultValue() == null){
							dataModelInfo.getItemList().get(i).setDefaultValue("");
						}
					}
					modelValidateService.validateDataModelInfo(dataModelInfo,tenantId);
					Date createOrUpdateDate = new Date();
					dataModelInfo.getBaisc().setCreateTime(createOrUpdateDate);
					dataModelInfo.getBaisc().setUpdateTime(createOrUpdateDate);
					commonResponse = modelCreateService.create(dataModelInfo,1);
					if(commonResponse.getStatus() == CommonResponse.STATUS_FAIL){
						if("tableNotExist".equals(commonResponse.getMessage())){
							tableNotExistErrorBuilder.append(" \""+dataModelInfo.getBaisc().getId() + "\" ");
						}else{
							idRepeatErrorStringBuilder.append(" \"" +dataModelInfo.getBaisc().getId() + "\" ");
						}
					}
				}
			}
			if(idRepeatErrorStringBuilder.length() != 0){
				errorBuilder.append("导入数据模型")
				.append(idRepeatErrorStringBuilder.toString())
				.append("失败，请检查ID是否重复！");

			}
			if(tableNotExistErrorBuilder.length() != 0){
				errorBuilder.append("导入数据模型")
				.append(tableNotExistErrorBuilder.toString())
				.append("失败，请检查其绑定表是否存在！");
			}
			if(errorBuilder.length() != 0){
				return new CommonResponse(CommonResponse.STATUS_FAIL,errorBuilder.toString());
			}
			return new CommonResponse(CommonResponse.STATUS_SUCCESS, CommonResponse.MESSAGE_SUCCESS);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			throw new MaoCommonException("读取zip包中json文件出错！");
		} finally{
			if (zipFile != null) {
				try {
					zipFile.close();
				} catch (IOException e) {
					logger.error(e.getMessage(), e);
					throw new MaoCommonException("关闭zip文件流出错！");
				}
			}
		}
	}


}
