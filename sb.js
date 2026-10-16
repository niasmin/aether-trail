// ===================== SUPABASE BACKEND SHIM (GitHub Pages build) =====================
// Provides window.claude.use('db'|'user'|'room'|'comments') on top of Supabase so the game code runs unchanged.
(function(){
if(window.claude&&window.claude.use)return;
const SB_URL='https://qrxfmymmsjsyzhvuudtj.supabase.co',SB_KEY='sb_publishable_2r38ph8nVKDipJLgkwp-AA_QgTP66Go';
let sb=null,uid=null,admin=false,ready=null,authErr='';
const split=p=>{const s=String(p).split('/');const id=s.pop();return [s.join('/'),id];};
function init(){if(ready)return ready;ready=(async()=>{
  if(!window.supabase||!window.supabase.createClient){authErr='โหลดระบบออนไลน์ไม่สำเร็จ';return false;}
  sb=window.supabase.createClient(SB_URL,SB_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true},realtime:{params:{eventsPerSecond:10}}});
  window.SBC=sb;
  try{let {data}=await sb.auth.getSession();let s=data&&data.session;
    if(!s){const r=await sb.auth.signInAnonymously();if(r.error){authErr=r.error.message||'เข้าสู่ระบบไม่สำเร็จ';return false;}s=r.data.session;}
    uid=s.user.id;window.SBUSER=s.user;try{const pv=localStorage.getItem('aether-uid');if(pv&&pv!==uid){window.SB_SWITCHED=true;try{const old=localStorage.getItem('aether-trail-v1');if(old)localStorage.setItem('aether-trail-v1-guest',old);}catch(e){}}localStorage.setItem('aether-uid',uid);}catch(e){}
    try{const a=await sb.from('admins').select('uid').eq('uid',uid).maybeSingle();admin=!!(a.data);}catch(e){}
    sb.auth.onAuthStateChange((ev,ss)=>{if(ss&&ss.user)window.SBUSER=ss.user;if(ss&&ss.user&&ss.user.id!==uid){location.reload();}});
    return true;}catch(e){authErr=String(e&&e.message||e);return false;}})();return ready;}
// ---- realtime fan-out for docs table
const subs={};let rtCh=null;
function rtStart(){if(rtCh||!sb)return;rtCh=sb.channel('docs-all').on('postgres_changes',{event:'*',schema:'public',table:'docs'},p=>{const r=p.new&&p.new.col?p.new:p.old||{};const c=r.col;(subs[c]||[]).forEach(f=>{try{f(r.id);}catch(e){}});}).subscribe();}
function sub(col,f){(subs[col]=subs[col]||[]).push(f);rtStart();return()=>{subs[col]=(subs[col]||[]).filter(x=>x!==f);};}
const snapDoc=(id,data)=>({id,exists:data!=null,data:()=>data==null?undefined:JSON.parse(JSON.stringify(data))});
function docRef(path){const [col,id]=split(path);return {
  id,async get(){const {data,error}=await sb.from('docs').select('data').eq('col',col).eq('id',id).maybeSingle();if(error)throw error;return snapDoc(id,data?data.data:null);},
  async set(obj){const {error}=await sb.from('docs').upsert({col,id,data:obj||{}});if(error)throw error;},
  async update(obj){const cur=await this.get();const {error}=await sb.from('docs').upsert({col,id,data:{...(cur.data()||{}),...obj}});if(error)throw error;},
  async delete(){const {error}=await sb.from('docs').delete().eq('col',col).eq('id',id);if(error)throw error;},
  onSnapshot(cb,err){let t=null,live=true;const run=()=>this.get().then(s=>{if(live)cb(s);},e=>err&&err(e));run();const un=sub(col,i=>{if(i!==id)return;clearTimeout(t);t=setTimeout(run,250);});return()=>{live=false;un();};}};}
function query(col,o){o=o||{};const q={
  limit(n){return query(col,{...o,lim:n});},orderBy(f,d){return query(col,{...o,ob:[f,d]});},where(f,op,v){return query(col,{...o,wh:[f,op,v]});},
  doc(id){return docRef(col+'/'+id);},
  async get(){let r=sb.from('docs').select('id,data').eq('col',col);
    if(o.wh&&o.wh[1]==='array-contains')r=r.contains('data',{[o.wh[0]]:[o.wh[2]]});else if(o.wh&&o.wh[1]==='==')r=r.eq('data->>'+o.wh[0],String(o.wh[2]));
    if(o.ob)r=r.order('data->'+o.ob[0],{ascending:o.ob[1]!=='desc'});r=r.limit(o.lim||1000);
    const {data,error}=await r;if(error)throw error;const docs=(data||[]).map(x=>snapDoc(x.id,x.data));return {docs,size:docs.length,empty:!docs.length};},
  onSnapshot(cb,err){let t=null,live=true;const run=()=>this.get().then(s=>{if(live)cb(s);},e=>err&&err(e));run();const un=sub(col,()=>{clearTimeout(t);t=setTimeout(run,400);});return()=>{live=false;un();};}};return q;}
const DBNS={doc:docRef,collection:c=>query(c)};
const USERNS={id:async()=>uid,me:async()=>({id:uid,name:''}),isOwner:()=>admin,canEdit:()=>admin,can:()=>true,profiles:async()=>({}),search:async()=>[]};
// ---- presence room (Supabase Realtime presence)
function mkRoom(){const key=Math.random().toString(36).slice(2,12);let state={},handlers=[],peers=Object.freeze([]),ch=null,pend=null;
  const build=()=>{const ps=ch.presenceState();const out=[];for(const k in ps){const m=ps[k]&&ps[k][ps[k].length-1];if(!m)continue;const {by,...p}=m;delete p.presence_ref;out.push({peer:k,by:by||null,isMe:k===key||(by&&by===uid),sameTab:k===key,kind:'viewer',guest:false,presence:p.st||{},updatedAt:Date.now()});}peers=Object.freeze(out);handlers.forEach(h=>{try{h({peers,joined:[],left:[],updated:out});}catch(e){}});};
  ch=sb.channel('town',{config:{presence:{key}}});ch.on('presence',{event:'sync'},build).subscribe(s=>{if(s==='SUBSCRIBED')ch.track({by:uid,st:state});});
  return {presence(patch){for(const k in patch){if(patch[k]===null)delete state[k];else state[k]=patch[k];}clearTimeout(pend);pend=setTimeout(()=>{try{ch.track({by:uid,st:state});}catch(e){}},120);return Promise.resolve();},
    onPeers(h){handlers.push(h);setTimeout(()=>h({peers,joined:peers,left:[],updated:[]}),0);return()=>{handlers=handlers.filter(x=>x!==h);};},peers:()=>peers,
    emit(){return Promise.resolve();},on(){return()=>{};}};}
let ROOMNS=null;
window.claude={use:async name=>{const ok=await init();if(!ok)return null;
  if(name==='db')return DBNS;if(name==='user')return USERNS;if(name==='room'){if(!ROOMNS)ROOMNS=mkRoom();return ROOMNS;}return null;}};
window.SB_STATUS=()=>({ok:!!uid,err:authErr,anon:!!(window.SBUSER&&window.SBUSER.is_anonymous),email:window.SBUSER&&window.SBUSER.email||''});
window.SB_LINK=async email=>{await init();const {error}=await sb.auth.updateUser({email},{emailRedirectTo:location.origin+location.pathname});return error?error.message:'';};
window.SB_LOGIN=async email=>{await init();const {error}=await sb.auth.signInWithOtp({email,options:{shouldCreateUser:false,emailRedirectTo:location.origin+location.pathname}});return error?error.message:'';};
init();
})();
