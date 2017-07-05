package com.ksy.designer.entity.model;

import java.util.List;

public interface IModelDefinition {
    String getName();

    String getId();

    List<ModelNode> getNodeList();
}
