import fs from 'fs';
import occtimportjs from 'occt-import-js';
const occt = await occtimportjs();
const buf = new Uint8Array(fs.readFileSync(process.argv[2]));
const r = occt.ReadStepFile(buf, { linearUnit: 'millimeter', linearDeflectionType: 'bounding_box_ratio', linearDeflection: 0.0015, angularDeflection: 0.25 });
console.log('success', r.success, 'meshes', r.meshes.length);
const tree=(n,d=0)=>{console.log(' '.repeat(d*2)+n.name, n.meshes); n.children.forEach(c=>tree(c,d+1));}; tree(r.root);
r.meshes.forEach((m,i)=>{const p=m.attributes.position.array; let mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9]; for(let j=0;j<p.length;j+=3)for(let k=0;k<3;k++){mn[k]=Math.min(mn[k],p[j+k]);mx[k]=Math.max(mx[k],p[j+k]);}
console.log(i,m.name,'verts',p.length/3,'tris',m.index.array.length/3,'faces',m.brep_faces?.length,'color',m.color,'min',mn.map(v=>v.toFixed(1)),'max',mx.map(v=>v.toFixed(1)));});
fs.mkdirSync('out', { recursive: true });
fs.writeFileSync('out/raw.json', JSON.stringify(r.meshes.map(m=>({name:m.name,color:m.color,pos:Array.from(m.attributes.position.array),nrm:m.attributes.normal?Array.from(m.attributes.normal.array):null,idx:Array.from(m.index.array),faces:m.brep_faces}))));
