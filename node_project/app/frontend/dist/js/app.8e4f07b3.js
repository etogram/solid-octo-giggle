(function(t){function e(e){for(var n,a,r=e[0],c=e[1],l=e[2],h=0,p=[];h<r.length;h++)a=r[h],Object.prototype.hasOwnProperty.call(i,a)&&i[a]&&p.push(i[a][0]),i[a]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(t[n]=c[n]);u&&u(e);while(p.length)p.shift()();return o.push.apply(o,l||[]),s()}function s(){for(var t,e=0;e<o.length;e++){for(var s=o[e],n=!0,r=1;r<s.length;r++){var c=s[r];0!==i[c]&&(n=!1)}n&&(o.splice(e--,1),t=a(a.s=s[0]))}return t}var n={},i={app:0},o=[];function a(e){if(n[e])return n[e].exports;var s=n[e]={i:e,l:!1,exports:{}};return t[e].call(s.exports,s,s.exports,a),s.l=!0,s.exports}a.m=t,a.c=n,a.d=function(t,e,s){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},a.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(a.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)a.d(s,n,function(e){return t[e]}.bind(null,n));return s},a.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="/";var r=window["webpackJsonp"]=window["webpackJsonp"]||[],c=r.push.bind(r);r.push=e,r=r.slice();for(var l=0;l<r.length;l++)e(r[l]);var u=c;o.push([0,"chunk-vendors"]),s()})({0:function(t,e,s){t.exports=s("56d7")},"034f":function(t,e,s){"use strict";s("85ec")},1:function(t,e){},"56d7":function(t,e,s){"use strict";s.r(e);s("e260"),s("e6cf"),s("cca6"),s("a79d");var n=s("2b0e"),i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"container-fluid",staticStyle:{"font-family":"'Courier New', Courier, 'Liberation Mono', monospace"},attrs:{id:"app"}},[t._m(0),s("div",{staticClass:"row"},[s("autofill",{attrs:{items:t.autofillItems},on:{input:t.onSearchChange,"window-width-change":t.onWidthChange,"search-set":t.onSearchSet,reset:t.onSearchReset,"search-opt":t.onSearchOptChange}}),s("div",{staticClass:"col-xl-3"},[[s("div",[s("label",{staticClass:"mb-0 font-responsive-vw",attrs:{for:"sb-jumps"}},[t._v("Jumps")]),s("b-form-spinbutton",{staticClass:"mt-0",attrs:{id:"sb-jumps",min:"0",max:"10",step:"1",size:t.responsiveSize},model:{value:t.jumps,callback:function(e){t.jumps=e},expression:"jumps"}})],1)]],2),s("div",{staticClass:"col-xl-3"},[[s("div",[s("label",{staticClass:"mb-0 font-responsive-vw",attrs:{for:"sb-step"}},[t._v("Security level")]),s("b-form-spinbutton",{staticClass:"mt-0",attrs:{id:"sb-step",min:"-1",max:"1",step:"0.1",size:t.responsiveSize},model:{value:t.securityLevel,callback:function(e){t.securityLevel=e},expression:"securityLevel"}})],1)]],2)],1),s("div",{staticClass:"row mx-3 my-3"},[s("tags",{attrs:{tags:t.materialsOpt},on:{"update-tags":t.updateTags}})],1),s("div",{staticClass:"row mt-3"},[s("b-button",{staticClass:"mx-auto col-xl-6",attrs:{variant:"outline-secondary"},on:{click:t.find}},[t._v("Find")])],1),s("div",{staticClass:"row mt-3"},[s("b-list-group",{staticClass:"mx-auto"},t._l(t.results,(function(e,n){return s("b-list-group-item",{key:n,attrs:{variant:e.variant}},[t._v(" "+t._s(e.text)+" ")])})),1)],1)])},o=[function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"row mt-3"},[s("h1",{staticClass:"mx-auto title-font-responsive-vw"},[t._v("EVE echoes planetary production finder")])])}],a=(s("99af"),s("d3b7"),s("96cf"),s("1da1")),r=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",t._l(t.tags,(function(e,n){return s("b-button",{key:n,staticClass:"my-1 mx-1 px-1 py-0",staticStyle:{"font-size":"smaller"},attrs:{variant:"outline-secondary",size:"sm","data-value":e.value},on:{click:t.toggle}},[t._v(t._s(e.text))])})),1)},c=[],l=(s("c975"),s("a434"),{name:"Tags",props:["tags"],data:function(){return{select:[],text:""}},computed:{},mounted:function(){},methods:{toggle:function(t){if(-1==t.target.className.indexOf("active"))this.select.push(t.target.dataset.value),t.target.classList.add("active"),t.target.classList.remove("btn-outline-secondary"),t.target.classList.add("btn-outline-primary"),this.$emit("update-tags",this.select.sort((function(t,e){return parseInt(t)-parseInt(e)})));else{t.target.classList.remove("active"),t.target.classList.add("btn-outline-secondary"),t.target.classList.remove("btn-outline-primary");var e=this.select.indexOf(t.target.dataset.value);e>-1&&(this.select.splice(e,1),this.$emit("update-tags",this.select.sort((function(t,e){return parseInt(t)-parseInt(e)}))))}}}}),u=l,h=s("2877"),p=Object(h["a"])(u,r,c,!1,null,null,null),d=p.exports,f=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"col-xl-6"},[s("label",{staticClass:"mb-0 font-responsive-vw",attrs:{for:"location"}},[t._v("Location")]),s("b-input-group",{staticClass:"mt-0",attrs:{size:t.responsiveSize},scopedSlots:t._u([{key:"append",fn:function(){return[s("b-input-group-text",{on:{click:t.searchInit}},[s("strong",{staticClass:"text-danger"},[s("b-icon-x")],1)])]},proxy:!0},{key:"prepend",fn:function(){return[s("b-dropdown",{attrs:{text:t.searchOpt,variant:"secondary",size:t.responsiveSize}},[s("b-dropdown-item",{staticClass:"font-responsive-vw",on:{click:function(e){return t.getlistOpt("system")}}},[t._v("system")]),s("b-dropdown-item",{staticClass:"font-responsive-vw",on:{click:function(e){return t.getlistOpt("constellation")}}},[t._v("constellation")]),s("b-dropdown-item",{staticClass:"font-responsive-vw",on:{click:function(e){return t.getlistOpt("region")}}},[t._v("region")])],1)]},proxy:!0}])},[s("b-form-input",{attrs:{id:"location",autocomplete:"off",list:"autocompleteList"},on:{keyup:[function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.setResult(e)},t.onChange],change:t.setResult},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}}),s("datalist",{attrs:{id:"autocompleteList"}},t._l(t.choices,(function(e,n){return s("option",{key:n},[t._v(t._s(e))])})),0)],1)],1)},m=[],v=(s("4160"),s("b0c0"),s("ac1f"),s("841c"),s("1276"),s("498a"),s("159b"),{name:"Autofill",props:["items"],data:function(){return{isOpen:!1,search:"",results:[],isLoading:!1,socket:null,searchOpt:"system",windowWidth:window.innerWidth}},computed:{responsiveSize:function(){var t="";return this.windowWidth<576&&(t="sm"),t},choices:function(){var t=[];switch(this.searchOpt){case"system":this.results.forEach((function(e){return t.push(e.region+" > "+e.constellation+" > "+e.name)}));break;case"constellation":this.results.forEach((function(e){return t.push(e.region+" > "+e.constellation)}));break;case"region":this.results.forEach((function(e){return t.push(e.region)}));break;default:}return t}},watch:{windowWidth:function(t,e){t!=e&&(this.windowWidth=t,this.$emit("window-width-change",t))},items:function(t,e){t!==e&&(this.results=t,this.isLoading=!1)},searchOpt:function(t,e){t!==e&&this.$emit("search-opt",t)},search:function(t,e){t!==e&&this.$emit("search-set",t)}},mounted:function(){var t=this;this.$nextTick((function(){document.addEventListener("click",t.handleClickOutside),window.addEventListener("resize",t.onResize)}))},beforeDestroy:function(){window.removeEventListener("resize",this.onResize),document.removeEventListener("click",this.handleClickOutside)},methods:{onResize:function(){this.windowWidth=window.innerWidth},searchInit:function(){this.$emit("reset"),this.search=""},getlistOpt:function(t){this.search="",this.searchOpt=t},onChange:function(){this.$emit("input",this.search,this.searchOpt),this.isLoading=!0},setResult:function(){var t;switch(this.searchOpt){case"system":try{t=this.search.split(">")[2].trim()}catch(e){console.log("incatch"),t=this.search}break;case"constellation":try{t=this.search.split(">")[1].trim()}catch(s){console.log("incatch"),t=this.search}break;case"region":try{t=this.search.trim()}catch(n){console.log("incatch"),t=this.search}break;default:}console.log("emit location"),this.$emit("search-set",t,this.searchOpt)},handleClickOutside:function(t){this.$el.contains(t.target)||(this.isOpen=!1)}}}),g=v,b=Object(h["a"])(g,f,m,!1,null,null,null),w=b.exports,y={name:"App",components:{Tags:d,Autofill:w},data:function(){return{domain:"http://127.0.0.1:80",sessionId:document.querySelector('meta[name="sessionId"]').getAttribute("content"),token:document.querySelector('meta[name="token"]').getAttribute("content"),location:"",windowWidth:window.innerWidth,responsiveSize:window.innerWidth<576?"sm":"",info:[],securityLevel:.5,jumps:5,socket:"",autofillItems:[],searchOpt:"system",materialsSelected:[],materialsOpt:[]}},mounted:function(){var t=Object(a["a"])(regeneratorRuntime.mark((function t(){var e;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:console.log("mounted"),this.socket=this.$io(this.domain,{transportOptions:{polling:{extraHeaders:{"x-sessionid":this.sessionId,"x-token":this.token}}}}),e=this,this.socket.emit("init",{a:"b"},(function(t,s){t&&console.log("error: "+t),console.log(s.materials),e.materialsOpt=s.materials})),this.socket.on("connect_error",(function(t){console.log("connect_error"),console.log(t)})),this.socket.on("greetings",(function(t){console.log(t)}));case 6:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),computed:{tags:function(){for(var t=[],e=0;e<this.materialsSelected.length;e++)t.push(this.materialsOpt[this.materialsSelected[e]].text);return t},results:function(){var t=[],e={Poor:"muted",Medium:"warning",Rich:"info",Perfect:"success"};if(this.info.length>0)switch(this.searchOpt){case"system":for(var s=0;s<this.info.length;s++){var n=this.info[s],i=n.jumps>1?"jumps":"jump",o="".concat(n.resource," - ").concat(n.richness,": ").concat(n.jumps," ").concat(i," :  ").concat(n.region,"-").concat(n.constellation,"- ").concat(n.system," - ").concat(n.planet," - ").concat(n.security);t.push({text:o,variant:e[n.richness]})}break;case"constellation":case"region":for(var a=0;a<this.info.length;a++){var r=this.info[a],c="".concat(r.resource," - ").concat(r.richness," :  ").concat(r.region,"-").concat(r.constellation,"- ").concat(r.system," - ").concat(r.planet," - ").concat(r.security);t.push({text:c,variant:e[r.richness]})}break}return t}},methods:{onWidthChange:function(t){this.windowWidth=t;var e="";this.windowWidth<576&&(e="sm"),this.responsiveSize=e},onSearchChange:function(t,e){var s={data:t,opt:e},n=this;return new Promise((function(t,e){n.socket.emit("autocomplete",s,(function(s,i){s&&e(s),n.autofillItems=i,t(i)}))}))},onSearchSet:function(t){this.location=t},onSearchReset:function(){this.location=""},onSearchOptChange:function(t){this.searchOpt=t},updateTags:function(t){this.materialsSelected=t},find:function(){var t=this;this.info=[];var e={searchOpt:this.searchOpt,location:this.location,materials:this.materialsSelected,jumps:this.jumps,securityLevel:this.securityLevel};""!==this.location&&(console.log("send socket"),console.log(e),t.socket.emit("find",e,(function(e,s){console.log("insocket"),e&&console.log(e),null!==s&&(t.info=s)})))}}},k=y,O=(s("034f"),Object(h["a"])(k,i,o,!1,null,null,null)),x=O.exports,C=s("7049"),_=s("0f6c"),S=s("e68d"),j=s("9ae9"),L=s("8c60"),z=s("b1fc"),$=s("b1e0"),E=s("8e27"),W=s.n(E),I=(s("f9e3"),s("2dd8"),s("28dd"));n["a"].use(C["a"]),n["a"].use(_["a"]),n["a"].use(S["a"]),n["a"].use(j["a"]),n["a"].use(L["a"]),n["a"].use(z["a"]),n["a"].use($["a"]),n["a"].config.productionTip=!1,n["a"].use(I["a"]),n["a"].use($["a"]),n["a"].prototype.$io=W.a,console.log("------------ production mode --------------"),console.log=function(){},new n["a"]({render:function(t){return t(x)}}).$mount("#app")},"85ec":function(t,e,s){}});
//# sourceMappingURL=app.8e4f07b3.js.map