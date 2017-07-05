package com.zte.mao.common.controller;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zte.mao.common.entity.MenuEntity;
import com.zte.mao.common.entity.UserEntity;
import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.common.response.DataResponse;
import com.zte.mao.common.service.GlobalUserServiceImpl;
import com.zte.mao.common.service.MenuService;
import com.zte.mao.common.service.TenantUserServiceImpl;
import com.zte.mao.common.session.SessionManager;
import com.zte.mao.common.util.CipherUtil;

@RequestMapping("/mao/")
@Controller
public class TenantUserController {
	private static Logger logger = Logger.getLogger(TenantUserController.class.getName());
	
	@Resource
	private MenuService menuService;
    
	@Resource
	private GlobalUserServiceImpl gUserService;

	@Resource
	private TenantUserServiceImpl tUserService;
    
    @Resource
    private SessionManager sessionManager;
    

    private String getTenantName(HttpServletRequest request) throws Exception {
        String login_name = sessionManager.getLoginName(request);
        String tenantName = "";
        if (login_name != null && login_name.indexOf("@") > 0) {
            tenantName = login_name.substring(login_name.indexOf("@") + 1);
        }
        return tenantName;
    }
    
    @RequestMapping(value = "tenant/menu", method = RequestMethod.GET)
    @ResponseBody
    public CommonResponse getTenantMenu(HttpServletRequest request) {
    	CommonResponse response = null;
        try {
        	
        	String tenantId = sessionManager.getTenantId(request);
        	String loginName = sessionManager.getLoginName(request);
        	List<MenuEntity> result = menuService.getMenu(tenantId, loginName);
        	response = new DataResponse(result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			response = new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
		}
        return response;
    }

    /**
     * 查询租户用户信息
     * 
     * @param login_name
     * @return
     */
    @RequestMapping(value = "tenant/users", method = RequestMethod.GET)
    @ResponseBody
    public CommonResponse getUsers(@RequestParam String login_name,
            HttpServletRequest request) {
    	
    	String message = CommonResponse.MESSAGE_STR;
		byte status = CommonResponse.STATUS_SUCCESS;
		List<UserEntity> result = new ArrayList<UserEntity> ();
		try {
			result = tUserService.getUsers(sessionManager.getTenantId(request), login_name);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			message = e.getMessage();
			status = CommonResponse.STATUS_FAIL;
		}

		return new DataResponse(status, message, result);
    }
    
    @RequestMapping(value = "tenant/filter/users", method = RequestMethod.GET)
    @ResponseBody
    public CommonResponse getTenantUsers(@RequestParam String login_name,
            HttpServletRequest request) {
        
        String message = CommonResponse.MESSAGE_STR;
        byte status = CommonResponse.STATUS_SUCCESS;
        List<UserEntity> result = new ArrayList<UserEntity> ();
        try {
            result = tUserService.getFilterUsers(sessionManager.getTenantId(request), login_name);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            message = e.getMessage();
            status = CommonResponse.STATUS_FAIL;
        }
        
        return new DataResponse(status, message, result);
    }

    /**
     * 添加租户用户信息
     * 
     * @param login_name
     * @return
     */
    @RequestMapping(value = "tenant/users/add", method = RequestMethod.POST)
    @ResponseBody
    public CommonResponse addUser(@RequestBody UserEntity user,
            HttpServletRequest request) {
        
        
        String message = CommonResponse.MESSAGE_STR;
		byte status = CommonResponse.STATUS_SUCCESS;
		if(user == null) {
			return new CommonResponse(CommonResponse.STATUS_FAIL, "用户信息为空。");
		}
		try {
			user.setLogin_name(user.getLogin_name() + "@" + this.getTenantName(request));
	        user.setTenant_id(sessionManager.getTenantId(request));
			
			user.setPassword(CipherUtil.encrypt(user.getLogin_name() + CipherUtil.decryptFromBrowser(user.getPassword())));
			gUserService.add(user);
			tUserService.add(user);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			message = e.getMessage();
			status = CommonResponse.STATUS_FAIL;
		}
		return new DataResponse(status, message, user.getLogin_name());
    }

    @RequestMapping(value = "tenant/users/check/{login_name}", method = RequestMethod.POST)
    @ResponseBody
    public CommonResponse isUserExist(
            @PathVariable("login_name") String login_name,
            HttpServletRequest request) {
		try {
			boolean result = tUserService.isUserExist(sessionManager.getTenantId(request), login_name);
			return new DataResponse(CommonResponse.STATUS_SUCCESS, CommonResponse.MESSAGE_STR, result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
		}
		
    }

    /**
     * 更新租户用户信息
     * 
     * @param login_name
     * @return
     */
    @RequestMapping(value = "tenant/users/update", method = RequestMethod.PUT)
    @ResponseBody
    public CommonResponse updateUser(@RequestBody UserEntity user,
            HttpServletRequest request) {
        String message = CommonResponse.MESSAGE_STR;
		byte status = CommonResponse.STATUS_SUCCESS;
		try {
			user.setLogin_name(user.getLogin_name() + "@" + this.getTenantName(request));
			user.setTenant_id(sessionManager.getTenantId(request));
			if (user.isIspasswordchanged()) {
				user.setPassword(CipherUtil.encrypt(user.getLogin_name()
						+ CipherUtil.decryptFromBrowser(user.getPassword())));
			} else {
				user.setPassword(CipherUtil.encrypt(user.getLogin_name()
						+ CipherUtil.decrypt(user.getPassword())));
			}

			gUserService.update(user);
			tUserService.update(user);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			message = e.getMessage();
			status = CommonResponse.STATUS_FAIL;
		}
		return new CommonResponse(status, message);
    }

    /**
     * 删除租户用户信息
     * 
     * @param login_name
     * @return
     */
    @RequestMapping(value = "tenant/users/delete/{login_name}", method = RequestMethod.DELETE)
    @ResponseBody
    public CommonResponse deleteUser(
            @PathVariable("login_name") String login_name,
            HttpServletRequest request) {
    	String message = CommonResponse.MESSAGE_STR;
		byte status = CommonResponse.STATUS_SUCCESS;
		try {
			String tenantId = sessionManager.getTenantId(request);
			gUserService.delete(tenantId, login_name);
			tUserService.delete(tenantId, login_name);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			message = e.getMessage();
			status = CommonResponse.STATUS_FAIL;
		}
		return new CommonResponse(status, message);
    }

}
