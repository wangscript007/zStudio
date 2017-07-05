package com.zte.mao.common.controller;

import java.net.URLDecoder;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.zte.mao.bpm.service.DeleteProcessPackageService;
import com.zte.mao.bpm.service.ProcessZipOperationService;
import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.common.session.SessionManager;

@RequestMapping("")
@Controller
public class ProcessPackageController {

	private static Logger logger = Logger.getLogger(ProcessPackageController.class.getName());
	@Resource
	private SessionManager sessionManager;
	@Resource
	private DeleteProcessPackageService deleteProcessPackageService;
	@Resource
	private ProcessZipOperationService processZipOperationService;
	
	/**
	 * 模拟平台跳转导入文件
	 * 
	 * @param request
	 * @param processPackagePath
	 *            zip包路径
	 * @return
	 */
	@RequestMapping(value = "/import/design/application/package", method = RequestMethod.POST)
	@ResponseBody
	public CommonResponse importDesignApplicationPackage(HttpServletRequest request,
			@RequestParam(value="packageName", required = true) String packageName, 
			@RequestParam(value="tenantId", required = true) String tenantId, 
			@RequestParam(value="loginName", required = true) String loginName) {

		try {
			packageName = URLDecoder.decode(packageName, "UTF-8");
			processZipOperationService.importDesignApplication(request, packageName, tenantId, loginName);
			return new CommonResponse(CommonResponse.STATUS_SUCCESS, "");
		} catch (Exception e) {
			return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
		}
	}

	@RequestMapping(value = "/upload/design/application/zip", method = RequestMethod.POST)
	@ResponseBody
    public CommonResponse uploadAppZip(HttpServletRequest request,
            @RequestParam(value = "tenantId", required = true) String tenantId,
            @RequestParam(value = "packageName", required = true) String packageName,
            @RequestParam(value = "file", required = true) MultipartFile file) {
        try {
			processZipOperationService.saveZipFileToLocal(file, request, tenantId, packageName);
			return new CommonResponse(CommonResponse.STATUS_SUCCESS, "");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return new CommonResponse(CommonResponse.STATUS_FAIL, "导入文件失败，失败信息：" + e.getMessage());
		}
    }
	
	/**
	 * 上传应用ZIP包
	 * @param request
	 * @param files
	 * @return
	 */
    @RequestMapping(value = "/import/application/zip/file", method = RequestMethod.POST)
    @ResponseBody
    public CommonResponse importApplicationZipFile(HttpServletRequest request,
            @RequestParam(value = "files", required = true) MultipartFile[] files) {
        try {
            // 上传应用ZIP文件上传到“...\server\server\process_package_zip\tenantId”路径下
            String appFileName = processZipOperationService.importZipFile(request, files[0]);

            return new CommonResponse(CommonResponse.STATUS_SUCCESS, appFileName);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getLocalizedMessage());
        }
    }
	
	/**
	 * 运行平台/测试平台导入应用
	 * @param request
	 * @param files
	 * @return
	 */
	@RequestMapping(value = "/import/application/package", method = RequestMethod.POST)
	@ResponseBody
    public CommonResponse importApplicationPackage(HttpServletRequest request,
            @RequestParam(value = "zipFileName", required = true) String zipFileName,
            @RequestParam(value = "appFileName", required = true) String appFileName) {
        try {
            // 解压ZIP应用文件
            processZipOperationService.decompressFile(request, zipFileName, appFileName);

            // 导入表单数据、菜单数据
            processZipOperationService.importFormInfo(appFileName, request);

            return new CommonResponse(CommonResponse.STATUS_SUCCESS, "");
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getLocalizedMessage());
        }
    }

	/**
	 * 删除应用
	 * @param request
	 * @param packageName
	 * @return
	 */
	@RequestMapping(value = "/delete/application", method = RequestMethod.GET)
	@ResponseBody
    public CommonResponse deleteProcessPackage(HttpServletRequest request,
            @RequestParam("appId") String appId,
            @RequestParam("appFileName") String appFileName) {
        try {
            deleteProcessPackageService.deleteApplication(request, appId, appFileName);
            return new CommonResponse(CommonResponse.STATUS_SUCCESS, "");
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getLocalizedMessage());
        }
    }
	
	/**
	 * 删除应用
	 * @param request
	 * @param packageName
	 * @return
	 */
	@RequestMapping(value = "/delete/application/zip/file", method = RequestMethod.POST)
	@ResponseBody
	public CommonResponse deleteProcessZipFile(HttpServletRequest request,
	        @RequestParam("zipFileName") String zipFileName) {
	    try {
	        processZipOperationService.deleteApplicationZipFile(request, zipFileName);
	        return new CommonResponse(CommonResponse.STATUS_SUCCESS, "");
	    } catch (Exception e) {
	        logger.error(e.getMessage(), e);
	        return new CommonResponse(CommonResponse.STATUS_FAIL, "应用ZIP删除失败：" + e.getLocalizedMessage());
	    }
	}

}
