// ===================== WALKING AVATAR · TOWN · LIVE PLAYERS =====================
const WSPD=170;
function wkNew(el,x,y){return {el,x,y,tx:x,ty:y,moving:false,face:1,cb:null,ph:Math.random()*6};}
function wkGo(w,x,y,cb){w.tx=Math.max(3,Math.min(97,x));w.ty=Math.max(9,Math.min(93,y));w.moving=true;w.cb=cb||null;}
function wkStep(w,dt,W,H){if(!w.moving)return;const dx=(w.tx-w.x)*W/100,dy=(w.ty-w.y)*H/100,d=Math.hypot(dx,dy),st=WSPD*dt*(w.spd||1);
  if(Math.abs(dx)>2)w.face=dx<0?-1:1;
  if(d<=st){w.x=w.tx;w.y=w.ty;w.moving=false;const c=w.cb;w.cb=null;if(c)c();}else{w.x+=dx/d*st*100/W;w.y+=dy/d*st*100/H;}}
function wkDraw(w){if(!w.el)return;w.el.style.left=w.x+'%';w.el.style.top=w.y+'%';w.el.style.zIndex=10+Math.round(w.y);w.el.classList.toggle('walk',w.moving);w.el.style.setProperty('--fl',w.face);}
// ---- my avatar in town
let hMe=null,hTarget=null;
function hMeEnsure(){const wd=$('hWorld');if(!wd)return null;let el=$('hMe');
  if(!el){el=document.createElement('div');el.className='wk me';el.id='hMe';wd.appendChild(el);const pv=document.createElement('div');pv.id='hPeers';wd.appendChild(pv);const mk=document.createElement('div');mk.className='hmark';mk.id='hMark';wd.appendChild(mk);
    const p=(S.av&&S.av.pos)||[50,63];hMe=wkNew(el,p[0],p[1]);}
  el.innerHTML=`<div class="wkb" id="hBub"></div><img src="${IMG['av_'+avKey()]}" alt="ตัวคุณ"><div class="wkn"><b>${meClsIc()} ${esc(S.pname)}</b></div><i class="wksh"></i>`;hMe.el=el;wkDraw(hMe);return hMe;}
function hNameTag(){if(screen==='home')hMeEnsure();presSend();}
function hNear(){let best=null,bd=1e9;const wd=$('hWorld');if(!wd)return null;const W=wd.clientWidth,H=wd.clientHeight;
  HPIN.forEach(P=>{const d=Math.hypot((P.x-hMe.x)*W/100,(P.y-hMe.y)*H/100);if(d<bd){bd=d;best=P;}});return bd<75?best:null;}
function hArrive(){if(!S.av)S.av={g:'',o:1};S.av.pos=[+hMe.x.toFixed(1),+hMe.y.toFixed(1)];save();presSend();const P=hNear(),bb=$('hBub');if(!bb)return;
  if(P){const lock=P.m&&!modeOpen(P.m);bb.innerHTML=`<button class="btn gold sm" data-hgo="${P.id}">${lock?'🔒 ':P.ic+' เข้า'}${P.n}</button>`;bb.hidden=false;}else bb.hidden=true;}
function hWalkTo(x,y,cb){if(!hMeEnsure())return;const bb=$('hBub');if(bb)bb.hidden=true;const mk=$('hMark');if(mk){mk.style.left=x+'%';mk.style.top=y+'%';mk.classList.remove('on');void mk.offsetWidth;mk.classList.add('on');}
  wkGo(hMe,x,y,()=>{hArrive();if(cb)cb();});presSend();}
function hEnter(P){if(P.m&&!modeOpen(P.m)){toast(`🔒 ${UNLK[P.m]?UNLK[P.m].n:P.n} ${unlTxt(P.m)}`);return;}go(P.go);}
document.addEventListener('click',e=>{const g=e.target.closest('[data-hgo]');if(!g)return;const P=HPIN.find(q=>q.id===g.dataset.hgo);if(P)hEnter(P);});
// ---- live players (room presence)
let ROOM=null,peerW={},roomN=0;
(async()=>{try{if(!window.claude||!claude.use)return;ROOM=await claude.use('room');}catch(e){ROOM=null;}if(!ROOM)return;
  try{ROOM.onPeers(ch=>{peerSync(ch.peers);},()=>{});}catch(e){}presSend();})();
function presSend(){if(!ROOM)return;try{const T=S.dun&&S.dun.title;const m=hMe||{x:50,y:63,tx:50,ty:63};
  ROOM.presence({x:+m.x.toFixed(1),y:+m.y.toFixed(1),tx:+m.tx.toFixed(1),ty:+m.ty.toFixed(1),av:avKey(),nm:String(S.pname||'นักเดินทาง').slice(0,16),ti:T||'',cl:meClsIc(),lv:teamLv(),sc:screen==='home'?'home':screen}).catch(()=>{});}catch(e){}}
function peerSync(list){const pv=$('hPeers');const seen={};let n=0;
  (list||[]).forEach(p=>{if(!p||p.isMe||p.kind!=='viewer')return;const q=p.presence||{};if(typeof q.x!=='number'||!avOk(q.av))return;n++;if(n>30)return;seen[p.peer]=1;
    const cl=v=>Math.max(3,Math.min(97,+v||50));let w=peerW[p.peer];
    if(!w){const el=document.createElement('div');el.className='wk peer';w=peerW[p.peer]=wkNew(el,cl(q.x),cl(q.y));if(pv)pv.appendChild(el);}
    if(pv&&w.el.parentNode!==pv)pv.appendChild(w.el);
    const key=q.av+'|'+q.nm+'|'+q.ti+'|'+q.cl+'|'+q.sc;if(w.key!==key){w.key=key;const T=DUNT[q.ti];
      w.el.innerHTML=`<img src="${IMG['av_'+q.av]}" alt=""><div class="wkn"><b>${typeof q.cl==='string'&&q.cl.length<=4?esc(q.cl):''} ${esc(String(q.nm||'นักเดินทาง').slice(0,16))}</b>${T?`<span class="ttl ${T.c}">${T.n}</span>`:''}${q.sc!=='home'?`<small>${q.sc==='battle'?'⚔️ กำลังสู้':'💤 '+esc(String(MODEN[q.sc]||'ทำภารกิจ'))}</small>`:''}</div><i class="wksh"></i>`;}
    w.el.classList.toggle('away',q.sc!=='home');
    if(Math.hypot(w.x-cl(q.x),w.y-cl(q.y))>35){w.x=cl(q.x);w.y=cl(q.y);}wkGo(w,cl(q.tx),cl(q.ty));});
  for(const id in peerW)if(!seen[id]){peerW[id].el.remove();delete peerW[id];}
  roomN=Math.min(n,30);const oc=$('hOnline');if(oc){oc.hidden=!roomN;oc.textContent=`👥 ออนไลน์ในเมือง ${roomN} คน`;}}
// ---- shared animation loop (town + field)
let wkLast=0;
function wkLoop(t){const dt=Math.min(.1,(t-(wkLast||t))/1000);wkLast=t;
  try{if(screen==='home'&&hMe){const wd=$('hWorld'),W=wd.clientWidth,H=wd.clientHeight;wkStep(hMe,dt,W,H);wkDraw(hMe);
      for(const id in peerW){const w=peerW[id];wkStep(w,dt,W,H);wkDraw(w);}
      if(hMe.moving){const wr=$('hWrap'),cx=hMe.x*W/100-wr.clientWidth/2,cy=hMe.y*H/100-wr.clientHeight*.55;wr.scrollLeft+=(cx-wr.scrollLeft)*Math.min(1,dt*3);wr.scrollTop+=(cy-wr.scrollTop)*Math.min(1,dt*3);}}
    if(screen==='field'&&typeof fdTick==='function')fdTick(dt);}catch(e){}
  requestAnimationFrame(wkLoop);}
requestAnimationFrame(wkLoop);
const _goWk=go;go=function(sc){_goWk(sc);presSend();};
