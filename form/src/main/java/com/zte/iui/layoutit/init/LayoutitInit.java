package com.zte.iui.layoutit.init;

import javax.annotation.Resource;

import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;

import com.zte.iui.layoutit.page.LayoutitJSONDataSourceInit;
import com.zte.iui.layoutit.page.LayoutitMSBDataSourceInit;
import org.apache.log4j.Logger;

public class LayoutitInit implements ApplicationListener<ContextRefreshedEvent>  {
	private static Logger logger = Logger.getLogger(LayoutitInit.class.getName());
	
	@Resource
	private LayoutitJSONDataSourceInit layoutitDataSourceInit;
	
	@Resource
	private LayoutitMSBDataSourceInit layoutitMSBDataSourceInit;

	@Override
	public void onApplicationEvent(ContextRefreshedEvent event) {
		logger.info("init msb datasource..");
		layoutitMSBDataSourceInit.init();
		
		logger.info("init datasource..");
		layoutitDataSourceInit.init();
	}
}
