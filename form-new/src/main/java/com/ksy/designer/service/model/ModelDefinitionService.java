package com.ksy.designer.service.model;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.annotation.Resource;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.alibaba.druid.util.StringUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.ksy.designer.common.DesignerException;
import com.ksy.designer.entity.model.IModelDefinition;
import com.ksy.designer.entity.model.ModelFieldAttributeEnum;
import com.ksy.designer.entity.model.ModelFieldNode;
import com.ksy.designer.entity.model.ModelGroupNode;
import com.ksy.designer.entity.model.ModelNode;
import com.ksy.designer.entity.model.impl.ModelDefinitionImpl;
import com.ksy.designer.service.DesignerEnvService;

@Service
public class ModelDefinitionService implements IModelComponentChecker {
    private static final Logger LOGGER = Logger.getLogger(ModelDefinitionService.class.getName());
    @Resource
    private DesignerEnvService designerEnvService;

    public List<IModelDefinition> getModelDefs(String[] modelDefIds) {
        List<IModelDefinition> modelDeflist = new ArrayList<IModelDefinition>();
        List<JsonNode> modelDefJsonTreeList = readModelTrees(new String[] { "md" }, modelDefIds);
        for (JsonNode jsonRootNode : modelDefJsonTreeList) {
            IModelDefinition modelDef = parseModelDefJsonNode(jsonRootNode);
            if (modelDef != null) {
                modelDeflist.add(modelDef);
            }
        }
        return modelDeflist;
    }

    public void checkContent(String modelComponentId, String content) throws DesignerException {
        try {
            IModelDefinition modelDef = parseModelDefJsonNode(new ObjectMapper().readTree(content));
            if (modelDef == null) {
                throw new DesignerException("非法模型定义内容。");
            }
            if (StringUtils.equals(modelDef.getId(), modelComponentId) == false) {
                throw new DesignerException("模型定义编号不一致。");
            }
            checkModelDefinition(modelDef);
        } catch (JsonProcessingException e) {
            LOGGER.error(e.getMessage(), e);
            throw new DesignerException(e.getLocalizedMessage(), e);
        } catch (IOException e) {
            LOGGER.error(e.getMessage(), e);
            throw new DesignerException(e.getLocalizedMessage(), e);
        }
    }

    private void checkModelDefinition(IModelDefinition modelDef) throws DesignerException {
        // TODO Auto-generated method stub
    }

    private IModelDefinition parseModelDefJsonNode(JsonNode node) {
        if (checkGroupJsonNode(node) != ModelNode.TYPE_ROOT) {
            return null;
        }
        ModelNode modelNode = parseModelJsonNode(node);
        return (IModelDefinition) modelNode;
    }

    private ModelNode parseModelJsonNode(JsonNode node) {
        if (checkJsonNodeBasic(node) == false) {
            return null;
        }
        String id = node.get("id").textValue();
        String name = node.get("name").textValue();
        int type = node.get("type").intValue();
        if (ModelNode.TYPE_FIELD == type) {
            ModelFieldNode fieldNode = new ModelFieldNode(id, name);
            JsonNode attributeNode = node.get("attributeMap");
            fieldNode.putAll(parseModeFieldAttribute(attributeNode));
            return fieldNode;
        } else if (checkGroupJsonNode(node) != -1) {
            JsonNode nodeListNode = node.get("nodeList");
            ModelGroupNode groupNode;
            if (ModelNode.TYPE_ROOT == type) {
                groupNode = new ModelDefinitionImpl(id, name);
            } else {
                groupNode = new ModelGroupNode(id, name);
            }
            ArrayNode arrayNode = (ArrayNode) nodeListNode;
            Iterator<JsonNode> elements = arrayNode.elements();
            while (elements.hasNext()) {
                JsonNode childNode = (JsonNode) elements.next();
                ModelNode modelNode = parseModelJsonNode(childNode);
                if (modelNode != null) {
                    groupNode.addNode(modelNode);
                }
            }
            if (groupNode.getNodeList().isEmpty() == true) {
                return null;
            } else {
                return groupNode;
            }
        } else {
            return null;
        }
    }

    private Map<ModelFieldAttributeEnum, Object> parseModeFieldAttribute(JsonNode attributeNode) {
        Map<ModelFieldAttributeEnum, Object> attributeMap = new LinkedHashMap<ModelFieldAttributeEnum, Object>();
        Iterator<Entry<String, JsonNode>> attributeIterator = attributeNode.fields();
        while (attributeIterator.hasNext()) {
            Map.Entry<String, JsonNode> entry = attributeIterator.next();
            ModelFieldAttributeEnum[] values = ModelFieldAttributeEnum.values();
            for (ModelFieldAttributeEnum value : values) {
                if (value.toString().equals(entry.getKey())) {
                    attributeMap.put(value, value.getJsonNodeValue(entry.getValue()));
                }
            }
            ArrayUtils.contains(values, entry.getKey().toUpperCase());
        }
        return attributeMap;
    }

    private boolean checkJsonNodeBasic(JsonNode node) {
        return !node.isNull() && node.hasNonNull("type") && node.hasNonNull("id") && node.hasNonNull("name");
    }

    private int checkGroupJsonNode(JsonNode jsonRootNode) {
        if (checkJsonNodeBasic(jsonRootNode) == false || jsonRootNode.hasNonNull("nodeList") == false) {
            return -1;
        }
        int modelNodeType = jsonRootNode.get("type").intValue();
        switch (modelNodeType) {
        case ModelNode.TYPE_ROOT:
        case ModelNode.TYPE_GROUP:
            return modelNodeType;
        default:
            return -1;
        }
    }

    private List<JsonNode> readModelTrees(String[] extensions, String[] modelDefIds) {
        List<JsonNode> modelDeflist = new ArrayList<JsonNode>();
        String designerFilesDir = designerEnvService.getDesignerDataDir();
        String modelDefFileDir = designerFilesDir + File.separator + "def";
        Collection<File> listFiles = FileUtils.listFiles(new File(modelDefFileDir), extensions, false);
        ObjectMapper objectMapper = new ObjectMapper();
        for (File file : listFiles) {
            if (modelDefIds != null && (ArrayUtils.indexOf(modelDefIds, file.getName()) == ArrayUtils.INDEX_NOT_FOUND)) {
                continue;
            }
            try {
                modelDeflist.add(objectMapper.readTree(file));
            } catch (IOException e) {
                LOGGER.warn("Failed to read file." + file.getAbsolutePath(), e);
            }
        }
        return modelDeflist;
    }
}
