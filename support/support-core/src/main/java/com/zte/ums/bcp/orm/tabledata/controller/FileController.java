package com.zte.ums.bcp.orm.tabledata.controller;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.constant.AddRecordJsonKeyConstant;
import com.zte.ums.bcp.orm.framework.request.entry.RequestFileRecord;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseStatus;
import com.zte.ums.bcp.orm.tabledata.service.FileRecordService;
import org.apache.log4j.Logger;

@Controller
@RequestMapping("/orm")
public class FileController {
	private static final Logger dMsg = Logger.getLogger(
			AddController.class.getName());
	@Resource
	private FileRecordService fileRecordService;

	@RequestMapping(value = "/table/upload/{tableName}", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> upload(
			@PathVariable("tableName") String tableName,
			@RequestParam("file") MultipartFile[] files,
			HttpServletRequest request) throws IOException {
		RequestFileRecord record = new RequestFileRecord();
		record.setCollectionName(tableName);
		record.setDbName(request
				.getParameter(AddRecordJsonKeyConstant.DATABASE));
		Map<String, Object> result = new LinkedHashMap<String, Object>();
		try {
			result.put("status", ResponseStatus.STATUS_SUCCESS);
			result.put("message", "success");
			result.put("data", fileRecordService.upload(record, files));
		} catch (OrmException e) {
			dMsg.error(e.getMessage(), e.fillInStackTrace());
			result.put("status", ResponseStatus.STATUS_FAIL);
			result.put("message", e.getMessage());
		}
		return result;
	}

	@RequestMapping(value = "/table/download/{tableName}/{fileId}", method = RequestMethod.GET)
	@ResponseBody
	public void download(@PathVariable("tableName") String tableName,
			@PathVariable("fileId") String fileId, HttpServletRequest request,
			HttpServletResponse response) {
		RequestFileRecord record = new RequestFileRecord();
		record.setCollectionName(tableName);
		record.setFileId(fileId);
		record.setDbName(request
				.getParameter(AddRecordJsonKeyConstant.DATABASE));
		try {
			fileRecordService.download(record, response);
		} catch (OrmException e) {
			dMsg.error(e.getMessage(), e.fillInStackTrace());
		}
	}
}
