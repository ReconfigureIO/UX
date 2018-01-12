/* --------------------------------------------------------------
   Accordion
-------------------------------------------------------------- */
var accordion = {

  accordionContainer     : $(".accordion"),
  accordionHeader        : $(".accordion__title"),
  accordionContent       : $(".accordion__content"),

  init : function() {
    this.bindUI();
  },

  bindUI: function() {

    // Show/Hide Accordion Content
    accordion.accordionHeader.on('click', function() {
      accordion.showAccordionContent(this);

      event.preventDefault();
    });

  },

  showAccordionContent: function(selector) {
    if($(selector).parent().hasClass('active')) {
      $(selector).parent().removeClass('active');
    } else {
      accordion.accordionContainer.removeClass('active');
      $(selector).parent().addClass('active');
    }
  }

};
