/* Effets sonores et musique (Web Audio) */
let AC=null,sfxOn=true,musOn=false,step=0,nextT=0,tmr=null;
function ctx(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();return AC}
function note(f,t,d,type,v){const c=AC,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d+.02)}
function sfx(k){if(!sfxOn||!ctx())return;const t=AC.currentTime,P={ok:[[523,0],[659,.09],[784,.18],[1047,.27]],bad:[[220,0],[165,.14],[110,.28]],mid:[[392,0],[349,.13]],tick:[[600,0]],win:[[523,0],[659,.12],[784,.24],[1047,.36],[784,.5],[1047,.62],[1319,.76]]}[k],ty={ok:'square',bad:'sawtooth',mid:'triangle',tick:'sine',win:'triangle'}[k];P.forEach(([f,d])=>note(f,t+d,k=='bad'?.22:.16,ty,.12))}
const LEAD=[72,75,79,75,77,75,72,70,72,75,79,84,82,79,75,77],BASS=[48,48,55,55,44,44,51,51,46,46,53,53,48,48,55,43],hz=n=>440*Math.pow(2,(n-69)/12);
function tick(){while(nextT<AC.currentTime+.3){note(hz(LEAD[step%16]),nextT,.16,'square',.035);if(step%2==0)note(hz(BASS[step%16]),nextT,.3,'triangle',.07);nextT+=.17;step++}}
function music(on){musOn=on;clearInterval(tmr);if(on&&ctx()){nextT=AC.currentTime+.05;tmr=setInterval(tick,100)}}
