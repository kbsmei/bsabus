$(document).ready(function () {
    (function ($) {
        $.fn.imageSlider = function (options) {

            var settings = $.extend({
                // These are the defaults
                dots: false,
                arrows: true,
                time: 5000,
                animation: "fade"

            }, options);

            return this.each(function () {
                var self = $(this);
                var sliderLength = self.children('li').length;
                var timer = parseInt(settings.time, 10);

                if (settings.animation === "slide") {
                    self.addClass('slide-animation');
                }

                //self.addClass('slider-box').wrap("<div class='slidesCont'></div>");

                //===== SLIDES BACKGROUND =====
                // Gets img src attribute and set it as a background of li element
                self.children('li').children('img').each(function () {
                    var imgURL = $(this).attr('src');
                    $(this).parent('li').css('background-image', 'url(' + imgURL + ')');
                });

                //===== DOTS =====
                //Dots list add to html
                if (settings.dots === true) {
                    self.after('<ul class="slider-dots"></ul>');
                    var dotsContainer = self.parent().children('.slider-dots');
                    for (var i = 0; i < sliderLength; i++) {
						dot = $('<li>');
						dot.click(function(){
							clearInterval(interval);
							dotsContainer.children('li').removeClass('current');
							clickedIndex = $(this).addClass('current').index();
							current = self.children('li.current');
							next = self.children('li').eq(clickedIndex);							
							next.fadeIn(function () {$(this).addClass('current');});
                            current.fadeOut(function () {$(this).removeClass('current');});
							startLoop();
						});
                        dotsContainer.append(dot);
                    }
                    dotsContainer.children('li').eq(0).addClass('current');
                }

                //===== ARROWS =====
                if (settings.arrows === true) {
                    self.after(' <a class="arrows prev-arrow" href="#"></a><a class="arrows next-arrow" href="#"></a>');
                }

                // only 2 item in the list and "slide" animation type
                if (settings.animation === "slide" && self.children().length === 2) {
                    self.children('li').clone().appendTo(self);
                    self.children('li:not(:first)').removeClass('current');
                }

                // a condition checking if slider contains 2 or more items
                if (self.children().length >= 2) {

                    // slide change function with normalDirection parameter 
                    var changeSlide = function (normalDirection) {
                        var current = self.children('li.current');
                        var next;
                        if (normalDirection === false) {
                            next = current.prev();
                        } else {
                            next = current.next();
                        }
                        var slideIndex = self.children('li.current').index();


                        // Slider without any transition
                        if (settings.animation === "basic") {
                            next.addClass('current');
                            current.removeClass('current');
                            //If normalDirection is set to true, set direction of slides from right to left, else set from left to right
                            if (normalDirection === true) {
                                if (slideIndex + 1 === sliderLength) {
                                    self.children('li:first').addClass('current');
                                }
                            } else {
                                if (slideIndex === 0) {
                                    self.children('li:last').addClass('current');
                                }
                            }
                        }


                        //Slider with fadeIn/fadeOut animation
                        if (settings.animation === "fade") {
                            next.fadeIn(function () {
                                $(this).addClass('current');
                            });
                            current.fadeOut(function () {
                                $(this).removeClass('current');
                            });

                            if (normalDirection === true) {
                                if (slideIndex + 1 === sliderLength) {
                                    self.children('li:first').fadeIn(function () {
                                        $(this).addClass('current');
                                    });
                                }
                            } else {
                                if (slideIndex === 0) {
                                    self.children('li:last').fadeIn(function () {
                                        $(this).addClass('current');
                                    });
                                }
                            }
                        }


                        //Slider with slide animation
                        if (settings.animation === "slide") {
                            self.children('li').removeClass('prev');
                            current.addClass('prev').removeClass('current');
                            next.addClass('current');

                            if (normalDirection === true) {
                                if (slideIndex + 1 === sliderLength) {
                                    self.children('li:first').addClass('current');
                                }
                            } else {
                                if (slideIndex === 0) {
                                    self.children('li:last').addClass('current');
                                }
                            }
                        }


                        //Change current dot depending on which slide is showing at the moment
                        if (settings.dots === true) {
                            dotsContainer.children('li.current').removeClass('current');
                            if (normalDirection === true) {
                                if (next.length > 0) {
                                    dotsContainer.children('li').eq(next.index()).addClass('current');
                                } else {
                                    dotsContainer.children('li:first').addClass('current');
                                }
                            } else {
                                if (next.length > 0) {
                                    dotsContainer.children('li').eq(next.index()).addClass('current');
                                } else {
                                    dotsContainer.children('li:last').addClass('current');
                                }
                            }
                        }
                    };


                    // start slider loop
                    var interval;
                    function startLoop() {
                        interval = setInterval(function () {
                            changeSlide(true);
                        }, timer);
                    }
                    startLoop();

                    // changing slides on click at arrow button
                    if (settings.arrows === true) {
                        self.parent('.slidesCont').children('.next-arrow').on('click', function (event) {
                            event.preventDefault();
                            clearInterval(interval);
                            changeSlide(true);
                            startLoop();

                        });

                        self.parent('.slidesCont').children('.prev-arrow').on('click', function (event) {
                            event.preventDefault();
                            clearInterval(interval);
                            changeSlide(false);
                            startLoop();
                        });
                    }


                    //===== HAMMER PLUGIN WITH SWIPE EVENT =====
                    if (typeof Hammer !== "undefined") {
                        var hammertime = new Hammer(self[0]);
                        hammertime.on('swipeleft', function () {
                            clearInterval(interval);
                            changeSlide(true);
                            startLoop();
                        });
                        hammertime.on('swiperight', function () {
                            clearInterval(interval);
                            changeSlide(false);
                            startLoop();
                        });
                    }

                }

            });
        }
    }(jQuery));
});
