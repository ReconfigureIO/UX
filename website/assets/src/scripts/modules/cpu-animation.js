/* --------------------------------------------------------------
   CPU Animation
-------------------------------------------------------------- */
var cpu = {

  cpuContainer     : $(".cpu-animation__icons"),
  cpuTrigger       : $(".cpu-animation__control__item"),

  init : function() {
    this.bindUI();
  },

  bindUI: function() {

    // Switch animation
    cpu.cpuTrigger.on('click', function() {
      cpu.toggleAnimation();
    });

  },

  toggleAnimation: function() {
    cpu.cpuTrigger.toggleClass('active');
    cpu.cpuContainer.toggleClass('fpgas cpu');
  }

};
