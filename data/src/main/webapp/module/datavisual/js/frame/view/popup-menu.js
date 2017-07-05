
(function($, win){
	var PopupMenu = function () {
    };

	PopupMenu.prototype = {
        constructor: PopupMenu,

		onMenuItemClick: function (e) {
        	// 默认的处理方法
			this.hide();
		},

		showMenu: function (menuConfig) {
			this.element = $(menuConfig.element);		//触发菜单显示的dom原始，一般为包含有向下的箭头span
			this.parentEl = $("body");
			if (this.container == null || this.container == undefined) {
				this.container = $('<div class="popup-menu" style="display:none;"></div>').appendTo(this.parentEl);
			}

			var ctrlItem = menuConfig.ctrlItem;
			this.container.html("").append(this.getMenuHtml(menuConfig.menu, ctrlItem));

			// 处理菜单项popup-menu-item的点击事件
			this.container.on('click', 'div.popup-menu-item', $.proxy(this.onMenuItemClick, this));
			// 处理有子菜单的菜单项popup-menu-item的鼠标进出事件，用以显示子菜单
			this.container.find(".popup-menu").parent()
				.on('mouseover', $.proxy(this.showSubMenu, this))
				.on('mouseout', $.proxy(this.hideSubMenu, this));

			//////////////////////
            this.container.show();
            this.move();

			//点击界面其他区域时，隐藏菜单
            // Create a click proxy that is private to this instance , for unbinding
            this._outsideClickProxy = $.proxy(function (e) { this.outsideClick(e); }, this);
            // Bind global datepicker mousedown for hiding and
            $(document)
              .on('mousedown.popup-menu', this._outsideClickProxy)
              // also explicitly play nice with Bootstrap dropdowns, which stopPropagation when clicking them
              .on('click.popup-menu', '[data-toggle=dropdown]', this._outsideClickProxy)
              // and also close when focus changes to outside the picker (eg. tabbing between controls)
              .on('focusin.popup-menu', this._outsideClickProxy);
        },

		move: function () {
            var parentOffset = { top: 0, left: 0 };

			this.container.css({
				top: this.element.offset().top + this.element.outerHeight() - parentOffset.top,
            	left: this.element.offset().left - parentOffset.left,
            	right: 'auto'
            });

			if (this.container.offset().left + this.container.outerWidth() > $(window).width()) {
            	this.container.css({
                	left: 'auto',
					right: 0
				});
			}
        },

		outsideClick: function (e) {
            var target = $(e.target);
            // if the page is clicked anywhere except within the daterangerpicker/button
            // itself then call this.hide()
            if (
                target.closest(this.element).length ||
                target.closest(this.container).length
                ) return;
            this.hide();
        },

        hide: function (e) {
        	// 移除事件
            $(document)
              .off('mousedown.popup-menu')
              .off('click.popup-menu', '[data-toggle=dropdown]')
              .off('focusin.popup-menu');

            this.container.hide();
        },

		//submenu

		showSubMenu: function (e) {
			if (this.submenu) {
				this.hideSubMenu();
			}

			var target = e.currentTarget;
			this.submenu = $(target).find(".popup-menu");

			this.submenu.show();
			this.moveSubMenu();
		},

		hideSubMenu: function (e) {
			this.submenu.hide();
		},
		moveSubMenu: function () {
			var submenuParent = this.submenu.parent();

			//由于body定位的特殊，暂时用position似乎能获得正确的展示效果
			var parentOffset = {
				top: submenuParent.position().top - submenuParent.scrollTop(),
				left: submenuParent.position().left - submenuParent.scrollLeft()
			};

			this.submenu.css({
				top: parentOffset.top,
				left: parentOffset.left + submenuParent.outerWidth(),
				right: 'auto'
			});
		},

		getMenuHtml: function(menus, ctrlItem) {
			var menuContainer = $("<div>");

			_.forEach(menus, function(menu) {
				if (typeof menu == 'string' && menu == '-') {
					menuContainer.append(this.getMenuItemDivider());
				} else if (typeof menu == 'object') {
					var menuItem = $("<div>").addClass("popup-menu-item");
					menuContainer.append(menuItem);

					switch (menu.type) {
						case 'radio':
							menuItem.append(this.getMenuItemRadio(menu, ctrlItem));
							break;
						case 'normal':
							menuItem.append(this.getMenuItemNormal(menu, ctrlItem));
							break;
					}

					// 处理子菜单
					if (menu.menu) {
						menuItem.append('<div class="item-block"><span class="z3-arrow-right submenu-icon"></span></div>');

						var popupMenu = $("<div>").addClass("popup-menu").hide();
						popupMenu.append(this.getMenuHtml(menu.menu, ctrlItem));
						menuItem.append(popupMenu);
					}
				}
			}, this);

			return menuContainer;
		},

		getMenuItemDivider: function() {
			return $('<div class="popup-menu-item divider">' +
						'<hr />' +
					'</div>');
		},

		getMenuItemRadio: function(menu, ctrlItem) {
			var checked = "";
			var currentInputValue = ctrlItem.getOperationItem(menu.inputName);
			if (currentInputValue === menu.inputValue) {
				checked = "checked";
			}

			//var menuItem = $('<div class="item-block"><input type="radio" name="' + menu.inputName + '"' + checked + ' /><label>' + menu.text + '</label></div>');
			var that = this;
			var menuItem = $('<div class="item-block"><label>' + menu.text + '<input type="radio" name="' + menu.inputName + '"' + checked + ' /></label></div>');
			menuItem.on("click", function() {
				if (menu.handler) {
					menu.handler(ctrlItem);
				}
				that.hide();
				//防止事件传播到上传的 div.popup-menu-item，或者是label，或者是input
				return false;
			});

			return menuItem;
		},

		getMenuItemNormal: function(menu, ctrlItem) {
			var that = this;
			var menuItem = $('<div class="item-block"><label>' + menu.text + '</label></div>');
			menuItem.on("click", function() {
				if (menu.handler) {
					menu.handler(ctrlItem);
				}
				that.hide();
				return false;	//防止事件传播到上传的 div.popup-menu-item
			});

			return menuItem;
		}
	};

	win.PopupMenu = new PopupMenu();
})(jQuery, window);