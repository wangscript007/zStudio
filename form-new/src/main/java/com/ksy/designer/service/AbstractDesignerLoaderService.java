package com.ksy.designer.service;

import java.util.List;

import javax.annotation.Resource;

import com.ksy.designer.common.DesignerException;
import com.ksy.designer.entity.FrameInfo;
import com.ksy.designer.entity.IComponent;
import com.ksy.designer.entity.IComponentGroup;
import com.ksy.designer.entity.IDrawingBoard;
import com.ksy.designer.entity.ISystemConfig;

public abstract class AbstractDesignerLoaderService {
    @Resource
    private DesignerEnvService designerEnvService;

    public FrameInfo load(String designFileName) throws DesignerException {
        AbstractComponentService componentService = getComponentService();
        AbstractComponentGroupService componentGroupService = getComponentGroupService();
        AbstractDrawingBoardService drawingBoardService = getDrawingBoardService();
        FrameInfo frameInfo = new FrameInfo();

        List<IComponent> componentList = componentService.getComponentList();
        frameInfo.setComponent(componentList);

        List<IComponentGroup> groupList = componentGroupService.getComponentGroupList();
        frameInfo.setComponentGroupList(groupList);

        IDrawingBoard drawingBoard = drawingBoardService.getDrawingBoard(designFileName);
        frameInfo.setDrawingBoard(drawingBoard);

        ISystemConfig systemConfig = designerEnvService.getSystemConfig();
        frameInfo.setSystemConfig(systemConfig);
        return frameInfo;
    }

    protected abstract AbstractComponentService getComponentService();

    protected abstract AbstractComponentGroupService getComponentGroupService();

    protected abstract AbstractDrawingBoardService getDrawingBoardService();
}
