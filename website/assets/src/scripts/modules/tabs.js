/* --------------------------------------------------------------
   Tabs
-------------------------------------------------------------- */
var tabs = {

  tabContainer     : $(".tabs__content__tab"),
  tabImage         : $(".tabs__content__image #tab-image image"),

  init : function() {
    this.bindUI();
  },

  bindUI: function() {

    // Switch animation
    tabs.tabContainer.on('click', function(event) {
      if(!$(this).hasClass('active')) {
        tabs.toggleTab($(this));
      };

      event.preventDefault();
    });

  },

  toggleTab: function(selector) {
    // Remove class from tab and add active class to current selected one
    tabs.tabContainer.removeClass('active');
    $(selector).addClass('active');

    // Remove active class from current image and add active class to new image
    tabs.tabImage.removeClass('active');
    $(".tabs__content__image #tab-image image[data-id="+$(selector).data('id')+"]").addClass('active');
  }

};
