package com.ksy.designer.service.model.impl;

import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ksy.designer.common.DesignerException;
import com.ksy.designer.entity.IComponentGroup;
import com.ksy.designer.service.AbstractComponentGroupService;

@Service
public class ModelComponentGroupService extends AbstractComponentGroupService {

    @Override
    public List<IComponentGroup> getComponentGroupList() throws DesignerException {
        return Arrays.asList(ModelComponentGroup.values());
    }

    enum ModelComponentGroup implements IComponentGroup {
        DEFINITION("definition", "定义"), METHOD("method", "方法"), VIEW("view", "视图"), ADAPTER("adapter", "适配器");
        private String id;
        private String name;

        private ModelComponentGroup(String id, String name) {
            this.id = id;
            this.name = name;
        }

        @Override
        public String getId() {
            return this.id;
        }

        @Override
        public String getName() {
            return this.name;
        }

        @Override
        public String toString() {
            return this.id;
        }
    }
}
