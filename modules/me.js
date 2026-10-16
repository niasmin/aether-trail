// ===================== MY CHARACTER: STATS · CLASS =====================
const MSTAT=[
 {k:'str',n:'STR',ic:'💪',d:'ATK ของอัศวินและนักธนู +0.5% ต่อแต้ม'},
 {k:'int',n:'INT',ic:'🔮',d:'ATK/การรักษาของนักเวทและผู้ฟื้นฟู +0.5% ต่อแต้ม'},
 {k:'vit',n:'VIT',ic:'❤️',d:'HP ทั้งทีม +0.4% · DEF +0.2% ต่อแต้ม'},
 {k:'agi',n:'AGI',ic:'💨',d:'คริติคอลทั้งทีม +0.1% · ATK +0.15% ต่อแต้ม'},
];
const MCLS={
 sword:{t:1,ic:'⚔️',n:'นักดาบ',d:'ATK อัศวินและนักธนู +8%',b:{atkP:8}},
 mage:{t:1,ic:'🔮',n:'นักเวท',d:'ATK นักเวทและผู้ฟื้นฟู +8%',b:{atkM:8}},
 archer:{t:1,ic:'🏹',n:'นักธนู',d:'คริติคอลทั้งทีม +5%',b:{crit:5}},
 guard:{t:1,ic:'🛡️',n:'ผู้พิทักษ์',d:'HP ทั้งทีม +10%',b:{hp:10}},
 berserk:{t:2,p:'sword',ic:'🪓',n:'อัศวินคลั่ง',d:'ATK ทั้งทีม +12% · HP -5%',b:{atk:12,hp:-5}},
 paladin:{t:2,p:'sword',ic:'✝️',n:'อัศวินศักดิ์สิทธิ์',d:'ATK อัศวินและนักธนู +8% · HP +10% · DEF +10%',b:{atkP:8,hp:10,def:10}},
 pyro:{t:2,p:'mage',ic:'🔥',n:'จอมเวทเพลิง',d:'ATK นักเวทและผู้ฟื้นฟู +18%',b:{atkM:18}},
 storm:{t:2,p:'mage',ic:'⚡',n:'จอมเวทวายุ',d:'ATK ทั้งทีม +7% · คริติคอล +4%',b:{atk:7,crit:4}},
 hunter:{t:2,p:'archer',ic:'🐺',n:'พรานป่า',d:'ATK ทั้งทีม +6% · คริติคอล +5%',b:{atk:6,crit:5}},
 sniper:{t:2,p:'archer',ic:'🎯',n:'นักแม่นธนู',d:'คริติคอลทั้งทีม +11%',b:{crit:11}},
 saint:{t:2,p:'guard',ic:'🌿',n:'นักบุญ',d:'ATK ผู้ฟื้นฟู +25% · HP ทั้งทีม +8%',b:{atkH:25,hp:8}},
 fort:{t:2,p:'guard',ic:'🏯',n:'ป้อมเหล็ก',d:'HP ทั้งทีม +15% · DEF +20%',b:{hp:15,def:20}},
};
const MCLS_LV=[10,40];
function meState(){if(!S.me)S.me={str:0,int:0,vit:0,agi:0,c1:'',c2:'',fp:0,fday:'',fw:0,fk:0,top:0};if(S.best>(S.me.top||0))S.me.top=S.best;return S.me;}
const meTop=()=>Math.max(S.best,meState().top||0);
function mePts(){const M=meState();return Math.max(0,meTop())+3*((S.pr&&S.pr.n)||0)+(M.fp||0);}
function meUsed(){const M=meState();return M.str+M.int+M.vit+M.agi;}
function meFree(){return Math.max(0,mePts()-meUsed());}
function meBonus(rl){const M=meState(),b={atk:0,hp:0,def:0,crit:0};const phys=rl==='knight'||rl==='ranger',mag=rl==='mage'||rl==='healer';
  if(phys)b.atk+=M.str*.5;if(mag)b.atk+=M.int*.5;b.hp+=M.vit*.4;b.def+=M.vit*.2;b.crit+=M.agi*.1;b.atk+=M.agi*.15;
  [M.c1,M.c2].forEach(c=>{const C=MCLS[c];if(!C)return;const x=C.b;b.atk+=(x.atk||0)+(phys?x.atkP||0:0)+(mag?x.atkM||0:0)+(rl==='healer'?x.atkH||0:0);b.hp+=x.hp||0;b.def+=x.def||0;b.crit+=x.crit||0;});return b;}
const _statsMe=stats;stats=function(k,lv){const r=_statsMe(k,lv);try{const b=meBonus(HEROES[k].rl);r.hp=Math.round(r.hp*(1+b.hp/100));r.atk=Math.round(r.atk*(1+b.atk/100));r.def=Math.round(r.def*(1+b.def/100));r.crit=+(r.crit+b.crit).toFixed(1);r.power=Math.round(r.hp*.3+r.atk*5+r.def*3);}catch(e){}return r;};
function meClsName(){const M=meState();return MCLS[M.c2]?MCLS[M.c2].n:MCLS[M.c1]?MCLS[M.c1].n:'นักเดินทาง';}
function meClsIc(){const M=meState();return MCLS[M.c2]?MCLS[M.c2].ic:MCLS[M.c1]?MCLS[M.c1].ic:'🧭';}
let meTab='stat';
function renderMe(){const M=meState(),k=avKey(),T=S.dun&&S.dun.title&&DUNT[S.dun.title],free=meFree();
  const tabs=`<div class="mtabs">${[['stat','📊 ค่าสถานะ'+(free?` (${free})`:'')],['cls','🎓 อาชีพ'],['wear','👗 ชุด']].map(([t,n])=>`<button class="mtab ${meTab===t?'on':''}" data-meact="tab" data-v="${t}">${n}</button>`).join('')}</div>`;
  let h='';
  if(meTab==='stat'){const tb=meBonus('knight'),mb=meBonus('mage');
    h=`<div class="card"><div class="mefree"><b>แต้มสถานะ</b><span>ว่าง <b class="num">${free}</b> / ทั้งหมด <span class="num">${mePts()}</span></span></div>
      <div class="sub">ได้แต้มจาก: ด่านไกลสุดที่เคยผ่าน 1 แต้มต่อด่าน (${meTop()}) · เกิดใหม่ 3 แต้มต่อครั้ง (${3*((S.pr&&S.pr.n)||0)}) · ล่ามอนสเตอร์ในทุ่ง (${M.fp||0})</div>
      ${MSTAT.map(s=>`<div class="mest"><span class="mesi">${s.ic}</span><div style="flex:1;min-width:0"><b>${s.n} <span class="num">${M[s.k]}</span></b><div class="sub">${s.d}</div></div>
        <button class="btn sm" data-meact="add" data-v="${s.k}" data-n="1" ${free?'':'disabled'}>+1</button><button class="btn sm" data-meact="add" data-v="${s.k}" data-n="10" ${free>=1?'':'disabled'}>+10</button></div>`).join('')}
      <div style="display:flex;gap:8px;margin-top:8px"><button class="btn sm" data-meact="auto" ${free?'':'disabled'} style="flex:1">กระจายอัตโนมัติ</button><button class="btn sm" data-meact="reset" ${meUsed()?'':'disabled'} style="flex:1;background:var(--parch3);color:var(--ink);box-shadow:none">รีเซ็ต · 💎 100</button></div></div>
      <div class="card"><b>พลังที่อวาตาร์มอบให้ทีม</b><div class="mebon">
        <span>⚔️ ATK สายกายภาพ <b>+${tb.atk.toFixed(1)}%</b></span><span>🔮 ATK สายเวท <b>+${mb.atk.toFixed(1)}%</b></span><span>❤️ HP <b>+${tb.hp.toFixed(1)}%</b></span><span>🛡️ DEF <b>+${tb.def.toFixed(1)}%</b></span><span>💥 คริติคอล <b>+${tb.crit.toFixed(1)}%</b></span></div>
        <div class="sub">พลังทีมตอนนี้ ${kf(teamPower())}</div></div>`;}
  else if(meTab==='cls'){const t1=Object.entries(MCLS).filter(([,c])=>c.t===1),t2=Object.entries(MCLS).filter(([,c])=>c.t===2&&c.p===M.c1);
    const card=(id,c,on,lock,why)=>`<button class="mecls ${on?'on':''} ${lock?'lock':''}" data-meact="cls" data-v="${id}"><span>${c.ic}</span><div><b>${c.n}</b><small>${c.d}</small>${lock?`<em>🔒 ${why}</em>`:''}</div>${on?'<i>✓</i>':''}</button>`;
    h=`<div class="card"><b>อาชีพขั้น 1</b> <span class="sub">ปลดล็อกที่ด่าน ${sname(MCLS_LV[0]-1)}</span>${t1.map(([id,c])=>card(id,c,M.c1===id,meTop()<MCLS_LV[0],'ผ่านด่าน '+sname(MCLS_LV[0]-1))).join('')}</div>
      <div class="card"><b>อาชีพขั้น 2</b> <span class="sub">ปลดล็อกที่ด่าน ${sname(MCLS_LV[1]-1)} · เลือกสายแยกตามอาชีพขั้น 1</span>${M.c1?t2.map(([id,c])=>card(id,c,M.c2===id,meTop()<MCLS_LV[1],'ผ่านด่าน '+sname(MCLS_LV[1]-1))).join(''):'<div class="sub" style="margin-top:6px">เลือกอาชีพขั้น 1 ก่อน</div>'}</div>
      <div class="sub" style="text-align:center">เลือกครั้งแรกฟรี · เปลี่ยนอาชีพภายหลังใช้ 💎 200</div>`;}
  else h=`<div class="card" style="text-align:center"><div class="sub">ชุดเป็นของแต่ง ไม่เพิ่มพลัง · ปลดล็อกแล้ว ${AVO.filter(x=>x.ok()).length}/4 ชุด</div><button class="btn gold" data-avopen="1" style="margin-top:8px">เปิดตู้เสื้อผ้า</button></div>`;
  $('mePad').innerHTML=`<div class="mehead"><div class="meart"><img src="${IMG['av_'+k]}" alt=""></div><div class="meinfo"><b class="dunnm">${esc(S.pname)}</b>${T?`<div><span class="ttl ${T.c}">${T.n}</span></div>`:''}
    <div class="mecl">${meClsIc()} ${meClsName()}</div><div class="sub">👗 ${AVO[+k[1]-1].n}</div><div class="sub">แต้มสถานะ ${meUsed()}/${mePts()}</div></div></div>${tabs}${h}`;}
document.addEventListener('click',e=>{const b=e.target.closest('[data-meact]');if(!b)return;const a=b.dataset.meact,M=meState();
  if(a==='tab')meTab=b.dataset.v;
  else if(a==='add'){const n=Math.min(meFree(),+b.dataset.n);if(n<1)return;M[b.dataset.v]+=n;save();}
  else if(a==='auto'){const f=meFree();if(!f)return;const r=S.form.filter(Boolean).map(k=>HEROES[k].rl),ph=r.filter(x=>x==='knight'||x==='ranger').length,mg=r.length-ph;
    const w={str:ph*2,int:mg*2,vit:2,agi:1.5},tot=Object.values(w).reduce((a,b)=>a+b,0);let left=f;const ks=Object.keys(w);ks.forEach((k,i)=>{const n=i===ks.length-1?left:Math.floor(f*w[k]/tot);M[k]+=n;left-=n;});save();toast('กระจายแต้มตามทีมปัจจุบันแล้ว');}
  else if(a==='reset'){if(S.gems<100){toast('คริสตัลไม่พอ');return;}S.gems-=100;M.str=M.int=M.vit=M.agi=0;save();toast('รีเซ็ตแต้มสถานะแล้ว');}
  else if(a==='cls'){const id=b.dataset.v,C=MCLS[id];if(!C)return;const lv=MCLS_LV[C.t-1];if(meTop()<lv){toast('อาชีพนี้ปลดล็อกที่ด่าน '+sname(lv-1));return;}
    const slot=C.t===1?'c1':'c2';if(M[slot]===id)return;const paid=!!M[slot];if(paid&&S.gems<200){toast('เปลี่ยนอาชีพต้องใช้ 💎 200');return;}if(paid)S.gems-=200;
    M[slot]=id;if(C.t===1&&M.c2&&MCLS[M.c2].p!==id)M.c2='';save();toast(`${C.ic} เปลี่ยนอาชีพเป็น${C.n}แล้ว`);if(typeof hNameTag==='function')hNameTag();}
  renderMe();hud();});
