package com.ksy.designer.service;

import static org.junit.Assert.*;

import java.util.List;

import org.junit.Test;
import org.mockito.Mockito;
import org.powermock.api.support.membermodification.MemberModifier;

import com.ksy.designer.common.DesignerException;
import com.ksy.designer.entity.IComponent;

public class ComponentServiceTest {

    @Test
    public void test() {
        ComponentService groupService = new ComponentService();
        try {
            DesignerEnvService designerEnvService = Mockito.mock(DesignerEnvService.class);
            Mockito.when(designerEnvService.getProductHome()).thenReturn(this.getClass().getResource("/").getPath());

            MemberModifier.field(ComponentService.class, "designerEnvService").set(groupService, designerEnvService);
        } catch (Exception e) {
            fail(e.getMessage());
            return;
        }
        List<IComponent> componentList;
        try {
            componentList = groupService.getComponentList();
        } catch (DesignerException e) {
            fail(e.getMessage());
            return;
        }
        assertNotNull(componentList);
        assertEquals(2, componentList.size());
    }

}
