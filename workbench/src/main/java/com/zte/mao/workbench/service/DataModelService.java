package com.zte.mao.workbench.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.common.response.DataResponse;
import com.zte.mao.common.service.CommonEnvService;
import com.zte.mao.common.util.FileUtil;
import com.zte.mao.workbench.controller.DataModelController;
import com.zte.mao.workbench.entity.model.DataModelBaisc;
import com.zte.mao.workbench.entity.model.DataModelGroup;
import com.zte.mao.workbench.entity.model.DataModelInfo;
import com.zte.mao.workbench.entity.model.DataModelItem;
import com.zte.mao.workbench.entity.model.template.DataModelTemplate;
import com.zte.mao.workbench.entity.model.template.DataModelTemplateLayout;
import com.zte.mao.workbench.response.model.DataModelDefinition;
import com.zte.mao.workbench.response.model.DataModelMetadata;
import com.zte.mao.workbench.service.model.ModelExportService;
import com.zte.mao.workbench.service.model.ModelValidateService;
import com.zte.mao.workbench.service.orm.DataModelGroupService;
import com.zte.mao.workbench.service.orm.DataModelInfoService;
import com.zte.mao.workbench.service.orm.DataModelItemService;

@Service
public class DataModelService {
    private static final Logger logger = Logger.getLogger(DataModelService.class);
    @Resource
    private DataModelInfoService dataModelInfoService;
    @Resource
    private DataModelItemService dataModelItemService;
    @Resource
    private DataModelGroupService dataModelGroupService;
    @Resource
    private ModelValidateService modelValidateService;
    @Resource
    private ModelExportService modelExportService;
    @Resource
    private CommonEnvService commonEnvService;
    @Resource
    private SQLPackageService sqlPackageService;
    @Resource
    private SQLExecute sqlLExecute;

    public List<DataModelDefinition> queryDataModelDefinition(String processPackageId, String modelId_in) throws MaoCommonException {
        Set<DataModelBaisc> dataModelInfoList = dataModelInfoService.getDataModelGeneralInfos(processPackageId, modelId_in);
        Set<String> modelIdSet = new HashSet<String>();
        for (Iterator<DataModelBaisc> iterator = dataModelInfoList.iterator(); iterator.hasNext();) {
            modelIdSet.add(iterator.next().getId());
        }
        Map<String, List<DataModelItem>> itemMap = dataModelItemService.getDataModelItems(modelIdSet);
        Map<String, List<DataModelGroup>> itemGroupMap = dataModelGroupService.getGroupMap(modelIdSet);

        List<DataModelDefinition> list = new ArrayList<DataModelDefinition>();
        for (Iterator<DataModelBaisc> iterator = dataModelInfoList.iterator(); iterator.hasNext();) {
            DataModelBaisc dataModelInfo = iterator.next();
            String modelId = dataModelInfo.getId();
            Collection<DataModelItem> itemColl = itemMap.get(modelId);
            if (CollectionUtils.isEmpty(itemColl)) {
                logger.warn("There is no items definined on the model.Model ID:" + modelId);
                continue;
            }
            List<DataModelMetadata> metadataList = new ArrayList<DataModelMetadata>();
            for (Iterator<DataModelItem> iterator2 = itemColl.iterator(); iterator2.hasNext();) {
                DataModelItem item = iterator2.next();
                metadataList.add(new DataModelMetadata(item));
            }
            List<DataModelGroup> groupList = itemGroupMap.get(modelId);
            Map<String, String> groupMap = new LinkedHashMap<String, String>();
            if (CollectionUtils.isNotEmpty(groupList)) {
                for (DataModelGroup dataModelGroup : groupList) {
                    groupMap.put(dataModelGroup.getId(), dataModelGroup.getName());
                }
            }
            list.add(new DataModelDefinition(modelId, dataModelInfo.getName(), dataModelInfo.getBindTable(), metadataList, groupMap));
        }
        return list;
    }

    public List<Map<String, String>> getConfigFileList() throws MaoCommonException {
        String tenantId = DataModelController.getTenantId();
        StringBuilder filePathBuilder = new StringBuilder();
        filePathBuilder.append(commonEnvService.getTenantRuntimePath(tenantId))
                       .append(File.separator)
                       .append("model");
        File directory = new File(filePathBuilder.toString());
        if (directory.exists() == false) {
            return new ArrayList<Map<String, String>>();
        }
        List<Map<String, String>> returnList = new ArrayList<Map<String, String>>();
        for (File file : directory.listFiles()) {
            Map<String, String> map = new HashMap<String, String>();
            map.put("path", file.getPath().replace(commonEnvService.getAppHomePath(), "").replace("\\", "/"));
            map.put("name", file.getName());
            returnList.add(map);
        }
        return returnList;
    }
    
    public CommonResponse uploadConfigFiles(MultipartFile[] files) {
        if (ArrayUtils.isEmpty(files)) {
            return new CommonResponse(CommonResponse.STATUS_FAIL, "上传文件不能为空。");
        }
        
        try {
            String originalFilename = files[0].getOriginalFilename();
            if (originalFilename.toLowerCase().endsWith(".json") == false) {
                return new CommonResponse(CommonResponse.STATUS_FAIL, "请选择已“.json”结尾的文件上传。");
            }
            String tenantId = DataModelController.getTenantId();
            StringBuilder filePathBuilder = new StringBuilder();
            filePathBuilder.append(commonEnvService.getTenantRuntimePath(tenantId))
                           .append(File.separator)
                           .append("model")
                           .append(File.separator)
                           .append(originalFilename);
            files[0].transferTo(FileUtil.createFileOrMultistageDirectoryOfFile(filePathBuilder.toString()));
            Map<String, String> data = new HashMap<String, String>();
            data.put("name", originalFilename);
            return new DataResponse(CommonResponse.STATUS_SUCCESS, CommonResponse.MESSAGE_SUCCESS, data);
        } catch (IllegalStateException e) {
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        } catch (IOException e) {
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getMessage());
        }
    }
    
    public CommonResponse downloadLayoutTemplate(DataModelInfo modelInfo) {
        try {
            modelValidateService.validateDataModelInfo("create", modelInfo);

            List<DataModelTemplateLayout> templateLayoutList = new ArrayList<DataModelTemplateLayout>();
            Collection<DataModelItem> modelItemSet = modelInfo.getItemList();
            boolean addTips = true;
            for (DataModelItem modelItem : modelItemSet) {
                templateLayoutList.add(new DataModelTemplateLayout(modelItem, addTips));
                addTips = false;
            }

            List<DataModelGroup> dataModelGroupSet = modelInfo.getGroupList();
            LinkedHashMap<String, String> groupMap = new LinkedHashMap<String, String>();
            for (DataModelGroup dataModelGroup : dataModelGroupSet) {
                groupMap.put(dataModelGroup.getId(), dataModelGroup.getName());
            }
            DataModelTemplate modelTemplate = new DataModelTemplate(templateLayoutList, groupMap);
            String path = modelExportService.exportModelItemGroups(modelTemplate, modelInfo.getBaisc().getId());
            return new DataResponse(path);
        } catch (MaoCommonException e) {
            logger.error(e.getMessage(), e);
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getLocalizedMessage());
        }
    }
    
    public void createBindTable(String tenantId, List<DataModelItem> itemList, DataModelBaisc baisc)
            throws MaoCommonException {
        if (baisc.getScene() != DataModelBaisc.ENUM_SCENE_NEW_TABLE) {
            return;
        }
        String bindTable = baisc.getBindTable();
        List<String> sqls = new ArrayList<String>();
        sqls.add(sqlPackageService.packageUseDataBaseSql(tenantId));
        sqls.add(sqlPackageService.packageDropTableSql(bindTable, tenantId));
        sqls.add(sqlPackageService.getCreateTableSql(itemList, bindTable, tenantId));
        sqlLExecute.executeMultipleSql(sqls);
    }
}
