if(!self.define){let s,e={};const l=(l,r)=>(l=new URL(l+".js",r).href,e[l]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=l,s.onload=e,document.head.appendChild(s)}else s=l,importScripts(l),e()})).then((()=>{let s=e[l];if(!s)throw new Error(`Module ${l} didn’t register its module`);return s})));self.define=(r,i)=>{const n=s||("document"in self?document.currentScript.src:"")||location.href;if(e[n])return;let a={};const u=s=>l(s,n),v={module:{uri:n},exports:a,require:u};e[n]=Promise.all(r.map((s=>v[s]||u(s)))).then((s=>(i(...s),a)))}}define(["./workbox-3625d7b0"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"assets/404-f942b294.svg",revision:null},{url:"assets/abs001-45d5984e.svg",revision:null},{url:"assets/abs002-0cd44ce1.svg",revision:null},{url:"assets/abs003-a1670f4a.svg",revision:null},{url:"assets/abs004-b3091f02.svg",revision:null},{url:"assets/abs005-d74eef52.svg",revision:null},{url:"assets/abs006-cb9c0865.svg",revision:null},{url:"assets/abs007-822b8cd5.svg",revision:null},{url:"assets/abs008-b3e637f3.svg",revision:null},{url:"assets/abs009-45470377.svg",revision:null},{url:"assets/abs010-a6fbba4b.svg",revision:null},{url:"assets/abs011-93ab8668.svg",revision:null},{url:"assets/abs012-709bccf3.svg",revision:null},{url:"assets/abs013-59e9f420.svg",revision:null},{url:"assets/abs014-0b98fcb8.svg",revision:null},{url:"assets/abs015-fe2c97aa.svg",revision:null},{url:"assets/abs016-33ac69de.svg",revision:null},{url:"assets/abs017-b9ff6fbf.svg",revision:null},{url:"assets/abs018-b77ed16a.svg",revision:null},{url:"assets/abs019-e735913b.svg",revision:null},{url:"assets/abs020-2bbacced.svg",revision:null},{url:"assets/abs021-31bcf060.svg",revision:null},{url:"assets/abs022-246916d5.svg",revision:null},{url:"assets/abs023-1c572929.svg",revision:null},{url:"assets/abs024-cbe632e2.svg",revision:null},{url:"assets/abs025-33e2ff6f.svg",revision:null},{url:"assets/abs026-2ea9d6be.svg",revision:null},{url:"assets/abs027-530a1760.svg",revision:null},{url:"assets/abs028-684dc631.svg",revision:null},{url:"assets/abs029-8f02383c.svg",revision:null},{url:"assets/abs030-9c0d76ff.svg",revision:null},{url:"assets/abs031-790fa3f4.svg",revision:null},{url:"assets/abs032-06159b98.svg",revision:null},{url:"assets/abs033-839e4055.svg",revision:null},{url:"assets/abs034-ac311271.svg",revision:null},{url:"assets/abs035-e246e0c9.svg",revision:null},{url:"assets/abs036-a8b1662a.svg",revision:null},{url:"assets/abs037-4481a70c.svg",revision:null},{url:"assets/abs038-5b9cbc64.svg",revision:null},{url:"assets/abs039-20d5f7a0.svg",revision:null},{url:"assets/abs040-f9e4b796.svg",revision:null},{url:"assets/abs041-24c3dee6.svg",revision:null},{url:"assets/abs042-c7a6690e.svg",revision:null},{url:"assets/abs043-6261dd07.svg",revision:null},{url:"assets/abs044-ca4a2f98.svg",revision:null},{url:"assets/abs045-3e9055b9.svg",revision:null},{url:"assets/abs046-dd3badd6.svg",revision:null},{url:"assets/abs047-1eac45fa.svg",revision:null},{url:"assets/abs048-55de02d4.svg",revision:null},{url:"assets/abs049-216de5aa.svg",revision:null},{url:"assets/android-471a1a9d.svg",revision:null},{url:"assets/announcement-5bfef0e6.svg",revision:null},{url:"assets/App-0be0214c.css",revision:null},{url:"assets/arr001-3df0ef37.svg",revision:null},{url:"assets/arr002-6124a932.svg",revision:null},{url:"assets/arr003-e7ce0c25.svg",revision:null},{url:"assets/arr004-65d24dea.svg",revision:null},{url:"assets/arr005-33e87399.svg",revision:null},{url:"assets/arr006-d2d9eceb.svg",revision:null},{url:"assets/arr007-28b257fc.svg",revision:null},{url:"assets/arr008-d913288b.svg",revision:null},{url:"assets/arr009-e97629d9.svg",revision:null},{url:"assets/arr010-5b59b9ee.svg",revision:null},{url:"assets/arr011-ce16274c.svg",revision:null},{url:"assets/arr012-10b50216.svg",revision:null},{url:"assets/arr013-366259f9.svg",revision:null},{url:"assets/arr014-ae916a32.svg",revision:null},{url:"assets/arr015-a28eb3be.svg",revision:null},{url:"assets/arr016-e3415061.svg",revision:null},{url:"assets/arr017-4332ad15.svg",revision:null},{url:"assets/arr018-40c04b1a.svg",revision:null},{url:"assets/arr019-5e7835a8.svg",revision:null},{url:"assets/arr020-5bb45de6.svg",revision:null},{url:"assets/arr021-d7db91fd.svg",revision:null},{url:"assets/arr022-1529bbc9.svg",revision:null},{url:"assets/arr023-8b6dee5f.svg",revision:null},{url:"assets/arr024-fcc08209.svg",revision:null},{url:"assets/arr025-034f9c19.svg",revision:null},{url:"assets/arr026-d4add4db.svg",revision:null},{url:"assets/arr027-201330ca.svg",revision:null},{url:"assets/arr028-c99544a5.svg",revision:null},{url:"assets/arr029-9605a6be.svg",revision:null},{url:"assets/arr030-6114995f.svg",revision:null},{url:"assets/arr031-00e73df6.svg",revision:null},{url:"assets/arr032-3be5bf1e.svg",revision:null},{url:"assets/arr033-a785a0a6.svg",revision:null},{url:"assets/arr034-4b45335b.svg",revision:null},{url:"assets/arr035-f69e5e7d.svg",revision:null},{url:"assets/arr036-1ec9f531.svg",revision:null},{url:"assets/arr037-7ddee67d.svg",revision:null},{url:"assets/arr038-b32a64c3.svg",revision:null},{url:"assets/arr039-93b20bf9.svg",revision:null},{url:"assets/arr040-efb21cfb.svg",revision:null},{url:"assets/arr041-21117319.svg",revision:null},{url:"assets/arr042-8582911e.svg",revision:null},{url:"assets/arr043-1ca7ddbb.svg",revision:null},{url:"assets/arr044-58074aa5.svg",revision:null},{url:"assets/arr045-8fc502ad.svg",revision:null},{url:"assets/arr046-483eb4ec.svg",revision:null},{url:"assets/arr047-0113af2d.svg",revision:null},{url:"assets/arr048-f83a5fea.svg",revision:null},{url:"assets/arr049-882d094e.svg",revision:null},{url:"assets/arr050-b1f85052.svg",revision:null},{url:"assets/arr051-39d8fd37.svg",revision:null},{url:"assets/arr052-c098bc9f.svg",revision:null},{url:"assets/arr053-4428f027.svg",revision:null},{url:"assets/arr054-971a1740.svg",revision:null},{url:"assets/arr055-9c1b24d5.svg",revision:null},{url:"assets/arr056-7c95fa4c.svg",revision:null},{url:"assets/arr057-0b19041a.svg",revision:null},{url:"assets/arr058-d4fadbc3.svg",revision:null},{url:"assets/arr059-5937dad7.svg",revision:null},{url:"assets/arrowRight-5556724b.svg",revision:null},{url:"assets/arrowtechart-de8e6705.svg",revision:null},{url:"assets/copy-2345760d.svg",revision:null},{url:"assets/discord-8e3b3e2f.svg",revision:null},{url:"assets/fil001-46682f16.svg",revision:null},{url:"assets/fil002-c6c178ac.svg",revision:null},{url:"assets/fil003-2c3a91b3.svg",revision:null},{url:"assets/fil004-485d89b1.svg",revision:null},{url:"assets/fil005-0cc5ed9a.svg",revision:null},{url:"assets/fil006-72f1aa89.svg",revision:null},{url:"assets/fil007-536f3b6a.svg",revision:null},{url:"assets/fil008-d04f1e58.svg",revision:null},{url:"assets/fil009-e0e29f4d.svg",revision:null},{url:"assets/fil010-6427b05e.svg",revision:null},{url:"assets/fil011-36ba9cda.svg",revision:null},{url:"assets/fil012-67be7057.svg",revision:null},{url:"assets/fil013-8621793e.svg",revision:null},{url:"assets/fil014-feda2285.svg",revision:null},{url:"assets/fil015-a2acacb9.svg",revision:null},{url:"assets/fil016-39400420.svg",revision:null},{url:"assets/fil017-4d022a40.svg",revision:null},{url:"assets/fil018-4d369708.svg",revision:null},{url:"assets/fil019-4c85554a.svg",revision:null},{url:"assets/fil020-976db673.svg",revision:null},{url:"assets/fil021-ad8cf416.svg",revision:null},{url:"assets/fil022-d48a9e33.svg",revision:null},{url:"assets/fil023-2d68da5a.svg",revision:null},{url:"assets/gen001-aa0ee8be.svg",revision:null},{url:"assets/gen002-909e1c6f.svg",revision:null},{url:"assets/gen003-d0cde7a0.svg",revision:null},{url:"assets/gen004-93fe1d59.svg",revision:null},{url:"assets/gen005-a89215d8.svg",revision:null},{url:"assets/gen006-fd093406.svg",revision:null},{url:"assets/gen007-f67fc0f1.svg",revision:null},{url:"assets/gen008-fe10dba6.svg",revision:null},{url:"assets/gen009-5852056c.svg",revision:null},{url:"assets/gen010-7b401681.svg",revision:null},{url:"assets/gen011-b88ca55c.svg",revision:null},{url:"assets/gen012-9ea1eaf6.svg",revision:null},{url:"assets/gen013-2fead4f6.svg",revision:null},{url:"assets/gen014-a73fe6d8.svg",revision:null},{url:"assets/gen015-9b8e7a6b.svg",revision:null},{url:"assets/gen016-b161fb0a.svg",revision:null},{url:"assets/gen017-c7785e1a.svg",revision:null},{url:"assets/gen018-3af155f5.svg",revision:null},{url:"assets/gen019-72c4e2c4.svg",revision:null},{url:"assets/gen020-9731ee75.svg",revision:null},{url:"assets/gra001-1c7b0617.svg",revision:null},{url:"assets/gra002-88f36c45.svg",revision:null},{url:"assets/gra003-10474482.svg",revision:null},{url:"assets/gra004-2c176c68.svg",revision:null},{url:"assets/gra005-d1095474.svg",revision:null},{url:"assets/gra006-12af9e81.svg",revision:null},{url:"assets/gra007-112f048d.svg",revision:null},{url:"assets/gra008-d3cb8b16.svg",revision:null},{url:"assets/gra009-9975d5d1.svg",revision:null},{url:"assets/gra010-be4f4245.svg",revision:null},{url:"assets/gra011-a14bdf26.svg",revision:null},{url:"assets/gra012-e3954e20.svg",revision:null},{url:"assets/index-b2b6d1b8.css",revision:null},{url:"assets/link-5a3aaf9b.svg",revision:null},{url:"assets/logo-4a8e422a.svg",revision:null},{url:"assets/main-eb4b0df7.js",revision:null},{url:"assets/payment-a55374d7.svg",revision:null},{url:"assets/tg-02569509.svg",revision:null},{url:"assets/ton-c61c0b24.svg",revision:null},{url:"assets/tonscan-57ec95e6.svg",revision:null},{url:"assets/tonviewer-de754e59.svg",revision:null},{url:"assets/tw-8634336f.svg",revision:null},{url:"favicon.ico",revision:"499bc7e639a63e1cceed96889e101df5"},{url:"icons/icon-128x128.png",revision:"b93497d19378b331e1928276662b9eec"},{url:"icons/icon-144x144.png",revision:"6e139dfe581c8f176518b117a8597c8f"},{url:"icons/icon-152x152.png",revision:"a8159ebf44f77c628f676db9d9d12e9e"},{url:"icons/icon-16x16.png",revision:"5572e73efff0ebae396133d15aeffc0c"},{url:"icons/icon-192x192.png",revision:"b75e9a83fb2778e6b66884f6450877c5"},{url:"icons/icon-32x32.png",revision:"e653e95d196a1cddf5dcaa3ad2b08376"},{url:"icons/icon-384x384.png",revision:"ad771db0a468ac8f0def2e79f26d7f16"},{url:"icons/icon-512x512.png",revision:"4161282647b011158166370582953cd4"},{url:"icons/icon-72x72.png",revision:"9a05f2acbe4aa4b52a978af03f6178c2"},{url:"icons/icon-96x96.png",revision:"eefc4ccbf2e57019b6043cae5168982a"},{url:"img/analytics.png",revision:"129d4c998e9a7c64d2e9e06d60276fe9"},{url:"img/bg.svg",revision:"988741278124f0b2a91a9ea6d22956aa"},{url:"img/bot.png",revision:"edd0d8de090d92c3aa7b65f14762adfd"},{url:"img/events.png",revision:"157d13d7183fd16841512308ea639586"},{url:"img/fck.svg",revision:"7eeed71eb140c361cac9b3e64e45c781"},{url:"img/forum.svg",revision:"6c16de9b8d41950314ce15baaa2f7f1a"},{url:"img/landing.png",revision:"2f451216856dfd3c0fb6861b9756b542"},{url:"img/nft.png",revision:"a8dd3a2c3a46f0c49536b928d2cc9305"},{url:"img/plitch.png",revision:"ed73d7ceba40dc5bfc331bf8972b0ad8"},{url:"img/roadmap.png",revision:"c141adaee862aa335ca9157b99da2152"},{url:"img/team.png",revision:"81f6393f8f9b7d99824154a4a74185b2"},{url:"img/ton.svg",revision:"d0403a8313b07567c1f2938c64962637"},{url:"img/whitepaper.png",revision:"6362d8fe655f2522ff90b9728740ab39"},{url:"index.html",revision:"7f39cdeda46454bf560081a556550a7e"},{url:"registerSW.js",revision:"402b66900e731ca748771b6fc5e7a068"},{url:"icons/icon-72x72.png",revision:"9a05f2acbe4aa4b52a978af03f6178c2"},{url:"icons/icon-96x96.png",revision:"eefc4ccbf2e57019b6043cae5168982a"},{url:"icons/icon-128x128.png",revision:"b93497d19378b331e1928276662b9eec"},{url:"icons/icon-144x144.png",revision:"6e139dfe581c8f176518b117a8597c8f"},{url:"icons/icon-152x152.png",revision:"a8159ebf44f77c628f676db9d9d12e9e"},{url:"icons/icon-192x192.png",revision:"b75e9a83fb2778e6b66884f6450877c5"},{url:"icons/icon-384x384.png",revision:"ad771db0a468ac8f0def2e79f26d7f16"},{url:"icons/icon-512x512.png",revision:"4161282647b011158166370582953cd4"},{url:"manifest.webmanifest",revision:"8ca33a549e21da747936359181acf82d"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
