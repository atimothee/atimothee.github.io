var boxedElem = 'nav ul li'; // try changing this to 'nav ul' for a slightly different nav style!

$(function() {
	var curPage = setupPage();

	// Animate some css styles on scroll
	$(document).scroll(function() {
		var y = $(this).scrollTop();        
		moveElements(y);
		highlightNav(y);
	});

	// This block of code allows for endless no-click pagination
	if (window.location.pathname == '/') {
		if ($('.next')) {
			$('.next').appear();
			var loaded = false;
			$(document.body).on('appear', '.next', function(e, $affected) {
				if (!loaded) {
					loaded = true;
					$('.next').fadeOut(function() {
						loadNextPage();
						curPage++;
						window.location.replace('#' + curPage);
						loaded = false;
					});
				}
			});
		}
	}	
});

function setupPage() {
	// for index page, reload pages that were loaded by endless pagination
	var curPage = 1;

	if (window.location.pathname == '/') {
		var position = parseInt(window.location.hash.slice(1, window.location.hash.slice.length));	
		if (!isNaN(position)) {
			for (var i = 0; i < position-1; i++) {
				curPage++;
				loadNextPage(curPage);
				$(window).scrollTop($('.next').offset().top);
			}
		}

		window.location.replace('#' + curPage);
	}
	moveElements($(window).scrollTop());
	highlightNav($(window).scrollTop());

	return curPage;
}

function loadDisqus(source, site_url, disqus_shortname, page_title) {
	var post_url = $(source).parent().parent().find('hgroup > h4 > a').attr('href');
	var url = site_url + post_url;

	if (window.DISQUS) {
	   $('.comments').css('display', 'block');
	   $('#disqus_thread').appendTo($(source).parent());
	   $(source).css('display', 'none');

	   DISQUS.reset({
	      reload: true,
	      config: function () {
	      this.page.identifier = page_title;
	      this.page.url = url;
	      this.page.title = page_title;
	      }
	   });
	} else {
		//insert a wrapper in HTML after the relevant "show comments" link
		$('.comments').css('display', 'block');
		$('<div id="disqus_thread"></div>').insertAfter(source);		
		$(source).css('display', 'none');
		var disqus_shortname = disqus_shortname;
		var disqus_identifier = page_title; //set the identifier argument
		var disqus_url = url; //set the permalink argument
		var disqus_title = page_title;
		//append the Disqus embed script to HTML
		var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
		dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
		$('head').append(dsq);
	}
}

function moveElements(y) {
	if (y <= 120) { 
			if ($('footer').css('display') == 'block') {
				if ($('body').height() > $(window).height() + 120) {
					$('footer').css('display', 'none');
				}

				$('header h1').css('display', 'block');

				if ($(window).width() > 643) {
					$('header h3').css('display', 'block');
				}
			}

		var newHeight = 180 - y;
		$('header').css('background-size', '100% ' + newHeight + 'px');
		$('header').css('height', newHeight + 'px');

		$('header h1').css('font-size', (1-(y/120)) * headerSize($(window).width(), 'h1') + 'px');
		$('header h3').css('font-size', (1-(y/120)) * headerSize($(window).width(), 'h3') + 'px');
		$('nav').css('top', (y/120)* -182 + 'px');
	} else {
		$('footer').css('display', 'block');

		$('header').css('background-size', '100% 60px');
		$('header').css('height', '60px');
		$('header h1').css('display', 'none');
		$('header h3').css('display', 'none');          

		$('nav').css('top', '-182px');          
	}
}

function highlightNav(y) {
	if (y >= 0 && y < 52) { // 52 px is the point at which the nav starts scrolling into the header
		$('header').css('z-index', 1);
		$('nav').css('z-index', 0);

		$(boxedElem).css('background-color', 'rgba(255, 255, 255, 0)');      
		$(boxedElem).css('border', 'none');

		$('nav ul li a').css('text-decoration', 'underline');   
	} else if (y >= 52 && y <= 120) {
		$('header').css('z-index', 0);
		$('nav').css('z-index', 1);

		$(boxedElem).css('background-color', 'rgba(204, 204, 204, ' + (y/120) * 0.7);

		if ($(boxedElem).css('border') == 'none') {
			$(boxedElem).css('border', '1px solid #333');

			$('nav ul li a').css('text-decoration', 'none');                    
		}
	} else if (y > 120) {
		$('header').css('z-index', 0);
		$('nav').css('z-index', 1);

		$(boxedElem).css('background-color', 'rgba(204, 204, 204, 0.7)');
		$(boxedElem).css('border', '1px solid #333');

		$('nav ul li a').css('text-decoration', 'none');
	}
}

// compute size of header based on current width.
// so the responsive design works with animation.
function headerSize(width, header) {
	if (width < 644) {
		return header == 'h1' ? 52: 40;
	} else if (width >= 644 && width < 1200) {
		return header == 'h1' ? 76 : 45;
	} else {
		return header == 'h1' ? 80 : 48;
	}
}

function loadNextPage(pageNum) {
	url = pageNum == null ? $('.next').attr('href') : '/page/'+pageNum;
	$.get(url, function(data) {
		$('.next').remove();
	 	$('section').append($(data).filter('section').children());

		$('.previous').css('display', 'none');		
	});
}