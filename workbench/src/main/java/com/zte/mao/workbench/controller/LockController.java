package com.zte.mao.workbench.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.common.session.SessionManager;
import com.zte.mao.workbench.service.FormLockService;

@RestController
@RequestMapping("/lock")
public class LockController {
	private static Logger logger = Logger.getLogger(LockController.class.getName());
	
	@Resource
	private FormLockService formLockService;
	
	@Resource
	private SessionManager sessionManager;
	
	@RequestMapping(value = "require", method = RequestMethod.GET)
	public CommonResponse requireLock(@RequestParam(value = "formUrl", required = true) String formUrl, HttpServletRequest request) {
		try {
			String tenantId = sessionManager.getTenantId(request);
			String loginName = sessionManager.getLoginName(request);
			String token = sessionManager.getToken(request);
			
			if (formLockService.requireFormLock(formUrl, loginName, token, tenantId)) {
				return new CommonResponse(CommonResponse.STATUS_SUCCESS, "");
			} else {
				return new CommonResponse(CommonResponse.STATUS_FAIL, "该文件当前正在被其他人使用，您无法对其进行编辑");
			}
        } catch (Exception e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, "获取文件编辑锁定失败，请稍后重试");
        }
	}
	
	@RequestMapping(value = "release", method = RequestMethod.GET)
	public CommonResponse releaseLock(@RequestParam(value = "formUrl", required = true) String formUrl, HttpServletRequest request) {
		try {
			String tenantId = sessionManager.getTenantId(request);
			String loginName = sessionManager.getLoginName(request);
			String token = sessionManager.getToken(request);
			
			if (formLockService.releaseFormLock(formUrl, loginName, token, tenantId)) {
				return new CommonResponse(CommonResponse.STATUS_SUCCESS, "");
			} else {
				return new CommonResponse(CommonResponse.STATUS_FAIL, "该文件当前正在被其他人使用，您无法对其进行编辑");
			}
        } catch (Exception e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, "释放文件编辑锁定失败，请稍后重试");
        }
	}
	
	@RequestMapping(value = "keep", method = RequestMethod.GET)
	public CommonResponse keepLock(@RequestParam(value = "formUrl", required = true) String formUrl, HttpServletRequest request) {
		try {
			String tenantId = sessionManager.getTenantId(request);
			String loginName = sessionManager.getLoginName(request);
			String token = sessionManager.getToken(request);
			
			if (formLockService.updateTimestamp(formUrl, loginName, token, tenantId)) {
				return new CommonResponse(CommonResponse.STATUS_SUCCESS, "");
			} else {
				return new CommonResponse(CommonResponse.STATUS_FAIL, "该文件当前正在被其他人使用，您无法对其进行编辑");
			}
        } catch (Exception e) {
            logger.error(e.getMessage());
            return new CommonResponse(CommonResponse.STATUS_FAIL, "获取文件编辑锁定失败，请稍后重试");
        }
	}
}
