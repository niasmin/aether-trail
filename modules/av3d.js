// ===================== AVATAR 3D MODEL IN BATTLE (experimental, opt-in) =====================
const AV3COS=['traveler','sovereign','commander','celestial'];
const AV3={ld:null,cache:{},obj:null,key:'',mix:null,acts:{},cur:'',last:0,loading:''};
const av3On=()=>S.set.av3d===true&&window.THREE&&V3&&V3.ok&&V3.scene;
function av3Loader(){if(AV3.ld)return AV3.ld;AV3.ld=new Promise((res,rej)=>{if(THREE.GLTFLoader){res(new THREE.GLTFLoader());return;}
  const sc=document.createElement('script');sc.src='https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';sc.onload=()=>THREE.GLTFLoader?res(new THREE.GLTFLoader()):rej('no loader');sc.onerror=()=>rej('load fail');document.head.appendChild(sc);});return AV3.ld;}
function av3Key(){const k=avKey();return 'avatar_'+(k[0]==='f'?'female':'male')+'_'+AV3COS[+k[1]-1];}
function av3Ensure(){if(!av3On())return null;const key=av3Key();if(AV3.key===key&&AV3.obj)return AV3.obj;if(AV3.loading===key)return null;AV3.loading=key;
  av3Loader().then(L=>L.load('assets/3d/'+key+'.glb',g=>{AV3.loading='';if(AV3.obj){V3.scene.remove(AV3.obj);}const o=g.scene;o.scale.setScalar(.92);o.traverse(m=>{if(m.isMesh){m.castShadow=true;m.frustumCulled=false;}});
    AV3.obj=o;AV3.key=key;AV3.mix=new THREE.AnimationMixer(o);AV3.acts={};g.animations.forEach(c=>{AV3.acts[c.name]=AV3.mix.clipAction(c);});AV3.cur='';
    AV3.mix.addEventListener('finished',e=>{const n=e.action&&e.action.getClip().name;if(n!=='Victory'&&n!=='Defeat')av3Play('Idle');});
    o.visible=false;V3.scene.add(o);av3Play('Idle');},undefined,()=>{AV3.loading='';toast('โหลดโมเดล 3 มิติไม่สำเร็จ ใช้ภาพวาดแทน');S.set.av3d=false;save();})).catch(()=>{AV3.loading='';});return null;}
function av3Play(n){const a=AV3.acts[n];if(!a||!AV3.mix)return;const prev=AV3.acts[AV3.cur];a.reset();const once=n!=='Idle'&&n!=='Walk'&&n!=='Run';a.setLoop(once?THREE.LoopOnce:THREE.LoopRepeat,once?1:Infinity);a.clampWhenFinished=once;
  if(prev&&prev!==a)a.crossFadeFrom(prev,.15,false);a.play();AV3.cur=n;}
const AV3MAP={ready:'Idle',strike:'Attack',cast:'Cast',hit:'Hit',win:'Victory'};
const _avBPose3=avBPose;avBPose=function(p,ms){_avBPose3(p,ms);if(AV3.obj&&AV3MAP[p]&&AV3.cur!==AV3MAP[p]){if(p!=='ready'||AV3.cur==='Victory'||!AV3.cur)av3Play(AV3MAP[p]);}};
function av3Frame(){const now=performance.now(),dt=Math.min(.1,(now-(AV3.last||now))/1000);AV3.last=now;const o=AV3.obj;
  const show=!!(av3On()&&o&&B&&B.avEl&&B.avEl.isConnected&&!B.pvp&&screen==='battle'&&stage.classList.contains('v3'));
  if(o){o.visible=show;if(show){o.position.set(0,0,1.55);o.rotation.y=Math.PI*.82;AV3.mix&&AV3.mix.update(dt*Math.min(2,speed));}}
  if(B&&B.avEl)B.avEl.classList.toggle('m3d',show);}
const _avBPlace3=avBPlace;avBPlace=function(){_avBPlace3();if(S.set.av3d)av3Ensure();av3Frame();};
const _ewAv3=endWave;endWave=function(win,why){const had=B&&B.avEl;_ewAv3(win,why);if(had&&AV3.obj&&S.set.av3d)av3Play(win?'Victory':'Defeat');};
setInterval(()=>{if(AV3.obj&&(!B||!B.avEl||screen!=='battle'))AV3.obj.visible=false;},500);
const _rsAv3=renderSettings;renderSettings=function(){_rsAv3();const pad=$('setPad');if(!pad)return;const on=S.set.av3d===true;
  pad.insertAdjacentHTML('beforeend',`<div class="card"><b>🧊 อวาตาร์ 3 มิติ (ทดลอง)</b><div class="sub">ใช้โมเดล 3 มิติจริงของตัวละครคุณในสนามรบ 3 มิติ แทนภาพวาด · มีท่ายืน ฟัน ร่ายเวท โดนตี ฉลอง · ใช้เน็ตเพิ่มประมาณ 0.6MB ต่อชุด</div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px"><span class="sub">${on?'เปิดอยู่':'ปิดอยู่ (ใช้ภาพวาด)'}</span><button class="tg2 ${on?'on':''}" data-av3t="1" aria-pressed="${on}"><i></i></button></div></div>`);};
document.addEventListener('click',e=>{if(!e.target.closest('[data-av3t]'))return;S.set.av3d=!(S.set.av3d===true);save();if(!S.set.av3d&&AV3.obj)AV3.obj.visible=false;toast(S.set.av3d?'เปิดอวาตาร์ 3 มิติ · ดูได้ในสนามรบ 3 มิติ':'กลับไปใช้ภาพวาด');renderSettings();});
