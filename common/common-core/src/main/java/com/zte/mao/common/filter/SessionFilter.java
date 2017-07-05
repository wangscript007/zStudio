package com.zte.mao.common.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;

import com.zte.mao.common.config.ConfigManage;
import com.zte.mao.common.entity.CommonConst;
import com.zte.mao.common.entity.UserSimpleEntity;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.util.MaoCommonUtil;

public class SessionFilter extends AbstractFilter {
    private static Logger logger = Logger.getLogger(SessionFilter.class.getName());

    private String[] excludedPageArray = new String[0];
	private String[] ignoreTypesArray = new String[0];

	@Override
    public void init(FilterConfig filterConfig) throws ServletException {
    	String excludedPages = filterConfig.getInitParameter("excludedPages");  
		if (StringUtils.isNotBlank(excludedPages)) {
			excludedPageArray = excludedPages.toLowerCase().split(",");  
		}
		String ignoreTypes = filterConfig.getInitParameter("ignoreTypes");  
		if (StringUtils.isNotBlank(ignoreTypes)) {  
			ignoreTypesArray  = ignoreTypes.toLowerCase().split(",");  
		}
    }
	
    @Override
    public void destroy() {

    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String servletPath = httpRequest.getServletPath().toLowerCase();
        if (servletPath.startsWith("/")) {
            servletPath = servletPath.substring(1);
        }
        if (isExcludeRequest(servletPath)) {
            chain.doFilter(request, response);
        } else {
            boolean isLogin = true;
            setSpringObj(request);
            boolean isAuth = true;
            try {
                String requestURI = httpRequest.getRequestURI();
                UserSimpleEntity user = sessionManager.checkSignin((HttpServletRequest) request);
                // 当重新开启tab页时会导致获取的session内容中没有保存租户信息的情况，这里统一从sessionManager中获取session
                String loginName = user.getLoginName();
                Long tenantId = user.getTenantId();


                if (!"admin".equals(loginName.split("@")[0])) {
                    isAuth = seessionAuthAccessManager.isAuthOperatorRes(loginName, tenantId, requestURI);
                }
            } catch (Exception e) {
                logger.error(e.getMessage());
                isLogin = false;
            }
            if (isLogin && isAuth) {
                chain.doFilter(request, response);
            } else {
                redirectPage(httpRequest, response, isLogin, isAuth);
            }
        }
    }

    /**
     * 不需要鉴权请求的判断
     * @param servletPath
     * @return
     */
    private boolean isExcludeRequest(String servletPath) {
        if (servletPath.startsWith("mao/uap/") 
        		|| servletPath.startsWith("mao/sso/")
        		|| servletPath.startsWith("orm/")
        		|| servletPath.startsWith("mao/common/login/check")
        		|| servletPath.startsWith("upload/design/application/zip")
        		|| servletPath.startsWith("import/design/application/package")) {
            return true;
        }
        if (ArrayUtils.indexOf(excludedPageArray, servletPath) > -1) {
            return true;
        }
        for (String type : ignoreTypesArray) {
            if (servletPath.endsWith("." + type)) {
                return true;
            }
        }
        return false;
    }

    private void redirectPage(HttpServletRequest httpRequest, ServletResponse response, boolean isLogin,
            boolean isAuth) throws IOException {
        String userNginxUrl = httpRequestUtils.getLocalPath();
        String loginPageName = "/user-page.html?page=log";
        if (!isLogin) {
        	if(CommonConst.PLATFORM_TYPE_MOCK.equals(ConfigManage.getInstance().getPlatformType())){
            	try {
					((HttpServletResponse) response).sendRedirect("http://" + MaoCommonUtil.getLocalIP() + ":" + CommonConst.DESIGNER_ADDRESS_PORT + "/workbench/user-page.html?page=log");
				} catch (MaoCommonException e) {
					logger.error(e.getMessage());
				}
            }else{
            	((HttpServletResponse) response).sendRedirect(userNginxUrl
                        + httpRequest.getContextPath() + loginPageName);
            }
        }
        if (!isAuth) { // 转向到无权限页面
            ((HttpServletResponse) response).sendRedirect(userNginxUrl
                    + httpRequest.getContextPath() + "/dispermission.html");
        }
    }

}
