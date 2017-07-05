package com.ksy.designer.entity.form;

import java.util.Map;

import com.ksy.designer.entity.IDrawingBoard;

public class FormDrawingBoard implements IDrawingBoard {
    private Map<?, ?> content;

    public Map<?, ?> getContent() {
        return content;
    }

    public void setContent(Map<?, ?> content) {
        this.content = content;
    }
}
