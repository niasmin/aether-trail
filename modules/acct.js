// ===================== ACCOUNT (Supabase build only) =====================
const _rsAcct=renderSettings;renderSettings=function(){_rsAcct();if(!window.SB_STATUS)return;const st=SB_STATUS(),pad=$('setPad');if(!pad)return;
  pad.insertAdjacentHTML('afterbegin',`<div class="card acct"><b>🔐 บัญชีของคุณ</b>
    ${!st.ok?`<div class="sub" style="color:#b5462a">เชื่อมต่อระบบออนไลน์ไม่ได้ (${esc(st.err||'')}) · เล่นต่อได้ แต่เซฟอยู่แค่ในเครื่องนี้</div>`
    :st.anon?`<div class="sub">ตอนนี้เป็น<b>บัญชีผู้เยี่ยมชม</b> เซฟบนคลาวด์ผูกกับเบราว์เซอร์นี้ · ผูกอีเมลไว้เพื่อเล่นต่อบนเครื่องอื่นและกันเซฟหาย</div>
      <div class="acrow"><input id="acEmail" type="email" placeholder="อีเมลของคุณ" autocomplete="email"><button class="btn gold sm" data-acct="link">ผูกอีเมล</button></div>
      <details style="margin-top:6px"><summary class="sub">เคยผูกอีเมลไว้แล้ว? เข้าสู่ระบบบนเครื่องนี้</summary><div class="acrow"><input id="acEmail2" type="email" placeholder="อีเมลที่ผูกไว้"><button class="btn sm" data-acct="login">ส่งลิงก์เข้าสู่ระบบ</button></div>
      <div class="sub">เข้าสู่ระบบแล้ว เซฟของบัญชีนั้นจะมาแทนเซฟผู้เยี่ยมชมบนเครื่องนี้</div></details>`
    :`<div class="sub">✅ ผูกอีเมลแล้ว: <b>${esc(st.email)}</b> · เปิดเกมบนเครื่องอื่นแล้วเข้าสู่ระบบด้วยอีเมลนี้ได้</div>
      <button class="btn sm" data-acct="out" style="margin-top:6px;background:var(--parch3);color:var(--ink);box-shadow:none">ออกจากระบบ</button>`}
    <div class="sub" id="acMsg"></div></div>`);};
document.addEventListener('click',async e=>{const b=e.target.closest('[data-acct]');if(!b||!window.SB_STATUS)return;const a=b.dataset.acct,msg=t=>{const m=$('acMsg');if(m)m.textContent=t;};
  if(a==='link'||a==='login'){const v=(($(a==='link'?'acEmail':'acEmail2')||{}).value||'').trim();if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)){msg('กรอกอีเมลให้ถูกต้อง');return;}
    b.disabled=true;cloudPush&&cloudPush(true);const err=await (a==='link'?SB_LINK(v):SB_LOGIN(v));b.disabled=false;
    msg(err?('ไม่สำเร็จ: '+err):(a==='link'?'ส่งลิงก์ยืนยันไปที่ '+v+' แล้ว กดลิงก์ในอีเมลเพื่อผูกบัญชี (เช็กโฟลเดอร์สแปมด้วย)':'ส่งลิงก์เข้าสู่ระบบไปที่ '+v+' แล้ว เปิดลิงก์ในเบราว์เซอร์นี้'));}
  else if(a==='out'){await cloudPush(true);try{await window.SBC.auth.signOut();}catch(err){}try{localStorage.removeItem(SAVE);}catch(err){}location.reload();}});
