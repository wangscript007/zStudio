package com.zte.mao.workbench.entity.model;

import java.util.List;

public class DataViewAssociated extends DataViewAssociatedBase {
    private List<DataViewAssociatedConditon> dataViewAssociatedConditons;

    public DataViewAssociated() {
        super();
        // TODO Auto-generated constructor stub
    }

    public DataViewAssociated(String associatedType, String associatedTableName) {
        super(associatedType, associatedTableName);
        // TODO Auto-generated constructor stub
    }

    public DataViewAssociated(String associatedType,
            String associatedTableName,
            List<DataViewAssociatedConditon> dataViewAssociatedConditons) {
        super(associatedType, associatedTableName);
        this.dataViewAssociatedConditons = dataViewAssociatedConditons;
    }

    public DataViewAssociated(
            List<DataViewAssociatedConditon> dataViewAssociatedConditons) {
        super();
        this.dataViewAssociatedConditons = dataViewAssociatedConditons;
    }

    public List<DataViewAssociatedConditon> getDataViewAssociatedConditons() {
        return dataViewAssociatedConditons;
    }

    public void setDataViewAssociatedConditons(
            List<DataViewAssociatedConditon> dataViewAssociatedConditons) {
        this.dataViewAssociatedConditons = dataViewAssociatedConditons;
    }

}
