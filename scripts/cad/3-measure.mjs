import fs from 'fs';
const raw = JSON.parse(fs.readFileSync('out/raw.json'));
const off=[0,-100.692,-4.2535];
const bb=(pts)=>{let mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9];for(const p of pts)for(let k=0;k<3;k++){mn[k]=Math.min(mn[k],p[k]);mx[k]=Math.max(mx[k],p[k]);}return {mn:mn.map(v=>+v.toFixed(1)),mx:mx.map(v=>+v.toFixed(1)),size:mx.map((v,k)=>+(v-mn[k]).toFixed(1))};};
const pts=i=>{const a=raw[i].pos,o=[];for(let j=0;j<a.length;j+=3)o.push([a[j]-off[0],a[j+1]-off[1],a[j+2]-off[2]]);return o;};
const names=['cord','pump_end','housing','s1','s2','s3','s4'];
let all=[];names.forEach((n,i)=>{const p=pts(i);all=all.concat(p);console.log(n,JSON.stringify(bb(p)));});
console.log('ALL',JSON.stringify(bb(all)));
const pe=pts(1);
// histogram of y for pump end
for(let y=0;y<=120;y+=5){const s=pe.filter(p=>p[1]>=y&&p[1]<y+5);if(s.length)console.log('y',y,s.length,JSON.stringify(bb(s)));}
// spigot top region
const top=pe.filter(p=>p[1]>100);console.log('spigot',JSON.stringify(bb(top)));
let cx=(bb(top).mn[0]+bb(top).mx[0])/2,cz=(bb(top).mn[2]+bb(top).mx[2])/2;let rmax=0;top.forEach(p=>rmax=Math.max(rmax,Math.hypot(p[0]-cx,p[2]-cz)));console.log('spigot center',cx,cz,'rmax',rmax);
// front face (max z)
const front=pe.filter(p=>p[2]>115);console.log('front',JSON.stringify(bb(front)));
// housing at different heights
const h=pts(2);for(let y=0;y<=140;y+=10){const s=h.filter(p=>p[1]>=y&&p[1]<y+10);if(s.length)console.log('h y',y,JSON.stringify(bb(s).size));}
