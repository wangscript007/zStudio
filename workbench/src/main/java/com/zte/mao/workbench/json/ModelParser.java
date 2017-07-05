package com.zte.mao.workbench.json;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zte.mao.common.exception.MaoCommonException;
import com.zte.mao.workbench.def.TDataModelInfo;
import com.zte.mao.workbench.entity.model.DataModelBaisc;
import com.zte.mao.workbench.entity.model.DataModelGroup;
import com.zte.mao.workbench.entity.model.DataModelInfo;
import com.zte.mao.workbench.entity.model.DataModelItem;

@Service
public class ModelParser {
	private static final Logger logger = Logger.getLogger(ModelParser.class);

	public DataModelInfo parseCreateOrUpdate(String json,String operate) throws MaoCommonException {
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			JsonNode rootNode = objectMapper.readTree(json);
			DataModelBaisc modelInfo = parseModelBasic(rootNode,operate);
			String modelId = modelInfo.getId();
			List<DataModelItem> modelItemList = parseModelItems(rootNode, modelId);
			List<DataModelGroup> modelItemGroupList = parseModelGroups(rootNode, modelId);
			return new DataModelInfo(modelInfo, modelItemList, modelItemGroupList);
		} catch (JsonParseException e) {
			logger.error(e.getMessage(), e);
			throw new MaoCommonException(e.getLocalizedMessage(), e);
		} catch (JsonMappingException e) {
			logger.error(e.getMessage(), e);
			throw new MaoCommonException(e.getLocalizedMessage(), e);
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
			throw new MaoCommonException(e.getLocalizedMessage(), e);
		}
	}

    private DataModelBaisc parseModelBasic(JsonNode rootNode,String operate) throws MaoCommonException {
        if (rootNode.has("basic") == false) {
            throw new MaoCommonException("非法请求,缺少basic标签。");
        }
        JsonNode basicNode = rootNode.get("basic");
        if (basicNode.has("id") == false) {
            throw new MaoCommonException("非法请求,缺少basic->id标签。");
        }
        DataModelBaisc modelInfo = new DataModelBaisc();
        modelInfo.setId(basicNode.get("id").asText());
        modelInfo.setName(basicNode.get("name").asText());
        modelInfo.setDescription(basicNode.get("description").asText());
        modelInfo.setCreator(basicNode.get("creator").asText());
        modelInfo.setBindTable(basicNode.get("bindTable").asText());
        modelInfo.setScript(basicNode.get("script").asText());
        modelInfo.setI18n(basicNode.get("i18n").asText());
        modelInfo.setScene(basicNode.get("scene").asInt());
        modelInfo.setPackageId(basicNode.get("packageId").asText());
        Date createDate = new Date();
        modelInfo.setCreateTime(createDate);
        if("create".equals(operate)){
            modelInfo.setUpdateTime(createDate);
        }else if("update".equals(operate)){
            SimpleDateFormat sdf = new SimpleDateFormat(TDataModelInfo.DATE_PATTERN);
            try {
                modelInfo.setUpdateTime(sdf.parse(basicNode.get("updatetime").asText()));
            } catch (ParseException e) {
                logger.error(e.getMessage(), e);
                throw new MaoCommonException(e.getLocalizedMessage(), e);
            }
        }
        return modelInfo;
    }

    private List<DataModelItem> parseModelItems(JsonNode rootNode, String modelId) throws MaoCommonException {
        if (rootNode.has("modelItems") == false) {
            return new ArrayList<DataModelItem>();
        }
        JsonNode modelItemsNode = rootNode.get("modelItems");
        List<DataModelItem> modelItemList = new ArrayList<DataModelItem>();
        Iterator<JsonNode> iterator = modelItemsNode.iterator();
        while (iterator.hasNext()) {
            JsonNode modelItemNode = iterator.next();
            DataModelItem modelItem = parseModelItem(modelItemNode);
            modelItem.setModelId(modelId);
            modelItemList.add(modelItem);
        }
        return modelItemList;
    }

    private List<DataModelGroup> parseModelGroups(JsonNode rootNode, String modelId) {
        if (rootNode.has("modelItemGroups") == false) {
            return new ArrayList<DataModelGroup>();
        }
        JsonNode groupsNode = rootNode.get("modelItemGroups");
        List<DataModelGroup> modelItemGroupList = new ArrayList<DataModelGroup>();
        Iterator<Entry<String, JsonNode>> iterator = groupsNode.fields();
        while (iterator.hasNext()) {
            Map.Entry<String, JsonNode> entry = iterator.next();
            DataModelGroup modelItem = new DataModelGroup();
            modelItem.setId(entry.getKey());
            modelItem.setName(entry.getValue().asText());
            modelItem.setModelId(modelId);
            modelItemGroupList.add(modelItem);
        }
        return modelItemGroupList;
    }

	private DataModelItem parseModelItem(JsonNode modelItemNode) throws MaoCommonException {
		DataModelItem modelItem = new DataModelItem();
		String messageFormat = "数据项缺少%s字段。";
        checkJsonField(modelItemNode, messageFormat, "id");
		modelItem.setId(modelItemNode.get("id").asText());
		checkJsonField(modelItemNode, messageFormat, "name");
		modelItem.setName(modelItemNode.get("name").asText());
        checkJsonField(modelItemNode, messageFormat, "type");
		modelItem.setType(modelItemNode.get("type").asInt());
        checkJsonField(modelItemNode, messageFormat, "null");
		modelItem.setNull(modelItemNode.get("null").asBoolean(true));
        checkJsonField(modelItemNode, messageFormat, "columnKey");
		modelItem.setColumnKey(modelItemNode.get("columnKey").asInt(1));
        checkJsonField(modelItemNode, messageFormat, "length");
		modelItem.setLenth(modelItemNode.get("length").asInt(0));
        checkJsonField(modelItemNode, messageFormat, "decimal");
		modelItem.setDecimal(modelItemNode.get("decimal").asInt(0));
        checkJsonField(modelItemNode, messageFormat, "defaultValue");
        String defaultValue = modelItemNode.get("defaultValue").asText();
        if ("null".equals(defaultValue)) {
            modelItem.setDefaultValue("");
        } else {
            modelItem.setDefaultValue(defaultValue);
        }
        checkJsonField(modelItemNode, messageFormat, "componentType");
		modelItem.setComponentType(modelItemNode.get("componentType").asInt(-1));
        checkJsonField(modelItemNode, messageFormat, "uiVisible");
		modelItem.setUiVisible(modelItemNode.get("uiVisible").asBoolean(true));
        checkJsonField(modelItemNode, messageFormat, "layout");
		modelItem.setLayout(modelItemNode.get("layout").asInt(1));
        checkJsonField(modelItemNode, messageFormat, "dataBlock");
		modelItem.setDataBlock(modelItemNode.get("dataBlock").asInt(0));
		return modelItem;
	}

    private void checkJsonField(JsonNode modelItemNode, String messageFormat, String fieldName) throws MaoCommonException {
        if (modelItemNode.has(fieldName) == false) {
            throw new MaoCommonException(String.format(messageFormat, fieldName));
        }
    }
}
