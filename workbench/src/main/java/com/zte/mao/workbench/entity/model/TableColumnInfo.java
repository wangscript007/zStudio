package com.zte.mao.workbench.entity.model;

import java.io.Serializable;

@SuppressWarnings("serial")
public class TableColumnInfo implements Serializable {

    private String characterMaximumLength;
    private String columnType;
    private String columnName;
    private String columnDefault;
    private String columnKey;
    private String dataType;
    private String isNullable;
    private String originalDataType;
    private String extra;
    private String numericPrecision;
    private String numericScale;

    public TableColumnInfo() {
        super();
    }

    public TableColumnInfo(String characterMaximumLength, String columnType,
            String columnName, String columnDefault, String columnKey,
            String dataType, String isNullable, String originalDataType,
            String extra, String numericPrecision, String numericScale) {
        super();
        this.characterMaximumLength = characterMaximumLength;
        this.columnType = columnType;
        this.columnName = columnName;
        this.columnDefault = columnDefault;
        this.columnKey = columnKey;
        this.dataType = dataType;
        this.isNullable = isNullable;
        this.originalDataType = originalDataType;
        this.extra = extra;
        this.numericPrecision = numericPrecision;
        this.numericScale = numericScale;
    }

    public String getCharacterMaximumLength() {
        return characterMaximumLength;
    }

    public TableColumnInfo setCharacterMaximumLength(String characterMaximumLength) {
        this.characterMaximumLength = characterMaximumLength;
        return this;
    }

    public String getColumnType() {
        return columnType;
    }

    public TableColumnInfo setColumnType(String columnType) {
        this.columnType = columnType;
        return this;
    }

    public String getColumnName() {
        return columnName;
    }

    public TableColumnInfo setColumnName(String columnName) {
        this.columnName = columnName;
        return this;
    }

    public String getColumnDefault() {
        return columnDefault;
    }

    public TableColumnInfo setColumnDefault(String columnDefault) {
        this.columnDefault = columnDefault;
        return this;
    }

    public String getColumnKey() {
        return columnKey;
    }

    public TableColumnInfo setColumnKey(String columnKey) {
        this.columnKey = columnKey;
        return this;
    }

    public String getDataType() {
        return dataType;
    }

    public TableColumnInfo setDataType(String dataType) {
        this.dataType = dataType;
        return this;
    }

    public String getIsNullable() {
        return isNullable;
    }

    public TableColumnInfo setIsNullable(String isNullable) {
        this.isNullable = isNullable;
        return this;
    }

    public String getOriginalDataType() {
        return originalDataType;
    }

    public TableColumnInfo setOriginalDataType(String originalDataType) {
        this.originalDataType = originalDataType;
        return this;
    }

    public String getExtra() {
        return extra;
    }

    public TableColumnInfo setExtra(String extra) {
        this.extra = extra;
        return this;
    }

    public String getNumericPrecision() {
        return numericPrecision;
    }

    public TableColumnInfo setNumericPrecision(String numericPrecision) {
        this.numericPrecision = numericPrecision;
        return this;
    }

    public String getNumericScale() {
        return numericScale;
    }

    public TableColumnInfo setNumericScale(String numericScale) {
        this.numericScale = numericScale;
        return this;
    }

}
