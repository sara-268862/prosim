/* PRO SIM – avatar personnalisable (SVG généré) : 6 teints, 6 couleurs de cheveux, 10 coiffures, 4 tenues, 4 accessoires */
const CH={
skin:['#f6d5b8','#e8b98f','#d19a6a','#a9714b','#8d5a3b','#5e3a24'],
hairC:['#1a1a1f','#4a2c17','#8a5a2b','#d9a441','#b5361e','#9aa3ad'],
hair:['Courte','Dégradée (Fade)','Bouclée','Ondulée','Carré (Bob)','Longue','Queue-de-cheval','Chignon','Hijab classique','Hijab moderne'],
eyes:['#2b1b10','#3d6fb6','#2f8f5b','#7a5a2a'],
brows:['Droits','Arqués','Épais'],mouth:['Sourire','Neutre','Grand sourire'],
beard:['Aucune','Barbe courte','Moustache','Bouc'],
outfit:['Smart Casual','Costume gris anthracite','Tenue de direction dorée','Blazer bleu marine'],
outC:['#1a6b7c','#3a3f4a','#c9a227','#0c2340'],
acc:['Aucun accessoire','Lunettes','Casque audio','Pin’s'],
trait:['Analytique','Audacieux·se','Prudent·e','Créatif·ve','Leader','Empathique'],
goal:['Devenir expert reconnu','Fonder mon entreprise','Diriger une équipe','Maîtriser la finance']};
const CHN={skin:6,hairC:6,hair:10,eyes:4,brows:3,mouth:3,beard:4,outfit:4,acc:4,trait:6,goal:4,age:3,build:3};
const defChar=()=>({skin:1,hairC:1,hair:0,eyes:0,brows:0,mouth:0,beard:0,outfit:3,acc:0,trait:0,goal:0,age:1,build:1,v:2});
/* Normalise un avatar enregistré (anciennes versions : coiffure, tenue et accessoire repartent des valeurs par défaut) */
function normChar(c){c=Object.assign(defChar(),c||{});if(c.v!==2){c.hair=0;c.outfit=3;c.acc=0;c.v=2}
Object.keys(CHN).forEach(k=>{c[k]=Math.max(0,Math.min(CHN[k]-1,c[k]|0))});return c}
function randChar(c){const r=n=>Math.floor(Math.random()*n);Object.keys(CHN).forEach(k=>{let i;do{i=r(CHN[k])}while(lockLv(k,i)>myRank());c[k]=i});c.v=2;return c}
function charSvg(c,px=120,bust=true){c=normChar(c);const sk=CH.skin[c.skin],hc=CH.hairC[c.hairC],oc=CH.outC[c.outfit],w=[.92,1,1.1][c.build],o=c.outfit,hij=c.hair>=8;
const dark=o===2?'#8a6d12':o===1?'#262a33':o===3?'#071a30':'rgba(0,0,0,.2)';
let s=`<svg viewBox="0 0 120 130" width="${px}" height="${px*130/120}" role="img" aria-label="Avatar" xmlns="http://www.w3.org/2000/svg">`;
/* cheveux arrière */
s+={3:`<path d="M32 56c-2 20 2 34 8 38h40c6-4 10-18 8-38z" fill="${hc}"/>`,4:`<path d="M31 54v36c0 4 4 6 8 6h42c4 0 8-2 8-6V54z" fill="${hc}"/>`,5:`<path d="M30 58c-4 30 0 52 10 56h40c10-4 14-26 10-56z" fill="${hc}"/>`,6:`<path d="M84 40c14 4 16 26 8 40" stroke="${hc}" stroke-width="9" fill="none" stroke-linecap="round"/>`,7:`<circle cx="60" cy="14" r="10" fill="${hc}"/>`}[c.hair]||'';
/* tenue */
s+=`<g transform="translate(60 0) scale(${w} 1) translate(-60 0)"><path d="M18 130c0-26 16-38 42-38s42 12 42 38z" fill="${oc}"/>`;
if(o===0)s+=`<path d="M48 92l12 14 12-14" fill="#f8fafc" stroke="${dark}" stroke-width="1.5"/><path d="M60 106v24" stroke="${dark}" stroke-width="1.5"/><circle cx="60" cy="114" r="1.4" fill="${dark}"/>`;
else{s+=`<path d="M60 92l-14 12 14 26 14-26z" fill="#f8fafc"/><path d="M46 92l14 38-26 0z M74 92l-14 38 26 0z" fill="${dark}"/>`;
if(o===1)s+=`<path d="M57 100h6l3 20-6 6-6-6z" fill="#c0392b"/>`;
if(o===2)s+=`<path d="M57 100h6l3 20-6 6-6-6z" fill="#1b1f3b"/><path d="M34 112h10v5H34z" fill="#fff" opacity=".85"/>`}
if(c.acc===3)s+=`<circle cx="${o===0?70:74}" cy="108" r="3.4" fill="#f2c94c" stroke="#b8860b" stroke-width="1"/><circle cx="${o===0?70:74}" cy="108" r="1.2" fill="#b8860b"/>`;
s+=`</g><rect x="52" y="78" width="16" height="18" rx="6" fill="${sk}"/><rect x="52" y="86" width="16" height="6" fill="rgba(0,0,0,.1)"/>`;
/* tête */
s+=`<ellipse cx="60" cy="56" rx="26" ry="30" fill="${sk}"/><ellipse cx="34.5" cy="58" rx="4" ry="6" fill="${sk}"/><ellipse cx="85.5" cy="58" rx="4" ry="6" fill="${sk}"/>`;
if(c.age===2)s+=`<path d="M46 40q4-3 8 0M66 40q4-3 8 0" stroke="rgba(0,0,0,.2)" fill="none"/>`;
if(c.beard===1)s+=`<path d="M36 60c0 24 12 32 24 32s24-8 24-32c-6 14-14 16-24 16S42 74 36 60z" fill="${hc}" opacity=".92"/>`;
if(c.beard===2)s+=`<path d="M48 72q12-6 24 0q-12 4-24 0z" fill="${hc}"/>`;
if(c.beard===3)s+=`<path d="M52 74q8-3 16 0v10q-8 6-16 0z" fill="${hc}"/>`;
const ey=CH.eyes[c.eyes],by=[[0,0],[-1.5,1],[0,-1]][c.brows];
[44,76].forEach(x=>{s+=`<ellipse cx="${x}" cy="56" rx="5" ry="${c.mouth===2?4:5.5}" fill="#fff"/><circle cx="${x}" cy="56.5" r="3.2" fill="${ey}"/><circle cx="${x+1}" cy="55.2" r="1" fill="#fff"/>`});
s+=`<path d="M38 47q6 ${-3+by[1]} 12 0M70 47q6 ${-3+by[1]} 12 0" stroke="${hij?'#2b1b10':hc}" stroke-width="${c.brows===2?4:2.4}" fill="none" stroke-linecap="round"/>`;
s+=[`<path d="M51 72q9 8 18 0" stroke="#7a2e2e" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,`<path d="M52 74h16" stroke="#7a2e2e" stroke-width="2.6" stroke-linecap="round"/>`,`<path d="M49 71q11 13 22 0z" fill="#7a2e2e"/><path d="M52 71h16q-8 4-16 0z" fill="#fff"/>`][c.mouth];
s+=`<path d="M60 58q-3 8 0 10q3 0 3-1" stroke="rgba(0,0,0,.25)" fill="none" stroke-width="1.6" stroke-linecap="round"/>`;
/* cheveux avant / hijab */
const hole='M37 58a23 27 0 1 0 46 0a23 27 0 1 0-46 0z';
s+={0:`<path d="M33 52c-2-24 12-34 27-34s30 10 27 34c-4-12-12-18-26-18s-22 6-28 18z" fill="${hc}"/>`,
1:`<path d="M36 48c-1-20 10-30 24-30s25 10 24 30c-3-9-10-13-24-13s-21 4-24 13z" fill="${hc}"/><path d="M33 50c-1 10 0 16 3 20l3-3c-1-6-2-12-1-20zM87 50c1 10 0 16-3 20l-3-3c1-6 2-12 1-20z" fill="${hc}" opacity=".35"/>`,
2:`<g fill="${hc}"><circle cx="40" cy="38" r="11"/><circle cx="52" cy="28" r="12"/><circle cx="68" cy="28" r="12"/><circle cx="80" cy="38" r="11"/><circle cx="60" cy="24" r="11"/></g>`,
3:`<path d="M32 56c-4-28 10-40 28-40s32 12 28 40c-2-10-8-20-14-22-8 6-24 8-34 0-4 6-6 14-8 22z" fill="${hc}"/>`,
4:`<path d="M31 56c-3-28 9-40 29-40s32 12 29 40c-1-8-3-14-6-18-8 6-26 8-40 0-4 4-10 10-12 18z" fill="${hc}"/>`,
5:`<path d="M32 58c-4-30 10-42 28-42s32 12 28 42c-4-14-10-24-16-26-10 8-26 8-34 0-4 6-6 16-6 26z" fill="${hc}"/>`,
6:`<path d="M33 54c-2-26 12-36 27-36s30 10 27 36c-4-12-12-18-26-18s-22 6-28 18z" fill="${hc}"/>`,
7:`<path d="M33 52c-2-24 12-34 27-34s30 10 27 34c-4-12-12-18-26-18s-22 6-28 18z" fill="${hc}"/>`,
8:`<path fill-rule="evenodd" fill="${hc}" d="M22 62C18 22 38 8 60 8s42 14 38 54c0 14 3 28 7 40-10 8-28 12-45 12s-35-4-45-12c4-12 7-26 7-40z${hole}"/><path d="M30 100q30 14 60 0" stroke="rgba(0,0,0,.15)" stroke-width="2" fill="none"/>`,
9:`<path fill-rule="evenodd" fill="${hc}" d="M24 62C20 24 38 8 60 8s40 16 36 54c0 12 2 20 4 26-12 8-26 12-40 12S32 96 20 88c2-6 4-14 4-26z${hole}"/><path d="M28 86q32 16 64 0" stroke="rgba(0,0,0,.18)" fill="none" stroke-width="2"/>`}[c.hair];
if(c.acc===1)s+=`<g fill="none" stroke="#1b1f3b" stroke-width="2"><circle cx="44" cy="56" r="9"/><circle cx="76" cy="56" r="9"/><path d="M53 56h14"/></g>`;
if(c.acc===2)s+=`<path d="M32 56c-4-30 8-42 28-42s32 12 28 42" fill="none" stroke="#1b1f3b" stroke-width="4"/><rect x="26" y="52" width="9" height="16" rx="4" fill="#1fa97a"/><rect x="85" y="52" width="9" height="16" rx="4" fill="#1fa97a"/><path d="M30 68q6 14 24 14" stroke="#1b1f3b" stroke-width="2" fill="none"/>`;
return s+'</svg>'}
const cOf=u=>normChar(AV.get(u?u.id:GID));
