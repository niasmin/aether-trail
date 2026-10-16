// ===================== KINGDOM =====================
const KB=[
 {k:'hall',ic:'🏰',n:'ศาลากลาง',d:'กำหนดระดับเมือง อาคารอื่นอัปได้ไม่เกินระดับศาลากลาง และปลดล็อกอาคารใหม่'},
 {k:'farm',ic:'🌾',n:'ฟาร์ม',d:'ผลิตอาหาร ใช้ฝึกทหารและรักษาทหาร'},
 {k:'saw',ic:'🪵',n:'โรงเลื่อย',d:'ผลิตไม้ ใช้ก่อสร้างอาคาร'},
 {k:'mine',ic:'⛏️',n:'เหมือง',d:'ผลิตหินและเหล็ก ใช้ก่อสร้างและฝึกทหาร'},
 {k:'bar',ic:'⚔️',n:'ค่ายทหาร',d:'เพิ่มจำนวนทหารสูงสุดและพลังทหารทุกหน่วย'},
 {k:'hosp',ic:'🏥',n:'โรงพยาบาล',d:'รักษาทหารบาดเจ็บหลังรบ ยิ่งระดับสูงยิ่งเร็ว'},
 {k:'wall',ic:'🛡️',n:'กำแพงเมือง',d:'เพิ่มพลังทหารเมื่อป้องกันเมืองจากการบุก'}];
const KUNL={hall:1,farm:1,saw:1,mine:1,bar:1,hosp:2,wall:2},KMAX=5;
const KCOST=[{w:60,s:30,g:0,bp:0},{w:220,s:140,g:3000,bp:0},{w:600,s:420,g:15000,bp:0},{w:1400,s:1000,g:60000,bp:1},{w:3000,s:2200,g:200000,bp:2}];
const KU=[
 {k:'sh',ic:'🛡️',n:'ทหารโล่',d:'ป้องกันแนวหน้า รับดาเมจแทนทัพ',rl:'knight',hp:60,atk:5,f:6,s:2},
 {k:'ar',ic:'🏹',n:'พลธนู',d:'ยิงจากแนวหลัง ดาเมจเดี่ยวสูง',rl:'ranger',hp:24,atk:14,f:5,s:3},
 {k:'mg',ic:'🔮',n:'นักเวท',d:'โจมตีหมู่ ยิ่งศัตรูหลายแบบยิ่งแรง',rl:'mage',hp:20,atk:11,f:6,s:4},
 {k:'sp',ic:'💚',n:'หน่วยสนับสนุน',d:'ฟื้นฟูทัพทุกยก ช่วยให้ทัพอยู่ได้นาน',rl:'healer',hp:28,atk:3,heal:7,f:7,s:2}];
const KUM=Object.fromEntries(KU.map(u=>[u.k,u]));
const KRES=[['food','🌾','อาหาร'],['wood','🪵','ไม้'],['stone','🪨','หิน/เหล็ก']];
const KTRAIT={
 none:{ic:'⚔️',n:'ทัพผสม',d:'ไม่มีจุดเด่นพิเศษ',tip:'จัดทัพสมดุลได้เลย'},
 swarm:{ic:'🐜',n:'ฝูงมหึมา',d:'ศัตรูจำนวนมากแต่อ่อนแอ',tip:'นักเวทแรงขึ้น 60% ที่นี่ ฝึกนักเวทเพิ่ม'},
 archer:{ic:'🎯',n:'ป้อมธนู',d:'ลูกธนูข้ามแนวโล่ไปถึงแนวหลังได้ครึ่งหนึ่ง',tip:'เพิ่มทหารโล่และหน่วยสนับสนุน ให้แม่ทัพอัศวินเสริม HP'},
 armor:{ic:'🪨',n:'กำแพงหนา',d:'ดาเมจจากพลธนูและทหารโล่ -50%',tip:'ดาเมจหลักต้องมาจากนักเวท'},
 magres:{ic:'🌀',n:'ต้านเวท',d:'ดาเมจจากนักเวท -60%',tip:'พลธนูคือกำลังหลัก ให้แม่ทัพนักธนูคุม'},
 boss:{ic:'👑',n:'ป้อมราชันย์',d:'ทัพชั้นยอดทุกหน่วย แข็งแกร่งเป็นพิเศษ',tip:'ต้องอัปค่ายทหารเต็มและมีแม่ทัพครบ 4 ตำแหน่ง'}};
const KF=[
 {n:'ค่ายโจรป่า',t:'none',p:900,site:'wood',sn:'ป่าไม้ริมค่าย',rw:{wood:400,food:300}},
 {n:'ทุ่งข้าวร้าง',t:'swarm',p:1500,site:'food',sn:'ทุ่งข้าวทองคำ',rw:{food:600,stone:200}},
 {n:'ป้อมพลธนูหน้าผา',t:'archer',p:2300,rw:{bp:1,stone:500,gems:60}},
 {n:'เหมืองหินยึดครอง',t:'armor',p:3400,site:'stone',sn:'เหมืองเหล็กเก่า',rw:{stone:900,wood:500}},
 {n:'หอเวทเงา',t:'magres',p:5000,rw:{bp:1,food:1200,gems:100}},
 {n:'ป่าไม้ต้องสาป',t:'swarm',p:7200,site:'wood',sn:'ป่าไม้ยักษ์',rw:{wood:2000,bp:1}},
 {n:'ป้อมปราการเหล็ก',t:'armor',p:10000,rw:{bp:2,stone:2000,gems:150}},
 {n:'ไร่โอเอซิสทะเลทราย',t:'archer',p:13500,site:'food',sn:'โอเอซิสอุดม',rw:{food:3500,tickets:1}},
 {n:'หอคอยจันทรา',t:'magres',p:17500,site:'stone',sn:'เหมืองผลึกจันทรา',rw:{stone:4000,bp:2,gems:200}},
 {n:'ป้อมราชันย์ชายแดน',t:'boss',p:23000,rw:{bp:3,gems:400,tickets:3}}];
const KOPEN=10,kFortReq=i=>KOPEN+i*4;
const CMDN={knight:'ปราการเหล็ก',ranger:'ห่าธนู',mage:'พายุเวท',healer:'พรแห่งการฟื้นฟู'};
const CMDX={g_moon:{shp:15,t:'โล่จันทรา: ทหารโล่ได้โล่เพิ่ม 15% ของ HP'},g_aur:{allatk:8,t:'ดาราจักรนำทัพ: ทั้งทัพ ATK +8%'},
 g_pip:{hosp:50,t:'ยาเร่งฟื้น: รักษาทหารเร็วขึ้น 50%'},g_tilly:{hosp:25,t:'สมุนไพรป่า: รักษาทหารเร็วขึ้น 25%'},healer:{hosp:20,t:'มือเยียวยา: รักษาทหารเร็วขึ้น 20%'},
 g_bold:{wall:20,t:'ผู้พิทักษ์พงไพร: ป้องกันเมือง +20%'},knight:{wall:15,t:'ปราการแห่งเมือง: ป้องกันเมือง +15%'},
 g_gog:{res:'stone',rv:15,t:'นักขุดแร่: เหมืองผลิต +15%'},g_mush:{res:'food',rv:10,t:'เห็ดเกษตร: ฟาร์มผลิต +10%'},g_rob:{loot:20,t:'พรานเก็บของ: รางวัลป้อม +20%'},
 g_yuki:{allatk:4,t:'ลมหนาว: ทั้งทัพ ATK +4%'},g_nyx:{loot:15,t:'แสงจันทร์นำทาง: รางวัลป้อม +15%'}};
function kState(){if(!S.k)S.k={lv:{hall:1,farm:1,saw:1,mine:1,bar:1,hosp:0,wall:0},res:{food:600,wood:600,stone:400},bp:0,tr:{sh:10,ar:10,mg:0,sp:0},wd:{sh:0,ar:0,mg:0,sp:0},gen:{sh:null,ar:null,mg:null,sp:null},fort:0,sites:[],t:Date.now(),raidDay:-1,tab:'city',acc:0};
  const K=S.k;for(const g in K.gen)if(K.gen[g]&&!S.h[K.gen[g]])K.gen[g]=null;return K;}
const kOpen=()=>S.best>=KOPEN||!!S.k;
function cmdOf(k){const H=HEROES[k];if(!H)return null;const v=({R:8,SR:12,SSR:18}[H.rar]||12)+rkOf(k)+Math.floor((S.h[k]?S.h[k].lv:1)/10);
  const fx={knight:['sh','hp','ทหารโล่ HP'],ranger:['ar','atk','พลธนู ATK'],mage:['mg','atk','นักเวท ATK'],healer:['sp','heal','หน่วยสนับสนุน ฟื้นฟู']}[H.rl];
  return {u:fx[0],stat:fx[1],v,n:CMDN[H.rl],txt:`${fx[2]} +${v}%`,x:CMDX[k]||null};}
function kGenFx(){const K=kState(),o={atk:{},hp:{},heal:0,allatk:0,shp:0,hosp:0,wall:0,res:{},loot:0};
  for(const u of KU){const k=K.gen[u.k];if(!k)continue;const c=cmdOf(k),f=c.u===u.k?1:.5;
    if(c.stat==='heal')o.heal+=c.v*f;else o[c.stat][u.k]=(o[c.stat][u.k]||0)+c.v*f;
    const x=c.x;if(x){o.allatk+=x.allatk||0;o.shp+=x.shp||0;o.hosp+=x.hosp||0;o.wall+=x.wall||0;o.loot+=x.loot||0;if(x.res)o.res[x.res]=(o.res[x.res]||0)+x.rv;}}
  return o;}
const kBarMult=()=>1+.12*(kState().lv.bar-1);
const kCap=()=>20+20*kState().lv.bar;
const kHospRate=()=>{const K=kState();return K.lv.hosp?K.lv.hosp*15*(1+kGenFx().hosp/100):0;};
function kProd(){const K=kState(),g=kGenFx(),site=r=>K.sites.filter(x=>x===r).length*.25;
  return {food:K.lv.farm*120*(1+site('food')+(g.res.food||0)/100),wood:K.lv.saw*100*(1+site('wood')+(g.res.wood||0)/100),stone:K.lv.mine*80*(1+site('stone')+(g.res.stone||0)/100)};}
function kTick(){if(!S.k)return;const K=S.k,now=Date.now(),dt=Math.min(OFFCAP(),Math.max(0,(now-K.t)/1000));K.t=now;if(dt<=0)return;
  const p=kProd();for(const r in p)K.res[r]+=p[r]*dt/3600;
  K.acc=(K.acc||0)+kHospRate()*dt/3600;let h=Math.floor(K.acc);if(h>0){K.acc-=h;for(const u of KU){const m=Math.min(h,K.wd[u.k]);K.wd[u.k]-=m;K.tr[u.k]+=m;h-=m;}if(!kWounded())K.acc=0;}}
const kWounded=()=>KU.reduce((a,u)=>a+S.k.wd[u.k],0);
function kArmy(defend){const K=kState(),g=kGenFx(),bm=kBarMult(),wm=defend?1+.25*K.lv.wall+g.wall/100:1;
  return KU.map(u=>({k:u.k,n:K.tr[u.k],hp:u.hp*bm*wm*(1+(g.hp[u.k]||0)/100+(u.k==='sh'?g.shp/100:0)),atk:u.atk*bm*wm*(1+(g.atk[u.k]||0)/100+g.allatk/100),heal:(u.heal||0)*bm*(1+g.heal/100)}));}
const kPow=a=>Math.round(a.reduce((s,x)=>s+x.n*(x.hp*.25+x.atk*2.5+x.heal*2),0));
function kFoe(P,t){const mix=t==='archer'?{sh:.2,ar:.5,mg:.15,sp:.15}:t==='armor'?{sh:.5,ar:.2,mg:.15,sp:.15}:t==='magres'?{sh:.3,ar:.2,mg:.35,sp:.15}:{sh:.3,ar:.3,mg:.2,sp:.2};
  const m=t==='swarm'?.45:t==='boss'?1.6:1;const per=KU.reduce((s,u)=>s+mix[u.k]*(u.hp*.25+u.atk*2.5+(u.heal||0)*2),0)*m,N=P/per;
  return KU.map(u=>({k:u.k,n:Math.max(1,Math.round(N*mix[u.k])),hp:u.hp*m,atk:u.atk*m,heal:(u.heal||0)*m}));}
function kSim(my,foe,trait,defend){
  const mk=a=>a.map(x=>({...x,max:x.n*x.hp,pool:x.n*x.hp,n0:x.n}));const A=mk(my),F=mk(foe),rounds=[];
  const alive=x=>x.pool>0?Math.ceil(x.pool/x.hp-1e-9):0;
  const dmgOf=(side,other,mine)=>{const types=other.filter(x=>x.pool>0).length;let d=0;for(const x of side){const n=alive(x);if(!n)continue;let a=n*x.atk;
      if(x.k==='mg')a*=1+.1*types+(mine&&trait==='swarm'?.6:0);
      if(mine&&trait==='armor'&&(x.k==='ar'||x.k==='sh'))a*=.5;if(mine&&trait==='magres'&&x.k==='mg')a*=.4;d+=a;}return d;};
  const hit=(side,d,pierce)=>{const sh=side.find(x=>x.k==='sh');let toSh=sh.pool>0?d*(1-pierce):0;const rest=d-toSh;
    if(toSh){const t=Math.min(toSh,sh.pool);sh.pool-=t;toSh-=t;}let r=rest+toSh;const back=side.filter(x=>x.k!=='sh'&&x.pool>0);
    if(!back.length){if(sh.pool>0)sh.pool=Math.max(0,sh.pool-r);return;}const tot=back.reduce((s,x)=>s+x.pool,0);back.forEach(x=>{x.pool=Math.max(0,x.pool-r*x.pool/tot);});};
  const heal=side=>{const sp=side.find(x=>x.k==='sp');let h=alive(sp)*sp.heal;if(!h)return;const hurt=side.filter(x=>x.pool>0&&x.pool<x.max);const lost=hurt.reduce((s,x)=>s+x.max-x.pool,0);if(!lost)return;hurt.forEach(x=>{x.pool=Math.min(x.max,x.pool+h*(x.max-x.pool)/lost);});};
  const tot=s=>s.reduce((a,x)=>a+x.pool,0),mA=tot(A)||1,mF=tot(F)||1;let win=false;
  for(let r=1;r<=10;r++){const dA=dmgOf(A,F,true),dF=dmgOf(F,A,false);hit(F,dA,0);hit(A,dF,trait==='archer'?.5:0);heal(A);heal(F);
    rounds.push([tot(A)/mA,tot(F)/mF]);if(tot(F)<=0){win=true;break;}if(tot(A)<=0)break;}
  if(defend&&tot(A)>0)win=true;
  const loss={};A.forEach(x=>{loss[x.k]=x.n0-alive(x);});return {win,rounds,loss};}
function kLevelUp(b){const K=kState(),l=K.lv[b];if(l>=KMAX)return 'ระดับสูงสุดแล้ว';if(b!=='hall'&&l>=K.lv.hall)return 'อัปศาลากลางก่อน';if(K.lv.hall<KUNL[b])return `ปลดล็อกเมื่อศาลากลาง Lv.${KUNL[b]}`;
  const c=kCostOf(b);if(K.res.wood<c.w)return 'ไม้ไม่พอ';if(K.res.stone<c.s)return 'หินไม่พอ';if(S.gold<c.g)return 'ทองไม่พอ';if(K.bp<c.bp)return 'แบบแปลนไม่พอ';return '';}
function kCostOf(b){const K=kState(),c=KCOST[Math.min(KMAX-1,K.lv[b])],m=b==='hall'?1.5:1;return {w:Math.round(c.w*m),s:Math.round(c.s*m),g:Math.round(c.g*m),bp:c.bp};}
function kEffect(b,l){if(!l)return 'ยังไม่ได้สร้าง';const K=kState(),site=r=>K.sites.filter(x=>x===r).length*.25;
  return {hall:`ระดับเมือง ${l} · อาคารอื่นสูงสุด Lv.${l}`,farm:`อาหาร ${fmt(l*120*(1+site('food')))}/ชม.`,saw:`ไม้ ${fmt(l*100*(1+site('wood')))}/ชม.`,mine:`หิน ${fmt(l*80*(1+site('stone')))}/ชม.`,
    bar:`ทหารสูงสุด ${20+20*l} ต่อหน่วย · พลัง +${12*(l-1)}%`,hosp:`รักษา ${l*15} นาย/ชม.`,wall:`ป้องกันเมือง +${25*l}%`}[b];}
const resTxt=r=>Object.entries(r).filter(([k,v])=>v).map(([k,v])=>({food:'🌾',wood:'🪵',stone:'🪨',bp:'📜',gems:'💎',tickets:'🎫'}[k]+' '+kf(v))).join(' · ');
function kRaidFoe(){const K=kState();return {P:Math.round(KF[Math.min(9,K.lv.hall*2-1)].p*.8),t:K.lv.hall>=4?'boss':'none'};}
const kRaidReady=()=>kState().lv.wall>0&&kState().raidDay!==dayNo();
let kPick=null,kBusy=false;
function renderKingdom(){kTick();const K=kState(),p=kProd(),tab=K.tab||'city',army=kArmy(),pw=kPow(army);
  const top=`<div class="khero" style="background-image:url(${IMG.k_city})"><div class="kname"><b>เมืองท่าของฉัน</b><span>ระดับเมือง ${K.lv.hall} · พลังทัพ ${kf(pw)}</span></div></div>
  <div class="kres">${KRES.map(([r,i,n])=>`<div><span>${i}</span><b class="num">${kf(K.res[r])}</b><small>+${kf(p[r])}/ชม.</small></div>`).join('')}<div><span>📜</span><b class="num">${K.bp}</b><small>แบบแปลน</small></div></div>
  <div class="mtabs ktabs">${[['city','🏘️ เมือง'],['army','⚔️ กองทัพ'],['front','🗺️ ชายแดน']].map(([k,n])=>`<button class="mtab ${tab===k?'on':''}" data-kact="tab" data-v="${k}">${n}</button>`).join('')}</div>`;
  let body='';
  if(tab==='city'){
    body=(kRaidReady()?`<div class="card kraid"><img src="${IMG.k_raid}" alt=""><div><b>⚠ ศัตรูกำลังบุกเมือง!</b><div class="sub">ทัพบุกพลัง ~${kf(kRaidFoe().P)} · กำแพงช่วยเพิ่มพลังทหาร +${25*K.lv.wall}% · บุกวันละครั้ง</div><button class="btn gold sm" data-kact="raid">ป้องกันเมือง</button></div></div>`:'')+
    `<div class="kgrid">${KB.map(B=>{const l=K.lv[B.k],why=kLevelUp(B.k),c=kCostOf(B.k),lockU=K.lv.hall<KUNL[B.k];
      return `<div class="card kb ${lockU?'lock':''}"><div class="kbh"><span class="kic">${B.ic}</span><div><b>${B.n}</b><span class="sub">Lv.${l}/${KMAX}</span></div></div>
      <div class="sub">${B.d}</div><div class="keff">${kEffect(B.k,l)}${l<KMAX?` <span>→ ${kEffect(B.k,l+1)}</span>`:''}</div>
      ${l<KMAX?`<div class="kcost">${resTxt({wood:c.w,stone:c.s})}${c.g?' · 🪙 '+kf(c.g):''}${c.bp?' · 📜 '+c.bp:''}</div><button class="btn sm ${why?'':'gold'}" data-kact="build" data-v="${B.k}" ${why?'disabled':''}>${why||(l?'อัปเกรด':'ก่อสร้าง')}</button>`:'<div class="kcost">✓ ระดับสูงสุด</div>'}</div>`;}).join('')}</div>
    <div class="sub" style="text-align:center">เมืองผลิตทรัพยากรต่อแม้ปิดเกม สะสมสูงสุด ${8+pv('off')} ชม. · ยึดแหล่งทรัพยากรที่ชายแดนเพื่อผลิตเพิ่ม</div>`;}
  else if(tab==='army'){const g=kGenFx(),cap=kCap(),wd=kWounded();
    body=`<div class="card"><b>แม่ทัพ</b> <span class="sub">แตะเพื่อแต่งตั้ง · บทบาทตรงหน่วยได้ผลเต็ม ไม่ตรงได้ครึ่งเดียว</span>
      <div class="kgens">${KU.map(u=>{const k=K.gen[u.k],c=k&&cmdOf(k);return `<button class="kgen ${k?'':'empty'}" data-kact="gen" data-v="${u.k}">
        <span class="kface" style="${k?faceStyle(k):''}">${k?'':'+'}</span><b>${u.ic} ${u.n}</b><small>${k?`${HEROES[k].n} · ${c.n}<br>${c.u===u.k?c.txt:c.txt.replace(/\+(\d+)/,(m,v)=>'+'+Math.floor(v/2))+' (ครึ่ง)'}${c.x?'<br>✦ '+c.x.t:''}`:'ยังไม่มีแม่ทัพ'}</small></button>`;}).join('')}</div></div>
    ${KU.map(u=>{const a=army.find(x=>x.k===u.k),n=K.tr[u.k],room=Math.max(0,cap-n-K.wd[u.k]),can=Math.min(room,Math.floor(K.res.food/u.f),Math.floor(K.res.stone/u.s));
      return `<div class="card ku"><span class="kic">${u.ic}</span><div style="flex:1;min-width:0"><b>${u.n}</b> <span class="sub">${n}/${cap}${K.wd[u.k]?` · บาดเจ็บ ${K.wd[u.k]}`:''}</span>
        <div class="sub">${u.d}</div><div class="sub">HP ${Math.round(a.hp)} · ATK ${Math.round(a.atk)}${a.heal?` · ฟื้นฟู ${Math.round(a.heal)}`:''} · ต่อนาย 🌾${u.f} 🪨${u.s}</div></div>
        <div class="kbtns"><button class="btn sm" data-kact="train" data-v="${u.k}" data-n="5" ${can<1?'disabled':''}>+5</button><button class="btn sm gold" data-kact="train" data-v="${u.k}" data-n="999" ${can<1?'disabled':''}>+${can}</button></div></div>`;}).join('')}
    <div class="card"><b>🏥 โรงพยาบาล</b> <span class="sub">${K.lv.hosp?`Lv.${K.lv.hosp} · รักษา ${Math.round(kHospRate())} นาย/ชม.`:'ยังไม่ได้สร้าง (ปลดล็อกที่ศาลากลาง Lv.2)'}</span>
      <div class="sub">ทหารที่แพ้จะบาดเจ็บ ไม่ตาย รักษาแล้วกลับมาประจำการ · บาดเจ็บตอนนี้ ${wd} นาย</div>
      ${wd?`<button class="btn sm" data-kact="heal" ${K.res.food<wd*3?'disabled':''} style="margin-top:6px">รักษาทันที · 🌾 ${kf(wd*3)}</button>`:''}</div>`;}
  else{const army=kArmy(),pw=kPow(army);
    body=`<div class="sub" style="text-align:center;margin-bottom:6px">ชายแดนอาณาจักร · ส่งทัพได้ครั้งละ 1 ทัพ · พลังทัพคุณ <b class="num">${kf(pw)}</b></div>
    <div class="kfront">${KF.map((F,i)=>{const T=KTRAIT[F.t],req=kFortReq(i),lock=S.best<req||i>K.fort,done=i<K.fort,r=pw/F.p,col=r>=1.15?'ok':r>=.85?'mid':'bad';
      return `<div class="card kf ${lock?'lock':''} ${done?'done':''}"><div class="kfn"><span class="kfi">${done?'✓':i+1}</span><div style="flex:1;min-width:0"><b>${F.n}</b>
        <div class="sub">${T.ic} ${T.n}: ${T.d}</div>
        <div class="sub">พลังศัตรู <b class="num kp ${col}">${kf(F.p)}</b>${F.site?` · ยึดแล้วได้ <b>${F.sn}</b> (${({food:'อาหาร',wood:'ไม้',stone:'หิน'})[F.site]} +25%)`:''}</div>
        <div class="sub">รางวัล: ${resTxt(done?kRepeat(F.rw):F.rw)}${done?' (ตีซ้ำ)':''}</div>
        ${!lock&&!done?`<div class="hint" style="margin-top:4px">${T.tip}</div>`:''}</div></div>
        ${lock?`<div class="sub" style="text-align:right">🔒 ${S.best<req?`ผ่านด่าน ${sname(req)} ก่อน`:'ชนะป้อมก่อนหน้าก่อน'}</div>`:`<button class="btn sm ${done?'':'gold'}" data-kact="attack" data-v="${i}" ${kBusy?'disabled':''}>${done?'ตีซ้ำ':'ส่งทัพ'}</button>`}</div>`;}).join('')}</div>`;}
  $('kgPad').innerHTML=top+body;
}
const kRepeat=rw=>({food:Math.round((rw.food||0)*.3),wood:Math.round((rw.wood||0)*.3),stone:Math.round((rw.stone||0)*.3)});
function kGive(rw,mul){const K=kState();mul=mul||1;for(const r of ['food','wood','stone'])if(rw[r])K.res[r]+=Math.round(rw[r]*mul);if(rw.bp)K.bp+=rw.bp;if(rw.gems)S.gems+=rw.gems;if(rw.tickets)S.tickets+=rw.tickets;}
function kFight(title,P,trait,defend,onEnd){const K=kState(),my=kArmy(defend),foe=kFoe(P,trait);
  if(!my.some(x=>x.n>0)){toast('ยังไม่มีทหาร ไปฝึกที่แท็บกองทัพ');return;}
  const R=kSim(my,foe,trait,defend);kBusy=true;
  for(const u of KU){const l=Math.min(K.tr[u.k],R.loss[u.k]||0);K.tr[u.k]-=l;K.wd[u.k]+=l;}
  const res=onEnd(R);save();
  modal(`<div class="mbox"><div class="mtitle">${title}</div><div class="mbody">
    <img class="kfimg" id="kfImg" src="${IMG.k_fight}" alt="">
    <div class="kbar"><span>ทัพคุณ ${kf(kPow(my))}</span><i><b id="kbA" style="width:100%"></b></i></div>
    <div class="kbar foe"><span>${defend?'ทัพบุก':'ศัตรู'} ${kf(P)}</span><i><b id="kbF" style="width:100%"></b></i></div>
    <div class="sub" id="kRound" style="text-align:center">ยกที่ 1</div>
    <div id="kRes" hidden>${R.win?'<div class="kwin">🏆 ชนะ!</div>':'<div class="klose">พ่ายแพ้</div>'}
      <div class="sub" style="text-align:center">ทหารบาดเจ็บ: ${KU.filter(u=>R.loss[u.k]).map(u=>u.ic+' '+R.loss[u.k]).join(' · ')||'ไม่มี'} (รักษาได้ที่โรงพยาบาล)</div>
      ${res?`<div class="hint">${res}</div>`:''}
      <button class="btn gold" data-kact="fclose">ตกลง</button></div></div></div>`);
  let i=0;const step=()=>{if(!$('kbA')){kBusy=false;return;}if(i<R.rounds.length){const [a,f]=R.rounds[i];$('kbA').style.width=(a*100)+'%';$('kbF').style.width=(f*100)+'%';$('kRound').textContent='ยกที่ '+(i+1);i++;setTimeout(step,420);}
    else{kBusy=false;if(R.win)$('kfImg').src=IMG.k_win;$('kRes').hidden=false;}};setTimeout(step,300);}
document.addEventListener('click',e=>{const b=e.target.closest('[data-kact]');if(!b)return;const a=b.dataset.kact,v=b.dataset.v,K=kState();
  if(a==='tab'){K.tab=v;renderKingdom();}
  else if(a==='build'){if(kLevelUp(v))return;const c=kCostOf(v);K.res.wood-=c.w;K.res.stone-=c.s;S.gold-=c.g;K.bp-=c.bp;K.lv[v]++;save();toast(`${KB.find(x=>x.k===v).n} Lv.${K.lv[v]}`);renderKingdom();}
  else if(a==='train'){const u=KUM[v],room=Math.max(0,kCap()-K.tr[v]-K.wd[v]),n=Math.min(+b.dataset.n,room,Math.floor(K.res.food/u.f),Math.floor(K.res.stone/u.s));if(n<1)return;K.res.food-=n*u.f;K.res.stone-=n*u.s;K.tr[v]+=n;save();toast(`ฝึก${u.n} +${n}`);renderKingdom();}
  else if(a==='heal'){const w=kWounded();if(!w||K.res.food<w*3)return;K.res.food-=w*3;KU.forEach(u=>{K.tr[u.k]+=K.wd[u.k];K.wd[u.k]=0;});save();toast(`รักษาทหาร ${w} นาย`);renderKingdom();}
  else if(a==='gen'){kPick=v;const u=KUM[v],used=Object.entries(K.gen).filter(([s,k])=>k&&s!==v).map(([s,k])=>k);
    const list=OWNED().filter(k=>!used.includes(k)).sort((x,y)=>(HEROES[y].rl===u.rl)-(HEROES[x].rl===u.rl)||cmdOf(y).v-cmdOf(x).v);
    modal(`<div class="mbox"><div class="mtitle">แม่ทัพ${u.n}</div><div class="mbody"><div class="sub">แม่ทัพที่เหมาะ: ${ROLE[u.rl].cls} · บทบาทไม่ตรงได้ผลครึ่งเดียว</div><div class="kpick">
      ${K.gen[v]?`<button class="kpi" data-kact="setgen" data-v=""><span class="kface">✕</span><div><b>ถอดแม่ทัพ</b></div></button>`:''}
      ${list.map(k=>{const c=cmdOf(k),m=HEROES[k].rl===u.rl;return `<button class="kpi ${K.gen[v]===k?'on':''}" data-kact="setgen" data-v="${k}"><span class="kface" style="${faceStyle(k)}"></span><div><b>${HEROES[k].n} <span class="badge ${m?'on':''}">${m?'เหมาะ':'ครึ่งผล'}</span></b><small>${c.n}: ${c.txt}${c.x?'<br>✦ '+c.x.t:''}</small></div></button>`;}).join('')}
      </div><button class="btn sm" data-act="close">ปิด</button></div></div>`);}
  else if(a==='setgen'){K.gen[kPick]=v||null;save();closeModal(false);renderKingdom();}
  else if(a==='attack'){if(kBusy)return;const i=+v,F=KF[i];if(i>K.fort||S.best<kFortReq(i))return;const first=i===K.fort,lm=1+kGenFx().loot/100;
    kFight(F.n,F.p,F.t,false,R=>{if(!R.win)return 'ลองดูคำแนะนำของป้อม แล้วปรับแม่ทัพหรือฝึกหน่วยที่ได้เปรียบ';
      if(first){K.fort=i+1;kGive(F.rw,lm);if(F.site)K.sites.push(F.site);return `ได้รับ ${resTxt(F.rw)}${F.site?` · ยึด${F.sn}แล้ว!`:''}${i+1<KF.length?` · ปลดล็อก ${KF[i+1].n}`:' · พิชิตชายแดนครบแล้ว!'}`;}
      const rr=kRepeat(F.rw);kGive(rr,lm);return 'ได้รับ '+resTxt(rr);});}
  else if(a==='raid'){if(!kRaidReady()||kBusy)return;const f=kRaidFoe();K.raidDay=dayNo();
    kFight('ป้องกันเมือง',f.P,f.t,true,R=>{if(R.win){const rw={food:500*K.lv.hall,wood:400*K.lv.hall,stone:300*K.lv.hall,gems:50};kGive(rw);return 'เมืองปลอดภัย! ได้รับ '+resTxt(rw);}
      const lost={};for(const r of ['food','wood','stone']){lost[r]=Math.floor(K.res[r]*.1);K.res[r]-=lost[r];}return 'ศัตรูปล้นไป '+resTxt(lost)+' · อัปกำแพงและเพิ่มทหารโล่';});}
  else if(a==='fclose'){if(kBusy)return;closeModal(false);renderKingdom();}
});
setInterval(()=>{if(!S.k)return;kTick();if(screen==='kingdom'&&!$('modalRoot').innerHTML){const t=document.querySelectorAll('.kres b');const K=S.k;KRES.forEach(([r],i)=>{if(t[i])t[i].textContent=kf(K.res[r]);});}},2000);
