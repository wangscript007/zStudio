package com.zte.mao.common.session;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.zte.mao.common.entity.CommonConst;
import com.zte.mao.common.entity.UserSimpleEntity;
import com.zte.mao.common.http.HttpRequestUtils;
import com.zte.mao.common.service.CommonEnvService;
import com.zte.mao.common.service.LoginService;
import com.zte.mao.common.service.TokenService;
import com.zte.mao.common.util.CipherUtil;
import com.zte.mao.common.util.MaoCommonUtil;

@Service
public class SessionManager {
	
//	public final static String ATTR_TENANT_ID = "tenantId";
//	public final static String ATTR_LOGIN_NAME = "loginName";
//	public final static String ATTR_EMAIL = "email";
//	public final static String ATTR_MOBILE = "mobile";
//	public final static String ATTR_SUBCOMPANY_ID = "subcompanyId";
	
	@Resource
	private HttpRequestUtils requestUtils;
	
	@Resource
	private TokenService tokenManager;
	
	@Resource
	private CommonEnvService commonEnvService;
    @Resource
    protected LoginService loginManager;
	
    public UserSimpleEntity checkSignin(HttpServletRequest request) throws Exception {
        String token = getToken(request);
        return cacheUser2Session(request, token);
    }

	public UserSimpleEntity cacheUser2Session(HttpServletRequest request,
			String token) throws Exception,
			JsonMappingException {
		if (StringUtils.isBlank(token)) {
            return checkLoginByQueryParameter(request);
        }
        
        return tokenManager.signinStatus(token);
    }

    private UserSimpleEntity checkLoginByQueryParameter(HttpServletRequest request) throws Exception {
        String queryString = request.getQueryString();
        if (StringUtils.isBlank(queryString)) {
            throw new Exception("queryString is null. ");
        }
        String[] queryParas = queryString.split("&");
        String userName="";
        String password="";
        for (String queryPara : queryParas) {
            if (queryPara.startsWith("user=")) {
                userName = queryPara.split("=")[1];
            }
            if (queryPara.startsWith("pwd=")) {
                password = queryPara.split("=")[1];
            }
        }
        if (StringUtils.isBlank(userName) || StringUtils.isBlank(password)) {
            throw new Exception("userName or password is null.");
        }
        return loginManager.login(userName, CipherUtil.encrypt(userName + password));
    }

    public String getToken(HttpServletRequest request) {
	    return MaoCommonUtil.getCookie(request, CommonConst.COOKIES_USER_NAME);
	}
    
    public String getTenantId(HttpServletRequest request) throws Exception {
    	UserSimpleEntity user = checkSignin(request);
		return String.valueOf(user.getTenantId());
    }
    
    public String getLoginName(HttpServletRequest request) throws Exception {
    	UserSimpleEntity user = checkSignin(request);
		return user.getLoginName();
    }

	public UserSimpleEntity getSession(String token) throws Exception {
		return tokenManager.signinStatus(token);
	}
	
	public UserSimpleEntity loginOut(String token) {
		return tokenManager.loginoutAll(token);
	}

}
