package com.zte.ums.bcp.orm.tabledata.controller;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseStatus;
import com.zte.ums.bcp.orm.tabledata.service.MultiTableService;
import org.apache.log4j.Logger;

@Controller
@RequestMapping("/orm")
public class MultiTableController {
	private static final Logger dMsg = Logger.getLogger(MultiTableController.class.getName());

    @Resource(name = "multiTableService")
    private MultiTableService multiTableService;

	/**
	 * 
	 * @param definitionName
	 * @param param
	 * @return
	 */
	@RequestMapping(value = "/multitable/runtime/object-instances/{definitionName}", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> queryInstance(
			@PathVariable("definitionName") String definitionName,
			@RequestParam("param") String param) {
		Map<String, Object> resultMap = new LinkedHashMap<String, Object>();
		try {
			resultMap = multiTableService.queryInstance(definitionName, param);
			resultMap.put("status", ResponseStatus.STATUS_SUCCESS);
			resultMap.put("message", "success");
			return resultMap;
		} catch (JsonProcessingException e) {
			resultMap.put("message", e.getMessage());
		} catch (IOException e) {
			resultMap.put("message", e.getMessage());
		} catch (OrmException e) {
			resultMap.put("message", e.getMessage());
		}
		resultMap.put("status", ResponseStatus.STATUS_FAIL);
		return resultMap;
	}

	/**
	 * 
	 * @param definitionName
	 * @param jsonData
	 * @return
	 */
	@RequestMapping(value = "/multitable/runtime/object-instances/{definitionName}", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> insertInstance(
			@PathVariable("definitionName") String definitionName,
			@RequestBody String jsonData) {
		Map<String, Object> resultMap = new LinkedHashMap<String, Object>();
		try {
			resultMap = multiTableService.insertInstance(definitionName,
					jsonData);
			resultMap.put("status", ResponseStatus.STATUS_SUCCESS);
			resultMap.put("message", "success");
			return resultMap;
		} catch (JsonProcessingException e) {
			resultMap.put("message", e.getMessage());
		} catch (IOException e) {
			resultMap.put("message", e.getMessage());
		} catch (OrmException e) {
			resultMap.put("message", e.getMessage());
		}
		resultMap.put("status", ResponseStatus.STATUS_FAIL);
		return resultMap;
	}

	/**
	 * 
	 * @param definitionName
	 * @param param
	 * @return
	 */
	@RequestMapping(value = "/multitable/runtime/object-instances/{definitionName}/{param}", method = RequestMethod.DELETE)
	@ResponseBody
	public Map<String, Object> deleteInstance(
			@PathVariable("definitionName") String definitionName,
			@PathVariable("param") String param) {
		Map<String, Object> resultMap = new LinkedHashMap<String, Object>();
		try {
			multiTableService.deleteInstance(definitionName, param);
			resultMap.put("status", ResponseStatus.STATUS_SUCCESS);
			resultMap.put("message", "success");
			return resultMap;
		} catch (JsonProcessingException e) {
			resultMap.put("message", e.getMessage());
		} catch (IOException e) {
			resultMap.put("message", e.getMessage());
		} catch (OrmException e) {
			resultMap.put("message", e.getMessage());
		}
		resultMap.put("status", ResponseStatus.STATUS_FAIL);
		return resultMap;
	}

	/**
	 * 
	 * @param definitionName
	 * @param param
	 * @param jsonData
	 * @return
	 */
	@RequestMapping(value = "/multitable/runtime/object-instances/{definitionName}/{param}", method = RequestMethod.PUT)
	@ResponseBody
	public Map<String, Object> updateInstance(
			@PathVariable("definitionName") String definitionName,
			@PathVariable("param") String param, @RequestBody String jsonData) {
		Map<String, Object> resultMap = new LinkedHashMap<String, Object>();
		try {
			resultMap = multiTableService.updateInstance(definitionName, param,
					jsonData);
			resultMap.put("status", ResponseStatus.STATUS_SUCCESS);
			resultMap.put("message", "success");
			return resultMap;
		} catch (JsonProcessingException e) {
			resultMap.put("message", e.getMessage());
		} catch (IOException e) {
			resultMap.put("message", e.getMessage());
		} catch (OrmException e) {
			resultMap.put("message", e.getMessage());
		}
		resultMap.put("status", ResponseStatus.STATUS_FAIL);
		return resultMap;
	}

	/**
	 * 
	 * @param definitionName
	 * @param param
	 * @return
	 */
	@RequestMapping(value = "/multitable/runtime/object-instances-array/{definitionName}", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> queryInstanceArray(
			@PathVariable("definitionName") String definitionName,
			@RequestParam("param") String param,
			@RequestParam("limit") String limit) {
		Map<String, Object> resultMap = new LinkedHashMap<String, Object>();
		try {
			List<Map<String, Object>> objectArray = multiTableService
					.queryInstanceArray(definitionName, param, limit);
			resultMap.put("status", ResponseStatus.STATUS_SUCCESS);
			resultMap.put("message", "success");
			resultMap.put("objectArray", objectArray);
			return resultMap;
		} catch (JsonProcessingException e) {
			resultMap.put("message", e.getMessage());
		} catch (OrmException e) {
			resultMap.put("message", e.getMessage());
		} catch (IOException e) {
			resultMap.put("message", e.getMessage());
		}
		resultMap.put("status", ResponseStatus.STATUS_FAIL);
		return resultMap;
	}
}
