(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{112:function(t,e,n){"use strict";n.r(e);var c=n(1),a=n(0),s=n.n(a),r=n(51),i=n.n(r),o=(n(64),n(31)),u=n.n(o),j=n(52),b=n(8),d=n(57),l=n(2);n(66),n(16);var f=function(){return Object(c.jsx)("div",{className:"navbar",children:"Drivel.TV"})};var h=function(){return Object(c.jsx)("div",{className:"homepage",children:"Homepage"})},O=n(32),p=n.n(O);var m=function(t){var e=Object(a.useState)(""),n=Object(b.a)(e,2),s=n[0],r=n[1];return Object(a.useEffect)((function(){p()("#chatList").append(p()("<li>").text(t.msg))}),[t.msg]),Object(c.jsxs)("div",{className:"chat",children:[Object(c.jsx)("ul",{id:"chatList"}),Object(c.jsxs)("form",{id:"chatForm",action:"",onSubmit:function(e){e.preventDefault(),""!==s&&(t.emitMsg(s),r(""))},children:[Object(c.jsx)("input",{id:"chatInput",autocomplete:"off",value:s,onChange:function(t){return r(t.target.value)}}),Object(c.jsx)("button",{id:"chatButton",children:"Send"})]})]})},x=n(53);var v,g=function(t){var e=Object(a.useState)({}),n=Object(b.a)(e,2),s=n[0],r=n[1];Object(a.useEffect)((function(){r(t.broadcast)}),[t.broadcast]);var i={height:"100%",width:"100%",playerVars:{enablejsapi:1,playsinline:1,"webkit-playsinline":1,autoplay:1,start:s.currentTime}};return Object(c.jsx)(x.a,{containerClassName:"videoplayer",videoId:s.currentVideo,opts:i})},w=n(56),y=n.n(w);var S=function(t){var e=Object(a.useState)(""),n=Object(b.a)(e,2),s=n[0],r=n[1],i=Object(a.useState)({}),o=Object(b.a)(i,2),u=o[0],j=o[1];return Object(a.useEffect)((function(){return(v=y.a.connect()).emit("join",window.location.pathname),v.on("chat message to client",(function(t){r(t)})),function(){v.close()}}),[]),Object(a.useEffect)((function(){t.getBroadcast(window.location.pathname.slice(3))}),[t]),Object(a.useEffect)((function(){j(t.broadcast)}),[t.broadcast]),Object(c.jsxs)("div",{className:"broadcast",children:[Object(c.jsx)(g,{broadcast:u}),Object(c.jsx)(m,{emitMsg:function(t){v.emit("chat message to server",{room:window.location.pathname,msg:t})},msg:s})]})};var k=function(){return Object(c.jsx)("h4",{style:{marginTop:"6vh"},children:"404 - Page or Broadcast not found on server"})};var T=function(){var t=Object(a.useState)({}),e=Object(b.a)(t,2),n=e[0],s=e[1],r=Object(a.useState)("/b/:broadcast"),i=Object(b.a)(r,2),o=i[0],O=i[1];function p(){return(p=Object(j.a)(u.a.mark((function t(e){var n,c;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch("/api/get-broadcast",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({broadcastId:e})});case 2:if(!(n=t.sent).ok){t.next=10;break}return t.next=6,n.json();case 6:c=t.sent,s(c),t.next=11;break;case 10:O("/");case 11:case 12:case"end":return t.stop()}}),t)})))).apply(this,arguments)}return Object(c.jsxs)(d.a,{children:[Object(c.jsx)(f,{}),Object(c.jsxs)(l.c,{children:[Object(c.jsxs)(l.a,{exact:!0,path:"/",children:[" ",Object(c.jsx)(h,{})]}),Object(c.jsxs)(l.a,{exact:!0,path:o,children:[" ",Object(c.jsx)(S,{broadcast:n,getBroadcast:function(t){return p.apply(this,arguments)}})]}),Object(c.jsxs)(l.a,{path:"/",children:[" ",Object(c.jsx)(k,{})]})]})]})},B=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,113)).then((function(e){var n=e.getCLS,c=e.getFID,a=e.getFCP,s=e.getLCP,r=e.getTTFB;n(t),c(t),a(t),s(t),r(t)}))};i.a.render(Object(c.jsx)(s.a.StrictMode,{children:Object(c.jsx)(T,{})}),document.getElementById("root")),B()},16:function(t,e,n){},64:function(t,e,n){},66:function(t,e,n){}},[[112,1,2]]]);
//# sourceMappingURL=main.2fa2ea76.chunk.js.map