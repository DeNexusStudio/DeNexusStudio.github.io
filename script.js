(() => {
  'use strict';

  // Hamburger toggle
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav-list');

  function closeNav() {
    if(navList) navList.classList.remove('active');
    if(hamburger) hamburger.textContent = '☰';
    document.body.classList.remove('nav-open');
  }

  if(hamburger && navList) {
    hamburger.addEventListener('click', ()=>{
      const isOpen = navList.classList.toggle('active');
      hamburger.textContent = isOpen ? '✖' : '☰';
      document.body.classList.toggle('nav-open', isOpen);
    });

    navList.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click', ()=>{
        if(window.innerWidth <= 992) closeNav();
      });
    });

    hamburger.addEventListener('keydown', e=>{
      if(e.key==='Enter'||e.key===' ') { e.preventDefault(); hamburger.click(); }
    });
  }

  // Hero fade slideshow
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  if(slides.length>0){
    let current=0;
    slides.forEach((s,i)=>s.classList.toggle('active', i===0));
    setInterval(()=>{
      slides[current].classList.remove('active');
      current=(current+1)%slides.length;
      slides[current].classList.add('active');
    },5000);
  }

  // Nutrition calculator
  const calcForm = document.querySelector('#calc-form') || document.querySelector('#nutrition-form');
  if(calcForm){
    calcForm.addEventListener('submit', e=>{
      e.preventDefault();
      const typeEl = calcForm.querySelector('#pet-type') || document.querySelector('#pet-type');
      const weightEl = calcForm.querySelector('#weight') || calcForm.querySelector('#pet-weight') || document.querySelector('#weight');
      const activityEl = calcForm.querySelector('#activity') || document.querySelector('#activity');

      const type = typeEl?typeEl.value:'dog';
      const weight = weightEl?parseFloat(weightEl.value):NaN;
      const activity = activityEl?activityEl.value:'medium';
      if(isNaN(weight)||weight<=0){ alert('Please enter a valid weight (kg).'); return; }

      let factor=60;
      if(type==='dog') factor=(activity==='high'?70:activity==='medium'?60:50);
      if(type==='cat') factor=(activity==='high'?60:activity==='medium'?50:40);

      const calories=Math.round(weight*factor);
      const resultEl=document.querySelector('#calc-result')||calcForm.querySelector('.calc-result');
      if(resultEl) resultEl.textContent=`Recommended daily calories: ${calories} kcal`;
      else alert(`Recommended daily calories: ${calories} kcal`);
    });
  }

  // Lightbox for images/videos
  function openLightbox(contentNode){
    const lightbox=document.createElement('div');
    lightbox.className='lightbox';
    const contentWrap=document.createElement('div');
    contentWrap.className='lightbox-content';
    const clone=contentNode.cloneNode(true);
    if(clone.tagName==='VIDEO') clone.controls=true;
    contentWrap.appendChild(clone);

    const closeBtn=document.createElement('button');
    closeBtn.className='close-lightbox';
    closeBtn.innerHTML='✖';
    contentWrap.appendChild(closeBtn);
    lightbox.appendChild(contentWrap);
    document.body.appendChild(lightbox);

    closeBtn.addEventListener('click',()=>lightbox.remove());
    lightbox.addEventListener('click', e=>{ if(e.target===lightbox) lightbox.remove(); });
    document.addEventListener('keydown', function esc(e){ if(e.key==='Escape'){ lightbox.remove(); document.removeEventListener('keydown', esc); } });
  }

  const gallerySelectors=[
    '.product-card img', '.product-card video',
    '.card img', '.card video',
    '.blog-card img'
  ];
  const galleryItems=document.querySelectorAll(gallerySelectors.join(','));
  galleryItems.forEach(node=>{
    node.style.cursor='zoom-in';
    node.addEventListener('click', ()=>openLightbox(node));
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const target=document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        if(window.innerWidth<=992 && navList && navList.classList.contains('active')) closeNav();
      }
    });
  });

  // Map warning
  const maps=document.querySelectorAll('iframe[src*="google.com/maps/embed"]');
  maps.forEach(m=>{
    if(!m.getAttribute('src')||m.getAttribute('src').length<40){
      console.warn('Google Maps iframe looks invalid. Replace iframe src with a proper Google Maps Embed link.');
    }
  });
})();
