package com.ksy.designer.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.ksy.designer.common.DesignerException;
import com.ksy.designer.entity.FrameInfo;
import com.ksy.designer.entity.IComponent;
import com.ksy.designer.entity.IComponentGroup;
import com.ksy.designer.entity.IDrawingBoard;
import com.ksy.designer.entity.ISystemConfig;

@Service
public class DesignerLoaderService {
    @Resource
    private ComponentService componentService;
    @Resource
    private DrawingBoardService drawingBoardService;
    @Resource
    private ComponentGroupService componentGroupService;
    @Resource
    private DesignerEnvService designerEnvService;

    public FrameInfo load(String designFileName) throws DesignerException {
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
}
