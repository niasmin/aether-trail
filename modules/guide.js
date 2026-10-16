// ===================== GUIDE: unlocks · tutorial · next · daily missions =====================
const UNL=[
 {k:'summon',lv:5,ic:'✦',n:'อัญเชิญดวงดาว',img:'s_gate',d:'ใช้ตั๋วดาวเรียกฮีโร่ใหม่ 15 ตัว ตัวซ้ำเก็บเป็นสำเนาไว้เลื่อนดาว',how:['ได้ตั๋วฟรี 10 ใบตอนปลดล็อก','อัญเชิญ 10 ครั้งการันตี SR ขึ้นไป','ครั้งที่ 70 การันตี SSR']},
 {k:'tower',lv:7,ic:'🗼',n:'หอคอยท้าทาย',img:'t_enter',d:'ไต่ชั้นที่ยากขึ้นเรื่อย ๆ บางชั้นมีเงื่อนไขพิเศษให้ต้องปรับทีม',how:['ท้าได้ไม่จำกัดครั้ง','ดูเงื่อนไขชั้นก่อนเข้า แล้วจัดทีมให้แก้ทาง','ผ่านครั้งแรกได้คริสตัลและหินอีเธอร์']},
 {k:'pet',lv:10,ic:'🐉',n:'ฟักไข่สัตว์คู่หู',img:'n_pet',d:'ฟักไข่มังกรผลึก เลี้ยง และเลือกสกิลที่ช่วยทีมทุกการต่อสู้',how:['ได้ไข่ฟองแรกจากบอสที่เพิ่งปราบ','ใส่ไข่ในตู้ฟัก 1 ชั่วโมง','ป้อนอาหารหรือฝึกซ้อมให้เลเวลขึ้น']},
 {k:'dboss',lv:12,ic:'👑',n:'บอสประจำวัน',img:'boss1',d:'บอสเปลี่ยนทุกวัน ทำดาเมจให้มากที่สุดใน 60 วินาที',how:['สู้ได้วันละ 3 ครั้ง','ยิ่งได้ระดับสูงยิ่งได้รางวัลมาก','บอสไม่มีวันตาย เน้นตีให้แรง']},
 {k:'expe',lv:14,ic:'🧭',n:'ส่งทีมสำรวจ',img:'owl',d:'ส่งฮีโร่ที่ไม่ได้อยู่ทีมหลักไปเก็บของ กลับมาเมื่อครบเวลา',how:['ใช้ฮีโร่สำรองได้ ไม่กระทบทีมหลัก','นับเวลาแม้ปิดเกม','กลับมาแล้วกดรับได้ที่ "ไปทำต่อ"']},
 {k:'kingdom',lv:16,ic:'🏰',n:'อาณาจักรของฉัน',img:'k_city',d:'สร้างเมือง ฝึกทหาร แต่งตั้งฮีโร่เป็นแม่ทัพ แล้วส่งทัพตีป้อมชายแดน',how:['อัปฟาร์ม โรงเลื่อย เหมือง ให้ผลิตทรัพยากร','ฝึกทหารที่แท็บกองทัพ','ตีป้อมแรกที่แท็บชายแดน']},
 {k:'arena',lv:18,ic:'⚔️',n:'สนามประลอง PvP',img:'victory',d:'ท้าสู้ทีมผู้เล่นคนอื่นและบอท ไต่อันดับจากบรอนซ์ถึงตำนาน',how:['สู้ได้วันละ 5 ครั้ง','รับรางวัลตามระดับทุกวัน','ทีมของคุณเป็นคู่ต่อสู้ให้คนอื่นด้วย']},
 {k:'rebirth',lv:20,ic:'🌅',n:'เกิดใหม่',img:'s_token',d:'เริ่มเส้นทางใหม่แลกแก่นอีเธอร์ ซื้อพลังถาวรที่อยู่ตลอดไป',how:['ยิ่งไปไกลยิ่งได้แก่นมาก','ฮีโร่ ขั้นดาว และโหมดอื่นยังอยู่ครบ','ไม่ต้องรีบ ไปให้ไกลก่อนค่อยเกิดใหม่']},
 {k:'caravan',lv:22,ic:'🚚',n:'คาราวานการค้า',img:'n_cv',d:'ขนสินค้าจากเมืองไปขาย ทางไกลกำไรมากแต่เสี่ยงโดนโจร',how:['เลือกเส้นทาง สินค้า และทหารคุ้มกัน','กด "คุ้มกันแนะนำ" ถ้าไม่แน่ใจ','กลับมาแล้วรับได้ที่ "ไปทำต่อ"']},
 {k:'gen',lv:25,ic:'🏆',n:'ศึกแม่ทัพ',img:'n_gen',d:'ทหาร 100 นายเท่ากัน จัดทัพแก้ทางแม่ทัพคอมพิวเตอร์',how:['🏹 ชนะ 🔮 · 🔮 ชนะ 🛡️ · 🛡️ ชนะ 🏹','กด "แก้ทางอัตโนมัติ" ได้','แลกเหรียญเป็นธงและชุดกองทัพ']},
 {k:'craft',lv:28,ic:'⚒️',n:'สมาคมช่างฝีมือ',img:'n_craft',d:'ตีเหล็กให้ตรงจังหวะ ผลิตอุปกรณ์และยา แล้วมอบให้ฮีโร่',how:['กด "ตี!" ตอนเข็มอยู่ในแถบทอง','ยิ่งแม่นยิ่งได้ของคุณภาพสูง','รับคำสั่งผลิตจากลูกค้าทุกวัน']}];
const UNLK=Object.fromEntries(UNL.map(u=>[u.k,u]));
function modeOpen(k){const u=UNLK[k];if(!u)return true;return !!(S.unl&&S.unl[k])||S.best>=u.lv;}
const unlTxt=k=>`ปลดล็อกที่ด่าน ${sname(UNLK[k].lv-1)}`;
function guideMigrate(){if(!S.tutF)S.tutF={};
  if(!S.unl){S.unl={};const all=!!(S.pr&&S.pr.n);for(const u of UNL)if(all||S.best>=u.lv)S.unl[u.k]=1;
    if(S.gUnlocked)S.unl.summon=1;if(S.tower>0)S.unl.tower=1;if(S.pet)S.unl.pet=1;if(S.k){S.unl.kingdom=S.unl.caravan=S.unl.gen=S.unl.craft=1;}}
  if(S.tut==null)S.tut=isFresh(S)?0:99;}
const _migrate=migrate;migrate=function(){_migrate();guideMigrate();};guideMigrate();
let unlQ=[];
function guideUnlocks(){for(const u of UNL)if(!S.unl[u.k]&&S.best>=u.lv){S.unl[u.k]=1;unlQ.push(u);save();}
  if(unlQ.length&&!$('modalRoot').innerHTML&&!(B&&B.boss&&!B.over)){const u=unlQ.shift();
    modal(`<div class="mbox"><div class="mtitle">✨ ปลดล็อกโหมดใหม่!</div><div class="mbody"><div class="unlhero">${IMG[u.img]?`<img src="${IMG[u.img]}" alt="">`:''}<span>${u.ic}</span></div>
      <div style="text-align:center"><b class="unln">${u.n}</b></div><div class="sub" style="text-align:center">${u.d}</div>
      <div class="unlhow">${u.how.map((h,i)=>`<div><b>${i+1}</b>${h}</div>`).join('')}</div>
      <div style="display:flex;gap:8px;justify-content:center"><button class="btn gold" data-go="${u.k==='caravan'?'caravan':u.k}" data-act="close">ไปลองเลย</button><button class="btn sm" data-act="close" style="background:var(--parch3);color:var(--ink);box-shadow:none">ไว้ทีหลัง</button></div></div></div>`);}}
// ---- tutorial
const TUT=[
 {t:'จัดทีม',d:'แตะแท็บ "ทีม" แล้วกด "จัดทีมแนะนำ" ให้ฮีโร่ลงสนามครบ',go:'party',nav:'party',ok:()=>S.tutF.party,rw:{gems:20}},
 {t:'อัปเลเวลฮีโร่',d:'แตะแท็บ "ฮีโร่" แล้วกดอัปเลเวลจนมีฮีโร่ถึง Lv.5',go:'hero',nav:'hero',ok:()=>OWNED().some(k=>S.h[k].lv>=5),rw:{gold:800}},
 {t:'ปราบบอสแรก',d:'ผ่านด่าน 1-1 ถึง 1-9 แล้วกด "ท้าบอส" ปราบ'+AREAS[0].boss,go:'battle',nav:'boss',ok:()=>S.best>=10,rw:{gems:50}},
 {t:'อัญเชิญฮีโร่ใหม่',d:'ไปที่หอดูดาวแล้วใช้ตั๋วอัญเชิญอย่างน้อย 1 ครั้ง',go:'summon',nav:'modes',ok:()=>S.tutF.pull,rw:{tickets:2}},
 {t:'รับหีบรางวัล',d:'แตะหีบสมบัติมุมขวาล่าง รับของที่ทีมเก็บระหว่างที่คุณไม่อยู่',go:'chest',nav:'chest',ok:()=>S.tutF.chest,rw:{gems:30}}];
function guideTut(){const bar=$('tutBar');document.querySelectorAll('.tutglow').forEach(x=>x.classList.remove('tutglow'));
  if(S.tut>=TUT.length){bar.hidden=true;return;}
  let T=TUT[S.tut];while(T&&T.ok()){addRes(T.rw);toast(`✓ ${T.t} สำเร็จ · ได้รับ ${giveTxt(T.rw)}`);S.tut++;save();T=TUT[S.tut];if(!T){addRes({tickets:3,gems:100});setTimeout(()=>toast('🎉 จบบทแนะนำ! ได้รับ 3 ตั๋วดาว + 100 คริสตัล'),2700);save();bar.hidden=true;return;}}
  bar.hidden=screen!=='battle';$('tutT').textContent=`บทแนะนำ ${S.tut+1}/${TUT.length} · ${T.t}`;$('tutD').textContent=T.d;$('tutRw').textContent='รางวัล: '+giveTxt(T.rw);
  const el=T.nav==='chest'?$('chestBtn'):T.nav==='boss'?$('bossBtn'):document.querySelector(`.nav [data-go="${T.nav}"]`);if(el&&!(T.nav==='boss'&&S.best<9))el.classList.add('tutglow');}
// ---- daily missions
const DMP={
 kill:{ic:'⚔️',n:'ปราบศัตรู',need:40,go:'battle'},wave:{ic:'🗺️',n:'ชนะการต่อสู้ในเนื้อเรื่อง',need:10,go:'battle'},lvup:{ic:'⬆️',n:'อัปเลเวลฮีโร่',need:5,go:'hero'},
 chest:{ic:'🎁',n:'รับหีบรางวัลออฟไลน์',need:1,go:'battle'},summon:{ic:'✦',n:'อัญเชิญ',need:1,go:'summon',m:'summon'},tower:{ic:'🗼',n:'ท้าหอคอย',need:2,go:'tower',m:'tower'},
 dboss:{ic:'👑',n:'ท้าบอสประจำวัน',need:1,go:'dboss',m:'dboss'},arena:{ic:'⚔️',n:'สู้ PvP',need:2,go:'arena',m:'arena'},expe:{ic:'🧭',n:'ส่งทีมสำรวจ',need:1,go:'expe',m:'expe'},
 kfight:{ic:'🏰',n:'ส่งทัพตีป้อมชายแดน',need:1,go:'kingdom',m:'kingdom'},caravan:{ic:'🚚',n:'ส่งคาราวาน',need:1,go:'caravan',m:'caravan'},
 gen:{ic:'🏆',n:'ศึกแม่ทัพ',need:1,go:'gen',m:'gen'},craft:{ic:'⚒️',n:'ตีเหล็ก',need:1,go:'craft',m:'craft'},pet:{ic:'🐉',n:'ป้อนอาหารหรือฝึกมังกร',need:2,go:'pet',m:'pet'}};
function dmState(){if(!S.dm||S.dm.day!==dayNo()){let sd=dayNo()*9301+49297;const r=()=>{sd=(sd*233280+1)%2147483647;return sd/2147483647;};
    const pool=Object.keys(DMP).filter(k=>DMP[k].m&&modeOpen(DMP[k].m)&&!(k==='pet'&&!(S.pet&&S.pet.list.length)));const pick=[];
    while(pick.length<2&&pool.length)pick.push(pool.splice(Math.floor(r()*pool.length),1)[0]);while(pick.length<2)pick.push(pick.includes('wave')?'lvup':'wave');
    S.dm={day:dayNo(),list:['kill','chest',...(pick.includes('lvup')?['wave']:['lvup']),...pick],c:{},got:{},bonus:false};}return S.dm;}
const dmRw=()=>({gems:20,gold:Math.round(300*(1+S.best/4))});
function dmAdd(k,n){if(!n)return;const D=dmState();if(!D.list.includes(k))return;const was=(D.c[k]||0)>=DMP[k].need;D.c[k]=(D.c[k]||0)+n;if(!was&&D.c[k]>=DMP[k].need)toast(`📋 ภารกิจสำเร็จ: ${DMP[k].n} · กดรับที่ "ไปทำต่อ"`);}
const dmDone=k=>(dmState().c[k]||0)>=DMP[k].need;
function dmClaim(k){const D=dmState();if(D.got[k]||!dmDone(k))return null;D.got[k]=1;const r=dmRw();addRes(r);return r;}
function dmBonus(){const D=dmState();if(D.bonus||!D.list.every(k=>D.got[k]))return null;D.bonus=true;const r={tickets:2,gems:50};addRes(r);return r;}
// ---- next / claim-all
function nextData(){const now=Date.now(),cl=[],td=[];
  const sec=Math.min(OFFCAP(),(now-S.lastClaim)/1000);if(sec>=600)cl.push(['🎁','หีบรางวัลออฟไลน์ · '+fmtT(sec)]);
  if(S.expd){const n=S.expd.run.filter(r=>now>=r.end).length;if(n)cl.push(['🧭',`ทีมสำรวจกลับมาแล้ว ${n} ทีม`]);}
  const cv=S.k&&S.k.cv&&S.k.cv.run;if(cv&&now>=cv.end){if(!cv.amb)cl.push(['🚚','คาราวานกลับมาแล้ว']);else td.push(['🚚','คาราวานถูกโจรดัก! ไปสู้เพื่อเอาของคืน','caravan']);}
  if(S.pet&&S.pet.inc&&now>=S.pet.inc.end)cl.push(['🥚','ไข่มังกรพร้อมฟัก']);
  if(modeOpen('arena')&&S.arena&&S.arena.claim!==todayKey())cl.push(['🏅','รางวัล PvP ประจำวัน']);
  const D=dmState(),dmc=D.list.filter(k=>dmDone(k)&&!D.got[k]).length;if(dmc)cl.push(['📋',`รางวัลภารกิจประจำวัน ${dmc} ข้อ`]);if(!D.bonus&&D.list.every(k=>D.got[k]||dmDone(k)))cl.push(['🎉','โบนัสทำภารกิจครบ 5 ข้อ']);
  const bi=Math.floor(S.stage/10)*10+9;if(S.best>=bi&&!S.firsts[bi])td.push(['💀',`ท้าบอส ${AREAS[Math.floor(bi/10)].boss}`,'battle']);
  if(OWNED().some(k=>{const c=lvCost(S.h[k].lv);return S.gold>=c.g&&S.exp>=c.x;}))td.push(['⬆️','มีทองและ EXP พออัปเลเวลฮีโร่','hero']);
  if(modeOpen('summon')&&S.tickets>=1)td.push(['✦',`มีตั๋วดาว ${S.tickets} ใบ ไปอัญเชิญ`,'summon']);
  if(S.pet&&!S.pet.inc&&S.pet.eggs>0)td.push(['🥚',`มีไข่ ${S.pet.eggs} ฟอง ใส่ตู้ฟักได้`,'pet']);
  if(modeOpen('kingdom')&&S.k&&kRaidReady())td.push(['⚠️','ศัตรูกำลังบุกเมือง!','kingdom']);
  if(modeOpen('kingdom')&&S.k&&KB.some(b=>!kLevelUp(b.k)))td.push(['🏗️','มีอาคารที่อัปเกรดได้','kingdom']);
  if(modeOpen('dboss')&&dbState().tries>0)td.push(['👑',`บอสประจำวัน เหลือ ${dbState().tries} ครั้ง`,'dboss']);
  if(modeOpen('arena')&&arenaState().tix>0)td.push(['⚔️',`PvP เหลือ ${arenaState().tix} ครั้ง`,'arena']);
  if(modeOpen('expe')&&!(S.expd&&S.expd.run.length))td.push(['🧭','ยังไม่มีทีมสำรวจออกเดินทาง','expe']);
  if(modeOpen('caravan')&&S.k&&!(S.k.cv&&S.k.cv.run))td.push(['🚚','คาราวานว่าง ส่งไปค้าขายได้','caravan']);
  if(modeOpen('gen')&&S.k&&gbState().n<GB_TRIES&&gbState().beat<10)td.push(['🏆',`ศึกแม่ทัพ เหลือ ${GB_TRIES-gbState().n} ครั้ง`,'gen']);
  if(modeOpen('craft')&&S.k&&S.cr&&crState().ord.list.some(o=>!o.done&&S.cr.inv.some(it=>it.r===o.r&&it.q>=o.q)))td.push(['⚒️','มีของพร้อมส่งงานช่าง','craft']);
  if(modeOpen('tower'))td.push(['🗼',`ไต่หอคอย ชั้น ${S.tower+1}`,'tower']);
  return {cl,td};}
function renderNext(){const {cl,td}=nextData(),D=dmState(),all=D.list.every(k=>D.got[k]);
  modal(`<div class="mbox"><div class="mtitle">📋 ไปทำต่อ</div><div class="mbody nxt">
    <div class="nxh"><b>รับรางวัล</b>${cl.length?`<button class="btn gold sm" data-nact="all">รับทั้งหมด (${cl.length})</button>`:''}</div>
    ${cl.length?cl.map(([i,t])=>`<div class="nxr"><span>${i}</span><div>${t}</div></div>`).join(''):'<div class="sub">ยังไม่มีของให้รับตอนนี้</div>'}
    <div class="nxh"><b>ภารกิจประจำวัน</b><span class="sub">รีเซ็ตเที่ยงคืน</span></div>
    ${D.list.map(k=>{const M=DMP[k],c=Math.min(M.need,D.c[k]||0),done=c>=M.need;return `<div class="nxr dm ${D.got[k]?'got':''}"><span>${M.ic}</span><div><div>${M.n} <b class="num">${c}/${M.need}</b></div><div class="expbar"><i style="width:${c/M.need*100}%"></i></div><small class="sub">💎 20 · 🪙 ${kf(dmRw().gold)}</small></div>
      ${D.got[k]?'<em>✓</em>':done?`<button class="btn gold sm" data-nact="dm" data-v="${k}">รับ</button>`:`<button class="btn sm" data-go="${M.go}" data-act="close">ไป</button>`}</div>`;}).join('')}
    <div class="nxr bonus ${D.bonus?'got':''}"><span>🎉</span><div>ทำครบ 5 ข้อ · 🎫 2 ตั๋วดาว + 💎 50</div>${D.bonus?'<em>✓</em>':`<button class="btn gold sm" data-nact="bonus" ${all?'':'disabled'}>รับ</button>`}</div>
    <div class="nxh"><b>แนะนำให้ทำ</b></div>
    ${td.slice(0,7).map(([i,t,g])=>`<div class="nxr"><span>${i}</span><div>${t}</div><button class="btn sm" data-go="${g}" data-act="close">ไป</button></div>`).join('')||'<div class="sub">ทำครบหมดแล้ว เยี่ยมมาก!</div>'}
    <button class="btn sm" data-act="close" style="background:var(--parch3);color:var(--ink);box-shadow:none">ปิด</button></div></div>`);}
function claimAll(){const now=Date.now(),b0={gold:S.gold,exp:S.exp,mats:S.mats,gems:S.gems,tickets:S.tickets,soul:S.soul||0},notes=[];
  const el=(now-S.lastClaim)/1000,mins=Math.floor(Math.min(el,OFFCAP())/60);if(el>=600&&mins>0){const p=chestPreview(mins*60);S.gold+=p.g;S.exp+=p.x;S.mats+=p.m;S.lastClaim=el>=OFFCAP()?now:S.lastClaim+mins*60000;S.tutF.chest=1;dmAdd('chest',1);notes.push('🎁 หีบออฟไลน์');}
  if(S.expd){let n=0;for(let i=S.expd.run.length-1;i>=0;i--)if(expClaim(i))n++;if(n)notes.push(`🧭 ทีมสำรวจ ${n} ทีม`);}
  const cv=S.k&&S.k.cv&&S.k.cv.run;if(cv&&now>=cv.end&&!cv.amb){cvClaimDone(true,false);notes.push('🚚 คาราวาน');}
  const P=S.pet;if(P&&P.inc&&now>=P.inc.end){P.inc=null;const vv=P.list.length?Math.floor(Math.random()*PETV.length):0;P.list.push({v:vv,lv:1,xp:0,sk:PETV[vv].sk});if(P.act<0)P.act=P.list.length-1;notes.push(`🐉 ได้ ${petName(P.list[P.list.length-1])}`);}
  if(modeOpen('arena')&&S.arena&&S.arena.claim!==todayKey()){const A=arenaState();A.claim=todayKey();addRes(TIER_REW[TIERS.indexOf(tierOf(A.rating))]);notes.push('🏅 รางวัล PvP');}
  const D=dmState();let m=0;for(const k of D.list)if(dmClaim(k))m++;if(m)notes.push(`📋 ภารกิจ ${m} ข้อ`);if(dmBonus())notes.push('🎉 โบนัสภารกิจครบ');
  save();const got={};for(const k in b0){const d=(k==='soul'?(S.soul||0):S[k])-b0[k];if(d>0)got[k]=d;}
  modal(`<div class="mbox"><div class="mtitle">รับรางวัลทั้งหมด</div><div class="mbody"><div class="chestart"><img class="cimg" src="${IMG.chest}" alt=""></div>
    <div class="sub" style="text-align:center">${notes.join(' · ')||'ไม่มีของให้รับ'}</div>${Object.keys(got).length?`<div class="hint" style="text-align:center">ได้รับ ${giveTxt(got)}</div>`:''}
    <div style="display:flex;gap:8px;justify-content:center"><button class="btn gold" data-nact="open">กลับไปที่ไปทำต่อ</button><button class="btn sm" data-act="close">ปิด</button></div></div></div>`);
  if(screen==='battle')renderTeam();}
document.addEventListener('click',e=>{const b=e.target.closest('[data-nact]');if(!b)return;const a=b.dataset.nact;
  if(a==='open'){renderNext();return;}if(a==='all'){claimAll();return;}
  if(a==='dm'){const r=dmClaim(b.dataset.v);if(r){save();toast('ได้รับ '+giveTxt(r));}}
  else if(a==='bonus'){const r=dmBonus();if(r){save();toast('🎉 ได้รับ '+giveTxt(r));}}
  renderNext();});
// ---- tracking hooks
const _killEnemy=killEnemy;killEnemy=function(e){_killEnemy(e);if(B&&!B.pvp)dmAdd('kill',1);};
const _endWave=endWave;endWave=function(win,why){const story=B&&!B.tower&&!B.pvp&&!B.daily;_endWave(win,why);if(win&&story)dmAdd('wave',1);};
const _lvUp=lvUp;lvUp=function(k,max){const n=_lvUp(k,max);dmAdd('lvup',n);return n;};
const _pullOnce=pullOnce;pullOnce=function(){S.tutF.pull=1;dmAdd('summon',1);return _pullOnce.apply(this,arguments);};
const _startTower=startTower;startTower=function(f){dmAdd('tower',1);return _startTower(f);};
const _pvpEnd=pvpEnd;pvpEnd=function(w,why){dmAdd('arena',1);return _pvpEnd(w,why);};
const _startDaily=startDaily;startDaily=function(){dmAdd('dboss',1);return _startDaily();};
const _kFight=kFight;kFight=function(title){const was=kBusy;const r=_kFight.apply(this,arguments);if(kBusy&&!was){if(/^ศึกแม่ทัพ/.test(title))dmAdd('gen',1);else if(!/ป้องกันเมือง|โจร/.test(title))dmAdd('kfight',1);}return r;};
const _forgeStart=forgeStart;forgeStart=function(){_forgeStart();if(fg)dmAdd('craft',1);};
const _go=go;go=function(sc){if(UNLK[sc]&&!modeOpen(sc)){toast(`${UNLK[sc].n} ${unlTxt(sc)}`);sc='modes';}if(sc==='party')S.tutF.party=1;_go(sc);if(screen==='battle')guideTut();};
const gSnap=()=>({lc:S.lastClaim,ex:S.expd?Math.max(0,...S.expd.run.map(r=>r.start)):0,cv:S.k&&S.k.cv&&S.k.cv.run?S.k.cv.run.start:0,pt:S.pet?S.pet.list.reduce((a,p)=>a+p.lv*1e4+p.xp,0):0});
document.addEventListener('click',e=>{if(!e.target.closest('[data-act],[data-kact],[data-pact]'))return;const s0=gSnap();setTimeout(()=>{const s1=gSnap();
  if(s1.lc!==s0.lc){S.tutF.chest=1;dmAdd('chest',1);}if(s1.ex>s0.ex)dmAdd('expe',1);if(s1.cv&&s1.cv!==s0.cv)dmAdd('caravan',1);if(s1.pt>s0.pt)dmAdd('pet',1);},0);},true);
function guideTick(){guideUnlocks();if(screen==='battle'||!$('tutBar').hidden)guideTut();
  const {cl}=nextData(),nb=$('nextBtn');nb.querySelector('em').textContent=cl.length||'';nb.classList.toggle('has',cl.length>0);}
setInterval(guideTick,1000);
