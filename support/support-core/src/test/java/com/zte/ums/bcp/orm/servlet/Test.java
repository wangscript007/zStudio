package com.zte.ums.bcp.orm.servlet;


public class Test {

    // private static Logger logger = LogManager.getLogger(Test.class);

    public static void main(String[] args){

        // String s = "{\"columns\":[" + "\"name\"," + "\"id\"," + "\"sex\","
        // + "\"namessfsfs\"]," + "\"values\":"
        // + "[{\"id\":\"123\",\"name\":\"nameValue1\"},"
        // + "{\"id\":\"idValue2\",\"name\":\"nameValue2\","
        // + "\"sex\":\"sexValue2\"},"
        // + "{\"sex\":\"sexValue3\",\"namessfsfs\":\"idValue1\"}]}";

        /*
         * String s = "{\"columns\":" +
         * "[{\"id\":\"123\",\"name\":\"nameValue1\"}," +
         * "{\"id\":\"idValue2\",\"name\":\"nameValue2\"," +
         * "\"sex\":\"sexValue2\"}," +
         * "{\"sex\":\"sexValue3\",\"namessfsfs\":\"idValue1\"}]}";
         */

        /*
         * INSERT INTO student (id, NAME, sex) VALUES (8, 'sdf', ''), (9, 'fdf',
         * 'man'), (10, 'gggg', '');
         */

        /*
         * JSONObject jsonObject = new JSONObject(s); JSONArray object =
         * (JSONArray) jsonObject.getJSONArray("columns");
         */
        // List<Coumn> coumns = new ArrayList();
        // for (int i = 0; i < object.length(); i++) {
        // Coumn coumn = new Coumn();
        // coumn.setCoumn(object.getString(i));
        // coumn.setIndex(i);
        // coumns.add(coumn);
        // }
        // Set ssSet = new LinkedHashSet();
        // String string = jsonObject.get("values").toString();
        // JSONArray jsonArray = new JSONArray(string);
        //
        // StringBuilder stringBuilder = new StringBuilder();
        // stringBuilder.append("INSERT INTO student (");
        // for (int j = 0; j < coumns.size(); j++) {
        // for (int ab = 0; ab < coumns.size(); ab++) {
        // Coumn coumn = coumns.get(ab);
        // if (coumn.getIndex() == j) {
        // stringBuilder.append(coumn.getCoumn());
        // if ((coumns.size() - 1) != j) {
        // stringBuilder.append(",");
        // }
        // }
        // }
        // }
        // stringBuilder.append(") VALUES ");
        // for (int i = 0; i < jsonArray.length(); i++) {
        // JSONObject object2 = (JSONObject) jsonArray.get(i);
        // Iterator keys2 = object2.keys();
        // Map<String, String> map = new HashMap();
        //
        // while (keys2.hasNext()) {
        // String string2 = keys2.next().toString();
        //
        // for (Coumn coumn : coumns) {
        // if (coumn.getCoumn().equals(string2)) {
        // map.put(String.valueOf(coumn.getIndex()),
        // object2.getString(string2));
        // }
        // }
        // }
        // stringBuilder.append("(");
        // for (int j = 0; j < coumns.size(); j++) {
        // String keyString = String.valueOf(j);
        // if (map.containsKey(keyString)) {
        // stringBuilder.append("'");
        // stringBuilder.append(map.get(keyString));
        // stringBuilder.append("'");
        // } else {
        // stringBuilder.append("''");
        // }
        // if (j != (coumns.size()-1)) {
        // stringBuilder.append(",");
        // }
        // }
        // stringBuilder.append(")");
        // if (i != (jsonArray.length() - 1)) {
        // stringBuilder.append(",");
        // }
        // }
        // System.out.println(stringBuilder.toString());
        // System.out.println(SQLsUtil.getSql(object));

        /*
         * String string2 =
         * "jdbc.url=jdbc:sqlserver://10.74.164.51:1433;databasename=test2";
         * 
         * int i = string2.lastIndexOf("="); String substring =
         * string2.substring(i+1,string2.length());
         * System.out.println(substring);
         */

        /*
         * SqlSessionFactory sqlSessionFactory = MybatisUtils
         * .getSessionFactory();
         * 
         * SqlSession session = sqlSessionFactory.openSession(); GeneralMapper
         * mapper = session.getMapper(GeneralMapper.class);
         * 
         * 
         * try { int i = mapper.deletes(5); session.commit();
         * System.out.println("删除成功!"); } catch (Exception e) {
         * System.out.println("删除失败!"); // TODO Auto-generated catch block
         * e.printStackTrace(); }
         */

        /*
         * String string = "{\"columns\":[]}";
         * 
         * System.out.println(string); JSONObject jsonObject = new
         * JSONObject(string); String string2 =
         * jsonObject.get("columns").toString(); JSONArray jsonArray = new
         * JSONArray(string2); System.out.println(jsonArray.length()); for (int
         * i = 0; i < jsonArray.length(); i++) { JSONObject object =
         * (JSONObject) jsonArray.get(i); // 如果为 cname null,就不拼接了
         * System.out.println(i++); } System.out.println("sdfd");
         */

        // userSchemaTable= ,没有userSchemaTable也是false
        /*
         * ResourceBundle rb = ResourceBundle.getBundle("db"); // String dbtype
         * = null; // String dbname = null; // String sql = null; // String
         * urlstring = rb.getString("jdbc.url").trim();
         * 
         * try { String schemaTable = rb.getString("userSchemaTable");
         * System.out.println(schemaTable); if("".equals(schemaTable)){
         * System.out.println("dgsd"); } } catch (Exception e) { // TODO
         * Auto-generated catch block e.printStackTrace();
         * System.out.println("dfgdf"); }
         * 
         * 
         * Map<String, List<LinkedHashMap<String, String>>> hashmap = new
         * HashMap<String, List<LinkedHashMap<String, String>>>(); ArrayList
         * list = new ArrayList(); hashmap.put("student", list);
         * 
         * list.add("a"); list.add("c"); list.add("d");
         * 
         * 
         * List<LinkedHashMap<String, String>> lists = hashmap.get("student");
         * 
         * if(lists.isEmpty()){ System.out.println("fgdf"); }
         */

        /*
         * String string = "{\"sdfds\":1}";
         * 
         * JSONObject object = new JSONObject(string); Object object2 =
         * object.get("sdfds"); System.out.println(object2.getClass());
         */

        /*SqlSession session = MybatisUtils.getSession();
        GeneralMapper mapper = session.getMapper(GeneralMapper.class);

        String string = "select * from users";
        List<LinkedHashMap<String, String>> list = mapper.selectBySql(string);

        org.codehaus.jettison.json.JSONArray json;
        try {
            json = new org.codehaus.jettison.json.JSONArray(list.toString());
            System.out.println(json.toString());
        } catch (org.codehaus.jettison.json.JSONException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }*/

    }
}
