// ===================== MOVED NOTICE (claude.ai build only) =====================
const NEWSITE='https://niasmin.github.io/aether-trail/';
function moveNote(){if(window.SB_STATUS)return;modal(`<div class="mbox"><div class="mtitle">🏰 เกมย้ายบ้านแล้ว!</div><div class="mbody">
  <div class="hint" style="text-align:center">Aether Trail ย้ายไปเล่นที่เว็บใหม่ <b>niasmin.github.io/aether-trail</b><br>เปิดได้ทุกเครื่อง ไม่ต้องล็อกอิน claude.ai · ผู้เล่นทุกคนอยู่เมืองเดียวกัน แชท PvP บอสโลก</div>
  <div class="sub"><b>ย้ายเซฟของคุณ:</b> 1) กดคัดลอกรหัสเซฟด้านล่าง 2) เปิดเว็บใหม่ 3) ตั้งค่า → นำเข้าเซฟ → วางรหัส 4) ผูกอีเมลในหน้าตั้งค่าเพื่อเก็บเซฟถาวร</div>
  <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn sm" data-act="exportSave">📋 คัดลอกรหัสเซฟ</button><a class="btn gold" href="${NEWSITE}" target="_blank" rel="noopener" style="text-decoration:none">ไปเว็บใหม่ ›</a></div>
  <textarea id="impTx" readonly style="width:100%;height:46px;font-size:10px;opacity:.7"></textarea>
  <button class="btn sm" data-act="close" style="background:var(--parch3);color:var(--ink);box-shadow:none">ไว้ทีหลัง</button></div></div>`);}
setTimeout(()=>{if(window.SB_STATUS)return;const tp=document.querySelector('.htop');if(tp&&!$('mvChip')){tp.insertAdjacentHTML('beforeend',`<button id="mvChip" class="mvchip" data-mvnote="1">🏰 เกมย้ายไปเว็บใหม่แล้ว ›</button>`);}
  if(S.mvSeen!==dayNo()&&!$('modalRoot').innerHTML){S.mvSeen=dayNo();save();moveNote();}},5000);
setInterval(()=>{if(window.SB_STATUS)return;const tp=document.querySelector('.htop');if(tp&&!$('mvChip'))tp.insertAdjacentHTML('beforeend',`<button id="mvChip" class="mvchip" data-mvnote="1">🏰 เกมย้ายไปเว็บใหม่แล้ว ›</button>`);},3000);
document.addEventListener('click',e=>{if(e.target.closest('[data-mvnote]'))moveNote();});
