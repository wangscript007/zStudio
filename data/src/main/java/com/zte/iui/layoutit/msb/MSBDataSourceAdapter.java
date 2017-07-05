package com.zte.iui.layoutit.msb;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.zte.iui.layoutit.bean.SourceInfo;
import com.zte.iui.layoutit.common.HttpUtils;

@Service
public class MSBDataSourceAdapter {
	private String dataSourceId;
	private String dataSourceName;
	private Map<String, Object> referenceObjectMap;
	private static final String  BFD_DATASOUCE_ID = "id";
	private static final String  BFD_DATASOUCE_NAME = "name";
	private static final String  BFD_DATASOUCE_IP = "ip";
	private static final String  BFD_DATASOUCE_PORT = "port";
	private static final String  BFD_DATASOUCE_APP_PATH = "app_path";
	private static final String  BFD_DATASOUCE_SERVICES = "services";
	
	private static final String  BFD_SERVICE_ID = "id";
	private static final String  BFD_SERVICE_NAME = "name";
	private static final String  BFD_SERVICE_DEFINITIONS = "definitions";
	private static final String  BFD_SERVICE_SETS = "sets";
	
	private static final String  BFD_SETS_NAME = "name";
	private static final String  BFD_SETS_PATH = "set_path";
	private static final String  BFD_SETS_GET_OUT = "get_out";
	private static final String  BFD_SETS_GET_PARAM = "get_param";
	private static final String  BFD_SETS_PUT_IN = "put_in";
	private static final String  BFD_SETS_POST_IN = "post_in";
	
	
	private static final String  BFD_FIELDS_NAME = "name";
	private static final String  BFD_FIELDS_TYPE = "type";
	private static final String  BFD_FIELDS_LENGTH = "length";
	private static final String  BFD_FIELDS_LENGTH_DEFAULT = "0";
	private static final String  BFD_FIELDS_$REF = "$ref";
	
	private static final String  BFD_DEFINITIONS_PROPERTIES = "properties";
	
	private static final String  MSB_DATASOUCE_BASEPATH = "basePath";
	private static final String  MSB_SERVICE_DEFINITIONS = "definitions";
	private static final String  MSB_SERVICE_PATHS = "paths";
	
	private static final String  MSB_SET_PARAMETERS = "parameters";
	private static final String  MSB_SET_RESPONSES = "responses";	
	
	private static final String  MSB_DEFINITIONS_PROPERTIES = "properties";
	
	private static final String  MSB_PROPERTIES_NAME = "name";
	private static final String  MSB_PROPERTIES_TYPE = "type";
	private static final String  MSB_PROPERTIES_ITEMS = "items";
	private static final String  MSB_PROPERTIES_$REF = "$ref";
	private static final String  MSB_PROPERTIES_$REF_PREFIX = "#/definitions/";
	private static final String  MSB_PROPERTIES_SCHEMA = "schema";
	
	
	private static final String  MSB_TYPE_ARRAY = "array";
	private static final String  MSB_TYPE_OBJECT = "object";
	
	private static final String  MSB_METHOD_GET = "get";
	private static final String  MSB_METHOD_POST = "post";
	private static final String  MSB_METHOD_PUT = "put";
	

	public String getDataSourceJson(SourceInfo dataSource) throws IOException {
		if (dataSource == null) {
			return "";
		}

		this.dataSourceId = dataSource.getSourceName();
		this.dataSourceName = dataSource.getSourceName();

		String url = "http://" + dataSource.getIp() + ":"
				+ dataSource.getPort() + "/" + dataSource.getUriPrefix();

		HttpUtils httpUtil = new HttpUtils();
		String metaData = httpUtil.sendGetRequest(url);

		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		Map<String, Object> retMap = gson.fromJson(metaData,
				new TypeToken<Map<String, Object>>() {
				}.getType());

		return gson.toJson(getDataSources(retMap));
	}

	/**
	 * 获取数据源
	 * 
	 * @param retMap
	 * @return
	 */
	private List<Map<String, Object>> getDataSources(Map<String, Object> retMap) {
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
		if (retMap == null || retMap.size() == 0) {
			return result;
		}

		Map<String, Object> dsMap = new LinkedHashMap<String, Object>();
		dsMap.put(BFD_DATASOUCE_ID, this.dataSourceId);
		dsMap.put(BFD_DATASOUCE_NAME, this.dataSourceName);
		dsMap.put(BFD_DATASOUCE_IP, "");
		dsMap.put(BFD_DATASOUCE_PORT, "");

		String basePath = (String) retMap.get(MSB_DATASOUCE_BASEPATH);
		if (StringUtils.isEmpty(basePath)) {
			basePath = "";
		}
		dsMap.put(BFD_DATASOUCE_APP_PATH, basePath);

		dsMap.put(BFD_DATASOUCE_SERVICES, getDataServices(retMap));
		result.add(dsMap);
		return result;
	}

	/**
	 * 获取数据服务定义
	 * 
	 * @param retMap
	 * @return
	 */
	@SuppressWarnings("unchecked")
	private List<Map<String, Object>> getDataServices(Map<String, Object> retMap) {
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
		Map<String, Object> dsMap = new LinkedHashMap<String, Object>();
		dsMap.put(BFD_SERVICE_ID, this.dataSourceId);
		dsMap.put(BFD_SERVICE_NAME, this.dataSourceName);
		
		/**
		 * 引用对象解析
		 */
		Map<String, Object> definitionMap = (Map<String, Object>) retMap.get(MSB_SERVICE_DEFINITIONS);
		if (definitionMap != null && !definitionMap.isEmpty()) {
			this.referenceObjectMap = this.getDefinitions(definitionMap);
			dsMap.put(BFD_SERVICE_DEFINITIONS, this.referenceObjectMap);			
		}
		
		/**
		 * 数据集解析
		 */
		Map<String, Object> setsMap = (Map<String, Object>) retMap
				.get(MSB_SERVICE_PATHS);
		if (setsMap != null && !setsMap.isEmpty()) {
			dsMap.put(BFD_SERVICE_SETS, this.getDataSets(setsMap));
		}		
		
		result.add(dsMap);
		return result;
	}

	/**
	 * 获取引用对象定义
	 * 
	 * @param definitionMap
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private Map<String, Object> getDefinitions(Map<String, Object> definitionMap) {
		Map<String, Object> result = new LinkedHashMap<String, Object>();
		if(definitionMap == null || definitionMap.isEmpty()){
			return result;
		}		
		
		/**
		 * 解析引用对象
		 */
		for (String key : definitionMap.keySet()) {
			Map refObject = (Map) definitionMap.get(key);
			if (refObject == null || refObject.isEmpty()) {
				continue;
			}
			
			/**
			 * 属性集合 
			 */
			Map<String, Object> propMap = (Map<String, Object>) refObject.get(MSB_DEFINITIONS_PROPERTIES);
			if (propMap == null || propMap.isEmpty()) {
				continue;
			}
			
			Map<String,Object> properties = new HashMap<String,Object>();
			properties.put(BFD_DEFINITIONS_PROPERTIES, this.getDefinitionsProperties(propMap));
			result.put(key, properties);
		}

		return result;
	}

	/**
	 * 获取引用对象属性
	 * 
	 * @param propMap
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	private List<Map<String, String>> getDefinitionsProperties(Map<String, Object> propMap) {		
		List<Map<String, String>> result = new ArrayList<Map<String, String>>();
		if(propMap == null || propMap.isEmpty()){
			return result;
		}
		
		/**
		 * 引用对象字段属性解析
		 */
		for (String key : propMap.keySet()) {
			Map<String, String> property = new HashMap<String, String>();
			property.put(BFD_FIELDS_NAME, key);

			Map propSubInfo = (Map) propMap.get(key);
			String type = MSB_TYPE_OBJECT;
			if (propSubInfo != null && propSubInfo.containsKey(MSB_PROPERTIES_TYPE)) {
				type = (String) propSubInfo.get(MSB_PROPERTIES_TYPE);				
			}
			property.put(BFD_FIELDS_TYPE, type);

			String refObject = "";
			if (type.equalsIgnoreCase(MSB_TYPE_ARRAY)) {
				Map subObject = (Map) propSubInfo.get(MSB_PROPERTIES_ITEMS);
				if (subObject != null && subObject.containsKey(MSB_PROPERTIES_$REF)) {
					refObject = (String) subObject.get(MSB_PROPERTIES_$REF);
				}
			} else if (type.equalsIgnoreCase(MSB_TYPE_OBJECT)
					&& propSubInfo.containsKey(MSB_PROPERTIES_$REF)) {
				refObject = (String) propSubInfo.get(MSB_PROPERTIES_$REF);
			} else {
				property.put(BFD_FIELDS_LENGTH, BFD_FIELDS_LENGTH_DEFAULT);
			}

			if (!StringUtils.isEmpty(refObject)) {
				property.put(BFD_FIELDS_$REF, refObject.replace(MSB_PROPERTIES_$REF_PREFIX,""));
			}

			result.add(property);
		}

		return result;
	}

	/**
	 * 获取数据集定义
	 * 
	 * @param setsMap
	 * @return
	 */
	@SuppressWarnings("unchecked")
	private List<Map<String, Object>> getDataSets(Map<String, Object> setsMap) {
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
		if (setsMap == null || setsMap.isEmpty()) {
			return result;
		}

		/**
		 * 解析数据集
		 */
		for (String key : setsMap.keySet()) {
			Map<String, Object> subInfo = (Map<String, Object>) setsMap
					.get(key);
			if (subInfo == null || subInfo.isEmpty()) {
				continue;
			}

			/**
			 * 数据集名称
			 */
			String setName = key;

			/**
			 * 操作(get/put/post/delete)
			 */
			String method = "";

			/**
			 * request 请求参数
			 */
			List<Map<String, String>> requestFields = new ArrayList<Map<String, String>>();
			/**
			 * response 响应对象
			 */
			List<Map<String, String>> responseFields = new ArrayList<Map<String, String>>();

			/**
			 * subKey(get/post/put/delete)
			 */
			for (String subKey : subInfo.keySet()) {
				method = subKey;

				Map<String, Object> leafInfo = (Map<String, Object>) subInfo
						.get(subKey);
				if (leafInfo == null || leafInfo.isEmpty()) {
					continue;
				}

				/**
				 * --parameters 节点解析
				 */
				List<Map<String, Object>> requestParams = (List<Map<String, Object>>) leafInfo
						.get(MSB_SET_PARAMETERS);
				requestFields = this.getRequestDataFields(requestParams);

				/**
				 * --responses 节点解析
				 */
				Map<String, Object> responseParams = (Map<String, Object>) leafInfo
						.get(MSB_SET_RESPONSES);
				responseFields = this.getResponseDataFields(responseParams);

				break;
			}

			/**
			 * 构建数据集
			 */
			Map<String, Object> setInfo = new LinkedHashMap<String, Object>();
			setInfo.put(BFD_SETS_NAME, setName + "/" + method);
			setInfo.put(BFD_SETS_PATH, setName);
			if (method.equalsIgnoreCase(MSB_METHOD_GET)) {
				if (responseFields != null) {
					setInfo.put(BFD_SETS_GET_OUT, responseFields);
				}

				if (requestFields != null) {
					setInfo.put(BFD_SETS_GET_PARAM, requestFields);
				}
			} else if (method.equalsIgnoreCase(MSB_METHOD_PUT)) {
				setInfo.put(BFD_SETS_PUT_IN, requestFields);
			} else if (method.equalsIgnoreCase(MSB_METHOD_POST)) {
				setInfo.put(BFD_SETS_POST_IN, requestFields);
			}

			result.add(setInfo);
		}

		return result;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	private List<Map<String, String>> getResponseDataFields(
			Map<String, Object> parameters) {
		List<Map<String, String>> result = new ArrayList<Map<String, String>>();
		if (parameters == null || parameters.isEmpty()) {
			return result;
		}

		for (String key : parameters.keySet()) {
			if (!key.startsWith("2")) {
				continue;
			}

			Map subObject = (Map) parameters.get(key);
			if (subObject == null || subObject.isEmpty()) {
				continue;
			}
			
			Map schemaMap = (Map)subObject.get(MSB_PROPERTIES_SCHEMA);
			if(schemaMap == null || schemaMap.isEmpty()){
				continue;
			}		
						
			String type = MSB_TYPE_OBJECT;
			if (schemaMap.containsKey(MSB_PROPERTIES_TYPE)) {
				type = (String) schemaMap.get(MSB_PROPERTIES_TYPE);
			}
			
			Map refObject = schemaMap;		
			if(type.equalsIgnoreCase(MSB_TYPE_ARRAY)){
				if(schemaMap.containsKey(MSB_PROPERTIES_ITEMS)){
					refObject = (Map)schemaMap.get(MSB_PROPERTIES_ITEMS);	
				}				
			}
			
			if(refObject == null || !refObject.containsKey(MSB_PROPERTIES_$REF)){
				continue;
			}
			
			String refObjectKey =(String)refObject.get(MSB_PROPERTIES_$REF);			
			refObjectKey = refObjectKey.replace(MSB_PROPERTIES_$REF_PREFIX, "");			
			
			Map formatedRefObject = (Map)this.referenceObjectMap.get(refObjectKey);
			if(formatedRefObject.containsKey(BFD_DEFINITIONS_PROPERTIES)){
				result = (List<Map<String, String>>) formatedRefObject.get(BFD_DEFINITIONS_PROPERTIES);
			}
		}

		return result;
	}

	/**
	 * 获取请求参数字段
	 * 
	 * @param parameters
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private List<Map<String, String>> getRequestDataFields(
			List<Map<String, Object>> parameters) {
		List<Map<String, String>> result = new ArrayList<Map<String, String>>();
		if (parameters == null || parameters.isEmpty()) {
			return result;
		}		
		
		int size = parameters.size();
		for (Map<String, Object> param : parameters) {
			Map<String, String> item = new LinkedHashMap<String, String>();
			/**
			 * 字段名称
			 */
			item.put(BFD_FIELDS_NAME, (String) param.get(MSB_PROPERTIES_NAME));

			/**
			 * 字段类型
			 */
			String type = MSB_TYPE_OBJECT;
			if (param.containsKey(MSB_PROPERTIES_TYPE)) {
				type = (String) param.get(MSB_PROPERTIES_TYPE);
			}

			item.put(BFD_FIELDS_TYPE, type);

			/**
			 * 引用对象
			 */
			if (!type.equalsIgnoreCase(MSB_TYPE_OBJECT)
					&& !type.equalsIgnoreCase(MSB_TYPE_ARRAY)) {
				item.put(BFD_FIELDS_LENGTH, BFD_FIELDS_LENGTH_DEFAULT);				
			}
			
			Map ref = (Map) param.get(MSB_PROPERTIES_SCHEMA);
			if (ref != null && !ref.isEmpty()
					&& ref.containsKey(MSB_PROPERTIES_$REF)) {
				String refObjectKey = ((String) ref.get(MSB_PROPERTIES_$REF)).replace(
						MSB_PROPERTIES_$REF_PREFIX, "");
				Map formatedRefObject = (Map) this.referenceObjectMap.get(refObjectKey);	
				if (size == 1 && formatedRefObject != null
						&& formatedRefObject.containsKey(BFD_DEFINITIONS_PROPERTIES)) {
					result = (List<Map<String, String>>) formatedRefObject
							.get(BFD_DEFINITIONS_PROPERTIES);
					break;
				} else {
					item.put(BFD_FIELDS_$REF, refObjectKey);
				}
			}

			result.add(item);
		}

		return result;
	}

	@SuppressWarnings("unused")
	private List<Map<String, Object>> getDataOperation() {
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();

		return result;
	}

}
