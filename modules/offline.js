// ===================== OFFLINE PLAYERS (view-only visitors) =====================
const isOnline=()=>!!(DB&&myId&&canPost&&cloudOk!==false);
let COMM=null;(async()=>{try{if(window.claude&&claude.use)COMM=await claude.use('comments');}catch(e){}})();
function offNote(force){if(isOnline()&&!force)return;if($('modalRoot').innerHTML)return;
  modal(`<div class="mbox"><div class="mtitle">📴 เล่นแบบออฟไลน์</div><div class="mbody">
    <div class="sub">บัญชีนี้ยังไม่มีสิทธิ์บันทึกข้อมูลออนไลน์ของเกมนี้ เล่นได้ทุกโหมดตามปกติ แต่:</div>
    <div class="unlhow"><div><b>1</b>เซฟอยู่ในเบราว์เซอร์เครื่องนี้เท่านั้น ล้างข้อมูลเบราว์เซอร์หรือเปลี่ยนเครื่องแล้วเซฟหาย</div>
    <div><b>2</b>อ่านแชทโลกได้ แต่ส่งข้อความไม่ได้</div><div><b>3</b>สู้ PvP และตีบอสโลกได้ แต่ไม่ถูกนับในอันดับรวมของทุกคน</div></div>
    <div class="hint">คัดลอกรหัสเซฟเก็บไว้เป็นระยะ ใช้โหลดกลับได้ที่ ตั้งค่า → วางรหัสเซฟ · อยากเล่นออนไลน์ ให้ผู้สร้างเกมเพิ่มคุณเป็น Contributor</div>
    <textarea id="offTx" readonly style="width:100%;height:56px;font-size:10px" hidden></textarea>
    <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn gold" data-oact="copy">📋 คัดลอกรหัสเซฟ</button><button class="btn sm" data-act="close">เข้าใจแล้ว</button></div></div></div>`);}
function copySave(){const c=saveCode(),ta=$('offTx'),fb=()=>{if(ta){ta.hidden=false;ta.value=c;ta.select();}toast('เลือกรหัสแล้ว กดคัดลอกเอง');};
  try{navigator.clipboard.writeText(c).then(()=>{S.offCopied=Date.now();save();toast('คัดลอกรหัสเซฟแล้ว เก็บไว้ในโน้ตหรือแชทของตัวเอง');},fb);}catch(e){fb();}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-oact]');if(!b)return;const a=b.dataset.oact;
  if(a==='copy')copySave();
  else if(a==='note')offNote(true);
  else if(a==='comment'){if(!COMM){toast('หน้านี้ส่งคอมเมนต์ไม่ได้');return;}const el=$('fbCard');const x=($('fbTx')&&$('fbTx').value||'').trim();
    if(x&&navigator.clipboard)try{navigator.clipboard.writeText(`[${(FBCAT.find(c=>c[0]===fbCat)||FBCAT[0])[2]}] ${x} (ด่าน ${sname(Math.max(0,S.best-1))})`);}catch(e){}
    COMM.openComposer({element:el}).then(r=>{if(r&&r.opened)toast(x?'คัดลอกข้อความแล้ว วางในช่องคอมเมนต์ได้เลย':'พิมพ์ความเห็นในช่องคอมเมนต์ได้เลย');else toast('แตะในหน้าเกมก่อน แล้วกดอีกครั้ง');}).catch(()=>{toast('ส่งคอมเมนต์ไม่ได้ในบัญชีนี้');COMM=null;renderFb();});}});
setTimeout(()=>{if(!isOnline()&&S.offSeen!==dayNo()){S.offSeen=dayNo();save();offNote();}},6000);
