/**
Bootstrap markitup editor.

@class markitup
@extends abstractinput
@final
@since 1.4.0
**/
(function ($) {
    "use strict";
    
    var markitup = function (options) {
        this.init('markitup', options, markitup.defaults);
    };

    $.fn.editableutils.inherit(markitup, $.fn.editabletypes.abstractinput);

    $.extend(markitup.prototype, {		
        render: function () {

			var mySettings = {
				nameSpace: 'markdown',
				previewParserPath: '~/sets/markdown/preview.php',
				onShiftEnter: {keepDefault:false, openWith:'\n\n'},
				markupSet: [			
					{name:'Heading 1', key:"1", placeHolder:'Your title here...', closeWith:function(markItUp) { return miu.markdownTitle(markItUp, '=') } },
					{name:'Heading 2', key:"2", placeHolder:'Your title here...', closeWith:function(markItUp) { return miu.markdownTitle(markItUp, '-') } },
					{name:'Heading 3', key:"3", openWith:'### ', placeHolder:'Your title here...' },
					{name:'Heading 4', key:"4", openWith:'#### ', placeHolder:'Your title here...' },
					{separator:'---------------' },        
					{name:'Bold', key:"B", openWith:'**', closeWith:'**'},
					{name:'Italic', key:"I", openWith:'_', closeWith:'_'},
					{separator:'---------------' },
					{name:'Bulleted List', openWith:'- ' },
					{name:'Numeric List', openWith:function(markItUp) {
						return markItUp.line+'. ';
					}},
					{separator:'---------------' },
					{name:'Picture', key:"P", replaceWith:'![[![Alternative text]!]]([![Url:!:http://]!] "[![Title]!]")'},
					{name:'Link', key:"L", openWith:'[', closeWith:']([![Url:!:http://]!] "[![Title]!]")', placeHolder:'Your text to link here...' },
					{separator:'---------------'},    
					{name:'Quotes', openWith:'> '},
					{name:'Code Block / Code', openWith:'(!(\t|!|`)!)', closeWith:'(!(`)!)'}
				]
			};
		
			this.$input.markItUp(mySettings);
        },
       
        value2html: function(value, element) {
			this.options.rawcontent = value;
			// TODO: generate preview...
        },

        html2value: function(html) {
            return this.options.rawcontent;
        },
        
        value2input: function(value) {
			this.$input.html(this.options.rawcontent);
        }, 

        activate: function() {

        },
        
        isEmpty: function($element) {
            if($.trim($element.html()) === '') { 
                return true;
            } else if($.trim($element.text()) !== '') {
                return false;
            } else {
                //e.g. '<img>', '<br>', '<p></p>'
                return !$element.height() || !$element.width();
            } 
        }
    });

    markitup.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        /**
        @property tpl
        @default <textarea></textarea>
        **/
        tpl:'<textarea></textarea>',
        /**
        @property inputclass
        @default editable-markitup
        **/
        inputclass: 'editable-markitup',
        /**
        Placeholder attribute of input. Shown when input is empty.

        @property placeholder
        @type string
        @default null
        **/
        placeholder: null,
        /**
        markitup default options.  
        See https://github.com/jhollingworth/bootstrap-markitup#options

        @property markitup
        @type object
        @default {stylesheets: false}
        **/    
        /**
        Raw content attribute of input. Shown when input is empty.

        @property rawcontent
        @type string
        @default null
        **/
        rawcontent: null,		
        markitup: {
            stylesheets: false //see https://github.com/jhollingworth/bootstrap-markitup/issues/183
        }
    });

    $.fn.editabletypes.markitup = markitup;

}(window.jQuery));
