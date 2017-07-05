package com.zte.mao.workbench.service.orm;

import java.util.ArrayList;
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
import com.zte.mao.workbench.def.TDataViewItem;
import com.zte.mao.workbench.entity.model.DataViewItemPo;

@Service
public class DataViewItemService {
    private static final String[] COLUMNS = new String[] {
        TDataViewItem.COL_NAME_ALISA_NAME,
        TDataViewItem.COL_NAME_ID,
        TDataViewItem.COL_NAME_TABLE_NAME,
        TDataViewItem.COL_NAME_VIEW_ID
        };

    @Resource
    private OrmDao ormDao;

    private DataViewItemPo getDataViewItemPo(Map<String, String> result) {
        DataViewItemPo itemInfo = new DataViewItemPo();
        itemInfo.setAlisaName(result.get(TDataViewItem.COL_NAME_ALISA_NAME));
        itemInfo.setId(result.get(TDataViewItem.COL_NAME_ID));
        itemInfo.setTableName(result.get(TDataViewItem.COL_NAME_TABLE_NAME));
        itemInfo.setViewId(result.get(TDataViewItem.COL_NAME_VIEW_ID));
        return itemInfo;
    }
    
    public List<DataViewItemPo> getDataViewItemPos(Set<String> ViewIds, String tenantId) throws MaoCommonException {
        List<OrmQueryCondition> conditionlist = new ArrayList<OrmQueryCondition>();
        if (CollectionUtils.isNotEmpty(ViewIds) && StringUtils.isNotBlank(tenantId)) {
            conditionlist.add(new OrmQueryCondition(
                    TDataViewItem.COL_NAME_VIEW_ID,
                    OrmQueryCondition.COMPARE_IN,
                    ViewIds));
        }
        List<OrmQueryOrder> orders = new ArrayList<OrmQueryOrder>();
        orders.add(new OrmQueryOrder(TDataViewItem.COL_NAME_INDEX, OrmQueryOrder.ORDER_ASC));
        List<Map<String, String>> resultMap = ormDao.getData(TDataViewItem.NAME, COLUMNS, conditionlist, "and", orders, tenantId);
        List<DataViewItemPo> itemList = new ArrayList<DataViewItemPo>();
        for (Map<String, String> result : resultMap) {
            itemList.add(getDataViewItemPo(result));
        }
        return itemList;
    }

}
