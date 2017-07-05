package com.zte.mao.workbench.service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONArray;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.base.OrmQueryCondition;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.http.HttpRequestUtils;
import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.common.service.SqlExecuteService;
import com.zte.mao.common.session.SessionManager;
import com.zte.mao.common.util.FileUtil;
import com.zte.mao.common.util.IdGenerator;
import com.zte.mao.workbench.utils.ZipUtils;

@Service
public class ExportPackageService {
    private static Logger logger = Logger.getLogger(ExportPackageService.class.getName());

    private String defaultEncoding = "UTF-8";

    @Resource
    private ExportDataModelService exportDataModelService;

    @Resource
    private HttpRequestUtils httpRequestUtils;
    @Resource
    private OrmDao ormDao;

    @Resource
    private SessionManager sessionManager;

    @Resource
    private SqlExecuteService sqlExecuteService;

    private void copyFile(String srcpath, String destpath) throws MaoCommonException {
        try {
            FileUtils.copyFile(new File(srcpath), new File(destpath));
        } catch (IOException e) {
            throw new MaoCommonException(e);
        }
    }

    private void deleteBcpReForms(String packageId, String tenantId) throws MaoCommonException {
        OrmQueryCondition condition = OrmQueryCondition.generatorCondition();
        condition.setCname("packageid").setCompare("=").setValue(packageId);
        OrmQueryCondition condition2 = OrmQueryCondition.generatorCondition();
        condition2.setCname("id").setCompare("=").setValue(packageId);
        try {
            ormDao.delete("bcp_re_form", condition, tenantId);
            ormDao.delete("bcp_re_processpackage", condition2, tenantId);
        } catch (MaoCommonException e) {
            logger.error(e.getMessage(), e);
            throw e;
        }
    }

    private void deleteFormFiles(String packageId, HttpServletRequest request) throws Exception {
        String tenantId;
        try {
            tenantId = sessionManager.getTenantId(request);
            String path = FileUtil.getApplicationRealPath(request);
            StringBuilder formDir = new StringBuilder();
            StringBuilder dataModelDir = new StringBuilder();
            int index = path.indexOf("workbench" + File.separator);
            path = path.substring(0, index);
            formDir.append(path + "designer").append(File.separator).append("layoutit").append(File.separator)
                    .append(tenantId).append(File.separator);
            dataModelDir.append(path + "datavisual").append(File.separator).append("project").append(File.separator)
                    .append("default").append(File.separator).append(tenantId).append(File.separator);
            List<Map<String, String>> formList = getFormsByPackageId(packageId, tenantId);
            List<File> fileList = new ArrayList<File>();
            for (Map<String, String> formMap : formList) {
                if (formMap.get("type").equals("表单")) {
                    // 表单
                    fileList.add(new File(formDir.toString() + formMap.get("id") + ".html"));
                    fileList.add(new File(formDir.toString() + formMap.get("id") + ".js"));
                    fileList.add(new File(formDir.toString() + formMap.get("id") + ".json"));
                } else if (formMap.get("type").equals("图表")) {
                    // 报表
                    fileList.add(new File(dataModelDir.toString() + formMap.get("id") + ".html"));
                    fileList.add(new File(dataModelDir.toString() + formMap.get("id") + ".js"));
                }
            }
            // 删除文件
            for (File tempFile : fileList) {
                if (tempFile != null && tempFile.exists() && tempFile.isFile()) {
                    tempFile.delete();
                }
            }
        } catch (MaoCommonException e) {
            logger.error(e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            throw e;
        }

    }

    private void deleteModelsByIds(List<String> modelIds, String tenantId) throws MaoCommonException {
        OrmQueryCondition condition = OrmQueryCondition.generatorCondition();
        condition.setCname("processDefId").setCompare("in").setValues(modelIds);
        try {
            ormDao.delete("act_re_model", condition, tenantId);
            ormDao.delete("act_ge_bytearray", condition, tenantId);
        } catch (MaoCommonException e) {
            logger.error(e.getMessage(), e);
            throw e;
        }
    }

    public CommonResponse deletePackage(String packageId, HttpServletRequest request) {
        CommonResponse commonResponse = new CommonResponse();
        try {
            String tenantId = sessionManager.getTenantId(request);
            List<Map<String, String>> packageData = getPackageData(packageId, tenantId);
            deleteFormFiles(packageId, request);
            // 删除act_re_models act_ge_bytearray
            List<String> modelIds = null;
            if (packageData.size() > 0) {
                String modelIdStr = packageData.get(0).get("MODELIDS");
                if (modelIdStr != null) {
                    modelIds = getModelIdList(packageData.get(0).get("MODELIDS"));
                    if (modelIds != null && modelIds.size() > 0) {
                        deleteModelsByIds(modelIds, tenantId);
                    }
                }
            }
            deleteBcpReForms(packageId, tenantId);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            commonResponse = new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        }
        return commonResponse;
    }

    /**
     * 5. 导出数据模型
     * 
     * @param packageId
     * @param request
     * @return
     * @throws Exception
     */
    private void exportDataModels(String packageName, String packageId, String tenantId, String realPath)
            throws Exception {
        try {
            String filePath = "dataModel";
            String fileName = "dataModel";
            String suffix = ".sql";
            String fileContent = exportDataModelService.exportDataModel(packageId, tenantId);
            saveFileToLocal(packageName, filePath, fileName, suffix, tenantId, realPath, fileContent);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            throw new Exception("导出数据模型失败，##" + e.getMessage());
        }
    }

    /**
     * 4. 导出表单文件
     * 
     * @param packageId
     * @param request
     * @return
     * @throws MaoCommonException
     */
    private void exportForms(String packageName, String packageId, String tenantId, HttpServletRequest request)
            throws MaoCommonException {
        List<OrmQueryCondition> conditions = OrmQueryCondition.getConditions();
        conditions.add(OrmQueryCondition.generatorCondition().setCname("packageid").setValue(packageId));
        String path = FileUtil.getApplicationRealPath(request);
        String applicationRealPath = FileUtil.getApplicationRealPath(request);
        File file = new File(path);
        String parentPath = file.getParent();
        StringBuilder srcDir = new StringBuilder();
        path = parentPath + File.separator;
        String designerPath = path + "designer";
        srcDir.append(designerPath).append(File.separator).append("layoutit").append(File.separator).append(tenantId)
                .append(File.separator);
        String parentDir = new File(applicationRealPath).getParent();
        StringBuilder destDir = new StringBuilder();
        destDir.append(parentDir).append(File.separator).append("workbench").append(File.separator)
                .append("ArchiveFile").append(File.separator).append(tenantId).append(File.separator).append("package")
                .append(File.separator).append(packageName).append(File.separator);
        String destPath = destDir.toString();
        StringBuilder defaultcommonjsFormDir = new StringBuilder();
        defaultcommonjsFormDir.append(designerPath).append(File.separator).append("layoutit").append(File.separator)
                .append("default_common.js");
        File defaultcommonjsFile = new File(defaultcommonjsFormDir.toString());
        if (defaultcommonjsFile.exists()) {
            copyFile(defaultcommonjsFormDir.toString(), destPath + "forms" + File.separator + "default_common.js");
        }

        // 导出数据可视化defaul-commom.js
        StringBuilder defaultcommonjsDVDir = new StringBuilder();
        defaultcommonjsDVDir.append(parentDir).append(File.separator).append("datavisual").append(File.separator)
                .append("project");
        //
        if (new File(defaultcommonjsDVDir.toString()).exists()) {
            String datavisualDefaultcommonjsPath = defaultcommonjsDVDir.append(File.separator).append("default")
                    .append(File.separator).append("default_common.js").toString();
            File datavisualDefaultcommonjsFile = new File(datavisualDefaultcommonjsPath);
            if (datavisualDefaultcommonjsFile.exists()) {
                copyFile(datavisualDefaultcommonjsPath, destPath + "datavisual" + File.separator + "default_common.js");
            }
        }
        try {
            String[] columns = new String[] { "id", "name", "type", "formurl", "description", "status", "creator",
                    "createTime", "packageid" };
            List<Map<String, String>> formidsList = ormDao.getData("bcp_re_form", columns, conditions,
                    OrmDao.OPERATOR_AND, tenantId);
            JSONArray jsonArray = JSONArray.fromObject(formidsList);
            String listStr = jsonArray.toString();
            File packageJsonFile = FileUtil.createFileOrMultistageDirectoryOfFile(srcDir.toString() + "formlist.json");
            FileOutputStream outputStream = new FileOutputStream(packageJsonFile, false);
            outputStream.write(listStr.getBytes("UTF-8"));
            outputStream.close();
            copyFile(srcDir.toString() + "formlist.json", destPath + "forms" + File.separator + "formlist.json");
            // copyFile(request,packageName,"formlist.json",tenantId);
            for (Map<String, String> map : formidsList) {
                if (map.get("type").equals("表单") || map.get("type").equals("列表")) {
                    handleForms(packageName, tenantId, path, srcDir, destPath, map);
                } else if (map.get("type").equals("图表")) {
                    handleReports(packageName, tenantId, path, parentDir, destPath, map);
                }
            }
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
            throw new MaoCommonException(e);
        } catch (MaoCommonException e) {
            logger.error(e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 2. 导出菜单信息
     * 
     * @param packageId
     * @param request
     * @return
     * @throws Exception
     */
    private void exportMenuInfo(String packageId, String packageName, String modelIds, String tenantId, String realPath)
            throws Exception {
        List<Map<String, String>> modelMapList = getModelInfosByIds(modelIds, tenantId);
        int index = 100;
        String packageKey = IdGenerator.getRandomString(10);
        ObjectMapper mapper = new ObjectMapper();
        ArrayNode appArrNode = mapper.createArrayNode();
        ArrayNode rptArrNode = mapper.createArrayNode();
        // 添加“包名”结点 --改成类型名节点
        ObjectNode rootnode = mapper.createObjectNode();
        rootnode.put("key", packageKey);
        rootnode.put("name", packageName);
        rootnode.put("parent_key", "BCP_BPM");
        rootnode.put("pro_model_name", "");
        rootnode.put("pro_type_id", "");
        rootnode.put("icon", "fa fa-comments");
        rootnode.put("url", "#");
        rootnode.put("status", "");
        rootnode.put("order", index);
        appArrNode.add(rootnode);
        try {
            // 导出菜单信息
            for (Map<String, String> modelMap : modelMapList) {
                index += 1;
                // 每个模型一个菜单
                String modeKey = IdGenerator.getRandomString(10);
                ObjectNode node = mapper.createObjectNode();
                node.put("key", modeKey);
                node.put("name", modelMap.get("NAME_"));
                node.put("parent_key", packageKey);
                node.put("pro_model_name", modelMap.get("NAME_"));
                node.put("pro_type_id", "");
                node.put("icon", "fa fa-comments");
                node.put("url", "model");
                node.put("status", "");
                node.put("order", index);
                appArrNode.add(node);
            }
            if (modelMapList.size() < 1) { // 没有流程模型的情况下，直接把表单挂为二级菜单
                                           // --V2:区分报表；二级菜单挂包名
                List<Map<String, String>> formData = this.getFormsByPackageId(packageId, tenantId);
                for (Map<String, String> formMap : formData) {
                    index += 1;
                    String formKey = IdGenerator.getRandomString(10);
                    String formUrl = formMap.get("formurl").split("\\$")[1];
                    formUrl = formUrl.substring(0, formUrl.indexOf(".html"));
                    if (formMap.get("type").toString().equals("列表")) {
                        ObjectNode node = mapper.createObjectNode();
                        node.put("key", formKey);
                        node.put("name", formMap.get("name"));
                        node.put("parent_key", packageKey);
                        node.put("pro_model_name", formMap.get("name"));
                        node.put("pro_type_id", "");
                        node.put("icon", "fa fa-comments");
                        node.put("url", "form##" + formUrl);
                        node.put("status", "");
                        node.put("order", index);
                        appArrNode.add(node);
                    } else if (formMap.get("type").toString().equals("图表")) {
                        ObjectNode node = mapper.createObjectNode();
                        node.put("key", formKey);
                        node.put("name", formMap.get("name"));
                        node.put("parent_key", packageKey);
                        node.put("pro_model_name", formMap.get("name"));
                        node.put("pro_type_id", "");
                        node.put("icon", "fa fa-comments");
                        node.put("url", "datavisual##" + formUrl);
                        node.put("status", "");
                        node.put("order", index);
                        rptArrNode.add(node);
                    }
                }
            }
            saveFileToLocal(packageName, "misc", "menu_info", ".json", tenantId, realPath,
                    mapper.writeValueAsString(appArrNode));
            saveFileToLocal(packageName, "misc", "rpt_menu_info", ".json", tenantId, realPath,
                    mapper.writeValueAsString(rptArrNode));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            throw new Exception("导出菜单失败，##" + e.getMessage());
        }
    }

    public void exportPackage(String packageId, HttpServletRequest request) throws Exception {
        String tenantId = sessionManager.getTenantId(request);
        List<Map<String, String>> packageData = getPackageData(packageId, tenantId);

        if (packageData.size() > 0) {
            Map<String, String> map = packageData.get(0); // 指定packageId，只取一个package信息
            String packageName = map.get("PACKAGENAME");
            String modelIds = map.get("MODELIDS");

            String realPath = FileUtil.getApplicationRealPath(request);
            // 先删除应用包对应的文件夹
            deleteFile(tenantId, packageName, realPath);

            // 1. 导出应用包基本信息
            try {
                exportPackageInfo(packageId, packageName, packageData, tenantId, realPath);
                // 2. 导出菜单信息--修改：根据是否有流程，判断导出的二级菜单是流程/ 表单、数据可视化
                // 修改V2-报表单独挂到“统计分析”菜单 ；应用类型做为一级菜单--包名-list.html
                exportMenuInfo(packageId, packageName, modelIds, tenantId, realPath);

                // 4. 导出表单文件
                exportForms(packageName, packageId, tenantId, request);

                // 5. 导出数据模型
                exportDataModels(packageName, packageId, tenantId, realPath);

                // 生成zip文件
                generateZipFile(packageId, packageName, tenantId, realPath);
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
                throw e;
            }
        }
    }

    private void deleteFile(String tenantId, String packageName, String realPath) {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(realPath)
            .append("ArchiveFile").append(File.separator)
            .append(tenantId).append(File.separator)
            .append("package").append(File.separator)
            .append(packageName).append(File.separator);
        FileUtil.delFolder(stringBuilder.toString());
    }

    /**
     * 1. 导出流程包基本信息
     * 
     * @param packageId
     * @param request
     * @throws Exception
     */
    private void exportPackageInfo(String packageId, String packageName, List<Map<String, String>> packageData,
            String tenantId, String realPath) throws Exception {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode node = mapper.createObjectNode();
            for (Map<String, String> packageInfo : packageData) {
                node.put("PACKAGENAME", packageInfo.get("PACKAGENAME"));
                node.put("VERSION", packageInfo.get("VERSION"));
                node.put("DESC", packageInfo.get("DESC"));
                node.put("CREATOR", packageInfo.get("CREATOR"));
                node.put("CREATETIME", packageInfo.get("CREATETIME"));
            }
            saveFileToLocal(packageName, "misc", "package_info", ".json", tenantId, realPath,
                    mapper.writeValueAsString(node));
        } catch (JsonProcessingException e) {
            logger.error(e.getMessage(), e);
            throw new MaoCommonException("导出流程包基本信息失败，##" + e.getMessage());
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
            throw new IOException("导出流程包基本信息失败，##" + e.getMessage());
        }
    }

    /**
     * 7. 压缩生成.zip包
     * 
     * @param packageId
     * @param request
     * @return
     * @throws IOException
     */
    private boolean generateZipFile(String packageId, String packageName, String tenantId, String realPath)
            throws IOException {
        StringBuilder stringBuilder = new StringBuilder();
        String sourceFilePath = stringBuilder.append(realPath).append("ArchiveFile").append(File.separator)
                .append(tenantId).append(File.separator).append("package").append(File.separator).append(packageName)
                .toString();
        stringBuilder = new StringBuilder();
        String zipFilePath = stringBuilder.append(realPath).append("ZipFile").append(File.separator).append(tenantId)
                .append(File.separator).append(packageName).append(".zip").toString();
        ZipUtils.createZip(sourceFilePath, zipFilePath);
        return true;
    }

    private List<Map<String, String>> getFormsByPackageId(String packageId, String tenantId) throws MaoCommonException {
        List<OrmQueryCondition> conditions = OrmQueryCondition.getConditions();
        conditions
                .add(OrmQueryCondition.generatorCondition().setCname("packageid").setCompare("=").setValue(packageId));
        List<Map<String, String>> formData;
        try {
            formData = ormDao.getData("bcp_re_form", "id,name,type,formurl".split(","), conditions, OrmDao.OPERATOR_AND,
                    tenantId);
            return formData;
        } catch (MaoCommonException e) {
            logger.error(e.getMessage(), e);
            throw e;
        }
    }

    private List<String> getModelIdList(String modelIds) {
        List<String> modelIdList = new ArrayList<String>();
        String[] modelIdArray = modelIds.split(",");
        for (String modelId : modelIdArray) {
            modelIdList.add(modelId);
        }
        return modelIdList;
    }

    private List<Map<String, String>> getModelInfosByIds(String modelIds, String tenantId) throws MaoCommonException {
        List<Map<String, String>> modelData = new ArrayList<Map<String, String>>();
        if (modelIds != null) {
            List<OrmQueryCondition> conditions = OrmQueryCondition.getConditions();
            List<String> modelIdList = getModelIdList(modelIds);
            conditions.add(
                    OrmQueryCondition.generatorCondition().setCname("ID_").setCompare("in").setValues(modelIdList));
            try {
                modelData = ormDao.getData("act_re_model", "ID_,NAME_".split(","), conditions, OrmDao.OPERATOR_AND,
                        tenantId);
                return modelData;
            } catch (MaoCommonException e) {
                logger.error(e.getMessage(), e);
                throw e;
            }
        } else {
            return modelData;
        }
    }

    private List<Map<String, String>> getPackageData(String packageId, String tenantId) throws MaoCommonException {
        List<OrmQueryCondition> conditions = OrmQueryCondition.getConditions();
        conditions.add(OrmQueryCondition.generatorCondition().setCname("ID").setValue(packageId));
        return ormDao.getData("BCP_RE_PROCESSPACKAGE",
                "ID,TYPEID,PACKAGENAME,VERSION,DESC,MODELIDS,CREATOR,CREATETIME".split(","), conditions,
                OrmDao.OPERATOR_AND, tenantId);
    }

    private void handleForms(String packageName, String tenantId, String path, StringBuilder srcDir, String destPath,
            Map<String, String> map) throws MaoCommonException {
        String formUrl = map.get("formurl").split("\\$")[1];
        String name = formUrl.split("\\.")[0];
        copyFile(srcDir.toString() + name + ".html", destPath + "forms" + File.separator + name + ".html");
        copyFile(srcDir.toString() + name + ".js", destPath + "forms" + File.separator + name + ".js");
        String filePath = srcDir.toString() + name + ".json";
        try {
            File designerFile = new File(
                    path + "designer-frame-files" + File.separator + name + ".html&pname=default&version=1.0");
            if (designerFile.exists()) {
                FileUtils.copyFile(designerFile,
                        new File(path + "workbench" + File.separator + "ArchiveFile" + File.separator + tenantId
                                + File.separator + "package" + File.separator + packageName + File.separator
                                + "designer-frame-files" + File.separator + name + ".html&pname=default&version=1.0"));
            }
        } catch (IOException e) {
            throw new MaoCommonException(e);
        }
        File file = new File(filePath);
        // 判断是否存在json文件，存在读取文件
        if (file.exists()) {
            copyFile(srcDir.toString() + name + ".json", destPath + "forms" + File.separator + name + ".json");
            Scanner scanner = null;
            StringBuilder buffer = new StringBuilder();
            try {
                scanner = new Scanner(file, "utf-8");
            } catch (FileNotFoundException e) {
                logger.error(e.getMessage(), e);
            }
            while (scanner.hasNextLine()) {
                buffer.append(scanner.nextLine());
            }
            ObjectMapper objMapper = new ObjectMapper();
            JsonNode obj = null;
            try {
                obj = objMapper.readTree(buffer.toString());
            } catch (JsonProcessingException e) {
                logger.error(e.getMessage(), e);
            } catch (IOException e) {
                logger.error(e.getMessage(), e);
            }
            if (obj.get("importJs") != null && obj.get("importJs").asText().length() != 0) {
                String[] jsArray = obj.get("importJs").asText().split(",");
                for (String js : jsArray) {
                    copyFile(srcDir.toString() + js, destPath + "forms" + File.separator + js);
                    // copyFile(request, packageName, js,tenantId);
                }
            }
            if (obj.get("importCss") != null && obj.get("importCss").asText().length() != 0) {
                String[] cssArray = obj.get("importCss").asText().split(",");
                for (String cs : cssArray) {
                    copyFile(srcDir.toString() + cs, destPath + "forms" + File.separator + cs);
                }
            }
        }
    }

    private void handleReports(String packageName, String tenantId, String path, String parentDir, String destPath,
            Map<String, String> map) throws MaoCommonException {
        String formUrl = map.get("formurl").split("\\$")[1];
        String name = formUrl.split("\\.")[0];
        StringBuilder projectDir = new StringBuilder();
        projectDir.append(parentDir).append(File.separator).append("datavisual").append(File.separator)
                .append("project");
        String projectDirPath = projectDir.toString();
        if (new File(projectDirPath).exists()) {
            StringBuilder datavisualDir = new StringBuilder();
            datavisualDir.append(parentDir).append(File.separator).append("datavisual").append(File.separator)
                    .append("project").append(File.separator).append("default").append(File.separator).append(tenantId)
                    .append(File.separator);
            if (new File(datavisualDir.toString() + name + ".html").exists()) {
                copyFile(datavisualDir.toString() + name + ".html",
                        destPath + "datavisual" + File.separator + name + ".html");
            }
            if (new File(datavisualDir.toString() + name + ".js").exists()) {
                copyFile(datavisualDir.toString() + name + ".js",
                        destPath + "datavisual" + File.separator + name + ".js");
            }
            try {
                File designerFile = new File(path + "datavisual" + File.separator + "src" + File.separator + name
                        + ".html&pname=default&version=1.0");
                if (designerFile.exists()) {
                    FileUtils.copyFile(designerFile,
                            new File(path + "workbench" + File.separator + "ArchiveFile" + File.separator + tenantId
                                    + File.separator + "package" + File.separator + packageName + File.separator + "src"
                                    + File.separator + name + ".html&pname=default&version=1.0"));
                }
            } catch (IOException e) {
                throw new MaoCommonException(e);
            }
        }
    }

    private void saveFileToLocal(String packagePath, String filePath, String fileName, String suffix, String tenantId,
            String realPath, String fileContent) throws IOException {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(realPath).append(File.separator).append("ArchiveFile").append(File.separator)
                .append(tenantId).append(File.separator).append("package").append(File.separator);
        if (packagePath != null && packagePath.length() > 0) {
            stringBuilder.append(packagePath).append(File.separator);
        }
        stringBuilder.append(filePath).append(File.separator).append(fileName).append(suffix);
        File file = new File(stringBuilder.toString());
        if (!file.getParentFile().exists()) {
            file.getParentFile().mkdirs();
        }
        if (!file.exists()) {
            file.createNewFile();
        }
        FileUtils.writeStringToFile(file, fileContent, defaultEncoding);
    }
}
