package com.zte.mao.common.filter;

import javax.servlet.Filter;
import javax.servlet.ServletRequest;

import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.zte.mao.common.http.HttpRequestUtils;
import com.zte.mao.common.session.SeessionAuthAccessManager;
import com.zte.mao.common.session.SessionManager;

public abstract class AbstractFilter implements Filter {
    
	protected SessionManager sessionManager;
	protected SeessionAuthAccessManager seessionAuthAccessManager;
	protected HttpRequestUtils httpRequestUtils;

	public AbstractFilter() {
		super();
	}

	protected void setSpringObj(ServletRequest request) {
        ApplicationContext ctx = WebApplicationContextUtils
                .getRequiredWebApplicationContext(request.getServletContext());
        if (sessionManager == null) {
            sessionManager = (SessionManager) ctx.getBean("sessionManager");
        }
        if (seessionAuthAccessManager == null) {
            seessionAuthAccessManager = (SeessionAuthAccessManager) ctx
                    .getBean("seessionAuthAccessManager");
        }
        if (httpRequestUtils == null) {
            httpRequestUtils = (HttpRequestUtils) ctx
                    .getBean("httpRequestUtils");
        }
    }

}