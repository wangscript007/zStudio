package com.ksy.designer.service.model;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.mockito.Mockito;
import org.powermock.api.support.membermodification.MemberModifier;

import com.ksy.designer.entity.model.IModelDefinition;
import com.ksy.designer.entity.model.IModelMethod;
import com.ksy.designer.entity.model.ModelFieldNode;
import com.ksy.designer.entity.model.ModelRequest;
import com.ksy.designer.entity.model.impl.ModelDefinitionImpl;
import com.ksy.designer.entity.model.impl.ModelMethodImpl;

public class ModelDesignerServiceTest {
    private ModelDesignerService modelDesignerService;

    @BeforeClass
    public static void setUpBeforeClass() throws Exception {
    }

    @Before
    public void setUp() throws Exception {
        modelDesignerService = new ModelDesignerService();
    }

    @Test
    public void test() {
        ModelMethodService modelMethodService = Mockito.mock(ModelMethodService.class);
        ModelDefinitionService modelDefinitionService = Mockito.mock(ModelDefinitionService.class);

        Mockito.when(modelMethodService.getModelMethod()).thenReturn(getModelMethod(2));
        Mockito.when(modelDefinitionService.getModelDefs(new String[] { "testDef1", "testDef2", "testDef3" })).thenReturn(getModelDef(3));

        mockDefAndMethodService(modelMethodService, modelDefinitionService);
        
        Map<String, List<?>> expectedMap = new LinkedHashMap<String, List<?>>(); 
        expectedMap.put("methodList", getModelMethod(2));
        expectedMap.put("defList", getModelDef(3));

        assertEquals(expectedMap, modelDesignerService.getModelMethodWithDef());
    }

    @Test
    public void testInvalidModelMethod() {
        ModelMethodService modelMethodService = Mockito.mock(ModelMethodService.class);
        ModelDefinitionService modelDefinitionService = Mockito.mock(ModelDefinitionService.class);

        Mockito.when(modelMethodService.getModelMethod()).thenReturn(getModelMethod(2));
        Mockito.when(modelDefinitionService.getModelDefs(new String[] { "testDef1", "testDef2", "testDef3" })).thenReturn(getModelDef(1));

        mockDefAndMethodService(modelMethodService, modelDefinitionService);

        Map<String, List<?>> expectedMap = new LinkedHashMap<String, List<?>>(); 
        expectedMap.put("methodList", getModelMethod(1));
        expectedMap.put("defList", getModelDef(1));

        assertEquals(expectedMap, modelDesignerService.getModelMethodWithDef());
    }

    private void mockDefAndMethodService(ModelMethodService modelMethodService,
            ModelDefinitionService modelDefinitionService) {
        try {
            MemberModifier.field(ModelDesignerService.class, "modelMethodService").set(modelDesignerService, modelMethodService);
            MemberModifier.field(ModelDesignerService.class, "modelDefinitionService").set(modelDesignerService, modelDefinitionService);
        } catch (Exception e) {
            fail(e.getMessage());
        }
    }
    
    private List<IModelMethod> getModelMethod(int n) {
        List<IModelMethod> methodlist = new ArrayList<IModelMethod>();
        methodlist.add(new ModelMethodImpl("testModel1", "测试模型方法1", "testDef1", "testDef1", new ModelRequest("urn", "POST"), "ORM-ADAPTER"));
        methodlist.add(new ModelMethodImpl("testModel2", "测试模型方法2", "testDef2", "testDef3", new ModelRequest("urn", "POST"), "ORM-ADAPTER"));
        while (methodlist.size() - n > 0) {
            methodlist.remove(n);
        }
        return methodlist;
    }

    private List<IModelDefinition> getModelDef(int n) {
        List<IModelDefinition> deflist = new ArrayList<IModelDefinition>();
        ModelDefinitionImpl def1 = new ModelDefinitionImpl("testDef1", "测试模型定义1");
        def1.addNode(new ModelFieldNode("testFiled1", "测试字段1"));
        def1.addNode(new ModelFieldNode("testFiled2", "测试字段2"));
        deflist.add(def1);
        ModelDefinitionImpl def2 = new ModelDefinitionImpl("testDef2", "测试模型定义2");
        def2.addNode(new ModelFieldNode("testFiled3", "测试字段3"));
        def2.addNode(new ModelFieldNode("testFiled4", "测试字段4"));
        deflist.add(def2);
        ModelDefinitionImpl def3 = new ModelDefinitionImpl("testDef3", "测试模型定义3");
        def3.addNode(new ModelFieldNode("testFiled5", "测试字段5"));
        deflist.add(def3);
        while (deflist.size() - n > 0) {
            deflist.remove(n);
        }
        return deflist;
    }

}
