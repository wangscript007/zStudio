package com.zte.mao.common.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.zte.mao.common.exception.MaoCommonException;

public abstract class OrmBasicService<T> {
    protected List<T> result2List(List<Map<String, String>> resultMap) throws MaoCommonException {
        List<T> itemList = new ArrayList<T>();
        for (Map<String, String> result : resultMap) {
            itemList.add(getRow(result));
        }
        return itemList;
    }

    protected Set<T> result2Set(List<Map<String, String>> resultMap) throws MaoCommonException {
        Set<T> itemSet = new HashSet<T>();
        for (Map<String, String> result : resultMap) {
            itemSet.add(getRow(result));
        }
        return itemSet;
    }

    protected Map<String,List<T>> result2Map(List<Map<String, String>> resultMap, String columnName) throws MaoCommonException {
        Map<String,List<T>> groupMap = new HashMap<String, List<T>>();
        List<T> groupList;
        for (Map<String, String> result : resultMap) {
            String modelId = result.get(columnName);
            if (groupMap.containsKey(modelId)) {
                groupList = groupMap.get(modelId);
            } else {
                groupList = new ArrayList<T>();
            }
            groupList.add(getRow(result));
            groupMap.put(modelId, groupList);
        }
        return groupMap;
    }

    protected abstract T getRow(Map<String, String> result) throws MaoCommonException;
}
