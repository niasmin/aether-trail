// ===================== FEEDBACK · PLAYER STATS · OWNER PANEL =====================
const FBCAT=[['bug','🐞','เจอบั๊ก'],['stuck','🧱','ติดตรงนี้'],['like','❤️','ชอบตรงนี้'],['want','💡','อยากให้มี']];
let fbCat='like',fbBusy=false,ownTab='fb',ownFb=null,ownPs=null;
function renderFb(){$('fbPad').innerHTML=`<div class="card"><b>ส่งความเห็นถึงผู้สร้างเกม</b><div class="sub">เล่าได้เลยว่าติดตรงไหน เบื่อตรงไหน หรือชอบอะไร ผู้สร้างเกมอ่านทุกข้อความ (เกมแนบด่าน เลเวล และหน้าที่เปิดอยู่ไปด้วยอัตโนมัติ)</div>
    <div class="fbcats">${FBCAT.map(([k,i,n])=>`<button class="mtab ${fbCat===k?'on':''}" data-fact="cat" data-v="${k}">${i} ${n}</button>`).join('')}</div>
    <textarea id="fbTx" maxlength="500" placeholder="พิมพ์ได้สูงสุด 500 ตัวอักษร" style="width:100%;min-height:110px;margin-top:8px"></textarea>
    <button class="btn gold" data-fact="send" style="width:100%;margin-top:8px" ${!DB||!myId?'disabled':''}>${!DB||!myId?'ต้องเปิดผ่าน claude.ai และเข้าสู่ระบบ':'ส่งความเห็น'}</button></div>
  ${(S.fbSent||[]).length?`<div class="card"><b>ที่ส่งไปแล้ว</b>${S.fbSent.slice(-5).reverse().map(f=>`<div class="sub">${new Date(f.t).toLocaleDateString('th-TH')} · ${(FBCAT.find(c=>c[0]===f.cat)||FBCAT[0])[1]} ${esc(f.x.slice(0,60))}</div>`).join('')}</div>`:''}`;}
async function sendFb(){if(fbBusy||!DB||!myId)return;const x=($('fbTx').value||'').trim().slice(0,500);if(x.length<2){toast('พิมพ์ความเห็นก่อน');return;}fbBusy=true;
  const it={t:Date.now(),cat:fbCat,x,best:S.best,lv:teamLv(),pw:Math.round(teamPower()),scr:lastScr||'battle'};
  try{const ref=DB.doc('feedback/'+myId);let prev=[];try{const d=await ref.get();if(d.exists&&Array.isArray(d.data().items))prev=d.data().items;}catch(e){}
    await ref.set({name:S.pname.slice(0,16),items:prev.concat([it]).slice(-30),t:Date.now()});S.fbSent=(S.fbSent||[]).concat([{t:it.t,cat:it.cat,x}]).slice(-20);save();toast('ส่งแล้ว ขอบคุณมาก!');renderFb();}
  catch(e){toast('ส่งไม่สำเร็จ บัญชีนี้อาจยังไม่มีสิทธิ์ส่ง');}fbBusy=false;}
let lastScr='battle';
function pstatTrack(sc){if(!S.ms)S.ms={};S.ms[sc]=(S.ms[sc]||0)+1;if(sc!=='feedback')lastScr=sc;}
let pstatAt=0;
async function pushPstat(force){if(!DB||!myId)return;if(!force&&Date.now()-pstatAt<180000)return;pstatAt=Date.now();const days=S.dayList||[];
  try{await DB.doc('pstat/'+myId).set({name:S.pname.slice(0,16),best:S.best,lv:teamLv(),pw:Math.round(teamPower()),rb:(S.pr&&S.pr.n)||0,heroes:OWNED().length,modes:S.ms||{},days:days.length,first:S.firstSeen||Date.now(),last:Date.now(),ti:(S.dun&&S.dun.title)||''});}catch(e){}}
function dayTrack(){if(!S.firstSeen)S.firstSeen=Date.now();if(!S.dayList)S.dayList=[];const d=dayNo();if(!S.dayList.includes(d)){S.dayList.push(d);S.dayList=S.dayList.slice(-60);}}
async function loadOwner(){if(!DB||!isOwner)return;try{const [a,b]=await Promise.all([DB.collection('feedback').limit(200).get(),DB.collection('pstat').limit(300).get()]);
  ownFb=[];a.docs.forEach(d=>{const v=d.data();(Array.isArray(v.items)?v.items:[]).forEach(it=>ownFb.push({id:d.id,name:String(v.name||'?').slice(0,16),...it}));});ownFb.sort((x,y)=>y.t-x.t);
  ownPs=b.docs.map(d=>({id:d.id,...d.data()})).sort((x,y)=>(y.last||0)-(x.last||0));}catch(e){ownFb=ownFb||[];ownPs=ownPs||[];}if(screen==='owner')renderOwner();}
const MODEN={battle:'ต่อสู้',party:'ทีม',hero:'ฮีโร่',map:'แผนที่',modes:'โหมด',summon:'อัญเชิญ',tower:'หอคอย',arena:'PvP',dboss:'บอสประจำวัน',expe:'สำรวจ',kingdom:'อาณาจักร',pet:'สัตว์คู่หู',gen:'ศึกแม่ทัพ',craft:'ช่างฝีมือ',dun:'ดันเจี้ยน',wboss:'บอสโลก',coll:'ห้องสะสม',rebirth:'เกิดใหม่',shop:'ร้านค้า',chat:'แชท'};
function renderOwner(){if(!isOwner){$('ownPad').innerHTML='<div class="sub">เฉพาะผู้สร้างเกม</div>';return;}if(ownFb===null)loadOwner();
  const tabs=`<div class="mtabs">${[['fb','💌 ความเห็น'],['ps','👥 ผู้เล่น'],['tools','🛠️ เครื่องมือ']].map(([k,n])=>`<button class="mtab ${ownTab===k?'on':''}" data-fact="otab" data-v="${k}">${n}</button>`).join('')}<button class="mtab" data-fact="reload">↻</button></div>`;
  let h='';
  if(ownTab==='fb')h=ownFb===null?'<div class="sub">กำลังโหลด…</div>':ownFb.length?ownFb.map(f=>`<div class="card fbi"><div class="sub">${(FBCAT.find(c=>c[0]===f.cat)||FBCAT[0])[1]} <b>${esc(f.name)}</b> · ${new Date(f.t).toLocaleString('th-TH',{dateStyle:'short',timeStyle:'short'})} · ด่าน ${sname(Math.max(0,(f.best||1)-1))} · Lv.${f.lv||'?'} · หน้า ${esc(MODEN[f.scr]||f.scr||'')}</div><div>${esc(f.x)}</div></div>`).join(''):'<div class="sub" style="text-align:center">ยังไม่มีความเห็น</div>';
  else if(ownTab==='ps'){if(ownPs===null)h='<div class="sub">กำลังโหลด…</div>';else{const now=Date.now();
    const tot={};ownPs.forEach(p=>{for(const k in (p.modes||{}))tot[k]=(tot[k]||0)+(+p.modes[k]||0);});const top=Object.entries(tot).sort((a,b)=>b[1]-a[1]).slice(0,8);
    h=`<div class="card"><b>ผู้เล่น ${ownPs.length} คน</b> <span class="sub">เล่นใน 24 ชม. ${ownPs.filter(p=>now-(p.last||0)<864e5).length} คน</span>
      <div class="sub" style="margin-top:4px">หน้าที่เปิดบ่อย: ${top.map(([k,v])=>`${esc(MODEN[k]||k)} ${v}`).join(' · ')||'–'}</div></div>
    ${ownPs.map(p=>`<div class="card psr"><div style="flex:1;min-width:0"><b>${esc(String(p.name||'?'))}</b>${ttlHtml(p.ti)}<div class="sub">ด่าน ${sname(Math.max(0,(+p.best||1)-1))} · Lv.${+p.lv||1} · พลัง ${kf(+p.pw||0)} · ฮีโร่ ${+p.heroes||0} · เกิดใหม่ ${+p.rb||0}</div>
      <div class="sub">เล่น ${+p.days||1} วัน · ล่าสุด ${fmtAgo(now-(+p.last||0))}</div></div></div>`).join('')}`;}}
  else h=`<div class="card"><b>🎁 โค้ด</b><div class="sub">สร้าง ลบ และจำกัดจำนวนคนใช้โค้ด</div><button class="btn sm" data-go="code" style="margin-top:6px">ไปหน้าเติมโค้ด</button></div>
    <div class="card"><b>💬 แชทโลก</b><div class="sub">ผู้สร้างเกมกดปุ่ม "ลบ" ข้างข้อความของใครก็ได้ในแชทโลก</div><button class="btn sm" data-go="chat" style="margin-top:6px">ไปแชทโลก</button></div>
    <div class="card"><b>🔗 ชวนเพื่อน</b><div class="sub">ส่งลิงก์เกมพร้อมโค้ด <b>AETHERFRIENDS</b> (10 ตั๋วดาว 300 คริสตัล 20,000 ทอง · ใช้ได้ 50 คน) · เพื่อนต้องเข้าสู่ระบบ claude.ai และได้สิทธิ์ Contributor จากปุ่ม Share ถึงจะใช้แชท PvP บอสโลก และบันทึกบนคลาวด์ได้</div></div>`;
  $('ownPad').innerHTML=tabs+h;}
const fmtAgo=ms=>ms<36e5?Math.max(1,Math.round(ms/6e4))+' นาทีที่แล้ว':ms<864e5?Math.round(ms/36e5)+' ชม.ที่แล้ว':Math.round(ms/864e5)+' วันที่แล้ว';
document.addEventListener('click',e=>{const b=e.target.closest('[data-fact]');if(!b)return;const a=b.dataset.fact;
  if(a==='cat'){fbCat=b.dataset.v;const tx=$('fbTx').value;renderFb();$('fbTx').value=tx;}else if(a==='send')sendFb();
  else if(a==='otab'){ownTab=b.dataset.v;renderOwner();}else if(a==='reload'){ownFb=null;ownPs=null;renderOwner();}});
// code usage limits: each redeemer records own codes in codeuse/<id>
async function codeUses(code){if(!DB)return 0;try{const s=await DB.collection('codeuse').where('codes','array-contains',code).limit(1000).get();return s.docs.length;}catch(e){return 0;}}
async function codeUseMark(code){if(!DB||!myId)return;try{await DB.doc('codeuse/'+myId).set({codes:S.redeemed.slice(-200),t:Date.now()});}catch(e){}}
