/* --------------------------------------------------------------
   Navigation
-------------------------------------------------------------- */
var navigation = {

  mainNavWrapper      : $(".header__navigation"),
  mainNavTrigger      : $(".nav-trigger"),
  mainNavClose        : $(".nav-close"),

  init : function() {
    this.bindUI();
  },

  bindUI: function() {

    // Show Main Nav
    navigation.mainNavTrigger.on('click', function() {
      navigation.toggleMainNav();
      event.preventDefault();
    });

    // Hide Main Nav
    navigation.mainNavClose.on('click', function() {
      navigation.toggleMainNav();
      event.preventDefault();
    });

  },

  toggleMainNav: function() {
    navigation.mainNavWrapper.toggleClass('active');
  }

};
