package com.ksy.designer.controller;

import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.context.ApplicationContext;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ksy.designer.SpringUtils;
import com.ksy.designer.common.ConfigFileManage;
import com.ksy.designer.common.DesignerException;
import com.ksy.designer.common.response.DesignerDataResponse;
import com.ksy.designer.common.response.DesignerResponse;
import com.ksy.designer.service.AbstractDesignerLoaderService;
import com.ksy.designer.service.DesignerEnvService;
import com.ksy.designer.service.FileService;
import com.ksy.designer.service.form.impl.FormDesignerLoaderService;
import com.ksy.designer.service.form.impl.FormFileService;
import com.ksy.designer.service.model.impl.ModelDesignerLoaderService;
import com.ksy.designer.service.model.impl.ModelFileService;

/**
 * 操作设计文件的对外接口
 * @author 10089289
 *
 */
@RequestMapping("/designer")
@RestController(value = "FrameControllerNew")
public class FrameController {
    private static Logger logger = Logger.getLogger(FrameController.class.getName());
    @Resource
    private DesignerEnvService designerEnvService;
    private FileService fileService;
    private AbstractDesignerLoaderService designerLoaderService;

    public FrameController() {
        ApplicationContext applicationContext = SpringUtils.getApplicationContext();
        String scene = ConfigFileManage.getInstance().getScene();
        if (ConfigFileManage.SCENE_FORM_DESIGNER.equals(scene)) {
            designerLoaderService = applicationContext.getBean(FormDesignerLoaderService.class);
            fileService = applicationContext.getBean(FormFileService.class);
        } else if (ConfigFileManage.SCENE_MODEL_DESIGNER.equals(scene)) {
            designerLoaderService = applicationContext.getBean(ModelDesignerLoaderService.class);
            fileService = applicationContext.getBean(ModelFileService.class);
        } else {
            throw new RuntimeException("未找到当前场景的DesignerLoaderService。当前场景:" + scene);
        }
    }

    /**
     * 新增设计文件
     * 
     * @param filename 框架文件全名
     * @return
     * @throws Exception
     */    
    @RequestMapping(value = "file/add", method = RequestMethod.POST)
    public DesignerResponse addFrameHtml(@RequestBody Map<String, String> params) throws Exception {
        String filename = params.get("filename");
        try {
            fileService.createFile(filename);
            return DesignerResponse.getSuccessResponse();
        } catch (DesignerException e) {
            logger.error(e.getMessage(), e);
            return DesignerResponse.getFailedResponse(e.getLocalizedMessage());
        }
    }

    /**
     * 验证文件是否存在
     * @param filename
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "file/validate", method = RequestMethod.POST)
    public DesignerResponse checkExists(@RequestBody Map<String, String> params) {
        String filename = params.get("filename");
        try {
            return DesignerDataResponse.getSuccessResponse(fileService.isFileExists(filename));
        } catch (DesignerException e) {
            logger.error(e.getMessage(), e);
            return DesignerResponse.getFailedResponse(e.getLocalizedMessage());
        }
    }

    /**
     * 框架文件重命名
     * 
     * @param oldfilefullname 原文件名
     * @param newfilefullname 新文件名
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "file/rename", method = RequestMethod.POST)
    public DesignerResponse updateFrameFile(@RequestBody Map<String, String> params) {
        String oldName = params.get("oldName");
        String newName = params.get("newName");
        try {
            fileService.renameFile(oldName, newName);
            return DesignerResponse.getSuccessResponse();
        } catch (DesignerException e) {
            logger.error(e.getMessage(), e);
            return DesignerResponse.getFailedResponse(e.getLocalizedMessage());
        }
    }

    /**
     * 删除框架文件
     * @param filename 文件名
     * @return
     */    
    @RequestMapping(value = "file/delete", method = RequestMethod.POST)
    public DesignerResponse deleteFrameHtml(@RequestBody Map<String, String> params) {
        String filename = params.get("filename");
        try {
            fileService.deleteFile(filename);
            return DesignerResponse.getSuccessResponse();
        } catch (DesignerException e) {
            logger.error(e.getMessage(), e);
            return DesignerResponse.getFailedResponse(e.getLocalizedMessage());
        }
    }

    /**
     * 保存设计文件内容
     * @param CommonFile 文件基本信息 
     * @return
     */    
    @RequestMapping(value = "file/save", method = RequestMethod.POST)
    public DesignerResponse saveFile(
            @RequestParam(value = "file-name", required = true) String fileName,
            @RequestBody String content) {
        try {
            fileService.writeFile(fileName, content);
            return DesignerResponse.getSuccessResponse();
        } catch (DesignerException e) {
            logger.error(e.getMessage(), e);
            return DesignerResponse.getFailedResponse(e.getLocalizedMessage());
        }
    }

    @RequestMapping(value = "file/get", method = RequestMethod.GET)
    public DesignerResponse getFile(
            @RequestParam(value = "file-name", required = true) String fileName) {
        try {
            return DesignerDataResponse.getSuccessResponse(fileService.readFile(fileName));
        } catch (DesignerException e) {
            logger.error(e.getMessage(), e);
            return DesignerResponse.getFailedResponse(e.getLocalizedMessage());
        }
    }

    @RequestMapping(value = "load", method = RequestMethod.GET)
    public DesignerResponse load(
            @RequestParam(value = "path", required = false) String path,
            @RequestParam(value = "file-name", required = false) String designFileName) {
        try {
            return DesignerDataResponse.getSuccessResponse(designerLoaderService.load(designFileName));
        } catch (DesignerException e) {
            logger.error(e.getMessage(), e);
            return DesignerResponse.getFailedResponse(e.getLocalizedMessage());
        }
    }
}
