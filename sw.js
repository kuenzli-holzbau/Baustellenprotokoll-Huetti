/* Offline-Speicher. Jede Programm-Kopie nutzt ein eigenes Präfix (aus sw.js?app=…)
   und räumt beim Aktualisieren NUR ihre eigenen Caches auf. */
const APPID=(new URL(self.location).searchParams.get('app')||'bp').replace(/[^a-z0-9_-]/gi,'');
const PREFIX=APPID+'-cache-';
const C=PREFIX+'v4';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
const CDN=['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js','https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(async c=>{await c.addAll(CORE);for(const u of CDN){try{const r=await fetch(u,{mode:'no-cors'});await c.put(u,r)}catch(_){}}}));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&(x.startsWith(PREFIX)||(APPID==='bp'&&/^baustellenprotokoll-v\d+$/.test(x)))).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
  if(!r.url.startsWith(self.registration.scope)&&!r.url.startsWith('https://cdnjs.cloudflare.com/'))return;
  if(r.mode==='navigate'){e.respondWith(fetch(r.url,{cache:'no-store',credentials:'same-origin'}).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(new URL('./index.html',self.registration.scope).href,cp));return res}).catch(()=>caches.match(new URL('./index.html',self.registration.scope).href,{cacheName:C})));return}
  e.respondWith(caches.open(C).then(c=>c.match(r.url).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){c.put(r.url,res.clone())}return res}))))});
