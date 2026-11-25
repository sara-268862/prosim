/* Effets visuels : confettis (canvas, désactivés si « réduire les animations ») */
function confetti(n=140){if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
const c=document.createElement('canvas');c.setAttribute('aria-hidden','true');c.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:99';document.body.appendChild(c);
const x=c.getContext('2d'),w=c.width=innerWidth,h=c.height=innerHeight,col=['#0e7490','#1fa97a','#6fe0b8','#f5b82e','#e8761b','#d6336c'];
const P=Array.from({length:n},()=>({x:w/2+(Math.random()-.5)*w*.3,y:h*.35,vx:(Math.random()-.5)*12,vy:-Math.random()*13-3,s:5+Math.random()*6,r:Math.random()*6,vr:(Math.random()-.5)*.4,c:col[Math.random()*col.length|0]}));
let f=0;(function d(){x.clearRect(0,0,w,h);P.forEach(p=>{p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.vx*=.99;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/3,p.s,p.s*.6);x.restore()});
if(++f<150)requestAnimationFrame(d);else c.remove()})()}
