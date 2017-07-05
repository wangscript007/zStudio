package com.zte.mao.workbench.service.model;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.workbench.entity.model.DataModelBaisc;
import com.zte.mao.workbench.entity.model.DataModelForm;
import com.zte.mao.workbench.entity.model.DataModelGroup;
import com.zte.mao.workbench.entity.model.DataModelInfo;
import com.zte.mao.workbench.entity.model.DataModelItem;
import com.zte.mao.workbench.service.orm.DataModelFormService;
import com.zte.mao.workbench.service.orm.DataModelInfoService;

@Service
public class ModelValidateService {
    private static final Logger logger = Logger.getLogger(ModelValidateService.class);
    private static final String ID_REGEX = "[A-Za-z0-9_]+";
    @Resource
    private OrmDao ormDao;
    @Resource
    private DataModelFormService dataModelFormService;
    @Resource
    private DataModelInfoService dataModelInfoService;

    public void validateDataModelInfo(String validateType, DataModelInfo modelInfo) throws MaoCommonException {
        if (modelInfo == null) {
            throw new MaoCommonException("无有效的数据模型信息。DataModelInfo is null.");
        }
        validateBase(modelInfo.getBaisc());
        validateModelItems(modelInfo.getItemList());
        validateModelGroup(modelInfo.getGroupList());
    }

    private void validateBase(DataModelBaisc dataModelBaisc) throws MaoCommonException {
        if (dataModelBaisc == null) {
            throw new MaoCommonException("无有效的数据模型基本信息。DataModelBaisc is null.");
        }
        validateModelId(dataModelBaisc.getId());
        validateModelName(dataModelBaisc.getName());
        validateModelScene(dataModelBaisc.getScene());
        validateBindTable(dataModelBaisc.getBindTable());
    }

    private void validateModelId(String modelId) throws MaoCommonException {
        if (StringUtils.isBlank(modelId)) {
            throw new MaoCommonException("未设置数据模型编号。");
        }
        if (modelId.matches(ID_REGEX) == false) {
            throw new MaoCommonException("数据模型编号只能包含字母，数字和下划线。");
        }
    }

    private void validateModelName(String modelName) throws MaoCommonException {
        if (StringUtils.isBlank(modelName)) {
            throw new MaoCommonException("未设置数据模型名称。");
        }
    }

    private void validateModelScene(int scene) throws MaoCommonException {
        switch (scene) {
        case DataModelBaisc.ENUM_SCENE_EXIST_TABLE:
        case DataModelBaisc.ENUM_SCENE_NEW_TABLE:
        case DataModelBaisc.ENUM_SCENE_SCRIPT:
            break;
        default:
            throw new MaoCommonException("数据模型场景设置非法。scene:" + scene);
        }
    }

    private void validateBindTable(String bindTable) throws MaoCommonException {
        if (StringUtils.isBlank(bindTable)) {
            throw new MaoCommonException("未绑定数据表。");
        }
    }

    private void validateModelItems(List<DataModelItem> dataModelItems) throws MaoCommonException {
        if (CollectionUtils.isEmpty(dataModelItems)) {
            throw new MaoCommonException("无有效的数据项信息。dataModelItems is empty.");
        }
        Set<String> modelItemIdSet = new HashSet<String>();
        Set<String> modelItemNameSet = new HashSet<String>();
        for (DataModelItem dataModelItem : dataModelItems) {
            String modelItemId = dataModelItem.getId();
            if (modelItemIdSet.contains(modelItemId)) {
                throw new MaoCommonException("数据项编号重复：" + modelItemId);
            }
            modelItemIdSet.add(modelItemId);
            String modelItemName = dataModelItem.getName();
            if (modelItemNameSet.contains(modelItemName)) {
                throw new MaoCommonException("数据项名称重复：" + modelItemName);
            }
            modelItemNameSet.add(modelItemName);
            validateModelItem(dataModelItem);
        }
    }

    private void validateModelItem(DataModelItem dataModelItem) throws MaoCommonException {
        String modelItemId = dataModelItem.getId();
        validateModelItemId(modelItemId);
        String modelItemName = dataModelItem.getName();
        validateModelItemName(modelItemName, modelItemId);
        validateModelItemLayout(dataModelItem.getLayout());
        int modelItemType = dataModelItem.getType();
        validateModelItemType(modelItemType);
        validateModelItemComponentType(modelItemType, dataModelItem.getComponentType(), modelItemName);
    }

    private void validateModelGroup(List<DataModelGroup> groupList) throws MaoCommonException {
        if (CollectionUtils.isEmpty(groupList)) {
            throw new MaoCommonException("无有效的数据项面板分组信息。dataModelGroupList is empty.");
        }
        Set<String> groupIdSet = new HashSet<String>();
        for (DataModelGroup group : groupList) {
            String groupId = group.getId();
            if (groupIdSet.contains(groupId)) {
                throw new MaoCommonException("数据项面板分组编号重复：" + groupId);
            }
            if (StringUtils.isBlank(group.getName())) {
                throw new MaoCommonException("数据项面板分组名称未设置。groupId:" + groupId);
            }
            groupIdSet.add(groupId);
        }
    }

    private void validateModelItemComponentType(int modelItemType, int componentType, String modelItemName)
            throws MaoCommonException {
        int[] componentTypes = DataModelItem.getEffectiveComponentTypeByItemType(modelItemType);
        for (int i = 0; i < componentTypes.length; i++) {
            if (componentType == componentTypes[i]) {
                return;
            }
        }
        throw new MaoCommonException("数据项类型和控件类型不匹配。数据项名称:" + modelItemName);
    }

    private void validateModelItemType(int modelItemType) throws MaoCommonException {
        int[] componentTypes = DataModelItem.getEffectiveComponentTypeByItemType(modelItemType);
        if (componentTypes == null) {
            throw new MaoCommonException("数据项类型设置非法。modelItemType:" + modelItemType);
        }
    }

    private void validateModelItemLayout(int layout) throws MaoCommonException {
        switch (layout) {
        case DataModelItem.ENUM_LAYOUT_EXCLUSIVE_HALF_LINE:
        case DataModelItem.ENUM_LAYOUT_EXCLUSIVE_LINE:
        case DataModelItem.ENUM_LAYOUT_HALF_LINE_CAN_HAVE_OTHER:
            break;
        default:
            throw new MaoCommonException("数据项布局类型设置非法。layout:" + layout);
        }
    }

    private void validateModelItemId(String modelItemId) throws MaoCommonException {
        if (StringUtils.isBlank(modelItemId)) {
            throw new MaoCommonException("未设置数据项编号。");
        }
        if (modelItemId.matches(ID_REGEX) == false) {
            throw new MaoCommonException("数据项编号只能包含字母，数字和下划线。");
        }
    }

    private void validateModelItemName(String modelItemName, String modelItemId) throws MaoCommonException {
        if (StringUtils.isBlank(modelItemName)) {
            throw new MaoCommonException("未设置数据项名称。modelItemId:" + modelItemId);
        }
    }

    public void validateModel(String validateType, String modelIdStr) throws MaoCommonException {
        try {
            if (StringUtils.isBlank(validateType) || StringUtils.isBlank(modelIdStr)) {
                throw new MaoCommonException("验证类型和数据模型ID字段不能为空。");
            }

            ObjectMapper mapper = new ObjectMapper();
            List<String> modelIdList = mapper.readValue(modelIdStr, List.class);
            if (CollectionUtils.isNotEmpty(modelIdList)) {
                if ("update".equals(validateType)) {
                    DataModelBaisc dataBasic = dataModelInfoService.getQueryBasic(validateType, modelIdList.get(0));
                    validateReference(dataBasic, modelIdList);
                } else if ("delete".equals(validateType)) {
                    for (String modelId : modelIdList) {
                        DataModelBaisc dataBasic = dataModelInfoService.getQueryBasic(validateType, modelId);
                        if (null != dataBasic) {
                            validateReference(dataBasic, modelIdList);
                        }
                    }
                }
            }
        } catch (JsonParseException e) {
            logger.error(e.getMessage(), e);
            throw new MaoCommonException(e.getLocalizedMessage());
        } catch (JsonMappingException e) {
            logger.error(e.getMessage(), e);
            throw new MaoCommonException(e.getLocalizedMessage());
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
            throw new MaoCommonException(e.getLocalizedMessage());
        }
    }

    public void validateUpdateTime(DataModelBaisc newBaisc, DataModelBaisc oldBasic) throws MaoCommonException {
        if (DateUtils.isSameInstant(newBaisc.getUpdateTime(), oldBasic.getUpdateTime()) == false) {
            throw new MaoCommonException("数据模型已更新，请重新获取后再操作。模型编号：" + newBaisc.getBindTable() + ",模型名称：" + newBaisc.getName());
        }
    }

    public boolean validateTableIsExist(DataModelBaisc baisc, String tenantId) throws MaoCommonException{
        String tableNmaes = ormDao.getTableNames(tenantId);
        if(StringUtils.isNotBlank(tableNmaes)){
            String [] tableNameStrings = tableNmaes.split(" ");
            for(String tablename : tableNameStrings){
                if(baisc.getBindTable().equals(tablename)){
                    return false;
                }
            }
        }
        return true;
    }

    private void validateReference(DataModelBaisc basic,List<String> modelIds) throws MaoCommonException {
        Set<DataModelForm> modelFormSet = dataModelFormService.getDataModelGeneralInfos(basic.getBindTable());
        for (DataModelForm dataModelForm : modelFormSet) {
            if (basic.getScene() != DataModelBaisc.ENUM_SCENE_EXIST_TABLE) {
                if (StringUtils.equals(dataModelForm.getModelId(), basic.getId()) == false) {
                    if(!modelIds.contains(dataModelForm.getModelId())){
                        throw new MaoCommonException("数据模型"+basic.getName()+"新建的表"+basic.getBindTable()
                                +"已被其它数据模型所引用。模型编号：" + dataModelForm.getModelId() 
                                +",模型名称："+ dataModelForm.getModelName());
                    }
                }
            }
            if (StringUtils.isBlank(dataModelForm.getFormId())) {
                continue;
            }
            if (StringUtils.equals(dataModelForm.getModelId(), basic.getId())) {
                throw new MaoCommonException("该数据模型"+basic.getName()+"已被表单所使用。表单编号：" 
                        + dataModelForm.getFormId() + ",表单名称：" + dataModelForm.getFormName());
            }
        }
    }

    public void validateDataModelInfo(DataModelInfo modelInfo, String tenantId) throws MaoCommonException {
        DataModelBaisc dataModelBaisc = modelInfo.getBaisc();
        List<DataModelItem> dataModelItems = modelInfo.getItemList();
        String modelId = dataModelBaisc.getId();
        if (StringUtils.isBlank(modelId)) {
            throw new MaoCommonException("数据模型ID不能为空。");
        }
        for (DataModelItem dataModelItem : dataModelItems) {
            if (StringUtils.equals(modelId, dataModelItem.getModelId()) == false) {
                throw new MaoCommonException("数据模型信息ID和数据项ID不匹配。");
            }
        }
    }

}
