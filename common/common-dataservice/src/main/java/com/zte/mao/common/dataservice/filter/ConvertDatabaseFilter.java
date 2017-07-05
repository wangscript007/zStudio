package com.zte.mao.common.dataservice.filter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zte.mao.common.config.ConfigManage;
import com.zte.mao.common.entity.CommonConst;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.http.OrmExtensibleHttpServletRequest;
import com.zte.mao.common.http.HttpRequestUtils;
import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.common.util.MaoCommonUtil;

public class ConvertDatabaseFilter implements Filter {
    private static final Logger logger = Logger.getLogger(ConvertDatabaseFilter.class.getName());
    private static ThreadLocal<String> platformType = new ThreadLocal<String>();
    private HttpRequestUtils httpRequestUtils;

    @Override
    public void destroy() {

    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        platformType.set(ConfigManage.getInstance().getPlatformType());
        synchronized (this) {
            setSpringObj(request);
        }
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        try {
            String tenantId = checkSignin(httpServletRequest);
            if (StringUtils.isNotBlank(tenantId)) {
                String databaseAttribute = "tenant_" + tenantId;
                if (CommonConst.PLATFORM_TYPE_DESIGN.equals(platformType.get())) {
                    databaseAttribute = "d_" + databaseAttribute;
                }
                request.setAttribute("database", databaseAttribute);
                chain.doFilter(new OrmExtensibleHttpServletRequest(httpServletRequest, databaseAttribute), response);
            } else {
                refuseResponse(response, "当前用户未登陆。 ");
            }
        } catch (MaoCommonException e) {
            logger.error(e.getMessage(), e);
            refuseResponse(response, e.getLocalizedMessage());
        }
    }

    private void setSpringObj(ServletRequest request) {
        ApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(request.getServletContext());
        if (httpRequestUtils == null) {
            httpRequestUtils = (HttpRequestUtils) ctx.getBean("httpRequestUtils");
        }
    }

    private void refuseResponse(ServletResponse response, String message) throws IOException {
        response.setContentType("text/html;charset=UTF-8"); 
        response.getWriter().write(message);
    }

	private String checkSignin(HttpServletRequest request)
			throws MaoCommonException {
		String tokenMap = getToken(request);
		Map<String, String> payloadMap = new HashMap<String, String>();
		payloadMap.put("token", tokenMap);
		payloadMap.put("module", "dataservice");
		payloadMap.put("ip", request.getRemoteHost());
		payloadMap.put("port", String.valueOf(request.getRemotePort()));
		// 转化map的内容to json
		String contextPath;
		String result = "";
		if (CommonConst.PLATFORM_TYPE_DESIGN.equals(platformType.get())) {
			contextPath = "/workbench";
		} else {
			contextPath = "/server";
		}
		JsonNode resultMap;
		try {
			result = httpRequestUtils.doPost(
					httpRequestUtils.getLocalPath() + contextPath + "/mao/sso/module/signin/check",
					new ObjectMapper().writeValueAsString(payloadMap));
			resultMap = new ObjectMapper().readTree(result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			throw new MaoCommonException(e.getLocalizedMessage(), e);
		}
		byte status = Byte.parseByte(resultMap.get(CommonResponse.STATUS_STR).toString());
		if (status == CommonResponse.STATUS_SUCCESS) {
			JsonNode entity = resultMap.get("userEntity");
			if (entity.has("tenantId")) {
				return entity.get("tenantId").asText();
			}
		}
		throw new MaoCommonException("从sso查询用户登陆信息失败，sso返回结果为：" + result);
	}

    private String getToken(HttpServletRequest request) throws MaoCommonException {
        String token = MaoCommonUtil.getCookie(request, platformType.get() + "_mao_user_token");
        if (StringUtils.isBlank(token)) {
        	throw new MaoCommonException("当前用户未登陆。 ");
        }
        return token;
    }

    @Override
    public void init(FilterConfig arg0) throws ServletException {

    }

}
