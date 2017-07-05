package com.zte.mao.common.service;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.exception.MaoCommonException;

@Service
public class LogInterceptorService {
	private static Logger logger = Logger.getLogger(LogInterceptorService.class.getName());
	@Resource
	private OrmDao ormDao;
	/**
	 * 
	 *登陆退出日志记录
	 */
	public void addLoginLog(String login_type,HttpServletRequest request,String tenantId,String login_name) {
		String ip = getIpAddr(request);
		DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Timestamp time = new Timestamp(System.currentTimeMillis());
		String login_time = sdf.format(time);
		String browserInfo = request.getHeader("user-agent");
		Map<String,String> data = new HashMap<String, String>();
		data.put("tenant_id", tenantId);
		data.put("login_name", login_name);
		data.put("login_type", login_type);
		data.put("login_time", login_time);
		data.put("ip", ip);
		data.put("user_agent", browserInfo);
		data.put("remark", "");
		try {
			ormDao.add("portals_login_log", data,tenantId);
		} catch (MaoCommonException e) {
			logger.error(e.getMessage(), e);
		}
	}
	private String getIpAddr(HttpServletRequest request) {     
	      String ip = request.getHeader("x-forwarded-for");     
	      if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {     
	         ip = request.getHeader("Proxy-Client-IP");     
	     }     
	      if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {     
	         ip = request.getHeader("WL-Proxy-Client-IP");     
	      }     
	     if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {     
	          ip = request.getRemoteAddr();     
	     }     
	     return ip;     
	}
}
