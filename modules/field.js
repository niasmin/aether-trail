// ===================== MONSTER FIELD =====================
const FD_STAM=20,FD_PT_DAY=4;
let fdArea=null,fdMe=null,fdMobs=[],fdBusy=false,fdW=0,fdH=0;
function fdState(){const M=meState(),d=todayKey();if(M.fday!==d){M.fday=d;M.fn=FD_STAM;M.fw=0;M.fpd=0;}if(M.fn==null)M.fn=FD_STAM;return M;}
function fdMaxArea(){return Math.min(AREAS.length-1,Math.floor(Math.max(0,S.best-1)/10));}
function fdStage(a){return Math.min(a*10+8,Math.max(a*10,S.best-1));}
function renderField(){const M=fdState();if(fdArea==null||fdArea>fdMaxArea())fdArea=fdMaxArea();const a=fdArea,A=AREAS[a];
  const tabs=AREAS.slice(0,fdMaxArea()+1).map((x,i)=>`<button class="mtab ${i===a?'on':''}" data-fdact="area" data-v="${i}">${i+1}. ${x.n}</button>`).join('');
  $('sc-field').innerHTML=`<div class="fdtop"><button class="btn sm" data-go="home">‹ เมือง</button><div class="fdinfo"><b>🌾 ทุ่ง${A.n}</b><span>⚡ ล่าได้อีก ${M.fn}/${FD_STAM} · ชนะวันนี้ ${M.fw} · แต้มสถานะจากทุ่งวันนี้ ${M.fpd||0}/${FD_PT_DAY}</span></div></div>
    <div class="mtabs fdtabs">${tabs}</div>
    <div class="fdwrap" id="fdWrap"><div class="fdworld" id="fdWorld" style="--g0:${A.g[0]};--g1:${A.g[1]};--g2:${A.g[2]};--g3:${A.g[3]}">
      <div class="fdsky" style="background-image:url(${IMG['bd'+(a+1)]})"></div><div class="fdground"></div>
      ${Array.from({length:14},(_,i)=>`<i class="fdgr" style="left:${(i*37)%100}%;top:${62+(i*17)%30}%"></i>`).join('')}
      <div id="fdMobs"></div><div class="wk me" id="fdMe"></div><div class="hmark" id="fdMark"></div></div></div>
    <div class="fdhint sub">แตะพื้นเพื่อเดิน · แตะมอนสเตอร์เพื่อเข้าต่อสู้ (ใช้ ⚡1) · ✨ ตัวเรืองแสงคือหัวหน้าฝูง ได้แต้มสถานะ +1 แน่นอน · ชนะครบ 5 ตัวได้แต้มสถานะ +1</div>`;
  const wd=$('fdWorld');fdW=wd.clientWidth;fdH=wd.clientHeight;
  fdMe=wkNew($('fdMe'),12,78);fdMe.el.innerHTML=`<img src="${IMG['av_'+avKey()]}" alt="ตัวคุณ"><div class="wkn"><b>${meClsIc()} ${esc(S.pname)}</b></div><i class="wksh"></i>`;wkDraw(fdMe);
  fdMobs=[];const n=6;for(let i=0;i<n;i++)fdSpawn(i===n-1&&Math.random()<.6);fdBusy=false;}
function fdSpawn(elite){const A=AREAS[fdArea],mid=elite||Math.random()<.35,img=IMG[(A.mi||['m_mush','m_thorn'])[mid?1:0]]||IMG.mush;
  const el=document.createElement('button');el.className='fdmob'+(elite?' elite':'')+(mid?' mid':'');el.setAttribute('aria-label',(elite?'หัวหน้าฝูง ':'')+(A.mob?A.mob[mid?1:0]:'มอนสเตอร์'));
  el.innerHTML=`<img src="${img}" alt="" style="filter:${A.mt||'none'}">${elite?'<em>✨ หัวหน้าฝูง</em>':''}<i class="wksh"></i>`;$('fdMobs').appendChild(el);
  const m=wkNew(el,30+Math.random()*65,64+Math.random()*28);m.spd=.25;m.elite=elite;m.idle=Math.random()*2;el._m=m;fdMobs.push(m);wkDraw(m);}
function fdTick(dt){if(!fdMe||!$('fdWorld'))return;const W=fdW||$('fdWorld').clientWidth,H=fdH||$('fdWorld').clientHeight;wkStep(fdMe,dt,W,H);wkDraw(fdMe);
  fdMobs.forEach(m=>{if(m.dead)return;if(!m.moving){m.idle-=dt;if(m.idle<=0){m.idle=1.5+Math.random()*3;wkGo(m,Math.max(8,Math.min(95,m.x+(Math.random()-.5)*18)),Math.max(62,Math.min(92,m.y+(Math.random()-.5)*10)));}}wkStep(m,dt,W,H);wkDraw(m);});
  if(fdMe.moving){const wr=$('fdWrap');wr.scrollLeft+=(fdMe.x*W/100-wr.clientWidth/2-wr.scrollLeft)*Math.min(1,dt*3);}}
function fdMark(x,y){const mk=$('fdMark');if(!mk)return;mk.style.left=x+'%';mk.style.top=y+'%';mk.classList.remove('on');void mk.offsetWidth;mk.classList.add('on');}
function fdFight(m){const M=fdState();if(fdBusy)return;if(M.fn<1){toast('⚡ พลังล่าหมดแล้ววันนี้ พรุ่งนี้มาใหม่');return;}if(!S.form.some(Boolean)){toast('จัดทีมก่อน');return;}
  fdBusy=true;m.moving=false;fdMark(m.x,m.y);wkGo(fdMe,m.x-6,m.y,()=>{m.el.classList.add('hit');setTimeout(()=>startField(fdArea,m.elite),450);});}
function startField(a,elite){const M=fdState();M.fn--;save();if(B)B.over=true;const keep=S.stage,st=fdStage(a);go('battle');
  S.stage=st;lastIntro=st;startWave(false);S.stage=keep;B.field={a,elite,keep};B.s=st;
  if(elite)B.en.forEach(e=>{e.max=e.hp=Math.round(e.hp*1.8);e.atk=Math.round(e.atk*1.3);e.el.classList.add('elitefx');});
  banner(elite?'หัวหน้าฝูง!':'เจอมอนสเตอร์!',`ทุ่ง${AREAS[a].n}`);$('stTxt').textContent='ทุ่งล่า';$('arTxt').textContent=`ทุ่ง${AREAS[a].n}${elite?' · หัวหน้าฝูง':''}`;}
function fieldEnd(win){const F=B.field,M=fdState();B.over=true;let msg='',pt=0;
  if(win){M.fw++;M.fk=(M.fk||0)+1;const s=fdStage(F.a),g=Math.round(goldKill(s)*(F.elite?20:8)*gMul()),m=F.elite?3+Math.floor(s/8):1+Math.floor(Math.random()*2);S.gold+=g;S.mats+=m;
    if(F.elite&&(M.fpd||0)<FD_PT_DAY){pt++;}if(M.fw%5===0&&(M.fpd||0)+pt<FD_PT_DAY)pt++;if(pt){M.fp=(M.fp||0)+pt;M.fpd=(M.fpd||0)+pt;}
    const gem=F.elite?10:0;S.gems+=gem;
    msg=`ได้รับ 🪙 ${kf(g)} · ⛏️ ${m}${gem?' · 💎 '+gem:''}${pt?` · ⭐ แต้มสถานะ +${pt}`:''}`;banner('ชนะ!',F.elite?'ปราบหัวหน้าฝูง':'ล่าสำเร็จ');}
  else{msg='ทีมถอยกลับมาพัก ลองอัปเกรดทีมหรือเลือกทุ่งที่ง่ายกว่า';banner('ถอยทัพ','กลับไปตั้งหลัก');}
  save();setTimeout(()=>{if(screen==='battle')go('field');toast(msg);setTimeout(()=>{if(B&&B.over)nextWave();},300);},1400);}
const _ewFd=endWave;endWave=function(win,why){if(B&&B.field){fieldEnd(win);return;}return _ewFd(win,why);};
document.addEventListener('click',e=>{const sc=$('sc-field');if(!sc||sc.hidden||!sc.contains(e.target))return;
  const t=e.target.closest('[data-fdact]');if(t){if(t.dataset.fdact==='area'){fdArea=+t.dataset.v;renderField();}return;}
  const mb=e.target.closest('.fdmob');if(mb&&mb._m&&!mb._m.dead){fdFight(mb._m);return;}
  const wd=$('fdWorld');if(wd&&wd.contains(e.target)&&!fdBusy){const r=wd.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*100,y=(e.clientY-r.top)/r.height*100;if(y<55)return;fdMark(x,y);wkGo(fdMe,x,Math.max(60,y));}});
