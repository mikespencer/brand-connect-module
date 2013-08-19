var wpAd = wpAd || {};
wpAd.BrandConnectModule = (function($){

  'use strict';

  //jQuery safety check
  if(!$){
    return function(){
      if(window.console){
        console.log('$ is not defined, brand connect module did not load.');
      }
    };
  }

  /**
   * Constructor. Generates and renders a Brand Connect Module.
   * @param {Object} config Object of config settings to be passed in.
   */
  function BrandConnectModule(config){
    this.config = $.extend({

      // REQUIRED CONFIG:

      // jQuery selector/object or DOM element to append/prepend content to.
      target: null,

      // URL to HTML content to load in.
      content: null,


      // OPTIONAL CONFIG W/ DEFAULTS:

      // Appends content by default. Change to true to prepend to target instead
      prepend: false,

      // Prepended click tracking url.
      clickTracker: '',

      // Prepended click tracking url.
      impressionPixels: [],

      // Class name for wrapping div that is prepended/appended to container and content will be loaded in to.
      containerClass: 'wpad-bc-module'

    }, config);

    this.$target = $(config.target);
    this.init();
  }

  BrandConnectModule.prototype = {

    /**
     * This is called first of all. Calls functions to do setup work
     */
    init: function(){
      this.buildContainer(this.config.containerClass);
      this.injectContent(this.$container, this.config.content);
    },

    /**
     * Builds the container element that the html will be injected in to. This element is later
     * appended (or prepended) to this.config.target.
     * @param {String} containerClass The class name given to the container element.
     */
    buildContainer: function(containerClass){
      var fn = this.config.prepend ? 'prependTo' : 'appendTo';
      this.$container = $('<div class="' + containerClass + '"></div>');
      this.$container[fn](this.$target);
    },

    /**
     * Inject content from this.config.content into this.$container via $.load method. Cross domain
     * restrictions apply.
     * @param {jQuery Object|String|Dom Element} container Element that receives the html content.
     * @param {String} url URL to the location of the html content
     */
    injectContent: function(container, url){
      var root = this;
      $(container).load(url, function(html){
        root.contentLoaded.call(root, html);
      });
    },

    /**
     * Callback function from the $.load function. Adds any impression pixels, as well as click trackers.
     * @param {String} html String of html loaded from this.config.content.
     */
    contentLoaded: function(html){
      this.html = html;
      var l = this.config.impressionPixels.length;
      if(this.config.clickTracker){
        this.addClickTracking();
      }
      if(l){
        while(l--){
          this.addPixel(this.config.impressionPixels[l]);
        }
      }
    },

    /**
     * Loops through loaded content and prepends click trackers to each <a> element's href attribute.
     */
    addClickTracking: function(){
      var root = this;
      this.$container.find('a').each(function(i, el){
        var $this = $(this),
          href = $this.attr('href');
        if(href){
          $this.attr('href', root.config.clickTracker + href);
        }
      });
    },

    /**
     * Utility function to add an impression pixel. Appended to this.$container.
     * @param {String} url Impression pixel URL.
     */
    addPixel: function(url){
      this.$container.append('<img src="' + url + '" height="1" width="1" alt="" style="display:none;border:0" />');
    }
  };

  return BrandConnectModule;

})(window.jQuery);
