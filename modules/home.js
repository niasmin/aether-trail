// ===================== HOME: town hub =====================
const HPIN=[
 {id:'gate',x:50,y:73,ic:'⚔️',n:'ประตูผจญภัย',go:'battle',big:1,sub:()=>B&&B.boss?'💀 กำลังสู้บอส':`ด่าน ${sname(S.stage)}`},
 {id:'castle',x:50,y:12,ic:'🏰',n:'ปราสาทอาณาจักร',go:'kingdom',m:'kingdom',sub:()=>S.k?`เมือง Lv.${kState().lv.hall}`:''},
 {id:'fount',x:50,y:32,ic:'✦',n:'น้ำพุดวงดาว',go:'summon',m:'summon',sub:()=>`🎫 ${S.tickets} ใบ`},
 {id:'tower',x:87,y:11,ic:'🗼',n:'หอคอยท้าทาย',go:'tower',m:'tower',sub:()=>`ชั้น ${S.tower+1}`},
 {id:'mine',x:72,y:15,ic:'⛏️',n:'เหมืองดันเจี้ยน',go:'dun',m:'dun',sub:()=>{const D=dunState();return `เหลือ ${Object.values(D.tries).reduce((a,b)=>a+b,0)} ครั้ง`;}},
 {id:'saw',x:26,y:15,ic:'⚒️',n:'สมาคมช่าง',go:'craft',m:'craft',sub:()=>`ช่าง Lv.${crLv()}`},
 {id:'hall',x:15,y:30,ic:'🦸',n:'หอวีรชน',go:'hero',sub:()=>`ฮีโร่ ${OWNED().length} ตัว`},
 {id:'garden',x:30,y:36,ic:'🐉',n:'รังมังกร',go:'pet',m:'pet',sub:()=>{const P=petState();return P.inc?(Date.now()>=P.inc.end?'🥚 พร้อมฟัก':'🥚 กำลังฟัก'):`คู่หู ${P.list.length} ตัว`;}},
 {id:'farm',x:14,y:51,ic:'🚚',n:'ลานคาราวาน',go:'caravan',m:'caravan',sub:()=>{const r=S.k&&S.k.cv&&S.k.cv.run;return r?(Date.now()>=r.end?'กลับมาแล้ว':'กำลังเดินทาง'):'ว่าง';}},
 {id:'coll',x:64,y:29,ic:'📖',n:'หอสะสม',go:'coll',sub:()=>`+${collPct().pct.toFixed(1)}%`},
 {id:'market',x:59,y:44,ic:'🛒',n:'ตลาด',go:'shop',sub:()=>''},
 {id:'plaza',x:43,y:52,ic:'👥',n:'ลานจัดทีม',go:'party',sub:()=>`พลัง ${kf(teamPower())}`},
 {id:'barr',x:90,y:39,ic:'🏆',n:'ค่ายแม่ทัพ',go:'gen',m:'gen',sub:()=>`ชนะ ${gbState().beat}/10`},
 {id:'arena',x:79,y:54,ic:'🥇',n:'สนามประลอง',go:'arena',m:'arena',sub:()=>tierOf(arenaState().rating)[1]},
 {id:'dboss',x:66,y:64,ic:'👑',n:'ลานล่าบอส',go:'dboss',m:'dboss',sub:()=>`เหลือ ${dbState().tries}/3`},
 {id:'rift',x:62,y:5,ic:'🌐',n:'รอยแยกบอสโลก',go:'wboss',m:'wboss',sub:()=>`เหลือ ${wbState().tries} ครั้ง`},
 {id:'dock',x:86,y:89,ic:'🧭',n:'ท่าเรือสำรวจ',go:'expe',m:'expe',sub:()=>{const n=S.expd?S.expd.run.length:0;return n?`ออกเดินทาง ${n} ทีม`:'ว่าง';}},
 {id:'road',x:30,y:89,ic:'🗺️',n:'เส้นทางอีเธอร์',go:'map',sub:()=>`บท ${Math.floor(S.best/10)+1}`},
 {id:'shrine',x:6,y:79,ic:'🌅',n:'ศาลเกิดใหม่',go:'rebirth',m:'rebirth',sub:()=>`+${essGain()} แก่น`},
];
let hBuilt=false,hScroll=null,hDrag=null,hMoved=false;
function hSafe(f){try{return f()||'';}catch(e){return '';}}
function hHour(){const h=new Date().getHours();return h>=19||h<5?'night':h<7?'dawn':h>=17?'dusk':'day';}
function renderHome(){const sc=$('sc-home');
  if(!hBuilt){hBuilt=true;sc.innerHTML=`<div class="hwrap" id="hWrap"><div class="hworld" id="hWorld"><img src="${IMG.k_map}" alt="เมืองอีเธอร์" draggable="false">
      <div class="htint" id="hTint"></div><div class="hrift"></div><div class="hfount"></div>
      ${[0,1,2].map(i=>`<div class="hcloud c${i}"></div>`).join('')}
      ${Array.from({length:10},(_,i)=>`<i class="hsp" style="left:${[47,53,50,45,55,60,64,58,66,40][i]}%;top:${[30,31,26,34,35,4,6,2,8,48][i]}%;animation-delay:${(i*.37)%3}s"></i>`).join('')}
      <img class="hwalk w0" src="${IMG.u_sh}" alt=""><img class="hwalk w1" src="${IMG.u_ar}" alt=""><img class="hwalk w2" src="${IMG.u_sp}" alt="">
      <div id="hPins"></div></div></div>
    <div class="htop"><div class="htitle"><b>เมืองอีเธอร์</b><span id="hChap"></span></div><span class="htime" id="hTime"></span></div>
    <div class="hbot"><div class="htut" id="hTut" hidden></div><div class="hbar">
      <button class="hb gold" data-nact="open">📋 ไปทำต่อ<em id="hNext"></em></button>
      <button class="hb" data-go="battle">⚔️ สู้ต่อ</button>
      <button class="hb" data-go="wallet">💼</button><button class="hb" data-go="fb">💌</button></div></div>`;
    const w=$('hWrap');
    w.addEventListener('scroll',()=>{hScroll=[w.scrollLeft,w.scrollTop];},{passive:true});
    w.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;hDrag=[e.clientX,e.clientY,w.scrollLeft,w.scrollTop];hMoved=false;});
    window.addEventListener('pointermove',e=>{if(!hDrag)return;const dx=e.clientX-hDrag[0],dy=e.clientY-hDrag[1];if(Math.abs(dx)+Math.abs(dy)>6)hMoved=true;w.scrollLeft=hDrag[2]-dx;w.scrollTop=hDrag[3]-dy;});
    window.addEventListener('pointerup',()=>{hDrag=null;setTimeout(()=>hMoved=false,0);});
    sc.addEventListener('click',e=>{const p=e.target.closest('[data-hpin]');if(!p)return;if(hMoved){e.stopPropagation();return;}const P=HPIN.find(q=>q.id===p.dataset.hpin);if(!P)return;
      if(P.m&&!modeOpen(P.m)){toast(`🔒 ${UNLK[P.m]?UNLK[P.m].n:P.n} ${unlTxt(P.m)}`);return;}p.classList.add('tap');setTimeout(()=>go(P.go),140);});
    window.addEventListener('resize',()=>{if(screen==='home')hSize();});}
  hSize();hPins();}
function hSize(){const w=$('hWrap'),wd=$('hWorld');if(!w||!w.clientWidth||!w.clientHeight)return;const W=Math.max(w.clientWidth,w.clientHeight*1.5,620),H=W/1.5;
  if(wd.style.width!==W+'px'){wd.style.width=W+'px';wd.style.height=H+'px';}
  if(hScroll){w.scrollLeft=hScroll[0];w.scrollTop=hScroll[1];}else{w.scrollLeft=(W-w.clientWidth)/2;w.scrollTop=(H-w.clientHeight)*.55;}}
function hPins(){if(!$('hPins'))return;let td=[],cl=[];try{({td,cl}=nextData());}catch(e){}
  const hot=new Set(td.map(t=>t[2]));if(S.best>=Math.floor(S.stage/10)*10+9&&!S.firsts[Math.floor(S.stage/10)*10+9])hot.add('battle');
  const ph=HPIN.map(P=>{const lock=P.m&&!modeOpen(P.m),h=!lock&&hot.has(P.go);
    return `<button class="hpin ${P.big?'big':''} ${lock?'lock':''} ${h?'hot':''}" data-hpin="${P.id}" style="left:${P.x}%;top:${P.y}%" aria-label="${P.n}"><span class="hic">${lock?'🔒':P.ic}</span><span class="hlb">${P.n}<small>${lock?'ปลดล็อกด่าน '+sname(UNLK[P.m].lv-1):hSafe(P.sub)}</small></span>${h?'<i class="hdot">!</i>':''}</button>`;}).join('');if($('hPins')._h!==ph){$('hPins').innerHTML=ph;$('hPins')._h=ph;}
  const a=AREAS[Math.min(AREAS.length-1,Math.floor(S.stage/10))];$('hChap').textContent=`บทที่ ${Math.floor(S.stage/10)+1} · ${a?a.n:''}`;
  const hh=hHour();$('hTint').className='htint '+hh;$('hTime').textContent={day:'☀️ กลางวัน',dawn:'🌅 รุ่งเช้า',dusk:'🌇 ยามเย็น',night:'🌙 กลางคืน'}[hh];
  $('hNext').textContent=cl.length||'';$('hNext').parentNode.classList.toggle('has',cl.length>0);
  const T=S.tut<TUT.length?TUT[S.tut]:null,tb=$('hTut');tb.hidden=!T;if(T&&tb._t!==S.tut){tb._t=S.tut;tb.innerHTML=`<img src="${IMG.owl}" alt=""><div><b>บทแนะนำ ${S.tut+1}/${TUT.length} · ${T.t}</b><span>${T.d}</span></div><button class="btn gold sm" data-htut="1">ไปเลย</button>`;}}
document.addEventListener('click',e=>{if(e.target.closest('[data-htut]')){const T=TUT[S.tut];if(!T)return;if(T.go==='chest'||T.nav==='boss')go('battle');$('tutGo').click();}});
setInterval(()=>{if(screen==='home'){hPins();}},1500);
