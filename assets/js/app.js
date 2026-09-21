(function(){
  var vis=document.getElementById('visionneuse'),
      img=document.getElementById('vis-img'),
      txt=document.getElementById('vis-txt'),
      photos=[], index=0, declencheur=null;

  function collecte(){ photos=[].slice.call(document.querySelectorAll('.vignette')); }
  collecte();

  function montre(i){
    if(!photos.length) return;
    index=(i+photos.length)%photos.length;
    var b=photos[index], im=b.querySelector('img');
    img.src=im.getAttribute('src');
    img.alt=im.getAttribute('alt')||'';
    var g=b.closest('.galerie');
    txt.textContent=(im.getAttribute('alt')||'')+(g?' — '+g.dataset.groupe:'');
  }
  function ouvre(i,src){
    declencheur=src||null;
    montre(i);
    vis.classList.add('actif');
    document.body.style.overflow='hidden';
    vis.querySelector('.fermer').focus();
  }
  function ferme(){
    vis.classList.remove('actif');
    document.body.style.overflow='';
    if(declencheur) declencheur.focus();
  }

  document.addEventListener('click',function(e){
    var v=e.target.closest('.vignette');
    if(v){ collecte(); ouvre(photos.indexOf(v),v); return; }
    if(e.target===vis){ ferme(); }
  });
  vis.querySelector('.fermer').addEventListener('click',ferme);
  vis.querySelector('.prec').addEventListener('click',function(){montre(index-1);});
  vis.querySelector('.suiv').addEventListener('click',function(){montre(index+1);});
  document.addEventListener('keydown',function(e){
    if(!vis.classList.contains('actif')) return;
    if(e.key==='Escape') ferme();
    else if(e.key==='ArrowLeft') montre(index-1);
    else if(e.key==='ArrowRight') montre(index+1);
  });

  var carousel = document.querySelector('.menu-carousel');
  if(carousel){
    var track = carousel.querySelector('.menu-carousel-track');
    var prevBtn = carousel.querySelector('.menu-carousel-btn.prev');
    var nextBtn = carousel.querySelector('.menu-carousel-btn.next');
    var dotsWrap = document.querySelector('.menu-carousel-dots');
    var slides = Array.prototype.slice.call(track.querySelectorAll('a'));
    var activeIndex = 0;
    var autoplayId = null;

    function setActiveItem(index){
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function(slide, i){
        slide.classList.toggle('is-active', i === activeIndex);
      });

      var target = slides[activeIndex];
      if(target){
        var left = target.offsetLeft - (track.clientWidth - target.offsetWidth) / 2;
        track.scrollTo({left: left, behavior: 'smooth'});
      }

      if(dotsWrap){
        Array.prototype.forEach.call(dotsWrap.children, function(dot, i){
          dot.classList.toggle('is-active', i === activeIndex);
        });
      }
    }

    function moveCarousel(direction){
      setActiveItem(activeIndex + direction);
    }

    function buildDots(){
      if(!dotsWrap || !slides.length) return;
      dotsWrap.innerHTML = '';
      slides.forEach(function(_, i){
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Afficher le métier ' + (i + 1));
        btn.addEventListener('click', function(){ setActiveItem(i); restartAutoplay(); });
        dotsWrap.appendChild(btn);
      });
      setActiveItem(activeIndex);
    }

    function restartAutoplay(){
      if(autoplayId) clearInterval(autoplayId);
      autoplayId = setInterval(function(){ moveCarousel(1); }, 3200);
    }

    if(prevBtn){ prevBtn.addEventListener('click', function(){ moveCarousel(-1); restartAutoplay(); }); }
    if(nextBtn){ nextBtn.addEventListener('click', function(){ moveCarousel(1); restartAutoplay(); }); }

    track.addEventListener('keydown', function(e){
      if(e.key === 'ArrowLeft') { moveCarousel(-1); restartAutoplay(); }
      if(e.key === 'ArrowRight') { moveCarousel(1); restartAutoplay(); }
    });

    buildDots();
    restartAutoplay();
  }

  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if(navToggle && nav){
    navToggle.addEventListener('click', function(){
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

})();
