package com.zte.mao.bpm.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.zte.mao.bpm.entity.api.constant.JsonKeyConstant;
import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.entity.UserSimpleEntity;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.session.SessionManager;


@Service
public class ModelDataService {

	@Resource
	OrmDao ormDao;

	@Resource
	private SessionManager sessionManager;

	ObjectMapper mapper = new ObjectMapper();

	private static final Logger logger = Logger.getLogger(ModelDataService.class.getName());

	public String queryModel(HttpServletRequest request, String modelId, String param) {
		// -TODO 判断调orm接口或其它接口
		String rtnResult = "";
		JsonNode paramNode = null;
		StringBuilder columnStr = new StringBuilder();
		try {
			paramNode = mapper.readTree(param);
			JsonNode transNode = convertQueryJson(paramNode);
			JsonNode columnNode = transNode.get(JsonKeyConstant.KEY_COLUMNS);
			for (int i = 0; i < columnNode.size(); i++) {
				// -TODO 查询列为function的
				columnStr.append(columnNode.get(i).get(JsonKeyConstant.KEY_CNAME));
				if (i < columnNode.size() - 1) {
					columnStr.append(",");
				}
			}
			// 假设调orm接口
			rtnResult = ormDao.getData(modelId, columnStr.toString().split(","), mapper.writeValueAsString(transNode),
					sessionManager.getTenantId(request));
		} catch (JsonProcessingException e1) {
			logger.error(e1.getMessage(), e1);
		} catch (IOException e1) {
			logger.error(e1.getMessage(), e1);
		} catch (Exception e1) {
			logger.error(e1.getMessage(), e1);
		}
		return rtnResult;
	}

	public String addModelData(HttpServletRequest request, String modelId, String body) throws MaoCommonException {
		// -TODO 判断调orm接口或其它接口
		List<Map<String, String>> recordsMapList = new ArrayList<Map<String, String>>();
		String rtnResult = "false";
		try {
			JsonNode bodyNode = convertAddJson(mapper.readTree(body));
			JsonNode recordsNode = bodyNode.get(JsonKeyConstant.KEY_COLUMNS);
			for (JsonNode node : recordsNode) {
				Map<String, String> map = new HashMap<String, String>();
				Map<String, Object> nodeMap = mapper.readValue(mapper.writeValueAsString(node), Map.class);
				Iterator<Map.Entry<String, Object>> iterator = nodeMap.entrySet().iterator();
				while (iterator.hasNext()) {
					String key = iterator.next().getKey().toString();
					String value = node.get(key).asText();
					map.put(key, value);
				}
				recordsMapList.add(map);
			}
			rtnResult = ormDao.addListWithReturnPK(modelId, recordsMapList, sessionManager.getTenantId(request));
		} catch (JsonProcessingException e) {
			logger.error(e.getMessage(), e);
			throw new MaoCommonException(e.getLocalizedMessage(),e);
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
			throw new MaoCommonException(e.getLocalizedMessage(),e);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			throw new MaoCommonException(e.getLocalizedMessage(),e);
		}
		return rtnResult;
	}

	public String update(HttpServletRequest request, String modelId, String body) throws MaoCommonException {
		boolean rtnResult = false;
		try {
			JsonNode bodyNode = convertUpdateJson(mapper.readTree(body));
			rtnResult = ormDao.updateMulti(modelId, mapper.writeValueAsString(bodyNode), sessionManager.getTenantId(request));
		} catch (MaoCommonException e) {
			logger.error(e.getMessage(), e);
			throw new MaoCommonException(e.getLocalizedMessage(),e);
		} catch (JsonProcessingException e) {
			logger.error(e.getMessage(), e);
			throw new MaoCommonException(e.getLocalizedMessage(),e);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			throw new MaoCommonException(e.getLocalizedMessage(),e);
		}
		return String.valueOf(rtnResult);
	}

	public String deleteModelData(HttpServletRequest request, String modelId, String param) throws MaoCommonException {
		// -TODO 判断调orm接口或其它接口
		boolean rtnResult = false;
		ObjectNode paramNode = mapper.createObjectNode();
		try {
			paramNode.set("condition",
					convertConditionJson(mapper.readTree(param).get(JsonKeyConstant.KEY_CONDITION)));
			// 假设调orm接口
			rtnResult = ormDao.delete(modelId, mapper.writeValueAsString(paramNode), sessionManager.getTenantId(request));
		} catch (JsonProcessingException e) {
			logger.error(e.getMessage(), e);
			throw new MaoCommonException(e.getLocalizedMessage(),e);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			throw new MaoCommonException(e.getLocalizedMessage(),e);
		}
		return String.valueOf(rtnResult);
	}

	/**
	 * 转换将新增的json
	 * 
	 * @param addNode
	 * @return
	 * @throws JsonProcessingException
	 */
	private ObjectNode convertAddJson(JsonNode addNode) throws JsonProcessingException {
		ObjectNode rtnNode = mapper.createObjectNode();
		rtnNode.set(JsonKeyConstant.KEY_COLUMNS, addNode.get(JsonKeyConstant.KEY_RECORDS));
		return rtnNode;
	}

	private ObjectNode convertUpdateJson(JsonNode updateNode) {
		ObjectNode rtnNode = mapper.createObjectNode();
		ArrayNode arrayNode = mapper.createArrayNode();
		for (JsonNode node : updateNode.get(JsonKeyConstant.KEY_RECORDS)) {
			ObjectNode itemNode = mapper.createObjectNode();
			if (node.has(JsonKeyConstant.KEY_FIELDS)) {
				itemNode.set(JsonKeyConstant.KEY_COLUMNS, node.get(JsonKeyConstant.KEY_FIELDS));
			}
			if (node.has(JsonKeyConstant.KEY_CONDITION)) {
				itemNode.set(JsonKeyConstant.KEY_CONDITION,
						convertConditionJson(node.get(JsonKeyConstant.KEY_CONDITION)));
			}
			arrayNode.add(itemNode);
		}
		rtnNode.set(JsonKeyConstant.KEY_RECORDS, arrayNode);
		return rtnNode;
	}

	/**
	 * 转换查询的json 兼容原有的orm结构
	 * 
	 * @param queryNode
	 * @return
	 * @throws IOException
	 */
	private ObjectNode convertQueryJson(JsonNode queryNode) throws IOException {
		ObjectNode rtnNode = mapper.createObjectNode();
		// 关键字：fields,isDistinct,orders,groups,condition
		Map<String, Object> nodeMap = convertJson2Map(queryNode);
		Iterator<Map.Entry<String, Object>> iterator = nodeMap.entrySet().iterator();
		while (iterator.hasNext()) {
			String key = iterator.next().getKey();
			if (key.equalsIgnoreCase(JsonKeyConstant.KEY_FIELDS)) {
				rtnNode.set(JsonKeyConstant.KEY_COLUMNS, convertField2Cname((ArrayList) nodeMap.get(key)));
			} else if (key.equalsIgnoreCase(JsonKeyConstant.KEY_CONDITION)) {
				JsonNode node = mapper.readTree(nodeMap.get(key).toString());
				if (node.size() > 0) {
					rtnNode.put(JsonKeyConstant.KEY_CONDITION,
							mapper.writeValueAsString(convertConditionJson(node)));
				} else {
					rtnNode.set(JsonKeyConstant.KEY_CONDITION, node);
				}
			} else { // orders,groups , isDistinct 节点名字没变
				rtnNode.set(key, queryNode.get(key));
			}
		}
		return rtnNode;
	}

	private ArrayNode convertField2Cname(ArrayList node) {
		ArrayNode rtnArrayNode = mapper.createArrayNode();
		for (Object itemNode : node) {
			ObjectNode itemFieldNode = mapper.createObjectNode();
			itemFieldNode.put(JsonKeyConstant.KEY_CNAME,
					((Map) itemNode).get(JsonKeyConstant.KEY_FIELD).toString());
			rtnArrayNode.add(itemFieldNode);
		}
		return rtnArrayNode;
	}

	/**
	 * 将condition 的jsonNode 转成原有orm格式
	 * 
	 * @param inputNode
	 * @return
	 */
	private ObjectNode convertConditionJson(JsonNode conditioNode) {
		ArrayNode rtnArrayNode = mapper.createArrayNode();
		ObjectNode rtnNode = mapper.createObjectNode();
		Map<String, Object> nodeMap = convertJson2Map(conditioNode);
		Iterator<Map.Entry<String, Object>> iterator = nodeMap.entrySet().iterator();
		String key = iterator.next().getKey();
		if (conditioNode.has(JsonKeyConstant.CONDITION_AND.toUpperCase())
				|| conditioNode.has(JsonKeyConstant.CONDITION_OR.toUpperCase())
				|| conditioNode.has(JsonKeyConstant.CONDITION_AND)
				|| conditioNode.has(JsonKeyConstant.CONDITION_OR)) {
			for (JsonNode node : conditioNode.get(key)) {
				Map<String, Object> itemMap = convertJson2Map(node);
				Iterator<Map.Entry<String, Object>> itemIterator = itemMap.entrySet().iterator();
				ObjectNode itemNode = mapper.createObjectNode();
				while (itemIterator.hasNext()) {
					String itemKey = itemIterator.next().getKey();
					if (itemKey.equalsIgnoreCase(JsonKeyConstant.CONDITION_AND)
							|| itemKey.equalsIgnoreCase(JsonKeyConstant.CONDITION_OR)) {
						itemNode = convertConditionJson(node);
					} else {
						if (itemKey.equalsIgnoreCase(JsonKeyConstant.KEY_FIELD)) {
							itemNode.set(JsonKeyConstant.KEY_CNAME, node.get(itemKey));
						} else if (itemKey.equalsIgnoreCase(JsonKeyConstant.KEY_COMPARISON)) {
							itemNode.set(JsonKeyConstant.KEY_COMPARE, node.get(itemKey));
						} else {
							itemNode.set(itemKey, node.get(itemKey));
						}
					}
				}
				rtnArrayNode.add(itemNode);
			}
			rtnNode.set(key, rtnArrayNode);
		} else {
			rtnNode = convertConditionItemJson(conditioNode);
		}
		return rtnNode;
	}

	private ObjectNode convertConditionItemJson(JsonNode conditioNode) {
		ObjectNode rtnNode = mapper.createObjectNode();
		Map<String, Object> itemMap = convertJson2Map(conditioNode);
		Iterator<Map.Entry<String, Object>> itemIterator = itemMap.entrySet().iterator();
		while (itemIterator.hasNext()) {
			String itemKey = itemIterator.next().getKey();
			if (itemKey.equalsIgnoreCase(JsonKeyConstant.KEY_FIELD)) {
				rtnNode.set(JsonKeyConstant.KEY_CNAME, conditioNode.get(itemKey));
			} else if (itemKey.equalsIgnoreCase(JsonKeyConstant.KEY_COMPARISON)) {
				rtnNode.set(JsonKeyConstant.KEY_COMPARE, conditioNode.get(itemKey));
			} else {
				rtnNode.set(itemKey, conditioNode.get(itemKey));
			}
		}
		return rtnNode;
	}

	private Map<String, Object> convertJson2Map(Object node) {
		Map<String, Object> nodeMap = null;
		try {
			nodeMap = mapper.readValue(mapper.writeValueAsString(node), Map.class);
		} catch (JsonParseException e) {
			logger.error(e.getMessage(), e);
		} catch (JsonMappingException e) {
			logger.error(e.getMessage(), e);
		} catch (JsonProcessingException e) {
			logger.error(e.getMessage(), e);
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		}
		return nodeMap;
	}

	public static void main(String[] args) {
		ModelDataService service = new ModelDataService();
		ObjectMapper mapper = new ObjectMapper();
		JsonNode node;
		try {
			// condition --两个条件
			// node =
			// mapper.readTree("{\"AND\":[{\"field\":\"name\",\"value\":\"Frank\",\"comparison\":\"=\"},{\"field\":\"age\",\"value\":\"13\",\"comparison\":\"=\"}]}");
			// condition --嵌套条件
			// node =
			// mapper.readTree("{\"AND\":[{\"cname\":\"age\",\"value\":\"13\",\"compare\":\"=\"},{\"OR\":[{\"cname\":\"name\",\"value\":\"ABC\",\"compare\":\"=\"},{\"cname\":\"age\",\"value\":\"15\",\"compare\":\">\"}]}]}");
			// ObjectNode node2 = service.convertConditionJson(node);

			// 查询
			// node = mapper.readTree(
			// "{\"fields\":[{\"field\":\"id\"},{\"field\":\"name\"},{\"field\":\"age\"}],\"condition\":{},\"orders\":[{\"field\":\"name\",
			// \"order\":\"desc\"},{\"field\":\"age\",
			// \"order\":\"asc\"}],\"isDistinct\":\"true\"}");
			// ObjectNode node2 = service.convertQueryJson(node);

			// 新增
			node = mapper.readTree(
					"{\"records\":[{\"id\":\"5\",\"name\":\"Eric\",\"age\":\"12\"},{\"id\":\"6\",\"name\":\"Frank\",\"age\":\"13\"},{\"id\":\"7\",\"name\":\"Fendy\",\"age\":\"13\"}]}");
			ObjectNode node2 = service.convertAddJson(node);

			// 修改
			// node =
			// mapper.readTree("{\"records\":[{\"fields\":{\"name\":\"Annie\"},\"condition\":{\"field\":\"id\",\"comparison\":\"=\",\"value\":\"1\"}},{\"fields\":{\"name\":\"Bee\"},\"condition\":{\"and\":[{\"field\":\"id\",\"comparison\":\"=\",\"value\":\"2\"},{\"field\":\"age\",\"comparison\":\"=\",\"value\":\"13\"}]}}]}");
			// ObjectNode node2 = service.convertUpdateJson(node);

			//System.out.println(node2);
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
		} catch (IOException e) {
			// TODO Auto-generated catch block
		}
	}
}