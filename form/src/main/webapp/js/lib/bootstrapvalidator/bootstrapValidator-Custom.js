;(function($) {
    $.fn.bootstrapValidator.i18n.dateLessThan = $.extend($.fn.bootstrapValidator.i18n.dateLessThan || {}, {
        'default': '请输入小于%s的时间'
    });

    $.fn.bootstrapValidator.validators.dateLessThan = {
        html5Attributes: {
            message: 'message',
            field: 'field'
        },
		

        /**
         * Return true if the input value is different with given field's value
         *
         * @param {BootstrapValidator} validator The validator plugin instance
         * @param {jQuery} $field Field element
         * @param {Object} options Consists of the following key:
         * - field: The name of field that will be used to compare with current one
         * - message: The invalid message
         * @returns {Boolean}
         */
        validate: function(validator, $field, options) {
            var value = $field.val();
            if (value === '') {
                return true;
            }

            var fields  = options.field.split(','),
                isValid = true,
				compareTo = validator.getFieldElements(fields[0]).val();

            for (var i = 0; i < fields.length; i++) {
			
                var compareWith = validator.getFieldElements(fields[i]);
                if (compareWith == null || compareWith.length === 0) {
                    continue;
                }

                var compareValue = compareWith.val();
                if (moment(value) > moment(compareValue)) {
                    isValid = false;
					compareTo = compareValue;
                }else if (compareValue !== ''){
					validator.updateStatus(compareWith, validator.STATUS_VALID, 'dateGreaterThan');
					//validator.updateStatus($field, validator.STATUS_VALID, 'dateLessThan');
				}

				
            }
			if(compareTo){
				$field.data("DateTimePicker").maxDate(moment(compareTo)).date(moment(value));
			}
			
			
            return isValid ?
					isValid:
					{
                        valid: isValid,
                        message: $.fn.bootstrapValidator.helpers.format(options.message || $.fn.bootstrapValidator.i18n.dateLessThan['default'], compareTo)
                    };
        }
    };
}(window.jQuery));
;(function($) {
    $.fn.bootstrapValidator.i18n.dateGreaterThan = $.extend($.fn.bootstrapValidator.i18n.dateGreaterThan || {}, {
        'default': '请输入大于%s的时间'
    });

    $.fn.bootstrapValidator.validators.dateGreaterThan = {
        html5Attributes: {
            message: 'message',
            field: 'field'
        },
		

        /**
         * Return true if the input value is different with given field's value
         *
         * @param {BootstrapValidator} validator The validator plugin instance
         * @param {jQuery} $field Field element
         * @param {Object} options Consists of the following key:
         * - field: The name of field that will be used to compare with current one
         * - message: The invalid message
         * @returns {Boolean}
         */
        validate: function(validator, $field, options) {
            var value = $field.val();
            if (value === '') {
                return true;
            }

            var fields  = options.field.split(','),
                isValid = true,
				compareTo = validator.getFieldElements(fields[0]).val();

            for (var i = 0; i < fields.length; i++) {
                var compareWith = validator.getFieldElements(fields[i]);
                if (compareWith == null || compareWith.length === 0) {
                    continue;
                }

                var compareValue = compareWith.val();
                if (moment(value) < moment(compareValue)) {
                    isValid = false;
					compareTo = compareValue;
                }else if (compareValue !== ''){
					validator.updateStatus(compareWith, validator.STATUS_VALID, 'dateLessThan');	
					//validator.updateStatus($field, validator.STATUS_VALID, 'dateGreaterThan');					
				} 
				
            }
			if(compareTo){
				$field.data("DateTimePicker").minDate(moment(compareTo)).date(moment(value));
			}
			
			
            return isValid ?
					isValid:
					{
                        valid: isValid,
                        message: $.fn.bootstrapValidator.helpers.format(options.message || $.fn.bootstrapValidator.i18n.dateGreaterThan['default'], compareTo)
                    };
        }
    };
}(window.jQuery));