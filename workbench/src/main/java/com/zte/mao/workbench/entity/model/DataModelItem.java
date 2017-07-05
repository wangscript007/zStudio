package com.zte.mao.workbench.entity.model;

import java.util.HashMap;
import java.util.Map;

import com.zte.mao.workbench.def.TDataModelItem;

public class DataModelItem {
    public static final int ENUM_TYPE_STRING = TDataModelItem.ENUM_TYPE_STRING;
    public static final int ENUM_TYPE_LONG_STRING = TDataModelItem.ENUM_TYPE_LONG_STRING;
    public static final int ENUM_TYPE_BOOLEAN = TDataModelItem.ENUM_TYPE_BOOLEAN;
    public static final int ENUM_TYPE_INTERGE = TDataModelItem.ENUM_TYPE_INTERGE;
    public static final int ENUM_TYPE_FLOAT = TDataModelItem.ENUM_TYPE_FLOAT;
    public static final int ENUM_TYPE_DATE = TDataModelItem.ENUM_TYPE_DATE;
    public static final int ENUM_TYPE_BIGINT = TDataModelItem.ENUM_TYPE_BIGINT;
    public static final int ENUM_TYPE_DOUBLE = TDataModelItem.ENUM_TYPE_DOUBLE;

    public static final int ENUM_LAYOUT_HALF_LINE_CAN_HAVE_OTHER = TDataModelItem.ENUM_LAYOUT_HALF_LINE_CAN_HAVE_OTHER;
    public static final int ENUM_LAYOUT_EXCLUSIVE_LINE = TDataModelItem.ENUM_LAYOUT_EXCLUSIVE_LINE;
    public static final int ENUM_LAYOUT_EXCLUSIVE_HALF_LINE = TDataModelItem.ENUM_LAYOUT_EXCLUSIVE_HALF_LINE;
    
    public static final int ENUM_COMPONENT_TYPE_LABLE = TDataModelItem.ENUM_COMPONENT_TYPE_LABLE;
    public static final int ENUM_COMPONENT_TYPE_INPUT_TEXT = TDataModelItem.ENUM_COMPONENT_TYPE_INPUT_TEXT;
    public static final int ENUM_COMPONENT_TYPE_TEXTAREA = TDataModelItem.ENUM_COMPONENT_TYPE_TEXTAREA;
    public static final int ENUM_COMPONENT_TYPE_SELECT_DYNAMIC = TDataModelItem.ENUM_COMPONENT_TYPE_SELECT_DYNAMIC;
    public static final int ENUM_COMPONENT_TYPE_INPUT_RADIO = TDataModelItem.ENUM_COMPONENT_TYPE_INPUT_RADIO;
    public static final int ENUM_COMPONENT_TYPE_CHECKBOX = TDataModelItem.ENUM_COMPONENT_TYPE_CHECKBOX;
    public static final int ENUM_COMPONENT_TYPE_INPUT_DATETIME = TDataModelItem.ENUM_COMPONENT_TYPE_INPUT_DATETIME;
    public static final int ENUM_COMPONENT_TYPE_INPUT_FILEINPUT = TDataModelItem.ENUM_COMPONENT_TYPE_INPUT_FILEINPUT;
    
    private static final Map<Integer, int[]> COMPONENTTYPE_ITEMTYPE = new HashMap<Integer, int[]>();
    static {
        COMPONENTTYPE_ITEMTYPE.put(new Integer(ENUM_TYPE_STRING), new int[] { ENUM_COMPONENT_TYPE_INPUT_TEXT,
                                                                              ENUM_COMPONENT_TYPE_INPUT_FILEINPUT});
        COMPONENTTYPE_ITEMTYPE.put(new Integer(ENUM_TYPE_LONG_STRING), new int[] { ENUM_COMPONENT_TYPE_TEXTAREA,
                                                                                   ENUM_COMPONENT_TYPE_INPUT_FILEINPUT });
        COMPONENTTYPE_ITEMTYPE.put(new Integer(ENUM_TYPE_BOOLEAN), new int[] { ENUM_COMPONENT_TYPE_SELECT_DYNAMIC,
                                                                               ENUM_COMPONENT_TYPE_SELECT_DYNAMIC,
                                                                               ENUM_COMPONENT_TYPE_CHECKBOX });
        COMPONENTTYPE_ITEMTYPE.put(new Integer(ENUM_TYPE_INTERGE), new int[] { ENUM_COMPONENT_TYPE_INPUT_TEXT });
        COMPONENTTYPE_ITEMTYPE.put(new Integer(ENUM_TYPE_FLOAT), new int[] { ENUM_COMPONENT_TYPE_INPUT_TEXT });
        COMPONENTTYPE_ITEMTYPE.put(new Integer(ENUM_TYPE_DATE), new int[] { ENUM_COMPONENT_TYPE_INPUT_DATETIME });
        COMPONENTTYPE_ITEMTYPE.put(new Integer(ENUM_TYPE_BIGINT), new int[] { ENUM_COMPONENT_TYPE_INPUT_TEXT });
        COMPONENTTYPE_ITEMTYPE.put(new Integer(ENUM_TYPE_DOUBLE), new int[] { ENUM_COMPONENT_TYPE_INPUT_TEXT });
    }

    private String id;
    private String name;
    private String modelId;
    private int type;
    private boolean isNull = true;
    private int lenth;
    private int decimal = 0;
    private String defaultValue;
    private boolean isFilter = false;
    private int columnKey;
    private int componentType = -1;
    private boolean uiVisible = true;
    private int layout;
    private int dataBlock;

    public String getId() {
        return id;
    }

    public DataModelItem setId(String id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return name;
    }

    public DataModelItem setName(String name) {
        this.name = name;
        return this;
    }

    public String getModelId() {
        return modelId;
    }

    public DataModelItem setModelId(String modelId) {
        this.modelId = modelId;
        return this;
    }

    public int getType() {
        return type;
    }

    public DataModelItem setType(int type) {
        this.type = type;
        return this;
    }

    public boolean isNull() {
        return isNull;
    }

    public DataModelItem setNull(boolean isNull) {
        this.isNull = isNull;
        return this;
    }

    public int getLenth() {
        return lenth;
    }

    public DataModelItem setLenth(int lenth) {
        this.lenth = lenth;
        return this;
    }

    public int getDecimal() {
        return decimal;
    }

    public DataModelItem setDecimal(int decimal) {
        this.decimal = decimal;
        return this;
    }

    public String getDefaultValue() {
        return defaultValue;
    }

    public DataModelItem setDefaultValue(String defaultValue) {
        this.defaultValue = defaultValue;
        return this;
    }

    public boolean isFilter() {
        return isFilter;
    }

    public DataModelItem setFilter(boolean isFilter) {
        this.isFilter = isFilter;
        return this;
    }

    public int getColumnKey() {
        return columnKey;
    }

    public DataModelItem setColumnKey(int columnKey) {
        this.columnKey = columnKey;
        return this;
    }

    public int getComponentType() {
        return componentType;
    }

    public DataModelItem setComponentType(int componentType) {
        this.componentType = componentType;
        return this;
    }

    public boolean isUiVisible() {
        return uiVisible;
    }

    public DataModelItem setUiVisible(boolean uiVisible) {
        this.uiVisible = uiVisible;
        return this;
    }

    public int getLayout() {
        return layout;
    }

    public DataModelItem setLayout(int layout) {
        this.layout = layout;
        return this;
    }

    public int getDataBlock() {
        return dataBlock;
    }

    public DataModelItem setDataBlock(int dataBlock) {
        this.dataBlock = dataBlock;
        return this;
    }
    
    public static int[] getEffectiveComponentTypeByItemType(int itemType) {
        return COMPONENTTYPE_ITEMTYPE.get(new Integer(itemType));
    }

    public Map<String, String> toMap(DataModelItem dataModelItem) {
        Map<String, String> map = new HashMap<String, String>();
        
        map.put(TDataModelItem.COL_NAME_COLUMN_KEY, String.valueOf(dataModelItem.getColumnKey()));
        map.put(TDataModelItem.COL_NAME_COMPONENT_TYPE, String.valueOf(dataModelItem.getComponentType()));
        map.put(TDataModelItem.COL_NAME_DATA_BLOCK, String.valueOf(dataModelItem.getDataBlock()));
        map.put(TDataModelItem.COL_NAME_DECIMAL, String.valueOf(dataModelItem.getDecimal()));
        map.put(TDataModelItem.COL_NAME_DEFAULT, String.valueOf(dataModelItem.getDefaultValue()));
        map.put(TDataModelItem.COL_NAME_ID, String.valueOf(dataModelItem.getId()));
        map.put(TDataModelItem.COL_NAME_IS_NULL, dataModelItem.isNull() ? "0" : "1");
        map.put(TDataModelItem.COL_NAME_LAYOUT, String.valueOf(dataModelItem.getLayout()));
        map.put(TDataModelItem.COL_NAME_LENGTH, String.valueOf(dataModelItem.getLenth()));
        map.put(TDataModelItem.COL_NAME_MODEL_ID, dataModelItem.getModelId());
        map.put(TDataModelItem.COL_NAME_NAME, dataModelItem.getName());
        map.put(TDataModelItem.COL_NAME_TYPE, String.valueOf(dataModelItem.getType()));
        map.put(TDataModelItem.COL_NAME_UI_VISIBLE, dataModelItem.isUiVisible() ? "1" : "2");
        return map;
    }
}
