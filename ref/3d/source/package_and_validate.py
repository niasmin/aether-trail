from pathlib import Path
import json, struct, base64, zipfile
import numpy as np

ROOT=Path(__file__).resolve().parents[1]
def validate(path):
    raw=path.read_bytes();magic,version,length=struct.unpack_from('<III',raw)
    assert magic==0x46546c67 and version==2 and length==len(raw)
    jl,jtype=struct.unpack_from('<II',raw,12);assert jtype==0x4e4f534a
    doc=json.loads(raw[20:20+jl]);bl,btype=struct.unpack_from('<II',raw,20+jl)
    assert btype==0x004e4942;binary=raw[28+jl:];assert bl==len(binary)
    counts={'SCALAR':1,'VEC3':3,'VEC4':4,'MAT4':16};types={5126:'<f4',5123:'<u2',5125:'<u4'}
    def ac(i):
        a=doc['accessors'][i];v=doc['bufferViews'][a['bufferView']];off=v.get('byteOffset',0)+a.get('byteOffset',0)
        dt=np.dtype(types[a['componentType']]);n=a['count']*counts[a['type']]
        assert off%dt.itemsize==0 and off+n*dt.itemsize<=v.get('byteOffset',0)+v['byteLength']<=len(binary)
        ar=np.frombuffer(binary,dtype=dt,count=n,offset=off).reshape(a['count'],counts[a['type']]);assert np.isfinite(ar).all();return ar
    for i in range(len(doc['accessors'])):ac(i)
    skin=doc['skins'][0];assert len(skin['joints'])==18
    # Independent rest-matrix reconstruction checks inverse bind ordering.
    parents={c:i for i,n in enumerate(doc['nodes']) for c in n.get('children',[])}
    def world(i):
        m=np.eye(4);m[:3,3]=doc['nodes'][i].get('translation',[0,0,0])
        return world(parents[i])@m if i in parents else m
    ib=ac(skin['inverseBindMatrices'])
    for i,j in enumerate(skin['joints']):assert np.allclose(world(j)@ib[i].reshape(4,4).T,np.eye(4),atol=1e-6)
    for p in doc['meshes'][0]['primitives']:
        a=p['attributes'];pos=ac(a['POSITION']);normal=ac(a['NORMAL']);j=ac(a['JOINTS_0']);w=ac(a['WEIGHTS_0']);idx=ac(p['indices'])
        assert len(pos)==len(normal)==len(j)==len(w)
        assert j.max()<18 and idx.max()<len(pos) and len(idx)%3==0
        assert np.allclose(w.sum(axis=1),1) and w.min()>=0
        assert np.allclose(np.linalg.norm(normal,axis=1),1,atol=1e-4)
    assert [a['name'] for a in doc['animations']]==['Idle','Walk','Run','Attack','Cast','Hit','Victory','Defeat']
    for anim in doc['animations']:
        changed=False
        assert len(anim['channels'])==36
        for c in anim['channels']:
            s=anim['samplers'][c['sampler']];ts=ac(s['input']).ravel();values=ac(s['output'])
            assert len(ts)==len(values) and np.all(np.diff(ts)>0) and ts[0]==0
            assert 0<=c['target']['node']<len(doc['nodes'])
            if c['target']['path']=='rotation':assert np.allclose(np.linalg.norm(values,axis=1),1,atol=1e-5)
            changed |= not np.allclose(values,values[0])
        assert changed,anim['name']
    return {'file':path.name,'bytes':len(raw),'result':'PASS: GLB structure, buffers, indices, weights, bind matrices, 8 animated clips'}

def package():
    results=[validate(p) for p in sorted((ROOT/'models').glob('*.glb'))];assert len(results)==8
    assets={p.stem.removeprefix('avatar_'):base64.b64encode(p.read_bytes()).decode() for p in sorted((ROOT/'models').glob('*.glb'))}
    html=(ROOT/'source/viewer_template.html').read_text().replace('__ASSETS__',json.dumps(assets,separators=(',',':')))
    (ROOT/'Aether_Trail_3D_Viewer.html').write_text(html)
    (ROOT/'validation_report.json').write_text(json.dumps(results,indent=2))
    print(json.dumps(results,indent=2))

if __name__=='__main__':package()
