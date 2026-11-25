/* Illustrations des spécialités et avatars des personnages */
const PR=['<rect x="100" y="70" width="10" height="20"/><rect x="115" y="55" width="10" height="35"/><rect x="130" y="62" width="10" height="28"/>',
'<rect x="100" y="48" width="30" height="40" rx="3"/><circle cx="138" cy="76" r="10" fill="none" stroke="currentColor" stroke-width="4"/><path d="M145 84l9 9" stroke="currentColor" stroke-width="4"/>',
'<path d="M98 88a22 22 0 0144 0z"/><path d="M120 88l12-20" stroke="#fff" stroke-width="3"/>',
'<rect x="94" y="48" width="34" height="22" rx="8"/><rect x="116" y="74" width="34" height="22" rx="8" opacity=".6"/>',
'<rect x="96" y="66" width="22" height="22"/><rect x="122" y="66" width="22" height="22" opacity=".6"/><rect x="109" y="44" width="22" height="22" opacity=".8"/>',
'<path d="M98 66l34-14v44l-34-14z"/><rect x="92" y="64" width="10" height="18" rx="3"/><circle cx="142" cy="74" r="4"/>',
'<circle cx="120" cy="64" r="16"/><rect x="113" y="80" width="14" height="8" rx="2"/>',
'<rect x="108" y="48" width="24" height="12" rx="3"/><rect x="92" y="75" width="22" height="12" rx="3"/><rect x="126" y="75" width="22" height="12" rx="3"/><path d="M120 60v8M103 75v-7h34v7" stroke="currentColor" fill="none" stroke-width="2"/>'];
function scene(i,col){const p=(x,k)=>`<circle cx="${x}" cy="82" r="12" fill="${SKIN[(i+k)%4]}"/><rect x="${x-15}" y="96" width="30" height="40" rx="13" fill="${CLO[(i+k+1)%4]}"/>`;
return `<svg viewBox="0 0 240 140" role="img" aria-label="Illustration du métier" style="color:${col}"><rect width="240" height="140" fill="${col}" opacity=".16"/><circle cx="205" cy="28" r="40" fill="${col}" opacity=".18"/><g fill="currentColor">${PR[i]}</g>${p(62,0)}${p(178,2)}<rect y="124" width="240" height="16" fill="${col}" opacity=".5"/></svg>`}
// mètres [libellé, unité, départ] ; options [libellé, explication, effets[3], qualités "analyse/risque/décision/adaptation"]
const HAIR=['#2b2118','#6b3f1d','#1d1d1d','#b5651d'];
function av(i,k,m){const s=SKIN[(i+k)%4],h=HAIR[(i*2+k)%4],c=CLO[(i+k+1)%4],br=['M37 37h10M53 37h10','M36 38l12-3M64 38l-12-3','M36 35l12 4M64 35l-12 4'][m],mo=['M43 56q7 5 14 0','M43 59q7-5 14 0','M43 58h14'][m];return `<svg viewBox="0 0 100 100" role="img" aria-label="Personnage"><path d="M10 100q0-26 40-26t40 26z" fill="${c}"/><rect x="43" y="60" width="14" height="16" fill="${s}"/><circle cx="50" cy="42" r="22" fill="${s}"/><path d="M28 42q0-26 22-26t22 26q-8-14-22-14t-22 14z" fill="${h}"/><circle cx="42" cy="45" r="2.6" fill="#222"/><circle cx="58" cy="45" r="2.6" fill="#222"/><path d="${br}" stroke="#222" stroke-width="2" fill="none" stroke-linecap="round"/><path d="${mo}" stroke="#222" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`}
