package com.zte.mao.workbench.service.model;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.workbench.controller.DataModelController;
import com.zte.mao.workbench.entity.model.DataModelBaisc;
import com.zte.mao.workbench.entity.model.DataModelGroup;
import com.zte.mao.workbench.entity.model.DataModelInfo;
import com.zte.mao.workbench.entity.model.DataModelItem;
import com.zte.mao.workbench.service.DataModelService;
import com.zte.mao.workbench.service.orm.DataModelFormService;
import com.zte.mao.workbench.service.orm.DataModelGroupService;
import com.zte.mao.workbench.service.orm.DataModelInfoService;
import com.zte.mao.workbench.service.orm.DataModelItemService;

@Service
public class ModelUpdateService {
    private static final Logger logger = Logger.getLogger(DataModelInfoService.class);
    @Resource
    private DataModelInfoService dataModelInfoService;
    @Resource
    private DataModelItemService dataModelItemService;
    @Resource
    private DataModelGroupService dataModelGroupService;
    @Resource
    private DataModelFormService dataModelFormService;
    @Resource
    private DataModelService dataModelService;
    @Resource
    private ModelValidateService modelValidateService;

    public CommonResponse update(DataModelInfo modelInfo) {
        try {
            modelValidateService.validateDataModelInfo("update", modelInfo);
            DataModelBaisc newBaisc = modelInfo.getBaisc();
            DataModelBaisc oldBasic = dataModelInfoService.getQueryBasic("update",newBaisc.getId());
            modelValidateService.validateUpdateTime(newBaisc, oldBasic);

            oldBasic.setName(newBaisc.getName());
            oldBasic.setDescription(newBaisc.getDescription());
            oldBasic.setUpdateTime(new Date());
            oldBasic.setPackageId(newBaisc.getPackageId());

            String modelId = oldBasic.getId();
            List<DataModelItem> itemList = modelInfo.getItemList();
            List<DataModelGroup> groupList = modelInfo.getGroupList();
            String tenantId = DataModelController.getTenantId();
            dataModelInfoService.updateDataModel(oldBasic);
            dataModelGroupService.updateGroups(modelId, groupList, tenantId);
            dataModelItemService.updateDataModelItems(modelId, itemList, tenantId);
            dataModelService.createBindTable(tenantId, itemList, oldBasic);
            return new CommonResponse(CommonResponse.STATUS_SUCCESS, CommonResponse.MESSAGE_SUCCESS);
        } catch (MaoCommonException e) {
            logger.error(e.getMessage(), e);
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getLocalizedMessage());
        }
    }


   

}
