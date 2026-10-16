// ===================== CARAVAN =====================
const CVG=[['food','🌾','ข้าวสาร',3],['wood','🪵','ไม้แปรรูป',4],['stone','🪨','แร่เหล็ก',5]];
const CVR=[
 {n:'หมู่บ้านริมน้ำ',ic:'🏞️',h:.5,risk:.05,m:1.4,bp:350,rep:1,dem:{food:1.3,wood:1,stone:.8},need:0,d:'ทางเรียบ ใกล้เมือง ปลอดภัย'},
 {n:'เมืองท่าทะเลทราย',ic:'🏜️',h:2,risk:.25,m:2.2,bp:1800,rep:2,dem:{food:1.5,wood:1.2,stone:.9},need:2,d:'ผ่านเนินทราย มีโจรทะเลทรายดักปล้น'},
 {n:'นครลอยฟ้า',ic:'☁️',h:4,risk:.4,m:3.2,bp:6000,rep:4,dem:{food:.9,wood:1.1,stone:1.6},need:5,d:'ทางสูงชัน โจรสลัดฟ้าชุกชุม ของหายากมาก',egg:.3},
 {n:'ช่องเขามรณะ',ic:'⛰️',h:8,risk:.6,m:4.5,bp:15000,rep:7,dem:{food:1.2,wood:1.6,stone:1.2},need:8,d:'เส้นทางอันตรายที่สุด กำไรสูงสุด ได้แบบแปลนเสมอ',egg:.5,bp2:1}];
let cvSel={r:0,g:'food',pct:.5,esc:{sh:0,ar:0,mg:0,sp:0}};
const cvState=()=>{const K=kState();if(!K.cv)K.cv={rep:0,run:null};return K.cv;};
const cvRepLv=()=>Math.floor(cvState().rep/10);
const cvCap=()=>300+200*kState().lv.hall;
function kArmyOf(cnt){const a=kArmy(false);return a.map(x=>({...x,n:cnt[x.k]||0}));}
function cvValue(r,g,n){const R=CVR[r],G=CVG.find(x=>x[0]===g);return Math.round(n*G[3]*R.m*R.dem[g]*(1+S.best/8)*(1+.05*cvRepLv())*(1+kGenFx().loot/100));}
function cvRecEsc(r){const P=CVR[r].bp*1.3,K=kState(),a=kArmy(false),o={sh:0,ar:0,mg:0,sp:0};let pw=0;
  for(let i=0;i<400&&pw<P;i++){for(const k of ['sh','ar','mg','sp']){if(pw>=P)break;if(o[k]<K.tr[k]){o[k]++;pw=kPow(kArmyOf(o));}}if(KU.every(u=>o[u.k]>=K.tr[u.k]))break;}return o;}
function renderCaravan(){const K=kState(),C=cvState(),now=Date.now(),run=C.run;
  let h=`<div class="card cvnpc"><img src="${IMG.n_cv}" alt=""><div><b>มาร์โค · พ่อค้าเร่</b><div class="sub">"${run?(now>=run.end?'คาราวานกลับมาแล้ว! มาดูกำไรกัน':'ขบวนกำลังเดินทาง อย่าเพิ่งใจร้อนนะ'):'เลือกสินค้า เส้นทาง แล้วหาทหารคุ้มกันให้ดี ทางไกลกำไรงามแต่โจรเยอะ'}"</div>
    <div class="sub">ชื่อเสียงเมือง Lv.${cvRepLv()} (${C.rep} แต้ม) · กำไร +${5*cvRepLv()}%</div></div></div>`;
  if(run){const R=CVR[run.r],G=CVG.find(x=>x[0]===run.g),left=run.end-now,pct=Math.min(100,(now-run.start)/(run.end-run.start)*100);
    h+=`<div class="card"><div class="kban" style="background-image:url(${IMG[left>0?'cv3':'cv6']})"></div><b>${R.ic} กำลังไป${R.n}</b>
      <div class="sub">${G[1]} ${G[2]} ${fmt(run.n)} หน่วย · ทหารคุ้มกัน ${KU.filter(u=>run.esc[u.k]).map(u=>u.ic+run.esc[u.k]).join(' ')||'ไม่มี'}</div>
      <div class="expbar"><i style="width:${pct}%"></i></div><div class="sub">${left>0?'ถึงปลายทางใน '+fmtLeft(left):'กลับถึงเมืองแล้ว'}</div>
      <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">${left>0?`<button class="btn sm" data-kact="cvRush" ${S.gems<30?'disabled':''}>เร่งทันที · 💎30</button>`:`<button class="btn gold" data-kact="cvClaim">รับคาราวาน</button>`}</div></div>`;
    return h;}
  const r=cvSel.r,R=CVR[r],stock=Math.floor(K.res[cvSel.g]),n=Math.max(0,Math.min(cvCap(),Math.floor(stock*cvSel.pct))),esc=cvSel.esc;
  for(const u of KU)esc[u.k]=Math.min(esc[u.k],K.tr[u.k]);
  const ep=kPow(kArmyOf(esc)),ratio=ep/R.bp,col=ratio>=1.15?'ok':ratio>=.85?'mid':'bad',val=cvValue(r,cvSel.g,n);
  h+=`<div class="card"><div class="kban" style="background-image:url(${IMG.cv2})"></div><b>1. เลือกเส้นทาง</b><div class="cvr">${CVR.map((X,i)=>{const lock=K.fort<X.need;return `<button class="cvri ${i===r?'on':''} ${lock?'lock':''}" data-kact="cvR" data-v="${i}" ${lock?'disabled':''}>
      <b>${X.ic} ${X.n}</b><small>${lock?`🔒 ชนะป้อมชายแดน ${X.need} แห่ง`:`${X.h<1?X.h*60+' นาที':X.h+' ชม.'} · เสี่ยง ${Math.round(X.risk*100)}% · กำไร x${X.m}`}</small></button>`;}).join('')}</div>
    <div class="sub" style="margin-top:4px">${R.d}${R.egg?` · มีโอกาสได้ไข่มังกร ${R.egg*100}%`:''}${R.bp2?' · ได้แบบแปลน 📜':''}</div></div>
  <div class="card"><div class="kban" style="background-image:url(${IMG.cv1})"></div><b>2. เลือกสินค้า</b> <span class="sub">บรรทุกได้สูงสุด ${fmt(cvCap())} หน่วย</span>
    <div class="cvg">${CVG.map(([k,ic,nm])=>`<button class="cvgi ${cvSel.g===k?'on':''}" data-kact="cvG" data-v="${k}"><span>${ic}</span><b>${nm}</b><small>มี ${kf(K.res[k])} · ${R.dem[k]>1.1?'🔥 ต้องการมาก':R.dem[k]<.95?'ขายถูก':'ราคาปกติ'} x${R.dem[k]}</small></button>`).join('')}</div>
    <div class="cvp">${[.25,.5,1].map(p=>`<button class="mtab ${cvSel.pct===p?'on':''}" data-kact="cvP" data-v="${p}">${p*100}%</button>`).join('')}<span class="sub">ส่ง ${fmt(n)} หน่วย</span></div></div>
  <div class="card"><div class="kban" style="background-image:url(${IMG.cv4})"></div><b>3. ทหารคุ้มกัน</b> <span class="sub">ทหารที่ไปคุ้มกันจะไม่อยู่ป้องกันเมืองจนกว่าจะกลับ</span>
    ${KU.map(u=>`<div class="cve"><img src="${IMG['u_'+u.k]}" alt=""><b>${u.n}</b><span class="sub">${esc[u.k]}/${K.tr[u.k]}</span><button class="btn sm" data-kact="cvE" data-v="${u.k}" data-n="-10">-10</button><button class="btn sm" data-kact="cvE" data-v="${u.k}" data-n="10">+10</button></div>`).join('')}
    <div class="cvp"><button class="btn sm gold" data-kact="cvRec">คุ้มกันแนะนำ</button><button class="btn sm" data-kact="cvNone">ไม่ส่งทหาร</button></div>
    <div class="sub">พลังคุ้มกัน <b class="num kp ${col}">${kf(ep)}</b> · โจรเส้นทางนี้ ~${kf(R.bp)} · โอกาสถูกดักปล้น ${Math.round(R.risk*100)}%</div></div>
  <div class="card cvsum"><div><b>คาดว่าได้ 🪙 ${kf(val)}</b><div class="sub">+ หินอีเธอร์ ~${Math.floor(n/40*R.m)} · ชื่อเสียง +${R.rep}</div></div>
    <button class="btn gold" data-kact="cvGo" ${n<10?'disabled':''}>ส่งคาราวาน</button></div>`;
  return h;}
function cvClaimDone(win,amb){const K=kState(),C=cvState(),run=C.run,R=CVR[run.r];let mul=amb?(win?1.2:.4):1;
  const g=Math.round(cvValue(run.r,run.g,run.n)*mul),m=Math.floor(run.n/40*R.m*mul);S.gold+=g;S.mats+=m;C.rep+=amb&&!win?0:R.rep;
  let extra='';if(R.bp2&&(!amb||win)){K.bp+=R.bp2;extra+=' · 📜 +'+R.bp2;}if(R.egg&&(!amb||win)&&Math.random()<R.egg){petState().eggs++;extra+=' · 🥚 ไข่มังกร +1';}
  if(run.r===2&&(!amb||win)){S.gems+=50;extra+=' · 💎 +50';}
  for(const u of KU)K.tr[u.k]+=run.esc[u.k];C.run=null;save();
  return `${amb?(win?'ฝ่าดงโจรสำเร็จ! ได้ของโจรเพิ่ม 20% · ':'ถูกปล้นไปบางส่วน ได้กลับมา 40% · '):'เดินทางราบรื่น · '}ได้รับ 🪙 ${kf(g)} · หินอีเธอร์ ${m}${extra}`;}
document.addEventListener('click',e=>{const b=e.target.closest('[data-kact]');if(!b)return;const a=b.dataset.kact,v=b.dataset.v;if(!a.startsWith('cv'))return;const K=kState(),C=cvState();
  if(a==='cvR')cvSel.r=+v;else if(a==='cvG')cvSel.g=v;else if(a==='cvP')cvSel.pct=+v;
  else if(a==='cvE'){cvSel.esc[v]=Math.max(0,Math.min(K.tr[v],cvSel.esc[v]+ +b.dataset.n));}
  else if(a==='cvRec')cvSel.esc=cvRecEsc(cvSel.r);else if(a==='cvNone')cvSel.esc={sh:0,ar:0,mg:0,sp:0};
  else if(a==='cvGo'){if(C.run)return;const R=CVR[cvSel.r];if(K.fort<R.need)return;const n=Math.min(cvCap(),Math.floor(K.res[cvSel.g]*cvSel.pct));if(n<10)return;
    K.res[cvSel.g]-=n;const esc={...cvSel.esc};for(const u of KU){esc[u.k]=Math.min(esc[u.k],K.tr[u.k]);K.tr[u.k]-=esc[u.k];}
    C.run={r:cvSel.r,g:cvSel.g,n,esc,start:Date.now(),end:Date.now()+R.h*3600e3,amb:Math.random()<R.risk};save();toast('คาราวานออกเดินทาง!');}
  else if(a==='cvRush'){if(!C.run||S.gems<30)return;S.gems-=30;C.run.end=Date.now();save();}
  else if(a==='cvClaim'){const run=C.run;if(!run||Date.now()<run.end)return;const R=CVR[run.r];
    if(!run.amb){const msg=cvClaimDone(true,false);modal(`<div class="mbox"><div class="mtitle">คาราวานกลับมาแล้ว</div><div class="mbody"><img class="kfimg" src="${IMG.cv6}" alt=""><div class="hint">${msg}</div><button class="btn gold" data-kact="fclose">ตกลง</button></div></div>`);}
    else{const has=KU.some(u=>run.esc[u.k]>0);
      if(!has){const msg=cvClaimDone(false,true);modal(`<div class="mbox"><div class="mtitle">ถูกโจรดักปล้น!</div><div class="mbody"><img class="kfimg" src="${IMG.cv4}" alt=""><div class="klose">ไม่มีทหารคุ้มกัน</div><div class="hint">${msg}</div><button class="btn gold" data-kact="fclose">ตกลง</button></div></div>`);}
      else{const army=kArmyOf(run.esc);kFight('โจรดักปล้นคาราวาน!',R.bp,'none',false,Rr=>{for(const u of KU){const l=Math.min(run.esc[u.k],Rr.loss[u.k]||0);run.esc[u.k]-=l;K.wd[u.k]+=l;}return cvClaimDone(Rr.win,true);},{army,imgs:[IMG.cv4,IMG.cv4,IMG.cv6],noLoss:1});}}
    renderKingdom();return;}
  renderKingdom();});

// ===================== PETS =====================
const PETV=[{n:'มรกต',f:'none',sk:'heal'},{n:'เพลิง',f:'hue-rotate(-150deg) saturate(1.3)',sk:'breath'},{n:'ราตรี',f:'hue-rotate(95deg) saturate(1.2)',sk:'shield'},{n:'สุริยะ',f:'hue-rotate(-105deg) saturate(1.6) brightness(1.08)',sk:'gold'}];
const PSK={shield:{ic:'🛡️',n:'โล่ผลึก',d:lv=>`ทุก 10 วิ สร้างโล่ให้ทั้งทีม ${(8*psP(lv)).toFixed(1)}% ของ HP`,cd:10},
  breath:{ic:'🔥',n:'ลมหายใจผลึก',d:lv=>`ทุก 8 วิ พ่นผลึกใส่ศัตรูทุกตัว ${Math.round(120*psP(lv))}% ของพลังโจมตีเฉลี่ยทีม`,cd:8},
  heal:{ic:'💚',n:'พรแห่งผลึก',d:lv=>`ทุก 10 วิ ฟื้นฟูทั้งทีม ${(6*psP(lv)).toFixed(1)}% ของ HP`,cd:10},
  gold:{ic:'💰',n:'จมูกหาสมบัติ',d:lv=>`ทองจากการต่อสู้ +${Math.round(5+lv)}% (ติดตัวตลอด)`,cd:0}};
const PMAX=30,psP=lv=>1+.06*(lv-1),pXp=lv=>Math.round(100*Math.pow(lv,1.5)),PINC=3600e3,PEGG=300;
function petState(){if(!S.pet)S.pet={eggs:1,inc:null,list:[],act:-1,buyDay:-1};return S.pet;}
const petOpen=()=>S.best>=5||!!S.pet;
function petAct(){const P=S.pet;return P&&P.act>=0?P.list[P.act]:null;}
const petVb=(p,k)=>PETV[p.v].sk===k?1.2:1;
function petGold(){const p=petAct();return p&&p.sk==='gold'?1+(5+p.lv)/100*petVb(p,'gold'):1;}
function petPow(){const p=petAct();return p?1+.005*p.lv:1;}
const petName=p=>'มังกรผลึก'+PETV[p.v].n;
function petImg(p,cls){return `<img class="${cls||''}" src="${IMG.n_pet}" alt="" style="filter:${PETV[p.v].f}">`;}
let petView=0;
function renderPet(){const P=petState(),now=Date.now(),inc=P.inc,p=P.list[petView]||P.list[0];
  const steps=[['pet1','หาไข่จากการผจญภัย'],['pet2','นำไข่เข้าตู้ฟัก'],['pet3','ฟักเป็นมังกรน้อย'],['pet4','ป้อนอาหาร ฝึกฝน'],['pet5','ช่วยทีมในการต่อสู้']];
  let h=`<div class="card"><div class="kban" style="background-image:url(${IMG[P.list.length?'pet4':'pet1']})"></div><b>🐉 ฟักไข่สัตว์คู่หู</b>
    <div class="sub">สัตว์คู่หูตัวที่เลือกจะติดตามทีมทุกการต่อสู้ ใช้สกิลช่วยอัตโนมัติ และเพิ่มพลังทีม +0.5% ต่อเลเวล</div>
    <div class="petsteps">${steps.map(([k,t],i)=>`<span><img src="${IMG[k]}" alt=""><small>${i+1}. ${t}</small></span>`).join('')}</div></div>
  <div class="card petinc"><img class="eggimg" src="${IMG.egg}" alt=""><div style="flex:1;min-width:0"><b>ไข่มังกร ${P.eggs} ฟอง</b>
    <div class="sub">ได้จาก: ปราบบอสพื้นที่ครั้งแรก · คาราวานเส้นทางไกล · ป้อมชายแดน 5 และ 10 · ซื้อด้วยคริสตัล</div>
    ${inc?`<div class="expbar"><i style="width:${Math.min(100,(1-(inc.end-now)/PINC)*100)}%"></i></div><div class="sub">${now>=inc.end?'ไข่กำลังจะแตก!':'ฟักเสร็จใน '+fmtLeft(inc.end-now)}</div>`:''}
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">
      ${inc?(now>=inc.end?`<button class="btn gold" data-pact="hatch">ฟักไข่!</button>`:`<button class="btn sm" data-pact="rush" ${S.gems<50?'disabled':''}>ฟักทันที · 💎50</button>`):`<button class="btn gold sm" data-pact="incubate" ${P.eggs<1?'disabled':''}>ใส่ตู้ฟัก (1 ชม.)</button>`}
      <button class="btn sm" data-pact="buyEgg" ${S.gems<PEGG||P.buyDay===dayNo()?'disabled':''}>${P.buyDay===dayNo()?'ซื้อไข่แล้ววันนี้':'ซื้อไข่ · 💎'+PEGG}</button></div></div></div>`;
  if(!P.list.length){h+=`<div class="card" style="text-align:center"><div class="sub">ยังไม่มีสัตว์คู่หู ใส่ไข่ในตู้ฟักเพื่อเริ่มต้น</div></div>`;$('petPad').innerHTML=h;return;}
  const i=P.list.indexOf(p),need=pXp(p.lv),fc=60+p.lv*20,ec=Math.round(400*Math.pow(p.lv,1.4)),food=S.k?Math.floor(S.k.res.food):0;
  h+=`<div class="pettabs">${P.list.map((q,j)=>`<button class="pett ${j===i?'on':''}" data-pact="view" data-v="${j}">${petImg(q)}<small>${PETV[q.v].n} Lv.${q.lv}${j===P.act?' ★':''}</small></button>`).join('')}</div>
  <div class="card petmain"><div class="petstage">${petImg(p,'petbig')}</div><div class="petname"><b>${petName(p)}</b> <span class="badge on">Lv.${p.lv}/${PMAX}</span>${i===P.act?' <span class="badge">ติดตามทีมอยู่</span>':''}</div>
    <div class="sub" style="text-align:center">ธาตุ${PETV[p.v].n}: สกิล ${PSK[PETV[p.v].sk].n} แรงขึ้น 20% · พลังทีม +${(p.lv*.5).toFixed(1)}%</div>
    ${p.lv<PMAX?`<div class="expbar"><i style="width:${p.xp/need*100}%"></i></div><div class="sub" style="text-align:center">EXP ${p.xp}/${need}</div>
    <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap"><button class="btn sm gold" data-pact="feed" ${food<fc?'disabled':''}>ป้อนผลไม้ · 🌾${fc} (+40)</button><button class="btn sm" data-pact="train" ${S.exp<ec?'disabled':''}>ฝึกซ้อม · EXP ${kf(ec)} (+60)</button></div>
    ${S.k?'':'<div class="sub" style="text-align:center">ปลดล็อกอาณาจักรเพื่อผลิตอาหารเลี้ยงมังกร</div>'}`:'<div class="sub" style="text-align:center">เลเวลสูงสุดแล้ว</div>'}
    ${i!==P.act?`<button class="btn gold" data-pact="setAct" data-v="${i}" style="margin-top:8px">ให้ติดตามทีม</button>`:''}</div>
  <div class="card"><b>เลือกสกิลคู่หู</b> <span class="sub">สลับได้ทุกเมื่อ</span><div class="pskl">${Object.entries(PSK).map(([k,s])=>`<button class="psk ${p.sk===k?'on':''}" data-pact="sk" data-v="${k}"><span>${s.ic}</span><div><b>${s.n}${PETV[p.v].sk===k?' ✦':''}</b><small>${s.d(p.lv)}</small></div></button>`).join('')}</div></div>`;
  $('petPad').innerHTML=h;}
document.addEventListener('click',e=>{const b=e.target.closest('[data-pact]');if(!b)return;const a=b.dataset.pact,v=b.dataset.v,P=petState();const p=P.list[petView]||P.list[0];
  if(a==='view')petView=+v;
  else if(a==='incubate'){if(P.inc||P.eggs<1)return;P.eggs--;P.inc={end:Date.now()+PINC};toast('ใส่ไข่ในตู้ฟักแล้ว');}
  else if(a==='rush'){if(!P.inc||S.gems<50)return;S.gems-=50;P.inc.end=Date.now();}
  else if(a==='buyEgg'){if(S.gems<PEGG||P.buyDay===dayNo())return;S.gems-=PEGG;P.eggs++;P.buyDay=dayNo();toast('ได้ไข่มังกร 1 ฟอง');}
  else if(a==='hatch'){if(!P.inc||Date.now()<P.inc.end)return;P.inc=null;const vv=P.list.length?Math.floor(Math.random()*PETV.length):0;const np={v:vv,lv:1,xp:0,sk:PETV[vv].sk==='gold'?'gold':PETV[vv].sk};P.list.push(np);petView=P.list.length-1;if(P.act<0)P.act=petView;save();
    modal(`<div class="mbox"><div class="mtitle">ไข่ฟักแล้ว!</div><div class="mbody"><img class="kfimg" src="${IMG.pet3}" alt=""><div class="petstage">${petImg(np,'petbig hatchfx')}</div><div style="text-align:center"><b>${petName(np)}</b></div><div class="sub" style="text-align:center">ธาตุ${PETV[vv].n} · สกิลเด่น ${PSK[PETV[vv].sk].n}</div><button class="btn gold" data-act="close">เยี่ยมเลย!</button></div></div>`);renderPet();return;}
  else if(a==='feed'||a==='train'){if(!p||p.lv>=PMAX)return;if(a==='feed'){const c=60+p.lv*20;if(!S.k||S.k.res.food<c)return;S.k.res.food-=c;p.xp+=40;}else{const c=Math.round(400*Math.pow(p.lv,1.4));if(S.exp<c)return;S.exp-=c;p.xp+=60;}
    let up=0;while(p.lv<PMAX&&p.xp>=pXp(p.lv)){p.xp-=pXp(p.lv);p.lv++;up++;}if(p.lv>=PMAX)p.xp=0;if(up)toast(`${petName(p)} เลเวลอัป! Lv.${p.lv}`);}
  else if(a==='setAct'){P.act=+v;toast('มังกรติดตามทีมแล้ว');}
  else if(a==='sk'){if(p)p.sk=v;}
  save();renderPet();});
setInterval(()=>{if(screen==='pet'&&S.pet&&S.pet.inc&&!$('modalRoot').innerHTML)renderPet();},5000);
function petTick(dt){const p=petAct();if(!p||!B||B.pvp)return;
  if(!B.petEl||!B.petEl.isConnected){const d=document.createElement('div');d.className='petu';d.innerHTML=petImg(p);unitsEl.appendChild(d);B.petEl=d;const [x,y]=px([7,72]);d.style.left=x+'px';d.style.top=y+'px';d.style.height=(SH*.13)+'px';B.petT=3;}
  const S1=PSK[p.sk];if(!S1.cd)return;B.petT-=dt;if(B.petT>0)return;B.petT=S1.cd;const hs=alive(B.heroes),en=alive(B.en);if(!hs.length)return;const pw=psP(p.lv)*petVb(p,p.sk);
  const [cx,cy]=px([7,66]);const me={cx,cy};dmgNum(me,S1.n,'sk');B.petEl.animate([{transform:'translateY(0)'},{transform:'translateY(-12px) scale(1.1)'},{transform:'translateY(0)'}],{duration:400});
  if(p.sk==='shield'){hs.forEach(h=>{h.shield=(h.shield||0)+Math.round(h.max*.08*pw);burst(h.cx,h.cy,50,'#bfe6ff',600);});}
  else if(p.sk==='heal'){hs.forEach(h=>heal(h,h.max*.06*pw,{healed:0}));}
  else if(p.sk==='breath'&&en.length){const avg=hs.reduce((s,h)=>s+h.atk,0)/hs.length,src={atk:avg*1.2*pw,crit:5,rl:'pet',dealt:0};en.forEach(t=>{burst(t.cx,t.cy,45,'#b8f4ff',500);dealTo(t,1,src);});}}
function petEggDrop(why){const P=petState();P.eggs++;setTimeout(()=>toast(`🥚 ได้ไข่มังกร 1 ฟอง (${why})`),3200);}
