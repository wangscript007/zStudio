package com.ksy.designer.service.model;

import static org.junit.Assert.*;

import java.io.File;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.mockito.Mockito;
import org.powermock.api.support.membermodification.MemberModifier;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ksy.designer.common.CommonConst;
import com.ksy.designer.entity.model.IModelDefinition;
import com.ksy.designer.entity.model.ModelFieldAttributeEnum;
import com.ksy.designer.entity.model.ModelFieldNode;
import com.ksy.designer.entity.model.ModelGroupNode;
import com.ksy.designer.entity.model.impl.ModelDefinitionImpl;
import com.ksy.designer.service.DesignerEnvService;

public class ModelDefinitionServiceTest {
    private static String TEST_DIR = "model/def";
    private ModelDefinitionService modelDefinitionService;

    @BeforeClass
    public static void setUpBeforeClass() throws Exception {
        TEST_DIR = ModelDefinitionServiceTest.class.getResource("/").getPath() + "model";
        new File(TEST_DIR).mkdir();
    }

    @Before
    public void setUp() throws Exception {
        modelDefinitionService = new ModelDefinitionService();
    }

    @Test
    public void testModelDef() {
        mockDesignerEnvService();

        List<IModelDefinition> actualModelDefList = modelDefinitionService.getModelDefs(null);
        assertEquals(1, actualModelDefList.size());

        ObjectMapper objectMapper = new ObjectMapper();
        File expectedFile = new File(TEST_DIR + File.separator + "def" + File.separator + "test1.md");
        try {
            String expectedDefJson = FileUtils.readFileToString(expectedFile, CommonConst.UTF_8);
            assertEquals(expectedDefJson, objectMapper.writeValueAsString(actualModelDefList.get(0)));
        } catch (Exception e) {
            fail(e.getMessage());
        }
    }

    private void mockDesignerEnvService() {
        try {
            DesignerEnvService designerEnvService = Mockito.mock(DesignerEnvService.class);
            Mockito.when(designerEnvService.getDesignerDataDir()).thenReturn(TEST_DIR);

            MemberModifier.field(ModelDefinitionService.class, "designerEnvService").set(modelDefinitionService, designerEnvService);
        } catch (Exception e) {
            fail(e.getMessage());
        }
    }

    private IModelDefinition getExpectedModelDefinition() {
        ModelFieldNode fieldNode1 = new ModelFieldNode("field1", "字段1");
        fieldNode1.put(ModelFieldAttributeEnum.LENGTH, new Integer(10));
        fieldNode1.put(ModelFieldAttributeEnum.DEFAULT, "100");
        fieldNode1.put(ModelFieldAttributeEnum.NULLABLE, Boolean.FALSE);
        ModelGroupNode groupNode = new ModelGroupNode("group1", "分组1");
        groupNode.addNode(fieldNode1);
        ModelFieldNode fieldNode2 = new ModelFieldNode("field2", "字段2");
        fieldNode2.put(ModelFieldAttributeEnum.LENGTH, new Integer(10));
        fieldNode2.put(ModelFieldAttributeEnum.DEFAULT, "100");
        fieldNode2.put(ModelFieldAttributeEnum.NULLABLE, Boolean.FALSE);
        ModelDefinitionImpl expectModelDef = new ModelDefinitionImpl("testModelSvc1", "测试模型定义1");
        expectModelDef.addNode(groupNode).addNode(fieldNode2);
        return expectModelDef;
    }

}
