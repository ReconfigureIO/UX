/* --------------------------------------------------------------
   Masonry
-------------------------------------------------------------- */
var masonry = {

  masonryContainer     : $(".masonry"),
  masonryItem          : ".masonry__item",

  init : function() {
    this.bindUI();
  },

  bindUI: function() {

    // Add masonry
    if(masonry.masonryContainer.length) {
      masonry.masonryContainer.isotope({
        itemSelector: masonry.masonryItem,
        columnWidth: masonry.masonryItem,
        percentPosition: true
      });
    }

  }

};
