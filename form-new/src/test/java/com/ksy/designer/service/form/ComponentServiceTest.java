package com.ksy.designer.service.form;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.fail;

import java.util.List;

import org.junit.Test;
import org.mockito.Mockito;
import org.powermock.api.support.membermodification.MemberModifier;

import com.ksy.designer.common.DesignerException;
import com.ksy.designer.entity.IComponent;
import com.ksy.designer.service.DesignerEnvService;
import com.ksy.designer.service.form.impl.FormComponentService;

public class ComponentServiceTest {

    @Test
    public void test() {
        FormComponentService groupService = new FormComponentService();
        try {
            DesignerEnvService designerEnvService = Mockito.mock(DesignerEnvService.class);
            Mockito.when(designerEnvService.getProductHome()).thenReturn(this.getClass().getResource("/").getPath());

            MemberModifier.field(FormComponentService.class, "designerEnvService").set(groupService, designerEnvService);
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
