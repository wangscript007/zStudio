/**
 * Created by 10089289 on 2016/5/31.
 * 购物车插件
 */

;(function($, win) {
    /**
     * 返回无数据的购物车html代码
     * @returns {string}
     */
    var emptyCartHtml = function () {
        return ['<div class="shp-cart-empty" style="display:block">',
            '    <em class="cart-empty-icn"></em>',
            '    <span class="empty-msg">购物车空空如也,赶紧逛逛吧~</span>',
            '</div>'].join("\n");
    }

    /**
     * 店铺代码
     * @param shop
     * @returns {string}
     */
    var shopInfoHtml = function(shop) {
        var shopid = shop.id;
        return [
            '<div class="shop-title customize-shtit">',
            '	<div class="item">',
            '		<div class="check-wrapper">',
            '			<span id="checkshop' + shopid +'" class="cart-checkbox check-wrapper-unit checked" data-shopid="' + shopid +'" onclick="selectGroup('+shopid+')"></span>',
            '		</div>',
            '		<div class="shop-title-content">',
            '			<img src="img/shopping-cart/shopTitle.png" style ="width: 16px;  height: 13px;  vertical-align: top;  margin-top: 15px;  margin-right: 5px;">',
            '			<a class="shop-title-detail-lk shop-title-name arrow-left" href="'+shop.link+'" style="max-width: 1516px;">' + shop.name + '</a>',
            '		</div>',
            '	</div>',
            '</div>'].join("\n");
    }

    /**
     * 单个商品代码
     * @param item
     * @returns {string}
     */
    var productHtml = function (item) {
        var disabledStr = item.number == 1 ? 'disabled' : '';
        var html = [
            '<li id="product' + item.id + '" data-shopid="' + item.shopid + '">',
            '	<div class="items">',
            '		<div class="check-wrapper">',
            '			<span id="checkproduct'+item.id+'" data-shopid="' + item.shopid + '" class="cart-checkbox group-14393 checked" data-price=' + item.price +' onclick="changeSelected('+item.id+')"></span>',
            '		</div>',
            '		<div class="shp-cart-item-core shop-cart-display  ">',
            '			<a class="cart-product-cell-1" target="_blank" href="'+item.link+'">',
            '				<img class="cart-photo-thumb" alt="" src="'+item.img+'">',
            '			</a>',
            '			<div class="edit-pro-mode" style="display: block;">',
            '				<div class="property-edit-in"><span>'+item.name+'</span></div>'];
        if(item.color && item.size) {
            html.push('				<div class="property-edit-in"><span>颜色:'+item.color+' 尺码:'+item.size+'</span></div>');
        }
        html = html.concat(
            ['				<div class="price-count-edit">',
                '					<span class="shp-cart-item-price">￥<strong>'+item.price+'</strong>.00</span>',
                '					<div class="quantity-wrapper customize-qua">',
                '   					<a class="quantity-decrease ' + disabledStr +'" data-price=' + item.price +'  id="subnum' + item.id + '" href="javascript:void(0);"></a>',
                '						<input type="text" size="4" value="'+item.number+'" name="num" id="num' + item.id + '" data-stock="' + item.stock + '" class="quantity">',
                '					    <a href="javascript:void(0);" class="quantity-increase " data-price=' + item.price +' id="addnum' + item.id + '"></a>',
                '					</div>',
                '				</div>',
                '			</div>',
                '		</div>',
                '	</div>',
                '</li>']);
        return html.join("\n");
    }

    /**
     * 购物车底部代码
     * @param all
     * @returns {string}
     */
    var payHtml = function (all) {
        var total = 0;
        $.each(all, function (index, shop) {
            $.each(shop.products, function (index1, product) {
                total = total + product.price*product.number;
            })
        });

        return ['<div id="payment_p" style="display:block">',
            '    <div id="paymentp"></div>',
            '    <div class="payment-total-bar payment-total-bar-new box-flex-f" id="payment">',
            '        <div class="shp-chk shp-chk-new  box-flex-c">',
            '            <span onclick="checkAllHandler();" class="cart-checkbox checked" id="checkAllIcon"></span>',
            '            <span class="cart-checkbox-text">全选</span>',
            '        </div>',
            '        <div class="shp-cart-info shp-cart-info-new  box-flex-c">',
            '            <strong id="shpCartTotal"  class="shp-cart-total">合计:<span class="bottom-bar-price" id="cart_realPrice"> ￥' + total +'</span></strong>',
            '        </div>',
            '        <span class="btn-right-block btn-right-block-new  box-flex-c" id="submit">去结算</span>',
            '    </div>',
            '</div>'].join("\n");
    }

    /**
     * 点击店铺事件，全局函数
     * @param shopid
     */
    win.selectGroup = function (shopid) {
        var $shop = $("#checkshop" + shopid),
            $products = $('li[data-shopid="' + shopid + '"]').find('span[id^="checkproduct"]');
        if($shop.hasClass('checked')) {
            _changeCheckStatus($shop, true);
            _changeCheckStatus($products, true);
        }
        else if($shop.hasClass('unchecked')) {
            _changeCheckStatus($shop, false);
            _changeCheckStatus($products, false);
        }
        _calcTotalPrice();
    }

    /**
     * 点击勾选商品事件，全局函数
     * @param productid
     */
    win.changeSelected = function (productid) {
        var $procSpan = $("#checkproduct"+productid),
            shopid = $procSpan.data('shopid');
        if($procSpan.hasClass('checked')) {
            _changeCheckStatus($procSpan, true);
        }
        else if($procSpan.hasClass('unchecked')) {
            _changeCheckStatus($procSpan, false);
        }
        var isCheckAll = true;
        var isNotCheck = true;
        $.each($('li[data-shopid="'+shopid+'"]').find('span[id^="checkproduct"]'), function (index, item) {
            if($(item).hasClass('unchecked')) {
                isCheckAll = false;
            }
            else {
                isNotCheck = false;
            }
        });
        if(isCheckAll) {
            _changeCheckStatus($("#checkshop" + shopid), false);
        }
        if(isNotCheck) {
            _changeCheckStatus($("#checkshop" + shopid), true);
        }
        _calcTotalPrice();
    }

    win.checkAllHandler = function () {
        if($("#checkAllIcon").hasClass('checked')) {
            _changeCheckStatus($('#checkAllIcon,span[id^="checkshop"],span[id^="checkproduct"]'), true);
            $("#cart_realPrice").text('￥0.00');
        }
        else if($("#checkAllIcon").hasClass('unchecked')) {
            _changeCheckStatus($('#checkAllIcon,span[id^="checkshop"],span[id^="checkproduct"]'), false);
            _calcTotalPrice();
        }
    }

    /**
     * 更改span的check状态，全局函数
     * @param $check
     * @param checked
     * @private
     */
    win._changeCheckStatus = function ($checks, checked) {
        if(checked) {
            $checks.removeClass('checked').addClass('unchecked');
        }
        else {
            $checks.removeClass('unchecked').addClass('checked');
        }
    }

    win._calcTotalPrice = function () {
        var total = 0,
            isAllCheck = true;

        $.each($('span[id^="checkproduct"]'), function(index, item) {
            if($(item).hasClass('unchecked')) {
                isAllCheck = false;
            }
            if($(item).hasClass('checked')) {
                var productid = $(item).attr('id').substring("checkproduct".length),
                    price = $(item).data('price'),
                    number = $("#num" + productid).val();
                total = total + price * number;
            }
        });
        $("#cart_realPrice").text(total);
        if(isAllCheck) {
            _changeCheckStatus($("#checkAllIcon"), false);
        }
        else {
            _changeCheckStatus($("#checkAllIcon"), true);
        }
    }

    var ShoppingCart = function(currentComponent) {
        this.currentComponent = $(currentComponent);
        this.data = this._getData();
        this.initUI();
    }

    ShoppingCart.prototype._getData = function () {
        var products = this.currentComponent.data('products');

        if(win[products] === undefined || !$.isArray(win[products])) {
            if(typeof(win.initShoppingCartData) === 'function') {
                win.initShoppingCartData();
            }
            else {
                return;
            }
        }

        $.each(win[products], function (index, item) {
            var shopid = item.shop.id;
            $.each(item.products, function (index1, product) {
                product.shopid = shopid;
            })
        });
        return win[products];
    }

    ShoppingCart.prototype.shopsHtml = function () {
        var htmls = [];
        $.each(this.data, function (index, item) {
            var shopHtml = shopInfoHtml(item.shop),
                productsHtml = [];
            $.each(item.products, function (index1, product) {
                productsHtml.push(productHtml(product));
            });
            htmls.push('<div class="shop-group-item">');
            htmls.push(shopHtml);
            htmls.push('    <ul class="shp-cart-list">');
            htmls.push(productsHtml.join("\n"));
            htmls.push('    </ul>');
            htmls.push('</div>');
        });
        return htmls.join("\n");
    }

    ShoppingCart.prototype.initUI = function () {

        if(this.data === undefined || !$.isArray(this.data)) {
            this.currentComponent.append(emptyCartHtml());
        }

        var shopHead = ['<div id="notEmptyCart" style="display:block">',
            '    <div class="shop-group">'].join("\n");
        var allHtml = [];
        allHtml.push(shopHead);
        allHtml.push(this.shopsHtml());
        allHtml.push('    </div>\n</div>');
        allHtml.push(payHtml(this.data));
        this.currentComponent.append(allHtml.join("\n"));

        $('a[id^="subnum"], a[id^="addnum"]').bind('click',function() {
            if($(this).hasClass('disabled')) {
                return;
            }
            var id = $(this).attr("id"),
                productid = $(this).attr("id").substring(6),
                subnum = $("#subnum" + productid),
                num = $("#num" + productid),
                addnum = $("#addnum" + productid);
            if(id.indexOf('subnum') > -1) {
                num.val(parseInt(num.val()) - 1);
                addnum.removeClass('disabled');
            }
            else if(id.indexOf('addnum') > -1) {
                num.val(parseInt(num.val()) + 1);
                subnum.removeClass('disabled');
            }

            if(num.val() == 1) {
                $(this).addClass('disabled');
            }
            if(num.val() == num.data('stock')) {
                $(this).addClass('disabled');
            }
            win._calcTotalPrice();
        });

        $('input[id^="num"]').bind('input', function () {
            var r = /^\+?[1-9][0-9]*$/;
            if(!r.test($(this).val())) {
                alert('请输入有效整数.');
                $(this).val(1);
            }
            else {
                if(parseInt($(this).val()) > parseInt($(this).data('stock'))) {
                    alert('输入的值超过最大库存，已调整为最大库存数.');
                    $(this).val($(this).data('stock'));
                }
            };
            var id = $(this).attr("id"),
                productid = $(this).attr("id").substring(3)
                subnum = $("#subnum" + productid),
                num = $("#num" + productid),
                addnum = $("#addnum" + productid);
            if(num.val() == 1) {
                subnum.addClass('disabled');
            }
            else if(num.val() > 1) {
                subnum.removeClass('disabled');
            }
            if(num.val() == num.data('stock')) {
                addnum.addClass('disabled');
            }
            else if(parseInt(num.val()) < parseInt(num.data('stock'))) {
                addnum.removeClass('disabled');
            }
            win._calcTotalPrice();
        });

        var eventStr = this.currentComponent.attr("submit-event"),
            submit,
            data = win.deepClone(this.data),
            events;
        if(eventStr && eventStr.length > 0) {
            submit = decodeURIComponent(eventStr);
            events = JSON.parse(submit).events
        }
        $('#submit').bind('click',function() {
            var productids = [];
            $.each($('span[id^="checkproduct"]'), function (index, item) {
                if($(item).hasClass('checked')) {
                    productids.push($(item).attr('id').substring('checkproduct'.length));
                }
            });
            $.each(data, function (index, item) {
                item.products = $.grep(item.products, function(ele, index) {
                    return productids.join(",").indexOf(ele.id) > -1;
                });
                $.each(item.products, function (index1, item1) {
                    item1.number = $("#num" + item1.id).val();
                });
            });

            data = $.grep(data, function(ele, index) {
                return ele.products != undefined && ele.products.length > 0;
            });
            if(events !== undefined && events.length > 0) {
                $.each(events, function (index, event) {
                    var jscode = event.substring(event.indexOf('value=')+6);
                    if(jscode != undefined) {
                        eval(jscode);
                    }
                });
            }
            else {
                alert('未设置结算函数。');
            }


        });

    }

    $.fn.shoppingCart = function (option) {
        var value,
            args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {
            var $this = $(this),
                data = $this.data('shopping.cart'),
                options = $.extend({}, $this.data(),
                    typeof option === 'object' && option);

            if (typeof option === 'string') {

                if (!data) {
                    return;
                }

                value = data[option].apply(data, args);

                if (option === 'destroy') {
                    $this.removeData('shopping.cart');
                }
            }

            if (!data) {
                $this.data('shopping.cart', (data = new ShoppingCart(this)));
            }
        });

        return typeof value === 'undefined' ? this : value;
    };
    $.shoppingCartCleanData = function () {
        win.mscChildren = new Map();
        $.each($(".demo").find("div[type='m_shopping_cart']"), function (index, value) {
            var id = $(value).attr("compid");
            win.mscChildren.put(id, $(value).children());
            $(value).empty();
        });
    };
    $.shoppingCartRestoreData = function () {
        $.each($(".demo").find("div[type='m_shopping_cart']"), function (index, value) {
            var id = $(value).attr("compid");
            $(value).empty();
            $(value).append(win.mscChildren.get(id));
            win.mscChildren.remove(id);
        });
    };

    //默认初始化
    $(function () {
        if(!win.isDesignerMode) {
            $('div[type="m_shopping_cart"]').shoppingCart();
        }
    });

})(jQuery, window);
