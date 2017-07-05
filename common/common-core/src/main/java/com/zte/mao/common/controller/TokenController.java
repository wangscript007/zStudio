package com.zte.mao.common.controller;

import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zte.mao.common.config.ConfigManage;
import com.zte.mao.common.controller.response.SigninStatusResponse;
import com.zte.mao.common.controller.response.TokenResponse;
import com.zte.mao.common.entity.CommonConst;
import com.zte.mao.common.entity.UserSimpleEntity;
import com.zte.mao.common.http.HttpRequestUtils;
import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.common.service.LoginService;
import com.zte.mao.common.service.TokenService;
import com.zte.mao.common.session.SessionManager;
import com.zte.mao.common.util.CipherUtil;
import com.zte.mao.common.util.MaoCommonUtil;

@RequestMapping("/mao/sso/")
@Controller
public class TokenController {
	private static Logger logger = Logger.getLogger(TokenController.class.getName());
	@Resource
	private SigninStatusResponse signinStatusResponse;
	
	@Resource
	private TokenService tokenService;
	
	@Resource
	protected LoginService loginManager;
	
	@Resource
	private HttpRequestUtils requestUtils;
	
	@Resource
	protected TokenService tokenManager;
	
	@Resource
	private SessionManager sessionManager;
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "user/login", method = RequestMethod.POST)
	@ResponseBody
	public CommonResponse userLogin(HttpServletRequest request, @RequestBody Map data) {
		String token = "";
		String message = "success";
		byte status = CommonResponse.STATUS_SUCCESS;
		try {
			String userName = data.get("username").toString();
			String password = CipherUtil.encrypt(userName
					+ CipherUtil.decryptFromBrowser(data.get("password").toString()));
			UserSimpleEntity entity = loginManager.login(userName, password);
			token = tokenManager.add(entity);
			sessionManager.cacheUser2Session(request, token);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			message = e.getMessage();
			status = CommonResponse.STATUS_FAIL;
		}
		return new TokenResponse(status, message, token);
	}
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "module/signin/check", method = RequestMethod.POST)
	@ResponseBody
	public CommonResponse signinCheck(HttpServletRequest request, @RequestBody Map data) {
		try {
			return (CommonResponse) signinStatusResponse.onResponse(data);
		} catch (Exception e) {
			//该异常不做处理
		}
		return new CommonResponse(CommonResponse.STATUS_FAIL, "fail");
	}
	
	@RequestMapping(value = "user/loginout", method = RequestMethod.POST)
	@ResponseBody
	public CommonResponse loginout(HttpServletRequest request, @RequestBody Map data) {
		CommonResponse response = new CommonResponse();
		try {
			String platformType = ConfigManage.getInstance().getPlatformType();
			if(CommonConst.PLATFORM_TYPE_DESIGN.equals(platformType)){
				ObjectMapper mapper = new ObjectMapper();
				String jsonParam = mapper.writeValueAsString(data);
				tokenService.loginoutAll((data.get(CommonConst.COOKIES_USER_NAME)).toString());
				requestUtils.doPost("http://" + MaoCommonUtil.getLocalIP() + ":" + CommonConst.MOCK_ADDRESS_PORT + "/server/mao/sso/user/loginout",jsonParam);
			}else{
				tokenService.loginoutAll((data.get(CommonConst.COOKIES_USER_NAME)).toString());
			}
		}
		catch (Exception e) {
			response = new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
		}
		return response;
	}
}
