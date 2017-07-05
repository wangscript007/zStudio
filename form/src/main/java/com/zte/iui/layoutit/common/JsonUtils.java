package com.zte.iui.layoutit.common;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JsonUtils {

    private JsonUtils() {

    }

    public static String jsonFormat(final String jsonNode) throws IOException {
        try {
            return jsonFormat(new ObjectMapper().readTree(jsonNode));
        } catch (JsonProcessingException e) {
            throw new IOException(e);
        } catch (IOException e) {
            throw new IOException(e);
        }
    }

    public static String jsonFormat(final JsonNode jsonNode) {
        if (jsonNode.isNull()) {
            return "";
        }
        final int level = 1;
        if (jsonNode.isObject()) {
            return jsonObjectFormat(level, jsonNode).toString();
        }
        if (jsonNode.isArray()) {
            return jsonArrayFormat(level, jsonNode).toString();
        }
        return "";
    }

    private static StringBuilder jsonObjectFormat(final int level, final JsonNode jsonNode) {
        final List<Entry<String, JsonNode>> entryFields = new ArrayList<Entry<String, JsonNode>>();
        for (Iterator<Entry<String, JsonNode>> fields = jsonNode.fields(); fields.hasNext();) {
            entryFields.add(fields.next());
        }
        return assemblingJsonObjectFormat(level, entryFields);
    }

    private static StringBuilder assemblingJsonObjectFormat(final int level, final List<Entry<String, JsonNode>> entryFields) {
        final StringBuilder jsonObjectFormat = new StringBuilder("{");
        final int len = entryFields.size();
        if (len > 0) {
            final int nextLevel = level + 1;
            jsonObjectFormat.append(jsonObjectFieldFormat(nextLevel, entryFields.get(0)));
            for (int i = 1; i < len; i++) {
                jsonObjectFormat.append(",");
                jsonObjectFormat.append(jsonObjectFieldFormat(nextLevel, entryFields.get(i)));
            }
        }
        jsonObjectFormat.append(separatorAndSpace(level)).append("}");
        return jsonObjectFormat;
    }

    private static StringBuilder jsonObjectFieldFormat(final int level, final Entry<String, JsonNode> field) {
        final StringBuilder fieldFormat = new StringBuilder(separatorAndSpace(level));
        fieldFormat.append("\"").append(field.getKey()).append("\"").append(":");
        fieldFormat.append(handleJsonNode(level, field.getValue()));
        return fieldFormat;
    }

    private static StringBuilder handleJsonNode(final int level, final JsonNode jsonNode) {
        if (jsonNode.isNull()) {
            return null;
        }
        if (jsonNode.isArray()) {
            return new StringBuilder(jsonArrayFormat(level, jsonNode));
        }
        if (jsonNode.isObject()) {
            return new StringBuilder(jsonObjectFormat(level, jsonNode));
        }
        return new StringBuilder().append(jsonNode);
    }

    private static StringBuilder getSpace(final int level) {
        final StringBuilder space = new StringBuilder();
        final String basicSpace = "    ";
        for (int i = 1; i < level; i++) {
            space.append(basicSpace);
        }
        return space;
    }

    private static StringBuilder jsonArrayFormat(final int level, final JsonNode jsonNode) {
        List<JsonNode> jsonNodes = new ArrayList<JsonNode>();
        for (Iterator<JsonNode> fields = jsonNode.iterator(); fields.hasNext();) {
            jsonNodes.add(fields.next());
        }
        return assemblingJsonArrayFormat(level, jsonNodes);
    }

    private static StringBuilder assemblingJsonArrayFormat(final int level, final List<JsonNode> jsonNodes) {
        final StringBuilder jsonArrayFormat = new StringBuilder("[");
        final int len = jsonNodes.size();
        if (len > 0) {
            final int nextLevel = level + 1;
            jsonArrayFormat.append(jsonArrayElementFormat(nextLevel, jsonNodes.get(0)));
            for (int i = 1; i < len; i++) {
                jsonArrayFormat.append(",");
                jsonArrayFormat.append(jsonArrayElementFormat(nextLevel, jsonNodes.get(i)));
            }
        }
        jsonArrayFormat.append(separatorAndSpace(level)).append("]");
        return jsonArrayFormat;
    }

    private static StringBuilder jsonArrayElementFormat(final int level, final JsonNode jsonNode) {
        return new StringBuilder(separatorAndSpace(level)).append(handleJsonNode(level, jsonNode));
    }

    private static StringBuilder separatorAndSpace(final int level) {
        return new StringBuilder(System.getProperty("line.separator")).append(getSpace(level));
    }
}