package com.zte.mao.workbench.entity.model.template;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

import org.apache.commons.collections.CollectionUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class DataModelTemplate {
    private LinkedHashMap<String, String> groupMap = new LinkedHashMap<String, String>();
    private List<DataModelTemplateLayout> layoutList = new ArrayList<DataModelTemplateLayout>();

    public DataModelTemplate(List<DataModelTemplateLayout> layoutList, LinkedHashMap<String, String> groupMap) {
        this.groupMap.put("<分组编号，必须为大于1的整数>", "<分组名称>");
        setGroupMap(groupMap);
        setLayoutList(layoutList);
    }

    public List<DataModelTemplateLayout> getLayoutList() {
        return layoutList;
    }

    public void setLayoutList(List<DataModelTemplateLayout> layoutList) {
        if (CollectionUtils.isNotEmpty(layoutList)) {
            this.layoutList.addAll(layoutList);
        } else {
            this.layoutList.add(new DataModelTemplateLayout());
        }
    }

    public LinkedHashMap<String, String> getGroupMap() {
        return groupMap;
    }

    public void setGroupMap(LinkedHashMap<String, String> groupMap) {
        this.groupMap.putAll(groupMap);
    }
    
    public static void main(String[] args) {
        ObjectMapper om = new ObjectMapper();
        LinkedHashMap<String, String> groupMap =  new LinkedHashMap<String, String>();
        groupMap.put("1", "a");
        DataModelTemplate template = new DataModelTemplate(null,  groupMap);
        try {
            System.out.println(om.writeValueAsString(template));
        } catch (JsonProcessingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}
