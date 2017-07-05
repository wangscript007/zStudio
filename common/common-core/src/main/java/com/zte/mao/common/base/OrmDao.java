package com.zte.mao.common.base;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.annotation.Resource;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.NullNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.zte.mao.common.config.ConfigManage;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.http.HttpRequestUtils;
import com.zte.mao.common.service.CommonEnvService;
import com.zte.mao.common.util.MaoCommonUtil;

import org.apache.log4j.Logger;

@Service
public class OrmDao {
	private static final Logger dmsg = Logger.getLogger(OrmDao.class.getName());
	public static final String OPERATOR_AND = "and";
	public static final String OPERATOR_OR = "or";
	
	@Resource
	private CommonEnvService commonEnvService;
	
	@Resource
	private HttpRequestUtils httpUtils;
	
	private String platformType = ConfigManage.getInstance().getPlatformType();
	
	private void init() {
		if(httpUtils == null) {
			httpUtils = new HttpRequestUtils();
		}
	}
	
	public OrmDao setPlatformType(String platformType) {
		this.platformType = platformType;
		return this;
	}



	/**
	 * 添加单行数据
	 * 
	 * @param tableName
	 * @param data
	 * @param tenantId
	 * @return
	 * @throws MaoCommonException
	 */
	public boolean add(String tableName, Map<String, String> data,
			String tenantId) throws MaoCommonException {
		return this.getOrmStatus(addWithReturnPk(tableName, data, tenantId));
	}
	
	public String addWithReturnPk(String tableName, Map<String, String> data,
			String tenantId) throws MaoCommonException {
		init();
		ObjectMapper mapper = new ObjectMapper();
		String dataParams = "";

		try {
			ObjectNode node = mapper.createObjectNode();
			node.putPOJO("columns", data);
			dataParams = mapper.writeValueAsString(node);
			String uri = this.getOrmUri(tableName);
			String url = getUrl(uri, tenantId, null);

			return httpUtils.doPost(url, dataParams);
		} catch (JsonProcessingException e) {
			dmsg.error(e.getMessage(), e);
			throw new MaoCommonException("add data convert to json error:"
					+ e.getMessage() + "|" + tableName + "|" + dataParams, e);
		} catch (Exception e) {
			dmsg.error("add data error:" + e.getMessage() + "|" + tableName
					+ "|" + dataParams, e);
			throw new MaoCommonException("Add orm data error:" + e.getMessage()
					+ "|" + tableName + "|" + dataParams, e);
		}
	}

	/**
	 * 添加多行数据
	 * 
	 * @param tableName
	 * @param data
	 * @param tenantId
	 * @return
	 * @throws MaoCommonException
	 */
	public boolean addList(String tableName, List<Map<String, String>> data, String tenantId)
			throws MaoCommonException {
		return getOrmStatus(this.addListWithReturnPK(tableName, data, tenantId));
	}
	
	public String addListWithReturnPK(String tableName, List<Map<String, String>> data, String tenantId)
			throws MaoCommonException {
		init();
		ObjectMapper mapper = new ObjectMapper();
		String dataParams = "";

		try {
			ObjectNode node = mapper.createObjectNode();
			node.putPOJO("columns", data);
			dataParams = mapper.writeValueAsString(node);

			String uri = this.getOrmUri(tableName);
			String url = getUrl(uri, tenantId, null);

			return httpUtils.doPost(url, dataParams);
		} catch (JsonProcessingException e) {
			dmsg.error(e.getMessage(), e);
			throw new MaoCommonException("add data convert to json error:"
					+ e.getMessage() + "|" + tableName + "|" + dataParams, e);
		} catch (Exception e) {
			dmsg.error("add data error:" + e.getMessage() + "|" + tableName
					+ "|" + dataParams, e);
			throw new MaoCommonException("Add orm data error:" + e.getMessage()
					+ "|" + tableName + "|" + dataParams, e);
		}
	}
	
	@SuppressWarnings("deprecation")
	public boolean update(String tableName, Map<String, String> data,List<OrmQueryCondition> conditions,
			String conditionOperator,String tenantId) throws MaoCommonException {
		init();
		ObjectMapper mapper = new ObjectMapper();
		String dataParams = "";

		try {
			ObjectNode node = mapper.createObjectNode();
			node.putPOJO("columns", data);
			if (conditions != null && !conditions.isEmpty()) {
				if (conditionOperator != null && !conditionOperator.isEmpty()) {
					ObjectNode condition = mapper.createObjectNode();
					condition.putPOJO(conditionOperator, conditions);
					node.put("condition", condition);
				} else {
					node.put("condition", "");
				}
			}
			
			dataParams = mapper.writeValueAsString(node);

			String uri = this.getOrmUri(tableName);
			String url = getUrl(uri, tenantId, null);

			return this.getOrmStatus(httpUtils.doPut(url, dataParams));
		} catch (JsonProcessingException e) {
			dmsg.error(e.getMessage(), e);
			throw new MaoCommonException("update data convert to json error:"
					+ e.getMessage() + "|" + tableName + "|" + dataParams, e);
		} catch (Exception e) {
			dmsg.error("update data error:" + e.getMessage() + "|" + tableName
					+ "|" + dataParams, e);
			throw new MaoCommonException("update orm data error:" + e.getMessage()
					+ "|" + tableName + "|" + dataParams, e);
		}
	}
	
	public boolean updateMulti(String modelId, String data, String tenantId) throws MaoCommonException{
		String uri = this.getOrmMulitUri(modelId);
		String url = getUrl(uri, tenantId, null);
		try {
			return this.getOrmStatus(httpUtils.doPut(url, data));
		} catch (MaoCommonException e) {
			dmsg.error(e.getMessage(), e);
			throw new MaoCommonException("update data convert to json error:"
					+ e.getMessage() + "|" + modelId + "|" + data, e);
		} catch (Exception e) {
			dmsg.error(e.getMessage(), e);
			throw new MaoCommonException("update data convert to json error:"
					+ e.getMessage() + "|" + modelId + "|" + data, e);
		}
	}

	/**
	 * 删除orm数据
	 * 
	 * @param tableName
	 * @param condition
	 * @param tenantId
	 * @return
	 * @throws MaoCommonException
	 */
	public boolean delete(String tableName, OrmQueryCondition condition,
			String tenantId) throws MaoCommonException {
	    List<OrmQueryCondition> conditions = new ArrayList<OrmQueryCondition>();
	    conditions.add(condition);
	    return this.delete(tableName, conditions, tenantId);
	}
	
	/**
     * 删除orm数据
     * 
     * @param tableName
     * @param condition
     * @param tenantId
     * @return
     * @throws MaoCommonException
     */
    public boolean delete(String tableName, List<OrmQueryCondition> conditions,
            String tenantId) throws MaoCommonException {
        init();
        String url = null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode root = mapper.createObjectNode();
            if (CollectionUtils.isNotEmpty(conditions)) {
                if (conditions.size() > 1) {
                    ObjectNode condition = mapper.createObjectNode();
                    condition.putPOJO("and", conditions);
                    root.putPOJO("condition", condition);
                } else {
                    root.putPOJO("condition", conditions.get(0));
                }
            } else {
                root.putPOJO("condition", mapper.createObjectNode());
            }

            String queryString = "param=" + URLEncoder.encode(mapper.writeValueAsString(root), HttpRequestUtils.charset);
            
            String uri = this.getOrmUri(tableName);
            url = getUrl(uri, tenantId, queryString);

            return this.getOrmStatus(httpUtils.doDelete(url, ""));
        } catch (JsonProcessingException e) {
            dmsg.error(e.getMessage(), e);
            throw new MaoCommonException("delete data convert to json error:"
                    + e.getMessage() + "|" + tableName + "|" + url, e);
        } catch (Exception e) {
            dmsg.error("delete data error:" + e.getMessage() + "|" + tableName
                    + "|" + url, e);
            throw new MaoCommonException("delete data error:" + e.getMessage()
                    + "|" + tableName + "|" + url, e);
        }
    }
    
    public boolean delete(String tableName, String param, String tenantId){
    	String url = null;
    	String queryString;
    	boolean deleteResult = false;
		try {
			queryString = "param=" + URLEncoder.encode(param, HttpRequestUtils.charset);
			String uri = this.getOrmUri(tableName);
	        url = getUrl(uri, tenantId, queryString);
	        deleteResult = this.getOrmStatus(httpUtils.doDelete(url, ""));
		} catch (UnsupportedEncodingException e) {
			dmsg.error(e.getMessage(), e);
			return deleteResult;
		} catch (MaoCommonException e) {
			dmsg.error(e.getMessage(), e);
			return deleteResult;
		} catch (Exception e) {
			dmsg.error(e.getMessage(), e);
			return deleteResult;
		}      
        return deleteResult;
    }

	/**
	 * 数据查询接口
	 * 
	 * @param columns
	 * @param conditions
	 * @param conditionOperator
	 * @return
	 * @throws JsonProcessingException
	 * @throws MaoCommonException
	 */
	public List<Map<String, String>> getData(String tableName,
			String[] columns, List<OrmQueryCondition> conditions,
			String conditionOperator, String tenantId)
			throws MaoCommonException {
	    return this.getData(tableName, columns, conditions, conditionOperator, null, tenantId);
	}
	
	public String getData(String tableName, String[] columns, String param, String tenantId) throws MaoCommonException {
    	String url = null;
        try {
            String queryString = "param=" + URLEncoder.encode(param, HttpRequestUtils.charset);
            String uri = this.getOrmUri(tableName);
            url = getUrl(uri, tenantId, queryString);
            return httpUtils.sendGetRequest(url);
        } catch (Exception e) {
            dmsg.error("get  data error:" + e.getMessage() + "|" + tableName
                    + "|" + url, e);
            throw new MaoCommonException("get data error:" + e.getMessage()
                    + "|" + tableName + "|" + url, e);
        }
    }
	
	/**
     * 数据查询接口
     * 
     * @param columns
     * @param conditions
     * @param conditionOperator
     * @return
     * @throws JsonProcessingException
     * @throws MaoCommonException
     */
    @SuppressWarnings("deprecation")
    public List<Map<String, String>> getData(String tableName,
            String[] columns, List<OrmQueryCondition> conditions,
            String conditionOperator, List<OrmQueryOrder> orders, String tenantId)
            throws MaoCommonException {
        init();
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode rootNode = mapper.createObjectNode();

        ArrayNode arrNode = mapper.createArrayNode();
        for (String column : columns) {
            ObjectNode node = mapper.createObjectNode();
            node.put("cname", column.trim());
            arrNode.add(node);
        }
        rootNode.put("columns", arrNode);

        if (conditions != null && !conditions.isEmpty()) {
            if (StringUtils.isNotBlank(conditionOperator)) {
                ObjectNode condition = mapper.createObjectNode();
                condition.putPOJO(conditionOperator, conditions);
                rootNode.put("condition", condition);
            } else {
                rootNode.put("condition", "");
            }
        }

        if (orders != null && !orders.isEmpty()) {
            rootNode.putPOJO("orders", orders);
        }
        
        String url = null;
        String result = "";
        try {
            String queryString = "param=" + URLEncoder.encode(mapper.writeValueAsString(rootNode), HttpRequestUtils.charset);
            String uri = this.getOrmUri(tableName);
            url = getUrl(uri, tenantId, queryString);
            result = httpUtils.sendGetRequest(url);

            return this.getOrmData(columns, result);

        } catch (Exception e) {
            dmsg.error("get  data error:" + e.getMessage() + "|" + tableName
                    + "|" + url, e);
            throw new MaoCommonException("get data error:" + e.getMessage()
                    + "|" + tableName + "|" + url, e);
        }
    }

	/**
	 * 解析orm接口查询返回的数据
	 * 
	 * @param columns
	 * @param data
	 * @return
	 * @throws Exception 
	 */
	private List<Map<String, String>> getOrmData(String[] columns, String data) throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		JsonNode node = mapper.readTree(data);
		boolean status = node.get("status").asBoolean();
		if(!status) {
			throw new Exception(node.get("message").asText());
		}

		List<Map<String, String>> result = new ArrayList<Map<String, String>>();
		JsonNode rows = node.get("rows");
		if (rows.isArray()) {
			for (JsonNode objNode : rows) {
				Map<String, String> item = new HashMap<String, String>();
				for (String column : columns) {
					String value = null;
					if(objNode.has(column)){
						JsonNode valueNode = objNode.get(column);
						if (valueNode instanceof NullNode) {
						    value = null;
                        } else {
                            value = valueNode.asText();
                        }
					}
					item.put(column, value);
				}
				result.add(item);
			}
		}
		return result;
	}

	/**
	 * 
	 * @param result
	 * @return
	 * @throws MaoCommonException
	 * @throws JsonProcessingException
	 * @throws IOException
	 */
	public boolean getOrmStatus(String result) throws MaoCommonException {
		init();
		ObjectMapper mapper = new ObjectMapper();
		JsonNode root;
		try {
			root = mapper.readTree(result);
			if (root.get("status").asBoolean()) {
				return true;
			}
			throw new MaoCommonException(root.get("message").asText());
		} catch (JsonProcessingException e) {
			dmsg.error("Get orm return status error:" + e.getMessage());
			throw new MaoCommonException("Get orm return status error:" + e.getMessage(), e);

		} catch (IOException e) {
			dmsg.error("Get orm return status error:" + e.getMessage());
			throw new MaoCommonException("Get orm return status error:" + e.getMessage(), e);
		}
	}

	/**
	 * 获取orm url
	 * 
	 * @param tableName
	 * @return
	 * @throws MaoCommonException
	 */
	protected String getOrmUri(String tableName) {
		return "/" + commonEnvService.getAppName() + "/orm/table/" + tableName;
	}
	
	protected String getOrmMulitUri(String tableName) {
		return "/"+ commonEnvService.getAppName() +"/orm/multi/table/" + tableName;
	}
	
	public List<Map<String,String>> getTableColumns(String tableName, String tenantId) throws MaoCommonException {
	    String url = "";
	    try {
            String uri = this.getOrmTableColumnsUri(tableName);
            url = getUrl(uri, tenantId, null);
            JsonNode root = new ObjectMapper().readTree(httpUtils.sendGetRequest(url));
            if (root.get("status").asBoolean()) {
                List<Map<String, String>> fieldInfos = new ArrayList<Map<String, String>>();
                for (Iterator<JsonNode> it = root.get("fieldInfos").iterator(); it.hasNext();) {
                    Map<String, String> fieldMap = new HashMap<String, String>();
                    for (Iterator<Entry<String, JsonNode>> fields = it.next().fields(); fields.hasNext();) {
                        Entry<String, JsonNode> field = fields.next();
                        if (field.getValue().isNull()) {
                            fieldMap.put(field.getKey(), null);
                        } else {
                            fieldMap.put(field.getKey(), field.getValue().asText());
                        }
                    }
                    fieldInfos.add(fieldMap);
                }
                return fieldInfos;
            }
            throw new MaoCommonException(root.get("message").asText());
        } catch (Exception e) {
            dmsg.error("get  data error:" + e.getMessage() + "|" + tableName
                    + "|" + url, e);
            throw new MaoCommonException("get data error:" + e.getMessage()
                    + "|" + tableName + "|" + url, e);
        }
	}
	
	/**
     * 获取orm字段 url
     * 
     * @param tableName
     * @return
     * @throws MaoCommonException
     */
    protected String getOrmTableColumnsUri(String tableName) {
        return "/" + commonEnvService.getAppName() + "/orm/metadata/table/" + tableName;
    }
	
	/**
	 * 封装方法，在运维模块中url拼接方式需要调整
	 * @param dspNginxUrl
	 * @param uri
	 * @param tenantId
	 * @param queryString
	 * @return
	 */
	protected String getUrl(String uri, String tenantId, String queryString) {
		String url = MaoCommonUtil.getConvertDspUrl(uri, tenantId, queryString, platformType);
		platformType = ConfigManage.getInstance().getPlatformType();
		return url;
	}
	
	public String getTableNames(String tenantId) throws MaoCommonException{
		init();
		String uri = "/" + commonEnvService.getAppName() + "/orm/metadata/tablenames";
		String url = getUrl(uri, tenantId, null);
		try {
			String result = httpUtils.sendGetRequest(url);
			if(result.length()>0){
				JsonNode root = new ObjectMapper().readTree(result);
				if (root.get("status").asBoolean()) {
					return root.get("tablenames").asText();
				}else{
					throw new MaoCommonException("get tablenames error!");
				}
				
			}
		} catch (Exception e) {
			dmsg.error("get  data error:" + e.getMessage() + "|tableNames|" + url, e);
            throw new MaoCommonException("get data error:" + e.getMessage()
                    + "|tableNames|" + url, e);
			
		}
		return null;
	}
}
