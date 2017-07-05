package com.zte.mao.bpm.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zte.mao.bpm.service.ModelDataService;
import com.zte.mao.common.exception.MaoCommonException;

@RestController
@RequestMapping("/model/api/")
public class ModelController {
	
	@Resource
	ModelDataService modelDataService;
	/**
	 * 查询数据
	 * 
	 * @param request
	 * @param modelId
	 * @return
	 */
	@RequestMapping(value = "{modelId}", method = RequestMethod.GET)
	public String queryModel(HttpServletRequest request, @PathVariable(value = "modelId") String modelId,
			@RequestParam(value = "param") String param) {
		return modelDataService.queryModel(request, modelId, param);
	}

	@RequestMapping(value = "{modelId}", method = RequestMethod.POST)
	public String addModelData(HttpServletRequest request, @PathVariable("modelId") String modelId, @RequestBody String data) throws MaoCommonException {
		return modelDataService.addModelData(request, modelId, data);
	}

	@RequestMapping(value = "{modelId}", method = RequestMethod.PUT)
	public String updateModelData(HttpServletRequest request, @PathVariable("modelId") String modelId, @RequestBody String data) throws MaoCommonException {
		return modelDataService.update(request, modelId, data);
	}

	@RequestMapping(value = "{modelId}", method = RequestMethod.DELETE)
	public String deleteModelData(HttpServletRequest request, @PathVariable("modelId") String modelId,
			@RequestParam(value = "param") String param) throws MaoCommonException {
		return modelDataService.deleteModelData(request, modelId, param);
	}

}
