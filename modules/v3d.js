// ===================== 3D BATTLEFIELD =====================
const V3={on:false,ok:false,R:null,scene:null,cam:null,list:[],tex:{},bdUrl:'',gKey:'',shake:0,zoom:0,zoomAt:null,cutT:0,pillars:[]};
const W3POS=new Map([
 [SLOTPOS[0],[-1.15,.7]],[SLOTPOS[1],[1.15,.7]],[SLOTPOS[2],[-2.35,2.3]],[SLOTPOS[3],[0,2.55]],[SLOTPOS[4],[2.35,2.3]],
 [ENPOS[0],[-1.8,-2.1]],[ENPOS[1],[0,-1.55]],[ENPOS[2],[1.8,-2.1]],
 [BOSSPOS[0],[0,-3.0]],[BOSSPOS[1],[-2.4,-1.45]],[BOSSPOS[2],[2.4,-1.45]],
 [PVPPOS[0],[-1.15,-1.45]],[PVPPOS[1],[1.15,-1.45]],[PVPPOS[2],[-2.35,-3.05]],[PVPPOS[3],[0,-3.3]],[PVPPOS[4],[2.35,-3.05]]]);
const v3Want=()=>V3.ok&&S.set.v3!==false;
function v3Init(){if(V3.R||!window.THREE)return;try{
  const T=THREE,R=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});R.setPixelRatio(Math.min(2,devicePixelRatio||1));
  R.domElement.className='c3d';stage.insertBefore(R.domElement,$('units'));
  const sc=new T.Scene();sc.background=new T.Color('#9fc9d8');sc.fog=new T.Fog('#9fc9d8',14,30);
  const cam=new T.PerspectiveCamera(40,1,.1,80);
  const floorTex=new T.CanvasTexture(document.createElement('canvas'));
  const floor=new T.Mesh(new T.PlaneGeometry(40,40),new T.MeshBasicMaterial({map:floorTex}));floor.rotation.x=-Math.PI/2;sc.add(floor);
  const bdTex=new T.Texture();const bd=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:bdTex,fog:false}));sc.add(bd);
  const arena=new T.Mesh(new T.RingGeometry(4.3,4.55,96),new T.MeshBasicMaterial({color:'#fff6d0',transparent:true,opacity:.35}));arena.rotation.x=-Math.PI/2;arena.position.set(0,.01,-.4);sc.add(arena);
  Object.assign(V3,{R,scene:sc,cam,floor,floorTex,bd,bdTex,arena,ok:true,glow:v3Glow(),shadow:v3Shadow(),beam:v3Beam()});
  requestAnimationFrame(v3Loop);}catch(e){V3.ok=false;console.warn('3D off',e);}}
function v3Canvas(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return c;}
function v3Glow(){return new THREE.CanvasTexture(v3Canvas(128,128,(g,w)=>{const r=g.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,'rgba(255,255,255,.9)');r.addColorStop(.45,'rgba(255,255,255,.35)');r.addColorStop(.62,'rgba(255,255,255,.9)');r.addColorStop(.7,'rgba(255,255,255,.15)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,128,128);}));}
function v3Shadow(){return new THREE.CanvasTexture(v3Canvas(64,64,(g)=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(0,0,0,.55)');r.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=r;g.fillRect(0,0,64,64);}));}
function v3Beam(){return new THREE.CanvasTexture(v3Canvas(4,128,(g)=>{const r=g.createLinearGradient(0,0,0,128);r.addColorStop(0,'rgba(255,255,255,0)');r.addColorStop(.6,'rgba(255,255,255,.55)');r.addColorStop(1,'rgba(255,255,255,1)');g.fillStyle=r;g.fillRect(0,0,4,128);}));}
function v3FloorPaint(G){const c=v3Canvas(1024,1024,(g,w,h)=>{
  g.fillStyle=G[0];g.fillRect(0,0,w,h);
  for(let i=0;i<900;i++){g.fillStyle=Math.random()<.5?G[1]:G[3];g.globalAlpha=Math.random()*.18;const s=4+Math.random()*26;g.beginPath();g.ellipse(Math.random()*w,Math.random()*h,s,s*.6,0,0,7);g.fill();}
  g.globalAlpha=1;const cx=w/2,cy=h*.51;const rg=g.createRadialGradient(cx,cy,0,cx,cy,w*.16);rg.addColorStop(0,G[2]);rg.addColorStop(1,G[2]+'00');g.fillStyle=rg;g.globalAlpha=.75;g.fillRect(0,0,w,h);
  g.globalAlpha=.55;g.strokeStyle=G[2];for(const [r,lw] of [[w*.11,10],[w*.085,4],[w*.035,6]]){g.lineWidth=lw;g.beginPath();g.arc(cx,cy,r,0,7);g.stroke();}
  g.lineWidth=3;for(let a=0;a<8;a++){const t=a*Math.PI/4;g.beginPath();g.moveTo(cx+Math.cos(t)*w*.035,cy+Math.sin(t)*w*.035);g.lineTo(cx+Math.cos(t)*w*.085,cy+Math.sin(t)*w*.085);g.stroke();}
  g.globalAlpha=1;const vg=g.createRadialGradient(cx,cy,w*.12,cx,cy,w*.5);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.35)');g.fillStyle=vg;g.fillRect(0,0,w,h);});
  V3.floorTex.image=c;V3.floorTex.anisotropy=4;V3.floorTex.needsUpdate=true;
  const sky=new THREE.Color(G[2]).lerp(new THREE.Color('#cfe6f0'),.5);V3.scene.background=sky;V3.scene.fog.color=new THREE.Color(G[0]).lerp(sky,.55);}
function v3Tex(src,filter,flip,cb){const key=src.slice(-40)+src.length+'|'+(filter||'')+'|'+(flip?1:0);const C=V3.tex[key];if(C){if(C.img)cb(C);else C.wait.push(cb);return;}
  const E=V3.tex[key]={wait:[cb]};const im=new Image();im.onload=()=>{let s=im;
    if((filter&&filter!=='none')||flip){s=v3Canvas(im.naturalWidth,im.naturalHeight,(g,w,h)=>{if(filter&&filter!=='none')g.filter=filter;if(flip){g.translate(w,0);g.scale(-1,1);}g.drawImage(im,0,0);});}
    const t=new THREE.Texture(s);t.needsUpdate=true;t.anisotropy=4;E.img=im;E.t=t;E.ar=im.naturalWidth/im.naturalHeight;E.wait.forEach(f=>f(E));E.wait=[];};im.src=src;}
function v3Add(u,img,pos,h,cls,filter,flip){if(!V3.ok)return;const w=W3POS.get(pos)||[0,0],hero=/\bhr\b/.test(cls),boss=/boss/.test(cls),card=/cardmode/.test(cls);
  const T=THREE,mat=new T.SpriteMaterial({transparent:true,depthWrite:false});const sp=new T.Sprite(mat);sp.center.set(.5,0);sp.visible=false;
  const H=card?1.35:h*9.2;
  const gm=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:V3.glow,color:hero?'#4fe3ff':boss?'#ffcf5a':'#ff6a4a',transparent:true,blending:T.AdditiveBlending,depthWrite:false}));gm.rotation.x=-Math.PI/2;
  const sh=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:V3.shadow,transparent:true,depthWrite:false}));sh.rotation.x=-Math.PI/2;
  const rs=boss?2.2:H*.75;gm.scale.set(rs,rs,1);sh.scale.set(rs*.8,rs*.45,1);gm.position.set(w[0],.02,w[1]);sh.position.set(w[0],.015,w[1]);
  V3.scene.add(sh);V3.scene.add(gm);V3.scene.add(sp);
  const e={u,sp,gm,sh,x:w[0],z:w[1],H,hero,boss,ph:Math.random()*6,ar:1,lu:0,fl:0,fade:1};V3.list.push(e);u.v3=e;
  v3Tex(img,filter,flip,E=>{mat.map=E.t;mat.needsUpdate=true;e.ar=E.ar;sp.visible=true;});}
function v3Proj(x,y,z){const v=new THREE.Vector3(x,y,z).project(V3.cam);return [(v.x+1)/2*SW,(1-v.y)/2*SH,v.z];}
function v3Place(u){const e=u.v3;if(!e)return;const x=e.cx3,z=e.cz3,[fx,fy]=v3Proj(x,0,z),[,hy]=v3Proj(x,e.H,z);const hp=Math.max(10,fy-hy);
  u.el.style.left=fx+'px';u.el.style.top=fy+'px';u.el.style.zIndex=Math.round(30+z*3);u.spr.style.height=hp+'px';u.cx=fx;u.top=fy-hp;u.cy=fy-hp*.5;}
function v3Cam(){const C=V3.cam,a=SW/SH;C.aspect=a;C.fov=a<.75?50:a<1.1?44:38;const back=a<.75?1.15:1;
  let tx=0,ty=.9,tz=-.6,px=0,py=6.4*back,pz=7.9*back;
  if(V3.zoom>0&&V3.zoomAt){const k=Math.sin(Math.min(1,V3.zoom/1.1)*Math.PI)*.35;tx+=V3.zoomAt[0]*k;tz+=(V3.zoomAt[1]+.6)*k;px+=V3.zoomAt[0]*k*.6;py-=1.4*k;pz-=1.8*k;}
  if(V3.shake>0){const s=V3.shake*.35;px+=rnd(-s,s);py+=rnd(-s,s);}
  C.position.set(px,py,pz);C.lookAt(tx,ty,tz);C.updateProjectionMatrix();}
function v3Size(){if(!V3.R)return;const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;if(V3.w!==w||V3.h!==h){V3.R.setSize(w,h,false);V3.w=w;V3.h=h;}}
let v3Last=0;
function v3Loop(t){requestAnimationFrame(v3Loop);const on=v3Want()&&screen==='battle';stage.classList.toggle('v3',on);if(!on)return;
  const dt=Math.min(.1,(t-(v3Last||t))/1000);v3Last=t;v3Size();
  const bdm=(($('bd').style.backgroundImage||'').match(/url\("?(.*?)"?\)$/)||[])[1]||'';
  if(bdm&&bdm!==V3.bdUrl){V3.bdUrl=bdm;const im=new Image();im.onload=()=>{V3.bdTex.image=im;V3.bdTex.needsUpdate=true;const ar=im.naturalWidth/im.naturalHeight,W=34,H=W/ar;V3.bd.scale.set(W,H,1);V3.bd.position.set(0,H/2-1.2,-15);};im.src=bdm;}
  const G=['--g0','--g1','--g2','--g3'].map(v=>(stage.style.getPropertyValue(v)||'').trim()||'#8fbf63');const gk=G.join();if(gk!==V3.gKey){V3.gKey=gk;v3FloorPaint(G);}
  V3.shake=Math.max(0,V3.shake-dt*1.8);V3.zoom=Math.max(0,V3.zoom-dt);v3Cam();
  V3.arena.material.opacity=.25+.1*Math.sin(t/600);
  V3.list=V3.list.filter(e=>{if(e.u.el.isConnected)return true;V3.scene.remove(e.sp,e.gm,e.sh);e.sp.material.dispose();e.gm.material.dispose();e.sh.material.dispose();return false;});
  for(const e of V3.list){const u=e.u;e.ph+=dt*3.6;e.lu=Math.max(0,e.lu-dt*speed);e.fl=Math.max(0,e.fl-dt);
    const dir=e.hero?-1:1,lk=e.lu>0?Math.sin((1-e.lu/.28)*Math.PI)*.55:0;e.cx3=e.x;e.cz3=e.z+dir*lk;
    const dead=u.el.classList.contains('dead'),down=u.el.classList.contains('down');e.fade+=((dead?0:down?.45:1)-e.fade)*Math.min(1,dt*6);
    const bob=1+Math.sin(e.ph)*.025,shk=e.fl>0?rnd(-.06,.06):0;
    e.sp.scale.set(e.H*e.ar*(2-bob),e.H*bob,1);e.sp.position.set(e.cx3+shk,dead?-(1-e.fade)*.6:0,e.cz3);
    const m=e.sp.material;m.opacity=e.fade;m.color.setRGB(e.fl>0?1:down?.55:1,e.fl>0?.55:down?.55:1,e.fl>0?.55:down?.6:1);
    e.gm.position.x=e.sh.position.x=e.cx3;e.gm.position.z=e.sh.position.z=e.cz3;e.gm.material.opacity=(dead?0:.55+.25*Math.sin(e.ph*.8))*(down?.3:1)*(u.el.classList.contains('cast')?1.6:1);e.sh.material.opacity=e.fade;
    v3Place(u);}
  V3.pillars=V3.pillars.filter(p=>{p.t-=dt;const k=p.t/p.d;p.m.material.opacity=Math.max(0,k)*.8;p.m.scale.set(p.r*(1.3-k*.3),p.h*(1.15-k*.15),p.r*(1.3-k*.3));if(p.t<=0){V3.scene.remove(p.m);p.m.material.dispose();return false;}return true;});
  if(B&&B.petEl){const [px2,py2]=v3Proj(-3.3,1.6,1.6);B.petEl.style.left=px2+'px';B.petEl.style.top=py2+'px';}
  V3.R.render(V3.scene,V3.cam);}
function v3Pillar(u,color){if(!V3.ok||!u.v3||!S.set.fx)return;const T=THREE,m=new T.Mesh(new T.CylinderGeometry(1,1,1,24,1,true),new T.MeshBasicMaterial({map:V3.beam,color,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}));
  m.geometry.translate(0,.5,0);m.position.set(u.v3.cx3,0,u.v3.cz3);V3.scene.add(m);V3.pillars.push({m,t:.7,d:.7,r:u.v3.boss?1.2:.55,h:u.v3.H*1.7});}
function v3CutIn(k,name){if(!S.set.fx||!v3Want())return;const now=performance.now();if(now-V3.cutT<5200)return;V3.cutT=now;
  stage.querySelectorAll('.cutin').forEach(x=>x.remove());const d=document.createElement('div');d.className='cutin';
  d.innerHTML=`<div class="cib"></div><img src="${cardImg(k)}" alt=""><b>${name}!!</b>`;stage.appendChild(d);setTimeout(()=>d.remove(),1300);}
// hooks
const _mkUnit=mkUnit;mkUnit=function(img,pos,h,cls,filter,flip){const u=_mkUnit(img,pos,h,cls,filter,flip);if(V3.ok)v3Add(u,img,pos,h,cls,filter,flip);if(v3Want()&&u.v3){u.v3.cx3=u.v3.x;u.v3.cz3=u.v3.z;v3Cam();v3Place(u);}return u;};
const _place=place;place=function(u){if(v3Want()&&u.v3&&u.v3.cx3!=null){v3Place(u);return;}_place(u);};
const _lunge=lunge;lunge=function(u,dir){if(u.v3)u.v3.lu=.28;_lunge(u,dir);};
const _hitFlash=hitFlash;hitFlash=function(u){if(u.v3)u.v3.fl=.16;_hitFlash(u);};
const _bossAb=bossAbility;bossAbility=function(e){V3.shake=1;V3.zoomAt=null;_bossAb(e);};
