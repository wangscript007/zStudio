package com.ksy.designer.service.form.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.ksy.designer.common.DesignerException;
import com.ksy.designer.service.DesignerEnvService;
import com.ksy.designer.service.FileService;

@Service
public class FormFileService extends FileService {
    @Resource
    private DesignerEnvService designerEnvService;

    @Override
    protected String checkContent(String content, String fileName) throws DesignerException {
        return content;
    }

    @Override
    protected String getDataDir(String fileName) {
        return designerEnvService.getDesignerFilesDir();
    }
}
