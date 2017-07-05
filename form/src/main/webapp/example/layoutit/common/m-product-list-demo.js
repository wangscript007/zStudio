function formatDetailUrl(data){
    return "m-product-detail.html?operator=view&ID="+data.ID;
}


function formatProductView(dataRow){
    var dataRowsHtml = [],url;

	    url = formatDetailUrl(dataRow);
	    
		dataRowsHtml.push('<li class="new-mu_l2">');
		dataRowsHtml.push('<a style="text-decoration:none" href="' + url + '" class="new-mu_l2a">');
		dataRowsHtml.push('<span class="new-mu_tmb">');
		dataRowsHtml.push('<img src="' + dataRow["GOODS_IMG_URL"] + '" width="100" height="100"  alt=""/>');
		dataRowsHtml.push('</span>');
		dataRowsHtml.push('<span class="new-mu_l2cw">');

		var title = dataRow["GOODS_NAME"];
		if (title && title.length > 35) {
			title = title.substring(0, 35) + " ...";
		}
		dataRowsHtml.push('<strong class="new-mu_l2h">' + title + '</strong>');

		dataRowsHtml.push('<span class="new-mu_l2h new-mu_l2h-v1"><span class="new-txt-rd2"></span></span>');

		dataRowsHtml.push('<span class="new-mu_l2c new-p-re">');
		dataRowsHtml.push('<strong class="new-txt-rd2">&yen;' + dataRow["GOODS_PRICE"] + '</strong>');
		dataRowsHtml.push('</span>');

		var supplier = "-";
		if (dataRow["GOODS_PROVIDER"]) {
			supplier = dataRow["GOODS_PROVIDER"];
		}
		dataRowsHtml.push('<span class="new-mu_l2h new-mu_l2h-v1">供应商：' +supplier + '</span>');
		dataRowsHtml.push('<span class="label label-success">好评：' + dataRow["ESTIMATE"] + '%</span>');
		dataRowsHtml.push('<span class="label label-danger">销量：' + dataRow["SALE_NUMBER"] + '</span>');
		

		dataRowsHtml.push('</span>');
		dataRowsHtml.push('</a>');
		dataRowsHtml.push("</li>");

		return dataRowsHtml.join(" ");
}