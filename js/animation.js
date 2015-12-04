if ( $(window).width() > 769){
$(document).ready(function(){
  if($(window).height() == $(document).height()){
    $("#toggle-footer").fadeIn("slow");
  }
  $(window).scroll(function(){
   if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
     $("#toggle-footer").fadeIn("slow");
   }
   else {
     $("#toggle-footer").fadeOut("slow");
     $("#hideable-footer").fadeOut("slow");
   }
 });

  $("#toggle-footer").click(function(){
      $("#hideable-footer").animate({
        height: "toggle",
        opacity: "toggle",
        duration: "slow"
      });
      $("#toggle-footer").toggleClass("glyphicon glyphicon-menu-down", 1000)
      .toggleClass("glyphicon glyphicon-menu-up", 1000);

  });

  window.addEventListener("scroll", function() {
      if (window.scrollY > 250) {
          $('.masthead').fadeOut();
      }
      else {
          $('.masthead').fadeIn();
      }
  },false);
  $(function(){ // document ready


});
});
}