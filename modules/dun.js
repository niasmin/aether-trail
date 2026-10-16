// ===================== RESOURCE DUNGEONS + TITLES =====================
const DUNG={
 gold:{ic:'💰',n:'ถ้ำทองคำ',rn:'ทอง',area:1,bi:'boss2',bt:'sepia(.5) saturate(2.6) hue-rotate(-8deg) brightness(1.2)',bn:'โกเลมทองคำ',mi:'m_ore',mt:'sepia(.6) saturate(2.4) brightness(1.15)',mn:'ภูตเหมืองทอง',d:'โกเลมผู้เฝ้าขุมทรัพย์ ทุบพื้นโจมตีทั้งทีม'},
 ether:{ic:'💠',n:'เหมืองอีเธอร์',rn:'หินอีเธอร์',area:3,bi:'boss4',bt:'hue-rotate(150deg) saturate(1.6) brightness(1.1)',bn:'ผู้เฝ้าผลึกอีเธอร์',mi:'m_star',mt:'hue-rotate(160deg) saturate(1.5)',mn:'ภูตผลึก',d:'ผู้เฝ้าผลึกฟื้นฟูตัวเอง ต้องตีให้แรงและเร็ว'},
 soul:{ic:'👻',n:'บททดสอบวิญญาณ',rn:'ผลึกวิญญาณ',area:7,bi:'boss3',bt:'hue-rotate(205deg) saturate(1.6) brightness(.9) contrast(1.2)',bn:'ราชันย์วิญญาณ',mi:'m_wisp',mt:'hue-rotate(230deg) saturate(1.4)',mn:'ดวงวิญญาณหลงทาง',d:'ราชันย์วิญญาณดูดพลังทั้งทีม ฟื้นตัวเองและสร้างโล่'}};
const DUN_TRIES=3,DUN_MAX=10,DUN_LIM=60;
const dunSt=t=>4+t*8;
const DRANK={S:1.5,A:1.2,B:1};
function dunRw(g,t,r){const m=DRANK[r||'B'],st=dunSt(t);
  if(g==='gold')return {gold:Math.round(lvCost(Math.round(st*1.2)).g*.8*m)};
  if(g==='ether')return {mats:Math.round((8+t*10)*m)};
  return {soul:Math.round((1+Math.ceil(t/2))*m)};}
const DUNT={
 gold5:{n:'นักล่าทองคำ',c:'tg',how:'ผ่านถ้ำทองคำระดับ 5'},gold10:{n:'ราชาทองคำ',c:'tg2',how:'ผ่านถ้ำทองคำระดับ 10'},
 ether5:{n:'ผู้ขุดอีเธอร์',c:'te',how:'ผ่านเหมืองอีเธอร์ระดับ 5'},ether10:{n:'จ้าวแห่งอีเธอร์',c:'te2',how:'ผ่านเหมืองอีเธอร์ระดับ 10'},
 soul5:{n:'ผู้ท้าวิญญาณ',c:'ts',how:'ผ่านบททดสอบวิญญาณระดับ 5'},soul10:{n:'ผู้พิชิตวิญญาณ',c:'ts2',how:'ผ่านบททดสอบวิญญาณระดับ 10'},
 perfect:{n:'ผู้ไร้ที่ติ',c:'tp',how:'ได้อันดับ S ครบทุกระดับในประตูใดก็ได้'},
 legend:{n:'ตำนานแห่งอีเธอร์',c:'tl',how:'ผ่านระดับ 10 ครบทั้ง 3 ประตู'}};
function dunState(){if(!S.dun)S.dun={day:-1,tries:{},best:{gold:{},ether:{},soul:{}},title:null,sel:{gold:1,ether:1,soul:1},runs:0};const D=S.dun;if(D.day!==dayNo()){D.day=dayNo();D.tries={gold:DUN_TRIES,ether:DUN_TRIES,soul:DUN_TRIES};}return D;}
const dunTop=g=>{const b=dunState().best[g];let t=0;while(b[t+1])t++;return t;};
function titleOwned(k){const D=dunState();if(k==='legend')return ['gold','ether','soul'].every(g=>dunTop(g)>=10);if(k==='perfect')return ['gold','ether','soul'].some(g=>{const b=D.best[g];for(let t=1;t<=DUN_MAX;t++)if(!b[t]||b[t].r!=='S')return false;return true;});
  const m=k.match(/^(gold|ether|soul)(\d+)$/);return !!m&&dunTop(m[1])>=+m[2];}
function ttlHtml(k){const T=DUNT[k];return T?` <span class="ttl ${T.c}">${T.n}</span>`:'';}
function ttlUpdate(){const k=S.dun&&S.dun.title,el=$('ttl'),T=DUNT[k];if(el)el.innerHTML=T?`<span class="ttl ${T.c}">${T.n}</span>`:'';const av=$('ava');if(av){av.classList.remove('fr-tg','fr-tg2','fr-te','fr-te2','fr-ts','fr-ts2','fr-tp','fr-tl');if(T)av.classList.add('fr-'+T.c);}}
function renderDun(){const D=dunState(),T=DUNT[D.title];
  let h=`<div class="card dunme"><div class="ava big ${T?'fr-'+T.c:''}" style="${faceStyle('knight')}"></div><div style="flex:1;min-width:0"><b class="dunnm">${esc(S.pname)}</b>${T?`<div><span class="ttl ${T.c} lg">${T.n}</span></div>`:'<div class="sub">ยังไม่มีฉายา พิชิตดันเจี้ยนเพื่อรับฉายาที่แสดงข้างชื่อ ในแชท และในอันดับ PvP</div>'}
    <div class="sub">ผ่านดันเจี้ยนแล้ว ${D.runs||0} ครั้ง</div></div></div>
  <div class="card"><b>ฉายาของฉัน</b> <span class="sub">แตะเพื่อสวม · แสดงให้ทุกคนเห็น</span><div class="ttlgrid">${Object.entries(DUNT).map(([k,X])=>{const own=titleOwned(k),on=D.title===k;
    return `<button class="ttlb ${own?'':'lock'} ${on?'on':''}" data-uact="title" data-v="${k}" ${own?'':'disabled'}><span class="ttl ${X.c}">${own?X.n:'???'}</span><small>${on?'✓ สวมอยู่':own?'แตะเพื่อสวม':X.how}</small></button>`;}).join('')}</div></div>`;
  for(const [g,G] of Object.entries(DUNG)){const top=dunTop(g),sel=Math.min(D.sel[g]||1,top+1,DUN_MAX),b=D.best[g],bs=b[sel],st=dunSt(sel),rw=dunRw(g,sel,bs?bs.r:'B'),left=D.tries[g];
    h+=`<div class="card dung"><div class="dunbg" style="background-image:url(${IMG['bd'+(G.area+1)]})"></div><div class="dunhd"><span class="dunic">${G.ic}</span><div><b>${G.n}</b><div class="sub">ได้${G.rn} · เหลือ ${left}/${DUN_TRIES} ครั้งวันนี้ · แพ้ไม่เสียสิทธิ์</div></div></div>
      <div class="dtiers">${Array.from({length:DUN_MAX},(_,i)=>{const t=i+1,r=b[t],lock=t>top+1;return `<button class="dti ${t===sel?'on':''} ${r?'r'+r.r:''} ${lock?'lock':''}" data-uact="sel" data-g="${g}" data-v="${t}" ${lock?'disabled':''}><span>${lock?'🔒':t}</span><small>${r?r.r:''}</small></button>`;}).join('')}</div>
      <div class="dinfo"><div><b>ระดับ ${sel}</b> · ศัตรูเทียบด่าน ${sname(Math.min(STAGES-1,st))}${st>=STAGES?'+':''}<div class="sub">${G.bn}: ${G.d}</div>
        <div class="sub">รางวัล: ${giveTxt(dunRw(g,sel,'B'))} · อันดับ S ได้ x1.5${bs?` · สถิติ ${bs.r} (${bs.t} วิ)`:''}</div></div></div>
      <div class="cvp"><button class="btn gold" data-uact="fight" data-g="${g}" data-v="${sel}" ${left<1?'disabled':''}>${left<1?'ครบแล้ววันนี้':'⚔️ บุกดันเจี้ยน'}</button>${bs&&bs.r==='S'?`<button class="btn sm" data-uact="sweep" data-g="${g}" data-v="${sel}" ${left<1?'disabled':''}>⚡ กวาดทันที (S)</button>`:''}</div></div>`;}
  h+=`<div class="sub" style="text-align:center">อันดับ: S = ชนะภายใน 25 วิ · A = ภายใน 40 วิ · B = ภายใน 60 วิ · ได้ S แล้วกวาดระดับนั้นได้ทันที</div>`;
  $('dunPad').innerHTML=h;}
function startDun(g,t){const G=DUNG[g],st=dunSt(t),A=AREAS[G.area];if(!$('team').children.length)renderTeam();measure();unitsEl.innerHTML='';const heroes=mkHeroUnits();const en=[];
  const add=(boss,pos)=>{const s=enemyStats(st,'mid');const u=boss?mkUnit(IMG[G.bi],pos,.4,'en boss',G.bt,false):mkUnit(IMG[G.mi],pos,.19,'en',G.mt,false);
    const hp=Math.round(s.hp*(boss?6:1)),atk=Math.round(s.atk*(boss?1.5:1));Object.assign(u,{kind:boss?'boss':'mid',max:hp,hp,atk,def:s.def,spd:boss?2.3:rnd(1.9,2.3),atkT:rnd(.6,1.6),alive:true,n:boss?G.bn:G.mn,hits:0,shield:0,abT:boss?6:1e9});en.push(u);};
  add(true,BOSSPOS[0]);add(false,BOSSPOS[1]);add(false,BOSSPOS[2]);
  B={boss:true,t:0,limit:DUN_LIM,heroes,en,over:false,taunt:0,dun:{g,t},s:st,area:G.area,loot:{g:0,x:0,m:0,gem:0}};B.heroes.forEach(h=>{h.chill=0;h.pois=0;});
  $('modTag').hidden=false;$('modTag').textContent=`${G.ic} ${G.n} · ระดับ ${t} · S ภายใน 25 วิ`;
  $('bd').style.backgroundImage=`url("${IMG['bd'+(G.area+1)]}")`;$('bd').style.filter='none';A.g.forEach((c,i)=>stage.style.setProperty('--g'+i,c));
  $('stTxt').textContent=`${G.n} ${t}`;$('arTxt').textContent=G.bn;renderTeam();}
function dunEnd(win,why){const {g,t}=B.dun,G=DUNG[g],D=dunState(),tm=Math.round(B.t);
  if(!win){banner(why==='time'?'หมดเวลา!':'พ่ายแพ้',G.n);setTimeout(()=>modal(`<div class="mbox"><div class="mtitle">${G.n} · ระดับ ${t}</div><div class="mbody" style="text-align:center">
    <div class="drank rF">${why==='time'?'⏱':'✗'}</div><div class="sub">${why==='time'?'ตีไม่ทันเวลา 60 วินาที':'ทีมล้มหมด'} · ไม่เสียสิทธิ์ ลองใหม่ได้</div>
    <div class="hint" style="text-align:left">ลองระดับที่ต่ำกว่า หรืออัปเกรดฮีโร่ แล้วกลับมาใหม่${g==='ether'?' · บอสฟื้นตัวเองทุก 8 วิ ต้องเน้นดาเมจ':g==='soul'?' · บอสสร้างโล่และดูดพลัง ต้องมีผู้ฟื้นฟู':' · บอสทุบทั้งทีม แนวหน้าต้องถึก'}</div>
    <div style="display:flex;gap:8px;justify-content:center"><button class="btn gold" data-uact="fight" data-g="${g}" data-v="${t}">ลองอีกครั้ง</button><button class="btn sm" data-uact="back">กลับดันเจี้ยน</button></div></div></div>`),1200);save();return;}
  const r=tm<=25?'S':tm<=40?'A':'B',prev=D.best[g][t],newBest=!prev||'SAB'.indexOf(r)<'SAB'.indexOf(prev.r)||(prev.r===r&&tm<prev.t);
  const before=Object.keys(DUNT).filter(titleOwned);
  if(newBest)D.best[g][t]={r,t:tm};D.tries[g]=Math.max(0,D.tries[g]-1);D.runs=(D.runs||0)+1;const rw=dunRw(g,t,r);addRes(rw);if(typeof dmAdd==='function')dmAdd('dun',1);
  const gained=Object.keys(DUNT).filter(k=>titleOwned(k)&&!before.includes(k));if(gained.length&&!D.title)D.title=gained[gained.length-1];save();ttlUpdate();
  banner(r==='S'?'PERFECT!':'CLEAR!',`${G.n} ระดับ ${t}`);
  setTimeout(()=>modal(`<div class="mbox"><div class="mtitle">${G.ic} ${G.n} · ระดับ ${t}</div><div class="mbody" style="text-align:center">
    <div class="drank r${r}">${r}</div><div class="sub">ชนะใน ${tm} วินาที${newBest&&prev?' · สถิติใหม่!':''}</div>
    <div class="hint">ได้รับ ${giveTxt(rw)}${r!=='B'?` (อันดับ ${r} x${DRANK[r]})`:''}</div>
    ${gained.map(k=>`<div class="newttl">🏅 ได้รับฉายาใหม่!<span class="ttl ${DUNT[k].c} lg">${DUNT[k].n}</span><small>แสดงข้างชื่อ ในแชทโลก และในอันดับ PvP</small></div>`).join('')}
    <div class="sub">เหลือ ${D.tries[g]}/${DUN_TRIES} ครั้งวันนี้</div>
    <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">${t<DUN_MAX&&D.tries[g]>0?`<button class="btn gold" data-uact="fight" data-g="${g}" data-v="${t+1}">ระดับ ${t+1} ›</button>`:''}<button class="btn sm" data-uact="back">กลับดันเจี้ยน</button></div></div></div>`),1300);}
document.addEventListener('click',e=>{const b=e.target.closest('[data-uact]');if(!b)return;const a=b.dataset.uact,g=b.dataset.g,v=+b.dataset.v,D=dunState();
  if(a==='sel'){D.sel[g]=v;save();renderDun();}
  else if(a==='title'){const k=b.dataset.v;if(!titleOwned(k))return;D.title=D.title===k?null:k;save();ttlUpdate();renderDun();if(typeof pushArena==='function')pushArena();toast(D.title?'สวมฉายา '+DUNT[k].n:'ถอดฉายาแล้ว');}
  else if(a==='fight'){if(D.tries[g]<1){toast('ครบแล้ววันนี้');return;}if(v>dunTop(g)+1)return;if(!S.form.some(Boolean)){toast('จัดทีมก่อน');return;}D.sel[g]=v;save();closeModal(false);if(B)B.over=true;go('battle');
    const G=DUNG[g];bossWarn(G.bn,sname(Math.min(STAGES-1,dunSt(v))),()=>startDun(g,v),IMG['bd'+(G.area+1)],BOSSAB[G.area]);}
  else if(a==='sweep'){const bs=D.best[g][v];if(!bs||bs.r!=='S'||D.tries[g]<1)return;D.tries[g]--;D.runs=(D.runs||0)+1;const rw=dunRw(g,v,'S');addRes(rw);if(typeof dmAdd==='function')dmAdd('dun',1);save();toast(`⚡ กวาด${DUNG[g].n} ระดับ ${v} · ได้รับ ${giveTxt(rw)}`);renderDun();}
  else if(a==='back'){closeModal(false);go('dun');setTimeout(nextWave,300);}});
