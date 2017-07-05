package com.zte.ums.bcp.orm.tabledata.controller;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseStatus;
import com.zte.ums.bcp.orm.tabledata.service.MultiTableModelService;
import org.apache.log4j.Logger;

@Controller
@RequestMapping("/orm")
public class MultiTableModelController {

	private static final Logger dMsg = Logger.getLogger(MultiTableModelController.class.getName());

    @Resource(name = "multiTableModelService")
    private MultiTableModelService multiTableModelService;

	/**
	 * 
	 * @return
	 */
	@RequestMapping(value = "/multitable/repository/object-definitions/names", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getDefinitionNames() {
		Map<String, Object> resultMap;
		try {
			resultMap = multiTableModelService.getDefinitionNames();
			resultMap.put("status", ResponseStatus.STATUS_SUCCESS);
			resultMap.put("message", "success");
			return resultMap;
		} catch (OrmException e) {
			Map<String, Object> map = new LinkedHashMap<String, Object>();
			map.put("status", ResponseStatus.STATUS_FAIL);
			map.put("message", e.getMessage());
			return map;
		}
	}

	/**
	 * 
	 * @param definitionName
	 * @return
	 * @throws OrmException
	 */
	@RequestMapping(value = "/multitable/repository/object-definitions/model/{definitionName}", method = RequestMethod.GET)
	@ResponseBody
	public JsonNode getDefinitionModel(
			@PathVariable("definitionName") String definitionName) {
		ObjectNode modelNode = null;
		ObjectNode errorNode = new ObjectMapper().createObjectNode();
		errorNode.put("status", ResponseStatus.STATUS_FAIL);
		try {
			modelNode = multiTableModelService
					.getDefinitionModel(definitionName);
			return modelNode;
		} catch (OrmException e) {
			errorNode.put("message", e.getMessage());
		}
		errorNode.put("message", "没有找到对应的模型");
		return errorNode;
	}

	/**
	 * 
	 * @param definitionName
	 * @param jsonData
	 * @return
	 */
	@RequestMapping(value = "/multitable/repository/object-definitions/model", method = RequestMethod.POST)
	@ResponseBody
	public JsonNode insertInstance(@RequestBody String jsonData) {
		JsonNode errorNode = null;
		try {
			multiTableModelService.insertModel(jsonData);
		} catch (JsonProcessingException e) {
			dMsg.error(e.getMessage(), e);
			errorNode = getExceptionNode(e);
		} catch (IOException e) {
			dMsg.error(e.getMessage(), e);
			errorNode = getExceptionNode(e);
		} catch (OrmException e) {
			dMsg.error(e.getMessage(), e);
			errorNode = getExceptionNode(e);
		}
		if (errorNode != null) {
			return errorNode;
		} else {
			ObjectNode returnNode = new ObjectMapper().createObjectNode();
			returnNode.put("status", ResponseStatus.STATUS_SUCCESS);
			returnNode.put("message", "success");
			return returnNode;
		}
	}

	/**
	 * 
	 * @param definitionName
	 * @param param
	 * @return
	 */
	@RequestMapping(value = "/multitable/repository/object-definitions/model/{definitionName}", method = RequestMethod.DELETE)
	@ResponseBody
	public JsonNode deleteInstance(
			@PathVariable("definitionName") String definitionName) {
		JsonNode errorNode = null;
		try {
			multiTableModelService.deleteModel(definitionName);
		} catch (OrmException e) {
			dMsg.error(e.getMessage(), e);
			errorNode = getExceptionNode(e);
		}
		if (errorNode != null) {
			return errorNode;
		} else {
			ObjectNode returnNode = new ObjectMapper().createObjectNode();
			returnNode.put("status", ResponseStatus.STATUS_SUCCESS);
			returnNode.put("message", "success");
			return returnNode;
		}
	}

	/**
	 * 
	 * @param param
	 * @param jsonData
	 * @return
	 */
	@RequestMapping(value = "/multitable/repository/object-definitions/model", method = RequestMethod.PUT)
	@ResponseBody
	public JsonNode updateInstance(@RequestBody String jsonData) {
		JsonNode errorNode = null;
		try {
			multiTableModelService.updateModel(jsonData);
		} catch (JsonProcessingException e) {
			dMsg.error(e.getMessage(), e);
			errorNode = getExceptionNode(e);
		} catch (IOException e) {
			dMsg.error(e.getMessage(), e);
			errorNode = getExceptionNode(e);
		} catch (OrmException e) {
			dMsg.error(e.getMessage(), e);
			errorNode = getExceptionNode(e);
		}
		if (errorNode != null) {
			return errorNode;
		} else {
			ObjectNode returnNode = new ObjectMapper().createObjectNode();
			returnNode.put("status", ResponseStatus.STATUS_SUCCESS);
			returnNode.put("message", "success");
			return returnNode;
		}
	}

	private JsonNode getExceptionNode(Exception e) {
		ObjectNode errorNode = new ObjectMapper().createObjectNode();
		errorNode.put("status", ResponseStatus.STATUS_FAIL);
		errorNode.put("message", e.getMessage());
		return errorNode;
	}
}
