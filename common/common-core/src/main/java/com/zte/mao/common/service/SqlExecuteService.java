package com.zte.mao.common.service;

import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zte.mao.common.config.ConfigManage;
import com.zte.mao.common.entity.CommonConst;
import com.zte.mao.common.http.HttpRequestUtils;

@Service
public class SqlExecuteService {
	
	public final static String OPERATOR_ADD = "ADD";
	public final static String OPERATOR_UPDATE = "UPDATE";
	public final static String OPERATOR_DELETE = "DELETE";
	public final static String OPERATOR_QUERY = "QUERY";
	
	public final static String STATUS_SUCCESS = "1";
	public final static String STATUS_FAIL = "0";

	@Resource
	private HttpRequestUtils httpRequestUtils;
	
	@Resource
	private CommonEnvService commonEnvService;
	
	private void setHttpRequestUtils() {
		if(httpRequestUtils == null) {
			httpRequestUtils = new HttpRequestUtils();
		}
	}
	
	/**
	 * sql操作类，如果是全局库则不需要传入tenantId
	 * @param sql
	 * @param operatorType
	 * @param tenantId
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("rawtypes")
	public Map executeSQL(String sql, String operatorType, String tenantId) throws Exception {
		setHttpRequestUtils();
		String url = getUrl(sql, operatorType, tenantId);
		
		String result = httpRequestUtils.doGet(url);
		return new ObjectMapper().readValue(result, Map.class);
	}

	protected String getUrl(String sql, String operatorType, String tenantId) {
		String uri = "/orm/sql/execute" + "?sql=" + sql + "&opeType=" + operatorType;
		String url = null;
		String dbPrefix = "";
		if(ConfigManage.getInstance().getPlatformType().equals(CommonConst.PLATFORM_TYPE_DESIGN)) {
			dbPrefix = "d_";
		}
		if(StringUtils.isNotBlank(tenantId)) {
			uri = uri + "&tenantId=" + tenantId + "&database=" + dbPrefix + "tenant_" + tenantId;
		}
		else {
			uri = uri + "&database=" + dbPrefix + "global";
		}
		url = httpRequestUtils.getLocalPath() + "/" + commonEnvService.getAppName() + uri;
		return url;
	}
	
	/**
	 * sql操作类，如果是全局库则不需要传入tenantId
	 * @param sql
	 * @param operatorType
	 * @param tenantId
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("rawtypes")
	public Map executeBpeSQL(String sql, String operatorType, String tenantId) throws Exception {
		setHttpRequestUtils();
		String uri = "/orm/sql/execute" + "?sql=" + sql + "&opeType=" + operatorType;
		String url = null;
		if(StringUtils.isBlank(tenantId)) {
			throw new Exception("executeBpeSQL tenantId is blank. ");
		}
		uri = uri + "&tenantId=" + tenantId + "&database=cos_bpe";
		url = httpRequestUtils.getLocalPath() + "/bpe" + uri;
		
		String result = httpRequestUtils.doGet(url);
		return new ObjectMapper().readValue(result, Map.class);
	}
	
	/**
	 * 通过dsp进程返回map获得返回状态
	 * @param map
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public String getStatus(Map map) {
		Object status = map.get("status");
		if(status != null) {
			return status.toString();
		}
		return STATUS_FAIL;
	}
}
