package com.zte.mao.common.util;

import java.util.Map;

import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 *  * 获取ApplicationContext和Object的工具类  *  
 */
@Component
public class SpringUtils implements ApplicationContextAware {
	
	private static ApplicationContext applicationContext;

	public static ApplicationContext getApplicationContext() {
		return applicationContext;
	}

	public void setApplicationContext(ApplicationContext applicationContext) {
	    if (applicationContext.getParent() != null) {
            return;
        }
		SpringUtils.applicationContext = applicationContext;
	}

	public Object getBeanById(String id) throws Exception {
		return applicationContext.getBean(id);
	}

	public boolean containsBean(String id) throws Exception {
		return applicationContext.containsBean(id);
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Object getBeanByClass(Class c) {
		return applicationContext.getBean(c);
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Map getBeansByClass(Class c) {
		return applicationContext.getBeansOfType(c);
	}
}
