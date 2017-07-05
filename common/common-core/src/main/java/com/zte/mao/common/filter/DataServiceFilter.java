package com.zte.mao.common.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;

import com.zte.mao.common.config.ConfigManage;
import com.zte.mao.common.entity.CommonConst;
import com.zte.mao.common.entity.UserSimpleEntity;
import com.zte.mao.common.http.OrmExtensibleHttpServletRequest;
import com.zte.mao.common.shema.SchemaTablesCache;

public class DataServiceFilter extends AbstractFilter {
	private static Logger logger = Logger.getLogger(DataServiceFilter.class.getName());
	
	@Override
	public void init(FilterConfig arg0) throws ServletException {
		
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest httpRequest = (HttpServletRequest)request;
		setSpringObj(request);
		String database = request.getParameter(CommonConst.DATABASE);
		if(StringUtils.isBlank(database)) {
			try {
				String uri = httpRequest.getRequestURI();
				String tableName = uri.substring(uri.lastIndexOf('/') + 1);
				database = SchemaTablesCache.getInstance().getSchemaName(tableName);
				if(database != SchemaTablesCache.SCHEMA_GLOBAL) {
					String tenantId = sessionManager.getTenantId((HttpServletRequest)request);
					database = "tenant_" + tenantId;
				}
			} catch (Exception e) {
				logger.error(e.getMessage(), e);
				refuseResponse(response, e.getLocalizedMessage()); 
		        return;
			}
			database = getPrefix() + database;
		}
		chain.doFilter(new OrmExtensibleHttpServletRequest(httpRequest, database), response);
	}

	private String getPrefix() {
		String prefix = "";
		if(ConfigManage.getInstance().getPlatformType().equalsIgnoreCase(CommonConst.PLATFORM_TYPE_DESIGN)) {
			prefix = "d_";
		}
		return prefix;
	}

    private void refuseResponse(ServletResponse response, String message) throws IOException {
        response.setContentType("text/html;charset=UTF-8"); 
        response.getWriter().write(message);
    }

	
	@Override
	public void destroy() {
		
	}
}
