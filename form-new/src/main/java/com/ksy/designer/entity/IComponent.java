package com.ksy.designer.entity;

import java.util.Map;

public interface IComponent {
    String getName();
    String getId();
    Map<?, ?> getAttribute();
}
