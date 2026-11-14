(function(){

/* ===== Added: hero rotator, route map, food detail, photo viewer ===== */
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Hero: rotating "Next stop" */
(function(){const w=document.querySelector('.rotw b');if(!w||RM)return;
 const L=['Seoul · 서울','Gyeongju · 경주','the DMZ · 비무장지대','Kia HRD Center · 기아','Gwangjang Market · 광장시장','the Han River · 한강','Hongdae · 홍대'];let i=0;
 setInterval(()=>{w.classList.add('out');setTimeout(()=>{i=(i+1)%L.length;w.textContent=L[i];w.classList.remove('out');w.classList.add('pre');void w.offsetWidth;w.classList.remove('pre')},450)},2600)})();

/* Route map */
(function(){const svg=document.getElementById('rsvg');if(!svg)return;const NS='http://www.w3.org/2000/svg';
 const C={incheon:{x:159.5,y:269.6,n:'Incheon',k:'인천',lx:-12,ly:5,a:'end'},
  seoul:{x:191,y:261.4,n:'Seoul',k:'서울',lx:12,ly:-12,a:'start',s:'Home base'},
  dmz:{x:173.2,y:235.8,n:'DMZ',k:'비무장지대',lx:-12,ly:-6,a:'end',s:'Day 9'},
  yongin:{x:201.1,y:283.8,n:'Yongin',k:'용인',lx:-10,ly:18,a:'end',s:'Kia HRD Center · Day 8'},
  gyeongju:{x:323.4,y:388.1,n:'Gyeongju',k:'경주',lx:-13,ly:4,a:'end',s:'Days 3–4 · by KTX'}};
 const L=(a,b,k)=>{const A=C[a],B=C[b],mx=(A.x+B.x)/2,my=(A.y+B.y)/2,dx=B.x-A.x,dy=B.y-A.y;return `M${A.x} ${A.y} Q${(mx-dy*k).toFixed(1)} ${(my+dx*k).toFixed(1)} ${B.x} ${B.y}`};
 const S=[
  {d:'Day 1',t:'Land in Incheon, ride to Seoul',city:'seoul',legs:[L('incheon','seoul',-.35)],c:['Incheon Airport','Orientation']},
  {d:'Day 2',t:'Royal Seoul',city:'seoul',legs:[],c:['Gyeongbok Palace','Hanbok','Bukchon','Insadong','Cheonggyecheon','Myeongdong']},
  {d:'Days 3–4',t:'KTX bullet train to Gyeongju and back',city:'gyeongju',legs:[L('seoul','gyeongju',.22),L('gyeongju','seoul',.22)],c:['Bulguksa','Seokguram','Gyeongju Museum','Yangdong Village']},
  {d:'Days 5–7',t:'Seoul: free day, Nongshim, Hanyang',city:'seoul',legs:[],c:['Free day','Nongshim','Ikseondong','Hanyang University','Gwangjang Market']},
  {d:'Day 8',t:'Inside Kia in Yongin',city:'yongin',legs:[L('seoul','yongin',-.4),L('yongin','seoul',-.4)],c:['Kia HRD Center']},
  {d:'Day 9',t:'Day trip to the DMZ',city:'dmz',legs:[L('seoul','dmz',-.4),L('dmz','seoul',-.4)],c:['Odusan Observatory','Imjingak','3rd Tunnel','Dora Observatory']},
  {d:'Days 10–12',t:'K-Pop, Han River and Hongdae',city:'seoul',legs:[],c:['K-Pop dance','SM Shop','Han River picnic','Hongdae','Name seals','Fortress Wall']},
  {d:'Day 13',t:'Back to Incheon, fly home',city:'incheon',legs:[L('seoul','incheon',-.35)],c:['Incheon Airport']}];
 const lg=document.getElementById('rlegs'),cg=document.getElementById('rcities'),dot=document.getElementById('rdot'),ol=document.getElementById('rsteps');
 S.forEach(s=>{s.p=s.legs.map(d=>{const p=document.createElementNS(NS,'path');p.setAttribute('d',d);p.setAttribute('class','rleg');lg.appendChild(p);const L=p.getTotalLength();p.dataset.len=L;p.style.strokeDasharray=L;p.style.strokeDashoffset=L;return p})});
 Object.entries(C).forEach(([k,c])=>{const g=document.createElementNS(NS,'g');g.setAttribute('class','rcity');g.dataset.k=k;
  g.innerHTML=`<circle class="ring" cx="${c.x}" cy="${c.y}" r="7"/><circle cx="${c.x}" cy="${c.y}" r="6.5"/><text x="${c.x+c.lx}" y="${c.y+c.ly}" text-anchor="${c.a}">${c.n} <tspan lang="ko" style="font:400 12px var(--hangul)">${c.k}</tspan></text>${c.s?`<text class="s" x="${c.x+c.lx}" y="${c.y+c.ly+14}" text-anchor="${c.a}">${c.s}</text>`:''}`;cg.appendChild(g);c.g=g});
 C.incheon.g.classList.add('on');
 S.forEach((s,i)=>{const li=document.createElement('li');li.innerHTML=`<button type="button"><span class="rd">${s.d}</span><span><strong>${s.t}</strong><span class="rchips">${s.c.map(x=>`<span>${x}</span>`).join('')}</span></span></button>`;li.firstChild.onclick=()=>{stop();jump(i)};ol.appendChild(li);s.b=li.firstChild});
 let run=0;
 function mark(i){S.forEach((s,j)=>{s.b.classList.toggle('done',j<=i);s.b.classList.toggle('cur',j===i)});
  Object.values(C).forEach(c=>c.g.classList.remove('pulse'));const c=C[S[i].city];c.g.classList.add('on');void c.g.offsetWidth;c.g.classList.add('pulse')}
 function setLeg(p,f){p.style.strokeDashoffset=p.dataset.len*(1-f)}
 function jump(i){S.forEach((s,j)=>s.p.forEach(p=>setLeg(p,j<=i?1:0)));Object.values(C).forEach(c=>c.g.classList.remove('on'));C.incheon.g.classList.add('on');S.slice(0,i+1).forEach(s=>C[s.city].g.classList.add('on'));dot.style.opacity=0;mark(i)}
 function stop(){run++}
 function anim(p,ms,id){return new Promise(res=>{const L=+p.dataset.len,t0=performance.now();dot.style.opacity=1;
  (function f(t){if(id!==run)return res(false);const k=Math.min(1,(t-t0)/ms),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;setLeg(p,e);const pt=p.getPointAtLength(L*e);dot.setAttribute('cx',pt.x);dot.setAttribute('cy',pt.y);k<1?requestAnimationFrame(f):res(true)})(t0)})}
 const wait=(ms,id)=>new Promise(r=>setTimeout(()=>r(id===run),ms));
 async function play(){const id=++run;S.forEach(s=>s.p.forEach(p=>setLeg(p,0)));Object.values(C).forEach(c=>c.g.classList.remove('on','pulse'));C.incheon.g.classList.add('on');S.forEach(s=>s.b.classList.remove('done','cur'));
  for(let i=0;i<S.length;i++){const s=S[i];s.b.classList.add('cur');
   for(const p of s.p){if(!await anim(p,+p.dataset.len>120?1600:900,id))return}
   dot.style.opacity=0;mark(i);if(!await wait(s.p.length?700:1000,id))return}}
 document.getElementById('rreplay').onclick=()=>RM?jump(S.length-1):play();
 if(RM||!('IntersectionObserver' in window)){jump(S.length-1);return}
 const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){io.disconnect();play()}},{threshold:.35});io.observe(svg)})();

/* Overlays */
let lastFocus=null,openOv=null;
function ovOpen(el){lastFocus=document.activeElement;el.hidden=false;openOv=el;document.body.style.overflow='hidden';el.querySelector('.oclose').focus()}
function ovClose(){if(!openOv)return;openOv.hidden=true;openOv=null;document.body.style.overflow='';if(lastFocus)lastFocus.focus()}
document.querySelectorAll('.ovl').forEach(o=>{o.querySelector('.oclose').onclick=ovClose;o.addEventListener('click',e=>{if(e.target===o)ovClose()});
 let x0=null;o.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});o.addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>50)o._nav&&o._nav(dx<0?1:-1)})});
document.addEventListener('keydown',e=>{if(!openOv)return;if(e.key==='Escape')ovClose();else if(e.key==='ArrowRight')openOv._nav(1);else if(e.key==='ArrowLeft')openOv._nav(-1)});

/* Food detail */
(function(){const F={
 kbbq:{ko:'삼겹살',n:'Samgyeopsal',d:'Thick slices of pork belly that you grill yourself at the table. Wrap a piece in lettuce with grilled garlic and ssamjang, a savory dipping paste, and eat it in one bite.',sp:0,sl:'Not spicy. Ssamjang adds a small kick.',w:'Farewell dinner · Day 12',t:'Let it get crispy, then cut it with scissors like the locals do.'},
 jjajang:{ko:'짜장면',n:'Jjajangmyeon',d:'Thick wheat noodles in a glossy black bean sauce with pork and onion. It\'s Korean-Chinese comfort food, and last year\'s Aggies called it a new favorite.',sp:0,sl:'Not spicy. Savory and a little sweet.',w:'Free day · Day 5, at any Korean-Chinese restaurant',t:'Mix everything together before your first bite.'},
 chicken:{ko:'치킨',n:'Korean fried chicken',d:'Fried twice so it stays extra crispy. Order it plain or coated in sweet and spicy yangnyeom sauce, with pickled radish on the side.',sp:1,sl:'Mild. Plain has no heat, and yangnyeom is a little spicy.',w:'Han River picnic · Day 11',t:'Order half-and-half to try both kinds.'},
 tteok:{ko:'떡볶이',n:'Tteokbokki',d:'Chewy rice cakes simmered in a sweet and spicy gochujang sauce, often with fish cakes and a boiled egg. It\'s Korea\'s number-one street food.',sp:3,sl:'Spicy. Keep a drink nearby.',w:'Street food in Myeongdong (Day 2) and Gwangjang Market (Day 7)',t:'Ask for cheese on top if it\'s too hot.'},
 kimbap:{ko:'김밥',n:'Kimbap',d:'Rice and colorful fillings like egg, spinach, carrot and ham, rolled in seaweed and sliced. It\'s the perfect snack to grab on the go.',sp:0,sl:'Not spicy.',w:'KTX ride to Gyeongju (Day 3) and Gwangjang Market (Day 7)',t:'Try the bite-size "mayak" kimbap at Gwangjang Market.'},
 bulgogi:{ko:'불고기',n:'Bulgogi',d:'Thin slices of beef marinated in soy sauce, garlic, sugar and sesame oil, then grilled. Sweet, savory and never spicy.',sp:0,sl:'Not spicy.',w:'Easy to find anywhere. A great pick for a free afternoon.',t:'The safest first choice for picky eaters.'}};
 const m=document.getElementById('foodModal');if(!m)return;
 const cards=[...document.querySelectorAll('.fd')].filter(a=>{const i=a.querySelector('img[data-ph]');return i&&F[i.dataset.ph]});let cur=0;
 function fill(i){cur=(i+cards.length)%cards.length;const a=cards[cur],img=a.querySelector('img'),k=img.dataset.ph,f=F[k];
  m.querySelector('#fmImg').src=img.src;m.querySelector('#fmImg').alt=f.n;m.querySelector('#fmKo').textContent=f.ko;m.querySelector('#fmT').textContent=f.n;m.querySelector('#fmD').textContent=f.d;
  m.querySelector('#fmS').innerHTML=[1,2,3].map(n=>`<i class="${n<=f.sp?'on':''}"></i>`).join('')+`<em>${f.sl}</em>`;m.querySelector('#fmS').setAttribute('aria-label',`Spice ${f.sp} of 3`);
  m.querySelector('#fmW').textContent=f.w;m.querySelector('#fmTip').textContent='Tip: '+f.t}
 m._nav=d=>fill(cur+d);m.querySelectorAll('.onav button').forEach(b=>b.onclick=()=>fill(cur+ +b.dataset.dir));
 cards.forEach((a,i)=>{a.tabIndex=0;a.setAttribute('role','button');a.setAttribute('aria-label',F[a.querySelector('img').dataset.ph].n+': see details');
  const tx=a.querySelector('.fdtx');if(tx){const more=document.createElement('i');more.className='fdmore';more.textContent='See details →';tx.appendChild(more)}
  a.addEventListener('click',e=>{if(e.target.closest('a'))return;fill(i);ovOpen(m)});a.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fill(i);ovOpen(m)}})})})();

window.__ov={open:ovOpen,close:ovClose};
/* Photo viewer for the 2025 gallery */
(function(){const lb=document.getElementById('lightbox');if(!lb)return;const figs=[...document.querySelectorAll('.gal figure')];let cur=0;
 function fill(i){cur=(i+figs.length)%figs.length;const im=figs[cur].querySelector('img'),cap=figs[cur].querySelector('figcaption');const big=lb.querySelector('#lbImg');
  big.src=im.src;big.alt=im.alt;big.style.animation='none';void big.offsetWidth;big.style.animation='';lb.querySelector('#lbCap').innerHTML=`${cap?cap.textContent:''}<small>${cur+1} / ${figs.length}</small>`}
 lb._nav=d=>fill(cur+d);lb.querySelector('.prev').onclick=()=>fill(cur-1);lb.querySelector('.next').onclick=()=>fill(cur+1);
 figs.forEach((f,i)=>{f.tabIndex=0;f.setAttribute('role','button');f.setAttribute('aria-label','Open photo: '+(f.querySelector('figcaption')||{}).textContent);
  f.addEventListener('click',()=>{fill(i);ovOpen(lb)});f.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fill(i);ovOpen(lb)}})})})();

})();
document.querySelectorAll('.eyebrow').forEach(e=>{if(/^Part \d/.test(e.textContent.trim()))e.classList.add('script')});
try{PH.kimchi=Object.assign(PH.kimchi||{},{src:'img/kimchi.jpg',credit:'',page:'',cap:'Making kimchi'})}catch(e){}
document.querySelectorAll('img[data-ph="kimchi"]').forEach(i=>{i.src='img/kimchi.jpg';const a=i.parentNode.querySelector('[data-cr="kimchi"]');if(a)a.hidden=true});
try{PH.smhq=Object.assign(PH.smhq||{},{src:'img/smstore.jpg',credit:'',page:'',cap:'SMTOWN &STORE'})}catch(e){}
document.querySelectorAll('img[data-ph="smhq"]').forEach(i=>{i.src='img/smstore.jpg';const a=i.parentNode.querySelector('[data-cr="smhq"]');if(a)a.hidden=true});
/* K-Culture Orbit Menu */
(function(){const o=document.getElementById('orbit');if(!o)return;
 const P=k=>{try{return (PH[k]||{})}catch(e){return {}}};
 const D=[
  {k:'kpop',n:'K-Pop',ph:'smhq',icon:'img/orbit-kpop2.jpg',pos:'center 45%',tl:'Step into the world behind the music you already stream.',li:['Shop the SM Store','Albums, photo cards and light sticks'],alt:'SMTOWN &STORE in Seoul'},
  {k:'kdance',n:'K-Dance',ph:'kdance',pos:'center 35%',tl:'Don\'t just watch the choreography. Learn it.',li:['Learn a K-pop routine from a pro','Get a video of your group'],alt:'Students in a K-pop dance class'},
  {k:'kbeauty',n:'K-Beauty',ph:'oliveyoung',pos:'center 32%',tl:'Shop where Korean skincare trends start.',li:['Shop Olive Young','Free AI skin analysis'],alt:'Aggie students at Olive Young'},
  {k:'ktrad',n:'K-Tradition',ph:'dojang',pos:'center 40%',tl:'Carve your name in Korean and take home a piece of tradition.',li:['Learn the story of dojang, Korean name seals','Carve your own name seal in Hangul'],alt:'Korean name seal workshop'},
  {k:'kkitchen',n:'K-Kitchen',ph:'kimchi',pos:'center 30%',tl:'Make your own kimchi, Korea\'s most famous dish.',li:['Make kimchi with a local instructor','Date announced soon'],alt:'Students making kimchi'},
  {k:'kdress',n:'K-Dress-Up',src:'img/hanbok2.jpg',pos:'center 50%',tl:'Try on Hanbok. Step into History.',li:['Dress in traditional Korean hanbok','Explore Gyeongbokgung Palace and take photos'],alt:'Students in hanbok at Gyeongbokgung Palace'}];
 D.forEach(d=>{d.src=d.src||P(d.ph).src||'';d.cr=d.ph?P(d.ph).credit:'';if(d.src){const i=new Image();i.src=d.src}});
 const L=o.querySelector('.ocol.l'),R=o.querySelector('.ocol.r'),st=o.querySelector('.ostage'),imgs=[...st.querySelectorAll('.oimg img')],cr=st.querySelector('.ocr'),tx=st.querySelector('.otx');
 const btns=D.map((d,i)=>{const b=document.createElement('button');b.type='button';b.className='obtn';b.setAttribute('aria-pressed','false');b.setAttribute('aria-controls','ostage');b.setAttribute('aria-label',d.n);
  b.innerHTML=`<span class="ocirc"><img src="${d.icon||'img/orbit-'+d.k+'.jpg'}" alt=""></span><span class="olbl">${d.n}</span>`;b.onclick=()=>sel(i,true);(i<3?L:R).appendChild(b);return b});
 let cur=-1,front=0,tt=0;
 function fillText(d){tx.querySelector('h3').textContent=d.n;tx.querySelector('.otl').textContent=d.tl;tx.querySelector('ul').innerHTML=d.li.map(x=>`<li>${x}</li>`).join('');cr.textContent=d.cr?'Photo: '+d.cr:'';cr.hidden=!d.cr}
 function sel(i,anim){if(i===cur)return;cur=i;const d=D[i];btns.forEach((b,j)=>b.setAttribute('aria-pressed',j===i?'true':'false'));
  const back=imgs[1-front],fr=imgs[front];back.style.objectPosition=d.pos;back.alt=d.alt;
  const swap=()=>{back.classList.remove('off');fr.classList.add('off');front=1-front};
  if(!anim){back.src=d.src;swap();fillText(d);return}
  back.src=d.src;(back.decode?back.decode():Promise.resolve()).catch(()=>{}).then(()=>{if(cur===i)swap()});
  tx.classList.add('off');clearTimeout(tt);tt=setTimeout(()=>{fillText(D[cur]);tx.classList.remove('off')},220)}
 o.addEventListener('keydown',e=>{const i=btns.indexOf(document.activeElement);if(i<0)return;let n=null;
  if(e.key==='ArrowRight'||e.key==='ArrowDown')n=(i+1)%6;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')n=(i+5)%6;else if(e.key==='Home')n=0;else if(e.key==='End')n=5;else if(/^[1-6]$/.test(e.key))n=+e.key-1;
  if(n!==null){e.preventDefault();btns[n].focus();sel(n,true)}});
 sel(1,false)})();

(function(){const f=document.getElementById('food'),s=document.getElementById('squad');if(f&&s)s.after(f)})();

/* K-Food photo carousel */
(function(){const sec=document.getElementById('food');if(!sec)return;const grid=sec.querySelector('.fdgrid');
 const P=k=>{try{return (PH[k]||{}).src||''}catch(e){return ''}};
 const F=[
  {k:'kbbq',n:'Samgyeopsal',ko:'삼겹살',src:'img/samgyeopsal.jpg',pos:'50% 48%',z:1.3,s:'Thick pork belly you grill yourself at the table. Wrap it in lettuce and enjoy.',
   d:'Thick slices of pork belly that you grill yourself at the table. Wrap a piece in lettuce with grilled garlic and ssamjang, a savory dipping paste, and eat it in one bite.',sp:0,sl:'Not spicy. Ssamjang adds a small kick.',w:'Farewell dinner · Day 12',t:'Let it get crispy, then cut it with scissors like the locals do.'},
  {k:'bulgogi',n:'Bulgogi',ko:'불고기',ph:'bulgogi',pos:'50% 55%',z:1.15,s:'Sweet soy-marinated beef, grilled until tender. Never spicy.',
   d:'Thin slices of beef marinated in soy sauce, garlic, sugar and sesame oil, then grilled. Sweet, savory and never spicy.',sp:0,sl:'Not spicy.',w:'Easy to find anywhere. A great pick for a free afternoon.',t:'The safest first choice for picky eaters.'},
  {k:'bibimbap',n:'Bibimbap',ko:'비빔밥',ph:'bibimbap',pos:'50% 50%',z:1.15,s:'Rice topped with colorful vegetables, egg and gochujang. Mix it all up.',
   d:'A bowl of rice topped with seasoned vegetables, beef and an egg. Add gochujang, mix it all together and dig in.',sp:1,sl:'Mild. Add more gochujang for heat.',w:'Group meals, including Gyeongju (Days 3–4)',t:'Mix it well so every bite has a bit of everything.'},
  {k:'tteok',n:'Tteokbokki',ko:'떡볶이',ph:'tteok',pos:'50% 50%',z:1.15,s:'Chewy rice cakes in a sweet and spicy red sauce. Korea\'s #1 street food.',
   d:'Chewy rice cakes simmered in a sweet and spicy gochujang sauce, often with fish cakes and a boiled egg.',sp:3,sl:'Spicy. Keep a drink nearby.',w:'Street food in Myeongdong (Day 2) and Gwangjang Market (Day 7)',t:'Ask for cheese on top if it\'s too hot.'},
  {k:'kimbap',n:'Kimbap',ko:'김밥',src:'img/kimbap.jpg',pos:'42% 58%',z:1.25,s:'Rice and colorful fillings rolled in seaweed. The perfect snack on the go.',
   d:'Rice and colorful fillings like egg, spinach, carrot and ham, rolled in seaweed and sliced.',sp:0,sl:'Not spicy.',w:'KTX ride to Gyeongju (Day 3) and Gwangjang Market (Day 7)',t:'Try the bite-size "mayak" kimbap at Gwangjang Market.'},
  {k:'chicken',n:'Korean Fried Chicken',ko:'치킨',src:'img/chicken.jpg',pos:'36% 55%',z:1.2,s:'Double-fried for extra crunch, plain or glazed in sweet-spicy sauce.',
   d:'Fried twice so it stays extra crispy. Order it plain or coated in sweet and spicy yangnyeom sauce, with pickled radish on the side.',sp:1,sl:'Mild. Yangnyeom sauce is a little spicy.',w:'Han River picnic · Day 11',t:'Order half-and-half to try both kinds.'},
  {k:'hotdog',n:'Korean Hot Dog',ko:'핫도그',src:'img/hotdog.jpg',pos:'50% 45%',z:1.05,s:'A crispy, sugar-dusted corn dog, often stuffed with stretchy mozzarella.',
   d:'Korean-style hot dogs are battered and deep-fried, rolled in sugar and topped with ketchup and mustard. Many are filled with mozzarella for a big cheese pull.',sp:0,sl:'Not spicy.',w:'Street snack in Myeongdong (Day 2) or Hongdae (Day 11)',t:'Try the half-sausage, half-cheese one.'}];
 F.forEach(f=>{if(!f.src&&f.ph)f.src=P(f.ph)});
 const N=F.length,COPIES=3,X=[0,.82,1.31,1.71,2.06],SC=[1,.5,.38,.32,.28];
 const wrap=document.createElement('div');wrap.className='fcar';wrap.setAttribute('role','region');wrap.setAttribute('aria-roledescription','carousel');wrap.setAttribute('aria-label','Korean foods');
 wrap.innerHTML=`<div class="fctrack"></div><button class="fcarrow prev" type="button" aria-label="Previous food">‹</button><button class="fcarrow next" type="button" aria-label="Next food">›</button>
  <div class="fcinfo" aria-live="polite"><div class="fcname"><span class="fcen"></span><span class="fcko" lang="ko"></span></div><p class="fcdesc"></p><button class="fcmore" type="button">See details →</button></div>
  <div class="fcdots" role="tablist" aria-label="Choose a food">${F.map((f,i)=>`<button type="button" role="tab" aria-label="${f.n}" data-i="${i}"></button>`).join('')}</div>`;
 grid.before(wrap);grid.hidden=true;
 const track=wrap.querySelector('.fctrack'),info=wrap.querySelector('.fcinfo'),dots=[...wrap.querySelectorAll('.fcdots button')];
 const els=[];for(let j=0;j<N*COPIES;j++){const f=F[j%N],b=document.createElement('button');b.type='button';b.className='fcitem';b.tabIndex=-1;b.setAttribute('aria-label',f.n);
  b.innerHTML=f.src?`<span class="fcc"><img src="${f.src}" alt="" style="object-position:${f.pos};transform:scale(${f.z})" draggable="false"></span>`:`<span class="fcc fcph"><span lang="ko">${f.ko}</span></span>`;b.onclick=()=>{if(moved)return;go(j-cur)};track.appendChild(b);els.push(b)}
 let cur=N,moved=false;
 function layout(anim){els.forEach((e,j)=>{const d=j-cur,a=Math.abs(d),k=Math.min(a,4);e.style.transition=anim?'':'none';
  e.style.transform=`translate(-50%,-50%) translateX(calc(var(--fs) * ${(Math.sign(d)*X[k]).toFixed(3)})) scale(${SC[k]})`;e.style.opacity=a>3?0:a===3?.75:1;e.style.zIndex=10-a;e.classList.toggle('on',d===0);e.setAttribute('aria-hidden',a>3?'true':'false')});
  if(!anim)void track.offsetWidth}
 function text(){const f=F[((cur%N)+N)%N];info.classList.add('off');setTimeout(()=>{info.querySelector('.fcen').textContent=f.n;info.querySelector('.fcko').textContent=f.ko;info.querySelector('.fcdesc').textContent=f.s;info.classList.remove('off')},160);
  dots.forEach((d,i)=>{d.setAttribute('aria-selected',i===((cur%N)+N)%N?'true':'false');d.tabIndex=i===((cur%N)+N)%N?0:-1})}
 function go(step){if(!step)return;cur+=step;layout(true);text();
  if(cur<N||cur>=2*N){const fix=cur<N?N:-N;setTimeout(()=>{cur+=fix;layout(false)},650)}}
 wrap.querySelector('.prev').onclick=()=>go(-1);wrap.querySelector('.next').onclick=()=>go(1);
 dots.forEach(d=>d.onclick=()=>{const t=+d.dataset.i,c=((cur%N)+N)%N;let s=t-c;if(s>N/2)s-=N;if(s<-N/2)s+=N;go(s)});
 wrap.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();go(1)}else if(e.key==='ArrowLeft'){e.preventDefault();go(-1)}});
 let x0=null;track.addEventListener('pointerdown',e=>{x0=e.clientX;moved=false});
 track.addEventListener('pointermove',e=>{if(x0!==null&&Math.abs(e.clientX-x0)>12)moved=true});
 track.addEventListener('pointerup',e=>{if(x0===null)return;const dx=e.clientX-x0;x0=null;if(Math.abs(dx)>45){go(dx<0?1:-1)}setTimeout(()=>moved=false,0)});
 track.addEventListener('pointercancel',()=>{x0=null});
 /* details popup */
 const m=document.getElementById('foodModal');
 function fill(i){const f=F[i];m.querySelector('#fmImg').src=f.src;m.querySelector('#fmImg').alt=f.n;m.querySelector('#fmKo').textContent=f.ko;m.querySelector('#fmT').textContent=f.n;m.querySelector('#fmD').textContent=f.d;
  m.querySelector('#fmS').innerHTML=[1,2,3].map(n=>`<i class="${n<=f.sp?'on':''}"></i>`).join('')+`<em>${f.sl}</em>`;m.querySelector('#fmW').textContent=f.w;m.querySelector('#fmTip').textContent='Tip: '+f.t}
 if(m){wrap.querySelector('.fcmore').onclick=()=>{let i=((cur%N)+N)%N;fill(i);m._nav=d=>{go(d);i=((cur%N)+N)%N;fill(i)};m.querySelectorAll('.onav button').forEach(b=>b.onclick=()=>m._nav(+b.dataset.dir));if(window.__ov)window.__ov.open(m);else m.hidden=false}}
 else wrap.querySelector('.fcmore').hidden=true;
 layout(false);text()})();
