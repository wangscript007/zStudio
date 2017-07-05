package com.ksy.designer.service.model.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.ksy.designer.service.AbstractComponentGroupService;
import com.ksy.designer.service.AbstractComponentService;
import com.ksy.designer.service.AbstractDesignerLoaderService;
import com.ksy.designer.service.AbstractDrawingBoardService;

@Service
public class ModelDesignerLoaderService extends AbstractDesignerLoaderService {
    @Resource
    private ModelComponentService modelComponentService;
    @Resource
    private ModelComponentGroupService modelComponentGroupService;
    @Resource
    private ModelDrawingBoardService modelDrawingBoardService;

    @Override
    protected AbstractComponentService getComponentService() {
        return this.modelComponentService;
    }

    @Override
    protected AbstractComponentGroupService getComponentGroupService() {
        return this.modelComponentGroupService;
    }

    @Override
    protected AbstractDrawingBoardService getDrawingBoardService() {
        return this.modelDrawingBoardService;
    }

}
