// ===================== GENERALS' BATTLE =====================
const GB_N=100,GB_TRIES=5;
const GBM={sh:{sh:1,ar:1.2,mg:1.2,sp:1},ar:{sh:.5,ar:1,mg:1.6,sp:1.3},mg:{sh:1.6,ar:1,mg:1,sp:1},sp:{sh:1,ar:1,mg:1,sp:1}};
const GBO=[
 {n:'ร้อยเอกบรูโน',st:'ทัพผสมมือใหม่',c:{sh:30,ar:30,mg:20,sp:20},m:.9},
 {n:'เดม่อน กำแพงเหล็ก',st:'ทหารโล่หนาแน่น',c:{sh:70,ar:10,mg:0,sp:20},m:1},
 {n:'ลิเซีย ราชินีธนู',st:'ห่าธนู',c:{sh:10,ar:70,mg:10,sp:10},m:1.1},
 {n:'มอร์แกน จอมเวทสงคราม',st:'นักเวทล้วน',c:{sh:10,ar:10,mg:70,sp:10},m:1.2},
 {n:'บาทหลวงเอลรอน',st:'โล่และการฟื้นฟู',c:{sh:40,ar:10,mg:10,sp:40},m:1.3},
 {n:'แฝดสายฟ้า',st:'ธนูและเวท',c:{sh:10,ar:45,mg:45,sp:0},m:1.4},
 {n:'บารอนหินผา',st:'กำแพงมนุษย์',c:{sh:60,ar:0,mg:20,sp:20},m:1.55},
 {n:'เงาไร้นาม',st:'ธนูซุ่มยิง',c:{sh:20,ar:60,mg:0,sp:20},m:1.7},
 {n:'อาร์คเมจซาฟีรา',st:'เวทผนึกกำลัง',c:{sh:20,ar:10,mg:55,sp:15},m:1.85},
 {n:'จักรพรรดิแดง',st:'ทัพหลวงสมบูรณ์แบบ',c:{sh:30,ar:25,mg:25,sp:20},m:2.05}];
const GBSHOP=[
 {k:'f_lion',t:'flag',ic:'🦁',n:'ธงราชสีห์',d:'ทั้งทัพ ATK +6%',c:30,fx:{allatk:6}},
 {k:'f_wall',t:'flag',ic:'🏰',n:'ธงปราการ',d:'ทหารโล่ HP +12%',c:30,fx:{hp:{sh:12}}},
 {k:'f_star',t:'flag',ic:'⭐',n:'ธงดารา',d:'พลธนูและนักเวท ATK +8%',c:60,fx:{atk:{ar:8,mg:8}}},
 {k:'s_royal',t:'suit',ic:'🎽',n:'ชุดทหารหลวง',d:'ทั้งทัพ HP +6%',c:40,fx:{allhp:6}},
 {k:'s_medic',t:'suit',ic:'🩺',n:'ชุดหน่วยแพทย์',d:'ฟื้นฟู +20% · รักษาทหารเร็วขึ้น 20%',c:40,fx:{heal:20,hosp:20}},
 {k:'s_gold',t:'suit',ic:'👑',n:'ชุดทองคำพิธี',d:'ทั้งทัพ ATK +5% และ HP +5%',c:100,fx:{allatk:5,allhp:5}},
 {k:'bp',t:'item',ic:'📜',n:'แบบแปลน',d:'ใช้อัปอาคาร Lv4-5',c:15},
 {k:'egg',t:'item',ic:'🥚',n:'ไข่มังกร',d:'ซื้อได้วันละ 1 ฟอง',c:40}];
function gbState(){if(!S.gb)S.gb={med:0,beat:0,day:-1,n:0,own:[],flag:null,suit:null,egg:-1,sel:0,mix:{sh:30,ar:30,mg:20,sp:20}};const G=S.gb;if(G.day!==dayNo()){G.day=dayNo();G.n=0;}return G;}
function gbFx(o){const G=S.gb;if(!G)return;for(const k of [G.flag,G.suit]){const it=GBSHOP.find(x=>x.k===k);if(!it)continue;const f=it.fx;
  o.allatk+=f.allatk||0;o.allhp=(o.allhp||0)+(f.allhp||0);o.heal+=f.heal||0;o.hosp+=f.hosp||0;for(const t of ['atk','hp'])if(f[t])for(const u in f[t])o[t][u]=(o[t][u]||0)+f[t][u];}}
function gbArmy(mix){return kArmy(false).map(x=>({...x,n:mix[x.k]||0}));}
function gbFoe(i){const O=GBO[i],m=O.m*(1+.04*Math.floor(gbState().beat>i?0:0));return KU.map(u=>({k:u.k,n:O.c[u.k],hp:u.hp*m,atk:u.atk*m,heal:(u.heal||0)*m}));}
function gbSim(my,foe){
  const mk=a=>a.map(x=>({...x,max:x.n*x.hp,pool:x.n*x.hp,n0:x.n}));const A=mk(my),F=mk(foe),rounds=[];
  const alive=x=>x.pool>0?Math.ceil(x.pool/x.hp-1e-9):0,tot=s=>s.reduce((a,x)=>a+x.pool,0);
  const attack=(side,other)=>{const dmg=other.map(()=>0),types=other.filter(x=>x.pool>0).length;const sh=other.find(x=>x.k==='sh'),back=other.filter(x=>x.k!=='sh'&&x.pool>0),bt=back.reduce((s,x)=>s+x.pool,0);
    for(const x of side){const n=alive(x);if(!n)continue;let a=n*x.atk;if(x.k==='mg')a*=1+.1*types;
      const shs=sh.pool>0?(back.length?.6:1):0;
      if(shs)dmg[other.indexOf(sh)]+=a*shs*GBM[x.k].sh;
      back.forEach(t=>{dmg[other.indexOf(t)]+=a*(1-shs)*t.pool/bt*GBM[x.k][t.k];});}
    return dmg;};
  const heal=side=>{const sp=side.find(x=>x.k==='sp');const h=alive(sp)*sp.heal;if(!h)return;const hurt=side.filter(x=>x.pool>0&&x.pool<x.max),lost=hurt.reduce((s,x)=>s+x.max-x.pool,0);if(!lost)return;hurt.forEach(x=>{x.pool=Math.min(x.max,x.pool+h*(x.max-x.pool)/lost);});};
  const mA=tot(A)||1,mF=tot(F)||1;let win=false;
  for(let r=1;r<=12;r++){const dA=attack(A,F),dF=attack(F,A);F.forEach((x,i)=>x.pool=Math.max(0,x.pool-dA[i]));A.forEach((x,i)=>x.pool=Math.max(0,x.pool-dF[i]));heal(A);heal(F);
    rounds.push([tot(A)/mA,tot(F)/mF]);if(tot(F)<=0){win=true;break;}if(tot(A)<=0)break;}
  if(!win&&tot(A)>0&&tot(A)/mA>tot(F)/mF)win=true;
  const loss={};A.forEach(x=>{loss[x.k]=x.n0-alive(x);});return {win,rounds,loss};}
function gbCounter(i){const c=GBO[i].c,o={sh:10,ar:10,mg:10,sp:10};let left=GB_N-40;
  const want={sh:c.ar*1.2+c.sh*.3,ar:c.mg*1.5+c.sp*.6,mg:c.sh*1.5+c.mg*.3,sp:15};const tw=Object.values(want).reduce((a,b)=>a+b,0);
  for(const k in want)o[k]+=Math.floor(want[k]/tw*left/10)*10;let s=Object.values(o).reduce((a,b)=>a+b,0);const top=Object.keys(want).sort((a,b)=>want[b]-want[a])[0];o[top]+=GB_N-s;return o;}
const gbTip=i=>{const c=GBO[i].c,top=Object.keys(c).sort((a,b)=>c[b]-c[a])[0];return {sh:'ศัตรูเน้นทหารโล่ → ใช้นักเวท (เวททะลุเกราะ แรงขึ้น 60%)',ar:'ศัตรูเน้นพลธนู → ใช้ทหารโล่รับ (ลูกธนูทำดาเมจโล่แค่ครึ่งเดียว)',mg:'ศัตรูเน้นนักเวท → ใช้พลธนู (ยิงนักเวทแรงขึ้น 60%)',sp:'ศัตรูเน้นฟื้นฟู → ใช้พลธนูเจาะแนวหลัง จบให้เร็ว'}[top];};
let gbConf=null;
function renderGen(){const G=gbState(),i=Math.min(G.sel,9),O=GBO[i],mix=G.mix,sum=KU.reduce((a,u)=>a+mix[u.k],0),my=gbArmy(mix),foe=gbFoe(i),pa=kPow(my),pf=kPow(foe),lock=i>G.beat;
  const pv2=gbSim(my,foe);
  let h=`<div class="khero" style="background-image:url(${IMG.gen1})"><div class="kname"><b>ศึกแม่ทัพ</b><span>🎖️ ${G.med} เหรียญ · ชนะแล้ว ${G.beat}/10 · เหลือ ${GB_TRIES-G.n}/${GB_TRIES} ครั้งวันนี้</span></div></div>
  <div class="card cvnpc"><img src="${IMG.n_gen}" alt=""><div><b>เซอร์อัลดริก · แม่ทัพหลวง</b><div class="sub">"ในสนามนี้ทั้งสองฝ่ายมีทหาร ${GB_N} นายเท่ากัน ใครอ่านทางศัตรูออกก่อน คนนั้นชนะ"</div>
    <div class="gbrps">🏹 ชนะ 🔮 · 🔮 ชนะ 🛡️ · 🛡️ ชนะ 🏹 · 💚 ฟื้นฟูทัพ</div></div></div>
  <div class="card"><div class="kban" style="background-image:url(${IMG.gen2})"></div><b>เลือกคู่ต่อสู้</b><div class="gbl">${GBO.map((X,j)=>`<button class="gbo ${j===i?'on':''} ${j<G.beat?'done':''} ${j>G.beat?'lock':''}" data-gact="sel" data-v="${j}" ${j>G.beat?'disabled':''}><span>${j<G.beat?'✓':j>G.beat?'🔒':j+1}</span><small>${X.n}</small></button>`).join('')}</div>
    <div class="gbfoe"><div><b>${O.n}</b> <span class="sub">· ${O.st}</span><div class="sub">พลังทัพศัตรู ${kf(pf)}</div></div>
      <div class="gbmix">${KU.map(u=>`<span><img src="${IMG['u_'+u.k]}" alt="" style="filter:hue-rotate(150deg) saturate(1.4)"><b>${O.c[u.k]}</b></span>`).join('')}</div></div>
    <div class="hint">${gbTip(i)}</div></div>
  <div class="card"><div class="kban" style="background-image:url(${IMG.gen3})"></div><b>จัดทัพของคุณ</b> <span class="sub">${sum}/${GB_N} นาย ${sum!==GB_N?'· ต้องครบพอดี':''}</span>
    ${KU.map(u=>`<div class="cve"><img src="${IMG['u_'+u.k]}" alt=""><b>${u.n}</b><span class="num gbn">${mix[u.k]}</span><button class="btn sm" data-gact="mix" data-v="${u.k}" data-n="-10" ${mix[u.k]<=0?'disabled':''}>-10</button><button class="btn sm" data-gact="mix" data-v="${u.k}" data-n="10" ${sum>=GB_N?'disabled':''}>+10</button></div>`).join('')}
    <div class="cvp"><button class="btn sm gold" data-gact="counter">แก้ทางอัตโนมัติ</button><button class="btn sm" data-gact="even">สมดุล 25 ทุกหน่วย</button></div>
    <div class="sub">พลังทัพคุณ <b class="num kp ${pa>=pf*1.1?'ok':pa>=pf*.9?'mid':'bad'}">${kf(pa)}</b> (รวมโบนัสค่ายทหาร แม่ทัพ ธง และชุด) · คาดการณ์: <b>${pv2.win?'มีโอกาสชนะ':'ยังเสียเปรียบ'}</b></div></div>
  <div class="card cvsum"><div><b>${lock?'🔒':''} ท้า ${O.n}</b><div class="sub">${i===G.beat?'ชนะครั้งแรก: 🎖️ '+(10+i*4)+' · 💎 '+(30+i*15):'ชนะซ้ำ: 🎖️ '+(3+Math.floor(i/2))}</div></div>
    <button class="btn gold" data-gact="fight" ${sum!==GB_N||G.n>=GB_TRIES||lock?'disabled':''}>${G.n>=GB_TRIES?'ครบแล้ววันนี้':'เข้าสู่สนามรบ'}</button></div>
  <div class="card"><div class="kban" style="background-image:url(${IMG.gen6})"></div><b>ร้านเหรียญแม่ทัพ</b> <span class="sub">ธงและชุดมีผลกับทุกกองทัพ ทั้งป้อม คาราวาน และศึกแม่ทัพ · ใส่ได้อย่างละ 1</span>
    <div class="gbshop">${GBSHOP.map(it=>{const own=G.own.includes(it.k),eq=G.flag===it.k||G.suit===it.k,eggDone=it.k==='egg'&&G.egg===dayNo();
      return `<div class="gbi ${eq?'on':''}"><span>${it.ic}</span><b>${it.n}</b><small>${it.d}</small>${it.t==='item'?`<button class="btn sm" data-gact="buy" data-v="${it.k}" ${G.med<it.c||eggDone?'disabled':''}>${eggDone?'ซื้อแล้ววันนี้':'🎖️ '+it.c}</button>`:own?`<button class="btn sm ${eq?'':'gold'}" data-gact="equip" data-v="${it.k}">${eq?'ถอด':'ใส่'}</button>`:`<button class="btn sm" data-gact="buy" data-v="${it.k}" ${G.med<it.c?'disabled':''}>🎖️ ${it.c}</button>`}</div>`;}).join('')}</div></div>`;
  $('genPad').innerHTML=h;}
document.addEventListener('click',e=>{const b=e.target.closest('[data-gact]');if(!b)return;const a=b.dataset.gact,v=b.dataset.v,G=gbState();
  if(a==='sel'){G.sel=+v;}
  else if(a==='mix'){const sum=KU.reduce((s,u)=>s+G.mix[u.k],0),d=+b.dataset.n;if(d>0&&sum+d>GB_N)return;G.mix[v]=Math.max(0,G.mix[v]+d);}
  else if(a==='counter'){G.mix=gbCounter(Math.min(G.sel,9));}
  else if(a==='even'){G.mix={sh:25,ar:25,mg:25,sp:25};}
  else if(a==='buy'){const it=GBSHOP.find(x=>x.k===v);if(!it||G.med<it.c)return;
    if(it.k==='bp'){if(!S.k){toast('ปลดล็อกอาณาจักรก่อน');return;}G.med-=it.c;S.k.bp++;toast('ได้แบบแปลน 1 ใบ');}
    else if(it.k==='egg'){if(G.egg===dayNo())return;G.med-=it.c;G.egg=dayNo();petState().eggs++;toast('ได้ไข่มังกร 1 ฟอง');}
    else{if(G.own.includes(v))return;G.med-=it.c;G.own.push(v);G[it.t]=v;toast('ได้รับ '+it.n);}}
  else if(a==='equip'){const it=GBSHOP.find(x=>x.k===v);G[it.t]=G[it.t]===v?null:v;}
  else if(a==='fight'){const i=Math.min(G.sel,9),sum=KU.reduce((s,u)=>s+G.mix[u.k],0);if(sum!==GB_N||G.n>=GB_TRIES||i>G.beat||kBusy)return;G.n++;
    const my=gbArmy(G.mix),O=GBO[i],R=gbSim(my,gbFoe(i)),first=i===G.beat;
    kFight('ศึกแม่ทัพ · '+O.n,kPow(gbFoe(i)),'none',false,Rr=>{if(!Rr.win)return 'ลองดูทัพศัตรูอีกครั้ง แล้วกด "แก้ทางอัตโนมัติ" หรือจัดเอง';
      if(first){const md=10+i*4,gm=30+i*15;G.beat=i+1;G.med+=md;S.gems+=gm;if(G.beat<10)G.sel=G.beat;return `ได้รับ 🎖️ ${md} เหรียญ · 💎 ${gm}${i===9?' · พิชิตแม่ทัพครบทั้ง 10 คน!':' · ปลดล็อก '+GBO[i+1].n}`;}
      const md=3+Math.floor(i/2);G.med+=md;return `ได้รับ 🎖️ ${md} เหรียญ`;},{army:my,R,imgs:[IMG.gen4,IMG.gen4,IMG.gen6],noLoss:1,after:renderGen});
    save();return;}
  save();renderGen();});

// ===================== CRAFTING GUILD =====================
const CRQ=[{n:'ธรรมดา',c:'#7f8a96'},{n:'ดี',c:'#2f7d32'},{n:'ยอดเยี่ยม',c:'#2f63d8'},{n:'ตำนาน',c:'#c07a00'}];
const CRR=[
 {k:'sword',ic:'🗡️',n:'ดาบเหล็กกล้า',slot:'w',t:1,cost:{stone:300,mats:5},lv:0},
 {k:'potion',ic:'🧪',n:'ยาฟื้นฟูทหาร',use:'heal',cost:{food:300,mats:3},lv:0,d:'รักษาทหารบาดเจ็บทั้งหมดทันที'},
 {k:'armor',ic:'🛡️',n:'เกราะเหล็ก',slot:'a',t:1,cost:{stone:400,wood:150,mats:6},lv:1},
 {k:'ring',ic:'💍',n:'แหวนอำพัน',slot:'c',t:1,cost:{stone:200,mats:10},lv:1},
 {k:'boots',ic:'👢',n:'รองเท้าเดินทาง',slot:'b',t:1,cost:{wood:300,food:100,mats:6},lv:2},
 {k:'elixir',ic:'⚗️',n:'ยาบำรุงมังกร',use:'pet',cost:{food:500,mats:8},lv:2,d:'มังกรที่ติดตามทีมได้ EXP ตามคุณภาพ'},
 {k:'esword',ic:'⚔️',n:'ดาบอีเธอร์',slot:'w',t:2,cost:{stone:900,mats:25},lv:3},
 {k:'warm',ic:'🔥',n:'ยาอุ่นไข่',use:'hatch',cost:{wood:600,mats:10},lv:3,d:'ไข่ในตู้ฟักแตกทันที'},
 {k:'crown',ic:'👑',n:'มงกุฎดารา',slot:'c',t:2,cost:{stone:1200,mats:30},lv:4}];
const CRT=[{n:'วัตถุดิบธรรมดา',x:1,b:0},{n:'วัตถุดิบดี',x:2,b:15},{n:'วัตถุดิบชั้นเลิศ',x:4,b:30}];
const SLOTN={w:'อาวุธ',a:'เกราะ',b:'รองเท้า',c:'เครื่องประดับ'};
function crState(){if(!S.cr)S.cr={rep:0,inv:[],ord:{day:-1,list:[]},tier:0,made:0};const C=S.cr;if(C.ord.day!==dayNo()){C.ord={day:dayNo(),list:crOrders()};}return C;}
const crLv=()=>Math.floor((S.cr?S.cr.rep:0)/20);
const crOpen=()=>kOpen();
const crBonus=it=>{const R=CRR.find(x=>x.k===it.r);return [1,2,3,5][it.q]+((R.t||1)-1)*2;};
function crOrders(){let sd=dayNo()*7919;const rnd2=()=>{sd=(sd*16807)%2147483647;return sd/2147483647;};const av=CRR.filter(r=>r.lv<=crLv());
  const who=['กัปตันยามเมือง','แม่ทัพหลวง','พ่อค้ามาร์โค','หมอประจำค่าย','นักผจญภัยหนุ่ม','ท่านเจ้าเมือง'];
  return [0,1,2].map(j=>{const r=av[Math.floor(rnd2()*av.length)],q=Math.min(3,Math.floor(rnd2()*(2+Math.min(2,crLv()))));return {r:r.k,q,who:who[Math.floor(rnd2()*who.length)],done:false,g:Math.round(800*(1+q)*(1+S.best/8)),gm:20+20*q,rep:4+3*q};});}
function crCost(R,tier){const o={};for(const k in R.cost)o[k]=Math.round(R.cost[k]*CRT[tier].x);return o;}
function crHas(c){for(const k in c){const have=k==='mats'?S.mats:(S.k?S.k.res[k]:0);if(have<c[k])return false;}return true;}
function crPay(c){for(const k in c){if(k==='mats')S.mats-=c[k];else S.k.res[k]-=c[k];}}
const crCostTxt=c=>Object.entries(c).map(([k,v])=>({stone:'🪨',wood:'🪵',food:'🌾',mats:'💠'}[k]+' '+kf(v))).join(' · ');
let crPick='sword',crGive=null;
function renderCraft(){const C=crState(),lv=crLv(),R=CRR.find(x=>x.k===crPick)||CRR[0],tier=C.tier,cost=crCost(R,tier);
  let h=`<div class="khero" style="background-image:url(${IMG.craft4})"><div class="kname"><b>สมาคมช่างฝีมือ</b><span>ชื่อเสียงช่าง Lv.${lv} (${C.rep} แต้ม) · ผลิตแล้ว ${C.made} ชิ้น</span></div></div>
  <div class="card cvnpc"><img src="${IMG.n_craft}" alt=""><div><b>รูบี้ · ช่างตีเหล็ก</b><div class="sub">"ส่งวัตถุดิบมา แล้วตีให้ตรงจังหวะนะ ยิ่งตีแม่นของยิ่งดี ของระดับตำนานไม่ได้มาง่าย ๆ หรอก!"</div>
    <div class="sub">วัตถุดิบ: 🪨 ${kf(S.k?S.k.res.stone:0)} · 🪵 ${kf(S.k?S.k.res.wood:0)} · 🌾 ${kf(S.k?S.k.res.food:0)} · 💠 หินอีเธอร์ ${kf(S.mats)}</div></div></div>
  <div class="card"><div class="kban" style="background-image:url(${IMG.craft1})"></div><b>คำสั่งผลิตวันนี้</b> <span class="sub">เปลี่ยนทุกวัน</span>
    ${C.ord.list.map((o,j)=>{const RR=CRR.find(x=>x.k===o.r),has=C.inv.findIndex(it=>it.r===o.r&&it.q>=o.q);return `<div class="crord ${o.done?'done':''}"><span class="kic">${RR.ic}</span><div style="flex:1;min-width:0"><b>${RR.n}</b> <span class="sub">คุณภาพ ≥ <b style="color:${CRQ[o.q].c}">${CRQ[o.q].n}</b></span><div class="sub">${o.who} · 🪙 ${kf(o.g)} · 💎 ${o.gm} · ชื่อเสียง +${o.rep}</div></div>
      ${o.done?'<span class="sub">✓ ส่งแล้ว</span>':`<button class="btn sm ${has>=0?'gold':''}" data-cact="deliver" data-v="${j}" ${has<0?'disabled':''}>${has>=0?'ส่งงาน':'ยังไม่มีของ'}</button>`}</div>`;}).join('')}</div>
  <div class="card"><div class="kban" style="background-image:url(${IMG.craft2})"></div><b>สูตรผลิต</b> <span class="sub">ปลดสูตรใหม่ทุก 20 ชื่อเสียง</span>
    <div class="crr">${CRR.map(X=>`<button class="crri ${X.k===R.k?'on':''} ${X.lv>lv?'lock':''}" data-cact="pick" data-v="${X.k}" ${X.lv>lv?'disabled':''}><span>${X.lv>lv?'🔒':X.ic}</span><small>${X.n}${X.lv>lv?'<br>ชื่อเสียง Lv.'+X.lv:''}</small></button>`).join('')}</div>
    <div class="crdet"><b>${R.ic} ${R.n}</b><div class="sub">${R.slot?`ใส่ให้ฮีโร่: ${SLOTN[R.slot]} +${[1,2,3,5].map(x=>x+((R.t||1)-1)*2).join('/')} ขั้น ตามคุณภาพ`:R.d}</div>
      <div class="cvp">${CRT.map((T,j)=>`<button class="mtab ${tier===j?'on':''}" data-cact="tier" data-v="${j}">${T.n}${T.b?' +'+T.b:''}</button>`).join('')}</div>
      <div class="sub">ใช้ ${crCostTxt(cost)}</div>
      <button class="btn gold" data-cact="forge" ${crHas(cost)?'':'disabled'} style="margin-top:6px">${crHas(cost)?'⚒️ เริ่มตีเหล็ก':'วัตถุดิบไม่พอ'}</button></div></div>
  <div class="card"><b>คลังของ</b> <span class="sub">${C.inv.length} ชิ้น</span>${C.inv.length?`<div class="crinv">${C.inv.map((it,j)=>{const X=CRR.find(x=>x.k===it.r);return `<div class="crit" style="border-color:${CRQ[it.q].c}"><span>${X.ic}</span><b>${X.n}</b><small style="color:${CRQ[it.q].c}">${CRQ[it.q].n}${X.slot?' · +'+crBonus(it):''}</small>
      <button class="btn sm gold" data-cact="use" data-v="${j}">${X.slot?'มอบให้ฮีโร่':'ใช้'}</button><button class="btn sm" data-cact="sell" data-v="${j}">ขาย</button></div>`;}).join('')}</div>`:'<div class="sub">ยังไม่มีของ ลองตีเหล็กสักชิ้น</div>'}</div>`;
  $('craftPad').innerHTML=h;}
let fg=null;
function forgeStart(){const C=crState(),R=CRR.find(x=>x.k===crPick),cost=crCost(R,C.tier);if(!crHas(cost))return;crPay(cost);save();
  fg={hits:[],pos:0,dir:1,zone:.35+Math.random()*.3,raf:0,last:performance.now(),R,tier:C.tier};
  modal(`<div class="mbox"><div class="mtitle">ตีเหล็ก · ${R.n}</div><div class="mbody"><img class="kfimg" id="fgImg" src="${IMG.craft3}" alt="">
    <div class="sub" style="text-align:center">กด "ตี!" ตอนเข็มอยู่ในแถบทอง 3 ครั้ง</div>
    <div class="fgbar"><i id="fgZone" style="left:${fg.zone*100-9}%"></i><b id="fgNeedle"></b></div>
    <div class="fghits" id="fgHits">⚪ ⚪ ⚪</div>
    <button class="btn gold fgbtn" data-cact="hit">⚒️ ตี!</button><div id="fgRes"></div></div></div>`);
  const loop=t=>{if(!fg||!$('fgNeedle'))return;const dt=(t-fg.last)/1000;fg.last=t;const sp=.9+fg.hits.length*.35;fg.pos+=fg.dir*dt*sp;if(fg.pos>1){fg.pos=1;fg.dir=-1;}if(fg.pos<0){fg.pos=0;fg.dir=1;}$('fgNeedle').style.left=(fg.pos*100)+'%';fg.raf=requestAnimationFrame(loop);};fg.raf=requestAnimationFrame(loop);}
function forgeHit(){if(!fg||fg.hits.length>=3)return;const d=Math.abs(fg.pos-fg.zone),sc=d<.03?20:d<.09?14:d<.18?6:0;fg.hits.push(sc);
  $('fgHits').textContent=fg.hits.map(x=>x>=20?'🌟':x>=14?'🟡':x>0?'🟠':'❌').join(' ')+' ⚪'.repeat(3-fg.hits.length);
  toast(sc>=20?'เพอร์เฟกต์!':sc>=14?'ดีมาก':sc>0?'พอใช้':'พลาด!');
  if(fg.hits.length<3){fg.zone=.15+Math.random()*.7;$('fgZone').style.left=(fg.zone*100-9)+'%';return;}
  cancelAnimationFrame(fg.raf);const C=crState(),score=fg.hits.reduce((a,b)=>a+b,0)+CRT[fg.tier].b+crLv()*3,q=score>=80?3:score>=55?2:score>=30?1:0;
  const it={r:fg.R.k,q};C.inv.push(it);C.made++;C.rep+=2;save();
  $('fgImg').src=IMG.craft4;document.querySelector('.fgbtn').remove();
  $('fgRes').innerHTML=`<div class="crres" style="border-color:${CRQ[q].c}"><span>${fg.R.ic}</span><b>${fg.R.n}</b><b style="color:${CRQ[q].c}">คุณภาพ${CRQ[q].n}!</b><small>คะแนน ${score}${fg.R.slot?` · ${SLOTN[fg.R.slot]} +${crBonus(it)}`:''}</small></div><button class="btn gold" data-cact="fgdone">เก็บเข้าคลัง</button>`;fg=null;}
document.addEventListener('click',e=>{const b=e.target.closest('[data-cact]');if(!b)return;const a=b.dataset.cact,v=b.dataset.v,C=crState();
  if(a==='hit'){forgeHit();return;}
  if(a==='pick')crPick=v;else if(a==='tier')C.tier=+v;
  else if(a==='forge'){forgeStart();return;}
  else if(a==='fgdone'){closeModal(false);}
  else if(a==='sell'){const it=C.inv[+v];if(!it)return;const g=Math.round(400*(1+it.q*1.5)*(1+S.best/8));S.gold+=g;C.inv.splice(+v,1);toast('ขายได้ 🪙 '+kf(g));}
  else if(a==='deliver'){const o=C.ord.list[+v];if(!o||o.done)return;const j=C.inv.findIndex(it=>it.r===o.r&&it.q>=o.q);if(j<0)return;C.inv.splice(j,1);o.done=true;S.gold+=o.g;S.gems+=o.gm;C.rep+=o.rep;save();
    modal(`<div class="mbox"><div class="mtitle">ส่งงานสำเร็จ</div><div class="mbody"><img class="kfimg" src="${IMG.craft6}" alt=""><div class="hint">${o.who}พอใจมาก! ได้รับ 🪙 ${kf(o.g)} · 💎 ${o.gm} · ชื่อเสียงช่าง +${o.rep}</div><button class="btn gold" data-cact="fgdone">ตกลง</button></div></div>`);renderCraft();return;}
  else if(a==='use'){const it=C.inv[+v];if(!it)return;const X=CRR.find(x=>x.k===it.r);
    if(X.slot){crGive=+v;modal(`<div class="mbox"><div class="mtitle">มอบ${X.n}</div><div class="mbody"><div class="sub">${SLOTN[X.slot]} +${crBonus(it)} ขั้น ให้ฮีโร่ที่เลือก</div><div class="kpick">${OWNED().sort((p,q)=>S.form.includes(q)-S.form.includes(p)).map(k=>`<button class="kpi" data-cact="giveTo" data-v="${k}"><span class="kface" style="${faceStyle(k)}"></span><div><b>${HEROES[k].n}${S.form.includes(k)?' <span class="badge on">ในทีม</span>':''}</b><small>${SLOTN[X.slot]} ปัจจุบัน +${S.h[k].eq[X.slot]} → +${S.h[k].eq[X.slot]+crBonus(it)}</small></div></button>`).join('')}</div><button class="btn sm" data-act="close">ยกเลิก</button></div></div>`);return;}
    if(X.use==='heal'){if(!S.k||!kWounded()){toast('ไม่มีทหารบาดเจ็บ');return;}const w=kWounded();KU.forEach(u=>{S.k.tr[u.k]+=S.k.wd[u.k];S.k.wd[u.k]=0;});toast(`รักษาทหาร ${w} นาย`);}
    else if(X.use==='pet'){const p=petAct();if(!p){toast('ยังไม่มีมังกรติดตามทีม');return;}if(p.lv>=PMAX){toast('มังกรเลเวลสูงสุดแล้ว');return;}p.xp+=[80,150,250,400][it.q];while(p.lv<PMAX&&p.xp>=pXp(p.lv)){p.xp-=pXp(p.lv);p.lv++;}toast(`${petName(p)} Lv.${p.lv}`);}
    else if(X.use==='hatch'){const P=petState();if(!P.inc){toast('ไม่มีไข่ในตู้ฟัก');return;}P.inc.end=Date.now();toast('ไข่พร้อมฟักแล้ว!');}
    C.inv.splice(+v,1);}
  else if(a==='giveTo'){const it=C.inv[crGive];if(!it)return;const X=CRR.find(x=>x.k===it.r),bn=crBonus(it);S.h[v].eq[X.slot]+=bn;C.inv.splice(crGive,1);crGive=null;save();
    modal(`<div class="mbox"><div class="mtitle">ลองของใหม่!</div><div class="mbody"><img class="kfimg" src="${IMG.craft5}" alt=""><div class="hint">${HEROES[v].n} ได้รับ${X.n} · ${SLOTN[X.slot]} +${bn} ขั้น (ตอนนี้ +${S.h[v].eq[X.slot]})</div><button class="btn gold" data-cact="fgdone">ตกลง</button></div></div>`);if(typeof recalcLive==='function')recalcLive();renderCraft();return;}
  save();renderCraft();});
