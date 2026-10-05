const C='baustellenprotokoll-v3';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
const CDN=['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js','https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(async c=>{await c.addAll(CORE);for(const u of CDN){try{const r=await fetch(u,{mode:'no-cors'});await c.put(u,r)}catch(_){}}}));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
  if(!r.url.startsWith(self.registration.scope)&&!r.url.startsWith('https://cdnjs.cloudflare.com/'))return;
  if(r.mode==='navigate'){e.respondWith(fetch(r.url,{cache:'no-store',credentials:'same-origin'}).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put('./index.html',cp));return res}).catch(()=>caches.match('./index.html')));return}
  e.respondWith(caches.match(r.url).then(m=>m||fetch(r).then(res=>{if(r.url.startsWith('https://cdnjs.cloudflare.com/')||r.url.startsWith(self.registration.scope)){const cp=res.clone();caches.open(C).then(c=>c.put(r.url,cp))}return res})))});
