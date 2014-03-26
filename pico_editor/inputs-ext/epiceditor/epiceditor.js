/**
Bootstrap epiceditor editor.

@class epicedit
@extends abstractinput
@final
@since 1.4.0
**/
(function ($) {
    "use strict";
    
    var epicedit = function (options) {
        this.init('epicedit', options, epicedit.defaults);
    };

    $.fn.editableutils.inherit(epicedit, $.fn.editabletypes.abstractinput);
	
    $.extend(epicedit.prototype, {
        render: function () {
        },

		postrender: function() {
			//$(this.$input[1]).html(this.options.rawcontent);
			var opts = {
				container: this.$input[0],
				basePath: this.options.basepath,
				clientSideStorage: true,
				localStorageName: 'epicedit',
				useNativeFullscreen: true,
				parser: marked,
				file: {
					name: this.options.filename,
					defaultContent: 'Amazing content goes here!',
					autoSave: 100
				},
				theme: {
					base: '/themes/base/epiceditor.css',
					preview: '/themes/preview/preview-dark.css',
					editor: '/themes/editor/epic-dark.css'
				},
				button: {
					preview: true,
					fullscreen: true,
					bar: "auto"
				},
				focusOnLoad: true,
				shortcut: {
					modifier: 18,
					fullscreen: 70,
					preview: 80
				},
				string: {
					togglePreview: 'Toggle Preview Mode',
					toggleEdit: 'Toggle Edit Mode',
					toggleFullscreen: 'Enter Fullscreen'
				},
				autogrow: true
			};
			console.log(opts);
			this.editor = new EpicEditor(opts).load();
			this.editor.importFile(this.options.filename, this.options.rawcontent);
		},
		
        value2html: function(value, element) {
			$(element).html(this.editor.getElement('previewer').body);
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

    epicedit.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        /**
        @property tpl
        @default <div></div>
        **/
        tpl:'<div style="width: 617px"></div>',
        /**
        @property inputclass
        @default editable-epicedit
        **/
        inputclass: 'editable-epicedit',
        /**
        Placeholder attribute of input. Shown when input is empty.

        @property placeholder
        @type string
        @default null
        **/
        placeholder: null,
        /**
        epicedit default options.  
        See https://github.com/jhollingworth/bootstrap-epicedit#options

        @property epicedit
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
        /**
        Base path to assets.

        @property basepath
        @type string
        @default null
        **/
        basepath: 'epicedit',
		/**
        Filename of content source

        @property filename
        @type string
        @default null
        **/
        filename: null,
        epicedit: {
            stylesheets: false //see https://github.com/jhollingworth/bootstrap-epicedit/issues/183
        }
    });

    $.fn.editabletypes.epicedit = epicedit;

}(window.jQuery));