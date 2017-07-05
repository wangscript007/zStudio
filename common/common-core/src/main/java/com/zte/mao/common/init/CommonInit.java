package com.zte.mao.common.init;

import javax.annotation.Resource;
import javax.servlet.ServletContext;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Service;
import org.springframework.web.context.ServletContextAware;

import com.zte.mao.common.service.datasource.DataSourceService;
import com.zte.mao.common.shema.SchemaTablesBean;
import com.zte.mao.common.shema.SchemaTablesCache;
import com.zte.mao.common.util.SpringUtils;

@Service
public class CommonInit implements InitializingBean, ServletContextAware {
    private static final Logger logger = Logger.getLogger(CommonInit.class.getName());

    @Resource
    private SpringUtils springUtils;
    
    @Resource
    private DataSourceService dataSourceService;
	

	@Override
	public void setServletContext(ServletContext servletContext) {
		try {
			dataSourceService.init();
		}
		catch(Exception e) {
			logger.error(e.getMessage(), e);
		}
		
    	try {
    		SchemaTablesBean schemaTablesBean = (SchemaTablesBean)springUtils.getBeanById("schemaInfo");
    		SchemaTablesCache cache = SchemaTablesCache.getInstance();
    		cache.setData2Global(schemaTablesBean.getGlobals());
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
	}

	@Override
	public void afterPropertiesSet() throws Exception {

	}
}
