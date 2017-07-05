package com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition;

import java.io.Serializable;
import java.util.List;

import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.DataExpression;

@SuppressWarnings("serial")
public class AddRecordCondition implements Serializable {
    private List<DataExpression> dataExpressions;

    /**
     * 
     * @return 数据内容
     */
    public List<DataExpression> getDataExpressions() {
        return dataExpressions;
    }

    public void setDataExpressions(List<DataExpression> dataExpressions) {
        this.dataExpressions = dataExpressions;
    }

    /**
     * @return {dataExpressions:[{field:字段,value:值},{field:字段,value:值},...]}
     */
    public String toString() {
        StringBuffer sb = new StringBuffer();
        sb.append("{dataExpressions:");
        sb.append("[");
        if (dataExpressions != null) {
            for (int j = 0; j < dataExpressions.size(); j++) {
                if (j < dataExpressions.size() - 1) {
                    sb.append(dataExpressions.get(j).toString() + ",");
                } else {
                    sb.append(dataExpressions.get(j).toString());
                }
            }
        }
        sb.append("]");
        sb.append("}");
        return sb.toString();
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (this.getClass() != obj.getClass())
            return false;
        AddRecordCondition other = (AddRecordCondition) obj;
        for (int i = 0; i < dataExpressions.size(); i++) {
            if (!other.dataExpressions.get(i).equals(dataExpressions.get(i)))
                return false;
        }
        return true;
    }

    @Override
    public int hashCode() {
        // TODO Auto-generated method stub
        int result = 1, prime = 31;
        for (int i = 0; i < dataExpressions.size(); i++) {
            result = result * prime + dataExpressions.get(i).hashCode();
        }
        return result;
    }
}
