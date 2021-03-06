package com.ksy.designer.service.form;

import static org.junit.Assert.*;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.api.support.membermodification.MemberMatcher;
import org.powermock.api.support.membermodification.MemberModifier;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import com.ksy.designer.common.DesignerException;
import com.ksy.designer.entity.IComponentGroup;
import com.ksy.designer.entity.form.FormComponentGroup;
import com.ksy.designer.service.DesignerEnvService;
import com.ksy.designer.service.form.impl.FormComponentGroupService;

@RunWith(PowerMockRunner.class)
@PrepareForTest(FormComponentGroupService.class)
public class ComponentGroupServiceTest {

    @Test
    public void test() {
        try {
            FormComponentGroupService groupService = PowerMockito.spy(new FormComponentGroupService());
            PowerMockito.doReturn(getGroupFilePath()).when(groupService, "getGroupFilePath", new Object[0]);
            List<IComponentGroup> expectGroupList = getGroupList();
            assertEquals(expectGroupList, groupService.getComponentGroupList());
        } catch (DesignerException e) {
            fail(e.getMessage());
        } catch (Exception e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void test2() {
        try {
            FormComponentGroupService groupService = new FormComponentGroupService();
            MemberModifier.stub(MemberMatcher.method(FormComponentGroupService.class, "getGroupFilePath")).toReturn(getGroupFilePath());
            List<IComponentGroup> expectGroupList = getGroupList();
            assertEquals(expectGroupList, groupService.getComponentGroupList());
        } catch (DesignerException e) {
            fail(e.getMessage());
        } catch (Exception e) {
            fail(e.getMessage());
        }
    }
    
    @Test
    public void test3() {
        FormComponentGroupService groupService = new FormComponentGroupService();
        try {
            DesignerEnvService designerEnvService = Mockito.mock(DesignerEnvService.class);
            Mockito.when(designerEnvService.getProductHome()).thenReturn(this.getClass().getResource("/").getPath());

            MemberModifier.field(FormComponentGroupService.class, "designerEnvService").set(groupService, designerEnvService);
        } catch (Exception e) {
            fail(e.getMessage());
        }
        List<IComponentGroup> expectGroupList = getGroupList();
        try {
            assertEquals(expectGroupList, groupService.getComponentGroupList());
        } catch (DesignerException e) {
            fail(e.getMessage());
        }
    }

    private List<IComponentGroup> getGroupList() {
        List<IComponentGroup> expectGroupList = new ArrayList<IComponentGroup>();
        FormComponentGroup group1 = new FormComponentGroup();
        group1.setGroupid("layout").setName("布局组件");
        expectGroupList.add(group1);
        FormComponentGroup group2 = new FormComponentGroup();
        group2.setGroupid("base").setName("基础组件");
        expectGroupList.add(group2);
        FormComponentGroup group3 = new FormComponentGroup();
        group3.setGroupid("hidden").setName("隐藏组件");
        expectGroupList.add(group3);
        return expectGroupList;
    }

    private String getGroupFilePath() {
        return this.getClass().getResource("/").getPath() + File.separator + "component-group.json";
    }
}
