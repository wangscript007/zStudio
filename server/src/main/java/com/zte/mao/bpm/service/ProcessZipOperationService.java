package com.zte.mao.bpm.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URLDecoder;
import java.nio.charset.Charset;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipInputStream;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mao.bpm.util.FileDeleteUtil;
import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.base.OrmQueryCondition;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.http.HttpRequestUtils;
import com.zte.mao.common.service.DeployPackageService;
import com.zte.mao.common.session.SessionManager;
import com.zte.mao.common.util.FileUtil;

@Service
public class ProcessZipOperationService {
	private static Logger logger = Logger
			.getLogger(ProcessZipOperationService.class.getName());
	private static String PROCESS_PACKAGE = "process_package";
	private static String PROCESS_PACKAGE_ZIP = "process_package_zip";
	private static String USER_FORMS = "userforms";
	private static String PACKAGE_TABLE_NAME = "bcp_re_import_process";
	private static String FORM_TABLE_NAME = "bcp_re_form";
	private static String MENU_TABLE_NAME = "tenant_menu";

	ObjectMapper objectMapper = new ObjectMapper();
	
	@Resource
	private OrmDao ormDao;
	@Resource
	private SessionManager sessionManager;
	@Resource
	DeployPackageService deployPackageService;
	@Resource
	private HttpRequestUtils httpRequestUtils;

    public String importZipFile(HttpServletRequest request, MultipartFile file) throws MaoCommonException {
        String zipFileName = file.getOriginalFilename();

        String zipPath = getZipPath(request);
        String zipPackagePath = zipPath + File.separator + zipFileName;

        try {
            FileDeleteUtil.delete(zipPackagePath);

            File processPackageZipFile = new File(zipPath, zipFileName);
            if (!processPackageZipFile.exists()) {
                processPackageZipFile.mkdirs();
            }

            file.transferTo(processPackageZipFile);

            return getApplicationName(zipPackagePath);
        } catch (IllegalStateException e) {
            logger.error(e.getMessage(), e);
            FileDeleteUtil.delete(zipPackagePath);
            throw new MaoCommonException("导入失败，请与管理员联系。");
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
            FileDeleteUtil.delete(zipPackagePath);
            throw new MaoCommonException("导入失败，请与管理员联系。");
        }
    }

	/**
	 * 测试平台解压导入的应用文件
	 * @param request
	 * @param zipFileName
	 * @param decompressFileName
	 * @throws MaoCommonException
	 */
    public void decompressFile(HttpServletRequest request, String zipFileName, String appFileName)
            throws MaoCommonException {
        String path = request.getServletContext().getRealPath("");
        String zipOutPath = getZipPath(request);
        String zipPath = zipOutPath + File.separator + zipFileName;
        String tenantId = getTenantId(request);
        
        String descDir = path 
                + PROCESS_PACKAGE + File.separator 
                + tenantId + File.separator;
        
        File zipFile = new File(zipPath);
        unZipFiles(zipFile, descDir, appFileName);
    }

	/**
	 * 设计平台跳转到运行平台/测试平台应用导入
	 * @param request
	 * @param processPackageName
	 * @return
	 * @throws Exception
	 */
	@Transactional
    public void importDesignApplication(HttpServletRequest request, String packageName, String tenantId,
            String loginName) throws Exception {
        String realPath = request.getServletContext().getRealPath("");

        String zipFilePath = realPath 
                + PROCESS_PACKAGE_ZIP + File.separator
                + tenantId + File.separator
                + packageName + ".zip";
        String descDir = realPath 
                + PROCESS_PACKAGE + File.separator 
                + tenantId + File.separator;
        unZipFiles(new File(zipFilePath), descDir, packageName);

        String packageInfoPath = realPath 
                + PROCESS_PACKAGE + File.separator 
                + tenantId + File.separator 
                + packageName + File.separator 
                + "misc" + File.separator 
                + "package_info.json";
        String formListInfoPath = realPath 
                + PROCESS_PACKAGE + File.separator 
                + tenantId + File.separator 
                + packageName + File.separator 
                + "forms" + File.separator 
                + "formlist.json";

        // 生成应用单、模型数据表、菜单
        deployPackageService.deployDataModel(packageName, request, tenantId);
        String applicationId = savePackageInfo(request, packageInfoPath, packageName, tenantId, loginName);
        deployPackageService.deployMenu(packageName, tenantId, request, applicationId);
        importFormListInfo(formListInfoPath, request, applicationId, tenantId);

        String targetDatavisualFilePath = realPath + USER_FORMS + File.separator + "datavisual" + File.separator
                + tenantId + File.separator;
        String targetFilePath = realPath + USER_FORMS + File.separator + "form" + File.separator + tenantId
                + File.separator;
        
        String appName = getPackageName(packageInfoPath);
        String sourceFilePath = realPath + PROCESS_PACKAGE + File.separator + tenantId + File.separator + appName + File.separator;
        deCompressFormToRoot(tenantId, targetFilePath, sourceFilePath +  "forms", applicationId);
        deCompressFormToRoot(tenantId, targetDatavisualFilePath, sourceFilePath + "datavisual", applicationId);
        copyDefaultCommonFile(targetFilePath);
        copyDefaultCommonFile(targetDatavisualFilePath);
        FileDeleteUtil.delete(sourceFilePath);
    }
	
	public void deleteApplicationZipFile(HttpServletRequest request, String zipFileName) throws MaoCommonException {
	    FileDeleteUtil.delete(getZipPath(request) + File.separator + zipFileName);
	}

    private void deCompressFormToRoot(String tenantId, String targetFilePath, String sourceFilePath,
            String applicationId) throws IOException, MaoCommonException {
        try {
            File sourceFile = new File(sourceFilePath);
            if (sourceFile.exists()) {
                FileUtil.copy(sourceFile.getCanonicalPath(), targetFilePath);
            }
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
            // 删除数据表
            deleteAppTable(applicationId, tenantId);
            throw new IOException(e);
        }
    }

	/**
	 * 拷贝到上层目录并同时删除包下default-common.js文件
	 * @param targetFilePath
	 * @param path
	 * @param applicationId
	 * @param tenantId
	 * @throws MaoCommonException
	 */
    private void copyDefaultCommonFile(String targetFilePath) {
        String defaultCommonPath = targetFilePath + "default_common.js";
        File sourceFile = new File(defaultCommonPath);
        if (sourceFile.exists()) {
            File parentFile = new File(sourceFile.getParent());
            String defaultTargetPath = parentFile.getParent() + File.separator + "default_common.js";
            FileUtil.fileCopy(defaultCommonPath, defaultTargetPath);
            sourceFile.delete();
        }
    }

	/**
	 * 写表单数据、菜单数据到数据库中
	 * @param appFileName
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@Transactional
    public void importFormInfo(String appFileName, HttpServletRequest request) throws Exception {
        String realPath = request.getServletContext().getRealPath("");
        String tenantId = getTenantId(request);

        String packagePath = realPath 
                + PROCESS_PACKAGE + File.separator 
                + tenantId + File.separator
                + appFileName;
        String packageInfoJsonPath = packagePath + File.separator 
                + "misc" + File.separator + "package_info.json";
        String formListInfoPath = packagePath + File.separator 
                + "forms" + File.separator + "formlist.json";
        String targetDatavisualFilePath = realPath 
                + USER_FORMS + File.separator 
                + "datavisual" + File.separator
                + tenantId + File.separator;
        String targetFilePath = realPath 
                + USER_FORMS + File.separator 
                + "form" + File.separator 
                + tenantId + File.separator;
        
        //判断是否为空文件夹
        checkAppDirectory(packagePath, appFileName);

        deployPackageService.deployDataModel(appFileName, request, tenantId);
        String applicationId = savePackageInfo(request, packageInfoJsonPath, appFileName, tenantId, getLoginName(request));
        deployPackageService.deployMenu(appFileName, tenantId, request, applicationId);
        importFormListInfo(formListInfoPath, request, applicationId, tenantId);

        String sourceFilePath = realPath + PROCESS_PACKAGE + File.separator + tenantId + File.separator + appFileName + File.separator;
        deCompressFormToRoot(tenantId, targetFilePath, sourceFilePath + "forms", applicationId);
        deCompressFormToRoot(tenantId, targetDatavisualFilePath, sourceFilePath + "datavisual", applicationId);
        copyDefaultCommonFile(targetFilePath);
        copyDefaultCommonFile(targetDatavisualFilePath);
        FileDeleteUtil.delete(packagePath);
    }

    public boolean deletePackageFile(HttpServletRequest request, String packageName) throws Exception {
        String path = request.getServletContext().getRealPath("");
        String packagePath = path + PROCESS_PACKAGE + File.separator + getTenantId(request)
                + File.separator + packageName;
        return FileDeleteUtil.delete(packagePath);
    }
	
	/**
	 * 保存ZIP文件到本地路径
	 * @param file
	 * @param request
	 * @param tenantId
	 * @param packageName
	 * @throws IOException
	 */
    public void saveZipFileToLocal(MultipartFile file, HttpServletRequest request, 
    		String tenantId, String packageName) throws IOException {
		String zipFileName = URLDecoder.decode(packageName, "UTF-8") + ".zip";
		String zipPath = request.getServletContext().getRealPath("") 
		        + PROCESS_PACKAGE_ZIP + File.separator 
		        + tenantId + File.separator;
		File processPackageZipFile = new File(zipPath, zipFileName);
		
		if (!processPackageZipFile.exists()) {
			processPackageZipFile.mkdirs();
		}
		
		file.transferTo(processPackageZipFile);
    }

	/**
	 * 将表单、列表、图表数据写入“bcp_re_form”表中
	 * @param path
	 * @param request
	 * @param packageId
	 * @return
	 * @throws Exception
	 */
    private void importFormListInfo(String path, HttpServletRequest request, String applicationId, String tenantId)
            throws Exception {
        try {
            String formAndChartStr = getFileAsString(new File(path));
            JSONArray jsonArray = JSONArray.fromObject(formAndChartStr);
            
            // 根据packageId先删除“bcp_re_form”表全部相关数据，然后再新增数据
            OrmQueryCondition condition = new OrmQueryCondition("packageid", "=", applicationId);
            ormDao.delete(FORM_TABLE_NAME, condition, tenantId);
            
            List<Map<String, String>> formList = getFormList(applicationId, jsonArray);
            ormDao.addList(FORM_TABLE_NAME, formList, tenantId);
        } catch (Exception e) {
            deleteAppTable(applicationId, tenantId);
            throw e;
        }
    }

    @SuppressWarnings({ "rawtypes", "unchecked" })
    private List<Map<String, String>> getFormList(String applicationId, JSONArray jsonArray) {
        List<Map<String, String>> formList = new ArrayList<Map<String, String>>();
        Iterator it = jsonArray.iterator();
        while (it.hasNext()) {
            Map<String, String> values = new HashMap<>();
            JSONObject jsonObject = (JSONObject) (it.next());
            Iterator<String> iterator = jsonObject.keys();
            while (iterator.hasNext()) {
                String key = iterator.next();
                if (!"id".equals(key)) {
                    values.put(key, jsonObject.getString(key));
                }
            }

            values.put("packageid", applicationId);
            formList.add(values);
        }
        return formList;
    }

	/**
	 * 生成应用管理数据并将数据ID返回
	 * @param request
	 * @param filePath
	 * @param packageName
	 * @return
	 * @throws IOException 
	 * @throws Exception
	 */
    private String savePackageInfo(HttpServletRequest request, String filePath, String packageName, String tenantId,
            String loginName) throws MaoCommonException {
        List<OrmQueryCondition> conditions = new ArrayList<OrmQueryCondition>();
        OrmQueryCondition condition = new OrmQueryCondition("process_packageName", "=", packageName);
        conditions.add(condition);
        String[] quryColumns = new String[] { "id" };
        List<Map<String, String>> packageData = ormDao.getData(PACKAGE_TABLE_NAME, quryColumns, conditions, "and", tenantId);

        JSONObject packageJson = getPackageInfo(filePath);
        String version = packageJson.get("VERSION").toString();
        Map<String, String> applicationRow = new HashMap<String, String>();
        applicationRow.put("import_userName", loginName.toString());
        applicationRow.put("import_time", getCurrentDateStr());
        applicationRow.put("process_packageName", packageName);
        applicationRow.put("process_package_version", version);
        if (packageData.isEmpty()) {
            String result = ormDao.addWithReturnPk(PACKAGE_TABLE_NAME, applicationRow, tenantId);
            return extractPK(result);
        } else {
            ormDao.update(PACKAGE_TABLE_NAME, applicationRow, conditions, "and", tenantId);
            return packageData.get(0).get("id");
        }
    }

    private JSONObject getPackageInfo(String filePath) throws MaoCommonException {
        String context = getFileAsString(new File(filePath));
        return JSONObject.fromObject(context);
    }

    private String getPackageName(String filePath) throws MaoCommonException {
        JSONObject packageJson = getPackageInfo(filePath);
        return packageJson.get("PACKAGENAME").toString();
    }

	private String getCurrentDateStr() {
		Date date = new Date();
		SimpleDateFormat format = new SimpleDateFormat("YYYY-MM-dd HH:mm:ss");
		return format.format(date);
	}

	/**
	 * 将"..\server\process_package\tenantId\pacageName\forms\form-list.json"文件内容转换为字符串
	 * @param file
	 * @return
	 * @throws MaoCommonException 
	 * @throws IOException
	 */
	private String getFileAsString(File file) throws MaoCommonException {
		InputStream inputStream = null;
		InputStreamReader inputStreamReader = null;
		BufferedReader reader = null;
		StringBuffer resultBuffer = new StringBuffer();
		String tempLine = null;

		try {
			inputStream = new FileInputStream(file);
			inputStreamReader = new InputStreamReader(inputStream, "UTF-8");
			reader = new BufferedReader(inputStreamReader);
			while ((tempLine = reader.readLine()) != null) {
				resultBuffer.append(tempLine);
			}
		} catch (FileNotFoundException e) {
			logger.error(e.getMessage(), e);
			throw new MaoCommonException("文件不存在，原因：系统找不到指定的路径。");
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
			throw new MaoCommonException("读取文件错误，原因：" + e.getLocalizedMessage());
		} finally {
			try {
				if (null != reader) {
					reader.close();
				}
			} catch (IOException e) {
				logger.error(e.getMessage(), e);
			}
			try {
			    if (null != inputStreamReader) {
			        inputStreamReader.close();
			    }
			} catch (IOException e) {
			    logger.error(e.getMessage(), e);
			}
			try {
			    if (null != inputStream) {
			        inputStream.close();
			    }
			} catch (IOException e) {
			    logger.error(e.getMessage(), e);
			}
		}

		return resultBuffer.toString();
	}
	
	/**
	 * 提取数据主键
	 * @param respInfo
	 * @return
	 * @throws MaoCommonException 
	 */
	@SuppressWarnings("unchecked")
    private String extractPK(String respInfo) throws MaoCommonException {
        String applicationId = "";
        if (StringUtils.isNotBlank(respInfo)) {
            JSONObject readValue;
            try {
                readValue = objectMapper.readValue(respInfo, JSONObject.class);
                readValue = objectMapper.readValue(readValue.get("primaryKey").toString(), JSONObject.class);
                List<String> listStr = objectMapper.readValue(readValue.get("id").toString(), List.class);
                if (listStr.size() > 0) {
                    applicationId = listStr.get(0);
                }
            } catch (JsonParseException e) {
                logger.error(e.getMessage(), e);
                throw new MaoCommonException(e);
            } catch (JsonMappingException e) {
                logger.error(e.getMessage(), e);
                throw new MaoCommonException(e);
            } catch (IOException e) {
                logger.error(e.getMessage(), e);
                throw new MaoCommonException(e);
            }
        }

        return applicationId;
    }
	
	/**
	 * 获取当前上传ZIP存储文件路径
	 * @param request
	 * @param path
	 * @return
	 * @throws MaoCommonException 
	 */
    private String getZipPath(HttpServletRequest request) throws MaoCommonException {
        return request.getServletContext().getRealPath("") + PROCESS_PACKAGE_ZIP + File.separator + getTenantId(request);
    }

	private String getTenantId(HttpServletRequest request) throws MaoCommonException {
		try {
		    return sessionManager.getTenantId(request);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
            throw new MaoCommonException(e.getLocalizedMessage(), e);
		}
	}
	
    private String getLoginName(HttpServletRequest request) throws MaoCommonException {
		try {
		    return sessionManager.getLoginName(request);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			throw new MaoCommonException(e.getLocalizedMessage(), e);
		}
	}
	
	/**
	 * 关闭
	 * @param zipInputStream
	 * @param inputStream
	 * @param bout
	 * @param out
	 * @param zipFile 
	 */
    private void closeFileIO(
            InputStream[] inputStreams,
            OutputStream[] outputStreams,
            ZipFile zipFile) {
        for (InputStream inputStream : inputStreams) {
            try {
                if (null != inputStream) {
                    inputStream.close();
                }
            } catch (IOException e) {
                logger.error(e.getMessage(), e);
            }
        }
        for (OutputStream outputStream : outputStreams) {
            try {
                if (null != outputStream) {
                    outputStream.close();
                }
            } catch (IOException e) {
                logger.error(e.getMessage(), e);
            }
        }
        try {
            if (null != zipFile) {
                zipFile.close();
            }
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
        }
	}
	
    private void deleteAppTable(String applicationId, String tenantId) throws MaoCommonException {
        OrmQueryCondition formCond = new OrmQueryCondition("packageid", OrmQueryCondition.COMPARE_EQUALS, applicationId);
        OrmQueryCondition appCond = new OrmQueryCondition("id", OrmQueryCondition.COMPARE_EQUALS, applicationId);
        OrmQueryCondition menuCond = new OrmQueryCondition("APPLICATIONID", OrmQueryCondition.COMPARE_EQUALS,
                applicationId);
        try {
            ormDao.delete(FORM_TABLE_NAME, formCond, tenantId);
            ormDao.delete(PACKAGE_TABLE_NAME, appCond, tenantId);
            ormDao.delete(MENU_TABLE_NAME, menuCond, tenantId);
        } catch (MaoCommonException e) {
            logger.error(e.getMessage(), e);
            throw new MaoCommonException(e);
        }
    }
    
    private void unZipFiles(File zipFile, String descDir, String appFileName) throws MaoCommonException {
        ZipFile zip = null;
        String name = null;
        InputStream in = null;
        FileOutputStream out = null;
        try {
            zip = new ZipFile(zipFile, Charset.forName("GBK")); // 解决中文文件夹乱码
            boolean isOSLinux = isOSLinux();
            if (isOSLinux) {
                name = zip.getName().substring(zip.getName().lastIndexOf('/') + 1, zip.getName().lastIndexOf('.'));
            } else {
                name = zip.getName().substring(zip.getName().lastIndexOf('\\') + 1, zip.getName().lastIndexOf('.'));
            }

            File pathFile = new File(descDir + appFileName);
            if (!pathFile.exists()) {
                pathFile.mkdirs();
            }

            for (Enumeration<? extends ZipEntry> entries = zip.entries(); entries.hasMoreElements();) {
                ZipEntry entry = (ZipEntry) entries.nextElement();
                String zipEntryName = entry.getName();
                in = zip.getInputStream(entry);
                // 输出文件路径信息
                String outPath = (descDir + "/" + zipEntryName).replaceAll("\\*", "/");

                // 判断路径是否存在,不存在则创建文件路径
                File file = new File(outPath.substring(0, outPath.lastIndexOf('/')));
                if (!file.exists()) {
                    file.mkdirs();
                }
                // 判断文件全路径是否为文件夹,如果是上面已经上传,不需要解压
                if (new File(outPath).isDirectory()) {
                    continue;
                }

                if (isOSLinux) {
                    outPath = (descDir + zipEntryName).replace("\\", "/");
                    file = new File(outPath);
                } else {
                    file = new File(outPath);
                }
                File parentFile = file.getParentFile();
                if (parentFile != null && (!parentFile.exists())) {
                    parentFile.mkdirs();
                }
                
                out = new FileOutputStream(outPath);
                byte[] buf1 = new byte[1024];
                int len;
                while ((len = in.read(buf1)) > 0) {
                    out.write(buf1, 0, len);
                }
                out.close();
                in.close();
            }
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
            FileDeleteUtil.delete(descDir + name);
            throw new MaoCommonException(e.getLocalizedMessage(), e);
        } finally {
            closeFileIO(new InputStream[] { in }, new OutputStream[] { out }, zip);
            FileDeleteUtil.delete(zipFile.toString());
        }
    }
    
    private void checkAppDirectory(String packagePath, String appFileName) throws MaoCommonException {
        File filePath = new File(packagePath);
        if (filePath.exists() && filePath.isDirectory()) {
            File[] files = filePath.listFiles();
            if (files == null || files.length < 1) {
                FileDeleteUtil.delete(packagePath);
                throw new MaoCommonException("应用" + appFileName + "没有包含文件。");
            }
            boolean flag = false;
            for (File file : files) {
                if (file.isDirectory() && "dataModel".equals(file.getName())) {
                    File[] dmFiles = file.listFiles();
                    for (File dmFile : dmFiles) {
                        if (dmFile.isFile() && "dataModel.sql".equals(dmFile.getName())) {
                            flag = true;
                        }
                    }
                }
            }
            if (flag == false) {
                FileDeleteUtil.delete(packagePath);
                throw new MaoCommonException("应用" + appFileName + "下的缺少数据模型配置文件。文件路径：/dataModel/dataModel.sql");
            }
        }
    }
    
    private String getApplicationName(String zipPath) throws MaoCommonException {
        zipPath = zipPath.replaceAll("\\\\", "/");

        FileInputStream inputStream = null;
        ZipInputStream zipInputStream = null;
        String decompressPath = null;
        try {
            inputStream = new FileInputStream(zipPath);
            zipInputStream = new ZipInputStream(inputStream);
            ZipEntry zipEntry = zipInputStream.getNextEntry();
            String entityName = zipEntry.getName().replaceAll("\\\\", "/");
            decompressPath = entityName.substring(0, entityName.indexOf("/"));
            zipInputStream.closeEntry();
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
            throw new MaoCommonException(e.getLocalizedMessage(), e);
        } finally {
            try {
                if (zipInputStream != null) {
                    zipInputStream.close();
                    zipInputStream = null;
                }
            } catch (IOException e) {
                logger.error(e.getMessage(), e);
            }
            try {
                if (inputStream != null) {
                    inputStream.close();
                    inputStream = null;
                }
            } catch (IOException e) {
                logger.error(e.getMessage(), e);
            }
        }
        return decompressPath;
    }
    
    private boolean isOSLinux() {
        Properties prop = System.getProperties();

        String os = prop.getProperty("os.name");
        if (os != null && os.toLowerCase().indexOf("linux") > -1) {
            return true;
        } else {
            return false;
        }
    }
	
}
