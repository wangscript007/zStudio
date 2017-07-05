package com.ksy.designer.entity;

import java.util.Map;

public class FormDrawingBoard implements IDrawingBoard {
    private Map<?, ?> content;

    public Map<?, ?> getContent() {
        return content;
    }

    public void setContent(Map<?, ?> content) {
        this.content = content;
    }
}
