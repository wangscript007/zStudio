package com.zte.ums.bcp.orm.framework.filter;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.zte.ums.bcp.orm.framework.entry.OperationLogTable;
import com.zte.ums.bcp.orm.utils.DateUtil;
import com.zte.ums.bcp.orm.utils.IdUtil;
import com.zte.ums.bcp.orm.utils.IpType;

public class LogFilter implements Filter {

	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void doFilter(ServletRequest arg0, ServletResponse arg1,
			FilterChain arg2) throws IOException, ServletException {
		Map<String, String> columnsAndValues = new HashMap<String, String>();
		HttpServletRequest request = (HttpServletRequest) arg0;
		HttpServletResponse response = (HttpServletResponse) arg1;
		columnsAndValues.put(OperationLogTable.COLUMN_ACCESS_TYPE, request.getMethod());
		columnsAndValues.put(OperationLogTable.COLUMN_ACCESS_URL, request.getRequestURL().toString());
		columnsAndValues.put(OperationLogTable.COLUMN_ACCESS_URI, request.getRequestURI().replaceFirst(request.getContextPath(), ""));
		
		StringBuilder accessParameter = new StringBuilder();
		for (Map.Entry<String, String[]> entry: request.getParameterMap().entrySet()) {
			for (String value: entry.getValue()) {
				accessParameter.append("&");
				accessParameter.append(entry.getKey());
				accessParameter.append("=");
				accessParameter.append(new String(value.getBytes("ISO-8859-1"), request.getCharacterEncoding()));
			}
		}
		
		columnsAndValues.put(OperationLogTable.COLUMN_ACCESS_PARAMETER, accessParameter.toString().replaceFirst("&", ""));
		
		accessParameter = null;
		
		String ip = request.getHeader(IpType.X_FORWARDED_FOR_IP);

		if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader(IpType.PROXY_CLIENT_IP);
		}
		else {
			columnsAndValues.put(OperationLogTable.COLUMN_X_FORWARDED_FOR_IP, ip);
		}

		if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader(IpType.WL_PROXY_CLIENT_IP);
		}
		else {
			columnsAndValues.put(OperationLogTable.COLUMN_PROXY_CLIENT_IP, ip);
		}

		if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			columnsAndValues.put(OperationLogTable.COLUMN_REMOTE_ADDR_IP, request.getRemoteAddr());
		}
		else {
			columnsAndValues.put(OperationLogTable.COLUMN_REMOTE_ADDR_IP, ip);
		}
		Date startDate = new Date();
		arg2.doFilter(request, response);
		Date endDate = new Date();
		columnsAndValues.put(OperationLogTable.COLUMN_ID, IdUtil.getUUid());
		
		StringBuilder accessContinuedTime = new StringBuilder();
		accessContinuedTime.append((endDate.getTime() - startDate.getTime())/1000);
		accessContinuedTime.append(".");
		accessContinuedTime.append((endDate.getTime() - startDate.getTime())%1000);
		accessContinuedTime.append("s");
		
		columnsAndValues.put(OperationLogTable.COLUMN_END_TIME, DateUtil.dateToString(endDate, DateUtil.YYYY_MM_DD_HH_mm_SS));
		columnsAndValues.put(OperationLogTable.COLUMN_ACCESS_CONTINUED_TIME, accessContinuedTime.toString());
		columnsAndValues.put(OperationLogTable.COLUMN_START_TIME, DateUtil.dateToString(startDate, DateUtil.YYYY_MM_DD_HH_mm_SS));
		columnsAndValues.put(OperationLogTable.COLUMN_ERROR_MESSAGE, "");
		columnsAndValues.put(OperationLogTable.COLUMN_RETURN_STATUS_CODE, String.valueOf(response.getStatus()));
		
//		AddRecordService addRecordService = new AddRecordService();
		//addRecordService.addRecord(OperationLogTable.TABLE_NAME, columnsAndValues);
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub
	}

}
