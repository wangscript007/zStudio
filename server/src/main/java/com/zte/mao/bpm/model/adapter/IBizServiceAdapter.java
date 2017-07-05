package com.zte.mao.bpm.model.adapter;

import java.util.Map;
import java.util.Set;

import com.zte.mao.bpm.entity.model.ModelDataSourceInfo;
import com.zte.mao.bpm.entity.model.ModelMethodBizServiceMethod;
import com.zte.mao.bpm.entity.model.ModelMethodParameter;
import com.zte.mao.common.exception.MaoCommonException;

public interface IBizServiceAdapter {
    int ENUM_ADAPTER_TYPE_ORM_INNER = ModelDataSourceInfo.ENUM_ADAPTER_TYPE_ORM_INNER;
    int ENUM_ADAPTER_TYPE_ORM_OUTER = ModelDataSourceInfo.ENUM_ADAPTER_TYPE_ORM_OUTER;
    int ENUM_ADAPTER_TYPE_JDBC = ModelDataSourceInfo.ENUM_ADAPTER_TYPE_JDBC;

    Object invokeBizMethod(
            Map<String, Object> parameterMap,
            ModelDataSourceInfo dsInfo,
            ModelMethodBizServiceMethod method,
            Set<ModelMethodParameter> modelMethodParameterSet) throws MaoCommonException, Exception;

    int getAdapterType();
}
