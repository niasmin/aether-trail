// ===================== AVATAR JOINS BATTLE (6th, untargetable support) =====================
const AVSK={sword:['ดาบพิฆาตเข็มทิศ','#ffe9a8'],mage:['ดาวตกเข็มทิศ','#ffd86b'],archer:['ฝนศรดารา','#c8ff9a'],guard:['ปราการเข็มทิศ','#8fd3ff'],'':['ประกายเข็มทิศ','#9ff3ff']};
function avBRoot(){const M=meState();return MCLS[M.c1]?M.c1:'';}
function avBImg(p){const k=avKey();return k[1]==='1'&&IMG['ap_'+k[0]+'_'+p]?IMG['ap_'+k[0]+'_'+p]:IMG['av_'+k];}
function avBPose(p,ms){if(!B||!B.avEl)return;const im=B.avEl.querySelector('img');if(!im)return;const src=avBImg(p);if(im.getAttribute('src')!==src)im.setAttribute('src',src);
  B.avEl.classList.toggle('flipL',p==='strike'||p==='ready');clearTimeout(B.avPT);if(ms)B.avPT=setTimeout(()=>avBPose(B&&B.over?'win':'ready'),ms/speed);}
function avBPlace(){if(!B||!B.avEl)return;const el=B.avEl;
  if(v3Want()&&V3.R&&stage.classList.contains('v3')){const [x,y]=v3Proj(0,0,1.55),[,yt]=v3Proj(0,1.75,1.55);el.style.left=x+'px';el.style.top=y+'px';el.style.height=Math.max(40,y-yt)+'px';}
  else{const [x,y]=px([30,76]);el.style.left=x+'px';el.style.top=y+'px';el.style.height=(SH*.24)+'px';}}
function avBSrc(){const hs=alive(B.heroes);const avg=hs.length?hs.reduce((s,h)=>s+h.atk,0)/hs.length:1,M=meState(),pts=M.str+M.int+M.vit+M.agi,r=avBRoot();
  return {atk:avg*(.55+pts*.004),crit:10+M.agi*.1,rl:r==='mage'?'mage':'avatar',dealt:0};}
function avBTick(dt){if(!B||B.pvp||B.over||!avState().g)return;
  if(!B.avEl||!B.avEl.isConnected){const d=document.createElement('div');d.className='avu';d.innerHTML=`<img alt="" src="${avBImg('ready')}"><b>${meClsIc()} ${esc(S.pname)}</b>`;unitsEl.appendChild(d);B.avEl=d;B.avA=1.2;B.avS=6;avBPose('ready');}
  avBPlace();const en=alive(B.en);if(!en.length)return;B.avA-=dt;B.avS-=dt;const r=avBRoot(),[nm,col]=AVSK[r]||AVSK[''];
  const me={cx:parseFloat(B.avEl.style.left),cy:parseFloat(B.avEl.style.top)-B.avEl.clientHeight*.55};
  if(B.avS<=0){B.avS=9;avBPose('cast',700);dmgNum(me,nm,'sk');burst(me.cx,me.cy,50,col,600);const src=avBSrc();
    en.forEach((t,i)=>setTimeout(()=>{if(!t.alive||!B||B.over)return;burst(t.cx,t.cy,55,col,500);dealTo(t,r==='guard'?1.2:1.6,src);},(200+i*90)/speed));
    if(r==='guard')alive(B.heroes).forEach(h=>{h.shield=(h.shield||0)+Math.round(h.max*.06);});return;}
  if(B.avA<=0){B.avA=2.2;const front=en.slice().sort((a,b)=>a.pos[0]-b.pos[0])[0];avBPose('strike',380);
    setTimeout(()=>{if(!front.alive||!B||B.over)return;slash(front,col);dealTo(front,1,avBSrc());},140/speed);}}
const _petTickAv=petTick;petTick=function(dt){_petTickAv(dt);try{avBTick(dt);}catch(e){}};
const _hurtAv=hurt;hurt=function(h,e,mult){_hurtAv(h,e,mult);if(B&&B.avEl&&Math.random()<.08)avBPose('hit',300);};
const _ewAv=endWave;endWave=function(win,why){const had=B&&B.avEl;_ewAv(win,why);if(had&&win){clearTimeout(B&&B.avPT);const im=had.querySelector('img');if(im)im.setAttribute('src',avBImg('win'));had.classList.remove('flipL');had.classList.add('avwin');}};
