/**
 * Created by 10089289 on 2017/2/8.
 */
;(function ($, global) {
    function Layout12(defProperties, propertyValues) {
        this.defProperties = defProperties;
		
		this.propertyValues = propertyValues || this._getDefaultPropertyValues();
    }

    Layout12.prototype = {
        getDesignHtml: function(name) {
			if (this.jqueryWrapper) {
				return this.jqueryWrapper;
			}
			
			var html = [];
			html.push('<div class="bc-white" data-comp-name="' + name + '" >');
			html.push('<div class="row">');
			for (var i = 0; i < this.propertyValues.innerContainers.length; i++) {
				var ic = this.propertyValues.innerContainers[i];
				html.push(this._createInnerContainerHtml(ic.id, ic.ratio));
			}
			html.push('</div>');
			html.push('</div>');

			this.jqueryWrapper = $(html.join(""));
			//this.jqueryWrapper.find(".droppable-component").data("component-wrapper", this.compWrapper);

			return this.jqueryWrapper;
			
			/*
            return '<div class="bc-white" data-comp-name="'+name+'" >'+
				        '<div class="row">'+
				            '<div class="col-md-12 col-xs-12 col-sm-12 col-lg-12 column design-container"></div>'+
				        '</div>'+
				    '</div>';
					*/
        },
		
		getDesignFileContent: function() {
			var data = $.extend({}, this.propertyValues);
			data["name"] = "layout12";
			data["type"] = "";

			return data;
		},
        
        getRuntimeHtml: function($thisDom) {

        },

        dragEvent: function () {

        },

        getRuntimeCode: function(properties) {

        },
        
        eventFocusout: function (event) {
            alert(event);
        },

		getInnerContainerIds: function() {
			var ids = [];
			for (var i = 0; i <  this.propertyValues.innerContainers.length; i++) {
				ids.push(this.propertyValues.innerContainers[i].id);
			}

			return ids;
		},

		_getDefaultPropertyValues: function() {
			var defaultValues = {
				properties: {
					ratio: '12'
				}
			};

			defaultValues["innerContainers"] = this._getInnerContainerJson(defaultValues.properties.ratio);

			return defaultValues;
		},
		
		_getInnerContainerJson: function (ratio) {
			ratio = ratio.split(',');

			var innerContainers = [];
			for (var i = 0; i < ratio.length; i++) {
				var colRatio = parseInt(_.trim(ratio[i]));

				innerContainers.push({
					id : global.designerView.newId(),
					ratio: colRatio
				})
			}

			return innerContainers;
		},
		
		_createInnerContainerHtml: function (id, ratio) {
			//return '<div class="col-md-12 col-xs-12 col-sm-12 col-lg-12 column design-container"></div>';
			return '<div id="' + id + '" class="' + this._createInnerContainerHtmlClass(ratio) + '"></div>';
		},
		
		_createInnerContainerHtmlClass: function (ratio) {
			return 'col-md-' + ratio +
				' col-xs-' + ratio +
				' col-sm-' + ratio +
				' col-lg-' + ratio +
				' column design-container';
		}

    }

    if(!global.appCompoent) {
        global.appCompoent = {};
    }
    global.appCompoent.Layout12 = Layout12;
})
(jQuery, window);