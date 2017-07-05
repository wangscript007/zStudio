package com.zte.mao.common.service;

import java.io.File;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.web.context.support.XmlWebApplicationContext;

import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.http.HttpRequestUtils;
import com.zte.mao.common.util.MaoCommonUtil;
import com.zte.mao.common.util.SpringUtils;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;

@Service
public class CommonEnvService {
    private static final Logger dMsg = Logger.getLogger(CommonEnvService.class.getName());
    
    @Resource
    private SpringUtils springUtils;
    
    @Resource
	private HttpRequestUtils httpRequestUtils;

    public String getRootPath() {
        return System.getProperty("catalina.home");
    }

    public String getAppHomePath() {
        return ((XmlWebApplicationContext)SpringUtils.getApplicationContext()).getServletContext().getRealPath("/");
    }
    
    public String getAppName() {
        String applicationName = SpringUtils.getApplicationContext().getApplicationName();
        if(applicationName.startsWith("/")) {
        	return applicationName.substring(1);
        }
		return applicationName;
    }
    
    public String getTenantRuntimePath(String tenantId) {
        String runtimePath = getAppHomePath() + "runtime";
        if (StringUtils.isNotBlank(tenantId)) {
            runtimePath = runtimePath + File.separator + tenantId;
        }
        return runtimePath;
    }
    
}