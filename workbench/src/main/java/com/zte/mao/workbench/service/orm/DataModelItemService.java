package com.zte.mao.workbench.service.orm;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.zte.mao.common.base.OrmDao;
import com.zte.mao.common.base.OrmQueryCondition;
import com.zte.mao.common.base.OrmQueryOrder;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.common.service.OrmBasicService;
import com.zte.mao.workbench.controller.DataModelController;
import com.zte.mao.workbench.def.TDataModelItem;
import com.zte.mao.workbench.entity.model.DataModelItem;

@Service
public class DataModelItemService extends OrmBasicService<DataModelItem> {
	private static final String[] COLUMNS = new String[] {
	    TDataModelItem.COL_NAME_ID,
	    TDataModelItem.COL_NAME_NAME,
	    TDataModelItem.COL_NAME_MODEL_ID,
	    TDataModelItem.COL_NAME_TYPE,
        TDataModelItem.COL_NAME_IS_NULL,
        TDataModelItem.COL_NAME_LENGTH,
        TDataModelItem.COL_NAME_DECIMAL,
        TDataModelItem.COL_NAME_DEFAULT,
        TDataModelItem.COL_NAME_COLUMN_KEY,
        TDataModelItem.COL_NAME_INDEX,
        TDataModelItem.COL_NAME_COMPONENT_TYPE,
	    TDataModelItem.COL_NAME_UI_VISIBLE,
	    TDataModelItem.COL_NAME_LAYOUT,
	    TDataModelItem.COL_NAME_DATA_BLOCK
	    };

	@Resource
	private OrmDao ormDao;

	public Map<String, List<DataModelItem>> getDataModelItems(Collection<String> modelIdColl) throws MaoCommonException {
        List<OrmQueryCondition> conditionlist = new ArrayList<OrmQueryCondition>();
        if (CollectionUtils.isNotEmpty(modelIdColl)) {
            conditionlist.add(new OrmQueryCondition(
                    TDataModelItem.COL_NAME_MODEL_ID,
                    OrmQueryCondition.COMPARE_IN,
                    modelIdColl));
        }
        List<OrmQueryOrder> orders = new ArrayList<OrmQueryOrder>();
        orders.add(new OrmQueryOrder(TDataModelItem.COL_NAME_INDEX, OrmQueryOrder.ORDER_ASC));
        List<Map<String, String>> resultMap = ormDao.getData(TDataModelItem.NAME, COLUMNS, conditionlist, "and", orders, DataModelController.getTenantId());
        return result2Map(resultMap, TDataModelItem.COL_NAME_MODEL_ID);
    }

	@Override
    protected DataModelItem getRow(Map<String, String> result) {
        DataModelItem itemInfo = new DataModelItem();
        String componentTypeObj = result.get(TDataModelItem.COL_NAME_COMPONENT_TYPE);
        String uiVisible = result.get(TDataModelItem.COL_NAME_UI_VISIBLE);
        String layout = result.get(TDataModelItem.COL_NAME_LAYOUT);
        String dataBlock = result.get(TDataModelItem.COL_NAME_DATA_BLOCK);
        itemInfo.setId(result.get(TDataModelItem.COL_NAME_ID))
                .setName(result.get(TDataModelItem.COL_NAME_NAME))
                .setModelId(result.get(TDataModelItem.COL_NAME_MODEL_ID))
                .setType(Integer.parseInt(result.get(TDataModelItem.COL_NAME_TYPE)))
                .setNull(Integer.parseInt(result.get(TDataModelItem.COL_NAME_IS_NULL)) == 0)
                .setLenth(Integer.parseInt(result.get(TDataModelItem.COL_NAME_LENGTH)))
                .setDecimal(Integer.parseInt(result.get(TDataModelItem.COL_NAME_DECIMAL)))
                .setDefaultValue(result.get(TDataModelItem.COL_NAME_DEFAULT))
                .setColumnKey(Integer.parseInt(result.get(TDataModelItem.COL_NAME_COLUMN_KEY)));
        if (StringUtils.isNotBlank(componentTypeObj)) {
            itemInfo.setComponentType(Integer.parseInt(componentTypeObj));
        }
        if (StringUtils.isNotBlank(uiVisible)) {
            itemInfo.setUiVisible(Integer.parseInt(uiVisible) == 1);
        }
        if (StringUtils.isNotBlank(layout)) {
            itemInfo.setLayout(Integer.parseInt(layout));
        }
        if (StringUtils.isNotBlank(dataBlock)) {
            itemInfo.setDataBlock(Integer.parseInt(dataBlock));
        }
        return itemInfo;
    }
	
	public Set<DataModelItem> getDataModelItems(Collection<String> modelIds, String tenantId) throws MaoCommonException {
        List<OrmQueryCondition> conditionlist = new ArrayList<OrmQueryCondition>();
        if (CollectionUtils.isNotEmpty(modelIds) && StringUtils.isNotBlank(tenantId)) {
            conditionlist.add(new OrmQueryCondition(
                    TDataModelItem.COL_NAME_MODEL_ID,
                    OrmQueryCondition.COMPARE_IN,
                    modelIds));
        }
        List<Map<String, String>> resultMap = ormDao.getData(TDataModelItem.NAME, COLUMNS, conditionlist, "and", tenantId);
        return result2Set(resultMap);
    }

	private boolean deleteDataModelItemsByConditions(List<OrmQueryCondition> ormQueryConditions, String tenantId) throws MaoCommonException {
        return ormDao.delete(TDataModelItem.NAME, ormQueryConditions, tenantId);
    }
	
	public boolean deleteDataModelItemsByModelId(String modelId, String tenantId) throws MaoCommonException {
        Set<String> modelIds = new HashSet<String>();
        if (StringUtils.isNotBlank(modelId)) {
            modelIds.add(modelId);
        }
        return this.deleteDataModelItemsByModelIds(modelIds, tenantId);
    }
	
	public boolean deleteDataModelItemsByModelIds(Set<String> modelIds, String tenantId) throws MaoCommonException {
        List<OrmQueryCondition> ormQueryConditions = new ArrayList<OrmQueryCondition>();
        if (CollectionUtils.isNotEmpty(modelIds)) {
            OrmQueryCondition ormQueryCondition = new OrmQueryCondition();
            ormQueryCondition.setCname(TDataModelItem.COL_NAME_MODEL_ID)
                             .setCompare(OrmQueryCondition.COMPARE_IN)
                             .setValues(modelIds);
            ormQueryConditions.add(ormQueryCondition);
        }
        return this.deleteDataModelItemsByConditions(ormQueryConditions, tenantId);
    }
	
	public boolean addDataModelItem(DataModelItem dataModelItem,
            String tenantId) throws MaoCommonException {
        if (dataModelItem == null) {
            return false;
        }
        return ormDao.add(TDataModelItem.NAME, dataModelItem.toMap(dataModelItem), tenantId);
    }
    
    public boolean addDataModelItems(List<DataModelItem> dataModelItems,
            String tenantId) throws MaoCommonException {
        if (CollectionUtils.isEmpty(dataModelItems)) {
            return false;
        }
        
        List<Map<String, String>> data = new ArrayList<Map<String,String>>();
        for (DataModelItem dataModelItem: dataModelItems) {
            data.add(dataModelItem.toMap(dataModelItem));
        }
        return ormDao.addList(TDataModelItem.NAME, data, tenantId);
    }

    public void updateDataModelItems(String modelId, List<DataModelItem> dataModelItems,
            String tenantId) throws MaoCommonException {
        OrmQueryCondition condition = new OrmQueryCondition(
                TDataModelItem.COL_NAME_MODEL_ID,
                OrmQueryCondition.COMPARE_EQUALS,
                modelId);
        ormDao.delete(TDataModelItem.NAME, condition, tenantId);
        addDataModelItems(dataModelItems, tenantId);
    }
    
}
