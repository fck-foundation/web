if(!self.define){let s,e={};const i=(i,n)=>(i=new URL(i+".js",n).href,e[i]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=e,document.head.appendChild(s)}else s=i,importScripts(i),e()})).then((()=>{let s=e[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s})));self.define=(n,r)=>{const l=s||("document"in self?document.currentScript.src:"")||location.href;if(e[l])return;let a={};const u=s=>i(s,l),o={module:{uri:l},exports:a,require:u};e[l]=Promise.all(n.map((s=>o[s]||u(s)))).then((s=>(r(...s),a)))}}define(["./workbox-9bc8a7af"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"assets/404-f942b294.svg",revision:null},{url:"assets/abs013-59e9f420.svg",revision:null},{url:"assets/abs014-0b98fcb8.svg",revision:null},{url:"assets/abs020-2bbacced.svg",revision:null},{url:"assets/abs022-246916d5.svg",revision:null},{url:"assets/abs023-1c572929.svg",revision:null},{url:"assets/abs024-cbe632e2.svg",revision:null},{url:"assets/abs025-33e2ff6f.svg",revision:null},{url:"assets/abs026-2ea9d6be.svg",revision:null},{url:"assets/abs027-530a1760.svg",revision:null},{url:"assets/abs028-684dc631.svg",revision:null},{url:"assets/abs032-06159b98.svg",revision:null},{url:"assets/abs046-dd3badd6.svg",revision:null},{url:"assets/android-471a1a9d.svg",revision:null},{url:"assets/announcement-5bfef0e6.svg",revision:null},{url:"assets/arr001-3df0ef37.svg",revision:null},{url:"assets/arr002-6124a932.svg",revision:null},{url:"assets/arr007-28b257fc.svg",revision:null},{url:"assets/arr009-e97629d9.svg",revision:null},{url:"assets/arr010-5b59b9ee.svg",revision:null},{url:"assets/arr012-10b50216.svg",revision:null},{url:"assets/arr016-e3415061.svg",revision:null},{url:"assets/arr020-5bb45de6.svg",revision:null},{url:"assets/arr022-1529bbc9.svg",revision:null},{url:"assets/arr024-fcc08209.svg",revision:null},{url:"assets/arr025-034f9c19.svg",revision:null},{url:"assets/arr028-c99544a5.svg",revision:null},{url:"assets/arr033-a785a0a6.svg",revision:null},{url:"assets/arr036-1ec9f531.svg",revision:null},{url:"assets/arr037-7ddee67d.svg",revision:null},{url:"assets/arr042-8582911e.svg",revision:null},{url:"assets/arr058-d4fadbc3.svg",revision:null},{url:"assets/arr059-5937dad7.svg",revision:null},{url:"assets/arrow-be2a90d0.svg",revision:null},{url:"assets/arrowRight-5556724b.svg",revision:null},{url:"assets/arrowtechart-de8e6705.svg",revision:null},{url:"assets/code-e0b4e1c2.svg",revision:null},{url:"assets/copy-2345760d.svg",revision:null},{url:"assets/diamond-d27a4db5.svg",revision:null},{url:"assets/discord-8e3b3e2f.svg",revision:null},{url:"assets/explore-60ca3b02.svg",revision:null},{url:"assets/fil021-ad8cf416.svg",revision:null},{url:"assets/gen002-909e1c6f.svg",revision:null},{url:"assets/gen003-d0cde7a0.svg",revision:null},{url:"assets/gen004-93fe1d59.svg",revision:null},{url:"assets/gen011-b88ca55c.svg",revision:null},{url:"assets/gen013-2fead4f6.svg",revision:null},{url:"assets/gen015-9b8e7a6b.svg",revision:null},{url:"assets/gen016-b161fb0a.svg",revision:null},{url:"assets/gen017-c7785e1a.svg",revision:null},{url:"assets/gen019-72c4e2c4.svg",revision:null},{url:"assets/gen020-9731ee75.svg",revision:null},{url:"assets/gmail-4cf20008.svg",revision:null},{url:"assets/gra004-2c176c68.svg",revision:null},{url:"assets/gra006-12af9e81.svg",revision:null},{url:"assets/gra009-9975d5d1.svg",revision:null},{url:"assets/gra010-be4f4245.svg",revision:null},{url:"assets/gra011-a14bdf26.svg",revision:null},{url:"assets/gra012-e3954e20.svg",revision:null},{url:"assets/heart-4751a300.svg",revision:null},{url:"assets/index-46b03057.css",revision:null},{url:"assets/info-b738ea0f.svg",revision:null},{url:"assets/key-7eda2d2b.png",revision:null},{url:"assets/link-5a3aaf9b.svg",revision:null},{url:"assets/logo-4a8e422a.svg",revision:null},{url:"assets/payment-a55374d7.svg",revision:null},{url:"assets/tg-af712e1b.svg",revision:null},{url:"assets/ton-d6452c2c.svg",revision:null},{url:"assets/tonscan-57ec95e6.svg",revision:null},{url:"assets/tonviewer-d2cd70e7.svg",revision:null},{url:"assets/tools-a46ea4b6.svg",revision:null},{url:"assets/transparentton-ef22748f.svg",revision:null},{url:"assets/Trophy-9fc1310e.svg",revision:null},{url:"assets/trust-565549de.svg",revision:null},{url:"assets/tw-8634336f.svg",revision:null},{url:"assets/web-635fb249.svg",revision:null},{url:"favicon.ico",revision:"499bc7e639a63e1cceed96889e101df5"},{url:"icons/icon-128x128.png",revision:"b93497d19378b331e1928276662b9eec"},{url:"icons/icon-144x144.png",revision:"6e139dfe581c8f176518b117a8597c8f"},{url:"icons/icon-152x152.png",revision:"a8159ebf44f77c628f676db9d9d12e9e"},{url:"icons/icon-16x16.png",revision:"5572e73efff0ebae396133d15aeffc0c"},{url:"icons/icon-192x192.png",revision:"b75e9a83fb2778e6b66884f6450877c5"},{url:"icons/icon-32x32.png",revision:"e653e95d196a1cddf5dcaa3ad2b08376"},{url:"icons/icon-384x384.png",revision:"ad771db0a468ac8f0def2e79f26d7f16"},{url:"icons/icon-512x512.png",revision:"4161282647b011158166370582953cd4"},{url:"icons/icon-72x72.png",revision:"9a05f2acbe4aa4b52a978af03f6178c2"},{url:"icons/icon-96x96.png",revision:"eefc4ccbf2e57019b6043cae5168982a"},{url:"img/analytics.png",revision:"129d4c998e9a7c64d2e9e06d60276fe9"},{url:"img/analyticsbot.png",revision:"ed0faa50a9c31a625fcc9cca43009e24"},{url:"img/bg.svg",revision:"988741278124f0b2a91a9ea6d22956aa"},{url:"img/bot.png",revision:"d102bdc24008a7432768cd51eba9b8c7"},{url:"img/coin.png",revision:"3704882205ab2f3731131e8385a277f4"},{url:"img/diamond.png",revision:"bac8a1b225586cf271e7ebfceaf36237"},{url:"img/drop.png",revision:"84d49125cdbc5d2761d924d95578179f"},{url:"img/events.png",revision:"157d13d7183fd16841512308ea639586"},{url:"img/fck.svg",revision:"7eeed71eb140c361cac9b3e64e45c781"},{url:"img/forum.svg",revision:"6c16de9b8d41950314ce15baaa2f7f1a"},{url:"img/kite.png",revision:"49eca1ed963d201fe9fc31580db90d7a"},{url:"img/landing.png",revision:"2f451216856dfd3c0fb6861b9756b542"},{url:"img/megaton.svg",revision:"a66e2fbf9ecfc3b8e6b0a033eb43a9a2"},{url:"img/mockup.png",revision:"322416603d3eeabd85b4c9b56c39712f"},{url:"img/plitch.png",revision:"ed73d7ceba40dc5bfc331bf8972b0ad8"},{url:"img/rhombus.png",revision:"ccec27f1497b6bd412f9beb2587935c3"},{url:"img/roadmap.png",revision:"c141adaee862aa335ca9157b99da2152"},{url:"img/stonfi.svg",revision:"a5ee4b699fc677fc39be055550b623b3"},{url:"img/team.png",revision:"81f6393f8f9b7d99824154a4a74185b2"},{url:"img/ton.svg",revision:"d0403a8313b07567c1f2938c64962637"},{url:"img/v1.png",revision:"191d1f39ebdb82718680a1e10cb5a426"},{url:"img/v2.png",revision:"9599d810849133a48fb0706b02003e9b"},{url:"img/whitepaper.png",revision:"6362d8fe655f2522ff90b9728740ab39"},{url:"index.html",revision:"0b222f13b109d5c15618425349c6a95a"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"icons/icon-72x72.png",revision:"9a05f2acbe4aa4b52a978af03f6178c2"},{url:"icons/icon-96x96.png",revision:"eefc4ccbf2e57019b6043cae5168982a"},{url:"icons/icon-128x128.png",revision:"b93497d19378b331e1928276662b9eec"},{url:"icons/icon-144x144.png",revision:"6e139dfe581c8f176518b117a8597c8f"},{url:"icons/icon-152x152.png",revision:"a8159ebf44f77c628f676db9d9d12e9e"},{url:"icons/icon-192x192.png",revision:"b75e9a83fb2778e6b66884f6450877c5"},{url:"icons/icon-384x384.png",revision:"ad771db0a468ac8f0def2e79f26d7f16"},{url:"icons/icon-512x512.png",revision:"4161282647b011158166370582953cd4"},{url:"manifest.webmanifest",revision:"8ca33a549e21da747936359181acf82d"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
