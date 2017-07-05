package com.zte.mao.workbench.service.model;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.response.CommonResponse;
import com.zte.mao.workbench.controller.DataModelController;
import com.zte.mao.workbench.entity.model.DataModelBaisc;
import com.zte.mao.workbench.entity.model.DataModelInfo;
import com.zte.mao.workbench.entity.model.DataModelItem;
import com.zte.mao.workbench.service.DataModelService;
import com.zte.mao.workbench.service.SQLExecute;
import com.zte.mao.workbench.service.SQLPackageService;
import com.zte.mao.workbench.service.orm.DataModelGroupService;
import com.zte.mao.workbench.service.orm.DataModelInfoService;
import com.zte.mao.workbench.service.orm.DataModelItemService;

@Service
public class ModelCreateService {
	private static final Logger logger = Logger.getLogger(DataModelInfoService.class);
	@Resource
	private DataModelInfoService dataModelInfoService;
	@Resource
	private DataModelItemService dataModelItemService;
	@Resource
	private DataModelGroupService dataModelGroupService;
	@Resource
	private DataModelService dataModelService;
	@Resource
	private ModelValidateService modelValidateService;
	@Resource
	private SQLExecute sqlExecute;
	@Resource
	private SQLPackageService sqlPackageService;

    public CommonResponse create(DataModelInfo modelInfo, int source) {
        // TODO 对于createBindTable的场景，先进行一次表名判断，如果表名已经存在，则不允许创建。
        try {
            modelValidateService.validateDataModelInfo("create", modelInfo);
            DataModelBaisc baisc = modelInfo.getBaisc();
            String tenantId = DataModelController.getTenantId();
            List<DataModelItem> itemList = modelInfo.getItemList();
            if (baisc.getScene() == DataModelBaisc.ENUM_SCENE_EXIST_TABLE) {
                if (modelValidateService.validateTableIsExist(baisc, tenantId) == true) {
                    return new CommonResponse(CommonResponse.STATUS_FAIL, "tableNotExist");
                }
            } else if (baisc.getScene() == DataModelBaisc.ENUM_SCENE_NEW_TABLE) {
                if (modelValidateService.validateTableIsExist(baisc, tenantId) == false) {
                    return new CommonResponse(CommonResponse.STATUS_FAIL, "数据模型表名已经存在！请勿重复！");
                }
                dataModelService.createBindTable(tenantId, itemList, baisc);
            } else if (source == 1 && StringUtils.isNotBlank(baisc.getScript())) {
                List<String> sqls = new ArrayList<String>();
                sqls.add(sqlPackageService.packageUseDataBaseSql(tenantId));
                sqls.add(sqlPackageService.packageDropTableSql(baisc.getBindTable(), tenantId));
                sqls.add(baisc.getScript());
                sqlExecute.executeMultipleSql(sqls);
                dataModelService.createBindTable(tenantId, itemList, baisc);
            }
            dataModelInfoService.addDataModel(baisc);
            dataModelItemService.addDataModelItems(itemList, tenantId);
            dataModelGroupService.addGroups(modelInfo.getGroupList());
            return new CommonResponse(CommonResponse.STATUS_SUCCESS, CommonResponse.MESSAGE_SUCCESS);
        } catch (MaoCommonException e) {
            logger.error(e.getMessage(), e);
            return new CommonResponse(CommonResponse.STATUS_FAIL, e.getLocalizedMessage());
        }
    }
}
