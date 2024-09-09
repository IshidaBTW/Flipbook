/*=============== ADD SHADOW HEADER ===============*/
const shadowHeader = () =>{
    const header = document.getElementById('header')
    // When the scroll is greater then 50 viewport heigth, add the scroo-header class to the header tag.
    this.scrollY >= 50 ? header.classList.add('shadow-header')
                        : header.classList.remove('shadow-header')
}
window.addEventListener('scroll', shadowHeader)
/*=============== SHOW SCROLL UP ===============*/ 
const scrollup = () =>{
    const scrollup = document.getElementById('scroll-up')
     // When the scroll is greater then 50 viewport heigth, add the scrool-up class to the scroll tag.
    this.scrollY >= 350 ? scrollup.classList.add('show-scroll')
                : scrollup.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollup)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')
    
const scrollActive = () =>{
  	const scrollDown = window.scrollY

	sections.forEach(current =>{
		const sectionHeight = current.offsetHeight,
			  sectionTop = current.offsetTop - 58,
			  sectionId = current.getAttribute('id'),
			  sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

		if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
			sectionsClass.classList.add('active-link')
		}else{
			sectionsClass.classList.remove('active-link')
		}                                                    
	})
}
window.addEventListener('scroll', scrollActive)

/*=============== DARK LIGHT THEME ===============*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'ri-sun-line'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/*=============== SCROLL REVEAL ANIMATION ===============*/

/*=============== FLIPBOOK ===============*/
function loadApp() {

  $('#canvas').fadeIn(1000);

  var flipbook = $('.magazine');
 
 if (flipbook.width()==0 || flipbook.height()==0) {
     setTimeout(loadApp, 10);
     return;
 }
 
 // flipbook
let page = 3;


 flipbook.turn({
         
         // Magazine width

         width: 922,

         // Magazine height

         height: 900,

         // Duration in millisecond

         duration: 1000,

         // Enables gradients

         gradients: true,
         
         // Auto center this flipbook

         autoCenter: true,

         // Elevation from the edge of the flipbook when turning a page

         elevation: 50,

         // The number of pages

         pages: page,

         // Events

         when: {
             turning: function(event, page, view) {
                 
                 var book = $(this),
                 currentPage = book.turn('page'),
                 pages = book.turn('pages');
         
                 // Update the current URI

                 Hash.go('page/' + page).update();

                 // Show and hide navigation buttons

                 disableControls(page);

             },

             turned: function(event, page, view) {

                 disableControls(page);

                 $(this).turn('center');

                 $('#slider').slider('value', getViewNumber($(this), page));

                 if (page==1) { 
                     $(this).turn('peel', 'br');
                 }

             },

             missing: function (event, pages) {

                 // Add pages that aren't in the magazine

                 for (var i = 0; i < pages.length; i++)
                     addPage(pages[i], $(this));

             }
         }

 });

 // Zoom.js

 $('.magazine-viewport').zoom({
     flipbook: $('.magazine'),

     max: function() { 
         
         return largeMagazineWidth()/$('.magazine').width();

     }, 

     when: {
         swipeLeft: function() {

             $(this).zoom('flipbook').turn('next');

         },

         swipeRight: function() {
             
             $(this).zoom('flipbook').turn('previous');

         },

         resize: function(event, scale, page, pageElement) {

             if (scale==1)
                 loadSmallPage(page, pageElement);
             else
                 loadLargePage(page, pageElement);

         },

         zoomIn: function () {

             $('#slider-bar').hide();
             $('.made').hide();
             $('.magazine').removeClass('animated').addClass('zoom-in');
             $('.zoom-icon').removeClass('zoom-icon-in').addClass('zoom-icon-out');
             
             if (!window.escTip && !$.isTouch) {
                 escTip = true;

                 $('<div />', {'class': 'exit-message'}).
                     html('<div>Press ESC to exit</div>').
                         appendTo($('body')).
                         delay(2000).
                         animate({opacity:0}, 500, function() {
                             $(this).remove();
                         });
             }
         },

         zoomOut: function () {

             $('#slider-bar').fadeIn();
             $('.exit-message').hide();
             $('.made').fadeIn();
             $('.zoom-icon').removeClass('zoom-icon-out').addClass('zoom-icon-in');

             setTimeout(function(){
                 $('.magazine').addClass('animated').removeClass('zoom-in');
                 resizeViewport();
             }, 0);

         }
     }
 });

 // Zoom event

 if ($.isTouch)
     $('.magazine-viewport').bind('zoom.doubleTap', zoomTo);
 else
     $('.magazine-viewport').bind('zoom.tap', zoomTo);


 // Using arrow keys to turn the page

 $(document).keydown(function(e){

     var previous = 37, next = 39, esc = 27;

     switch (e.keyCode) {
         case previous:

             // left arrow
             $('.magazine').turn('previous');
             e.preventDefault();

         break;
         case next:

             //right arrow
             $('.magazine').turn('next');
             e.preventDefault();

         break;
         case esc:
             
             $('.magazine-viewport').zoom('zoomOut');	
             e.preventDefault();

         break;
     }
 });

 // URIs - Format #/page/1 

 Hash.on('^page\/([0-9]*)$', {
     yep: function(path, parts) {
         var page = parts[1];

         if (page!==undefined) {
             if ($('.magazine').turn('is'))
                 $('.magazine').turn('page', page);
         }

     },
     nop: function(path) {

         if ($('.magazine').turn('is'))
             $('.magazine').turn('page', 1);
     }
 });


 $(window).resize(function() {
     resizeViewport();
 }).bind('orientationchange', function() {
     resizeViewport();
 });

 // Regions

 if ($.isTouch) {
     $('.magazine').bind('touchstart', regionClick);
 } else {
     $('.magazine').click(regionClick);
 }

 // Events for the next button

 $('.next-button').bind($.mouseEvents.over, function() {
     
     $(this).addClass('next-button-hover');

 }).bind($.mouseEvents.out, function() {
     
     $(this).removeClass('next-button-hover');

 }).bind($.mouseEvents.down, function() {
     
     $(this).addClass('next-button-down');

 }).bind($.mouseEvents.up, function() {
     
     $(this).removeClass('next-button-down');

 }).click(function() {
     
     $('.magazine').turn('next');

 });

 // Events for the next button
 
 $('.previous-button').bind($.mouseEvents.over, function() {
     
     $(this).addClass('previous-button-hover');

 }).bind($.mouseEvents.out, function() {
     
     $(this).removeClass('previous-button-hover');

 }).bind($.mouseEvents.down, function() {
     
     $(this).addClass('previous-button-down');

 }).bind($.mouseEvents.up, function() {
     
     $(this).removeClass('previous-button-down');

 }).click(function() {
     
     $('.magazine').turn('previous');

 });


 // Slider

 $( "#slider" ).slider({
     min: 1,
     max: numberOfViews(flipbook),

     start: function(event, ui) {

         if (!window._thumbPreview) {
             _thumbPreview = $('<div />', {'class': 'thumbnail'}).html('<div></div>');
             setPreview(ui.value);
             _thumbPreview.appendTo($(ui.handle));
         } else
             setPreview(ui.value);

         moveBar(false);

     },

     slide: function(event, ui) {

         setPreview(ui.value);

     },

     stop: function() {

         if (window._thumbPreview)
             _thumbPreview.removeClass('show');
         
         $('.magazine').turn('page', Math.max(1, $(this).slider('value')*2 - 2));

     }
 });

 resizeViewport();

 $('.magazine').addClass('animated');

}

// Zoom icon

$('.zoom-icon').bind('mouseover', function() { 
  
  if ($(this).hasClass('zoom-icon-in'))
      $(this).addClass('zoom-icon-in-hover');

  if ($(this).hasClass('zoom-icon-out'))
      $(this).addClass('zoom-icon-out-hover');

}).bind('mouseout', function() { 
  
   if ($(this).hasClass('zoom-icon-in'))
      $(this).removeClass('zoom-icon-in-hover');
  
  if ($(this).hasClass('zoom-icon-out'))
      $(this).removeClass('zoom-icon-out-hover');

}).bind('click', function() {

  if ($(this).hasClass('zoom-icon-in'))
      $('.magazine-viewport').zoom('zoomIn');
  else if ($(this).hasClass('zoom-icon-out'))	
     $('.magazine-viewport').zoom('zoomOut');

});

$('#canvas').hide();


// Load the HTML4 version if there's not CSS transform

yepnope({
 test : Modernizr.csstransforms,
 yep: ['assets/lib/turn.min.js'],
 nope: ['assets/lib/turn.html4.min.js', 'assets/css/jquery.ui.html4.css'],
 both: ['assets/lib/zoom.min.js', 'assets/css/jquery.ui.css', 'assets/js/magazine.js', 'assets/css/magazine.css'],
 complete: loadApp
});