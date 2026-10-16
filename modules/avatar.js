// ===================== PLAYER AVATAR · WARDROBE =====================
const AVO=[
 {o:1,n:'นักผจญภัย',d:'ชุดเริ่มต้นของนักเดินทาง ผ้าพันคอเขียวกับเข็มกลัดเข็มทิศ',req:'มีตั้งแต่เริ่มเกม',ok:()=>true},
 {o:2,n:'ผู้ครองเมือง',d:'ชุดน้ำเงิน–ครีม–ทอง พร้อมมงกุฎและผ้าคลุม สำหรับเจ้าเมือง',req:'ปลดล็อกอาณาจักร (ผ่านด่าน '+sname(UNLK.kingdom.lv-1)+')',ok:()=>modeOpen('kingdom')},
 {o:3,n:'แม่ทัพ',d:'เกราะเงินขอบทองกับผ้าคลุมกองทัพ',req:'ชนะศึกแม่ทัพ 1 ครั้ง',ok:()=>{try{return modeOpen('gen')&&gbState().beat>=1;}catch(e){return false;}}},
 {o:4,n:'ดาราจักร',d:'ผ้าคลุมกลุ่มดาวและมงกุฎผลึก ชุดหายากที่สุด',req:'เกิดใหม่ 1 ครั้ง หรือได้ฉายาจากบอสโลก',ok:()=>((S.pr&&S.pr.n)||0)>=1||(typeof titleOwned==='function'&&(titleOwned('wbslay')||titleOwned('wbtop')))},
];
const AVF={m1:[273,103],m2:[318,103],m3:[320,95],m4:[376,149],f1:[225,90],f2:[357,129],f3:[394,155],f4:[387,130]};
function avState(){if(!S.av)S.av={g:'',o:1};return S.av;}
function avKey(){const A=avState();return (A.g||'m')+(AVO[A.o-1]&&AVO[A.o-1].ok()?A.o:1);}
function avOk(k){return typeof k==='string'&&/^[mf][1-4]$/.test(k);}
function avFace(k){if(!avOk(k))return faceStyle('knight');const [w,cx]=AVF[k],d=150,cy=100,px=(cx/d-.5)/(w/d-1),py=(cy/d-.5)/(620/d-1);return `background-image:url(${IMG['av_'+k]});background-size:${(w/d*100).toFixed(1)}% auto;background-position:${(px*100).toFixed(1)}% ${(py*100).toFixed(1)}%;background-color:#e8dcc0`;}
function myFace(){return avFace(avKey());}
function avMini(k){return avOk(k)?`<span class="avmini" style="${avFace(k)}"></span>`:'';}
function avRefresh(){const a=$('ava');if(a){const c=a.className;a.setAttribute('style',myFace());a.className=c;}const h=$('hAv');if(h)h.innerHTML=avHomeHtml();}
function avHomeHtml(){const k=avKey(),T=S.dun&&S.dun.title&&DUNT[S.dun.title];return `<img src="${IMG['av_'+k]}" alt="อวาตาร์ของคุณ"><div class="havn"><b>${esc(S.pname)}</b>${T?`<span class="ttl ${T.c}">${T.n}</span>`:''}<small>👗 ${AVO[+k[1]-1].n}</small></div>`;}
let avPick=null;
function renderWardrobe(first){const A=avState();if(!avPick)avPick={g:A.g||'m',o:A.o||1};const g=avPick.g,P=AVO[avPick.o-1],own=P.ok(),n=AVO.filter(x=>x.ok()).length;
  modal(`<div class="mbox avbox"><div class="mtitle">${first?'เลือกตัวละครของคุณ':'👗 ตู้เสื้อผ้า'}</div><div class="mbody">
    ${first?'<div class="sub" style="text-align:center">ตัวละครนี้คือตัวคุณเอง แยกจากฮีโร่ในทีม จะแสดงที่หน้าเมือง รูปโปรไฟล์ และอันดับ PvP</div>':`<div class="sub" style="text-align:center">ปลดล็อกแล้ว ${n}/4 ชุด · เปลี่ยนชุดได้ฟรีตลอด</div>`}
    <div class="avg">${[['m','🙋‍♂️ ชาย'],['f','🙋‍♀️ หญิง']].map(([k,t])=>`<button class="mtab ${g===k?'on':''}" data-avact="g" data-v="${k}">${t}</button>`).join('')}</div>
    <div class="avstage ${own?'':'lock'}"><img src="${IMG['av_'+g+P.o]}" alt="${P.n}"><div class="avcap"><b>${P.n}</b><span>${P.d}</span>${own?'':`<em>🔒 ${P.req}</em>`}</div></div>
    <div class="avlist">${AVO.map(x=>`<button class="avc ${x.o===avPick.o?'on':''} ${x.ok()?'':'lock'}" data-avact="o" data-v="${x.o}" aria-label="${x.n}"><img src="${IMG['av_'+g+x.o]}" alt=""><span>${x.ok()?'':'🔒 '}${x.n}</span></button>`).join('')}</div>
    <button class="btn gold" data-avact="wear" ${own?'':'disabled'}>${own?(first?'เริ่มด้วยตัวนี้':(A.g===g&&A.o===P.o?'สวมอยู่แล้ว':'สวมชุดนี้')):'ยังไม่ปลดล็อก'}</button>
    ${first?'':'<button class="btn sm" data-act="close" style="background:var(--parch3);color:var(--ink);box-shadow:none">ปิด</button>'}</div></div>`);}
document.addEventListener('click',e=>{const b=e.target.closest('[data-avact]');if(!b)return;const a=b.dataset.avact,first=!avState().g;
  if(a==='g')avPick.g=b.dataset.v;else if(a==='o')avPick.o=+b.dataset.v;
  else if(a==='wear'){if(!AVO[avPick.o-1].ok())return;S.av={g:avPick.g,o:avPick.o};save();avRefresh();avPick=null;closeModal(false);toast(`สวมชุด${AVO[S.av.o-1].n}แล้ว`);if(typeof pushArena==='function')pushArena();return;}
  renderWardrobe(first);});
$('ava').addEventListener('click',()=>{avPick=null;renderWardrobe(!avState().g);});$('ava').setAttribute('role','button');$('ava').setAttribute('aria-label','ตู้เสื้อผ้า');
let avSeenOk=null;
setInterval(()=>{const n=AVO.filter(x=>x.ok()).map(x=>x.o).join('');if(avSeenOk===null){avSeenOk=S.avOk||n;}if(n!==avSeenOk&&n.length>avSeenOk.length){const nw=AVO.find(x=>x.ok()&&!avSeenOk.includes(x.o));avSeenOk=n;S.avOk=n;save();if(nw)toast(`👗 ปลดล็อกชุด${nw.n}! แตะรูปโปรไฟล์เพื่อเปลี่ยนชุด`);}
  if(screen==='home'&&!avState().g&&!$('modalRoot').innerHTML){avPick=null;renderWardrobe(true);}},1500);
