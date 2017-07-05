package com.zte.ums.bcp.orm.framework.systemproperty.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;

import com.zte.ums.bcp.orm.utils.encrypt.EncryptException;
import com.zte.ums.bcp.orm.utils.encrypt.EncryptToolKit;

public class EncryptPropertyPlaceholderConfigurer extends
		PropertyPlaceholderConfigurer {

//	private String[] encryptPropNames = { "jdbc.username", "jdbc.password" };
	private String[] encryptPropNames = { "jdbc.password" };
	
	@Override
	protected String convertProperty(String propertyName, String propertyValue) {
		try {
			if (isEncryptProp(propertyName)) {
				propertyValue = EncryptToolKit.decrypt(propertyValue);
	        }
        } catch (EncryptException e) {
        	dMsg.error(e.getMessage());
        }
		return propertyValue;
    }
	
	/**
     * 判断是否是加密的属性
     * 
     * @param propertyName
     * @return
     */
    private boolean isEncryptProp(String propertyName) {
        for (String encryptpropertyName : encryptPropNames) {
            if (encryptpropertyName.equals(propertyName))
                return true;
        }
        return false;
    }
    
    private static final Logger dMsg = Logger.getLogger(EncryptPropertyPlaceholderConfigurer.class.getName());
}
