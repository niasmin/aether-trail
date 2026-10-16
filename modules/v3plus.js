// ===================== 3D+ : terrain, props, light, particles, camera, 3D skills =====================
const V3P={theme:-2,props:null,parts:null,fx:[],lastB:null,sweep:0,sweepBoss:false,tint:new THREE.Color(1,1,1)};
function v3pInit(){if(!V3.ok||V3P.ready)return;const T=THREE,R=V3.R,sc=V3.scene;
  R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;
  const fg=new T.PlaneGeometry(44,44,88,88),pos=fg.attributes.position;
  for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i),r=Math.hypot(x,y-.4);if(r>6.2){const n=Math.sin(x*.55)*Math.cos(y*.47)+Math.sin(x*1.3+y*.9)*.45;pos.setZ(i,Math.max(0,(r-6.2))*.18*(1.2+n));}}
  fg.computeVertexNormals();V3.floor.geometry.dispose();V3.floor.geometry=fg;
  V3.floor.material.dispose();V3.floor.material=new T.MeshLambertMaterial({map:V3.floorTex});V3.floor.receiveShadow=true;
  const hemi=new T.HemisphereLight('#ffffff','#556',.75),sun=new T.DirectionalLight('#fff3dc',.85);sun.position.set(-6,11,7);sun.target.position.set(0,0,-1);
  sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);const c=sun.shadow.camera;c.left=-14;c.right=14;c.top=14;c.bottom=-14;c.near=1;c.far=40;sun.shadow.bias=-.0015;
  sc.add(hemi,sun,sun.target);Object.assign(V3P,{hemi,sun,ready:true,rune:v3pRune(),dot:v3pDot()});
  const _render=R.render.bind(R);R.render=(s,cam)=>{try{v3pTick();}catch(e){console.warn('3d+',e);}_render(s,cam);};}
function v3pRune(){return new THREE.CanvasTexture(v3Canvas(256,256,(g)=>{g.translate(128,128);g.strokeStyle='rgba(255,255,255,.95)';g.shadowColor='#fff';g.shadowBlur=8;
  for(const [r,w] of [[118,4],[100,2],[62,3]]){g.lineWidth=w;g.beginPath();g.arc(0,0,r,0,7);g.stroke();}
  g.lineWidth=2;for(let i=0;i<6;i++){const a=i*Math.PI/3;g.beginPath();g.moveTo(Math.cos(a)*100,Math.sin(a)*100);g.lineTo(Math.cos(a+2*Math.PI/3)*100,Math.sin(a+2*Math.PI/3)*100);g.stroke();}
  g.font='bold 16px serif';g.fillStyle='#fff';g.textAlign='center';for(let i=0;i<12;i++){g.save();g.rotate(i*Math.PI/6);g.fillText('ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃ'[i],0,-104);g.restore();}}));}
function v3pDot(){return new THREE.CanvasTexture(v3Canvas(32,32,(g)=>{const r=g.createRadialGradient(16,16,0,16,16,16);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.4,'rgba(255,255,255,.6)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,32,32);}));}
// ---- themes: 0 forest 1 amber mine 2 swamp 3 sky temple 4 snow fort 5 desert 6 sky city 7 moon · -1 dungeon
const V3TH={'-1':{sun:'#ffcc88',si:.55,hemi:['#8a8cb0','#2a2433'],tint:[.82,.8,.9],pt:'ember'},
 0:{sun:'#fff3dc',si:.9,hemi:['#e8fff0','#4a6a3a'],tint:[1,1,.97],pt:'leaf'},1:{sun:'#ffd49a',si:.9,hemi:['#ffe8c8','#6a4a2a'],tint:[1,.95,.88],pt:'ember'},
 2:{sun:'#d8f0e0',si:.6,hemi:['#c8e0d8','#2a4a40'],tint:[.88,.95,.92],pt:'spore'},3:{sun:'#f0e8ff',si:.9,hemi:['#e8e0ff','#5a508a'],tint:[.97,.96,1],pt:'spark'},
 4:{sun:'#e8f2ff',si:.75,hemi:['#eef4ff','#6a7888'],tint:[.92,.95,1],pt:'snow'},5:{sun:'#ffe2a8',si:1,hemi:['#fff0d0','#8a6a3a'],tint:[1,.96,.88],pt:'dust'},
 6:{sun:'#ffffff',si:.95,hemi:['#eaf6ff','#7a9ab8'],tint:[1,1,1],pt:'spark'},7:{sun:'#c8b8ff',si:.6,hemi:['#a898e0','#2a2050'],tint:[.88,.84,1],pt:'spark'}};
function v3pMat(c,o){return new THREE.MeshStandardMaterial(Object.assign({color:c,flatShading:true,roughness:.85,metalness:0},o||{}));}
function v3pMesh(geo,mat,x,y,z,s,ry){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.scale.setScalar(s||1);m.rotation.y=ry||0;m.castShadow=true;m.receiveShadow=true;return m;}
function v3pProp(th,g,x,z,s,r){const T=THREE,G=new T.Group();G.position.set(x,0,z);G.scale.setScalar(s);G.rotation.y=r*6.28;const add=(m)=>{G.add(m);return m;};
  const trunk=v3pMat('#6b4a2e'),k=(r*7)%1;
  const tree=(c1,c2)=>{add(v3pMesh(new T.CylinderGeometry(.12,.18,1,6),trunk,0,.5,0));add(v3pMesh(new T.ConeGeometry(.75,1.3,7),v3pMat(c1),0,1.4,0));add(v3pMesh(new T.ConeGeometry(.55,1,7),v3pMat(c2),0,2.05,0));};
  const round=(c)=>{add(v3pMesh(new T.CylinderGeometry(.12,.16,.9,6),trunk,0,.45,0));add(v3pMesh(new T.IcosahedronGeometry(.75,0),v3pMat(c),0,1.35,0));};
  const rock=(c)=>add(v3pMesh(new T.DodecahedronGeometry(.6,0),v3pMat(c),0,.3,0,1,k*3)).scale.set(1,.65+k*.4,1);
  const crystal=(c,em)=>{for(let i=0;i<3;i++){const m=add(v3pMesh(new T.OctahedronGeometry(.32,0),v3pMat(c,{emissive:em,emissiveIntensity:.55,roughness:.3}),(i-1)*.28,.55+i%2*.2,(i%2)*.15));m.scale.set(.7,1.8+i*.4,.7);m.rotation.z=(i-1)*.3;}};
  const pillar=(c,broken)=>{add(v3pMesh(new T.BoxGeometry(.7,.2,.7),v3pMat(c),0,.1,0));add(v3pMesh(new T.CylinderGeometry(.26,.28,broken?1.3:2.4,8),v3pMat(c),0,broken?.85:1.4,0));if(!broken)add(v3pMesh(new T.BoxGeometry(.7,.2,.7),v3pMat(c),0,2.7,0));};
  const mush=(c)=>{add(v3pMesh(new T.CylinderGeometry(.12,.16,.6,8),v3pMat('#f4ead2'),0,.3,0));add(v3pMesh(new T.SphereGeometry(.42,10,6,0,6.3,0,1.6),v3pMat(c),0,.58,0));};
  const cactus=()=>{const m=v3pMat('#5f9a45');add(v3pMesh(new T.CylinderGeometry(.2,.22,1.6,8),m,0,.8,0));add(v3pMesh(new T.CylinderGeometry(.12,.12,.6,8),m,.35,1,0)).rotation.z=-.6;add(v3pMesh(new T.CylinderGeometry(.12,.12,.5,8),m,-.32,.75,0)).rotation.z=.6;};
  const cloud=()=>{const m=v3pMat('#ffffff',{roughness:1});for(let i=0;i<4;i++)add(v3pMesh(new T.IcosahedronGeometry(.45+i%2*.15,1),m,(i-1.5)*.45,.3+(i%2)*.15,0));};
  const torch=()=>{add(v3pMesh(new T.CylinderGeometry(.06,.08,1.4,6),trunk,0,.7,0));add(v3pMesh(new T.OctahedronGeometry(.16,0),v3pMat('#ffb347',{emissive:'#ff8a20',emissiveIntensity:1.2}),0,1.5,0));};
  const pick=(arr)=>arr[Math.floor(k*arr.length)%arr.length];
  ({'-1':()=>pick([()=>pillar('#5d5f72',k>.5),torch,()=>rock('#4a4c5e')])(),
    0:()=>pick([()=>tree('#4f8a3a','#6aa84a'),()=>round('#5f9a45'),()=>mush('#d8543c'),()=>rock('#8a8f80'),()=>tree('#3f7a34','#5f9a45')])(),
    1:()=>pick([()=>rock('#a07a4c'),()=>crystal('#ffcf5a','#ff9a20'),()=>rock('#8a6a44'),()=>crystal('#ffb347','#ff7a10')])(),
    2:()=>pick([()=>round('#5d7f78'),()=>pillar('#8a9a90',true),()=>mush('#7a5ab0'),()=>rock('#4d6a64')])(),
    3:()=>pick([()=>crystal('#b8a8ff','#7a5aff'),()=>pillar('#e8e4f4',k>.6),()=>rock('#9a8fc4')])(),
    4:()=>pick([()=>tree('#6a8a7a','#eef4f8'),()=>rock('#cfd6dd'),()=>crystal('#bfe6ff','#6ab8ff')])(),
    5:()=>pick([cactus,()=>pillar('#d9a95c',k>.4),()=>rock('#c9944a')])(),
    6:()=>pick([cloud,()=>pillar('#ffffff',k>.6),()=>crystal('#9cc0dc','#5aa0ff')])(),
    7:()=>pick([()=>crystal('#b56bff','#8a3aff'),()=>rock('#4a3f6e'),()=>tree('#2e2650','#5a4d82')])()})[th]();
  return G;}
function v3pSeed(n){let s=n*9301+49297;return ()=>{s=(s*233280+1)%2147483647;return s/2147483647;};}
function v3pBuild(th){const T=THREE;if(V3P.props){V3.scene.remove(V3P.props);V3P.props.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});}
  const G=new T.Group(),r=v3pSeed(th+7);let n=0;
  for(let i=0;i<70&&n<34;i++){const a=r()*Math.PI*2,d=5.6+r()*7,x=Math.cos(a)*d,z=-.4+Math.sin(a)*d*.9;if(z>2.2&&Math.abs(x)<5.5)continue;if(z>6)continue;
    G.add(v3pProp(th,null,x,z,.75+r()*.7+(d>9?.4:0),r()));n++;}
  V3.scene.add(G);V3P.props=G;
  const P=V3TH[th]||V3TH[0];V3P.sun.color.set(P.sun);V3P.sun.intensity=P.si;V3P.hemi.color.set(P.hemi[0]);V3P.hemi.groundColor.set(P.hemi[1]);V3P.tint.setRGB(...P.tint);v3pParticles(P.pt);}
function v3pParticles(kind){const T=THREE;if(V3P.parts){V3.scene.remove(V3P.parts);V3P.parts.geometry.dispose();V3P.parts.material.dispose();}
  const N=kind==='snow'?220:120,pos=new Float32Array(N*3),vel=new Float32Array(N*3);
  for(let i=0;i<N;i++){pos[i*3]=rnd(-10,10);pos[i*3+1]=rnd(0,7);pos[i*3+2]=rnd(-10,5);}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(pos,3));
  const col={leaf:'#b8e06a',ember:'#ffb347',spore:'#c8ff9a',spark:'#e8e0ff',snow:'#ffffff',dust:'#f0d08a'}[kind]||'#fff';
  const add=kind==='ember'||kind==='spark'||kind==='spore';
  const mat=new T.PointsMaterial({map:V3P.dot,color:col,size:kind==='snow'?.14:kind==='leaf'?.16:.12,transparent:true,depthWrite:false,opacity:.85,blending:add?T.AdditiveBlending:T.NormalBlending});
  const p=new T.Points(geo,mat);p.userData={kind,vel};V3.scene.add(p);V3P.parts=p;}
function v3pPartTick(dt,t){const p=V3P.parts;if(!p)return;const a=p.geometry.attributes.position,k=p.userData.kind,N=a.count;
  for(let i=0;i<N;i++){let x=a.getX(i),y=a.getY(i),z=a.getZ(i);
    if(k==='snow'){y-=dt*.9;x+=Math.sin(t*.001+i)*dt*.3;}else if(k==='leaf'){y-=dt*.45;x+=Math.sin(t*.0013+i)*dt*.6;}else if(k==='ember'){y+=dt*.6;x+=Math.sin(t*.002+i)*dt*.2;}
    else if(k==='dust'){x+=dt*.8;y+=Math.sin(t*.002+i)*dt*.1;}else{y+=Math.sin(t*.0015+i*1.7)*dt*.25;x+=Math.cos(t*.0011+i)*dt*.2;}
    if(y<0)y=7;if(y>7)y=0;if(x>10)x=-10;if(x<-10)x=10;a.setXYZ(i,x,y,z);}a.needsUpdate=true;}
// ---- per-frame
function v3pTick(){const t=performance.now(),dt=Math.min(.1,(t-(V3P.lt||t))/1000);V3P.lt=t;
  const th=B&&B.tower?-1:B?Math.max(0,Math.min(7,B.area|0)):0;if(th!==V3P.theme){V3P.theme=th;v3pBuild(th);}
  if(B!==V3P.lastB){V3P.lastB=B;if(B&&!B.pvp){V3P.sweep=1.4;V3P.sweepBoss=!!B.boss;}}
  v3pPartTick(dt,t);if(V3P.props)V3P.props.children.forEach((g,i)=>{if(V3P.theme===6||V3P.theme===3)g.position.y=Math.sin(t*.0008+i)*.12;});
  for(const e of V3.list){const u=e.u;
    if(e.z0==null){e.z0=e.z;e.enter=0;}if(e.enter<1){e.enter=Math.min(1,e.enter+dt/.7);const q=1-Math.pow(1-e.enter,3);e.z=e.z0+(1-q)*(e.hero?2.6:-3.2);}
    const dead=u.el.classList.contains('dead'),lean=e.lu>0?Math.sin((1-e.lu/.28)*Math.PI)*.14*(e.hero?1:-1):0;
    e.sp.material.rotation=dead?(1-e.fade)*1.35*(e.hero?1:-1):lean;
    e.sp.material.color.multiply(V3P.tint);e.sp.castShadow=false;
    const sh=(u.shield||0)>0&&!dead&&u.alive!==false;if(sh&&!e.bub){e.bub=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),new THREE.MeshBasicMaterial({color:'#9ad8ff',transparent:true,opacity:.22,blending:THREE.AdditiveBlending,depthWrite:false}));V3.scene.add(e.bub);}
    if(e.bub){e.bub.visible=sh;if(sh){const r=e.H*.5;e.bub.scale.setScalar(r*(1+Math.sin(t*.006)*.03));e.bub.position.set(e.cx3,r*.95,e.cz3);}}
    if(!u.el.isConnected&&e.bub){V3.scene.remove(e.bub);e.bub.geometry.dispose();e.bub.material.dispose();e.bub=null;}}
  V3P.fx=V3P.fx.filter(f=>{f.t+=dt;const k=f.t/f.d;if(f.step(k,dt)===false||k>=1){f.end&&f.end();f.objs.forEach(o=>{V3.scene.remove(o);o.geometry&&o.geometry.dispose();o.material&&o.material.dispose();});return false;}return true;});}
// ---- camera sweep on wave start
const _v3Cam=v3Cam;v3Cam=function(){_v3Cam();if(!V3P.sweep||!SW)return;const dt=1/60;V3P.sweep=Math.max(0,V3P.sweep-dt);const k=V3P.sweep/1.4,e=k*k;const C=V3.cam;
  const tx=0,tz=-1.4,dx=C.position.x-tx,dz=C.position.z-tz,a=e*(V3P.sweepBoss?.35:-.75);
  C.position.x=tx+dx*Math.cos(a)-dz*Math.sin(a);C.position.z=tz+dx*Math.sin(a)+dz*Math.cos(a);C.position.y+=e*(V3P.sweepBoss?-1.6:2.2);
  if(V3P.sweepBoss){C.position.z-=e*3.2;C.lookAt(0,1.6+e*.8,-2.6);}else C.lookAt(0,1.15,-1.4);C.updateProjectionMatrix();};
// ---- 3D effects
function v3pFx(objs,d,step,end){objs.forEach(o=>V3.scene.add(o));V3P.fx.push({objs,d,t:0,step,end});}
function v3pGlow(col,s){const m=new THREE.Sprite(new THREE.SpriteMaterial({map:V3.glow,color:col,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));m.scale.set(s,s,1);return m;}
function v3pRing(x,z,col,r0,r1,d,tex){const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:tex||V3.glow,color:col,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,.04,z);
  v3pFx([m],d,(k)=>{const s=r0+(r1-r0)*(tex?Math.min(1,k*4):k);m.scale.set(s,s,1);m.rotation.z=k*(tex?2.5:0);m.material.opacity=tex?(k<.75?1:(1-k)*4):1-k;});}
function v3pShot(from,to,kind,dur,cb){const a=from.v3,b=to.v3,col=kind==='heal'?'#7dffa0':kind==='orb'?'#8fd3ff':kind==='meteor'?'#ffb347':'#ffe27a';
  const p0=new THREE.Vector3(a.cx3,a.H*.55,a.cz3),p1=new THREE.Vector3(b.cx3,b.H*(kind==='heal'?.7:.5),b.cz3),h=kind==='arrow'?.9:kind==='heal'?1.6:1.2;
  const head=v3pGlow(col,kind==='arrow'?.32:.5),tr=[0,1,2].map(i=>v3pGlow(col,(kind==='arrow'?.26:.4)*(1-i*.25)));tr.forEach(s=>s.material.opacity=.5);
  const P=k=>{const v=p0.clone().lerp(p1,k);v.y+=Math.sin(k*Math.PI)*h;return v;};
  v3pFx([head,...tr],dur/1000,(k)=>{head.position.copy(P(k));tr.forEach((s,i)=>s.position.copy(P(Math.max(0,k-(i+1)*.06))));},()=>{v3pRing(p1.x,p1.z,col,.2,1.3,.35);cb();});}
const _shoot=shoot;shoot=function(from,to,kind,cb){if(v3Want()&&screen==='battle'&&from&&to&&from.v3&&to.v3&&from.v3.cx3!=null&&to.v3.cx3!=null&&S.set.fx!==false){
    const dx=(from.cx||0)-(to.cx||0),dy=(from.cy||0)-(to.cy||0);let dur=Math.max(160,Math.hypot(dx,dy)*1.4)/speed;if(!isFinite(dur)||dur<0)dur=300;v3pShot(from,to,kind,kind==='heal'?dur*1.1:dur,cb);return;}
  return _shoot(from,to,kind,cb);};
const _v3Skill=v3Skill;v3Skill=function(h,H){_v3Skill(h,H);if(!v3Want()||!h.v3||S.set.fx===false)return;const col={knight:'#8fd3ff',ranger:'#c8ff9a',mage:'#ffd86b',healer:'#7dffa0'}[H.rl]||'#fff';
  v3pRing(h.v3.cx3,h.v3.cz3,col,.3,h.v3.boss?3:2.2,1.1,V3P.rune);
  if(H.rl==='mage'&&B)alive(B.en).forEach((t,i)=>{if(!t.v3)return;const x=t.v3.cx3,z=t.v3.cz3,m=v3pGlow('#ffb347',.9),tl=v3pGlow('#ff7a20',.6);
    setTimeout(()=>v3pFx([m,tl],.32/speed,(k)=>{m.position.set(x-1.6*(1-k),.4+6*(1-k),z-1.2*(1-k));tl.position.set(x-1.6*(1-k*.9),.6+6*(1-k*.9),z-1.2*(1-k*.9));},()=>{v3pRing(x,z,'#ffb347',.3,2.4,.5);V3.shake=Math.max(V3.shake,.35);}),i*90/speed);});
  if(H.rl==='healer'&&B)alive(B.heroes).forEach(o=>{if(o.v3)v3pRing(o.v3.cx3,o.v3.cz3,'#7dffa0',.4,1.6,.7);});};
const _bossAb2=bossAbility;bossAbility=function(e){_bossAb2(e);if(v3Want()&&e&&e.v3&&S.set.fx!==false){v3pRing(e.v3.cx3,e.v3.cz3,'#ff6a4a',.5,9,.9);v3pRing(e.v3.cx3,e.v3.cz3,'#ffb0a0',.3,3.2,1.2,V3P.rune);}};
v3pInit();
