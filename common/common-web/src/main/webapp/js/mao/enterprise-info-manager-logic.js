function vm1450086018892SuccessCallBack(data) {
    if(data != undefined && data.status != undefined) {
        if(data.status == 1) {
            bootbox.alert('企业信息修改成功。');
        }
        else {
            console.error(data);
            bootbox.alert('企业信息修改失败。');
        }
    }
    else {
        console.error(data);
        bootbox.alert('企业信息修改失败。');
    }
}