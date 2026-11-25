/* Lecture / écriture JSON sécurisées (jamais d'exception : valeur par défaut ou false en cas d'échec) */
const safeReadJSON=(key,def=null)=>{const v=jget(LS.get(key),def);return v==null?def:v};
const safeWriteJSON=(key,val)=>{try{return LS.set(key,JSON.stringify(val))}catch(e){return false}};
