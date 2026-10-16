"""Aether Trail: reproducible procedural rigged GLB prototype.
Requires Python 3, numpy and Pillow. No external models or downloaded textures.
Y up, +Z front; meters. Deliberately simplified geometry, rigid joint weights.
"""
from pathlib import Path
import json, struct, math, zipfile
import numpy as np
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parents[1]
TAU = 2 * math.pi
NAMES = ['Root','Hips','Spine','Head','UpperArm.L','Forearm.L','Hand.L',
         'UpperArm.R','Forearm.R','Hand.R','Thigh.L','Shin.L','Foot.L',
         'Thigh.R','Shin.R','Foot.R','Cape','Sword']
PARENT = [-1,0,1,2,2,4,5,2,7,8,1,10,11,1,13,14,2,9]
BIND = np.array([[0,0,0],[0,.70,0],[0,.98,0],[0,1.40,0],
    [.25,1.08,0],[.34,.86,0],[.38,.67,.02],[-.25,1.08,0],[-.34,.86,0],[-.38,.67,.02],
    [.115,.68,0],[.115,.39,0],[.115,.10,.04],[-.115,.68,0],[-.115,.39,0],[-.115,.10,.04],
    [0,1.09,-.13],[-.38,.67,.02]], dtype=float)
LOCAL = np.array([p if PARENT[i]<0 else p-BIND[PARENT[i]] for i,p in enumerate(BIND)])
COLORS = {
 'skin': '#f2c6a4','blush':'#e99e8c','hair':'#694027','hairlight':'#8a5735',
 'navy':'#203a59','teal':'#248c97','cream':'#ede5d0','leather':'#684635',
 'gold':'#d6b357','eye':'#247c96','white':'#fff9ee','black':'#192337',
 'silver':'#a6b6c7','violet':'#5f4c96','cyan':'#74d4df'}

def rgb(k):
    s=COLORS.get(k,k).lstrip('#'); return np.array([int(s[i:i+2],16)/255 for i in (0,2,4)])

def quat(e):
    x,y,z=np.radians(e)/2
    # quaternion for Rz @ Ry @ Rx
    return np.array([math.sin(x)*math.cos(y)*math.cos(z)-math.cos(x)*math.sin(y)*math.sin(z),
        math.cos(x)*math.sin(y)*math.cos(z)+math.sin(x)*math.cos(y)*math.sin(z),
        math.cos(x)*math.cos(y)*math.sin(z)-math.sin(x)*math.sin(y)*math.cos(z),
        math.cos(x)*math.cos(y)*math.cos(z)+math.sin(x)*math.sin(y)*math.sin(z)])

def rot(q):
    x,y,z,w=q
    return np.array([[1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w)],
        [2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w)],
        [2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)]])

DURATIONS={'Idle':2.0,'Walk':1.0,'Run':.65,'Attack':.9,'Cast':1.4,'Hit':.6,'Victory':1.8,'Defeat':1.2}

def pose(clip,t):
    """Return every joint, so switching clips cannot leave stale transforms."""
    d=DURATIONS[clip]; u=min(1,max(0,t/d)); a=TAU*u
    e=np.zeros((len(NAMES),3)); tr=LOCAL.copy()
    if clip=='Idle':
        e[2,0]=2*math.sin(a); e[3,1]=4*math.sin(a); e[16,0]=4*math.sin(a)
        tr[1,1]+=.006*math.sin(a)
    elif clip in ('Walk','Run'):
        run=clip=='Run'; amp=42 if run else 25; s=math.sin(a)
        e[10,0]=amp*s; e[13,0]=-amp*s
        e[11,0]=-max(0,-s)*(60 if run else 30); e[14,0]=-max(0,s)*(60 if run else 30)
        e[4,0]=-amp*s; e[7,0]=amp*s
        e[5,0]=-35 if run else -10; e[8,0]=-35 if run else -10
        e[2,0]=12 if run else 3; e[16,0]=(-22 if run else -8)+6*math.sin(a)
        tr[1,1]+=(.028 if run else .012)*(1-math.cos(2*a))
    elif clip=='Attack':
        v=np.interp(u,[0,.3,.48,.65,1],[0,1,-.7,-.6,0])
        e[7]=[-65*v,-25*v,-40*v]; e[8,0]=-45*max(v,0)
        e[2,1]=28*v; e[4,2]=-25*abs(v); e[3,1]=-15*v
    elif clip=='Cast':
        s=math.sin(math.pi*u); e[4]=[-75*s,0,15*s]; e[5,0]=-20*s
        e[7,2]=-30*s; e[3,0]=-10*s; e[16,0]=-12*s
    elif clip=='Hit':
        s=math.sin(math.pi*u); e[2,0]=-25*s; e[3,0]=-10*s
        e[4,2]=25*s; e[7,2]=-25*s; tr[1,2]-=.06*s
    elif clip=='Victory':
        s=math.sin(math.pi*min(u*2,1)); hold=min(u*4,1)
        e[4,2]=155*hold; e[5,0]=-25*hold; e[7,2]=-30*hold
        e[3,2]=8*math.sin(a); tr[1,1]+=.06*abs(math.sin(a))*s
    elif clip=='Defeat':
        s=min(u*1.5,1); e[1,0]=35*s; e[11,0]=-85*s; e[14,0]=-85*s
        e[10,0]=40*s; e[13,0]=40*s; e[3,0]=25*s; tr[1,1]-=.27*s
    return np.array([quat(v) for v in e]),tr

class Model:
    def __init__(self,sex,costume):
        self.sex=sex; self.costume=costume; self.parts=[]
        self.build()

    def add(self,verts,faces,color,bone):
        v=np.asarray(verts,float); f=np.asarray(faces,np.uint32)
        # Drop degenerate polar triangles; GLB has smooth analytical-ish normals.
        cross=np.cross(v[f[:,1]]-v[f[:,0]],v[f[:,2]]-v[f[:,0]])
        f=f[np.linalg.norm(cross,axis=1)>1e-9]
        self.parts.append((v,f,color,bone))

    def ball(self,c,s,color,bone,seg=12,rings=8):
        vs=[]; fs=[]
        for j in range(rings+1):
            th=math.pi*j/rings
            for i in range(seg):
                ph=TAU*i/seg
                vs.append(np.array(c)+np.array(s)*[math.sin(th)*math.cos(ph),math.cos(th),math.sin(th)*math.sin(ph)])
        for j in range(rings):
            for i in range(seg):
                a=j*seg+i;b=j*seg+(i+1)%seg;c0=b+seg;d=a+seg
                fs.extend([(a,b,d),(b,c0,d)])
        self.add(vs,fs,color,bone)

    def tube(self,a,b,r0,r1,color,bone,n=12):
        a=np.array(a,float); b=np.array(b,float); axis=b-a;axis/=np.linalg.norm(axis)
        q=np.cross(axis,[0,0,1]);q/=np.linalg.norm(q); w=np.cross(axis,q)
        vs=[]
        for center,r in [(a,r0),(b,r1)]:
            for i in range(n): vs.append(center+r*(q*math.cos(TAU*i/n)+w*math.sin(TAU*i/n)))
        vs.extend([a,b]);fs=[]
        for i in range(n):
            j=(i+1)%n;fs.extend([(i,n+i,j),(j,n+i,n+j),(2*n,j,i),(2*n+1,n+i,n+j)])
        self.add(vs,[(c,b,a) for a,b,c in fs],color,bone)

    def cape(self,color):
        # Single rigid cape joint: intentionally no cloth simulation.
        v=[[-.20,1.12,-.14],[.20,1.12,-.14],[-.28,.64,-.24],[.28,.64,-.24],
           [-.20,1.12,-.155],[.20,1.12,-.155],[-.28,.64,-.255],[.28,.64,-.255]]
        self.add(v,[(0,2,1),(1,2,3),(4,5,6),(5,7,6),(0,4,2),(2,4,6),(1,3,5),(3,7,5)],color,16)

    def build(self):
        outfit=self.costume; armor=outfit=='commander'; main='violet' if outfit=='celestial' else 'navy'
        torso='silver' if armor else ('cream' if outfit=='sovereign' else main)
        # Chibi body with closed, overlapping components and rigid limb weights.
        self.ball([0,.72,0],[.18,.15,.12],main,1)
        self.ball([0,.98,0],[.215,.25,.135],torso,2)
        self.tube([0,1.16,0],[0,1.24,0],.07,.07,'skin',2)
        for side,upper,fore,hand,thigh,shin,foot in [(1,4,5,6,10,11,12),(-1,7,8,9,13,14,15)]:
            self.tube(BIND[upper],BIND[fore],.077,.061,'silver' if armor else 'cream',upper)
            self.tube(BIND[fore],BIND[hand],.061,.044,'silver' if armor else 'cream',fore)
            self.ball(BIND[hand],[.052,.067,.046],'skin',hand)
            self.tube(BIND[thigh],BIND[shin],.08,.065,main,thigh)
            self.tube(BIND[shin],BIND[foot],.071,.062,'silver' if armor else 'leather',shin)
            self.ball([side*.115,.085,.078],[.080,.078,.142],'silver' if armor else 'leather',foot)
            self.ball([side*.115,.37,.007],[.079,.032,.077],'gold',shin)
            if armor:self.ball(BIND[upper],[.10,.075,.10],'silver',upper)
        self.ball([0,.79,0],[.192,.035,.145],'leather',1)
        self.ball([0,.79,.148],[.034,.030,.012],'gold',1)
        # Tunic panels, compass brooch and teal scarf.
        for side in [-1,1]:
            v=[[side*.02,.83,.15],[side*.18,.83,.10],[side*.255,.57,.07],[side*.06,.59,.16],
               [side*.02,.83,.16],[side*.18,.83,.11],[side*.255,.57,.08],[side*.06,.59,.17]]
            self.add(v,[(0,1,2),(0,2,3),(4,6,5),(4,7,6),(0,4,1),(1,4,5),(2,6,3),(3,6,7)],torso,1)
            self.tube([side*.06,.59,.175],[side*.255,.57,.085],.007,.007,'gold',1,n=6)
        self.ball([0,1.15,.02],[.145,.052,.13],'violet' if outfit=='celestial' else 'teal',2)
        self.ball([.09,1.10,.145],[.036,.036,.012],'gold',2)
        self.ball([.09,1.10,.158],[.014,.020,.008],'cyan',2)
        if outfit=='traveler':
            self.ball([.20,.78,.12],[.085,.10,.042],'leather',1)
            self.tube([-.15,1.1,.13],[.17,.84,.13],.015,.015,'leather',2,n=6)
        else:self.cape('violet' if outfit=='celestial' else 'navy')
        # Head, eyes, nose and sculpted chunky hair.
        self.ball([0,1.43,0],[.272,.293,.24],'skin',3,20,12)
        self.ball([0,1.59,-.05],[.285,.19,.224],'hair',3,16,10)
        for x in [-.26,.26]:self.ball([x,1.43,.01],[.043,.065,.035],'skin',3)
        for x in [-.095,.095]:
            self.ball([x,1.448,.218],[.060,.073,.023],'white',3)
            self.ball([x,1.446,.240],[.034,.046,.013],'eye',3)
            self.ball([x,1.446,.251],[.017,.031,.007],'black',3)
            self.ball([x-.010,1.467,.258],[.011,.013,.004],'white',3,8,6)
            self.ball([x,1.535,.215],[.060,.013,.014],'hair',3)
            self.ball([x*1.6,1.365,.199],[.032,.016,.008],'blush',3)
        self.ball([0,1.38,.238],[.023,.024,.029],'skin',3)
        self.ball([0,1.319,.219],[.035,.008,.007],'leather',3)
        if self.sex=='male':
            for i in range(7):
                x=-.23+i*.068
                self.ball([x,1.635-abs(x)*.12,.135],[.072,.13 if i%2 else .10,.10],'hairlight' if i%3==0 else 'hair',3)
            self.tube([-.06,1.73,0],[.03,1.83,-.015],.06,.004,'hair',3)
        else:
            for x in [-.21,-.12,-.03,.07,.19]:self.ball([x,1.64-abs(x)*.3,.14],[.084,.105,.09],'hair',3)
            self.ball([-.235,1.38,-.04],[.075,.18,.12],'hair',3)
            for j in range(7):self.ball([.23+(.018 if j%2 else -.018),1.48-j*.073,-.015],[.065-j*.003,.058,.057],'hairlight' if j%2 else 'hair',3)
            self.ball([.23,.98,-.015],[.042,.022,.045],'gold',3)
            self.ball([-.22,1.60,.18],[.023,.047,.014],'gold',3)
        if outfit in ('sovereign','celestial'):
            for i in range(10):
                ph=TAU*i/10; c=[.22*math.cos(ph),1.70,.17*math.sin(ph)]
                self.ball(c,[.042,.022,.039],'gold' if outfit=='sovereign' else 'silver',3)
                if i%2==0:self.tube(c,[c[0],1.80,c[2]],.025,.002,'gold' if outfit=='sovereign' else 'cyan',3,n=6)
        # Sword is separate skinned primitive, attached to right hand via joint.
        self.tube([-.38,.67,.02],[-.38,.54,.02],.018,.018,'leather',17,n=8)
        self.tube([-.46,.68,.02],[-.30,.68,.02],.018,.018,'gold',17,n=8)
        self.tube([-.38,.69,.02],[-.38,1.07,.02],.028,.001,'silver',17,n=4)

    def transformed(self,clip,t):
        qs,tr=pose(clip,t); mats=[]
        for i in range(len(NAMES)):
            m=np.eye(4);m[:3,:3]=rot(qs[i]);m[:3,3]=tr[i]
            mats.append(m if PARENT[i]<0 else mats[PARENT[i]]@m)
        result=[]
        for v,f,c,b in self.parts:
            p=(v-BIND[b])@mats[b][:3,:3].T+mats[b][:3,3]
            result.append((p,f,c,b))
        return result

    def export(self,path):
        data=bytearray(); views=[]; access=[]
        def acc(a,typ,component=5126,target=None,bounds=False):
            dtype={5126:'<f4',5123:'<u2',5125:'<u4'}[component]
            ar=np.array(a,dtype=dtype); data.extend(b'\x00'*((-len(data))%4));off=len(data);raw=ar.tobytes();data.extend(raw)
            view={'buffer':0,'byteOffset':off,'byteLength':len(raw)}
            if target:view['target']=target
            views.append(view); n=len(ar); ob={'bufferView':len(views)-1,'componentType':component,'count':n,'type':typ}
            if bounds:ob.update(min=np.min(ar,axis=0).reshape(-1).tolist(),max=np.max(ar,axis=0).reshape(-1).tolist())
            access.append(ob);return len(access)-1
        mats=[];matidx={}
        for _,_,c,_ in self.parts:
            if c not in matidx:
                matidx[c]=len(mats);mats.append({'name':c,'doubleSided':True,'pbrMetallicRoughness':{'baseColorFactor':[*rgb(c),1.0],'metallicFactor':.45 if c in ('gold','silver') else 0,'roughnessFactor':.65}})
        prim=[]
        # Group by material: smaller draw-call count while retaining independent joints.
        for c,mi in matidx.items():
            vs=[];fs=[];js=[];offset=0
            for v,f,color,b in self.parts:
                if color!=c:continue
                vs.append(v);fs.append(f+offset);offset+=len(v);js.extend([[b,0,0,0]]*len(v))
            v=np.concatenate(vs);f=np.concatenate(fs);norm=np.zeros_like(v)
            fn=np.cross(v[f[:,1]]-v[f[:,0]],v[f[:,2]]-v[f[:,0]])
            for k in range(3):np.add.at(norm,f[:,k],fn)
            norm/=np.maximum(np.linalg.norm(norm,axis=1,keepdims=True),1e-9)
            weights=np.zeros((len(v),4));weights[:,0]=1
            attrs={'POSITION':acc(v,'VEC3',target=34962,bounds=True),'NORMAL':acc(norm,'VEC3',target=34962),
                'JOINTS_0':acc(js,'VEC4',5123,34962),'WEIGHTS_0':acc(weights,'VEC4',target=34962)}
            prim.append({'attributes':attrs,'indices':acc(f.reshape(-1),'SCALAR',5125,34963),'material':mi})
        nodes=[{'name':f'{self.sex}_{self.costume}','mesh':0,'skin':0}]
        for i,name in enumerate(NAMES):
            node={'name':name,'translation':LOCAL[i].tolist()}
            children=[j+1 for j,p in enumerate(PARENT) if p==i]
            if children:node['children']=children
            nodes.append(node)
        ib=[]
        for p in BIND:
            m=np.eye(4);m[:3,3]=-p;ib.append(m.T.reshape(-1))
        inv=acc(ib,'MAT4');anims=[]
        for clip,d in DURATIONS.items():
            times=np.linspace(0,d,33);ti=acc(times,'SCALAR',bounds=True)
            poses=[pose(clip,t) for t in times];samplers=[];channels=[]
            for b in range(len(NAMES)):
                for prop,typ,vals in [('rotation','VEC4',[p[0][b] for p in poses]),('translation','VEC3',[p[1][b] for p in poses])]:
                    oi=acc(vals,typ);samplers.append({'input':ti,'output':oi,'interpolation':'LINEAR'})
                    channels.append({'sampler':len(samplers)-1,'target':{'node':b+1,'path':prop}})
            anims.append({'name':clip,'samplers':samplers,'channels':channels,'extras':{'loopRecommended':clip in ['Idle','Walk','Run']}})
        doc={'asset':{'version':'2.0','generator':'Aether Trail procedural prototype 1.0'},'scene':0,'scenes':[{'nodes':[0,1]}],
             'nodes':nodes,'meshes':[{'name':'Avatar','primitives':prim}],'materials':mats,
             'skins':[{'name':'AvatarRig','skeleton':1,'joints':list(range(1,len(NAMES)+1)),'inverseBindMatrices':inv}],
             'animations':anims,'accessors':access,'bufferViews':views,'buffers':[{'byteLength':len(data)}],
             'extras':{'status':'procedural blockout, not final reference-matched sculpt','sex':self.sex,'costume':self.costume,'units':'meters','up':'+Y','front':'+Z'}}
        raw=json.dumps(doc,separators=(',',':')).encode();raw+=b' '*((-len(raw))%4);data.extend(b'\x00'*((-len(data))%4))
        path.write_bytes(struct.pack('<III',0x46546c67,2,12+8+len(raw)+8+len(data))+struct.pack('<II',len(raw),0x4e4f534a)+raw+struct.pack('<II',len(data),0x004e4942)+data)
        return doc

FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def render(model,clip='Idle',t=0,size=(420,460),yaw=-.32):
    w,h=size;im=Image.new('RGB',size,'#eeeae1');draw=ImageDraw.Draw(im)
    draw.ellipse((w*.18,h*.86,w*.82,h*.94),fill='#d5d0c7')
    cy,sy=math.cos(yaw),math.sin(yaw)
    ry=np.array([[cy,0,sy],[0,1,0],[-sy,0,cy]])
    rx=np.array([[1,0,0],[0,.985,-.174],[0,.174,.985]])
    camera=rx@ry;scale=min(w*.66,h*.43)
    tris=[];light=np.array([-.4,.7,1]);light/=np.linalg.norm(light)
    for v,f,c,b in model.transformed(clip,t):
        v=v@camera.T
        norms=np.cross(v[f[:,1]]-v[f[:,0]],v[f[:,2]]-v[f[:,0]])
        lens=np.maximum(np.linalg.norm(norms,axis=1),1e-9);norms/=lens[:,None]
        intensity=.47+.53*np.maximum(0,norms@light)
        p=np.stack([w/2+v[:,0]*scale,h*.88-v[:,1]*scale],axis=1)
        color=rgb(c)*255
        for k,face in enumerate(f):
            if norms[k,2]<0:continue
            col=tuple(np.clip(color*intensity[k],0,255).astype(int))
            tris.append((float(v[face,2].mean()),[tuple(q) for q in p[face]],col))
    for _,pts,col in sorted(tris,key=lambda x:x[0]):draw.polygon(pts,fill=col)
    return im

def main():
    for d in ['models','previews']:(OUT/d).mkdir(exist_ok=True)
    report=[];models={}
    for sex in ['male','female']:
        for costume in ['traveler','sovereign','commander','celestial']:
            m=Model(sex,costume);models[sex,costume]=m
            p=OUT/'models'/f'avatar_{sex}_{costume}.glb';doc=m.export(p)
            report.append({'file':p.name,'bytes':p.stat().st_size,'vertices':sum(len(v) for v,_,_,_ in m.parts),
                'triangles':sum(len(f) for _,f,_,_ in m.parts),'joints':len(NAMES),'clips':list(DURATIONS)})
    font=ImageFont.truetype(FONT,22)
    sheet=Image.new('RGB',(1680,1000),'#f7f3eb');dr=ImageDraw.Draw(sheet)
    for row,sex in enumerate(['male','female']):
        for col,costume in enumerate(['traveler','sovereign','commander','celestial']):
            sheet.paste(render(models[sex,costume]),(col*420,row*500))
            dr.text((col*420+20,row*500+465),f'{sex.title()} / {costume.title()}',font=font,fill='#203a59')
    sheet.save(OUT/'previews'/'costumes_actual_models.png')
    for sex in ['male','female']:
        m=models[sex,'traveler']; frames=[]
        for k in range(24):
            frame=render(m,'Walk',k/24,size=(420,460));ImageDraw.Draw(frame).text((15,15),f'{sex.title()} - Walk',font=font,fill='#203a59');frames.append(frame)
        frames[0].save(OUT/'previews'/f'{sex}_walk.gif',save_all=True,append_images=frames[1:],duration=42,loop=0)
    # Demonstrate all real motion clips, one per segment, male and female side by side.
    frames=[]
    for clip,d in DURATIONS.items():
        for k in range(18):
            frame=Image.new('RGB',(760,450),'#eeeae1')
            for j,sex in enumerate(['male','female']):frame.paste(render(models[sex,'traveler'],clip,d*k/17,size=(380,420)),(j*380,30))
            ImageDraw.Draw(frame).text((20,8),clip+' / procedural rig preview',font=font,fill='#203a59');frames.append(frame)
    frames[0].save(OUT/'previews'/'all_8_animations.gif',save_all=True,append_images=frames[1:],duration=75,loop=0)
    (OUT/'model_manifest.json').write_text(json.dumps(report,indent=2))
    print(json.dumps(report,indent=2))

if __name__=='__main__':main()
