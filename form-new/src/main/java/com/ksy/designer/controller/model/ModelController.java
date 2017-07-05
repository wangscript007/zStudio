package com.ksy.designer.controller.model;

import javax.annotation.Resource;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ksy.designer.common.response.DesignerDataResponse;
import com.ksy.designer.service.model.ModelDesignerService;

@RequestMapping("/model")
@RestController
public class ModelController {
    @Resource
    private ModelDesignerService modelDesignerService;

    public DesignerDataResponse getProjects() {
        return null;
    }

    @RequestMapping(value = "list/def", method = RequestMethod.GET)
    public DesignerDataResponse listModelDefs() {
        return DesignerDataResponse.getSuccessResponse(modelDesignerService.getModelDef());
    }

    @RequestMapping(value = "list/method", method = RequestMethod.GET)
    public DesignerDataResponse listModelMethods() {
        return DesignerDataResponse.getSuccessResponse(modelDesignerService.getModelMethod());
    }

    @RequestMapping(value = "list/method-with-def", method = RequestMethod.GET)
    public DesignerDataResponse listModelMethodsWithDef() {
        return DesignerDataResponse.getSuccessResponse(modelDesignerService.getModelMethodWithDef());
    }
}
