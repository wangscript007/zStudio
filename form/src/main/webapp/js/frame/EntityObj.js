/**
 * Created by Administrator on 15-2-12.
 */
function ModuleObject(){
    this.id="";
    this.name="";
    this.getName=function(){
        return this.name;
    }
    this.getId=function(){
        return this.id;
    }
    this.setName=function(name){
        this.name = name;;
    }
    this.setId=function(id){
        this.id = id;;
    }
}

function DataFieldObj(id,name,isEditable){
    this.id = id;
    this.name=name;
    this.isEditable= isEditable;
    this.getId=function(){
        return this.id;
    }
    this.getName=function(){
        return this.name;
    }
    this.setName =function(name){
        this.name= name;
    }
    this.setId = function(id){
        this.id=id;
    }
    this.isEditable=function(){
        return this.isEditable;
    }
    this.setEditable = function(isEditable){
        this.isEditable = isEditable;
    }
}