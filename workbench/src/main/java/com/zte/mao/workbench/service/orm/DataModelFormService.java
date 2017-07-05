package com.zte.mao.workbench.service.orm;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.base.OrmQueryCondition;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.workbench.controller.DataModelController;
import com.zte.mao.workbench.def.VDataModelForm;
import com.zte.mao.workbench.entity.model.DataModelForm;

@Service
public class DataModelFormService {
    @Resource
    private OrmDao ormDao;

    public Set<DataModelForm> getDataModelGeneralInfos(String bindTable) throws MaoCommonException {
        List<OrmQueryCondition> conditionlist = new ArrayList<OrmQueryCondition>();
        if (StringUtils.isNotBlank(bindTable)) {
            conditionlist.add(new OrmQueryCondition(
                    VDataModelForm.COL_NAME_BIND_TABLE_NAME,
                    OrmQueryCondition.COMPARE_EQUALS,
                    bindTable));
        }
        return getDataModelFormsByConditions(conditionlist, DataModelController.getTenantId());
    }

    private Set<DataModelForm> getDataModelFormsByConditions(List<OrmQueryCondition> conditionlist, String tenantId)
            throws MaoCommonException {
        if (conditionlist == null) {
            conditionlist = new ArrayList<OrmQueryCondition>();
        }
        List<Map<String, String>> resultMap = ormDao.getData(VDataModelForm.NAME, VDataModelForm.COLUMNS, conditionlist, "and", tenantId);
        Set<DataModelForm> modelFormSet = new HashSet<DataModelForm>();
        for (Map<String, String> result : resultMap) {
            DataModelForm modelForm = parseResult(result);
            modelFormSet.add(modelForm);
        }
        return modelFormSet;
    }
    
    public Set<DataModelForm> getDataModelFormsByAppId(String appId, String tenantId) throws MaoCommonException {
        List<OrmQueryCondition> conditionlist = new ArrayList<OrmQueryCondition>();
        if (StringUtils.isNotBlank(appId)) {
            conditionlist.add(new OrmQueryCondition(
                    VDataModelForm.COL_NAME_APP_ID,
                    OrmQueryCondition.COMPARE_EQUALS,
                    appId));
        }
        return getDataModelFormsByConditions(conditionlist, tenantId);
    }

    private DataModelForm parseResult(Map<String, String> result) {
        DataModelForm modelForm = new DataModelForm();
        modelForm.setFormId(result.get(VDataModelForm.COL_NAME_FORM_ID));
        modelForm.setFormName(result.get(VDataModelForm.COL_NAME_FORM_NAME));
        modelForm.setModelId(result.get(VDataModelForm.COL_NAME_MODEL_ID));
        modelForm.setModelName(result.get(VDataModelForm.COL_NAME_MODEL_NAME));
        modelForm.setBindTable(result.get(VDataModelForm.COL_NAME_BIND_TABLE_NAME));
        return modelForm;
    }
}
