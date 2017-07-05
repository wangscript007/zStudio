package com.ksy.designer.entity.model;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.ObjectUtils;

public class ModelGroupNode extends ModelNode {
    private List<ModelNode> nodeList;

    public ModelGroupNode(String id, String name) {
        super(id, name);
        nodeList = new ArrayList<ModelNode>();
    }

    @Override
    public int getType() {
        return ModelNode.TYPE_GROUP;
    }

    public List<ModelNode> getNodeList() {
        return nodeList;
    }

    public void setNodeList(List<ModelNode> nodeList) {
        this.nodeList = nodeList;
    }

    public ModelGroupNode addNode(ModelNode node) {
        if (nodeList != null) {
            this.nodeList.add(node);
        }
        return this;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = super.hashCode();
        result = prime * result + ((nodeList == null) ? 0 : nodeList.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (!super.equals(obj))
            return false;
        if (getClass() != obj.getClass())
            return false;
        ModelGroupNode other = (ModelGroupNode) obj;
        if (!ObjectUtils.equals(this.nodeList, other.nodeList)) {
            return false;
        }
        return true;
    }
}
