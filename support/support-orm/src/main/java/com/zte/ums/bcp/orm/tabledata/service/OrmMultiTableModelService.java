package com.zte.ums.bcp.orm.tabledata.service;

import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonEncoding;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.zte.ums.bcp.orm.exception.OrmException;
import org.apache.log4j.Logger;

@Service(value = "multiTableModelService")
public class OrmMultiTableModelService implements MultiTableModelService {
    private static final Logger dMsg = Logger.getLogger(OrmMultiTableModelService.class.getName());

    private static Map<String, ObjectNode> MODEL_MAP = new LinkedHashMap<String, ObjectNode>();

    private volatile static long SAVE_TIMESTAMP = -1;
    private volatile static boolean TO_SAVE = false;

    public OrmMultiTableModelService () {
        synchronized (MODEL_MAP) {
            if (SAVE_TIMESTAMP == -1) {
                try {
                    loadFile();
                } catch (JsonProcessingException e) {
                    dMsg.error(e.getMessage(), e);
                } catch (IOException e) {
                    dMsg.error(e.getMessage(), e);
                }
                new Timer().schedule(new TimerTask() {
                    @Override
                    public void run() {
                        try {
                            saveCacheToFile();
                        } catch (IOException e) {
                            dMsg.error(e.getMessage(), e);
                        }
                    }
                }, 5000, 10000);
                Runtime.getRuntime().addShutdownHook(new Thread() {
                    public void run() {
                        try {
                            saveCacheToFile();
                        } catch (IOException e) {
                            dMsg.error(e.getMessage(), e);
                        }
                    }
                });
                SAVE_TIMESTAMP = System.currentTimeMillis();
            }
        }
    }

    private void loadFile() throws JsonProcessingException, IOException {
        String path = MultiTableModelService.class.getResource("/").getPath();
        File file = new File(path + "multitable-model.json");
        if (file.exists()) {
            ArrayNode modelArrayNode = (ArrayNode) new ObjectMapper()
                    .readTree(new File(path + "multitable-model.json"));
            for (int i = 0; i < modelArrayNode.size(); i++) {
                ObjectNode objNode = (ObjectNode) modelArrayNode.get(i);
                JsonNode defName = objNode.get("definitionName");
                MODEL_MAP.put(defName.asText(), objNode);
            }
            DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            dMsg.info(df.format(new Date()) + "\tMultiTable model loaded!");
        }
    }

    private void saveCacheToFile() throws IOException {
        synchronized (MODEL_MAP) {
            if (TO_SAVE) {
                String path = MultiTableModelService.class.getResource("/")
                        .getPath();
                JsonFactory jfactory = new JsonFactory();
                @SuppressWarnings("deprecation")
                JsonGenerator jGenerator = jfactory.createJsonGenerator(
                        new File(path + "multitable-model.json"),
                        JsonEncoding.UTF8);
                ArrayNode modelArrayNode = new ObjectMapper().createArrayNode();
                Collection<ObjectNode> modelList = MODEL_MAP.values();
                for (Iterator<ObjectNode> iter = modelList.iterator(); iter
                        .hasNext();) {
                    modelArrayNode.add(iter.next());
                }
                new ObjectMapper().writeTree(jGenerator, modelArrayNode);
                SAVE_TIMESTAMP = System.currentTimeMillis();
                DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                dMsg
                        .info(df.format(new Date())
                                + "\tMultiTable model saved!");
                TO_SAVE = false;
            }
        }
    }

    public Map<String, Object> getDefinitionNames() throws OrmException {
        Map<String, Object> resultMap = new HashMap<String, Object>();
        if (SAVE_TIMESTAMP != -1) {
            List<String> modelNameList = new ArrayList<String>();
            modelNameList.addAll(MODEL_MAP.keySet());
            StringBuffer sBuff = new StringBuffer();
            for (int i = 0; i < modelNameList.size(); i++) {
                String defName = modelNameList.get(i);
                sBuff.append(defName + " ");
            }
            if (sBuff.length() > 0) {
                sBuff.setLength(sBuff.length() - 1);
            }
            resultMap.put("definitionNames", sBuff.toString());
        } else {
            throw new OrmException("系统初始化中");
        }
        return resultMap;
    }

    public ObjectNode getDefinitionModel(String definitionName)
            throws OrmException {
        ObjectNode modelNode = null;
        if (SAVE_TIMESTAMP != -1) {
            modelNode = (ObjectNode) MODEL_MAP.get(definitionName);
        } else {
            throw new OrmException("系统初始化中");
        }
        return modelNode;
    }

    @Transactional
    public JsonNode insertModel(String jsonData)
            throws JsonProcessingException, IOException, OrmException {
        JsonNode model = null;
        if (SAVE_TIMESTAMP != -1) {
            model = new ObjectMapper().readTree(jsonData);
            String definitionName = model.get("definitionName").asText();
            if (MODEL_MAP.containsKey(definitionName)) {
                throw new OrmException("该模型已存在:" + definitionName);
            }
            synchronized (MODEL_MAP) {
                MODEL_MAP.put(definitionName, (ObjectNode) model);
                TO_SAVE = true;
            }
        } else {
            throw new OrmException("系统初始化中");
        }
        return model;
    }

    @Transactional
    public JsonNode updateModel(String jsonData)
            throws JsonProcessingException, IOException, OrmException {
        JsonNode model = null;
        if (SAVE_TIMESTAMP != -1) {
            model = new ObjectMapper().readTree(jsonData);
            String definitionName = model.get("definitionName").asText();
            if (!MODEL_MAP.containsKey(definitionName)) {
                throw new OrmException("该模型不存在:" + definitionName);
            }
            synchronized (MODEL_MAP) {
                MODEL_MAP.put(definitionName, (ObjectNode) model);
                TO_SAVE = true;
            }
        } else {
            throw new OrmException("系统初始化中");
        }
        return model;
    }

    @Transactional
    public void deleteModel(String definitionName) throws OrmException {
        if (SAVE_TIMESTAMP != -1) {
            synchronized (MODEL_MAP) {
                MODEL_MAP.remove(definitionName);
                TO_SAVE = true;
            }
        } else {
            throw new OrmException("系统初始化中");
        }
    }

}
