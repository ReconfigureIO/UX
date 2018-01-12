/* --------------------------------------------------------------
   Feature Animation
-------------------------------------------------------------- */
var featureAnim = {

  animationContainer     : $(".feature-animation .wrapper"),
  animationDots          : $(".feature-animation__dots .dot"),
  currentStep            : 0,
  direction              : 'forwards',

  init : function() {
    this.bindUI();
  },

  bindUI: function() {

    // Init Animation
    featureAnim.initAnimation();

  },

  initAnimation: function() {
    setInterval(function() {
      // Add deactive class to current step and remove active class
      featureAnim.animationDots.eq(featureAnim.currentStep).addClass('deactivate').removeClass('active');

      // Check current direction
      if(featureAnim.direction === 'forwards') {
        if(featureAnim.currentStep === 20) {
          featureAnim.direction = 'backwards';
        } else if(featureAnim.currentStep === 6) {
          featureAnim.animationContainer.removeClass('step--1');
          featureAnim.animationContainer.addClass('step--2');
        } else if(featureAnim.currentStep === 13) {
          featureAnim.animationContainer.removeClass('step--2');
          featureAnim.animationContainer.addClass('step--3');
        }
      } else if(featureAnim.direction === 'backwards') {
        if(featureAnim.currentStep === 0) {
          featureAnim.direction = 'forwards';
        } else if(featureAnim.currentStep === 13) {
          featureAnim.animationContainer.removeClass('step--3');
          featureAnim.animationContainer.addClass('step--2');
        } else if(featureAnim.currentStep === 6) {
          featureAnim.animationContainer.removeClass('step--2');
          featureAnim.animationContainer.addClass('step--1');
        }
      }

      // Check current direction
      if(featureAnim.direction === 'forwards') {
        featureAnim.currentStep++;
      } else if(featureAnim.direction === 'backwards') {
        featureAnim.currentStep--;
      }
      featureAnim.animationDots.removeClass('deactivate');

      // Add active class to new current step
      featureAnim.animationDots.eq(featureAnim.currentStep).addClass('active');
    }, 250);
  }

};
