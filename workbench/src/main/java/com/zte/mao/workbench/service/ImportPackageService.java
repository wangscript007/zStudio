package com.zte.mao.workbench.service;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.base.OrmQueryCondition;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.http.HttpRequestUtils;
import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.common.session.SessionManager;
import com.zte.mao.common.util.MaoCommonUtil;

@Service
public class ImportPackageService {
	private static Logger logger = Logger.getLogger(ImportPackageService.class.getName());

	@Resource
	private SessionManager sessionManager;

	@Resource
	private OrmDao ormDao;

	@Resource
	private HttpRequestUtils httpRequestUtils;

	private String localUrlPrefix = "http://127.0.0.1";

	ObjectMapper objectMapper = new ObjectMapper();

	/**
	 * 导入文件
	 * 
	 * @param userName
	 * @param tenantId
	 */
	@SuppressWarnings("unchecked")
	public CommonResponse importFile(HttpServletRequest request, MultipartFile file, String userName, String tenantId) {

		CommonResponse commonResponse = new CommonResponse();
		String zipFileName = file.getOriginalFilename();
		String packageName = zipFileName.split("\\.")[0];
		if (packageName.contains("(") && packageName.contains(")")) {
			packageName = packageName.substring(0, packageName.indexOf("(")).trim();
		}
		String path = request.getServletContext().getRealPath("");
		String zipOutPath = path + "process_package_zip" + File.separator + tenantId;
		File pricessPackageZipFile = new File(zipOutPath, zipFileName);
		if (!pricessPackageZipFile.exists()) {
			pricessPackageZipFile.mkdirs();
		}

		try {
			file.transferTo(pricessPackageZipFile);
		} catch (IllegalStateException e) {
			logger.error(e.getMessage(), e);
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		}
		try {
			Object decompressPathName = deCompress(zipOutPath, zipFileName, path);
			int index = path.indexOf("workbench" + File.separator);
			String newPath = path.substring(0, index) + "designer";
			StringBuilder newDir = new StringBuilder();
			newDir.append(newPath).append(File.separator).append("layoutit").append(File.separator).append(tenantId);
			String oldPath = zipOutPath + File.separator + decompressPathName + File.separator + "forms";

			File formlist = new File(oldPath + File.separator + "formlist.json");
			// 从formlist.json文件读取数据
			StringBuffer stringBuffer = new StringBuffer();
			String line = null;
			List<Map<String, String>> readValue = null;
			BufferedReader br = null;
			InputStreamReader isr = null;
			if (formlist.exists()) {
				try {
					isr = new InputStreamReader(new FileInputStream(formlist), "UTF-8");
					br = new BufferedReader(isr);
					while ((line = br.readLine()) != null) {
						stringBuffer.append(line);
					}
					readValue = objectMapper.readValue(stringBuffer.toString(), List.class);
				} catch (FileNotFoundException e) {
					logger.error(e.getMessage(), e);
				} catch (IOException e) {
					logger.error(e.getMessage(), e);
				} finally {
					br.close();
					isr.close();
				}
			}

			// 复制文件
			copyFolder(oldPath, newDir.toString());
			if (new File(zipOutPath + File.separator + decompressPathName + File.separator + "designer-frame-files")
					.exists()) {
				copyFolder(zipOutPath + File.separator + decompressPathName + File.separator + "designer-frame-files",
						path.substring(0, index) + "designer-frame-files");
			}
			/*
			 * 判断是否重复导入同名流程包，查询数据库是否已存在该流程包信息，有做删除
			 */
			List<OrmQueryCondition> conditionsO = OrmQueryCondition.getConditions();
			conditionsO.add(OrmQueryCondition.generatorCondition().setCname("packagename").setValue(packageName));
			String[] columnsO = { "id" };
			List<Map<String, String>> oldPackageIds = ormDao.getData("bcp_re_processpackage", columnsO, conditionsO,
					OrmDao.OPERATOR_AND, tenantId);
			if (oldPackageIds != null && oldPackageIds.size() != 0) {
				String oldPackageID = oldPackageIds.get(0).get("id");

				OrmQueryCondition condition = new OrmQueryCondition();
				condition.setCname("packageid");
				condition.setValue(oldPackageID);
				condition.setCompare("=");
				ormDao.delete("bcp_re_form", condition, tenantId);

				OrmQueryCondition conditionPackage = new OrmQueryCondition();
				conditionPackage.setCname("packagename");
				conditionPackage.setValue(packageName);
				conditionPackage.setCompare("=");
				ormDao.delete("bcp_re_processpackage", conditionPackage, tenantId);
			}
			/*
			 * 往数据库“bcp_re_processpackage”和“bcp_re_form”插入数据
			 */
			Map<String, String> map = new HashMap<String, String>();
			map.put("packagename", packageName);
			map.put("creator", userName);
			ormDao.add("bcp_re_processpackage", map, tenantId);

			List<OrmQueryCondition> conditions = OrmQueryCondition.getConditions();
			conditions.add(OrmQueryCondition.generatorCondition().setCname("packagename").setValue(packageName));
			String[] columns = { "id" };
			List<Map<String, String>> mapData = ormDao.getData("bcp_re_processpackage", columns, conditions,
					OrmDao.OPERATOR_AND, tenantId);
			String packageID = mapData.get(0).get("id");

			List<Map<String, String>> formsList = new ArrayList<Map<String, String>>();
			for (Map<String, String> form : readValue) {
				form.put("packageid", packageID);
				formsList.add(form);
			}
			ormDao.addList("bcp_re_form", formsList, tenantId);

			// 导入流程
			StringBuilder sFilePath = new StringBuilder();
			sFilePath.append(zipOutPath).append(File.separator).append(packageName).append(File.separator)
					.append("bpmns");
			File fileBpmn = new File(sFilePath.toString());
			File[] files = new File[] {};
			String modelIds = "";
			if (fileBpmn.exists() && fileBpmn.isDirectory()) {
				files = fileBpmn.listFiles();
			}
			for (File f : files) {
				if (f.getName().endsWith(".xml")) {
					// 创建空模型
					String modelId = this.createModel(tenantId, f.getName());
					modelIds = modelId + ",";
					// 导入流程Model
					deployModelByBPMNFile(f, modelId, tenantId);
				}
			}
			updateProcessPackage(packageID, modelIds, tenantId);
			commonResponse = new CommonResponse(CommonResponse.STATUS_SUCCESS, "success");
		} catch (MaoCommonException e) {
			logger.error(e.getMessage(), e);
			commonResponse = new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			commonResponse = new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
		}
		return commonResponse;
	}

	/**
	 * 
	 * @param zipOutPath
	 * @param zipFileName
	 * @param path
	 * @return
	 * @throws MaoCommonException
	 */
	public Object deCompress(String zipOutPath, String zipFileName, String path) throws MaoCommonException {
		String zipPath = zipOutPath + File.separator + zipFileName;
		zipPath = zipPath.replaceAll("\\\\", "/");

		FileInputStream inputStream = null;
		ZipInputStream zipInputStream = null;
		BufferedOutputStream bout = null;
		FileOutputStream out = null;
		String decompressPath = null;
		try {
			inputStream = new FileInputStream(zipPath);
			zipInputStream = new ZipInputStream(inputStream);
			ZipEntry zipEntry = zipInputStream.getNextEntry();
			String entityName = zipEntry.getName().replaceAll("\\\\", "/");
			decompressPath = entityName.substring(0, entityName.indexOf("/"));
			while (zipEntry != null) {

				String packagePath = zipOutPath + File.separator + zipEntry.getName();
				File zFile = new File(packagePath.replaceAll("\\\\", "/"));
				File parentFile = new File(zFile.getParentFile().getPath());
				if (zipEntry.isDirectory()) {
					if (!zFile.exists()) {
						zFile.mkdir();
					}
					zipInputStream.closeEntry();
				} else {
					if (!parentFile.exists()) {
						parentFile.mkdirs();
					}
					out = new FileOutputStream(zFile);
					bout = new BufferedOutputStream(out);
					int b;
					while ((b = zipInputStream.read()) != -1) {
						bout.write(b);
					}
					bout.flush();
				}
				zipEntry = zipInputStream.getNextEntry();
			}
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
			throw new MaoCommonException("zip解压失败，请检查包结构是否正确");
		} finally {
			try {
				if (null != zipInputStream) {
					zipInputStream.close();
				}
				if (null != inputStream) {
					inputStream.close();
				}
				if (null != bout) {
					bout.close();
				}
				if (null != out) {
					out.close();
				}
			} catch (IOException e) {

				logger.error(e.getMessage(), e);
				throw new MaoCommonException("zip解压失败，请检查包结构是否正确");
			}

		}
		return decompressPath;
	}

	/**
	 * 设计平台应用部署上传ZIP包到server端
	 * @param request
	 * @param packageName
	 * @throws Exception
	 */
    @SuppressWarnings("unchecked")
    public void transferZipFile(HttpServletRequest request, String packageName) throws Exception {
        String tenantId = sessionManager.getTenantId(request);
        String serverUrl = "http://"
                         + MaoCommonUtil.getLocalIP()
                         + ":9080/server/upload/design/application/zip?"
                         + "packageName="
                         + URLEncoder.encode(packageName, "UTF-8")
                         + "&tenantId="
                         + tenantId;
        StringBuilder pathBuilder = new StringBuilder();
        pathBuilder.append(request.getServletContext().getRealPath(""))
                   .append("ZipFile").append(File.separator)
                   .append(tenantId).append(File.separator)
                   .append(packageName).append(".zip");
        File file = new File(pathBuilder.toString());
        if (file.exists() == false) {
            throw new MaoCommonException("上传ZIP文件不存在。");
        }
        String uploadResult = uploadAppFile(packageName, tenantId, serverUrl, file);
        Map<String, Object> resultMap = objectMapper.readValue(uploadResult, Map.class);
        Integer status = (Integer) resultMap.get("status");
        if (status == 0) {
            throw new MaoCommonException("上传ZIP包失败。原因:" + resultMap.get("message"));
        }
    }

	/**
	 * 设计平台应用部署导入应用到测试平台
	 * @param request
	 * @param packageName
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public void importApplicationToServer(HttpServletRequest request, String packageName) throws Exception {
		String tenantId = sessionManager.getTenantId(request);
		String loginName = sessionManager.getLoginName(request);
		String url = "http://"
		        + MaoCommonUtil.getLocalIP() 
		        + ":9080/server/import/design/application/package?packageName=" 
				+ URLEncoder.encode(packageName, "UTF-8") 
				+ "&tenantId=" 
				+ tenantId 
				+ "&loginName=" 
				+ loginName;
		
		String importResult = httpRequestUtils.doPost(url, "{}", tenantId);
		Map<String, Object> resultMap = objectMapper.readValue(importResult, Map.class);
		Integer status = (Integer) resultMap.get("status");
        if (status == 0) {
            throw new MaoCommonException("导入应用失败。原因:" + resultMap.get("message"));
        }
	}

	/**
	 * 
	 * 复制文件方法
	 */
	public void copyFolder(String oldPath, String newPath) {
		try {
			// 如果文件夹不存在，则建立新文件夹
			(new File(newPath)).mkdirs();
			// 读取整个文件夹的内容到file字符串数组，下面设置一个游标i，不停地向下移开始读这个数组
			File filelist = new File(oldPath);
			String[] file = filelist.list();
			File temp = null;
			for (int i = 0; i < file.length; i++) {
				// 如果oldPath以路径分隔符/或者\结尾，那么则oldPath/文件名就可以了
				if (oldPath.endsWith(File.separator)) {
					temp = new File(oldPath + file[i]);
				} else {
					temp = new File(oldPath + File.separator + file[i]);
				}

				// 如果游标遇到文件
				if (temp.isFile()) {
					FileInputStream input = new FileInputStream(temp);
					FileOutputStream output = new FileOutputStream(
							newPath + File.separator + (temp.getName()).toString());
					byte[] bufferarray = new byte[1024 * 64];
					int prereadlength;
					while ((prereadlength = input.read(bufferarray)) != -1) {
						output.write(bufferarray, 0, prereadlength);
					}
					output.flush();
					output.close();
					input.close();
				}
				// 如果游标遇到文件夹
				if (temp.isDirectory()) {
					copyFolder(oldPath + File.separator + file[i], newPath + File.separator + file[i]);
				}
			}
		} catch (Exception e) {
			System.out.println("复制整个文件夹内容操作出错");
		}
	}

	private void deployModelByBPMNFile(File file, String modelId, String tenantId) throws Exception {
		String jsonAllFileName = file.getName();
		try {
			if (jsonAllFileName.split("\\.").length > 0) {
				jsonAllFileName = file.getName().split("\\.")[0] + ".bpmnAll.json";
			}
			ObjectNode node = (ObjectNode) objectMapper
					.readTree(new File(file.getParent() + File.separator + jsonAllFileName));
			((ObjectNode) node.get("model")).put("resourceId", modelId);
			List<OrmQueryCondition> conditions = OrmQueryCondition.getConditions();
			conditions.add(OrmQueryCondition.generatorCondition().setCname("ID_").setCompare("=").setValue(modelId));
			Map<String, String> data = new HashMap<String, String>();
			data.put("ID_", modelId);
			data.put("REV_", "1");
			data.put("BYTES_", objectMapper.writeValueAsString(node.get("model")));
			ormDao.add("act_ge_bytearray", data, tenantId);
			Map<String, String> dataModel = new HashMap<String, String>();
			dataModel.put("EDITOR_SOURCE_VALUE_ID_", modelId);
			ormDao.update("act_re_model", dataModel, conditions, OrmDao.OPERATOR_AND, tenantId);
		} catch (FileNotFoundException e) {
			logger.error(e.getMessage(), e);
			throw e;
		} catch (UnsupportedEncodingException e) {
			logger.error(e.getMessage(), e);
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
			throw e;
		} catch (MaoCommonException e) {
			logger.error(e.getMessage(), e);
			throw e;
		}
	}

	private void updateProcessPackage(String packageId, String modelIds, String tenantId) throws MaoCommonException {
		if (!modelIds.equals("")) {
			modelIds = modelIds.substring(0, modelIds.length() - 1);
			List<OrmQueryCondition> conditions = OrmQueryCondition.getConditions();
			conditions.add(OrmQueryCondition.generatorCondition().setCname("ID").setCompare("=").setValue(packageId));
			Map<String, String> data = new HashMap<String, String>();
			data.put("MODELIDS", modelIds);
			try {
				ormDao.update("bcp_re_processpackage", data, conditions, OrmDao.OPERATOR_AND, tenantId);
			} catch (MaoCommonException e) {
				logger.error(e.getMessage(), e);
				throw e;
			}
		}
	}

	private String createModel(String tenantId, String modelFileName) throws Exception {
		String modeId = "";
		String url = localUrlPrefix + ":" + MaoCommonUtil.getLocalPort() + "/bpe/service/repository/models";
		ObjectNode paramNode = objectMapper.createObjectNode();
		if (modelFileName.split("\\.").length > 0) {
			modelFileName = modelFileName.split("\\.")[0];
		}
		paramNode.put("name", modelFileName);
		paramNode.put("key", modelFileName);
		paramNode.put("category", "Model category");
		paramNode.put("version", "1");
		paramNode.put("metaInfo", "{\"name\":\"defaultModel\",\"revision\":1,\"description\":\"\"}");
		paramNode.put("tenantId", tenantId);
		try {
			String modelResult = httpRequestUtils.doPost(url, objectMapper.writeValueAsString(paramNode));
			JsonNode node = objectMapper.readTree(modelResult);
			if (node.has("id")) {
				modeId = node.get("id").asText().toString();
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			throw e;
		}
		return modeId;
	}
	
	private String uploadAppFile(String packageName, String tenantId, String serverUrl, File file) throws MaoCommonException {
        FileInputStream fileStream = null;
        String uploadResult;
        try {
            fileStream = FileUtils.openInputStream(file);
            if (fileStream == null) {
                throw new MaoCommonException("上传ZIP包失败。原因:应用包内容为空。packageName:" + packageName);
            }
            uploadResult = httpRequestUtils.doPostFile(serverUrl, "{}", packageName + ".zip", fileStream, tenantId, true);
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
            throw new MaoCommonException("上传ZIP包失败。原因：" + e.getLocalizedMessage());
        } finally {
            if (fileStream != null) {
                try {
                    fileStream.close();
                } catch (IOException e) {
                    // 文件流未关闭，无影响
                    logger.error(e.getMessage());
                }
            }
        }
        return uploadResult;
    }

}
