(function(){
  var root=document.documentElement;
  try{var t=localStorage.getItem('theme');if(t)root.setAttribute('data-theme',t)}catch(e){}
  var btn=document.getElementById('theme');
  function dark(){var a=root.getAttribute('data-theme');return a?a==='dark':matchMedia('(prefers-color-scheme:dark)').matches}
  function paint(){if(btn)btn.textContent=dark()?'☀':'☾'}
  paint();
  if(btn)btn.addEventListener('click',function(){
    var n=dark()?'light':'dark';root.setAttribute('data-theme',n);
    try{localStorage.setItem('theme',n)}catch(e){}paint();
  });

  // reading progress
  var pg=document.getElementById('progress');
  if(pg)addEventListener('scroll',function(){var h=document.documentElement;pg.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%'},{passive:true});

  // scroll reveal
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
    els.forEach(function(el){io.observe(el)});
  }else els.forEach(function(el){el.classList.add('in')});

  // active nav link
  var links=document.querySelectorAll('.nav li a[href^="#"]');
  if(links.length&&'IntersectionObserver' in window){
    var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var so=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){links.forEach(function(a){a.classList.remove('on')});var a=map[e.target.id];if(a)a.classList.add('on')}
    })},{rootMargin:'-45% 0px -50% 0px'});
    Object.keys(map).forEach(function(id){var s=document.getElementById(id);if(s)so.observe(s)});
  }

  // molecular-network background
  var c=document.getElementById('mol');
  if(!c||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  var x=c.getContext('2d'),W,H,P=[],N=0,raf;
  function size(){var r=c.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;c.width=W*d;c.height=H*d;x.setTransform(d,0,0,d,0,0);
    N=Math.round(Math.min(46,W*H/16000));P=[];for(var i=0;i<N;i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:2+Math.random()*3.2,h:Math.random()<.18})}
  function col(n){return getComputedStyle(root).getPropertyValue(n).trim()}
  function draw(){
    x.clearRect(0,0,W,H);var a=col('--accent'),b=col('--accent-2');
    for(var i=0;i<N;i++){var p=P[i];p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
      for(var j=i+1;j<N;j++){var q=P[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<130){x.globalAlpha=(1-d/130)*.45;x.strokeStyle=a;x.lineWidth=1.4;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.stroke()}}}
    for(i=0;i<N;i++){p=P[i];x.globalAlpha=.7;x.fillStyle=p.h?b:a;x.beginPath();x.arc(p.x,p.y,p.r,0,6.283);x.fill()}
    raf=requestAnimationFrame(draw);
  }
  size();draw();addEventListener('resize',size);
  document.addEventListener('visibilitychange',function(){document.hidden?cancelAnimationFrame(raf):draw()});
})();
