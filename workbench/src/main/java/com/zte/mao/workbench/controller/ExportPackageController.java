package com.zte.mao.workbench.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.common.session.SessionManager;
import com.zte.mao.workbench.service.ExportPackageService;
import com.zte.mao.workbench.service.ImportPackageService;

@RestController
@RequestMapping("/")
public class ExportPackageController {

	private static Logger logger = Logger.getLogger(ExportPackageService.class.getName());

	@Resource
	ExportPackageService exportPackageService;

	@Resource
	ImportPackageService importPackageService;

	@Resource
	private SessionManager sessionManager;

	@RequestMapping(value = "export/package/{packageId}", method = RequestMethod.GET)
	public CommonResponse exportPackage(@PathVariable(value = "packageId") String packageId,
			HttpServletRequest request) {
		try {
            exportPackageService.exportPackage(packageId, request);
            return new CommonResponse(CommonResponse.STATUS_SUCCESS, "");
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getLocalizedMessage());
        }
	}

	@RequestMapping(value = "import/package", method = RequestMethod.POST)
	public CommonResponse importProcessZipFile(HttpServletRequest request, @RequestParam("file") MultipartFile file)
			throws Exception {
		String id = sessionManager.getTenantId(request);
		String name = sessionManager.getLoginName(request);
		String userName = name.split("@")[0];
		CommonResponse commonResponse = null;
		try {
			commonResponse = importPackageService.importFile(request, file, userName, id);
		} catch (Exception e) {
			throw e;
		}

		return commonResponse;
	}

	@RequestMapping(value = "delete/package/{packageId}", method = RequestMethod.GET)
	public CommonResponse deletePackage(@PathVariable(value = "packageId") String packageId,
			HttpServletRequest request) {
		return exportPackageService.deletePackage(packageId, request);
	}

	/**
	 * 把应用zip包发送到运行平台
	 * 
	 * @param packageId
	 * @param request
	 * @return
	 */
    @RequestMapping(value = "transfer/package", method = RequestMethod.GET)
    public CommonResponse transferPackage(
            @RequestParam(value = "packageName", required = true) String packageName,
            @RequestParam(value = "packageId", required = true) String packageId,
            HttpServletRequest request) {
        
        try {
    	    // 先导出ZIP包
    	    exportPackageService.exportPackage(packageId, request);
        	
    	    //上传到server
    		importPackageService.transferZipFile(request, packageName);
			
			//导入应用
    		importPackageService.importApplicationToServer(request, packageName);
			
			return new CommonResponse(CommonResponse.STATUS_SUCCESS, "");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
		}
    }
}
