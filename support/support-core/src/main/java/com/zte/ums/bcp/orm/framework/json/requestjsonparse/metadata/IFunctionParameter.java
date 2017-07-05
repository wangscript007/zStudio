package com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata;

public interface IFunctionParameter {
    int ENUM_TYPE_FIELD = 1;
    int ENUM_TYPE_CONST = 2;

    String getValue();

    int getType();
}
