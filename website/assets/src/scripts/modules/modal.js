/* --------------------------------------------------------------
   Modals
-------------------------------------------------------------- */
var modal = {

  modalWindow         : $('.modal'),
  modalOpen           : $('.modal-trigger'),
  modalClose          : $('.modal__close'),

  init : function() {
    this.bindUI();
  },

  bindUI: function() {

    modal.modalOpen.on('click', function() {
      modal.modalActivate();
      event.preventDefault();
    });

  },

  modalActivate: function(selector) {
    $('body').addClass('no-scroll');
    modal.modalWindow.addClass('active');

    // Bind action to modal close
    $('.modal').on('click', function(event) {
      modal.modalDeactivate();
      event.preventDefault();
    });

    $('.modal__close').on('click', function(event) {
      modal.modalDeactivate();
      event.preventDefault();
    });

    $('.modal__wrapper').click(function(event){
        event.stopPropagation();
    });

    $(document).keyup(function(event) {
      if (event.keyCode == 27) {
        modal.modalDeactivate();
        event.preventDefault();
      }
    });
  },

  modalDeactivate: function() {
    $('body').removeClass('no-scroll');
    modal.modalWindow.removeClass('active');
    modal.modalContainer.html('');
    modal.modalLoader.addClass('active');
  }
};
