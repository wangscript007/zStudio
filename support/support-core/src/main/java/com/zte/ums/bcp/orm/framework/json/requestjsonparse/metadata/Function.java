package com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata;

public class Function {
    public static final String FUNCTION_COUNT = "count";
    public static final String FUNCTION_SUM = "sum";
    public static final String FUNCTION_AVG = "avg";
    public static final String FUNCTION_MAX = "max";
    public static final String FUNCTION_MIN = "min";

    private String name;
    private IFunctionParameter[] parameters;
    private String alias;

    public Function(String name, String alias, IFunctionParameter[] parameters) {
        this.name = name;
        this.parameters = parameters;
        this.alias = alias;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public IFunctionParameter[] getParameters() {
        return parameters;
    }

    public void setParameters(IFunctionParameter[] parameters) {
        this.parameters = parameters;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }
}
