package com.zte.ums.bcp.orm.utils;

import java.util.Map;

import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import com.zte.ums.bcp.orm.exception.OrmException;
import org.apache.log4j.Logger;

/**
 *  * 获取ApplicationContext和Object的工具类  *  
 */
@SuppressWarnings({ "rawtypes", "unchecked" })
@Component
public class SpringContextUtils implements ApplicationContextAware {
	
	@SuppressWarnings("unused")
	private static final Logger dMsg = Logger.getLogger(SpringContextUtils.class.getName());
	private ApplicationContext applicationContext;

	public ApplicationContext getApplicationContext() {
		return applicationContext;
	}

	public void setApplicationContext(ApplicationContext applicationContext) {
		this.applicationContext = applicationContext;
	}

	public Object getBeanById(String id) throws OrmException {
		Object o = null;
		try {
			o = applicationContext.getBean(id);
		} catch (Exception e) {
		    dMsg.error(e.getMessage(), e);
		    throw new OrmException(e.getLocalizedMessage(), e.getCause());
		}
		return o;
	}

	public boolean containsBean(String id) throws OrmException {
		return applicationContext.containsBean(id);
	}

	public Object getBeanByClass(Class c) {
		return applicationContext.getBean(c);
	}

	public Map getBeansByClass(Class c) {
		return applicationContext.getBeansOfType(c);
	}
}
