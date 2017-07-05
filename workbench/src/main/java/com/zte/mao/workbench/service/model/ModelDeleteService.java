package com.zte.mao.workbench.service.model;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.Resource;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.workbench.controller.DataModelController;
import com.zte.mao.workbench.entity.model.DataModelBaisc;
import com.zte.mao.workbench.service.SQLExecute;
import com.zte.mao.workbench.service.SQLPackageService;
import com.zte.mao.workbench.service.orm.DataModelGroupService;
import com.zte.mao.workbench.service.orm.DataModelInfoService;
import com.zte.mao.workbench.service.orm.DataModelItemService;

@Service
public class ModelDeleteService {
	private static final Logger logger = Logger.getLogger(DataModelInfoService.class);

	@Resource
	private SQLPackageService sQLPackageService;

	@Resource
	private SQLExecute sQLExecute;

	@Resource
	private DataModelInfoService dataModelInfoService;

	@Resource
	private DataModelItemService dataModelItemService;
	@Resource
	private DataModelGroupService dataModelGroupService;

	@SuppressWarnings("unchecked")
	public CommonResponse deleteDataModel(String modelIdStr) {
		try {
			if(StringUtils.isNotBlank(modelIdStr)){
				ObjectMapper mapper = new ObjectMapper();
				Set<String> modelIds = mapper.readValue(modelIdStr, Set.class);
				List<String> modelSQLs = new ArrayList<String>();
				String tenantId = DataModelController.getTenantId();
				Set<DataModelBaisc> dataModelBaiscs = dataModelInfoService.getDataModelInfos(modelIds, tenantId);
				for(DataModelBaisc dataBaisc: dataModelBaiscs){
					if(null != dataBaisc){
						if(DataModelBaisc.ENUM_SCENE_EXIST_TABLE != dataBaisc.getScene()){
							if (DataModelBaisc.ENUM_SCENE_SCRIPT == dataBaisc.getScene() && checkTableOrView(dataBaisc.getScript())){
								modelSQLs.add(sQLPackageService.packageUseDataBaseSql(tenantId));
								modelSQLs.add(sQLPackageService.packageDropViewSql(dataBaisc.getBindTable(), tenantId));
							}else{
								modelSQLs.add(sQLPackageService.packageUseDataBaseSql(tenantId));
								modelSQLs.add(sQLPackageService.packageDropTableSql(dataBaisc.getBindTable(), tenantId));
							}
						}
					} 
				}

				if(CollectionUtils.isNotEmpty(modelSQLs)){
					sQLExecute.executeMultipleSql(modelSQLs);
				}
                if (!dataModelGroupService.deleteGroupsByModelIds(modelIds, tenantId)) {
                    return new CommonResponse(CommonResponse.STATUS_FAIL, "删除数据模型面板分组错误！");
                }
				if(!dataModelItemService.deleteDataModelItemsByModelIds(modelIds,tenantId)){
					return new CommonResponse(CommonResponse.STATUS_FAIL, "删除数据模型数据项错误！");
				}
				if(!dataModelInfoService.deleteDataModelInfosByModelIds(modelIds,tenantId)){
					return new CommonResponse(CommonResponse.STATUS_FAIL, "删除数据模型基本信息错误！");
				}
			}
		} catch (MaoCommonException e) {
			logger.error(e.getMessage(), e);
			return new CommonResponse(CommonResponse.STATUS_FAIL, e.getLocalizedMessage());
		} catch (JsonParseException e) {
			logger.error(e.getMessage(), e);
			return new CommonResponse(CommonResponse.STATUS_FAIL, e.getLocalizedMessage());
		} catch (JsonMappingException e) {
			logger.error(e.getMessage(), e);
			return new CommonResponse(CommonResponse.STATUS_FAIL, e.getLocalizedMessage());
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
			return new CommonResponse(CommonResponse.STATUS_FAIL, e.getLocalizedMessage());
		}
		return new CommonResponse(CommonResponse.STATUS_SUCCESS, CommonResponse.MESSAGE_SUCCESS);
	}

	private boolean checkTableOrView(String script) {
		String filterString = "";  
        if (script!=null) {  
            Pattern p = Pattern.compile("\\s*|\t|\r|\n");  
            Matcher m = p.matcher(script);  
            filterString = m.replaceAll("");
            String tempString = filterString.substring(6, 11).toUpperCase();
            if(tempString.indexOf("VIEW") == 0){
            	return true;
            }
        }  
		return false;
	}
}
