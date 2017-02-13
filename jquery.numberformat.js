;(function () {
  var NumberFormatter = function (element, options) {
    var _this;
    var separator = options.separator || ',';
    var useHidden = options.useHidden || true;
    var tmpNum;

    return {
      init: function () {
        _this = this;
        _this.cache();
        _this.bindEvents();
      },

      cache: function () {
        _this.$element = $(element);

        if (useHidden) {
          _this.$eleHidden = $('<input />', {
            type: 'hidden',
            name: _this.$element.attr('name'),
          });
          _this.$element.removeAttr('name').after(_this.$eleHidden);
        }
      },

      bindEvents: function () {
        _this.$element.on('keydown', _this.onKeydown);
        _this.$element.on('keyup', _this.onKeyup);
        _this.$element.on('paste', _this.onPaste);
      },

      onPaste: function () {
        return false;
      },

      onKeydown: function (e) {
        // Allow: backspace, delete, tab, escape, enter || Allow: home, end, left, right
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 || (e.keyCode >= 35 && e.keyCode <= 39)) {
          return;
        }

        var charValue = String.fromCharCode(e.keyCode);
        var valid = /^[0-9]+$/.test(charValue);

        if (!valid) {
          e.preventDefault();
        }
      },

      onKeyup: function (e) {
        var eleVal = _this.getNumber(_this.$element.val());

        if (tmpNum !== eleVal && eleVal.length > 3) {
          var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
          var strVal = String(eleVal);    //숫자 -> 문자변환
          tmpNum = eleVal;

          if (useHidden) {
            _this.$eleHidden.val(eleVal);
          }

          while (reg.test(strVal)) {
            strVal = strVal.replace(reg, '$1' + ',' + '$2');
          }

          _this.$element.val(strVal);
        }
      },

      getNumber: function () {
          return _this.$element.val().split(separator).join('');
        },
    };
  };

  /**
   * @param options {object}
   * <pre>
   *   - separator : default ','
   * </pre>
   * */
  $.fn.numberFormat = function (options) {
    return this.each(function () {
      var Component = new NumberFormatter(this, options || {});

      Component.init();
    });
  };
})();
