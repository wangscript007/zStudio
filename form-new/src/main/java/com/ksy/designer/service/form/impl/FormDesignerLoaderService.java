package com.ksy.designer.service.form.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.ksy.designer.service.AbstractComponentGroupService;
import com.ksy.designer.service.AbstractComponentService;
import com.ksy.designer.service.AbstractDesignerLoaderService;
import com.ksy.designer.service.AbstractDrawingBoardService;

@Service
public class FormDesignerLoaderService extends AbstractDesignerLoaderService {
    @Resource
    private FormComponentService formComponentService;
    @Resource
    private FormComponentGroupService formComponentGroupService;
    @Resource
    private FormDrawingBoardService formDrawingBoardService;

    @Override
    protected AbstractComponentService getComponentService() {
        return formComponentService;
    }

    @Override
    protected AbstractComponentGroupService getComponentGroupService() {
        return formComponentGroupService;
    }

    @Override
    protected AbstractDrawingBoardService getDrawingBoardService() {
        return formDrawingBoardService;
    }
}
