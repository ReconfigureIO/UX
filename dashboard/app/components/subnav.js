/* --------------------------------------------------------------
   Sub Nav
-------------------------------------------------------------- */
var subnav = {

  anchorTrigger     : $(".sub-nav--anchor a"),
  tabTrigger        : $(".sub-nav--tabs a"),

  init : function() {
    this.bindUI();
  },

  bindUI: function() {

    // Scroll to anchor on load
    var hash = window.location.hash;
    if(hash.length) {
      subnav.scrollToAnchor(hash);
    }

    // Scroll to anchor on click
    subnav.anchorTrigger.on('click', function() {
      subnav.scrollToAnchor($(this).attr('href'));
      event.preventDefault();
    });

    // Select tab on click
    subnav.tabTrigger.on('click', function() {
      subnav.selectTab($(this));
    });

  },

  scrollToAnchor: function(selector) {
    var aTag = $(selector);
    $('html,body').animate({
      scrollTop: aTag.offset().top
    }, 1500);
  },

  selectTab: function(selector) {
    // Remove current active class on tab and selector
    $('.nav-tabs__tab').removeClass('active');
    subnav.tabTrigger.removeClass('active');
    
    // Add new active class on tab and selector
    $('.nav-tabs__tab[data-id='+$(selector).data('id')+']').addClass('active');
    $(selector).addClass('active');
  }

};
