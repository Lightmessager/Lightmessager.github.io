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

  // molecular-network background: drifting atoms, bonds, aromatic rings, pointer glow
  var c=document.getElementById('mol');
  if(!c||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  var x=c.getContext('2d'),W,H,P=[],R=[],N=0,raf,mx=-999,my=-999,t=0;
  function col(n){return getComputedStyle(root).getPropertyValue(n).trim()}
  var pal=[];function loadPal(){pal=[col('--accent'),col('--accent-2'),col('--accent-3')]}
  function size(){var r=c.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;c.width=W*d;c.height=H*d;x.setTransform(d,0,0,d,0,0);
    N=Math.round(Math.min(58,W*H/14000));P=[];R=[];
    for(var i=0;i<N;i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,r:2+Math.random()*3.4,k:Math.random()<.2?1:(Math.random()<.2?2:0),ph:Math.random()*6.28});
    for(i=0;i<Math.max(3,Math.round(W/260));i++)R.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.14,vy:(Math.random()-.5)*.14,s:22+Math.random()*26,a:Math.random()*6.28,w:(Math.random()-.5)*.004,k:i%3});
    loadPal()}
  function ring(r){x.save();x.translate(r.x,r.y);x.rotate(r.a);x.strokeStyle=pal[r.k];x.globalAlpha=.3;x.lineWidth=1.6;x.beginPath();
    for(var j=0;j<6;j++){var a=j*Math.PI/3;x[j?'lineTo':'moveTo'](Math.cos(a)*r.s,Math.sin(a)*r.s)}x.closePath();x.stroke();
    x.globalAlpha=.18;x.beginPath();for(j=0;j<6;j++){a=j*Math.PI/3+Math.PI/6;x[j?'lineTo':'moveTo'](Math.cos(a)*r.s*.55,Math.sin(a)*r.s*.55)}x.closePath();x.stroke();x.restore()}
  function draw(){
    t+=.016;x.clearRect(0,0,W,H);
    R.forEach(function(r){r.x+=r.vx;r.y+=r.vy;r.a+=r.w;if(r.x<-60)r.x=W+60;if(r.x>W+60)r.x=-60;if(r.y<-60)r.y=H+60;if(r.y>H+60)r.y=-60;ring(r)});
    for(var i=0;i<N;i++){var p=P[i];
      var dx0=p.x-mx,dy0=p.y-my,d0=dx0*dx0+dy0*dy0;if(d0<22000){var f=(1-d0/22000)*.5;p.vx+=dx0/Math.sqrt(d0+1)*f*.08;p.vy+=dy0/Math.sqrt(d0+1)*f*.08}
      p.vx*=.995;p.vy*=.995;p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
      for(var j=i+1;j<N;j++){var q=P[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<140){var g=x.createLinearGradient(p.x,p.y,q.x,q.y);g.addColorStop(0,pal[p.k]);g.addColorStop(1,pal[q.k]);
          x.globalAlpha=(1-d/140)*.5;x.strokeStyle=g;x.lineWidth=1.5;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.stroke()}}}
    for(i=0;i<N;i++){p=P[i];var pr=p.r*(1+.12*Math.sin(t*1.6+p.ph));
      x.globalAlpha=.16;x.fillStyle=pal[p.k];x.beginPath();x.arc(p.x,p.y,pr*3,0,6.283);x.fill();
      x.globalAlpha=.85;x.beginPath();x.arc(p.x,p.y,pr,0,6.283);x.fill()}
    x.globalAlpha=1;raf=requestAnimationFrame(draw);
  }
  var hero=c.parentNode;
  hero.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top});
  hero.addEventListener('pointerleave',function(){mx=my=-999});
  size();draw();addEventListener('resize',size);
  new MutationObserver(loadPal).observe(root,{attributes:true,attributeFilter:['data-theme']});
  matchMedia('(prefers-color-scheme:dark)').addEventListener&&matchMedia('(prefers-color-scheme:dark)').addEventListener('change',loadPal);
  document.addEventListener('visibilitychange',function(){document.hidden?cancelAnimationFrame(raf):draw()});
})();
