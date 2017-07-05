package com.zte.mao.common.controller;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zte.mao.common.config.ConfigManage;
import com.zte.mao.common.controller.response.TenantRegisterResponse;
import com.zte.mao.common.entity.CommonConst;
import com.zte.mao.common.entity.UserSimpleEntity;
import com.zte.mao.common.http.HttpRequestUtils;
import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.common.service.LogInterceptorService;
import com.zte.mao.common.service.LoginService;
import com.zte.mao.common.service.TokenService;
import com.zte.mao.common.service.register.TenantRegisterService;
import com.zte.mao.common.session.SessionManager;
import com.zte.mao.common.util.CipherUtil;
import com.zte.mao.common.util.MaoCommonUtil;


@Controller
@RequestMapping("/mao/uap")
public class TenantUapController {
	private static Logger logger = Logger.getLogger(TenantUapController.class.getName());
    @Resource
    private TenantRegisterService tenantRegisterService;  
    
    @Resource
    private TenantRegisterResponse tenantRegisterResponse;
    
    @Resource
	private HttpRequestUtils requestUtils;
    
    @Resource
	private LogInterceptorService logInterceptorService;
    
    @Resource
	private SessionManager sessionManager;
    
    @Resource
	protected LoginService loginManager;
    
    @Resource
	protected TokenService tokenManager;
    
    /**
     * 检查租户名是否可用
     * @param username
     * @return
     */
    @RequestMapping(value = "/register/check/{username}", method = RequestMethod.GET)
    @ResponseBody
    public CommonResponse registerCheck(@PathVariable(value = "username") String username) {
        CommonResponse response = new CommonResponse();
        try {
	        boolean isNotExist = tenantRegisterService.isNotExistsTenantName(username);
	        if(isNotExist){
	            response.setMessage("用户名可用");
	            response.setStatus(CommonResponse.STATUS_SUCCESS);
	        }else{
	            response.setMessage("用户名已被注册");
	            response.setStatus(CommonResponse.STATUS_FAIL);
	        }
        }
        catch(Exception e) {
        	logger.error(e.getMessage(), e);
        	response.setMessage("用户名已被注册");
            response.setStatus(CommonResponse.STATUS_FAIL);
        }
        return response;
    }
    
    /**
     * 租户注册
     * @param content
     * @return
     */
    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/register", method = RequestMethod.POST)
    @ResponseBody
    public CommonResponse tenantRegister(@RequestBody Map data) { 
        return tenantRegisterResponse.controllerPostResponse(data);
    }
    
	@RequestMapping(value = "login",method = RequestMethod.POST)
	@ResponseBody
    public CommonResponse login(@RequestBody Map data,HttpServletRequest request, HttpServletResponse response) {
    	String userName = (String)data.get("name");
		String password = CipherUtil.encrypt(userName + CipherUtil.decryptFromBrowser(data.get("password").toString()));
		CommonResponse commonResponse = new CommonResponse();
		try {
			UserSimpleEntity user = loginManager.login(userName, password);
			String token = tokenManager.add(user);
			setTokenCookies(response, token);
			String platformType = ConfigManage.getInstance().getPlatformType();
			commonResponse = new CommonResponse(CommonResponse.STATUS_SUCCESS,token);
			if(CommonConst.PLATFORM_TYPE_DESIGN.equals(platformType)){
				//转化serverMap的内容to json
				ObjectMapper mapper = new ObjectMapper();
				String servereJsonParam = mapper.writeValueAsString(data);
				String result = requestUtils.doPost("http://" + MaoCommonUtil.getLocalIP() + ":" + CommonConst.MOCK_ADDRESS_PORT + "/server/mao/uap/login", servereJsonParam);
				JsonNode serverResult = new ObjectMapper().readTree(result);
				if(CommonResponse.STATUS_SUCCESS == (byte)serverResult.get(CommonResponse.STATUS_STR).asInt()){
					String mokcToken = serverResult.get(CommonResponse.MESSAGE_STR).asText();
					//转化将mock的cookie存入response
					Cookie cookie = new Cookie(CommonConst.COOKIES_MOCK_USER_NAME,mokcToken);
					setCookie(response, cookie);
				}else{
					throw new Exception();
				}
			}
			setPlatformType(response, platformType);
			logInterceptorService.addLoginLog(CommonConst.LOGIN_LOG, request,String.valueOf(user.getTenantId()),user.getLoginName());
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			commonResponse = new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
		}
		return commonResponse;

    }

	private void setPlatformType(HttpServletResponse response,
			String platformType) {
		Cookie cookie = new Cookie(CommonConst.COOKIES_PLATFORM_TYPE, platformType);
		setCookie(response, cookie);
	}

	private void setTokenCookies(HttpServletResponse response, String token) {
		Cookie cookie = new Cookie(CommonConst.COOKIES_USER_NAME, token);
		setCookie(response, cookie);
	}
	
	private void setCookie(HttpServletResponse response, Cookie cookie) {
		cookie.setMaxAge(3600*24);
		cookie.setPath("/");
		response.addCookie(cookie);
	}
    
}
