package com.ksy.designer.entity;

import java.util.List;

public class FrameInfo {
    private List<IComponent> component;// 组件名称、分组编号、属性配置对象
    private IDrawingBoard drawingBoard;// 配置文本
    private II18n i18n;
    private ISystemConfig systemConfig;// extends Properties
    private List<IComponentGroup> componentGroupList;

    public List<IComponent> getComponent() {
        return component;
    }

    public FrameInfo setComponent(List<IComponent> component) {
        this.component = component;
        return this;
    }

    public IDrawingBoard getDrawingBoard() {
        return drawingBoard;
    }

    public FrameInfo setDrawingBoard(IDrawingBoard drawingBoard) {
        this.drawingBoard = drawingBoard;
        return this;
    }

    public II18n getI18n() {
        return i18n;
    }

    public FrameInfo setI18n(II18n i18n) {
        this.i18n = i18n;
        return this;
    }

    public ISystemConfig getSystemConfig() {
        return systemConfig;
    }

    public FrameInfo setSystemConfig(ISystemConfig systemConfig) {
        this.systemConfig = systemConfig;
        return this;
    }

    public List<IComponentGroup> getComponentGroupList() {
        return componentGroupList;
    }

    public FrameInfo setComponentGroupList(List<IComponentGroup> componentGroupList) {
        this.componentGroupList = componentGroupList;
        return this;
    }
}
