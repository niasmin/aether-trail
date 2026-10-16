// ===================== RESONANCE · COLLECTION · WALLET · WORLD BOSS =====================
// ---- team resonance: every owned hero is at least the 5th-highest level
function resLv(){const ls=OWNED().map(k=>S.h[k].lv).sort((a,b)=>b-a);return ls.length>=5?ls.at(4):1;}
function resSync(){const r=resLv();let n=0;for(const k of OWNED())if(S.h[k].lv<r){S.h[k].lv=r;n++;}return n;}
// ---- collection: owned heroes + ranks = team-wide power
const collPct=()=>{const own=OWNED(),rk=own.reduce((a,k)=>a+rkOf(k),0);return {own:own.length,all:ALLH.length,rk,pct:own.length*1+rk*0.25};};
const collMul=()=>1+collPct().pct/100;
const RKCP_LEFT=k=>{let need=0;for(let r=rkOf(k);r<RK_MAX;r++)need+=RK_COPY.at(r);return need;};
const SOUL_PER={R:1,SR:2,SSR:6};
function extraCopies(k){return Math.max(0,(S.h[k].cp||0)-RKCP_LEFT(k));}
function renderColl(){const C=collPct(),r=resLv();const ex=OWNED().reduce((a,k)=>a+extraCopies(k)*SOUL_PER[HEROES[k].rar],0);
  $('collPad').innerHTML=`<div class="card collhd"><div><b class="dunnm">ห้องสะสมฮีโร่</b><div class="sub">มี ${C.own}/${C.all} ตัว · ขั้นดาวรวม ${C.rk}</div>
      <div class="collbar"><i style="width:${C.own/C.all*100}%"></i></div></div><div class="collbig"><b>+${C.pct.toFixed(1)}%</b><small>พลังทุกฮีโร่</small></div></div>
    <div class="card"><b>🔗 ระดับทีมร่วม Lv.${r}</b><div class="sub">ฮีโร่ทุกตัวที่มีจะได้เลเวลอย่างน้อยเท่าตัวที่ 5 ที่เลเวลสูงสุด ได้ตัวใหม่จากอัญเชิญก็ลงสนามได้ทันที · อัปเลเวลตัวที่ 5 ขึ้นเมื่อไหร่ ทุกตัวขึ้นตาม</div></div>
    <div class="card"><b>ตัวซ้ำเป็นพลัง</b><div class="sub">ฮีโร่ทุกตัว +1% · ทุกขั้นดาว +0.25% ให้ทั้งทีม · สำเนาที่เกินกว่าจะใช้เลื่อนดาวจนสุด แปลงเป็นผลึกวิญญาณได้ (R 1 · SR 2 · SSR 6 ต่อสำเนา)</div>
      <button class="btn gold sm" data-cact2="melt" ${ex?'':'disabled'} style="margin-top:6px">${ex?`แปลงสำเนาส่วนเกิน → ${ex} ผลึกวิญญาณ`:'ยังไม่มีสำเนาส่วนเกิน'}</button></div>
    <div class="collgrid">${ALLH.map(k=>{const H=HEROES[k],own=!!S.h[k],rk=own?rkOf(k):0,canR=own&&canRank(k);
      return `<button class="collc ${own?'':'no'} ${H.rar}" data-cact2="hero" data-v="${k}" ${own?'':'disabled'} style="--rc:${RARC[H.rar]}"><span class="cf" style="${own?faceStyle(k):`background-image:url('${cardImg(k)}');background-size:cover`}"></span>
        <b>${own?H.n:'???'}</b><small>${own?`Lv.${S.h[k].lv} · ${rk?rkName(rk):'ยังไม่เลื่อนดาว'}`:H.rar}</small>${own&&S.h[k].cp?`<em>สำเนา ${S.h[k].cp}</em>`:''}${canR?'<i class="cup">▲</i>':''}</button>`;}).join('')}</div>`;}
document.addEventListener('click',e=>{const b=e.target.closest('[data-cact2]');if(!b)return;const a=b.dataset.cact2;
  if(a==='hero'){selHero=b.dataset.v;go('hero');return;}
  if(a==='melt'){let got=0;for(const k of OWNED()){const x=extraCopies(k);if(x){S.h[k].cp-=x;got+=x*SOUL_PER[HEROES[k].rar];}}if(!got)return;S.soul=(S.soul||0)+got;save();toast(`ได้ผลึกวิญญาณ ${got} · ใช้เลื่อนดาวฮีโร่ตัวไหนก็ได้`);renderColl();}});
// ---- wallet: 6 main currencies, each with where to spend it
const WAL=[
 {k:'gold',ic:'coin',n:'ทอง',d:'อัปเลเวลฮีโร่ ตีบวกอุปกรณ์ เลื่อนดาว (รวม EXP เดิมเข้ามาแล้ว)',go:'hero',gn:'อัปเลเวล',src:'ด่าน · หีบออฟไลน์ · ถ้ำทองคำ'},
 {k:'gems',ic:'gem',n:'คริสตัล',d:'ซื้อตั๋วดาว หินอีเธอร์ ไข่มังกร แลกแก่นอีเธอร์ เร่งเวลา',go:'shop',gn:'ร้านค้า',src:'ผ่านด่านครั้งแรก · ภารกิจ · PvP · บอสโลก'},
 {k:'mats',ic:'ore',n:'หินอีเธอร์',d:'ตีบวกอุปกรณ์ เลื่อนดาวฮีโร่ ผลิตของช่างฝีมือ',go:'hero',gn:'ตีบวก',src:'บอส · เหมืองอีเธอร์ · ร้านค้า'},
 {k:'tickets',ic:'ticket',n:'ตั๋วดาว',d:'อัญเชิญฮีโร่ใหม่',go:'summon',gn:'อัญเชิญ',src:'บอสครั้งแรก · ภารกิจ · ร้านค้า · บอสโลก'},
 {k:'soul',ic:'soul',n:'ผลึกวิญญาณ',d:'ใช้แทนสำเนาเลื่อนดาวได้ทุกตัว · แลกฮีโร่ที่ยังไม่มี (รวม Star Tokens เดิมเข้ามาแล้ว)',go:'coll',gn:'ห้องสะสม',src:'ตัวซ้ำ · บททดสอบวิญญาณ · บอสครั้งแรก'},
 {k:'ess',ic:'ess',n:'แก่นอีเธอร์',d:'ซื้อพลังถาวรที่อยู่ตลอดไป แม้เกิดใหม่',go:'rebirth',gn:'ซื้อพลังถาวร',src:'เกิดใหม่ · แลกคริสตัล 400 ต่อแก่น'}];
const walAmt=k=>k==='ess'?((S.pr&&S.pr.ess)||0):(S[k]||0);
function walIcon(i){return i==='ess'?'<span class="essic">✦</span>':resIcon(i);}
function walHints(){const h=[];if(walAmt('ess')>=3)h.push(['ess',`มีแก่นอีเธอร์ ${walAmt('ess')} ยังไม่ได้ใช้ ซื้อ "พลังอีเธอร์" ได้พลังทุกฮีโร่ +5% ต่อระดับ`]);
  if(S.gems>=1500)h.push(['gems',`คริสตัล ${kf(S.gems)} เหลือเยอะ แลกเป็นแก่นอีเธอร์ได้วันละ 5 หรือซื้อหินอีเธอร์ในร้าน`]);
  if(S.tickets>=1&&modeOpen('summon'))h.push(['tickets',`มีตั๋วดาว ${S.tickets} ใบ ไปอัญเชิญได้`]);
  const ex=OWNED().reduce((a,k)=>a+extraCopies(k),0);if(ex)h.push(['soul',`มีสำเนาฮีโร่ส่วนเกิน ${ex} ชุด แปลงเป็นผลึกวิญญาณได้`]);
  if(S.soul>=3&&OWNED().some(k=>canRank(k)))h.push(['soul','มีฮีโร่ที่เลื่อนดาวได้ตอนนี้']);return h;}
function renderWallet(){const H=walHints();
  $('walPad').innerHTML=`<div class="sub" style="text-align:center;margin-bottom:6px">สกุลเงินหลักเหลือ 6 อย่าง · ของในแต่ละโหมด (ทรัพยากรเมือง เหรียญแม่ทัพ) ใช้เฉพาะในโหมดนั้น</div>
  ${H.length?`<div class="card walhint"><b>💡 ของที่ควรใช้</b>${H.map(([k,t])=>{const W=WAL.find(w=>w.k===k);return `<div class="nxr"><span>${walIcon(W.ic)}</span><div>${t}</div><button class="btn sm gold" data-go="${W.go}">${W.gn}</button></div>`;}).join('')}</div>`:''}
  ${WAL.map(W=>`<div class="card walr"><span class="wi">${walIcon(W.ic)}</span><div style="flex:1;min-width:0"><b>${W.n} <span class="num">${kf(walAmt(W.k))}</span></b><div class="sub">ใช้: ${W.d}</div><div class="sub">ได้จาก: ${W.src}</div></div><button class="btn sm" data-go="${W.go}">${W.gn}</button></div>`).join('')}`;}
// ---- world boss (shared HP through the db: each player writes only wboss/<own id>)
const WB_HP=3e8,WB_TRIES=3,WB_LIM=60,WB_DAYS=2;
const WBN=[['ไททันพฤกษาโบราณ',0],['โกเลมอำพันยักษ์',1],['นาคีดึกดำบรรพ์',2],['ผู้เฝ้าดาราแห่งกาลเวลา',3],['จักรพรรดิหิมะนิรันดร์',4]];
const wbCyc=()=>Math.floor(dayNo()/WB_DAYS);
const wbBoss=c=>{const [n,a]=WBN.at(c%WBN.length);return {n,a,img:IMG['boss'+(a+1)]};};
const wbEnd_t=c=>((c+1)*WB_DAYS*864e5)-7*3600e3;
let wbDocs={};
function wbState(){if(!S.wb)S.wb={c:-1,dmg:0,best:0,n:0,day:-1,tries:WB_TRIES,claimed:{},lastRank:null,lastC:-1,lastKill:false,titles:{},runs:0};const W=S.wb,c=wbCyc();
  if(W.c!==c){if(W.c>=0&&W.dmg>0){W.lastC=W.c;W.prevRank=W.lastRank;W.prevKill=W.lastKill;W.prevClaimed=false;}W.c=c;W.dmg=0;W.best=0;W.n=0;W.claimed={};W.lastRank=null;W.lastKill=false;}
  if(W.day!==dayNo()){W.day=dayNo();W.tries=WB_TRIES;}return W;}
function wbBots(c){const t=Math.max(0,Math.min(1,(Date.now()-(c*WB_DAYS*864e5-7*3600e3))/(WB_DAYS*864e5)));
  return BOTS.slice(0,8).map((b,i)=>{const w=seedRand(c*31+i*7)*.8+.4;return {id:'bot'+i,name:b.name,bot:true,dmg:Math.round(WB_HP*.055*w*t),ti:''};});}
function wbBoard(){const W=wbState(),c=W.c,list=wbBots(c);for(const id in wbDocs){const d=wbDocs[id];if(id===myId||d.c!==c)continue;list.push({id,name:String(d.name||'นักเดินทาง').slice(0,16),dmg:Math.max(0,Math.min(WB_HP,+d.dmg||0)),ti:String(d.ti||''),n:+d.n||0});}
  list.push({id:'me',me:true,name:S.pname,dmg:W.dmg,ti:(S.dun&&S.dun.title)||'',n:W.n});list.sort((a,b)=>b.dmg-a.dmg);
  const tot=Math.min(WB_HP,list.reduce((a,p)=>a+p.dmg,0));const rank=list.findIndex(p=>p.me)+1;if(W.dmg>0){W.lastRank=rank;if(tot>=WB_HP)W.lastKill=true;}return {list,tot,rank};}
const WBM=[[.25,{gems:50}],[.5,{gems:80,mats:20}],[.75,{tickets:1,gems:100}],[1,{tickets:2,gems:200,soul:3}]];
const wbRankRw=r=>r===1?{gems:300,tickets:5}:r<=3?{gems:200,tickets:3}:r<=10?{gems:100,tickets:1}:{gems:50};
function startDBsync(){if(!DB||startDBsync.on)return;startDBsync.on=1;try{DB.collection('wboss').limit(300).onSnapshot(s=>{wbDocs={};s.docs.forEach(d=>{wbDocs[d.id]=d.data();});if(screen==='wboss'&&!$('modalRoot').innerHTML)renderWB();},()=>{});}catch(e){}}
async function wbPush(){if(!DB||!myId)return;const W=wbState();try{await DB.doc('wboss/'+myId).set({name:S.pname.slice(0,16),c:W.c,dmg:Math.round(W.dmg),best:Math.round(W.best),n:W.n,ti:(S.dun&&S.dun.title)||'',t:Date.now()});}catch(e){}}
function renderWB(){startDBsync();const W=wbState(),Bo=wbBoss(W.c),{list,tot,rank}=wbBoard(),pct=tot/WB_HP,left=wbEnd_t(W.c)-Date.now();
  const prev=W.lastC>=0&&!W.prevClaimed&&W.prevRank?`<div class="card wbprev"><b>🏆 ผลรอบที่แล้ว: อันดับ ${W.prevRank}${W.prevKill?' · บอสถูกล้ม!':''}</b><div class="sub">รางวัล: ${giveTxt(wbRankRw(W.prevRank))}${W.prevRank===1?' · ฉายา "จ้าวบอสโลก"':''}${W.prevKill?' · ฉายา "ผู้ล้มบอสโลก"':''}</div><button class="btn gold sm" data-wact="prev">รับรางวัลรอบที่แล้ว</button></div>`:'';
  $('wbPad').innerHTML=`${prev}<div class="card wbhero"><div class="wbbg" style="background-image:url(${IMG['bd'+(Bo.a+1)]})"></div><img class="wbimg" src="${Bo.img}" alt=""><div class="wbinfo"><b>${Bo.n}</b><span>บอสโลก · ทุกคนช่วยกันตี · เปลี่ยนทุก ${WB_DAYS} วัน</span></div>
      <div class="wbhp"><i style="width:${Math.max(0,100-pct*100)}%"></i><em>${pct>=1?'💀 ถูกล้มแล้ว!':`HP ${(100-pct*100).toFixed(1)}% · ${kf(WB_HP-tot)} / ${kf(WB_HP)}`}</em></div>
      <div class="sub" style="position:relative;text-align:center">เหลือเวลา ${fmtLeft(left)} · ผู้ร่วมตี ${list.filter(p=>p.dmg>0).length} คน</div></div>
    <div class="card"><b>ดาเมจของคุณรอบนี้ ${kf(W.dmg)}</b> <span class="sub">อันดับ ${W.dmg?rank:'–'} · สูงสุดต่อครั้ง ${kf(W.best)} · เหลือ ${W.tries}/${WB_TRIES} ครั้งวันนี้</span>
      <button class="btn gold" data-wact="fight" ${W.tries<1||pct>=1?'disabled':''} style="width:100%;margin-top:8px">${pct>=1?'บอสถูกล้มแล้ว รอบอสตัวใหม่':W.tries<1?'ครบแล้ววันนี้':'⚔️ บุกบอสโลก (60 วิ)'}</button></div>
    <div class="card"><b>รางวัลร่วม</b> <span class="sub">ทุกคนที่ร่วมตีรับได้ เมื่อเลือดบอสลดถึงเป้า</span><div class="wbms">${WBM.map(([p,rw],i)=>{const ok=pct>=p,got=W.claimed[i];return `<div class="wbm ${ok?'ok':''} ${got?'got':''}"><b>${p*100}%</b><small>${giveTxt(rw)}</small>${got?'<em>✓</em>':`<button class="btn sm ${ok&&W.dmg?'gold':''}" data-wact="ms" data-v="${i}" ${ok&&W.dmg?'':'disabled'}>รับ</button>`}</div>`;}).join('')}</div></div>
    <div class="card"><b>ตารางอันดับดาเมจ</b> <span class="sub">อันดับ 1 ได้ฉายา "จ้าวบอสโลก" ตอนจบรอบ</span><div class="wbrank">${list.slice(0,20).map((p,i)=>`<div class="wbr ${p.me?'me':''} ${i<3?'top'+(i+1):''}"><span class="no">${i<3?['🥇','🥈','🥉'].at(i):i+1}</span><span class="nm">${esc(p.name)}${ttlHtml(p.ti)}${p.me?' (คุณ)':p.bot?' <span class="badge">บอท</span>':''}</span><b class="num">${kf(p.dmg)}</b></div>`).join('')}
      ${rank>20?`<div class="wbr me"><span class="no">${rank}</span><span class="nm">${esc(S.pname)} (คุณ)</span><b class="num">${kf(W.dmg)}</b></div>`:''}</div></div>`;}
function startWB(){const W=wbState(),Bo=wbBoss(W.c);if(!$('team').children.length)renderTeam();measure();unitsEl.innerHTML='';const heroes=mkHeroUnits();
  const st=enemyStats(dbScale(),'boss'),hp=dbHp();const u=mkUnit(Bo.img,BOSSPOS[0],.46,'en boss','saturate(1.3) contrast(1.1)',false);
  Object.assign(u,{kind:'boss',max:hp,hp,atk:Math.round(st.atk*.75),def:st.def,spd:2.3,atkT:1.5,alive:true,n:Bo.n,hits:0,shield:0,abT:6});
  B={boss:true,t:0,limit:WB_LIM,heroes,en:[u],over:false,taunt:0,daily:{n:Bo.n,a:Bo.a},wb:true,s:dbScale(),area:Bo.a,phase:1,loot:{g:0,x:0,m:0,gem:0}};B.heroes.forEach(h=>{h.chill=0;h.pois=0;});
  $('modTag').hidden=false;$('modTag').textContent='🌐 บอสโลก · ดาเมจ 0';$('bd').style.backgroundImage=`url("${IMG['bd'+(Bo.a+1)]}")`;$('bd').style.filter='brightness(.8) saturate(1.2)';AREAS[Bo.a].g.forEach((c,i)=>stage.style.setProperty('--g'+i,c));
  $('stTxt').textContent='บอสโลก';$('arTxt').textContent=Bo.n;renderTeam();}
function wbEnd(){const W=wbState(),dmg=Math.round(B.heroes.reduce((a,h)=>a+h.dealt,0)),Bo=wbBoss(W.c);W.dmg+=dmg;W.best=Math.max(W.best,dmg);W.n++;W.runs=(W.runs||0)+1;
  const rw={gems:20,gold:Math.round(lvCost(Math.max(1,resLv())).g*.5)};addRes(rw);if(typeof dmAdd==='function')dmAdd('wboss',1);save();wbPush();const {rank,tot}=wbBoard();
  banner('หมดเวลา!','ดาเมจ '+kf(dmg));
  setTimeout(()=>modal(`<div class="mbox"><div class="mtitle">🌐 บอสโลก · ${Bo.n}</div><div class="mbody" style="text-align:center">
    <div class="sub">ดาเมจครั้งนี้</div><div class="wbdmg num">${fmt(dmg)}</div><div class="sub">รวมรอบนี้ ${kf(W.dmg)} · อันดับ <b>${rank}</b> · เลือดบอสเหลือ ${Math.max(0,100-tot/WB_HP*100).toFixed(1)}%</div>
    <div class="hint">ได้รับ ${giveTxt(rw)}</div><div style="display:flex;gap:8px;justify-content:center"><button class="btn gold" data-wact="back">ดูตารางอันดับ</button></div></div></div>`),1200);}
const _dailyEnd=dailyEnd;dailyEnd=function(){if(B&&B.wb)return wbEnd();return _dailyEnd();};
document.addEventListener('click',e=>{const b=e.target.closest('[data-wact]');if(!b)return;const a=b.dataset.wact,W=wbState();
  if(a==='fight'){if(W.tries<1)return;if(!S.form.some(Boolean)){toast('จัดทีมก่อน');return;}W.tries--;save();closeModal(false);if(B)B.over=true;go('battle');const Bo=wbBoss(W.c);bossWarn(Bo.n,'??',()=>startWB(),IMG['bd'+(Bo.a+1)],BOSSAB[Bo.a]);return;}
  if(a==='back'){closeModal(false);go('wboss');setTimeout(nextWave,300);return;}
  if(a==='ms'){const i=+b.dataset.v,{tot}=wbBoard();if(W.claimed[i]||!W.dmg||tot/WB_HP<WBM.at(i)[0])return;W.claimed[i]=1;addRes(WBM.at(i)[1]);toast('ได้รับ '+giveTxt(WBM.at(i)[1]));}
  if(a==='prev'){if(W.prevClaimed||!W.prevRank)return;W.prevClaimed=true;addRes(wbRankRw(W.prevRank));if(W.prevRank===1)W.titles.wbtop=1;if(W.prevKill)W.titles.wbslay=1;toast('ได้รับ '+giveTxt(wbRankRw(W.prevRank)));}
  save();renderWB();});
// titles from collection + world boss
Object.assign(DUNT,{wbslay:{n:'ผู้ล้มบอสโลก',c:'tw',how:'ร่วมตีจนบอสโลกถูกล้มในรอบนั้น'},wbtop:{n:'จ้าวบอสโลก',c:'tw2',how:'อันดับ 1 ดาเมจบอสโลกตอนจบรอบ'},coll:{n:'นักสะสมครบชุด',c:'tc',how:'มีฮีโร่ครบทุกตัว'}});
const _titleOwned=titleOwned;titleOwned=function(k){if(k==='wbslay'||k==='wbtop')return !!(S.wb&&S.wb.titles&&S.wb.titles[k]);if(k==='coll')return OWNED().length>=ALLH.length;return _titleOwned(k);};
