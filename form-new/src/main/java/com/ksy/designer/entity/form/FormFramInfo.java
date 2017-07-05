package com.ksy.designer.entity.form;

import com.ksy.designer.entity.FrameInfo;

public class FormFramInfo extends FrameInfo {
    private ModelInfo modelInfo;// 模型数据

    public ModelInfo getModelInfo() {
        return modelInfo;
    }

    public FormFramInfo setModelInfo(ModelInfo modelInfo) {
        this.modelInfo = modelInfo;
        return this;
    }
}
