(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pageContent = document.getElementById('page-content');
  var loader = document.getElementById('intro-loader');
  var heroText = document.getElementById('hero-text');

  function activateHeroFlower(){
    document.querySelectorAll('.hero-petal').forEach(function(p){ p.classList.add('play'); });
    document.querySelector('.hero-center').classList.add('play');
    document.getElementById('hero-glow').classList.add('play');
    heroText.classList.add('reveal');
  }

  if(reduceMotion){
    loader.style.display = 'none';
    pageContent.style.opacity = '1';
    activateHeroFlower();
  } else {
    var loaderFlower = document.getElementById('loader-flower');
    document.querySelectorAll('.loader-petal').forEach(function(p){ p.classList.add('play'); });
    document.querySelector('.loader-center').classList.add('play');

    var LOADER_BLOOM = 1700, HOLD = 500, SHRINK = 700;

    setTimeout(function(){
      var heroFlowerEl = document.getElementById('hero-flower');
      var target = heroFlowerEl.getBoundingClientRect();
      var loaderRect = loaderFlower.getBoundingClientRect();
      var scale = target.width / loaderRect.width;
      var dx = (target.left + target.width/2) - (loaderRect.left + loaderRect.width/2);
      var dy = (target.top + target.height/2) - (loaderRect.top + loaderRect.height/2);
      loaderFlower.style.transition = 'transform ' + SHRINK + 'ms cubic-bezier(.65,0,.35,1)';
      loaderFlower.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + scale + ')';

      setTimeout(function(){
        pageContent.style.opacity = '1';
        pageContent.removeAttribute('aria-hidden');
      }, SHRINK * 0.35);

      setTimeout(function(){
        loader.style.opacity = '0';
        setTimeout(function(){
          loader.style.display = 'none';
          activateHeroFlower();
        }, 500);
      }, SHRINK);
    }, LOADER_BLOOM + HOLD);
  }

  /* typewriter role text */
  var roles = ["IT Graduate", "Database & SQL Specialist", "Software Developer", "Creative at heart"];
  var roleEl = document.getElementById('typed-role');
  var ri = 0;
  function typeRole(){
    var text = roles[ri];
    var i = 0;
    roleEl.textContent = '';
    (function type(){
      if(i <= text.length){
        roleEl.textContent = text.slice(0,i);
        i++;
        setTimeout(type, 32);
      } else {
        setTimeout(eraseRole, 5000);
      }
    })();
  }
  function eraseRole(){
    var text = roleEl.textContent;
    (function erase(){
      if(text.length > 0){
        text = text.slice(0,-1);
        roleEl.textContent = text;
        setTimeout(erase, 16);
      } else {
        ri = (ri+1) % roles.length;
        typeRole();
      }
    })();
  }
  typeRole();

  /* nav scrollspy */
  var navItems = document.querySelectorAll('.nav-item');
  var sections = Array.prototype.slice.call(document.querySelectorAll('section[id], header[id]'));
  if('IntersectionObserver' in window){
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          navItems.forEach(function(n){ n.classList.toggle('active', n.dataset.nav === e.target.id); });
        }
      });
    }, {rootMargin:'-40% 0px -50% 0px'});
    sections.forEach(function(s){ obs.observe(s); });
  }

  /* timeline scroll fill (handles both Experience and Education timelines) */
  var timelines = document.querySelectorAll('.timeline');
  function updateTimelineFill(){
    timelines.forEach(function(timelineEl){
      var fillEl = timelineEl.querySelector('.timeline-fill');
      var rect = timelineEl.getBoundingClientRect();
      var vh = window.innerHeight;
      var progress = (vh*0.75 - rect.top) / rect.height;
      progress = Math.max(0, Math.min(1, progress));
      fillEl.style.height = (progress*100) + '%';
    });
  }
  window.addEventListener('scroll', updateTimelineFill, {passive:true});
  window.addEventListener('resize', updateTimelineFill);
  updateTimelineFill();

  if(reduceMotion) return;

  /* butterflies */
  var palette = [
    ['#f0a6c8','#b48ee8'], ['#84c6e8','#8fd6ab'], ['#f3d271','#f0a6c8'],
    ['#b48ee8','#84c6e8'], ['#8fd6ab','#f3d271']
  ];
  var lastX = window.innerWidth/2, lastY = window.innerHeight/3;
  var lastMoveTime = Date.now();
  var lastSpawn = 0;
  var minGap = 70;

  function spawnButterfly(x, y, jitter){
    var jx = jitter ? (Math.random()*30-15) : 0;
    var jy = jitter ? (Math.random()*30-15) : 0;
    var b = document.createElement('div');
    b.className = 'butterfly';
    b.style.left = (x+jx) + 'px';
    b.style.top = (y+jy) + 'px';
    var pair = palette[Math.floor(Math.random()*palette.length)];
    var size = 15 + Math.random()*7;
    var drift = (Math.random()*40 - 20);
    b.innerHTML =
      '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" style="transform:translate(-50%,-50%); filter:drop-shadow(0 0 4px '+pair[0]+') drop-shadow(0 0 9px '+pair[1]+');">' +
        '<path d="M12 12 C 6 1, -1 4, 2 11 C 4 15, 9 14, 12 12 Z" fill="'+pair[0]+'"><animateTransform attributeName="transform" type="scale" values="1,1;0.35,1;1,1" additive="sum" dur="0.35s" repeatCount="indefinite"/></path>' +
        '<path d="M12 12 C 18 1, 25 4, 22 11 C 20 15, 15 14, 12 12 Z" fill="'+pair[1]+'"><animateTransform attributeName="transform" type="scale" values="1,1;0.35,1;1,1" additive="sum" dur="0.35s" repeatCount="indefinite"/></path>' +
      '</svg>';
    document.body.appendChild(b);
    var start = performance.now();
    var dur = 900 + Math.random()*400;
    function anim(t){
      var p = Math.min(1, (t-start)/dur);
      var ease = 1 - Math.pow(1-p, 2);
      b.style.transform = 'translate(' + (drift*ease) + 'px,' + (-40*ease) + 'px)';
      b.style.opacity = String(1-p);
      if(p < 1){ requestAnimationFrame(anim); } else { b.remove(); }
    }
    requestAnimationFrame(anim);
  }

  window.addEventListener('mousemove', function(e){
    lastX = e.clientX; lastY = e.clientY; lastMoveTime = Date.now();
    var now = Date.now();
    if(now - lastSpawn < minGap) return;
    lastSpawn = now;
    spawnButterfly(e.clientX, e.clientY, false);
  });

  setInterval(function(){
    if(Date.now() - lastMoveTime > 650){
      spawnButterfly(lastX, lastY, true);
    }
  }, 550);
})();
