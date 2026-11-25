/* Construction des questions (scénario + question + options mélangées) */
function BM(){const m=(a,b)=>`<div class="m"><small>${a}</small><strong>${b}</strong></div>`,md=S.cfg.mode;return m('Question',(S.i+1)+' sur '+S.n)+m('Score',S.pts)+m('Série',S.streak)+m('Niveau',md==='daily'?'Défi du jour':md==='review'?'Révision':LN[S.cfg.diff])}
function SQ(x,sp,fi){if(Array.isArray(x))return{s:x[0],q:x[1]};const k=x.lastIndexOf('. ');if(x.endsWith('?')){if(k<3){const p=SPK[fi][sp];return{s:'Réunion avec '+p[0]+' ('+p[1].toLowerCase()+').',q:x}}return{s:x.slice(0,k+1),q:x.slice(k+2)}}return{s:x,q:'Quelle est la décision la plus appropriée ?'}}
const shuf=(a,r=Math.random)=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
/* Une question de la banque : fi = index de spécialité, dg = niveau, j = rang dans le niveau */
function mkq(fi,dg,j,label){const q=BANK[F[fi].n][dg][j],g=b=>[0,1,2,3].map(s=>(b+(s==q[1]?1:0)).toString(36)).join('');
return{t:label,...SQ(q[2],q[0],fi),h:HT[q[1]],bk:1,sp:q[0],fi,dg,j,o:shuf([[q[3],q[6],[],g(9)],[q[4],'Acceptable, mais moins pertinent.',[],g(5)],[q[5],'Choix risqué ou inadapté.',[],g(2)]])}}
function rounds(f,dg){const B=BANK[f.n];if(!B)return f.r;const fi=F.indexOf(f);return B[dg].map((q,j)=>mkq(fi,dg,j,'Question '+(j+1)+' sur '+B[dg].length))}
// [personnage, compétence (0 analyse, 1 risque, 2 décision, 3 adaptabilité), question, meilleure option, option moyenne, mauvaise option, explication]
