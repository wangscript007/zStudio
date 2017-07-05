package com.zte.mao.workbench.service.orm;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.workbench.entity.model.DataViewAssociated;
import com.zte.mao.workbench.entity.model.DataViewAssociatedConditon;
import com.zte.mao.workbench.entity.model.DataViewAssociatedConditonPo;
import com.zte.mao.workbench.entity.model.DataViewAssociatedPo;
import com.zte.mao.workbench.entity.model.DataViewBase;
import com.zte.mao.workbench.entity.model.DataViewInfo;
import com.zte.mao.workbench.entity.model.DataViewItem;
import com.zte.mao.workbench.entity.model.DataViewItemPo;

@Service
public class DataViewInfoService {

    @Resource
    private DataViewBaseService dataViewBaseService;
    @Resource
    private DataViewAssociatedService dataViewAssociatedService;
    @Resource
    private DataViewAssociatedConditonService dataViewAssociatedConditonService;
    @Resource
    private DataViewItemService dataViewItemService;
    
    public List<DataViewInfo> getDataViewInfos(Set<String> ViewIds, String tenantId) throws MaoCommonException {
        List<DataViewBase> dataViewBases = dataViewBaseService.getDataViewBases(ViewIds, tenantId);
        List<DataViewAssociatedPo> dataViewAssociatedPos = dataViewAssociatedService.getDataViewAssociatedPos(ViewIds, tenantId);
        List<DataViewItemPo> dataViewItemPos = dataViewItemService.getDataViewItemPos(ViewIds, tenantId);
        List<DataViewAssociatedConditonPo> dataViewAssociatedConditonPos = dataViewAssociatedConditonService.getDataViewAssociatedConditonPos(ViewIds, tenantId);
        
        List<DataViewInfo> dataViewInfos = new ArrayList<DataViewInfo>();
        for (DataViewBase dataViewBase: dataViewBases) {
            DataViewInfo dataViewInfo = new DataViewInfo();
            dataViewInfo.setDataViewBase(dataViewBase);
            dataViewInfo.setDataViewAssociateds(getDataViewAssociateds(dataViewAssociatedPos, dataViewBase.getId(), dataViewAssociatedConditonPos));
            dataViewInfo.setDataViewItems(getDataViewItemsByViewId(dataViewItemPos, dataViewBase.getId()));
            
            dataViewInfos.add(dataViewInfo);
        }
        
        return dataViewInfos;
    }
    
    private List<DataViewItem> getDataViewItemsByViewId(List<DataViewItemPo> dataViewItemPos, String viewId) {
        List<DataViewItem> dataViewItems = new ArrayList<DataViewItem>();
        for (DataViewItemPo dataViewItemPo: dataViewItemPos) {
            if (viewId.equals(dataViewItemPo.getViewId())) {
                DataViewItem dataViewItem = new DataViewItem();
                dataViewItem.setAlisaName(dataViewItemPo.getAlisaName());
                dataViewItem.setId(dataViewItemPo.getId());
                dataViewItem.setTableName(dataViewItemPo.getTableName());
                dataViewItems.add(dataViewItem);
            }
        }
        return dataViewItems;
    }
    
    public List<DataViewAssociated> getDataViewAssociateds(List<DataViewAssociatedPo> dataViewAssociatedPos, String viewId, List<DataViewAssociatedConditonPo> dataViewAssociatedConditonPos) throws MaoCommonException {
        List<DataViewAssociated> dataViewAssociateds = new ArrayList<DataViewAssociated>();
        
        for (int i = 0, len = dataViewAssociatedPos.size(); i < len; i++) {
            DataViewAssociatedPo dataViewAssociatedPo = dataViewAssociatedPos.get(i);
            List<DataViewAssociatedConditon> dAssociatedConditons = new ArrayList<DataViewAssociatedConditon>();
            for (int j = 0, lenConditon = dataViewAssociatedConditonPos.size(); j < lenConditon; j++) {
                DataViewAssociatedConditonPo dataViewAssociatedConditonPo = dataViewAssociatedConditonPos.get(j);
                if (dataViewAssociatedPo.getId().equals(dataViewAssociatedConditonPo.getAssociatedId())
                        && dataViewAssociatedPo.getViewId().equals(dataViewAssociatedConditonPo.getViewId())) {
                    dAssociatedConditons.add(getDataViewAssociatedConditon(dataViewAssociatedConditonPo));
                }
            }
            DataViewAssociated dataViewAssociated = getDataViewAssociated(dataViewAssociatedPo);
            dataViewAssociated.setDataViewAssociatedConditons(dAssociatedConditons);
            dataViewAssociateds.add(dataViewAssociated);
        }
        return dataViewAssociateds;
    }
    
    private DataViewAssociated getDataViewAssociated(DataViewAssociatedPo dataViewAssociatedPo) {
        DataViewAssociated dataViewAssociated = new DataViewAssociated();
        dataViewAssociated.setAssociatedTableName(dataViewAssociatedPo.getAssociatedTableName());
        dataViewAssociated.setAssociatedType(dataViewAssociatedPo.getAssociatedType());
        return dataViewAssociated;
    }
    
    private DataViewAssociatedConditon getDataViewAssociatedConditon(DataViewAssociatedConditonPo dataViewAssociatedConditonPo) {
        DataViewAssociatedConditon dataViewAssociatedConditon = new DataViewAssociatedConditon();
        dataViewAssociatedConditon.setChildColumnName(dataViewAssociatedConditonPo.getChildColumnName());
        dataViewAssociatedConditon.setChildTableName(dataViewAssociatedConditonPo.getChildTableName());
        dataViewAssociatedConditon.setComparison(dataViewAssociatedConditonPo.getComparison());
        dataViewAssociatedConditon.setMainColumnName(dataViewAssociatedConditonPo.getMainColumnName());
        dataViewAssociatedConditon.setMainTableName(dataViewAssociatedConditonPo.getMainTableName());
        return dataViewAssociatedConditon;
    }
}
