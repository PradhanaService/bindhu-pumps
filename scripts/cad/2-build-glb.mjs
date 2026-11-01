import fs from 'fs';
import { Document, NodeIO } from '@gltf-transform/core';
import { EXTMeshoptCompression, KHRMeshQuantization } from '@gltf-transform/extensions';
import { weld, simplify, meshopt, dedup, prune, reorder, quantize } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder } from 'meshoptimizer';
const raw = JSON.parse(fs.readFileSync('out/raw.json'));
const names = ['cord','pump_end','housing','screw_1','screw_2','screw_3','screw_4'];
// center on housing: x,z centre of housing bbox, y at base of housing
const h = raw[2].pos; let mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9];
for(let j=0;j<h.length;j+=3)for(let k=0;k<3;k++){mn[k]=Math.min(mn[k],h[j+k]);mx[k]=Math.max(mx[k],h[j+k]);}
const off=[(mn[0]+mx[0])/2, mn[1], (mn[2]+mx[2])/2];
console.log('offset mm', off);
const doc = new Document(); const buffer = doc.createBuffer();
const scene = doc.createScene('pump');
const root = doc.createNode('reference_pump'); scene.addChild(root);
raw.forEach((m,i)=>{
  const p = new Float32Array(m.pos.length);
  for(let j=0;j<p.length;j+=3){ for(let k=0;k<3;k++) p[j+k]=(m.pos[j+k]-off[k])/1000; }
  const pos = doc.createAccessor().setType('VEC3').setArray(p).setBuffer(buffer);
  const nrm = doc.createAccessor().setType('VEC3').setArray(new Float32Array(m.nrm)).setBuffer(buffer);
  const idx = doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(m.idx)).setBuffer(buffer);
  const mat = doc.createMaterial(names[i]+'_mat');
  const prim = doc.createPrimitive().setAttribute('POSITION',pos).setAttribute('NORMAL',nrm).setIndices(idx).setMaterial(mat);
  const mesh = doc.createMesh(names[i]).addPrimitive(prim);
  root.addChild(doc.createNode(names[i]).setMesh(mesh));
});
await MeshoptSimplifier.ready; await MeshoptEncoder.ready;
await doc.transform(
  weld({}),
  simplify({ simplifier: MeshoptSimplifier, ratio: 0.55, error: 0.0004 }),
  dedup(), prune(),
  reorder({ encoder: MeshoptEncoder }),
);
doc.getRoot().listMeshes().forEach(m=>console.log(m.getName(), m.listPrimitives()[0].getIndices().getCount()/3,'tris'));
const io = new NodeIO().registerExtensions([EXTMeshoptCompression, KHRMeshQuantization]).registerDependencies({'meshopt.encoder': MeshoptEncoder});
await io.write('out/reference-pump-uncompressed.glb', doc);
await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write('out/reference-pump.glb', doc);
fs.copyFileSync('out/reference-pump.glb', '../../public/models/reference-pump.glb');
console.log(fs.statSync('out/reference-pump-uncompressed.glb').size, fs.statSync('out/reference-pump.glb').size);
