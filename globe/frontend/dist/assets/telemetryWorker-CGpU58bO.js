(function(){"use strict";const yh=()=>{};var _r={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mr={NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const A=function(n,e){if(!n)throw _t(e)},_t=function(n){return new Error("Firebase Database ("+mr.SDK_VERSION+") INTERNAL ASSERT FAILED: "+n)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yr=function(n){const e=[];let t=0;for(let i=0;i<n.length;i++){let r=n.charCodeAt(i);r<128?e[t++]=r:r<2048?(e[t++]=r>>6|192,e[t++]=r&63|128):(r&64512)===55296&&i+1<n.length&&(n.charCodeAt(i+1)&64512)===56320?(r=65536+((r&1023)<<10)+(n.charCodeAt(++i)&1023),e[t++]=r>>18|240,e[t++]=r>>12&63|128,e[t++]=r>>6&63|128,e[t++]=r&63|128):(e[t++]=r>>12|224,e[t++]=r>>6&63|128,e[t++]=r&63|128)}return e},vh=function(n){const e=[];let t=0,i=0;for(;t<n.length;){const r=n[t++];if(r<128)e[i++]=String.fromCharCode(r);else if(r>191&&r<224){const o=n[t++];e[i++]=String.fromCharCode((r&31)<<6|o&63)}else if(r>239&&r<365){const o=n[t++],a=n[t++],c=n[t++],d=((r&7)<<18|(o&63)<<12|(a&63)<<6|c&63)-65536;e[i++]=String.fromCharCode(55296+(d>>10)),e[i++]=String.fromCharCode(56320+(d&1023))}else{const o=n[t++],a=n[t++];e[i++]=String.fromCharCode((r&15)<<12|(o&63)<<6|a&63)}}return e.join("")},Ci={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let r=0;r<n.length;r+=3){const o=n[r],a=r+1<n.length,c=a?n[r+1]:0,d=r+2<n.length,f=d?n[r+2]:0,I=o>>2,y=(o&3)<<4|c>>4;let S=(c&15)<<2|f>>6,N=f&63;d||(N=64,a||(S=64)),i.push(t[I],t[y],t[S],t[N])}return i.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(yr(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):vh(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let r=0;r<n.length;){const o=t[n.charAt(r++)],c=r<n.length?t[n.charAt(r)]:0;++r;const f=r<n.length?t[n.charAt(r)]:64;++r;const y=r<n.length?t[n.charAt(r)]:64;if(++r,o==null||c==null||f==null||y==null)throw new Eh;const S=o<<2|c>>4;if(i.push(S),f!==64){const N=c<<4&240|f>>2;if(i.push(N),y!==64){const R=f<<6&192|y;i.push(R)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Eh extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const vr=function(n){const e=yr(n);return Ci.encodeByteArray(e,!0)},kn=function(n){return vr(n).replace(/\./g,"")},Ii=function(n){try{return Ci.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wh(n){return Er(void 0,n)}function Er(n,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const t=e;return new Date(t.getTime());case Object:n===void 0&&(n={});break;case Array:n=[];break;default:return e}for(const t in e)!e.hasOwnProperty(t)||!Ch(t)||(n[t]=Er(n[t],e[t]));return n}function Ch(n){return n!=="__proto__"}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ih(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Th=()=>Ih().__FIREBASE_DEFAULTS__,Sh=()=>{if(typeof process>"u"||typeof _r>"u")return;const n=_r.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Ah=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Ii(n[1]);return e&&JSON.parse(e)},wr=()=>{try{return yh()||Th()||Sh()||Ah()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},bh=n=>{var e,t;return(t=(e=wr())==null?void 0:e.emulatorHosts)==null?void 0:t[n]},Cr=n=>{const e=bh(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const i=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),i]:[e.substring(0,t),i]},Ir=()=>{var n;return(n=wr())==null?void 0:n.config};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ti{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,i)=>{t?this.reject(t):this.resolve(i),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,i))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tr(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},i=e||"demo-project",r=n.iat||0,o=n.sub||n.user_id;if(!o)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a={iss:`https://securetoken.google.com/${i}`,aud:i,iat:r,exp:r+3600,auth_time:r,sub:o,user_id:o,firebase:{sign_in_provider:"custom",identities:{}},...n};return[kn(JSON.stringify(t)),kn(JSON.stringify(a)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nh(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Sr(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Nh())}function Rh(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Dh(){return mr.NODE_ADMIN===!0}function Ph(){try{return typeof indexedDB=="object"}catch{return!1}}function kh(){return new Promise((n,e)=>{try{let t=!0;const i="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(i);r.onsuccess=()=>{r.result.close(),t||self.indexedDB.deleteDatabase(i),n(!0)},r.onupgradeneeded=()=>{t=!1},r.onerror=()=>{var o;e(((o=r.error)==null?void 0:o.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oh="FirebaseError";class mt extends Error{constructor(e,t,i){super(t),this.code=e,this.customData=i,this.name=Oh,Object.setPrototypeOf(this,mt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Ar.prototype.create)}}class Ar{constructor(e,t,i){this.service=e,this.serviceName=t,this.errors=i}create(e,...t){const i=t[0]||{},r=`${this.service}/${e}`,o=this.errors[e],a=o?xh(o,i):"Error",c=`${this.serviceName}: ${a} (${r}).`;return new mt(r,c,i)}}function xh(n,e){return n.replace(Mh,(t,i)=>{const r=e[i];return r!=null?String(r):`<${i}?>`})}const Mh=/\{\$([^}]+)}/g;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ft(n){return JSON.parse(n)}function J(n){return JSON.stringify(n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const br=function(n){let e={},t={},i={},r="";try{const o=n.split(".");e=Ft(Ii(o[0])||""),t=Ft(Ii(o[1])||""),r=o[2],i=t.d||{},delete t.d}catch{}return{header:e,claims:t,data:i,signature:r}},Lh=function(n){const e=br(n),t=e.claims;return!!t&&typeof t=="object"&&t.hasOwnProperty("iat")},Fh=function(n){const e=br(n).claims;return typeof e=="object"&&e.admin===!0};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Re(n,e){return Object.prototype.hasOwnProperty.call(n,e)}function yt(n,e){if(Object.prototype.hasOwnProperty.call(n,e))return n[e]}function Nr(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function On(n,e,t){const i={};for(const r in n)Object.prototype.hasOwnProperty.call(n,r)&&(i[r]=e.call(t,n[r],r,n));return i}function Ut(n,e){if(n===e)return!0;const t=Object.keys(n),i=Object.keys(e);for(const r of t){if(!i.includes(r))return!1;const o=n[r],a=e[r];if(Rr(o)&&Rr(a)){if(!Ut(o,a))return!1}else if(o!==a)return!1}for(const r of i)if(!t.includes(r))return!1;return!0}function Rr(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uh(n){const e=[];for(const[t,i]of Object.entries(n))Array.isArray(i)?i.forEach(r=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(r))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(i));return e.length?"&"+e.join("&"):""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vh{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=512/8,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,t){t||(t=0);const i=this.W_;if(typeof e=="string")for(let y=0;y<16;y++)i[y]=e.charCodeAt(t)<<24|e.charCodeAt(t+1)<<16|e.charCodeAt(t+2)<<8|e.charCodeAt(t+3),t+=4;else for(let y=0;y<16;y++)i[y]=e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3],t+=4;for(let y=16;y<80;y++){const S=i[y-3]^i[y-8]^i[y-14]^i[y-16];i[y]=(S<<1|S>>>31)&4294967295}let r=this.chain_[0],o=this.chain_[1],a=this.chain_[2],c=this.chain_[3],d=this.chain_[4],f,I;for(let y=0;y<80;y++){y<40?y<20?(f=c^o&(a^c),I=1518500249):(f=o^a^c,I=1859775393):y<60?(f=o&a|c&(o|a),I=2400959708):(f=o^a^c,I=3395469782);const S=(r<<5|r>>>27)+f+d+I+i[y]&4294967295;d=c,c=a,a=(o<<30|o>>>2)&4294967295,o=r,r=S}this.chain_[0]=this.chain_[0]+r&4294967295,this.chain_[1]=this.chain_[1]+o&4294967295,this.chain_[2]=this.chain_[2]+a&4294967295,this.chain_[3]=this.chain_[3]+c&4294967295,this.chain_[4]=this.chain_[4]+d&4294967295}update(e,t){if(e==null)return;t===void 0&&(t=e.length);const i=t-this.blockSize;let r=0;const o=this.buf_;let a=this.inbuf_;for(;r<t;){if(a===0)for(;r<=i;)this.compress_(e,r),r+=this.blockSize;if(typeof e=="string"){for(;r<t;)if(o[a]=e.charCodeAt(r),++a,++r,a===this.blockSize){this.compress_(o),a=0;break}}else for(;r<t;)if(o[a]=e[r],++a,++r,a===this.blockSize){this.compress_(o),a=0;break}}this.inbuf_=a,this.total_+=t}digest(){const e=[];let t=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let r=this.blockSize-1;r>=56;r--)this.buf_[r]=t&255,t/=256;this.compress_(this.buf_);let i=0;for(let r=0;r<5;r++)for(let o=24;o>=0;o-=8)e[i]=this.chain_[r]>>o&255,++i;return e}}function Dr(n,e){return`${n} failed: ${e} argument `}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bh=function(n){const e=[];let t=0;for(let i=0;i<n.length;i++){let r=n.charCodeAt(i);if(r>=55296&&r<=56319){const o=r-55296;i++,A(i<n.length,"Surrogate pair missing trail surrogate.");const a=n.charCodeAt(i)-56320;r=65536+(o<<10)+a}r<128?e[t++]=r:r<2048?(e[t++]=r>>6|192,e[t++]=r&63|128):r<65536?(e[t++]=r>>12|224,e[t++]=r>>6&63|128,e[t++]=r&63|128):(e[t++]=r>>18|240,e[t++]=r>>12&63|128,e[t++]=r>>6&63|128,e[t++]=r&63|128)}return e},xn=function(n){let e=0;for(let t=0;t<n.length;t++){const i=n.charCodeAt(t);i<128?e++:i<2048?e+=2:i>=55296&&i<=56319?(e+=4,t++):e+=3}return e};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vt(n){return n&&n._delegate?n._delegate:n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Si(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Pr(n){return(await fetch(n,{credentials:"include"})).ok}class vt{constructor(e,t,i){this.name=e,this.instanceFactory=t,this.type=i,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qe="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jh{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const i=new Ti;if(this.instancesDeferred.set(t,i),this.isInitialized(t)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:t});r&&i.resolve(r)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(r){if(i)return null;throw r}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Hh(e))try{this.getOrInitializeService({instanceIdentifier:Qe})}catch{}for(const[t,i]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(t);try{const o=this.getOrInitializeService({instanceIdentifier:r});i.resolve(o)}catch{}}}}clearInstance(e=Qe){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Qe){return this.instances.has(e)}getOptions(e=Qe){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,i=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(i))throw Error(`${this.name}(${i}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:i,options:t});for(const[o,a]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(o);i===c&&a.resolve(r)}return r}onInit(e,t){const i=this.normalizeInstanceIdentifier(t),r=this.onInitCallbacks.get(i)??new Set;r.add(e),this.onInitCallbacks.set(i,r);const o=this.instances.get(i);return o&&e(o,i),()=>{r.delete(e)}}invokeOnInitCallbacks(e,t){const i=this.onInitCallbacks.get(t);if(i)for(const r of i)try{r(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let i=this.instances.get(e);if(!i&&this.component&&(i=this.component.instanceFactory(this.container,{instanceIdentifier:Wh(e),options:t}),this.instances.set(e,i),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(i,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,i)}catch{}return i||null}normalizeInstanceIdentifier(e=Qe){return this.component?this.component.multipleInstances?e:Qe:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Wh(n){return n===Qe?void 0:n}function Hh(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gh{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new jh(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var j;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(j||(j={}));const qh={debug:j.DEBUG,verbose:j.VERBOSE,info:j.INFO,warn:j.WARN,error:j.ERROR,silent:j.SILENT},$h=j.INFO,zh={[j.DEBUG]:"log",[j.VERBOSE]:"log",[j.INFO]:"info",[j.WARN]:"warn",[j.ERROR]:"error"},Yh=(n,e,...t)=>{if(e<n.logLevel)return;const i=new Date().toISOString(),r=zh[e];if(r)console[r](`[${i}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Ai{constructor(e){this.name=e,this._logLevel=$h,this._logHandler=Yh,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in j))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?qh[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,j.DEBUG,...e),this._logHandler(this,j.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,j.VERBOSE,...e),this._logHandler(this,j.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,j.INFO,...e),this._logHandler(this,j.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,j.WARN,...e),this._logHandler(this,j.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,j.ERROR,...e),this._logHandler(this,j.ERROR,...e)}}const Kh=(n,e)=>e.some(t=>n instanceof t);let kr,Or;function Xh(){return kr||(kr=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Qh(){return Or||(Or=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const xr=new WeakMap,bi=new WeakMap,Mr=new WeakMap,Ni=new WeakMap,Ri=new WeakMap;function Jh(n){const e=new Promise((t,i)=>{const r=()=>{n.removeEventListener("success",o),n.removeEventListener("error",a)},o=()=>{t(Me(n.result)),r()},a=()=>{i(n.error),r()};n.addEventListener("success",o),n.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&xr.set(t,n)}).catch(()=>{}),Ri.set(e,n),e}function Zh(n){if(bi.has(n))return;const e=new Promise((t,i)=>{const r=()=>{n.removeEventListener("complete",o),n.removeEventListener("error",a),n.removeEventListener("abort",a)},o=()=>{t(),r()},a=()=>{i(n.error||new DOMException("AbortError","AbortError")),r()};n.addEventListener("complete",o),n.addEventListener("error",a),n.addEventListener("abort",a)});bi.set(n,e)}let Di={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return bi.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Mr.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Me(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function ec(n){Di=n(Di)}function tc(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const i=n.call(Pi(this),e,...t);return Mr.set(i,e.sort?e.sort():[e]),Me(i)}:Qh().includes(n)?function(...e){return n.apply(Pi(this),e),Me(xr.get(this))}:function(...e){return Me(n.apply(Pi(this),e))}}function nc(n){return typeof n=="function"?tc(n):(n instanceof IDBTransaction&&Zh(n),Kh(n,Xh())?new Proxy(n,Di):n)}function Me(n){if(n instanceof IDBRequest)return Jh(n);if(Ni.has(n))return Ni.get(n);const e=nc(n);return e!==n&&(Ni.set(n,e),Ri.set(e,n)),e}const Pi=n=>Ri.get(n);function ic(n,e,{blocked:t,upgrade:i,blocking:r,terminated:o}={}){const a=indexedDB.open(n,e),c=Me(a);return i&&a.addEventListener("upgradeneeded",d=>{i(Me(a.result),d.oldVersion,d.newVersion,Me(a.transaction),d)}),t&&a.addEventListener("blocked",d=>t(d.oldVersion,d.newVersion,d)),c.then(d=>{o&&d.addEventListener("close",()=>o()),r&&d.addEventListener("versionchange",f=>r(f.oldVersion,f.newVersion,f))}).catch(()=>{}),c}const sc=["get","getKey","getAll","getAllKeys","count"],rc=["put","add","delete","clear"],ki=new Map;function Lr(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(ki.get(e))return ki.get(e);const t=e.replace(/FromIndex$/,""),i=e!==t,r=rc.includes(t);if(!(t in(i?IDBIndex:IDBObjectStore).prototype)||!(r||sc.includes(t)))return;const o=async function(a,...c){const d=this.transaction(a,r?"readwrite":"readonly");let f=d.store;return i&&(f=f.index(c.shift())),(await Promise.all([f[t](...c),r&&d.done]))[0]};return ki.set(e,o),o}ec(n=>({...n,get:(e,t,i)=>Lr(e,t)||n.get(e,t,i),has:(e,t)=>!!Lr(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oc{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(lc(t)){const i=t.getImmediate();return`${i.library}/${i.version}`}else return null}).filter(t=>t).join(" ")}}function lc(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Oi="@firebase/app",Fr="0.14.10";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const De=new Ai("@firebase/app"),ac="@firebase/app-compat",hc="@firebase/analytics-compat",cc="@firebase/analytics",uc="@firebase/app-check-compat",dc="@firebase/app-check",fc="@firebase/auth",pc="@firebase/auth-compat",gc="@firebase/database",_c="@firebase/data-connect",mc="@firebase/database-compat",yc="@firebase/functions",vc="@firebase/functions-compat",Ec="@firebase/installations",wc="@firebase/installations-compat",Cc="@firebase/messaging",Ic="@firebase/messaging-compat",Tc="@firebase/performance",Sc="@firebase/performance-compat",Ac="@firebase/remote-config",bc="@firebase/remote-config-compat",Nc="@firebase/storage",Rc="@firebase/storage-compat",Dc="@firebase/firestore",Pc="@firebase/ai",kc="@firebase/firestore-compat",Oc="firebase",xc="12.11.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xi="[DEFAULT]",Mc={[Oi]:"fire-core",[ac]:"fire-core-compat",[cc]:"fire-analytics",[hc]:"fire-analytics-compat",[dc]:"fire-app-check",[uc]:"fire-app-check-compat",[fc]:"fire-auth",[pc]:"fire-auth-compat",[gc]:"fire-rtdb",[_c]:"fire-data-connect",[mc]:"fire-rtdb-compat",[yc]:"fire-fn",[vc]:"fire-fn-compat",[Ec]:"fire-iid",[wc]:"fire-iid-compat",[Cc]:"fire-fcm",[Ic]:"fire-fcm-compat",[Tc]:"fire-perf",[Sc]:"fire-perf-compat",[Ac]:"fire-rc",[bc]:"fire-rc-compat",[Nc]:"fire-gcs",[Rc]:"fire-gcs-compat",[Dc]:"fire-fst",[kc]:"fire-fst-compat",[Pc]:"fire-vertex","fire-js":"fire-js",[Oc]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mn=new Map,Lc=new Map,Mi=new Map;function Ur(n,e){try{n.container.addComponent(e)}catch(t){De.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Bt(n){const e=n.name;if(Mi.has(e))return De.debug(`There were multiple attempts to register component ${e}.`),!1;Mi.set(e,n);for(const t of Mn.values())Ur(t,n);for(const t of Lc.values())Ur(t,n);return!0}function Vr(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Br(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fc={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Le=new Ar("app","Firebase",Fc);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uc{constructor(e,t,i){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=i,this.container.addComponent(new vt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Le.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jr=xc;function Wr(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const i={name:xi,automaticDataCollectionEnabled:!0,...e},r=i.name;if(typeof r!="string"||!r)throw Le.create("bad-app-name",{appName:String(r)});if(t||(t=Ir()),!t)throw Le.create("no-options");const o=Mn.get(r);if(o){if(Ut(t,o.options)&&Ut(i,o.config))return o;throw Le.create("duplicate-app",{appName:r})}const a=new Gh(r);for(const d of Mi.values())a.addComponent(d);const c=new Uc(t,i,a);return Mn.set(r,c),c}function Hr(n=xi){const e=Mn.get(n);if(!e&&n===xi&&Ir())return Wr();if(!e)throw Le.create("no-app",{appName:n});return e}function Fe(n,e,t){let i=Mc[n]??n;t&&(i+=`-${t}`);const r=i.match(/\s|\//),o=e.match(/\s|\//);if(r||o){const a=[`Unable to register library "${i}" with version "${e}":`];r&&a.push(`library name "${i}" contains illegal characters (whitespace or "/")`),r&&o&&a.push("and"),o&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),De.warn(a.join(" "));return}Bt(new vt(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vc="firebase-heartbeat-database",Bc=1,jt="firebase-heartbeat-store";let Li=null;function Gr(){return Li||(Li=ic(Vc,Bc,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(jt)}catch(t){console.warn(t)}}}}).catch(n=>{throw Le.create("idb-open",{originalErrorMessage:n.message})})),Li}async function jc(n){try{const t=(await Gr()).transaction(jt),i=await t.objectStore(jt).get($r(n));return await t.done,i}catch(e){if(e instanceof mt)De.warn(e.message);else{const t=Le.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});De.warn(t.message)}}}async function qr(n,e){try{const i=(await Gr()).transaction(jt,"readwrite");await i.objectStore(jt).put(e,$r(n)),await i.done}catch(t){if(t instanceof mt)De.warn(t.message);else{const i=Le.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});De.warn(i.message)}}}function $r(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wc=1024,Hc=30;class Gc{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new $c(t),this._heartbeatsCachePromise=this._storage.read().then(i=>(this._heartbeatsCache=i,i))}async triggerHeartbeat(){var e,t;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=zr();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(a=>a.date===o))return;if(this._heartbeatsCache.heartbeats.push({date:o,agent:r}),this._heartbeatsCache.heartbeats.length>Hc){const a=zc(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(i){De.warn(i)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=zr(),{heartbeatsToSend:i,unsentEntries:r}=qc(this._heartbeatsCache.heartbeats),o=kn(JSON.stringify({version:2,heartbeats:i}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}catch(t){return De.warn(t),""}}}function zr(){return new Date().toISOString().substring(0,10)}function qc(n,e=Wc){const t=[];let i=n.slice();for(const r of n){const o=t.find(a=>a.agent===r.agent);if(o){if(o.dates.push(r.date),Yr(t)>e){o.dates.pop();break}}else if(t.push({agent:r.agent,dates:[r.date]}),Yr(t)>e){t.pop();break}i=i.slice(1)}return{heartbeatsToSend:t,unsentEntries:i}}class $c{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ph()?kh().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await jc(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const i=await this.read();return qr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const i=await this.read();return qr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function Yr(n){return kn(JSON.stringify({version:2,heartbeats:n})).length}function zc(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let i=1;i<n.length;i++)n[i].date<t&&(t=n[i].date,e=i);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yc(n){Bt(new vt("platform-logger",e=>new oc(e),"PRIVATE")),Bt(new vt("heartbeat",e=>new Gc(e),"PRIVATE")),Fe(Oi,Fr,n),Fe(Oi,Fr,"esm2020"),Fe("fire-js","")}Yc("");var Kr={};const Xr="@firebase/database",Qr="1.1.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Jr="";function Kc(n){Jr=n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xc{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,t){t==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),J(t))}get(e){const t=this.domStorage_.getItem(this.prefixedName_(e));return t==null?null:Ft(t)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qc{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,t){t==null?delete this.cache_[e]:this.cache_[e]=t}get(e){return Re(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zr=function(n){try{if(typeof window<"u"&&typeof window[n]<"u"){const e=window[n];return e.setItem("firebase:sentinel","cache"),e.removeItem("firebase:sentinel"),new Xc(e)}}catch{}return new Qc},Je=Zr("localStorage"),Jc=Zr("sessionStorage");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Et=new Ai("@firebase/database"),Zc=(function(){let n=1;return function(){return n++}})(),eo=function(n){const e=Bh(n),t=new Vh;t.update(e);const i=t.digest();return Ci.encodeByteArray(i)},Wt=function(...n){let e="";for(let t=0;t<n.length;t++){const i=n[t];Array.isArray(i)||i&&typeof i=="object"&&typeof i.length=="number"?e+=Wt.apply(null,i):typeof i=="object"?e+=J(i):e+=i,e+=" "}return e};let Ht=null,to=!0;const eu=function(n,e){A(!0,"Can't turn on custom loggers persistently."),Et.logLevel=j.VERBOSE,Ht=Et.log.bind(Et)},ne=function(...n){if(to===!0&&(to=!1,Ht===null&&Jc.get("logging_enabled")===!0&&eu()),Ht){const e=Wt.apply(null,n);Ht(e)}},Gt=function(n){return function(...e){ne(n,...e)}},Fi=function(...n){const e="FIREBASE INTERNAL ERROR: "+Wt(...n);Et.error(e)},Pe=function(...n){const e=`FIREBASE FATAL ERROR: ${Wt(...n)}`;throw Et.error(e),new Error(e)},de=function(...n){const e="FIREBASE WARNING: "+Wt(...n);Et.warn(e)},tu=function(){typeof window<"u"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&de("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},no=function(n){return typeof n=="number"&&(n!==n||n===Number.POSITIVE_INFINITY||n===Number.NEGATIVE_INFINITY)},nu=function(n){if(document.readyState==="complete")n();else{let e=!1;const t=function(){if(!document.body){setTimeout(t,Math.floor(10));return}e||(e=!0,n())};document.addEventListener?(document.addEventListener("DOMContentLoaded",t,!1),window.addEventListener("load",t,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{document.readyState==="complete"&&t()}),window.attachEvent("onload",t))}},wt="[MIN_NAME]",Ze="[MAX_NAME]",Ct=function(n,e){if(n===e)return 0;if(n===wt||e===Ze)return-1;if(e===wt||n===Ze)return 1;{const t=ro(n),i=ro(e);return t!==null?i!==null?t-i===0?n.length-e.length:t-i:-1:i!==null?1:n<e?-1:1}},iu=function(n,e){return n===e?0:n<e?-1:1},qt=function(n,e){if(e&&n in e)return e[n];throw new Error("Missing required key ("+n+") in object: "+J(e))},Ui=function(n){if(typeof n!="object"||n===null)return J(n);const e=[];for(const i in n)e.push(i);e.sort();let t="{";for(let i=0;i<e.length;i++)i!==0&&(t+=","),t+=J(e[i]),t+=":",t+=Ui(n[e[i]]);return t+="}",t},io=function(n,e){const t=n.length;if(t<=e)return[n];const i=[];for(let r=0;r<t;r+=e)r+e>t?i.push(n.substring(r,t)):i.push(n.substring(r,r+e));return i};function ae(n,e){for(const t in n)n.hasOwnProperty(t)&&e(t,n[t])}const so=function(n){A(!no(n),"Invalid JSON number");const e=11,t=52,i=(1<<e-1)-1;let r,o,a,c,d;n===0?(o=0,a=0,r=1/n===-1/0?1:0):(r=n<0,n=Math.abs(n),n>=Math.pow(2,1-i)?(c=Math.min(Math.floor(Math.log(n)/Math.LN2),i),o=c+i,a=Math.round(n*Math.pow(2,t-c)-Math.pow(2,t))):(o=0,a=Math.round(n/Math.pow(2,1-i-t))));const f=[];for(d=t;d;d-=1)f.push(a%2?1:0),a=Math.floor(a/2);for(d=e;d;d-=1)f.push(o%2?1:0),o=Math.floor(o/2);f.push(r?1:0),f.reverse();const I=f.join("");let y="";for(d=0;d<64;d+=8){let S=parseInt(I.substr(d,8),2).toString(16);S.length===1&&(S="0"+S),y=y+S}return y.toLowerCase()},su=function(){return!!(typeof window=="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))},ru=function(){return typeof Windows=="object"&&typeof Windows.UI=="object"};function ou(n,e){let t="Unknown Error";n==="too_big"?t="The data requested exceeds the maximum size that can be accessed with a single request.":n==="permission_denied"?t="Client doesn't have permission to access the desired data.":n==="unavailable"&&(t="The service is unavailable");const i=new Error(n+" at "+e._path.toString()+": "+t);return i.code=n.toUpperCase(),i}const lu=new RegExp("^-?(0*)\\d{1,10}$"),au=-2147483648,hu=2147483647,ro=function(n){if(lu.test(n)){const e=Number(n);if(e>=au&&e<=hu)return e}return null},$t=function(n){try{n()}catch(e){setTimeout(()=>{const t=e.stack||"";throw de("Exception was thrown by user callback.",t),e},Math.floor(0))}},cu=function(){return(typeof window=="object"&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},zt=function(n,e){const t=setTimeout(n,e);return typeof t=="number"&&typeof Deno<"u"&&Deno.unrefTimer?Deno.unrefTimer(t):typeof t=="object"&&t.unref&&t.unref(),t};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uu{constructor(e,t){this.appCheckProvider=t,this.appName=e.name,Br(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.appCheck=t==null?void 0:t.getImmediate({optional:!0}),this.appCheck||t==null||t.get().then(i=>this.appCheck=i)}getToken(e){if(this.serverAppAppCheckToken){if(e)throw new Error("Attempted reuse of `FirebaseServerApp.appCheckToken` after previous usage failed.");return Promise.resolve({token:this.serverAppAppCheckToken})}return this.appCheck?this.appCheck.getToken(e):new Promise((t,i)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(t,i):t(null)},0)})}addTokenChangeListener(e){var t;(t=this.appCheckProvider)==null||t.get().then(i=>i.addTokenListener(e))}notifyForInvalidToken(){de(`Provided AppCheck credentials for the app named "${this.appName}" are invalid. This usually indicates your app was not initialized correctly.`)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class du{constructor(e,t,i){this.appName_=e,this.firebaseOptions_=t,this.authProvider_=i,this.auth_=null,this.auth_=i.getImmediate({optional:!0}),this.auth_||i.onInit(r=>this.auth_=r)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(t=>t&&t.code==="auth/token-not-initialized"?(ne("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(t)):new Promise((t,i)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(t,i):t(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(t=>t.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(t=>t.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',de(e)}}class Ln{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}Ln.OWNER="owner";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vi="5",oo="v",lo="s",ao="r",ho="f",co=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,uo="ls",fo="p",Bi="ac",po="websocket",go="long_polling";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _o{constructor(e,t,i,r,o=!1,a="",c=!1,d=!1,f=null){this.secure=t,this.namespace=i,this.webSocketOnly=r,this.nodeAdmin=o,this.persistenceKey=a,this.includeNamespaceInQueryParams=c,this.isUsingEmulator=d,this.emulatorOptions=f,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=Je.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&Je.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",t=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${t}`}}function fu(n){return n.host!==n.internalHost||n.isCustomHost()||n.includeNamespaceInQueryParams}function mo(n,e,t){A(typeof e=="string","typeof type must == string"),A(typeof t=="object","typeof params must == object");let i;if(e===po)i=(n.secure?"wss://":"ws://")+n.internalHost+"/.ws?";else if(e===go)i=(n.secure?"https://":"http://")+n.internalHost+"/.lp?";else throw new Error("Unknown connection type: "+e);fu(n)&&(t.ns=n.namespace);const r=[];return ae(t,(o,a)=>{r.push(o+"="+a)}),i+r.join("&")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pu{constructor(){this.counters_={}}incrementCounter(e,t=1){Re(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=t}get(){return wh(this.counters_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ji={},Wi={};function Hi(n){const e=n.toString();return ji[e]||(ji[e]=new pu),ji[e]}function gu(n,e){const t=n.toString();return Wi[t]||(Wi[t]=e()),Wi[t]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _u{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,t){this.closeAfterResponse=e,this.onClose=t,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,t){for(this.pendingResponses[e]=t;this.pendingResponses[this.currentResponseNum];){const i=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let r=0;r<i.length;++r)i[r]&&$t(()=>{this.onMessage_(i[r])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yo="start",mu="close",yu="pLPCommand",vu="pRTLPCB",vo="id",Eo="pw",wo="ser",Eu="cb",wu="seg",Cu="ts",Iu="d",Tu="dframe",Co=1870,Io=30,Su=Co-Io,Au=25e3,bu=3e4;class It{constructor(e,t,i,r,o,a,c){this.connId=e,this.repoInfo=t,this.applicationId=i,this.appCheckToken=r,this.authToken=o,this.transportSessionId=a,this.lastSessionId=c,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=Gt(e),this.stats_=Hi(t),this.urlFn=d=>(this.appCheckToken&&(d[Bi]=this.appCheckToken),mo(t,go,d))}open(e,t){this.curSegmentNum=0,this.onDisconnect_=t,this.myPacketOrderer=new _u(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(bu)),nu(()=>{if(this.isClosed_)return;this.scriptTagHolder=new Gi((...o)=>{const[a,c,d,f,I]=o;if(this.incrementIncomingBytes_(o),!!this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,a===yo)this.id=c,this.password=d;else if(a===mu)c?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(c,()=>{this.onClosed_()})):this.onClosed_();else throw new Error("Unrecognized command received: "+a)},(...o)=>{const[a,c]=o;this.incrementIncomingBytes_(o),this.myPacketOrderer.handleResponse(a,c)},()=>{this.onClosed_()},this.urlFn);const i={};i[yo]="t",i[wo]=Math.floor(Math.random()*1e8),this.scriptTagHolder.uniqueCallbackIdentifier&&(i[Eu]=this.scriptTagHolder.uniqueCallbackIdentifier),i[oo]=Vi,this.transportSessionId&&(i[lo]=this.transportSessionId),this.lastSessionId&&(i[uo]=this.lastSessionId),this.applicationId&&(i[fo]=this.applicationId),this.appCheckToken&&(i[Bi]=this.appCheckToken),typeof location<"u"&&location.hostname&&co.test(location.hostname)&&(i[ao]=ho);const r=this.urlFn(i);this.log_("Connecting via long-poll to "+r),this.scriptTagHolder.addTag(r,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){It.forceAllow_=!0}static forceDisallow(){It.forceDisallow_=!0}static isAvailable(){return It.forceAllow_?!0:!It.forceDisallow_&&typeof document<"u"&&document.createElement!=null&&!su()&&!ru()}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const t=J(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const i=vr(t),r=io(i,Su);for(let o=0;o<r.length;o++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,r.length,r[o]),this.curSegmentNum++}addDisconnectPingFrame(e,t){this.myDisconnFrame=document.createElement("iframe");const i={};i[Tu]="t",i[vo]=e,i[Eo]=t,this.myDisconnFrame.src=this.urlFn(i),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const t=J(e).length;this.bytesReceived+=t,this.stats_.incrementCounter("bytes_received",t)}}class Gi{constructor(e,t,i,r){this.onDisconnect=i,this.urlFn=r,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(Math.random()*1e8),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=Zc(),window[yu+this.uniqueCallbackIdentifier]=e,window[vu+this.uniqueCallbackIdentifier]=t,this.myIFrame=Gi.createIFrame_();let o="";this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"&&(o='<script>document.domain="'+document.domain+'";<\/script>');const a="<html><body>"+o+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(a),this.myIFrame.doc.close()}catch(c){ne("frame writing exception"),c.stack&&ne(c.stack),ne(c)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",document.body){document.body.appendChild(e);try{e.contentWindow.document||ne("No IE domain setting required")}catch{const i=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+i+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{this.myIFrame!==null&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,t){for(this.myID=e,this.myPW=t,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[vo]=this.myID,e[Eo]=this.myPW,e[wo]=this.currentSerial;let t=this.urlFn(e),i="",r=0;for(;this.pendingSegs.length>0&&this.pendingSegs[0].d.length+Io+i.length<=Co;){const a=this.pendingSegs.shift();i=i+"&"+wu+r+"="+a.seg+"&"+Cu+r+"="+a.ts+"&"+Iu+r+"="+a.d,r++}return t=t+i,this.addLongPollTag_(t,this.currentSerial),!0}else return!1}enqueueSegment(e,t,i){this.pendingSegs.push({seg:e,ts:t,d:i}),this.alive&&this.newRequest_()}addLongPollTag_(e,t){this.outstandingRequests.add(t);const i=()=>{this.outstandingRequests.delete(t),this.newRequest_()},r=setTimeout(i,Math.floor(Au)),o=()=>{clearTimeout(r),i()};this.addTag(e,o)}addTag(e,t){setTimeout(()=>{try{if(!this.sendNewPolls)return;const i=this.myIFrame.doc.createElement("script");i.type="text/javascript",i.async=!0,i.src=e,i.onload=i.onreadystatechange=function(){const r=i.readyState;(!r||r==="loaded"||r==="complete")&&(i.onload=i.onreadystatechange=null,i.parentNode&&i.parentNode.removeChild(i),t())},i.onerror=()=>{ne("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(i)}catch{}},Math.floor(1))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nu=16384,Ru=45e3;let Fn=null;typeof MozWebSocket<"u"?Fn=MozWebSocket:typeof WebSocket<"u"&&(Fn=WebSocket);class me{constructor(e,t,i,r,o,a,c){this.connId=e,this.applicationId=i,this.appCheckToken=r,this.authToken=o,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=Gt(this.connId),this.stats_=Hi(t),this.connURL=me.connectionURL_(t,a,c,r,i),this.nodeAdmin=t.nodeAdmin}static connectionURL_(e,t,i,r,o){const a={};return a[oo]=Vi,typeof location<"u"&&location.hostname&&co.test(location.hostname)&&(a[ao]=ho),t&&(a[lo]=t),i&&(a[uo]=i),r&&(a[Bi]=r),o&&(a[fo]=o),mo(e,po,a)}open(e,t){this.onDisconnect=t,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,Je.set("previous_websocket_failure",!0);try{let i;Dh(),this.mySock=new Fn(this.connURL,[],i)}catch(i){this.log_("Error instantiating WebSocket.");const r=i.message||i.data;r&&this.log_(r),this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=i=>{this.handleIncomingFrame(i)},this.mySock.onerror=i=>{this.log_("WebSocket error.  Closing connection.");const r=i.message||i.data;r&&this.log_(r),this.onClosed_()}}start(){}static forceDisallow(){me.forceDisallow_=!0}static isAvailable(){let e=!1;if(typeof navigator<"u"&&navigator.userAgent){const t=/Android ([0-9]{0,}\.[0-9]{0,})/,i=navigator.userAgent.match(t);i&&i.length>1&&parseFloat(i[1])<4.4&&(e=!0)}return!e&&Fn!==null&&!me.forceDisallow_}static previouslyFailed(){return Je.isInMemoryStorage||Je.get("previous_websocket_failure")===!0}markConnectionHealthy(){Je.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const t=this.frames.join("");this.frames=null;const i=Ft(t);this.onMessage(i)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(A(this.frames===null,"We already have a frame buffer"),e.length<=6){const t=Number(e);if(!isNaN(t))return this.handleNewFrameCount_(t),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(this.mySock===null)return;const t=e.data;if(this.bytesReceived+=t.length,this.stats_.incrementCounter("bytes_received",t.length),this.resetKeepAlive(),this.frames!==null)this.appendFrame_(t);else{const i=this.extractFrameCount_(t);i!==null&&this.appendFrame_(i)}}send(e){this.resetKeepAlive();const t=J(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const i=io(t,Nu);i.length>1&&this.sendString_(String(i.length));for(let r=0;r<i.length;r++)this.sendString_(i[r])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(Ru))}sendString_(e){try{this.mySock.send(e)}catch(t){this.log_("Exception thrown from WebSocket.send():",t.message||t.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}me.responsesRequiredToBeHealthy=2,me.healthyTimeout=3e4;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yt{static get ALL_TRANSPORTS(){return[It,me]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}constructor(e){this.initTransports_(e)}initTransports_(e){const t=me&&me.isAvailable();let i=t&&!me.previouslyFailed();if(e.webSocketOnly&&(t||de("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),i=!0),i)this.transports_=[me];else{const r=this.transports_=[];for(const o of Yt.ALL_TRANSPORTS)o&&o.isAvailable()&&r.push(o);Yt.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}Yt.globalTransportInitialized_=!1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Du=6e4,Pu=5e3,ku=10*1024,Ou=100*1024,qi="t",To="d",xu="s",So="r",Mu="e",Ao="o",bo="a",No="n",Ro="p",Lu="h";class Fu{constructor(e,t,i,r,o,a,c,d,f,I){this.id=e,this.repoInfo_=t,this.applicationId_=i,this.appCheckToken_=r,this.authToken_=o,this.onMessage_=a,this.onReady_=c,this.onDisconnect_=d,this.onKill_=f,this.lastSessionId=I,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=Gt("c:"+this.id+":"),this.transportManager_=new Yt(t),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.conn_),i=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(t,i)},Math.floor(0));const r=e.healthyTimeout||0;r>0&&(this.healthyTimeout_=zt(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>Ou?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>ku?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(r)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return t=>{e===this.conn_?this.onConnectionLost_(t):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return t=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(t):e===this.secondaryConn_?this.onSecondaryMessageReceived_(t):this.log_("message on old connection"))}}sendRequest(e){const t={t:"d",d:e};this.sendData_(t)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(qi in e){const t=e[qi];t===bo?this.upgradeIfSecondaryHealthy_():t===So?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_)&&this.close()):t===Ao&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const t=qt("t",e),i=qt("d",e);if(t==="c")this.onSecondaryControl_(i);else if(t==="d")this.pendingDataMessages.push(i);else throw new Error("Unknown protocol layer: "+t)}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:Ro,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:bo,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:No,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const t=qt("t",e),i=qt("d",e);t==="c"?this.onControl_(i):t==="d"&&this.onDataMessage_(i)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const t=qt(qi,e);if(To in e){const i=e[To];if(t===Lu){const r={...i};this.repoInfo_.isUsingEmulator&&(r.h=this.repoInfo_.host),this.onHandshake_(r)}else if(t===No){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let r=0;r<this.pendingDataMessages.length;++r)this.onDataMessage_(this.pendingDataMessages[r]);this.pendingDataMessages=[],this.tryCleanupConnection()}else t===xu?this.onConnectionShutdown_(i):t===So?this.onReset_(i):t===Mu?Fi("Server Error: "+i):t===Ao?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):Fi("Unknown control packet command: "+t)}}onHandshake_(e){const t=e.ts,i=e.v,r=e.h;this.sessionId=e.s,this.repoInfo_.host=r,this.state_===0&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,t),Vi!==i&&de("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.secondaryConn_),i=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(t,i),zt(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(Du))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,this.state_===1?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,t){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(t,this.sessionId),this.onReady_=null),this.primaryResponsesRequired_===0?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):zt(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(Pu))}sendPingOnPrimaryIfNecessary_(){!this.isHealthy_&&this.state_===1&&(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:Ro,d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,(this.tx_===e||this.rx_===e)&&this.close()}onConnectionLost_(e){this.conn_=null,!e&&this.state_===0?(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(Je.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)):this.state_===1&&this.log_("Realtime connection lost."),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){this.state_!==2&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Do{put(e,t,i,r){}merge(e,t,i,r){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,t,i){}onDisconnectMerge(e,t,i){}onDisconnectCancel(e,t){}reportStats(e){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Po{constructor(e){this.allowedEvents_=e,this.listeners_={},A(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...t){if(Array.isArray(this.listeners_[e])){const i=[...this.listeners_[e]];for(let r=0;r<i.length;r++)i[r].callback.apply(i[r].context,t)}}on(e,t,i){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:t,context:i});const r=this.getInitialEvent(e);r&&t.apply(i,r)}off(e,t,i){this.validateEventType_(e);const r=this.listeners_[e]||[];for(let o=0;o<r.length;o++)if(r[o].callback===t&&(!i||i===r[o].context)){r.splice(o,1);return}}validateEventType_(e){A(this.allowedEvents_.find(t=>t===e),"Unknown event: "+e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Un extends Po{static getInstance(){return new Un}constructor(){super(["online"]),this.online_=!0,typeof window<"u"&&typeof window.addEventListener<"u"&&!Sr()&&(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}getInitialEvent(e){return A(e==="online","Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ko=32,Oo=768;class W{constructor(e,t){if(t===void 0){this.pieces_=e.split("/");let i=0;for(let r=0;r<this.pieces_.length;r++)this.pieces_[r].length>0&&(this.pieces_[i]=this.pieces_[r],i++);this.pieces_.length=i,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=t}toString(){let e="";for(let t=this.pieceNum_;t<this.pieces_.length;t++)this.pieces_[t]!==""&&(e+="/"+this.pieces_[t]);return e||"/"}}function B(){return new W("")}function x(n){return n.pieceNum_>=n.pieces_.length?null:n.pieces_[n.pieceNum_]}function Ue(n){return n.pieces_.length-n.pieceNum_}function G(n){let e=n.pieceNum_;return e<n.pieces_.length&&e++,new W(n.pieces_,e)}function xo(n){return n.pieceNum_<n.pieces_.length?n.pieces_[n.pieces_.length-1]:null}function Uu(n){let e="";for(let t=n.pieceNum_;t<n.pieces_.length;t++)n.pieces_[t]!==""&&(e+="/"+encodeURIComponent(String(n.pieces_[t])));return e||"/"}function Mo(n,e=0){return n.pieces_.slice(n.pieceNum_+e)}function Lo(n){if(n.pieceNum_>=n.pieces_.length)return null;const e=[];for(let t=n.pieceNum_;t<n.pieces_.length-1;t++)e.push(n.pieces_[t]);return new W(e,0)}function X(n,e){const t=[];for(let i=n.pieceNum_;i<n.pieces_.length;i++)t.push(n.pieces_[i]);if(e instanceof W)for(let i=e.pieceNum_;i<e.pieces_.length;i++)t.push(e.pieces_[i]);else{const i=e.split("/");for(let r=0;r<i.length;r++)i[r].length>0&&t.push(i[r])}return new W(t,0)}function M(n){return n.pieceNum_>=n.pieces_.length}function he(n,e){const t=x(n),i=x(e);if(t===null)return e;if(t===i)return he(G(n),G(e));throw new Error("INTERNAL ERROR: innerPath ("+e+") is not within outerPath ("+n+")")}function $i(n,e){if(Ue(n)!==Ue(e))return!1;for(let t=n.pieceNum_,i=e.pieceNum_;t<=n.pieces_.length;t++,i++)if(n.pieces_[t]!==e.pieces_[i])return!1;return!0}function ye(n,e){let t=n.pieceNum_,i=e.pieceNum_;if(Ue(n)>Ue(e))return!1;for(;t<n.pieces_.length;){if(n.pieces_[t]!==e.pieces_[i])return!1;++t,++i}return!0}class Vu{constructor(e,t){this.errorPrefix_=t,this.parts_=Mo(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let i=0;i<this.parts_.length;i++)this.byteLength_+=xn(this.parts_[i]);Fo(this)}}function Bu(n,e){n.parts_.length>0&&(n.byteLength_+=1),n.parts_.push(e),n.byteLength_+=xn(e),Fo(n)}function ju(n){const e=n.parts_.pop();n.byteLength_-=xn(e),n.parts_.length>0&&(n.byteLength_-=1)}function Fo(n){if(n.byteLength_>Oo)throw new Error(n.errorPrefix_+"has a key path longer than "+Oo+" bytes ("+n.byteLength_+").");if(n.parts_.length>ko)throw new Error(n.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+ko+") or object contains a cycle "+et(n))}function et(n){return n.parts_.length===0?"":"in property '"+n.parts_.join(".")+"'"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zi extends Po{static getInstance(){return new zi}constructor(){super(["visible"]);let e,t;typeof document<"u"&&typeof document.addEventListener<"u"&&(typeof document.hidden<"u"?(t="visibilitychange",e="hidden"):typeof document.mozHidden<"u"?(t="mozvisibilitychange",e="mozHidden"):typeof document.msHidden<"u"?(t="msvisibilitychange",e="msHidden"):typeof document.webkitHidden<"u"&&(t="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,t&&document.addEventListener(t,()=>{const i=!document[e];i!==this.visible_&&(this.visible_=i,this.trigger("visible",i))},!1)}getInitialEvent(e){return A(e==="visible","Unknown event type: "+e),[this.visible_]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kt=1e3,Wu=300*1e3,Uo=30*1e3,Hu=1.3,Gu=3e4,qu="server_kill",Vo=3;class ke extends Do{constructor(e,t,i,r,o,a,c,d){if(super(),this.repoInfo_=e,this.applicationId_=t,this.onDataUpdate_=i,this.onConnectStatus_=r,this.onServerInfoUpdate_=o,this.authTokenProvider_=a,this.appCheckTokenProvider_=c,this.authOverride_=d,this.id=ke.nextPersistentConnectionId_++,this.log_=Gt("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=Kt,this.maxReconnectDelay_=Wu,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,d)throw new Error("Auth override specified in options, but not supported on non Node.js platforms");zi.getInstance().on("visible",this.onVisible_,this),e.host.indexOf("fblocal")===-1&&Un.getInstance().on("online",this.onOnline_,this)}sendRequest(e,t,i){const r=++this.requestNumber_,o={r,a:e,b:t};this.log_(J(o)),A(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(o),i&&(this.requestCBHash_[r]=i)}get(e){this.initConnection_();const t=new Ti,r={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:a=>{const c=a.d;a.s==="ok"?t.resolve(c):t.reject(c)}};this.outstandingGets_.push(r),this.outstandingGetCount_++;const o=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(o),t.promise}listen(e,t,i,r){this.initConnection_();const o=e._queryIdentifier,a=e._path.toString();this.log_("Listen called for "+a+" "+o),this.listens.has(a)||this.listens.set(a,new Map),A(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),A(!this.listens.get(a).has(o),"listen() called twice for same path/queryId.");const c={onComplete:r,hashFn:t,query:e,tag:i};this.listens.get(a).set(o,c),this.connected_&&this.sendListen_(c)}sendGet_(e){const t=this.outstandingGets_[e];this.sendRequest("g",t.request,i=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,this.outstandingGetCount_===0&&(this.outstandingGets_=[]),t.onComplete&&t.onComplete(i)})}sendListen_(e){const t=e.query,i=t._path.toString(),r=t._queryIdentifier;this.log_("Listen on "+i+" for "+r);const o={p:i},a="q";e.tag&&(o.q=t._queryObject,o.t=e.tag),o.h=e.hashFn(),this.sendRequest(a,o,c=>{const d=c.d,f=c.s;ke.warnOnListenWarnings_(d,t),(this.listens.get(i)&&this.listens.get(i).get(r))===e&&(this.log_("listen response",c),f!=="ok"&&this.removeListen_(i,r),e.onComplete&&e.onComplete(f,d))})}static warnOnListenWarnings_(e,t){if(e&&typeof e=="object"&&Re(e,"w")){const i=yt(e,"w");if(Array.isArray(i)&&~i.indexOf("no_index")){const r='".indexOn": "'+t._queryParams.getIndex().toString()+'"',o=t._path.toString();de(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${r} at ${o} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&e.length===40||Fh(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=Uo)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,t=Lh(e)?"auth":"gauth",i={cred:e};this.authOverride_===null?i.noauth=!0:typeof this.authOverride_=="object"&&(i.authvar=this.authOverride_),this.sendRequest(t,i,r=>{const o=r.s,a=r.d||"error";this.authToken_===e&&(o==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(o,a))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const t=e.s,i=e.d||"error";t==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(t,i)})}unlisten(e,t){const i=e._path.toString(),r=e._queryIdentifier;this.log_("Unlisten called for "+i+" "+r),A(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query"),this.removeListen_(i,r)&&this.connected_&&this.sendUnlisten_(i,r,e._queryObject,t)}sendUnlisten_(e,t,i,r){this.log_("Unlisten on "+e+" for "+t);const o={p:e},a="n";r&&(o.q=i,o.t=r),this.sendRequest(a,o)}onDisconnectPut(e,t,i){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,t,i):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:t,onComplete:i})}onDisconnectMerge(e,t,i){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,t,i):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:t,onComplete:i})}onDisconnectCancel(e,t){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,t):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:t})}sendOnDisconnect_(e,t,i,r){const o={p:t,d:i};this.log_("onDisconnect "+e,o),this.sendRequest(e,o,a=>{r&&setTimeout(()=>{r(a.s,a.d)},Math.floor(0))})}put(e,t,i,r){this.putInternal("p",e,t,i,r)}merge(e,t,i,r){this.putInternal("m",e,t,i,r)}putInternal(e,t,i,r,o){this.initConnection_();const a={p:t,d:i};o!==void 0&&(a.h=o),this.outstandingPuts_.push({action:e,request:a,onComplete:r}),this.outstandingPutCount_++;const c=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(c):this.log_("Buffering put: "+t)}sendPut_(e){const t=this.outstandingPuts_[e].action,i=this.outstandingPuts_[e].request,r=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(t,i,o=>{this.log_(t+" response",o),delete this.outstandingPuts_[e],this.outstandingPutCount_--,this.outstandingPutCount_===0&&(this.outstandingPuts_=[]),r&&r(o.s,o.d)})}reportStats(e){if(this.connected_){const t={c:e};this.log_("reportStats",t),this.sendRequest("s",t,i=>{if(i.s!=="ok"){const o=i.d;this.log_("reportStats","Error sending stats: "+o)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+J(e));const t=e.r,i=this.requestCBHash_[t];i&&(delete this.requestCBHash_[t],i(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,t){this.log_("handleServerMessage",e,t),e==="d"?this.onDataUpdate_(t.p,t.d,!1,t.t):e==="m"?this.onDataUpdate_(t.p,t.d,!0,t.t):e==="c"?this.onListenRevoked_(t.p,t.q):e==="ac"?this.onAuthRevoked_(t.s,t.d):e==="apc"?this.onAppCheckRevoked_(t.s,t.d):e==="sd"?this.onSecurityDebugPacket_(t):Fi("Unrecognized action received from server: "+J(e)+`
Are you using the latest client?`)}onReady_(e,t){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=new Date().getTime(),this.handleTimestamp_(e),this.lastSessionId=t,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){A(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=Kt,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=Kt,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){this.visible_?this.lastConnectionEstablishedTime_&&(new Date().getTime()-this.lastConnectionEstablishedTime_>Gu&&(this.reconnectDelay_=Kt),this.lastConnectionEstablishedTime_=null):(this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=new Date().getTime());const e=Math.max(0,new Date().getTime()-this.lastConnectionAttemptTime_);let t=Math.max(0,this.reconnectDelay_-e);t=Math.random()*t,this.log_("Trying to reconnect in "+t+"ms"),this.scheduleConnect_(t),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*Hu)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=new Date().getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),t=this.onReady_.bind(this),i=this.onRealtimeDisconnect_.bind(this),r=this.id+":"+ke.nextConnectionId_++,o=this.lastSessionId;let a=!1,c=null;const d=function(){c?c.close():(a=!0,i())},f=function(y){A(c,"sendRequest call when we're not connected not allowed."),c.sendRequest(y)};this.realtime_={close:d,sendRequest:f};const I=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[y,S]=await Promise.all([this.authTokenProvider_.getToken(I),this.appCheckTokenProvider_.getToken(I)]);a?ne("getToken() completed but was canceled"):(ne("getToken() completed. Creating connection."),this.authToken_=y&&y.accessToken,this.appCheckToken_=S&&S.token,c=new Fu(r,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,t,i,N=>{de(N+" ("+this.repoInfo_.toString()+")"),this.interrupt(qu)},o))}catch(y){this.log_("Failed to get token: "+y),a||(this.repoInfo_.nodeAdmin&&de(y),d())}}}interrupt(e){ne("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){ne("Resuming connection for reason: "+e),delete this.interruptReasons_[e],Nr(this.interruptReasons_)&&(this.reconnectDelay_=Kt,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const t=e-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:t})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const t=this.outstandingPuts_[e];t&&"h"in t.request&&t.queued&&(t.onComplete&&t.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,t){let i;t?i=t.map(o=>Ui(o)).join("$"):i="default";const r=this.removeListen_(e,i);r&&r.onComplete&&r.onComplete("permission_denied")}removeListen_(e,t){const i=new W(e).toString();let r;if(this.listens.has(i)){const o=this.listens.get(i);r=o.get(t),o.delete(t),o.size===0&&this.listens.delete(i)}else r=void 0;return r}onAuthRevoked_(e,t){ne("Auth token revoked: "+e+"/"+t),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),(e==="invalid_token"||e==="permission_denied")&&(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=Vo&&(this.reconnectDelay_=Uo,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,t){ne("App check token revoked: "+e+"/"+t),this.appCheckToken_=null,this.forceTokenRefresh_=!0,(e==="invalid_token"||e==="permission_denied")&&(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=Vo&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace(`
`,`
FIREBASE: `))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const t of e.values())this.sendListen_(t);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let t="js";e["sdk."+t+"."+Jr.replace(/\./g,"-")]=1,Sr()?e["framework.cordova"]=1:Rh()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=Un.getInstance().currentlyOnline();return Nr(this.interruptReasons_)&&e}}ke.nextPersistentConnectionId_=0,ke.nextConnectionId_=0;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O{constructor(e,t){this.name=e,this.node=t}static Wrap(e,t){return new O(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vn{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,t){const i=new O(wt,e),r=new O(wt,t);return this.compare(i,r)!==0}minPost(){return O.MIN}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Bn;class Bo extends Vn{static get __EMPTY_NODE(){return Bn}static set __EMPTY_NODE(e){Bn=e}compare(e,t){return Ct(e.name,t.name)}isDefinedOn(e){throw _t("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,t){return!1}minPost(){return O.MIN}maxPost(){return new O(Ze,Bn)}makePost(e,t){return A(typeof e=="string","KeyIndex indexValue must always be a string."),new O(e,Bn)}toString(){return".key"}}const Tt=new Bo;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jn{constructor(e,t,i,r,o=null){this.isReverse_=r,this.resultGenerator_=o,this.nodeStack_=[];let a=1;for(;!e.isEmpty();)if(e=e,a=t?i(e.key,t):1,r&&(a*=-1),a<0)this.isReverse_?e=e.left:e=e.right;else if(a===0){this.nodeStack_.push(e);break}else this.nodeStack_.push(e),this.isReverse_?e=e.right:e=e.left}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop(),t;if(this.resultGenerator_?t=this.resultGenerator_(e.key,e.value):t={key:e.key,value:e.value},this.isReverse_)for(e=e.left;!e.isEmpty();)this.nodeStack_.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack_.push(e),e=e.left;return t}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}}class Z{constructor(e,t,i,r,o){this.key=e,this.value=t,this.color=i??Z.RED,this.left=r??ce.EMPTY_NODE,this.right=o??ce.EMPTY_NODE}copy(e,t,i,r,o){return new Z(e??this.key,t??this.value,i??this.color,r??this.left,o??this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,i){let r=this;const o=i(e,r.key);return o<0?r=r.copy(null,null,null,r.left.insert(e,t,i),null):o===0?r=r.copy(null,t,null,null,null):r=r.copy(null,null,null,null,r.right.insert(e,t,i)),r.fixUp_()}removeMin_(){if(this.left.isEmpty())return ce.EMPTY_NODE;let e=this;return!e.left.isRed_()&&!e.left.left.isRed_()&&(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,t){let i,r;if(i=this,t(e,i.key)<0)!i.left.isEmpty()&&!i.left.isRed_()&&!i.left.left.isRed_()&&(i=i.moveRedLeft_()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed_()&&(i=i.rotateRight_()),!i.right.isEmpty()&&!i.right.isRed_()&&!i.right.left.isRed_()&&(i=i.moveRedRight_()),t(e,i.key)===0){if(i.right.isEmpty())return ce.EMPTY_NODE;r=i.right.min_(),i=i.copy(r.key,r.value,null,null,i.right.removeMin_())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,Z.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,Z.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}}Z.RED=!0,Z.BLACK=!1;class $u{copy(e,t,i,r,o){return this}insert(e,t,i){return new Z(e,t,null)}remove(e,t){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}}class ce{constructor(e,t=ce.EMPTY_NODE){this.comparator_=e,this.root_=t}insert(e,t){return new ce(this.comparator_,this.root_.insert(e,t,this.comparator_).copy(null,null,Z.BLACK,null,null))}remove(e){return new ce(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,Z.BLACK,null,null))}get(e){let t,i=this.root_;for(;!i.isEmpty();){if(t=this.comparator_(e,i.key),t===0)return i.value;t<0?i=i.left:t>0&&(i=i.right)}return null}getPredecessorKey(e){let t,i=this.root_,r=null;for(;!i.isEmpty();)if(t=this.comparator_(e,i.key),t===0){if(i.left.isEmpty())return r?r.key:null;for(i=i.left;!i.right.isEmpty();)i=i.right;return i.key}else t<0?i=i.left:t>0&&(r=i,i=i.right);throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new jn(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,t){return new jn(this.root_,e,this.comparator_,!1,t)}getReverseIteratorFrom(e,t){return new jn(this.root_,e,this.comparator_,!0,t)}getReverseIterator(e){return new jn(this.root_,null,this.comparator_,!0,e)}}ce.EMPTY_NODE=new $u;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zu(n,e){return Ct(n.name,e.name)}function Yi(n,e){return Ct(n,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ki;function Yu(n){Ki=n}const jo=function(n){return typeof n=="number"?"number:"+so(n):"string:"+n},Wo=function(n){if(n.isLeafNode()){const e=n.val();A(typeof e=="string"||typeof e=="number"||typeof e=="object"&&Re(e,".sv"),"Priority must be a string or number.")}else A(n===Ki||n.isEmpty(),"priority of unexpected type.");A(n===Ki||n.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ho;class ee{static set __childrenNodeConstructor(e){Ho=e}static get __childrenNodeConstructor(){return Ho}constructor(e,t=ee.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=t,this.lazyHash_=null,A(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value."),Wo(this.priorityNode_)}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new ee(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:ee.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return M(e)?this:x(e)===".priority"?this.priorityNode_:ee.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,t){return null}updateImmediateChild(e,t){return e===".priority"?this.updatePriority(t):t.isEmpty()&&e!==".priority"?this:ee.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,t).updatePriority(this.priorityNode_)}updateChild(e,t){const i=x(e);return i===null?t:t.isEmpty()&&i!==".priority"?this:(A(i!==".priority"||Ue(e)===1,".priority must be the last token in a path"),this.updateImmediateChild(i,ee.__childrenNodeConstructor.EMPTY_NODE.updateChild(G(e),t)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,t){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+jo(this.priorityNode_.val())+":");const t=typeof this.value_;e+=t+":",t==="number"?e+=so(this.value_):e+=this.value_,this.lazyHash_=eo(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===ee.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof ee.__childrenNodeConstructor?-1:(A(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const t=typeof e.value_,i=typeof this.value_,r=ee.VALUE_TYPE_ORDER.indexOf(t),o=ee.VALUE_TYPE_ORDER.indexOf(i);return A(r>=0,"Unknown leaf type: "+t),A(o>=0,"Unknown leaf type: "+i),r===o?i==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:o-r}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const t=e;return this.value_===t.value_&&this.priorityNode_.equals(t.priorityNode_)}else return!1}}ee.VALUE_TYPE_ORDER=["object","boolean","number","string"];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Go,qo;function Ku(n){Go=n}function Xu(n){qo=n}class Qu extends Vn{compare(e,t){const i=e.node.getPriority(),r=t.node.getPriority(),o=i.compareTo(r);return o===0?Ct(e.name,t.name):o}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,t){return!e.getPriority().equals(t.getPriority())}minPost(){return O.MIN}maxPost(){return new O(Ze,new ee("[PRIORITY-POST]",qo))}makePost(e,t){const i=Go(e);return new O(t,new ee("[PRIORITY-POST]",i))}toString(){return".priority"}}const z=new Qu;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ju=Math.log(2);class Zu{constructor(e){const t=o=>parseInt(Math.log(o)/Ju,10),i=o=>parseInt(Array(o+1).join("1"),2);this.count=t(e+1),this.current_=this.count-1;const r=i(this.count);this.bits_=e+1&r}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const Wn=function(n,e,t,i){n.sort(e);const r=function(d,f){const I=f-d;let y,S;if(I===0)return null;if(I===1)return y=n[d],S=t?t(y):y,new Z(S,y.node,Z.BLACK,null,null);{const N=parseInt(I/2,10)+d,R=r(d,N),P=r(N+1,f);return y=n[N],S=t?t(y):y,new Z(S,y.node,Z.BLACK,R,P)}},o=function(d){let f=null,I=null,y=n.length;const S=function(R,P){const L=y-R,fe=y;y-=R;const Ie=r(L+1,fe),pe=n[L],He=t?t(pe):pe;N(new Z(He,pe.node,P,null,Ie))},N=function(R){f?(f.left=R,f=R):(I=R,f=R)};for(let R=0;R<d.count;++R){const P=d.nextBitIsOne(),L=Math.pow(2,d.count-(R+1));P?S(L,Z.BLACK):(S(L,Z.BLACK),S(L,Z.RED))}return I},a=new Zu(n.length),c=o(a);return new ce(i||e,c)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Xi;const St={};class Oe{static get Default(){return A(St&&z,"ChildrenNode.ts has not been loaded"),Xi=Xi||new Oe({".priority":St},{".priority":z}),Xi}constructor(e,t){this.indexes_=e,this.indexSet_=t}get(e){const t=yt(this.indexes_,e);if(!t)throw new Error("No index defined for "+e);return t instanceof ce?t:null}hasIndex(e){return Re(this.indexSet_,e.toString())}addIndex(e,t){A(e!==Tt,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const i=[];let r=!1;const o=t.getIterator(O.Wrap);let a=o.getNext();for(;a;)r=r||e.isDefinedOn(a.node),i.push(a),a=o.getNext();let c;r?c=Wn(i,e.getCompare()):c=St;const d=e.toString(),f={...this.indexSet_};f[d]=e;const I={...this.indexes_};return I[d]=c,new Oe(I,f)}addToIndexes(e,t){const i=On(this.indexes_,(r,o)=>{const a=yt(this.indexSet_,o);if(A(a,"Missing index implementation for "+o),r===St)if(a.isDefinedOn(e.node)){const c=[],d=t.getIterator(O.Wrap);let f=d.getNext();for(;f;)f.name!==e.name&&c.push(f),f=d.getNext();return c.push(e),Wn(c,a.getCompare())}else return St;else{const c=t.get(e.name);let d=r;return c&&(d=d.remove(new O(e.name,c))),d.insert(e,e.node)}});return new Oe(i,this.indexSet_)}removeFromIndexes(e,t){const i=On(this.indexes_,r=>{if(r===St)return r;{const o=t.get(e.name);return o?r.remove(new O(e.name,o)):r}});return new Oe(i,this.indexSet_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Xt;class D{static get EMPTY_NODE(){return Xt||(Xt=new D(new ce(Yi),null,Oe.Default))}constructor(e,t,i){this.children_=e,this.priorityNode_=t,this.indexMap_=i,this.lazyHash_=null,this.priorityNode_&&Wo(this.priorityNode_),this.children_.isEmpty()&&A(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}isLeafNode(){return!1}getPriority(){return this.priorityNode_||Xt}updatePriority(e){return this.children_.isEmpty()?this:new D(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{const t=this.children_.get(e);return t===null?Xt:t}}getChild(e){const t=x(e);return t===null?this:this.getImmediateChild(t).getChild(G(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,t){if(A(t,"We should always be passing snapshot nodes"),e===".priority")return this.updatePriority(t);{const i=new O(e,t);let r,o;t.isEmpty()?(r=this.children_.remove(e),o=this.indexMap_.removeFromIndexes(i,this.children_)):(r=this.children_.insert(e,t),o=this.indexMap_.addToIndexes(i,this.children_));const a=r.isEmpty()?Xt:this.priorityNode_;return new D(r,a,o)}}updateChild(e,t){const i=x(e);if(i===null)return t;{A(x(e)!==".priority"||Ue(e)===1,".priority must be the last token in a path");const r=this.getImmediateChild(i).updateChild(G(e),t);return this.updateImmediateChild(i,r)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const t={};let i=0,r=0,o=!0;if(this.forEachChild(z,(a,c)=>{t[a]=c.val(e),i++,o&&D.INTEGER_REGEXP_.test(a)?r=Math.max(r,Number(a)):o=!1}),!e&&o&&r<2*i){const a=[];for(const c in t)a[c]=t[c];return a}else return e&&!this.getPriority().isEmpty()&&(t[".priority"]=this.getPriority().val()),t}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+jo(this.getPriority().val())+":"),this.forEachChild(z,(t,i)=>{const r=i.hash();r!==""&&(e+=":"+t+":"+r)}),this.lazyHash_=e===""?"":eo(e)}return this.lazyHash_}getPredecessorChildName(e,t,i){const r=this.resolveIndex_(i);if(r){const o=r.getPredecessorKey(new O(e,t));return o?o.name:null}else return this.children_.getPredecessorKey(e)}getFirstChildName(e){const t=this.resolveIndex_(e);if(t){const i=t.minKey();return i&&i.name}else return this.children_.minKey()}getFirstChild(e){const t=this.getFirstChildName(e);return t?new O(t,this.children_.get(t)):null}getLastChildName(e){const t=this.resolveIndex_(e);if(t){const i=t.maxKey();return i&&i.name}else return this.children_.maxKey()}getLastChild(e){const t=this.getLastChildName(e);return t?new O(t,this.children_.get(t)):null}forEachChild(e,t){const i=this.resolveIndex_(e);return i?i.inorderTraversal(r=>t(r.name,r.node)):this.children_.inorderTraversal(t)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,t){const i=this.resolveIndex_(t);if(i)return i.getIteratorFrom(e,r=>r);{const r=this.children_.getIteratorFrom(e.name,O.Wrap);let o=r.peek();for(;o!=null&&t.compare(o,e)<0;)r.getNext(),o=r.peek();return r}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,t){const i=this.resolveIndex_(t);if(i)return i.getReverseIteratorFrom(e,r=>r);{const r=this.children_.getReverseIteratorFrom(e.name,O.Wrap);let o=r.peek();for(;o!=null&&t.compare(o,e)>0;)r.getNext(),o=r.peek();return r}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===Qt?-1:0}withIndex(e){if(e===Tt||this.indexMap_.hasIndex(e))return this;{const t=this.indexMap_.addIndex(e,this.children_);return new D(this.children_,this.priorityNode_,t)}}isIndexed(e){return e===Tt||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const t=e;if(this.getPriority().equals(t.getPriority()))if(this.children_.count()===t.children_.count()){const i=this.getIterator(z),r=t.getIterator(z);let o=i.getNext(),a=r.getNext();for(;o&&a;){if(o.name!==a.name||!o.node.equals(a.node))return!1;o=i.getNext(),a=r.getNext()}return o===null&&a===null}else return!1;else return!1}}resolveIndex_(e){return e===Tt?null:this.indexMap_.get(e.toString())}}D.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class ed extends D{constructor(){super(new ce(Yi),D.EMPTY_NODE,Oe.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return D.EMPTY_NODE}isEmpty(){return!1}}const Qt=new ed;Object.defineProperties(O,{MIN:{value:new O(wt,D.EMPTY_NODE)},MAX:{value:new O(Ze,Qt)}}),Bo.__EMPTY_NODE=D.EMPTY_NODE,ee.__childrenNodeConstructor=D,Yu(Qt),Xu(Qt);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const td=!0;function ie(n,e=null){if(n===null)return D.EMPTY_NODE;if(typeof n=="object"&&".priority"in n&&(e=n[".priority"]),A(e===null||typeof e=="string"||typeof e=="number"||typeof e=="object"&&".sv"in e,"Invalid priority type found: "+typeof e),typeof n=="object"&&".value"in n&&n[".value"]!==null&&(n=n[".value"]),typeof n!="object"||".sv"in n){const t=n;return new ee(t,ie(e))}if(!(n instanceof Array)&&td){const t=[];let i=!1;if(ae(n,(a,c)=>{if(a.substring(0,1)!=="."){const d=ie(c);d.isEmpty()||(i=i||!d.getPriority().isEmpty(),t.push(new O(a,d)))}}),t.length===0)return D.EMPTY_NODE;const o=Wn(t,zu,a=>a.name,Yi);if(i){const a=Wn(t,z.getCompare());return new D(o,ie(e),new Oe({".priority":a},{".priority":z}))}else return new D(o,ie(e),Oe.Default)}else{let t=D.EMPTY_NODE;return ae(n,(i,r)=>{if(Re(n,i)&&i.substring(0,1)!=="."){const o=ie(r);(o.isLeafNode()||!o.isEmpty())&&(t=t.updateImmediateChild(i,o))}}),t.updatePriority(ie(e))}}Ku(ie);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nd extends Vn{constructor(e){super(),this.indexPath_=e,A(!M(e)&&x(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,t){const i=this.extractChild(e.node),r=this.extractChild(t.node),o=i.compareTo(r);return o===0?Ct(e.name,t.name):o}makePost(e,t){const i=ie(e),r=D.EMPTY_NODE.updateChild(this.indexPath_,i);return new O(t,r)}maxPost(){const e=D.EMPTY_NODE.updateChild(this.indexPath_,Qt);return new O(Ze,e)}toString(){return Mo(this.indexPath_,0).join("/")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class id extends Vn{compare(e,t){const i=e.node.compareTo(t.node);return i===0?Ct(e.name,t.name):i}isDefinedOn(e){return!0}indexedValueChanged(e,t){return!e.equals(t)}minPost(){return O.MIN}maxPost(){return O.MAX}makePost(e,t){const i=ie(e);return new O(t,i)}toString(){return".value"}}const sd=new id;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $o(n){return{type:"value",snapshotNode:n}}function At(n,e){return{type:"child_added",snapshotNode:e,childName:n}}function Jt(n,e){return{type:"child_removed",snapshotNode:e,childName:n}}function Zt(n,e,t){return{type:"child_changed",snapshotNode:e,childName:n,oldSnap:t}}function rd(n,e){return{type:"child_moved",snapshotNode:e,childName:n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qi{constructor(e){this.index_=e}updateChild(e,t,i,r,o,a){A(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const c=e.getImmediateChild(t);return c.getChild(r).equals(i.getChild(r))&&c.isEmpty()===i.isEmpty()||(a!=null&&(i.isEmpty()?e.hasChild(t)?a.trackChildChange(Jt(t,c)):A(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):c.isEmpty()?a.trackChildChange(At(t,i)):a.trackChildChange(Zt(t,i,c))),e.isLeafNode()&&i.isEmpty())?e:e.updateImmediateChild(t,i).withIndex(this.index_)}updateFullNode(e,t,i){return i!=null&&(e.isLeafNode()||e.forEachChild(z,(r,o)=>{t.hasChild(r)||i.trackChildChange(Jt(r,o))}),t.isLeafNode()||t.forEachChild(z,(r,o)=>{if(e.hasChild(r)){const a=e.getImmediateChild(r);a.equals(o)||i.trackChildChange(Zt(r,o,a))}else i.trackChildChange(At(r,o))})),t.withIndex(this.index_)}updatePriority(e,t){return e.isEmpty()?D.EMPTY_NODE:e.updatePriority(t)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class en{constructor(e){this.indexedFilter_=new Qi(e.getIndex()),this.index_=e.getIndex(),this.startPost_=en.getStartPost_(e),this.endPost_=en.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const t=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,i=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return t&&i}updateChild(e,t,i,r,o,a){return this.matches(new O(t,i))||(i=D.EMPTY_NODE),this.indexedFilter_.updateChild(e,t,i,r,o,a)}updateFullNode(e,t,i){t.isLeafNode()&&(t=D.EMPTY_NODE);let r=t.withIndex(this.index_);r=r.updatePriority(D.EMPTY_NODE);const o=this;return t.forEachChild(z,(a,c)=>{o.matches(new O(a,c))||(r=r.updateImmediateChild(a,D.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,r,i)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const t=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),t)}else return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const t=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),t)}else return e.getIndex().maxPost()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class od{constructor(e){this.withinDirectionalStart=t=>this.reverse_?this.withinEndPost(t):this.withinStartPost(t),this.withinDirectionalEnd=t=>this.reverse_?this.withinStartPost(t):this.withinEndPost(t),this.withinStartPost=t=>{const i=this.index_.compare(this.rangedFilter_.getStartPost(),t);return this.startIsInclusive_?i<=0:i<0},this.withinEndPost=t=>{const i=this.index_.compare(t,this.rangedFilter_.getEndPost());return this.endIsInclusive_?i<=0:i<0},this.rangedFilter_=new en(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,t,i,r,o,a){return this.rangedFilter_.matches(new O(t,i))||(i=D.EMPTY_NODE),e.getImmediateChild(t).equals(i)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,t,i,r,o,a):this.fullLimitUpdateChild_(e,t,i,o,a)}updateFullNode(e,t,i){let r;if(t.isLeafNode()||t.isEmpty())r=D.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<t.numChildren()&&t.isIndexed(this.index_)){r=D.EMPTY_NODE.withIndex(this.index_);let o;this.reverse_?o=t.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):o=t.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let a=0;for(;o.hasNext()&&a<this.limit_;){const c=o.getNext();if(this.withinDirectionalStart(c))if(this.withinDirectionalEnd(c))r=r.updateImmediateChild(c.name,c.node),a++;else break;else continue}}else{r=t.withIndex(this.index_),r=r.updatePriority(D.EMPTY_NODE);let o;this.reverse_?o=r.getReverseIterator(this.index_):o=r.getIterator(this.index_);let a=0;for(;o.hasNext();){const c=o.getNext();a<this.limit_&&this.withinDirectionalStart(c)&&this.withinDirectionalEnd(c)?a++:r=r.updateImmediateChild(c.name,D.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,r,i)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,t,i,r,o){let a;if(this.reverse_){const y=this.index_.getCompare();a=(S,N)=>y(N,S)}else a=this.index_.getCompare();const c=e;A(c.numChildren()===this.limit_,"");const d=new O(t,i),f=this.reverse_?c.getFirstChild(this.index_):c.getLastChild(this.index_),I=this.rangedFilter_.matches(d);if(c.hasChild(t)){const y=c.getImmediateChild(t);let S=r.getChildAfterChild(this.index_,f,this.reverse_);for(;S!=null&&(S.name===t||c.hasChild(S.name));)S=r.getChildAfterChild(this.index_,S,this.reverse_);const N=S==null?1:a(S,d);if(I&&!i.isEmpty()&&N>=0)return o!=null&&o.trackChildChange(Zt(t,i,y)),c.updateImmediateChild(t,i);{o!=null&&o.trackChildChange(Jt(t,y));const P=c.updateImmediateChild(t,D.EMPTY_NODE);return S!=null&&this.rangedFilter_.matches(S)?(o!=null&&o.trackChildChange(At(S.name,S.node)),P.updateImmediateChild(S.name,S.node)):P}}else return i.isEmpty()?e:I&&a(f,d)>=0?(o!=null&&(o.trackChildChange(Jt(f.name,f.node)),o.trackChildChange(At(t,i))),c.updateImmediateChild(t,i).updateImmediateChild(f.name,D.EMPTY_NODE)):e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ji{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=z}hasStart(){return this.startSet_}isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){return A(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return A(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:wt}hasEnd(){return this.endSet_}getIndexEndValue(){return A(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return A(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:Ze}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){return A(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===z}copy(){const e=new Ji;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function ld(n){return n.loadsAllData()?new Qi(n.getIndex()):n.hasLimit()?new od(n):new en(n)}function zo(n){const e={};if(n.isDefault())return e;let t;if(n.index_===z?t="$priority":n.index_===sd?t="$value":n.index_===Tt?t="$key":(A(n.index_ instanceof nd,"Unrecognized index type!"),t=n.index_.toString()),e.orderBy=J(t),n.startSet_){const i=n.startAfterSet_?"startAfter":"startAt";e[i]=J(n.indexStartValue_),n.startNameSet_&&(e[i]+=","+J(n.indexStartName_))}if(n.endSet_){const i=n.endBeforeSet_?"endBefore":"endAt";e[i]=J(n.indexEndValue_),n.endNameSet_&&(e[i]+=","+J(n.indexEndName_))}return n.limitSet_&&(n.isViewFromLeft()?e.limitToFirst=n.limit_:e.limitToLast=n.limit_),e}function Yo(n){const e={};if(n.startSet_&&(e.sp=n.indexStartValue_,n.startNameSet_&&(e.sn=n.indexStartName_),e.sin=!n.startAfterSet_),n.endSet_&&(e.ep=n.indexEndValue_,n.endNameSet_&&(e.en=n.indexEndName_),e.ein=!n.endBeforeSet_),n.limitSet_){e.l=n.limit_;let t=n.viewFrom_;t===""&&(n.isViewFromLeft()?t="l":t="r"),e.vf=t}return n.index_!==z&&(e.i=n.index_.toString()),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hn extends Do{reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,t){return t!==void 0?"tag$"+t:(A(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}constructor(e,t,i,r){super(),this.repoInfo_=e,this.onDataUpdate_=t,this.authTokenProvider_=i,this.appCheckTokenProvider_=r,this.log_=Gt("p:rest:"),this.listens_={}}listen(e,t,i,r){const o=e._path.toString();this.log_("Listen called for "+o+" "+e._queryIdentifier);const a=Hn.getListenId_(e,i),c={};this.listens_[a]=c;const d=zo(e._queryParams);this.restRequest_(o+".json",d,(f,I)=>{let y=I;if(f===404&&(y=null,f=null),f===null&&this.onDataUpdate_(o,y,!1,i),yt(this.listens_,a)===c){let S;f?f===401?S="permission_denied":S="rest_error:"+f:S="ok",r(S,null)}})}unlisten(e,t){const i=Hn.getListenId_(e,t);delete this.listens_[i]}get(e){const t=zo(e._queryParams),i=e._path.toString(),r=new Ti;return this.restRequest_(i+".json",t,(o,a)=>{let c=a;o===404&&(c=null,o=null),o===null?(this.onDataUpdate_(i,c,!1,null),r.resolve(c)):r.reject(new Error(c))}),r.promise}refreshAuthToken(e){}restRequest_(e,t={},i){return t.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([r,o])=>{r&&r.accessToken&&(t.auth=r.accessToken),o&&o.token&&(t.ac=o.token);const a=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+Uh(t);this.log_("Sending REST request for "+a);const c=new XMLHttpRequest;c.onreadystatechange=()=>{if(i&&c.readyState===4){this.log_("REST Response for "+a+" received. status:",c.status,"response:",c.responseText);let d=null;if(c.status>=200&&c.status<300){try{d=Ft(c.responseText)}catch{de("Failed to parse JSON response for "+a+": "+c.responseText)}i(null,d)}else c.status!==401&&c.status!==404&&de("Got unsuccessful REST response for "+a+" Status: "+c.status),i(c.status);i=null}},c.open("GET",a,!0),c.send()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ad{constructor(){this.rootNode_=D.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,t){this.rootNode_=this.rootNode_.updateChild(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gn(){return{value:null,children:new Map}}function Ko(n,e,t){if(M(e))n.value=t,n.children.clear();else if(n.value!==null)n.value=n.value.updateChild(e,t);else{const i=x(e);n.children.has(i)||n.children.set(i,Gn());const r=n.children.get(i);e=G(e),Ko(r,e,t)}}function Zi(n,e,t){n.value!==null?t(e,n.value):hd(n,(i,r)=>{const o=new W(e.toString()+"/"+i);Zi(r,o,t)})}function hd(n,e){n.children.forEach((t,i)=>{e(i,t)})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cd{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),t={...e};return this.last_&&ae(this.last_,(i,r)=>{t[i]=t[i]-r}),this.last_=e,t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xo=10*1e3,ud=30*1e3,dd=300*1e3;class fd{constructor(e,t){this.server_=t,this.statsToReport_={},this.statsListener_=new cd(e);const i=Xo+(ud-Xo)*Math.random();zt(this.reportStats_.bind(this),Math.floor(i))}reportStats_(){const e=this.statsListener_.get(),t={};let i=!1;ae(e,(r,o)=>{o>0&&Re(this.statsToReport_,r)&&(t[r]=o,i=!0)}),i&&this.server_.reportStats(t),zt(this.reportStats_.bind(this),Math.floor(Math.random()*2*dd))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ve;(function(n){n[n.OVERWRITE=0]="OVERWRITE",n[n.MERGE=1]="MERGE",n[n.ACK_USER_WRITE=2]="ACK_USER_WRITE",n[n.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(ve||(ve={}));function Qo(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function es(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function ts(n){return{fromUser:!1,fromServer:!0,queryId:n,tagged:!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qn{constructor(e,t,i){this.path=e,this.affectedTree=t,this.revert=i,this.type=ve.ACK_USER_WRITE,this.source=Qo()}operationForChild(e){if(M(this.path)){if(this.affectedTree.value!=null)return A(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const t=this.affectedTree.subtree(new W(e));return new qn(B(),t,this.revert)}}else return A(x(this.path)===e,"operationForChild called for unrelated child."),new qn(G(this.path),this.affectedTree,this.revert)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tn{constructor(e,t){this.source=e,this.path=t,this.type=ve.LISTEN_COMPLETE}operationForChild(e){return M(this.path)?new tn(this.source,B()):new tn(this.source,G(this.path))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt{constructor(e,t,i){this.source=e,this.path=t,this.snap=i,this.type=ve.OVERWRITE}operationForChild(e){return M(this.path)?new tt(this.source,B(),this.snap.getImmediateChild(e)):new tt(this.source,G(this.path),this.snap)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nn{constructor(e,t,i){this.source=e,this.path=t,this.children=i,this.type=ve.MERGE}operationForChild(e){if(M(this.path)){const t=this.children.subtree(new W(e));return t.isEmpty()?null:t.value?new tt(this.source,B(),t.value):new nn(this.source,B(),t)}else return A(x(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new nn(this.source,G(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nt{constructor(e,t,i){this.node_=e,this.fullyInitialized_=t,this.filtered_=i}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(M(e))return this.isFullyInitialized()&&!this.filtered_;const t=x(e);return this.isCompleteForChild(t)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pd{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function gd(n,e,t,i){const r=[],o=[];return e.forEach(a=>{a.type==="child_changed"&&n.index_.indexedValueChanged(a.oldSnap,a.snapshotNode)&&o.push(rd(a.childName,a.snapshotNode))}),sn(n,r,"child_removed",e,i,t),sn(n,r,"child_added",e,i,t),sn(n,r,"child_moved",o,i,t),sn(n,r,"child_changed",e,i,t),sn(n,r,"value",e,i,t),r}function sn(n,e,t,i,r,o){const a=i.filter(c=>c.type===t);a.sort((c,d)=>md(n,c,d)),a.forEach(c=>{const d=_d(n,c,o);r.forEach(f=>{f.respondsTo(c.type)&&e.push(f.createEvent(d,n.query_))})})}function _d(n,e,t){return e.type==="value"||e.type==="child_removed"||(e.prevName=t.getPredecessorChildName(e.childName,e.snapshotNode,n.index_)),e}function md(n,e,t){if(e.childName==null||t.childName==null)throw _t("Should only compare child_ events.");const i=new O(e.childName,e.snapshotNode),r=new O(t.childName,t.snapshotNode);return n.index_.compare(i,r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $n(n,e){return{eventCache:n,serverCache:e}}function rn(n,e,t,i){return $n(new nt(e,t,i),n.serverCache)}function Jo(n,e,t,i){return $n(n.eventCache,new nt(e,t,i))}function ns(n){return n.eventCache.isFullyInitialized()?n.eventCache.getNode():null}function it(n){return n.serverCache.isFullyInitialized()?n.serverCache.getNode():null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let is;const yd=()=>(is||(is=new ce(iu)),is);class q{static fromObject(e){let t=new q(null);return ae(e,(i,r)=>{t=t.set(new W(i),r)}),t}constructor(e,t=yd()){this.value=e,this.children=t}isEmpty(){return this.value===null&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,t){if(this.value!=null&&t(this.value))return{path:B(),value:this.value};if(M(e))return null;{const i=x(e),r=this.children.get(i);if(r!==null){const o=r.findRootMostMatchingPathAndValue(G(e),t);return o!=null?{path:X(new W(i),o.path),value:o.value}:null}else return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if(M(e))return this;{const t=x(e),i=this.children.get(t);return i!==null?i.subtree(G(e)):new q(null)}}set(e,t){if(M(e))return new q(t,this.children);{const i=x(e),o=(this.children.get(i)||new q(null)).set(G(e),t),a=this.children.insert(i,o);return new q(this.value,a)}}remove(e){if(M(e))return this.children.isEmpty()?new q(null):new q(null,this.children);{const t=x(e),i=this.children.get(t);if(i){const r=i.remove(G(e));let o;return r.isEmpty()?o=this.children.remove(t):o=this.children.insert(t,r),this.value===null&&o.isEmpty()?new q(null):new q(this.value,o)}else return this}}get(e){if(M(e))return this.value;{const t=x(e),i=this.children.get(t);return i?i.get(G(e)):null}}setTree(e,t){if(M(e))return t;{const i=x(e),o=(this.children.get(i)||new q(null)).setTree(G(e),t);let a;return o.isEmpty()?a=this.children.remove(i):a=this.children.insert(i,o),new q(this.value,a)}}fold(e){return this.fold_(B(),e)}fold_(e,t){const i={};return this.children.inorderTraversal((r,o)=>{i[r]=o.fold_(X(e,r),t)}),t(e,this.value,i)}findOnPath(e,t){return this.findOnPath_(e,B(),t)}findOnPath_(e,t,i){const r=this.value?i(t,this.value):!1;if(r)return r;if(M(e))return null;{const o=x(e),a=this.children.get(o);return a?a.findOnPath_(G(e),X(t,o),i):null}}foreachOnPath(e,t){return this.foreachOnPath_(e,B(),t)}foreachOnPath_(e,t,i){if(M(e))return this;{this.value&&i(t,this.value);const r=x(e),o=this.children.get(r);return o?o.foreachOnPath_(G(e),X(t,r),i):new q(null)}}foreach(e){this.foreach_(B(),e)}foreach_(e,t){this.children.inorderTraversal((i,r)=>{r.foreach_(X(e,i),t)}),this.value&&t(e,this.value)}foreachChild(e){this.children.inorderTraversal((t,i)=>{i.value&&e(t,i.value)})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ee{constructor(e){this.writeTree_=e}static empty(){return new Ee(new q(null))}}function on(n,e,t){if(M(e))return new Ee(new q(t));{const i=n.writeTree_.findRootMostValueAndPath(e);if(i!=null){const r=i.path;let o=i.value;const a=he(r,e);return o=o.updateChild(a,t),new Ee(n.writeTree_.set(r,o))}else{const r=new q(t),o=n.writeTree_.setTree(e,r);return new Ee(o)}}}function Zo(n,e,t){let i=n;return ae(t,(r,o)=>{i=on(i,X(e,r),o)}),i}function el(n,e){if(M(e))return Ee.empty();{const t=n.writeTree_.setTree(e,new q(null));return new Ee(t)}}function ss(n,e){return st(n,e)!=null}function st(n,e){const t=n.writeTree_.findRootMostValueAndPath(e);return t!=null?n.writeTree_.get(t.path).getChild(he(t.path,e)):null}function tl(n){const e=[],t=n.writeTree_.value;return t!=null?t.isLeafNode()||t.forEachChild(z,(i,r)=>{e.push(new O(i,r))}):n.writeTree_.children.inorderTraversal((i,r)=>{r.value!=null&&e.push(new O(i,r.value))}),e}function Ve(n,e){if(M(e))return n;{const t=st(n,e);return t!=null?new Ee(new q(t)):new Ee(n.writeTree_.subtree(e))}}function rs(n){return n.writeTree_.isEmpty()}function bt(n,e){return nl(B(),n.writeTree_,e)}function nl(n,e,t){if(e.value!=null)return t.updateChild(n,e.value);{let i=null;return e.children.inorderTraversal((r,o)=>{r===".priority"?(A(o.value!==null,"Priority writes must always be leaf nodes"),i=o.value):t=nl(X(n,r),o,t)}),!t.getChild(n).isEmpty()&&i!==null&&(t=t.updateChild(X(n,".priority"),i)),t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function os(n,e){return ll(e,n)}function vd(n,e,t,i,r){A(i>n.lastWriteId,"Stacking an older write on top of newer ones"),r===void 0&&(r=!0),n.allWrites.push({path:e,snap:t,writeId:i,visible:r}),r&&(n.visibleWrites=on(n.visibleWrites,e,t)),n.lastWriteId=i}function Ed(n,e){for(let t=0;t<n.allWrites.length;t++){const i=n.allWrites[t];if(i.writeId===e)return i}return null}function wd(n,e){const t=n.allWrites.findIndex(c=>c.writeId===e);A(t>=0,"removeWrite called with nonexistent writeId.");const i=n.allWrites[t];n.allWrites.splice(t,1);let r=i.visible,o=!1,a=n.allWrites.length-1;for(;r&&a>=0;){const c=n.allWrites[a];c.visible&&(a>=t&&Cd(c,i.path)?r=!1:ye(i.path,c.path)&&(o=!0)),a--}if(r){if(o)return Id(n),!0;if(i.snap)n.visibleWrites=el(n.visibleWrites,i.path);else{const c=i.children;ae(c,d=>{n.visibleWrites=el(n.visibleWrites,X(i.path,d))})}return!0}else return!1}function Cd(n,e){if(n.snap)return ye(n.path,e);for(const t in n.children)if(n.children.hasOwnProperty(t)&&ye(X(n.path,t),e))return!0;return!1}function Id(n){n.visibleWrites=il(n.allWrites,Td,B()),n.allWrites.length>0?n.lastWriteId=n.allWrites[n.allWrites.length-1].writeId:n.lastWriteId=-1}function Td(n){return n.visible}function il(n,e,t){let i=Ee.empty();for(let r=0;r<n.length;++r){const o=n[r];if(e(o)){const a=o.path;let c;if(o.snap)ye(t,a)?(c=he(t,a),i=on(i,c,o.snap)):ye(a,t)&&(c=he(a,t),i=on(i,B(),o.snap.getChild(c)));else if(o.children){if(ye(t,a))c=he(t,a),i=Zo(i,c,o.children);else if(ye(a,t))if(c=he(a,t),M(c))i=Zo(i,B(),o.children);else{const d=yt(o.children,x(c));if(d){const f=d.getChild(G(c));i=on(i,B(),f)}}}else throw _t("WriteRecord should have .snap or .children")}}return i}function sl(n,e,t,i,r){if(!i&&!r){const o=st(n.visibleWrites,e);if(o!=null)return o;{const a=Ve(n.visibleWrites,e);if(rs(a))return t;if(t==null&&!ss(a,B()))return null;{const c=t||D.EMPTY_NODE;return bt(a,c)}}}else{const o=Ve(n.visibleWrites,e);if(!r&&rs(o))return t;if(!r&&t==null&&!ss(o,B()))return null;{const a=function(f){return(f.visible||r)&&(!i||!~i.indexOf(f.writeId))&&(ye(f.path,e)||ye(e,f.path))},c=il(n.allWrites,a,e),d=t||D.EMPTY_NODE;return bt(c,d)}}}function Sd(n,e,t){let i=D.EMPTY_NODE;const r=st(n.visibleWrites,e);if(r)return r.isLeafNode()||r.forEachChild(z,(o,a)=>{i=i.updateImmediateChild(o,a)}),i;if(t){const o=Ve(n.visibleWrites,e);return t.forEachChild(z,(a,c)=>{const d=bt(Ve(o,new W(a)),c);i=i.updateImmediateChild(a,d)}),tl(o).forEach(a=>{i=i.updateImmediateChild(a.name,a.node)}),i}else{const o=Ve(n.visibleWrites,e);return tl(o).forEach(a=>{i=i.updateImmediateChild(a.name,a.node)}),i}}function Ad(n,e,t,i,r){A(i||r,"Either existingEventSnap or existingServerSnap must exist");const o=X(e,t);if(ss(n.visibleWrites,o))return null;{const a=Ve(n.visibleWrites,o);return rs(a)?r.getChild(t):bt(a,r.getChild(t))}}function bd(n,e,t,i){const r=X(e,t),o=st(n.visibleWrites,r);if(o!=null)return o;if(i.isCompleteForChild(t)){const a=Ve(n.visibleWrites,r);return bt(a,i.getNode().getImmediateChild(t))}else return null}function Nd(n,e){return st(n.visibleWrites,e)}function Rd(n,e,t,i,r,o,a){let c;const d=Ve(n.visibleWrites,e),f=st(d,B());if(f!=null)c=f;else if(t!=null)c=bt(d,t);else return[];if(c=c.withIndex(a),!c.isEmpty()&&!c.isLeafNode()){const I=[],y=a.getCompare(),S=o?c.getReverseIteratorFrom(i,a):c.getIteratorFrom(i,a);let N=S.getNext();for(;N&&I.length<r;)y(N,i)!==0&&I.push(N),N=S.getNext();return I}else return[]}function Dd(){return{visibleWrites:Ee.empty(),allWrites:[],lastWriteId:-1}}function zn(n,e,t,i){return sl(n.writeTree,n.treePath,e,t,i)}function ls(n,e){return Sd(n.writeTree,n.treePath,e)}function rl(n,e,t,i){return Ad(n.writeTree,n.treePath,e,t,i)}function Yn(n,e){return Nd(n.writeTree,X(n.treePath,e))}function Pd(n,e,t,i,r,o){return Rd(n.writeTree,n.treePath,e,t,i,r,o)}function as(n,e,t){return bd(n.writeTree,n.treePath,e,t)}function ol(n,e){return ll(X(n.treePath,e),n.writeTree)}function ll(n,e){return{treePath:n,writeTree:e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kd{constructor(){this.changeMap=new Map}trackChildChange(e){const t=e.type,i=e.childName;A(t==="child_added"||t==="child_changed"||t==="child_removed","Only child changes supported for tracking"),A(i!==".priority","Only non-priority child changes can be tracked.");const r=this.changeMap.get(i);if(r){const o=r.type;if(t==="child_added"&&o==="child_removed")this.changeMap.set(i,Zt(i,e.snapshotNode,r.snapshotNode));else if(t==="child_removed"&&o==="child_added")this.changeMap.delete(i);else if(t==="child_removed"&&o==="child_changed")this.changeMap.set(i,Jt(i,r.oldSnap));else if(t==="child_changed"&&o==="child_added")this.changeMap.set(i,At(i,e.snapshotNode));else if(t==="child_changed"&&o==="child_changed")this.changeMap.set(i,Zt(i,e.snapshotNode,r.oldSnap));else throw _t("Illegal combination of changes: "+e+" occurred after "+r)}else this.changeMap.set(i,e)}getChanges(){return Array.from(this.changeMap.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Od{getCompleteChild(e){return null}getChildAfterChild(e,t,i){return null}}const al=new Od;class hs{constructor(e,t,i=null){this.writes_=e,this.viewCache_=t,this.optCompleteServerCache_=i}getCompleteChild(e){const t=this.viewCache_.eventCache;if(t.isCompleteForChild(e))return t.getNode().getImmediateChild(e);{const i=this.optCompleteServerCache_!=null?new nt(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return as(this.writes_,e,i)}}getChildAfterChild(e,t,i){const r=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:it(this.viewCache_),o=Pd(this.writes_,r,t,1,i,e);return o.length===0?null:o[0]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xd(n){return{filter:n}}function Md(n,e){A(e.eventCache.getNode().isIndexed(n.filter.getIndex()),"Event snap not indexed"),A(e.serverCache.getNode().isIndexed(n.filter.getIndex()),"Server snap not indexed")}function Ld(n,e,t,i,r){const o=new kd;let a,c;if(t.type===ve.OVERWRITE){const f=t;f.source.fromUser?a=cs(n,e,f.path,f.snap,i,r,o):(A(f.source.fromServer,"Unknown source."),c=f.source.tagged||e.serverCache.isFiltered()&&!M(f.path),a=Kn(n,e,f.path,f.snap,i,r,c,o))}else if(t.type===ve.MERGE){const f=t;f.source.fromUser?a=Ud(n,e,f.path,f.children,i,r,o):(A(f.source.fromServer,"Unknown source."),c=f.source.tagged||e.serverCache.isFiltered(),a=us(n,e,f.path,f.children,i,r,c,o))}else if(t.type===ve.ACK_USER_WRITE){const f=t;f.revert?a=jd(n,e,f.path,i,r,o):a=Vd(n,e,f.path,f.affectedTree,i,r,o)}else if(t.type===ve.LISTEN_COMPLETE)a=Bd(n,e,t.path,i,o);else throw _t("Unknown operation type: "+t.type);const d=o.getChanges();return Fd(e,a,d),{viewCache:a,changes:d}}function Fd(n,e,t){const i=e.eventCache;if(i.isFullyInitialized()){const r=i.getNode().isLeafNode()||i.getNode().isEmpty(),o=ns(n);(t.length>0||!n.eventCache.isFullyInitialized()||r&&!i.getNode().equals(o)||!i.getNode().getPriority().equals(o.getPriority()))&&t.push($o(ns(e)))}}function hl(n,e,t,i,r,o){const a=e.eventCache;if(Yn(i,t)!=null)return e;{let c,d;if(M(t))if(A(e.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),e.serverCache.isFiltered()){const f=it(e),I=f instanceof D?f:D.EMPTY_NODE,y=ls(i,I);c=n.filter.updateFullNode(e.eventCache.getNode(),y,o)}else{const f=zn(i,it(e));c=n.filter.updateFullNode(e.eventCache.getNode(),f,o)}else{const f=x(t);if(f===".priority"){A(Ue(t)===1,"Can't have a priority with additional path components");const I=a.getNode();d=e.serverCache.getNode();const y=rl(i,t,I,d);y!=null?c=n.filter.updatePriority(I,y):c=a.getNode()}else{const I=G(t);let y;if(a.isCompleteForChild(f)){d=e.serverCache.getNode();const S=rl(i,t,a.getNode(),d);S!=null?y=a.getNode().getImmediateChild(f).updateChild(I,S):y=a.getNode().getImmediateChild(f)}else y=as(i,f,e.serverCache);y!=null?c=n.filter.updateChild(a.getNode(),f,y,I,r,o):c=a.getNode()}}return rn(e,c,a.isFullyInitialized()||M(t),n.filter.filtersNodes())}}function Kn(n,e,t,i,r,o,a,c){const d=e.serverCache;let f;const I=a?n.filter:n.filter.getIndexedFilter();if(M(t))f=I.updateFullNode(d.getNode(),i,null);else if(I.filtersNodes()&&!d.isFiltered()){const N=d.getNode().updateChild(t,i);f=I.updateFullNode(d.getNode(),N,null)}else{const N=x(t);if(!d.isCompleteForPath(t)&&Ue(t)>1)return e;const R=G(t),L=d.getNode().getImmediateChild(N).updateChild(R,i);N===".priority"?f=I.updatePriority(d.getNode(),L):f=I.updateChild(d.getNode(),N,L,R,al,null)}const y=Jo(e,f,d.isFullyInitialized()||M(t),I.filtersNodes()),S=new hs(r,y,o);return hl(n,y,t,r,S,c)}function cs(n,e,t,i,r,o,a){const c=e.eventCache;let d,f;const I=new hs(r,e,o);if(M(t))f=n.filter.updateFullNode(e.eventCache.getNode(),i,a),d=rn(e,f,!0,n.filter.filtersNodes());else{const y=x(t);if(y===".priority")f=n.filter.updatePriority(e.eventCache.getNode(),i),d=rn(e,f,c.isFullyInitialized(),c.isFiltered());else{const S=G(t),N=c.getNode().getImmediateChild(y);let R;if(M(S))R=i;else{const P=I.getCompleteChild(y);P!=null?xo(S)===".priority"&&P.getChild(Lo(S)).isEmpty()?R=P:R=P.updateChild(S,i):R=D.EMPTY_NODE}if(N.equals(R))d=e;else{const P=n.filter.updateChild(c.getNode(),y,R,S,I,a);d=rn(e,P,c.isFullyInitialized(),n.filter.filtersNodes())}}}return d}function cl(n,e){return n.eventCache.isCompleteForChild(e)}function Ud(n,e,t,i,r,o,a){let c=e;return i.foreach((d,f)=>{const I=X(t,d);cl(e,x(I))&&(c=cs(n,c,I,f,r,o,a))}),i.foreach((d,f)=>{const I=X(t,d);cl(e,x(I))||(c=cs(n,c,I,f,r,o,a))}),c}function ul(n,e,t){return t.foreach((i,r)=>{e=e.updateChild(i,r)}),e}function us(n,e,t,i,r,o,a,c){if(e.serverCache.getNode().isEmpty()&&!e.serverCache.isFullyInitialized())return e;let d=e,f;M(t)?f=i:f=new q(null).setTree(t,i);const I=e.serverCache.getNode();return f.children.inorderTraversal((y,S)=>{if(I.hasChild(y)){const N=e.serverCache.getNode().getImmediateChild(y),R=ul(n,N,S);d=Kn(n,d,new W(y),R,r,o,a,c)}}),f.children.inorderTraversal((y,S)=>{const N=!e.serverCache.isCompleteForChild(y)&&S.value===null;if(!I.hasChild(y)&&!N){const R=e.serverCache.getNode().getImmediateChild(y),P=ul(n,R,S);d=Kn(n,d,new W(y),P,r,o,a,c)}}),d}function Vd(n,e,t,i,r,o,a){if(Yn(r,t)!=null)return e;const c=e.serverCache.isFiltered(),d=e.serverCache;if(i.value!=null){if(M(t)&&d.isFullyInitialized()||d.isCompleteForPath(t))return Kn(n,e,t,d.getNode().getChild(t),r,o,c,a);if(M(t)){let f=new q(null);return d.getNode().forEachChild(Tt,(I,y)=>{f=f.set(new W(I),y)}),us(n,e,t,f,r,o,c,a)}else return e}else{let f=new q(null);return i.foreach((I,y)=>{const S=X(t,I);d.isCompleteForPath(S)&&(f=f.set(I,d.getNode().getChild(S)))}),us(n,e,t,f,r,o,c,a)}}function Bd(n,e,t,i,r){const o=e.serverCache,a=Jo(e,o.getNode(),o.isFullyInitialized()||M(t),o.isFiltered());return hl(n,a,t,i,al,r)}function jd(n,e,t,i,r,o){let a;if(Yn(i,t)!=null)return e;{const c=new hs(i,e,r),d=e.eventCache.getNode();let f;if(M(t)||x(t)===".priority"){let I;if(e.serverCache.isFullyInitialized())I=zn(i,it(e));else{const y=e.serverCache.getNode();A(y instanceof D,"serverChildren would be complete if leaf node"),I=ls(i,y)}I=I,f=n.filter.updateFullNode(d,I,o)}else{const I=x(t);let y=as(i,I,e.serverCache);y==null&&e.serverCache.isCompleteForChild(I)&&(y=d.getImmediateChild(I)),y!=null?f=n.filter.updateChild(d,I,y,G(t),c,o):e.eventCache.getNode().hasChild(I)?f=n.filter.updateChild(d,I,D.EMPTY_NODE,G(t),c,o):f=d,f.isEmpty()&&e.serverCache.isFullyInitialized()&&(a=zn(i,it(e)),a.isLeafNode()&&(f=n.filter.updateFullNode(f,a,o)))}return a=e.serverCache.isFullyInitialized()||Yn(i,B())!=null,rn(e,f,a,n.filter.filtersNodes())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wd{constructor(e,t){this.query_=e,this.eventRegistrations_=[];const i=this.query_._queryParams,r=new Qi(i.getIndex()),o=ld(i);this.processor_=xd(o);const a=t.serverCache,c=t.eventCache,d=r.updateFullNode(D.EMPTY_NODE,a.getNode(),null),f=o.updateFullNode(D.EMPTY_NODE,c.getNode(),null),I=new nt(d,a.isFullyInitialized(),r.filtersNodes()),y=new nt(f,c.isFullyInitialized(),o.filtersNodes());this.viewCache_=$n(y,I),this.eventGenerator_=new pd(this.query_)}get query(){return this.query_}}function Hd(n){return n.viewCache_.serverCache.getNode()}function Gd(n,e){const t=it(n.viewCache_);return t&&(n.query._queryParams.loadsAllData()||!M(e)&&!t.getImmediateChild(x(e)).isEmpty())?t.getChild(e):null}function dl(n){return n.eventRegistrations_.length===0}function qd(n,e){n.eventRegistrations_.push(e)}function fl(n,e,t){const i=[];if(t){A(e==null,"A cancel should cancel all event registrations.");const r=n.query._path;n.eventRegistrations_.forEach(o=>{const a=o.createCancelEvent(t,r);a&&i.push(a)})}if(e){let r=[];for(let o=0;o<n.eventRegistrations_.length;++o){const a=n.eventRegistrations_[o];if(!a.matches(e))r.push(a);else if(e.hasAnyCallback()){r=r.concat(n.eventRegistrations_.slice(o+1));break}}n.eventRegistrations_=r}else n.eventRegistrations_=[];return i}function pl(n,e,t,i){e.type===ve.MERGE&&e.source.queryId!==null&&(A(it(n.viewCache_),"We should always have a full cache before handling merges"),A(ns(n.viewCache_),"Missing event cache, even though we have a server cache"));const r=n.viewCache_,o=Ld(n.processor_,r,e,t,i);return Md(n.processor_,o.viewCache),A(o.viewCache.serverCache.isFullyInitialized()||!r.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),n.viewCache_=o.viewCache,gl(n,o.changes,o.viewCache.eventCache.getNode(),null)}function $d(n,e){const t=n.viewCache_.eventCache,i=[];return t.getNode().isLeafNode()||t.getNode().forEachChild(z,(o,a)=>{i.push(At(o,a))}),t.isFullyInitialized()&&i.push($o(t.getNode())),gl(n,i,t.getNode(),e)}function gl(n,e,t,i){const r=i?[i]:n.eventRegistrations_;return gd(n.eventGenerator_,e,t,r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Xn;class zd{constructor(){this.views=new Map}}function Yd(n){A(!Xn,"__referenceConstructor has already been defined"),Xn=n}function Kd(){return A(Xn,"Reference.ts has not been loaded"),Xn}function Xd(n){return n.views.size===0}function ds(n,e,t,i){const r=e.source.queryId;if(r!==null){const o=n.views.get(r);return A(o!=null,"SyncTree gave us an op for an invalid query."),pl(o,e,t,i)}else{let o=[];for(const a of n.views.values())o=o.concat(pl(a,e,t,i));return o}}function Qd(n,e,t,i,r){const o=e._queryIdentifier,a=n.views.get(o);if(!a){let c=zn(t,r?i:null),d=!1;c?d=!0:i instanceof D?(c=ls(t,i),d=!1):(c=D.EMPTY_NODE,d=!1);const f=$n(new nt(c,d,!1),new nt(i,r,!1));return new Wd(e,f)}return a}function Jd(n,e,t,i,r,o){const a=Qd(n,e,i,r,o);return n.views.has(e._queryIdentifier)||n.views.set(e._queryIdentifier,a),qd(a,t),$d(a,t)}function Zd(n,e,t,i){const r=e._queryIdentifier,o=[];let a=[];const c=Be(n);if(r==="default")for(const[d,f]of n.views.entries())a=a.concat(fl(f,t,i)),dl(f)&&(n.views.delete(d),f.query._queryParams.loadsAllData()||o.push(f.query));else{const d=n.views.get(r);d&&(a=a.concat(fl(d,t,i)),dl(d)&&(n.views.delete(r),d.query._queryParams.loadsAllData()||o.push(d.query)))}return c&&!Be(n)&&o.push(new(Kd())(e._repo,e._path)),{removed:o,events:a}}function _l(n){const e=[];for(const t of n.views.values())t.query._queryParams.loadsAllData()||e.push(t);return e}function Nt(n,e){let t=null;for(const i of n.views.values())t=t||Gd(i,e);return t}function ml(n,e){if(e._queryParams.loadsAllData())return Qn(n);{const i=e._queryIdentifier;return n.views.get(i)}}function yl(n,e){return ml(n,e)!=null}function Be(n){return Qn(n)!=null}function Qn(n){for(const e of n.views.values())if(e.query._queryParams.loadsAllData())return e;return null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Jn;function ef(n){A(!Jn,"__referenceConstructor has already been defined"),Jn=n}function tf(){return A(Jn,"Reference.ts has not been loaded"),Jn}let nf=1;class vl{constructor(e){this.listenProvider_=e,this.syncPointTree_=new q(null),this.pendingWriteTree_=Dd(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function sf(n,e,t,i,r){return vd(n.pendingWriteTree_,e,t,i,r),r?ln(n,new tt(Qo(),e,t)):[]}function Rt(n,e,t=!1){const i=Ed(n.pendingWriteTree_,e);if(wd(n.pendingWriteTree_,e)){let o=new q(null);return i.snap!=null?o=o.set(B(),!0):ae(i.children,a=>{o=o.set(new W(a),!0)}),ln(n,new qn(i.path,o,t))}else return[]}function Zn(n,e,t){return ln(n,new tt(es(),e,t))}function rf(n,e,t){const i=q.fromObject(t);return ln(n,new nn(es(),e,i))}function of(n,e){return ln(n,new tn(es(),e))}function lf(n,e,t){const i=ps(n,t);if(i){const r=gs(i),o=r.path,a=r.queryId,c=he(o,e),d=new tn(ts(a),c);return _s(n,o,d)}else return[]}function fs(n,e,t,i,r=!1){const o=e._path,a=n.syncPointTree_.get(o);let c=[];if(a&&(e._queryIdentifier==="default"||yl(a,e))){const d=Zd(a,e,t,i);Xd(a)&&(n.syncPointTree_=n.syncPointTree_.remove(o));const f=d.removed;if(c=d.events,!r){const I=f.findIndex(S=>S._queryParams.loadsAllData())!==-1,y=n.syncPointTree_.findOnPath(o,(S,N)=>Be(N));if(I&&!y){const S=n.syncPointTree_.subtree(o);if(!S.isEmpty()){const N=cf(S);for(let R=0;R<N.length;++R){const P=N[R],L=P.query,fe=Tl(n,P);n.listenProvider_.startListening(an(L),ei(n,L),fe.hashFn,fe.onComplete)}}}!y&&f.length>0&&!i&&(I?n.listenProvider_.stopListening(an(e),null):f.forEach(S=>{const N=n.queryToTagMap.get(ti(S));n.listenProvider_.stopListening(an(S),N)}))}uf(n,f)}return c}function af(n,e,t,i){const r=ps(n,i);if(r!=null){const o=gs(r),a=o.path,c=o.queryId,d=he(a,e),f=new tt(ts(c),d,t);return _s(n,a,f)}else return[]}function hf(n,e,t,i){const r=ps(n,i);if(r){const o=gs(r),a=o.path,c=o.queryId,d=he(a,e),f=q.fromObject(t),I=new nn(ts(c),d,f);return _s(n,a,I)}else return[]}function El(n,e,t,i=!1){const r=e._path;let o=null,a=!1;n.syncPointTree_.foreachOnPath(r,(S,N)=>{const R=he(S,r);o=o||Nt(N,R),a=a||Be(N)});let c=n.syncPointTree_.get(r);c?(a=a||Be(c),o=o||Nt(c,B())):(c=new zd,n.syncPointTree_=n.syncPointTree_.set(r,c));let d;o!=null?d=!0:(d=!1,o=D.EMPTY_NODE,n.syncPointTree_.subtree(r).foreachChild((N,R)=>{const P=Nt(R,B());P&&(o=o.updateImmediateChild(N,P))}));const f=yl(c,e);if(!f&&!e._queryParams.loadsAllData()){const S=ti(e);A(!n.queryToTagMap.has(S),"View does not exist, but we have a tag");const N=df();n.queryToTagMap.set(S,N),n.tagToQueryMap.set(N,S)}const I=os(n.pendingWriteTree_,r);let y=Jd(c,e,t,I,o,d);if(!f&&!a&&!i){const S=ml(c,e);y=y.concat(ff(n,e,S))}return y}function wl(n,e,t){const r=n.pendingWriteTree_,o=n.syncPointTree_.findOnPath(e,(a,c)=>{const d=he(a,e),f=Nt(c,d);if(f)return f});return sl(r,e,o,t,!0)}function ln(n,e){return Cl(e,n.syncPointTree_,null,os(n.pendingWriteTree_,B()))}function Cl(n,e,t,i){if(M(n.path))return Il(n,e,t,i);{const r=e.get(B());t==null&&r!=null&&(t=Nt(r,B()));let o=[];const a=x(n.path),c=n.operationForChild(a),d=e.children.get(a);if(d&&c){const f=t?t.getImmediateChild(a):null,I=ol(i,a);o=o.concat(Cl(c,d,f,I))}return r&&(o=o.concat(ds(r,n,i,t))),o}}function Il(n,e,t,i){const r=e.get(B());t==null&&r!=null&&(t=Nt(r,B()));let o=[];return e.children.inorderTraversal((a,c)=>{const d=t?t.getImmediateChild(a):null,f=ol(i,a),I=n.operationForChild(a);I&&(o=o.concat(Il(I,c,d,f)))}),r&&(o=o.concat(ds(r,n,i,t))),o}function Tl(n,e){const t=e.query,i=ei(n,t);return{hashFn:()=>(Hd(e)||D.EMPTY_NODE).hash(),onComplete:r=>{if(r==="ok")return i?lf(n,t._path,i):of(n,t._path);{const o=ou(r,t);return fs(n,t,null,o)}}}}function ei(n,e){const t=ti(e);return n.queryToTagMap.get(t)}function ti(n){return n._path.toString()+"$"+n._queryIdentifier}function ps(n,e){return n.tagToQueryMap.get(e)}function gs(n){const e=n.indexOf("$");return A(e!==-1&&e<n.length-1,"Bad queryKey."),{queryId:n.substr(e+1),path:new W(n.substr(0,e))}}function _s(n,e,t){const i=n.syncPointTree_.get(e);A(i,"Missing sync point for query tag that we're tracking");const r=os(n.pendingWriteTree_,e);return ds(i,t,r,null)}function cf(n){return n.fold((e,t,i)=>{if(t&&Be(t))return[Qn(t)];{let r=[];return t&&(r=_l(t)),ae(i,(o,a)=>{r=r.concat(a)}),r}})}function an(n){return n._queryParams.loadsAllData()&&!n._queryParams.isDefault()?new(tf())(n._repo,n._path):n}function uf(n,e){for(let t=0;t<e.length;++t){const i=e[t];if(!i._queryParams.loadsAllData()){const r=ti(i),o=n.queryToTagMap.get(r);n.queryToTagMap.delete(r),n.tagToQueryMap.delete(o)}}}function df(){return nf++}function ff(n,e,t){const i=e._path,r=ei(n,e),o=Tl(n,t),a=n.listenProvider_.startListening(an(e),r,o.hashFn,o.onComplete),c=n.syncPointTree_.subtree(i);if(r)A(!Be(c.value),"If we're adding a query, it shouldn't be shadowed");else{const d=c.fold((f,I,y)=>{if(!M(f)&&I&&Be(I))return[Qn(I).query];{let S=[];return I&&(S=S.concat(_l(I).map(N=>N.query))),ae(y,(N,R)=>{S=S.concat(R)}),S}});for(let f=0;f<d.length;++f){const I=d[f];n.listenProvider_.stopListening(an(I),ei(n,I))}}return a}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ms{constructor(e){this.node_=e}getImmediateChild(e){const t=this.node_.getImmediateChild(e);return new ms(t)}node(){return this.node_}}class ys{constructor(e,t){this.syncTree_=e,this.path_=t}getImmediateChild(e){const t=X(this.path_,e);return new ys(this.syncTree_,t)}node(){return wl(this.syncTree_,this.path_)}}const pf=function(n){return n=n||{},n.timestamp=n.timestamp||new Date().getTime(),n},Sl=function(n,e,t){if(!n||typeof n!="object")return n;if(A(".sv"in n,"Unexpected leaf node or priority contents"),typeof n[".sv"]=="string")return gf(n[".sv"],e,t);if(typeof n[".sv"]=="object")return _f(n[".sv"],e);A(!1,"Unexpected server value: "+JSON.stringify(n,null,2))},gf=function(n,e,t){switch(n){case"timestamp":return t.timestamp;default:A(!1,"Unexpected server value: "+n)}},_f=function(n,e,t){n.hasOwnProperty("increment")||A(!1,"Unexpected server value: "+JSON.stringify(n,null,2));const i=n.increment;typeof i!="number"&&A(!1,"Unexpected increment value: "+i);const r=e.node();if(A(r!==null&&typeof r<"u","Expected ChildrenNode.EMPTY_NODE for nulls"),!r.isLeafNode())return i;const a=r.getValue();return typeof a!="number"?i:a+i},mf=function(n,e,t,i){return vs(e,new ys(t,n),i)},yf=function(n,e,t){return vs(n,new ms(e),t)};function vs(n,e,t){const i=n.getPriority().val(),r=Sl(i,e.getImmediateChild(".priority"),t);let o;if(n.isLeafNode()){const a=n,c=Sl(a.getValue(),e,t);return c!==a.getValue()||r!==a.getPriority().val()?new ee(c,ie(r)):n}else{const a=n;return o=a,r!==a.getPriority().val()&&(o=o.updatePriority(new ee(r))),a.forEachChild(z,(c,d)=>{const f=vs(d,e.getImmediateChild(c),t);f!==d&&(o=o.updateImmediateChild(c,f))}),o}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Es{constructor(e="",t=null,i={children:{},childCount:0}){this.name=e,this.parent=t,this.node=i}}function ws(n,e){let t=e instanceof W?e:new W(e),i=n,r=x(t);for(;r!==null;){const o=yt(i.node.children,r)||{children:{},childCount:0};i=new Es(r,i,o),t=G(t),r=x(t)}return i}function Dt(n){return n.node.value}function Al(n,e){n.node.value=e,Cs(n)}function bl(n){return n.node.childCount>0}function vf(n){return Dt(n)===void 0&&!bl(n)}function ni(n,e){ae(n.node.children,(t,i)=>{e(new Es(t,n,i))})}function Nl(n,e,t,i){t&&e(n),ni(n,r=>{Nl(r,e,!0)})}function Ef(n,e,t){let i=n.parent;for(;i!==null;){if(e(i))return!0;i=i.parent}return!1}function hn(n){return new W(n.parent===null?n.name:hn(n.parent)+"/"+n.name)}function Cs(n){n.parent!==null&&wf(n.parent,n.name,n)}function wf(n,e,t){const i=vf(t),r=Re(n.node.children,e);i&&r?(delete n.node.children[e],n.node.childCount--,Cs(n)):!i&&!r&&(n.node.children[e]=t.node,n.node.childCount++,Cs(n))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cf=/[\[\].#$\/\u0000-\u001F\u007F]/,If=/[\[\].#$\u0000-\u001F\u007F]/,Is=10*1024*1024,Rl=function(n){return typeof n=="string"&&n.length!==0&&!Cf.test(n)},Dl=function(n){return typeof n=="string"&&n.length!==0&&!If.test(n)},Tf=function(n){return n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),Dl(n)},Pl=function(n,e,t){const i=t instanceof W?new Vu(t,n):t;if(e===void 0)throw new Error(n+"contains undefined "+et(i));if(typeof e=="function")throw new Error(n+"contains a function "+et(i)+" with contents = "+e.toString());if(no(e))throw new Error(n+"contains "+e.toString()+" "+et(i));if(typeof e=="string"&&e.length>Is/3&&xn(e)>Is)throw new Error(n+"contains a string greater than "+Is+" utf8 bytes "+et(i)+" ('"+e.substring(0,50)+"...')");if(e&&typeof e=="object"){let r=!1,o=!1;if(ae(e,(a,c)=>{if(a===".value")r=!0;else if(a!==".priority"&&a!==".sv"&&(o=!0,!Rl(a)))throw new Error(n+" contains an invalid key ("+a+") "+et(i)+`.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);Bu(i,a),Pl(n,c,i),ju(i)}),r&&o)throw new Error(n+' contains ".value" child '+et(i)+" in addition to actual children.")}},kl=function(n,e,t,i){if(!Dl(t))throw new Error(Dr(n,e)+'was an invalid path = "'+t+`". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`)},Sf=function(n,e,t,i){t&&(t=t.replace(/^\/*\.info(\/|$)/,"/")),kl(n,e,t)},Af=function(n,e){const t=e.path.toString();if(typeof e.repoInfo.host!="string"||e.repoInfo.host.length===0||!Rl(e.repoInfo.namespace)&&e.repoInfo.host.split(":")[0]!=="localhost"||t.length!==0&&!Tf(t))throw new Error(Dr(n,"url")+`must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bf{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function Ol(n,e){let t=null;for(let i=0;i<e.length;i++){const r=e[i],o=r.getPath();t!==null&&!$i(o,t.path)&&(n.eventLists_.push(t),t=null),t===null&&(t={events:[],path:o}),t.events.push(r)}t&&n.eventLists_.push(t)}function xl(n,e,t){Ol(n,t),Ml(n,i=>$i(i,e))}function rt(n,e,t){Ol(n,t),Ml(n,i=>ye(i,e)||ye(e,i))}function Ml(n,e){n.recursionDepth_++;let t=!0;for(let i=0;i<n.eventLists_.length;i++){const r=n.eventLists_[i];if(r){const o=r.path;e(o)?(Nf(n.eventLists_[i]),n.eventLists_[i]=null):t=!1}}t&&(n.eventLists_=[]),n.recursionDepth_--}function Nf(n){for(let e=0;e<n.events.length;e++){const t=n.events[e];if(t!==null){n.events[e]=null;const i=t.getEventRunner();Ht&&ne("event: "+t.toString()),$t(i)}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rf="repo_interrupt",Df=25;class Pf{constructor(e,t,i,r){this.repoInfo_=e,this.forceRestClient_=t,this.authTokenProvider_=i,this.appCheckProvider_=r,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new bf,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=Gn(),this.transactionQueueTree_=new Es,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function kf(n,e,t){if(n.stats_=Hi(n.repoInfo_),n.forceRestClient_||cu())n.server_=new Hn(n.repoInfo_,(i,r,o,a)=>{Fl(n,i,r,o,a)},n.authTokenProvider_,n.appCheckProvider_),setTimeout(()=>Ul(n,!0),0);else{if(typeof t<"u"&&t!==null){if(typeof t!="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{J(t)}catch(i){throw new Error("Invalid authOverride provided: "+i)}}n.persistentConnection_=new ke(n.repoInfo_,e,(i,r,o,a)=>{Fl(n,i,r,o,a)},i=>{Ul(n,i)},i=>{xf(n,i)},n.authTokenProvider_,n.appCheckProvider_,t),n.server_=n.persistentConnection_}n.authTokenProvider_.addTokenChangeListener(i=>{n.server_.refreshAuthToken(i)}),n.appCheckProvider_.addTokenChangeListener(i=>{n.server_.refreshAppCheckToken(i.token)}),n.statsReporter_=gu(n.repoInfo_,()=>new fd(n.stats_,n.server_)),n.infoData_=new ad,n.infoSyncTree_=new vl({startListening:(i,r,o,a)=>{let c=[];const d=n.infoData_.getNode(i._path);return d.isEmpty()||(c=Zn(n.infoSyncTree_,i._path,d),setTimeout(()=>{a("ok")},0)),c},stopListening:()=>{}}),Ts(n,"connected",!1),n.serverSyncTree_=new vl({startListening:(i,r,o,a)=>(n.server_.listen(i,o,r,(c,d)=>{const f=a(c,d);rt(n.eventQueue_,i._path,f)}),[]),stopListening:(i,r)=>{n.server_.unlisten(i,r)}})}function Of(n){const t=n.infoData_.getNode(new W(".info/serverTimeOffset")).val()||0;return new Date().getTime()+t}function Ll(n){return pf({timestamp:Of(n)})}function Fl(n,e,t,i,r){n.dataUpdateCount++;const o=new W(e);t=n.interceptServerDataCallback_?n.interceptServerDataCallback_(e,t):t;let a=[];if(r)if(i){const d=On(t,f=>ie(f));a=hf(n.serverSyncTree_,o,d,r)}else{const d=ie(t);a=af(n.serverSyncTree_,o,d,r)}else if(i){const d=On(t,f=>ie(f));a=rf(n.serverSyncTree_,o,d)}else{const d=ie(t);a=Zn(n.serverSyncTree_,o,d)}let c=o;a.length>0&&(c=As(n,o)),rt(n.eventQueue_,c,a)}function Ul(n,e){Ts(n,"connected",e),e===!1&&Lf(n)}function xf(n,e){ae(e,(t,i)=>{Ts(n,t,i)})}function Ts(n,e,t){const i=new W("/.info/"+e),r=ie(t);n.infoData_.updateSnapshot(i,r);const o=Zn(n.infoSyncTree_,i,r);rt(n.eventQueue_,i,o)}function Mf(n){return n.nextWriteId_++}function Lf(n){Bl(n,"onDisconnectEvents");const e=Ll(n),t=Gn();Zi(n.onDisconnect_,B(),(r,o)=>{const a=mf(r,o,n.serverSyncTree_,e);Ko(t,r,a)});let i=[];Zi(t,B(),(r,o)=>{i=i.concat(Zn(n.serverSyncTree_,r,o));const a=jf(n,r);As(n,a)}),n.onDisconnect_=Gn(),rt(n.eventQueue_,B(),i)}function Ff(n,e,t){let i;x(e._path)===".info"?i=El(n.infoSyncTree_,e,t):i=El(n.serverSyncTree_,e,t),xl(n.eventQueue_,e._path,i)}function Vl(n,e,t){let i;x(e._path)===".info"?i=fs(n.infoSyncTree_,e,t):i=fs(n.serverSyncTree_,e,t),xl(n.eventQueue_,e._path,i)}function Uf(n){n.persistentConnection_&&n.persistentConnection_.interrupt(Rf)}function Bl(n,...e){let t="";n.persistentConnection_&&(t=n.persistentConnection_.id+":"),ne(t,...e)}function jl(n,e,t){return wl(n.serverSyncTree_,e,t)||D.EMPTY_NODE}function Ss(n,e=n.transactionQueueTree_){if(e||ii(n,e),Dt(e)){const t=Hl(n,e);A(t.length>0,"Sending zero length transaction queue"),t.every(r=>r.status===0)&&Vf(n,hn(e),t)}else bl(e)&&ni(e,t=>{Ss(n,t)})}function Vf(n,e,t){const i=t.map(f=>f.currentWriteId),r=jl(n,e,i);let o=r;const a=r.hash();for(let f=0;f<t.length;f++){const I=t[f];A(I.status===0,"tryToSendTransactionQueue_: items in queue should all be run."),I.status=1,I.retryCount++;const y=he(e,I.path);o=o.updateChild(y,I.currentOutputSnapshotRaw)}const c=o.val(!0),d=e;n.server_.put(d.toString(),c,f=>{Bl(n,"transaction put response",{path:d.toString(),status:f});let I=[];if(f==="ok"){const y=[];for(let S=0;S<t.length;S++)t[S].status=2,I=I.concat(Rt(n.serverSyncTree_,t[S].currentWriteId)),t[S].onComplete&&y.push(()=>t[S].onComplete(null,!0,t[S].currentOutputSnapshotResolved)),t[S].unwatcher();ii(n,ws(n.transactionQueueTree_,e)),Ss(n,n.transactionQueueTree_),rt(n.eventQueue_,e,I);for(let S=0;S<y.length;S++)$t(y[S])}else{if(f==="datastale")for(let y=0;y<t.length;y++)t[y].status===3?t[y].status=4:t[y].status=0;else{de("transaction at "+d.toString()+" failed: "+f);for(let y=0;y<t.length;y++)t[y].status=4,t[y].abortReason=f}As(n,e)}},a)}function As(n,e){const t=Wl(n,e),i=hn(t),r=Hl(n,t);return Bf(n,r,i),i}function Bf(n,e,t){if(e.length===0)return;const i=[];let r=[];const a=e.filter(c=>c.status===0).map(c=>c.currentWriteId);for(let c=0;c<e.length;c++){const d=e[c],f=he(t,d.path);let I=!1,y;if(A(f!==null,"rerunTransactionsUnderNode_: relativePath should not be null."),d.status===4)I=!0,y=d.abortReason,r=r.concat(Rt(n.serverSyncTree_,d.currentWriteId,!0));else if(d.status===0)if(d.retryCount>=Df)I=!0,y="maxretry",r=r.concat(Rt(n.serverSyncTree_,d.currentWriteId,!0));else{const S=jl(n,d.path,a);d.currentInputSnapshot=S;const N=e[c].update(S.val());if(N!==void 0){Pl("transaction failed: Data returned ",N,d.path);let R=ie(N);typeof N=="object"&&N!=null&&Re(N,".priority")||(R=R.updatePriority(S.getPriority()));const L=d.currentWriteId,fe=Ll(n),Ie=yf(R,S,fe);d.currentOutputSnapshotRaw=R,d.currentOutputSnapshotResolved=Ie,d.currentWriteId=Mf(n),a.splice(a.indexOf(L),1),r=r.concat(sf(n.serverSyncTree_,d.path,Ie,d.currentWriteId,d.applyLocally)),r=r.concat(Rt(n.serverSyncTree_,L,!0))}else I=!0,y="nodata",r=r.concat(Rt(n.serverSyncTree_,d.currentWriteId,!0))}rt(n.eventQueue_,t,r),r=[],I&&(e[c].status=2,(function(S){setTimeout(S,Math.floor(0))})(e[c].unwatcher),e[c].onComplete&&(y==="nodata"?i.push(()=>e[c].onComplete(null,!1,e[c].currentInputSnapshot)):i.push(()=>e[c].onComplete(new Error(y),!1,null))))}ii(n,n.transactionQueueTree_);for(let c=0;c<i.length;c++)$t(i[c]);Ss(n,n.transactionQueueTree_)}function Wl(n,e){let t,i=n.transactionQueueTree_;for(t=x(e);t!==null&&Dt(i)===void 0;)i=ws(i,t),e=G(e),t=x(e);return i}function Hl(n,e){const t=[];return Gl(n,e,t),t.sort((i,r)=>i.order-r.order),t}function Gl(n,e,t){const i=Dt(e);if(i)for(let r=0;r<i.length;r++)t.push(i[r]);ni(e,r=>{Gl(n,r,t)})}function ii(n,e){const t=Dt(e);if(t){let i=0;for(let r=0;r<t.length;r++)t[r].status!==2&&(t[i]=t[r],i++);t.length=i,Al(e,t.length>0?t:void 0)}ni(e,i=>{ii(n,i)})}function jf(n,e){const t=hn(Wl(n,e)),i=ws(n.transactionQueueTree_,e);return Ef(i,r=>{bs(n,r)}),bs(n,i),Nl(i,r=>{bs(n,r)}),t}function bs(n,e){const t=Dt(e);if(t){const i=[];let r=[],o=-1;for(let a=0;a<t.length;a++)t[a].status===3||(t[a].status===1?(A(o===a-1,"All SENT items should be at beginning of queue."),o=a,t[a].status=3,t[a].abortReason="set"):(A(t[a].status===0,"Unexpected transaction status in abort"),t[a].unwatcher(),r=r.concat(Rt(n.serverSyncTree_,t[a].currentWriteId,!0)),t[a].onComplete&&i.push(t[a].onComplete.bind(null,new Error("set"),!1,null))));o===-1?Al(e,void 0):t.length=o+1,rt(n.eventQueue_,hn(e),r);for(let a=0;a<i.length;a++)$t(i[a])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wf(n){let e="";const t=n.split("/");for(let i=0;i<t.length;i++)if(t[i].length>0){let r=t[i];try{r=decodeURIComponent(r.replace(/\+/g," "))}catch{}e+="/"+r}return e}function Hf(n){const e={};n.charAt(0)==="?"&&(n=n.substring(1));for(const t of n.split("&")){if(t.length===0)continue;const i=t.split("=");i.length===2?e[decodeURIComponent(i[0])]=decodeURIComponent(i[1]):de(`Invalid query segment '${t}' in query '${n}'`)}return e}const ql=function(n,e){const t=Gf(n),i=t.namespace;t.domain==="firebase.com"&&Pe(t.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),(!i||i==="undefined")&&t.domain!=="localhost"&&Pe("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),t.secure||tu();const r=t.scheme==="ws"||t.scheme==="wss";return{repoInfo:new _o(t.host,t.secure,i,r,e,"",i!==t.subdomain),path:new W(t.pathString)}},Gf=function(n){let e="",t="",i="",r="",o="",a=!0,c="https",d=443;if(typeof n=="string"){let f=n.indexOf("//");f>=0&&(c=n.substring(0,f-1),n=n.substring(f+2));let I=n.indexOf("/");I===-1&&(I=n.length);let y=n.indexOf("?");y===-1&&(y=n.length),e=n.substring(0,Math.min(I,y)),I<y&&(r=Wf(n.substring(I,y)));const S=Hf(n.substring(Math.min(n.length,y)));f=e.indexOf(":"),f>=0?(a=c==="https"||c==="wss",d=parseInt(e.substring(f+1),10)):f=e.length;const N=e.slice(0,f);if(N.toLowerCase()==="localhost")t="localhost";else if(N.split(".").length<=2)t=N;else{const R=e.indexOf(".");i=e.substring(0,R).toLowerCase(),t=e.substring(R+1),o=i}"ns"in S&&(o=S.ns)}return{host:e,port:d,domain:t,subdomain:i,secure:a,scheme:c,pathString:r,namespace:o}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qf{constructor(e,t,i,r){this.eventType=e,this.eventRegistration=t,this.snapshot=i,this.prevName=r}getPath(){const e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+J(this.snapshot.exportVal())}}class $f{constructor(e,t,i){this.eventRegistration=e,this.error=t,this.path=i}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zf{constructor(e,t){this.snapshotCallback=e,this.cancelCallback=t}onValue(e,t){this.snapshotCallback.call(null,e,t)}onCancel(e){return A(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ns{constructor(e,t,i,r){this._repo=e,this._path=t,this._queryParams=i,this._orderByCalled=r}get key(){return M(this._path)?null:xo(this._path)}get ref(){return new je(this._repo,this._path)}get _queryIdentifier(){const e=Yo(this._queryParams),t=Ui(e);return t==="{}"?"default":t}get _queryObject(){return Yo(this._queryParams)}isEqual(e){if(e=Vt(e),!(e instanceof Ns))return!1;const t=this._repo===e._repo,i=$i(this._path,e._path),r=this._queryIdentifier===e._queryIdentifier;return t&&i&&r}toJSON(){return this.toString()}toString(){return this._repo.toString()+Uu(this._path)}}class je extends Ns{constructor(e,t){super(e,t,new Ji,!1)}get parent(){const e=Lo(this._path);return e===null?null:new je(this._repo,e)}get root(){let e=this;for(;e.parent!==null;)e=e.parent;return e}}class si{constructor(e,t,i){this._node=e,this.ref=t,this._index=i}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const t=new W(e),i=Rs(this.ref,e);return new si(this._node.getChild(t),i,z)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){return this._node.isLeafNode()?!1:!!this._node.forEachChild(this._index,(i,r)=>e(new si(r,Rs(this.ref,i),z)))}hasChild(e){const t=new W(e);return!this._node.getChild(t).isEmpty()}hasChildren(){return this._node.isLeafNode()?!1:!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function Yf(n,e){return n=Vt(n),n._checkNotDeleted("ref"),Rs(n._root,e)}function Rs(n,e){return n=Vt(n),x(n._path)===null?Sf("child","path",e):kl("child","path",e),new je(n._repo,X(n._path,e))}class Ds{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,t){const i=t._queryParams.getIndex();return new qf("value",this,new si(e.snapshotNode,new je(t._repo,t._path),i))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new $f(this,e,t):null}matches(e){return e instanceof Ds?!e.callbackContext||!this.callbackContext?!0:e.callbackContext.matches(this.callbackContext):!1}hasAnyCallback(){return this.callbackContext!==null}}function Kf(n,e,t,i,r){let o;if(typeof i=="object"&&(o=void 0,r=i),typeof i=="function"&&(o=i),r&&r.onlyOnce){const d=t,f=(I,y)=>{Vl(n._repo,n,c),d(I,y)};f.userCallback=t.userCallback,f.context=t.context,t=f}const a=new zf(t,o||void 0),c=new Ds(a);return Ff(n._repo,n,c),()=>Vl(n._repo,n,c)}function Xf(n,e,t,i){return Kf(n,"value",e,t,i)}Yd(je),ef(je);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qf="FIREBASE_DATABASE_EMULATOR_HOST",Ps={};let Jf=!1;function Zf(n,e,t,i){const r=e.lastIndexOf(":"),o=e.substring(0,r),a=Si(o);n.repoInfo_=new _o(e,a,n.repoInfo_.namespace,n.repoInfo_.webSocketOnly,n.repoInfo_.nodeAdmin,n.repoInfo_.persistenceKey,n.repoInfo_.includeNamespaceInQueryParams,!0,t),i&&(n.authTokenProvider_=i)}function ep(n,e,t,i,r){let o=i||n.options.databaseURL;o===void 0&&(n.options.projectId||Pe("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),ne("Using default host for project ",n.options.projectId),o=`${n.options.projectId}-default-rtdb.firebaseio.com`);let a=ql(o,r),c=a.repoInfo,d;typeof process<"u"&&Kr&&(d=Kr[Qf]),d?(o=`http://${d}?ns=${c.namespace}`,a=ql(o,r),c=a.repoInfo):a.repoInfo.secure;const f=new du(n.name,n.options,e);Af("Invalid Firebase Database URL",a),M(a.path)||Pe("Database URL must point to the root of a Firebase Database (not including a child path).");const I=np(c,n,f,new uu(n,t));return new ip(I,n)}function tp(n,e){const t=Ps[e];(!t||t[n.key]!==n)&&Pe(`Database ${e}(${n.repoInfo_}) has already been deleted.`),Uf(n),delete t[n.key]}function np(n,e,t,i){let r=Ps[e.name];r||(r={},Ps[e.name]=r);let o=r[n.toURLString()];return o&&Pe("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),o=new Pf(n,Jf,t,i),r[n.toURLString()]=o,o}class ip{constructor(e,t){this._repoInternal=e,this.app=t,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(kf(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new je(this._repo,B())),this._rootInternal}_delete(){return this._rootInternal!==null&&(tp(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&Pe("Cannot call "+e+" on a deleted database.")}}function sp(n=Hr(),e){const t=Vr(n,"database").getImmediate({identifier:e});if(!t._instanceStarted){const i=Cr("database");i&&rp(t,...i)}return t}function rp(n,e,t,i={}){n=Vt(n),n._checkNotDeleted("useEmulator");const r=`${e}:${t}`,o=n._repoInternal;if(n._instanceStarted){if(r===n._repoInternal.repoInfo_.host&&Ut(i,o.repoInfo_.emulatorOptions))return;Pe("connectDatabaseEmulator() cannot initialize or alter the emulator configuration after the database instance has started.")}let a;if(o.repoInfo_.nodeAdmin)i.mockUserToken&&Pe('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),a=new Ln(Ln.OWNER);else if(i.mockUserToken){const c=typeof i.mockUserToken=="string"?i.mockUserToken:Tr(i.mockUserToken,n.app.options.projectId);a=new Ln(c)}Si(e)&&Pr(e),Zf(o,r,i,a)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function op(n){Kc(jr),Bt(new vt("database",(e,{instanceIdentifier:t})=>{const i=e.getProvider("app").getImmediate(),r=e.getProvider("auth-internal"),o=e.getProvider("app-check-internal");return ep(i,r,o,t)},"PUBLIC").setMultipleInstances(!0)),Fe(Xr,Qr,n),Fe(Xr,Qr,"esm2020")}ke.prototype.simpleListen=function(n,e){this.sendRequest("q",{p:n},e)},ke.prototype.echo=function(n,e){this.sendRequest("echo",{d:n},e)},op();var lp="firebase",ap="12.11.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Fe(lp,ap,"app");var $l=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var ks;(function(){var n;/** @license

     Copyright The Closure Library Authors.
     SPDX-License-Identifier: Apache-2.0
    */function e(v,p){function _(){}_.prototype=p.prototype,v.F=p.prototype,v.prototype=new _,v.prototype.constructor=v,v.D=function(E,m,C){for(var g=Array(arguments.length-2),ue=2;ue<arguments.length;ue++)g[ue-2]=arguments[ue];return p.prototype[m].apply(E,g)}}function t(){this.blockSize=-1}function i(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(i,t),i.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function r(v,p,_){_||(_=0);const E=Array(16);if(typeof p=="string")for(var m=0;m<16;++m)E[m]=p.charCodeAt(_++)|p.charCodeAt(_++)<<8|p.charCodeAt(_++)<<16|p.charCodeAt(_++)<<24;else for(m=0;m<16;++m)E[m]=p[_++]|p[_++]<<8|p[_++]<<16|p[_++]<<24;p=v.g[0],_=v.g[1],m=v.g[2];let C=v.g[3],g;g=p+(C^_&(m^C))+E[0]+3614090360&4294967295,p=_+(g<<7&4294967295|g>>>25),g=C+(m^p&(_^m))+E[1]+3905402710&4294967295,C=p+(g<<12&4294967295|g>>>20),g=m+(_^C&(p^_))+E[2]+606105819&4294967295,m=C+(g<<17&4294967295|g>>>15),g=_+(p^m&(C^p))+E[3]+3250441966&4294967295,_=m+(g<<22&4294967295|g>>>10),g=p+(C^_&(m^C))+E[4]+4118548399&4294967295,p=_+(g<<7&4294967295|g>>>25),g=C+(m^p&(_^m))+E[5]+1200080426&4294967295,C=p+(g<<12&4294967295|g>>>20),g=m+(_^C&(p^_))+E[6]+2821735955&4294967295,m=C+(g<<17&4294967295|g>>>15),g=_+(p^m&(C^p))+E[7]+4249261313&4294967295,_=m+(g<<22&4294967295|g>>>10),g=p+(C^_&(m^C))+E[8]+1770035416&4294967295,p=_+(g<<7&4294967295|g>>>25),g=C+(m^p&(_^m))+E[9]+2336552879&4294967295,C=p+(g<<12&4294967295|g>>>20),g=m+(_^C&(p^_))+E[10]+4294925233&4294967295,m=C+(g<<17&4294967295|g>>>15),g=_+(p^m&(C^p))+E[11]+2304563134&4294967295,_=m+(g<<22&4294967295|g>>>10),g=p+(C^_&(m^C))+E[12]+1804603682&4294967295,p=_+(g<<7&4294967295|g>>>25),g=C+(m^p&(_^m))+E[13]+4254626195&4294967295,C=p+(g<<12&4294967295|g>>>20),g=m+(_^C&(p^_))+E[14]+2792965006&4294967295,m=C+(g<<17&4294967295|g>>>15),g=_+(p^m&(C^p))+E[15]+1236535329&4294967295,_=m+(g<<22&4294967295|g>>>10),g=p+(m^C&(_^m))+E[1]+4129170786&4294967295,p=_+(g<<5&4294967295|g>>>27),g=C+(_^m&(p^_))+E[6]+3225465664&4294967295,C=p+(g<<9&4294967295|g>>>23),g=m+(p^_&(C^p))+E[11]+643717713&4294967295,m=C+(g<<14&4294967295|g>>>18),g=_+(C^p&(m^C))+E[0]+3921069994&4294967295,_=m+(g<<20&4294967295|g>>>12),g=p+(m^C&(_^m))+E[5]+3593408605&4294967295,p=_+(g<<5&4294967295|g>>>27),g=C+(_^m&(p^_))+E[10]+38016083&4294967295,C=p+(g<<9&4294967295|g>>>23),g=m+(p^_&(C^p))+E[15]+3634488961&4294967295,m=C+(g<<14&4294967295|g>>>18),g=_+(C^p&(m^C))+E[4]+3889429448&4294967295,_=m+(g<<20&4294967295|g>>>12),g=p+(m^C&(_^m))+E[9]+568446438&4294967295,p=_+(g<<5&4294967295|g>>>27),g=C+(_^m&(p^_))+E[14]+3275163606&4294967295,C=p+(g<<9&4294967295|g>>>23),g=m+(p^_&(C^p))+E[3]+4107603335&4294967295,m=C+(g<<14&4294967295|g>>>18),g=_+(C^p&(m^C))+E[8]+1163531501&4294967295,_=m+(g<<20&4294967295|g>>>12),g=p+(m^C&(_^m))+E[13]+2850285829&4294967295,p=_+(g<<5&4294967295|g>>>27),g=C+(_^m&(p^_))+E[2]+4243563512&4294967295,C=p+(g<<9&4294967295|g>>>23),g=m+(p^_&(C^p))+E[7]+1735328473&4294967295,m=C+(g<<14&4294967295|g>>>18),g=_+(C^p&(m^C))+E[12]+2368359562&4294967295,_=m+(g<<20&4294967295|g>>>12),g=p+(_^m^C)+E[5]+4294588738&4294967295,p=_+(g<<4&4294967295|g>>>28),g=C+(p^_^m)+E[8]+2272392833&4294967295,C=p+(g<<11&4294967295|g>>>21),g=m+(C^p^_)+E[11]+1839030562&4294967295,m=C+(g<<16&4294967295|g>>>16),g=_+(m^C^p)+E[14]+4259657740&4294967295,_=m+(g<<23&4294967295|g>>>9),g=p+(_^m^C)+E[1]+2763975236&4294967295,p=_+(g<<4&4294967295|g>>>28),g=C+(p^_^m)+E[4]+1272893353&4294967295,C=p+(g<<11&4294967295|g>>>21),g=m+(C^p^_)+E[7]+4139469664&4294967295,m=C+(g<<16&4294967295|g>>>16),g=_+(m^C^p)+E[10]+3200236656&4294967295,_=m+(g<<23&4294967295|g>>>9),g=p+(_^m^C)+E[13]+681279174&4294967295,p=_+(g<<4&4294967295|g>>>28),g=C+(p^_^m)+E[0]+3936430074&4294967295,C=p+(g<<11&4294967295|g>>>21),g=m+(C^p^_)+E[3]+3572445317&4294967295,m=C+(g<<16&4294967295|g>>>16),g=_+(m^C^p)+E[6]+76029189&4294967295,_=m+(g<<23&4294967295|g>>>9),g=p+(_^m^C)+E[9]+3654602809&4294967295,p=_+(g<<4&4294967295|g>>>28),g=C+(p^_^m)+E[12]+3873151461&4294967295,C=p+(g<<11&4294967295|g>>>21),g=m+(C^p^_)+E[15]+530742520&4294967295,m=C+(g<<16&4294967295|g>>>16),g=_+(m^C^p)+E[2]+3299628645&4294967295,_=m+(g<<23&4294967295|g>>>9),g=p+(m^(_|~C))+E[0]+4096336452&4294967295,p=_+(g<<6&4294967295|g>>>26),g=C+(_^(p|~m))+E[7]+1126891415&4294967295,C=p+(g<<10&4294967295|g>>>22),g=m+(p^(C|~_))+E[14]+2878612391&4294967295,m=C+(g<<15&4294967295|g>>>17),g=_+(C^(m|~p))+E[5]+4237533241&4294967295,_=m+(g<<21&4294967295|g>>>11),g=p+(m^(_|~C))+E[12]+1700485571&4294967295,p=_+(g<<6&4294967295|g>>>26),g=C+(_^(p|~m))+E[3]+2399980690&4294967295,C=p+(g<<10&4294967295|g>>>22),g=m+(p^(C|~_))+E[10]+4293915773&4294967295,m=C+(g<<15&4294967295|g>>>17),g=_+(C^(m|~p))+E[1]+2240044497&4294967295,_=m+(g<<21&4294967295|g>>>11),g=p+(m^(_|~C))+E[8]+1873313359&4294967295,p=_+(g<<6&4294967295|g>>>26),g=C+(_^(p|~m))+E[15]+4264355552&4294967295,C=p+(g<<10&4294967295|g>>>22),g=m+(p^(C|~_))+E[6]+2734768916&4294967295,m=C+(g<<15&4294967295|g>>>17),g=_+(C^(m|~p))+E[13]+1309151649&4294967295,_=m+(g<<21&4294967295|g>>>11),g=p+(m^(_|~C))+E[4]+4149444226&4294967295,p=_+(g<<6&4294967295|g>>>26),g=C+(_^(p|~m))+E[11]+3174756917&4294967295,C=p+(g<<10&4294967295|g>>>22),g=m+(p^(C|~_))+E[2]+718787259&4294967295,m=C+(g<<15&4294967295|g>>>17),g=_+(C^(m|~p))+E[9]+3951481745&4294967295,v.g[0]=v.g[0]+p&4294967295,v.g[1]=v.g[1]+(m+(g<<21&4294967295|g>>>11))&4294967295,v.g[2]=v.g[2]+m&4294967295,v.g[3]=v.g[3]+C&4294967295}i.prototype.v=function(v,p){p===void 0&&(p=v.length);const _=p-this.blockSize,E=this.C;let m=this.h,C=0;for(;C<p;){if(m==0)for(;C<=_;)r(this,v,C),C+=this.blockSize;if(typeof v=="string"){for(;C<p;)if(E[m++]=v.charCodeAt(C++),m==this.blockSize){r(this,E),m=0;break}}else for(;C<p;)if(E[m++]=v[C++],m==this.blockSize){r(this,E),m=0;break}}this.h=m,this.o+=p},i.prototype.A=function(){var v=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);v[0]=128;for(var p=1;p<v.length-8;++p)v[p]=0;p=this.o*8;for(var _=v.length-8;_<v.length;++_)v[_]=p&255,p/=256;for(this.v(v),v=Array(16),p=0,_=0;_<4;++_)for(let E=0;E<32;E+=8)v[p++]=this.g[_]>>>E&255;return v};function o(v,p){var _=c;return Object.prototype.hasOwnProperty.call(_,v)?_[v]:_[v]=p(v)}function a(v,p){this.h=p;const _=[];let E=!0;for(let m=v.length-1;m>=0;m--){const C=v[m]|0;E&&C==p||(_[m]=C,E=!1)}this.g=_}var c={};function d(v){return-128<=v&&v<128?o(v,function(p){return new a([p|0],p<0?-1:0)}):new a([v|0],v<0?-1:0)}function f(v){if(isNaN(v)||!isFinite(v))return y;if(v<0)return L(f(-v));const p=[];let _=1;for(let E=0;v>=_;E++)p[E]=v/_|0,_*=4294967296;return new a(p,0)}function I(v,p){if(v.length==0)throw Error("number format error: empty string");if(p=p||10,p<2||36<p)throw Error("radix out of range: "+p);if(v.charAt(0)=="-")return L(I(v.substring(1),p));if(v.indexOf("-")>=0)throw Error('number format error: interior "-" character');const _=f(Math.pow(p,8));let E=y;for(let C=0;C<v.length;C+=8){var m=Math.min(8,v.length-C);const g=parseInt(v.substring(C,C+m),p);m<8?(m=f(Math.pow(p,m)),E=E.j(m).add(f(g))):(E=E.j(_),E=E.add(f(g)))}return E}var y=d(0),S=d(1),N=d(16777216);n=a.prototype,n.m=function(){if(P(this))return-L(this).m();let v=0,p=1;for(let _=0;_<this.g.length;_++){const E=this.i(_);v+=(E>=0?E:4294967296+E)*p,p*=4294967296}return v},n.toString=function(v){if(v=v||10,v<2||36<v)throw Error("radix out of range: "+v);if(R(this))return"0";if(P(this))return"-"+L(this).toString(v);const p=f(Math.pow(v,6));var _=this;let E="";for(;;){const m=He(_,p).g;_=fe(_,m.j(p));let C=((_.g.length>0?_.g[0]:_.h)>>>0).toString(v);if(_=m,R(_))return C+E;for(;C.length<6;)C="0"+C;E=C+E}},n.i=function(v){return v<0?0:v<this.g.length?this.g[v]:this.h};function R(v){if(v.h!=0)return!1;for(let p=0;p<v.g.length;p++)if(v.g[p]!=0)return!1;return!0}function P(v){return v.h==-1}n.l=function(v){return v=fe(this,v),P(v)?-1:R(v)?0:1};function L(v){const p=v.g.length,_=[];for(let E=0;E<p;E++)_[E]=~v.g[E];return new a(_,~v.h).add(S)}n.abs=function(){return P(this)?L(this):this},n.add=function(v){const p=Math.max(this.g.length,v.g.length),_=[];let E=0;for(let m=0;m<=p;m++){let C=E+(this.i(m)&65535)+(v.i(m)&65535),g=(C>>>16)+(this.i(m)>>>16)+(v.i(m)>>>16);E=g>>>16,C&=65535,g&=65535,_[m]=g<<16|C}return new a(_,_[_.length-1]&-2147483648?-1:0)};function fe(v,p){return v.add(L(p))}n.j=function(v){if(R(this)||R(v))return y;if(P(this))return P(v)?L(this).j(L(v)):L(L(this).j(v));if(P(v))return L(this.j(L(v)));if(this.l(N)<0&&v.l(N)<0)return f(this.m()*v.m());const p=this.g.length+v.g.length,_=[];for(var E=0;E<2*p;E++)_[E]=0;for(E=0;E<this.g.length;E++)for(let m=0;m<v.g.length;m++){const C=this.i(E)>>>16,g=this.i(E)&65535,ue=v.i(m)>>>16,ut=v.i(m)&65535;_[2*E+2*m]+=g*ut,Ie(_,2*E+2*m),_[2*E+2*m+1]+=C*ut,Ie(_,2*E+2*m+1),_[2*E+2*m+1]+=g*ue,Ie(_,2*E+2*m+1),_[2*E+2*m+2]+=C*ue,Ie(_,2*E+2*m+2)}for(v=0;v<p;v++)_[v]=_[2*v+1]<<16|_[2*v];for(v=p;v<2*p;v++)_[v]=0;return new a(_,0)};function Ie(v,p){for(;(v[p]&65535)!=v[p];)v[p+1]+=v[p]>>>16,v[p]&=65535,p++}function pe(v,p){this.g=v,this.h=p}function He(v,p){if(R(p))throw Error("division by zero");if(R(v))return new pe(y,y);if(P(v))return p=He(L(v),p),new pe(L(p.g),L(p.h));if(P(p))return p=He(v,L(p)),new pe(L(p.g),p.h);if(v.g.length>30){if(P(v)||P(p))throw Error("slowDivide_ only works with positive integers.");for(var _=S,E=p;E.l(v)<=0;)_=Ge(_),E=Ge(E);var m=ge(_,1),C=ge(E,1);for(E=ge(E,2),_=ge(_,2);!R(E);){var g=C.add(E);g.l(v)<=0&&(m=m.add(_),C=g),E=ge(E,1),_=ge(_,1)}return p=fe(v,m.j(p)),new pe(m,p)}for(m=y;v.l(p)>=0;){for(_=Math.max(1,Math.floor(v.m()/p.m())),E=Math.ceil(Math.log(_)/Math.LN2),E=E<=48?1:Math.pow(2,E-48),C=f(_),g=C.j(p);P(g)||g.l(v)>0;)_-=E,C=f(_),g=C.j(p);R(C)&&(C=S),m=m.add(C),v=fe(v,g)}return new pe(m,v)}n.B=function(v){return He(this,v).h},n.and=function(v){const p=Math.max(this.g.length,v.g.length),_=[];for(let E=0;E<p;E++)_[E]=this.i(E)&v.i(E);return new a(_,this.h&v.h)},n.or=function(v){const p=Math.max(this.g.length,v.g.length),_=[];for(let E=0;E<p;E++)_[E]=this.i(E)|v.i(E);return new a(_,this.h|v.h)},n.xor=function(v){const p=Math.max(this.g.length,v.g.length),_=[];for(let E=0;E<p;E++)_[E]=this.i(E)^v.i(E);return new a(_,this.h^v.h)};function Ge(v){const p=v.g.length+1,_=[];for(let E=0;E<p;E++)_[E]=v.i(E)<<1|v.i(E-1)>>>31;return new a(_,v.h)}function ge(v,p){const _=p>>5;p%=32;const E=v.g.length-_,m=[];for(let C=0;C<E;C++)m[C]=p>0?v.i(C+_)>>>p|v.i(C+_+1)<<32-p:v.i(C+_);return new a(m,v.h)}i.prototype.digest=i.prototype.A,i.prototype.reset=i.prototype.u,i.prototype.update=i.prototype.v,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.B,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=f,a.fromString=I,ks=a}).apply(typeof $l<"u"?$l:typeof self<"u"?self:typeof window<"u"?window:{});var ri=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};(function(){var n,e=Object.defineProperty;function t(s){s=[typeof globalThis=="object"&&globalThis,s,typeof window=="object"&&window,typeof self=="object"&&self,typeof ri=="object"&&ri];for(var l=0;l<s.length;++l){var h=s[l];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var i=t(this);function r(s,l){if(l)e:{var h=i;s=s.split(".");for(var u=0;u<s.length-1;u++){var w=s[u];if(!(w in h))break e;h=h[w]}s=s[s.length-1],u=h[s],l=l(u),l!=u&&l!=null&&e(h,s,{configurable:!0,writable:!0,value:l})}}r("Symbol.dispose",function(s){return s||Symbol("Symbol.dispose")}),r("Array.prototype.values",function(s){return s||function(){return this[Symbol.iterator]()}}),r("Object.entries",function(s){return s||function(l){var h=[],u;for(u in l)Object.prototype.hasOwnProperty.call(l,u)&&h.push([u,l[u]]);return h}});/** @license

     Copyright The Closure Library Authors.
     SPDX-License-Identifier: Apache-2.0
    */var o=o||{},a=this||self;function c(s){var l=typeof s;return l=="object"&&s!=null||l=="function"}function d(s,l,h){return s.call.apply(s.bind,arguments)}function f(s,l,h){return f=d,f.apply(null,arguments)}function I(s,l){var h=Array.prototype.slice.call(arguments,1);return function(){var u=h.slice();return u.push.apply(u,arguments),s.apply(this,u)}}function y(s,l){function h(){}h.prototype=l.prototype,s.Z=l.prototype,s.prototype=new h,s.prototype.constructor=s,s.Ob=function(u,w,T){for(var b=Array(arguments.length-2),k=2;k<arguments.length;k++)b[k-2]=arguments[k];return l.prototype[w].apply(u,b)}}var S=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?s=>s&&AsyncContext.Snapshot.wrap(s):s=>s;function N(s){const l=s.length;if(l>0){const h=Array(l);for(let u=0;u<l;u++)h[u]=s[u];return h}return[]}function R(s,l){for(let u=1;u<arguments.length;u++){const w=arguments[u];var h=typeof w;if(h=h!="object"?h:w?Array.isArray(w)?"array":h:"null",h=="array"||h=="object"&&typeof w.length=="number"){h=s.length||0;const T=w.length||0;s.length=h+T;for(let b=0;b<T;b++)s[h+b]=w[b]}else s.push(w)}}class P{constructor(l,h){this.i=l,this.j=h,this.h=0,this.g=null}get(){let l;return this.h>0?(this.h--,l=this.g,this.g=l.next,l.next=null):l=this.i(),l}}function L(s){a.setTimeout(()=>{throw s},0)}function fe(){var s=v;let l=null;return s.g&&(l=s.g,s.g=s.g.next,s.g||(s.h=null),l.next=null),l}class Ie{constructor(){this.h=this.g=null}add(l,h){const u=pe.get();u.set(l,h),this.h?this.h.next=u:this.g=u,this.h=u}}var pe=new P(()=>new He,s=>s.reset());class He{constructor(){this.next=this.g=this.h=null}set(l,h){this.h=l,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let Ge,ge=!1,v=new Ie,p=()=>{const s=Promise.resolve(void 0);Ge=()=>{s.then(_)}};function _(){for(var s;s=fe();){try{s.h.call(s.g)}catch(h){L(h)}var l=pe;l.j(s),l.h<100&&(l.h++,s.next=l.g,l.g=s)}ge=!1}function E(){this.u=this.u,this.C=this.C}E.prototype.u=!1,E.prototype.dispose=function(){this.u||(this.u=!0,this.N())},E.prototype[Symbol.dispose]=function(){this.dispose()},E.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function m(s,l){this.type=s,this.g=this.target=l,this.defaultPrevented=!1}m.prototype.h=function(){this.defaultPrevented=!0};var C=(function(){if(!a.addEventListener||!Object.defineProperty)return!1;var s=!1,l=Object.defineProperty({},"passive",{get:function(){s=!0}});try{const h=()=>{};a.addEventListener("test",h,l),a.removeEventListener("test",h,l)}catch{}return s})();function g(s){return/^[\s\xa0]*$/.test(s)}function ue(s,l){m.call(this,s?s.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,s&&this.init(s,l)}y(ue,m),ue.prototype.init=function(s,l){const h=this.type=s.type,u=s.changedTouches&&s.changedTouches.length?s.changedTouches[0]:null;this.target=s.target||s.srcElement,this.g=l,l=s.relatedTarget,l||(h=="mouseover"?l=s.fromElement:h=="mouseout"&&(l=s.toElement)),this.relatedTarget=l,u?(this.clientX=u.clientX!==void 0?u.clientX:u.pageX,this.clientY=u.clientY!==void 0?u.clientY:u.pageY,this.screenX=u.screenX||0,this.screenY=u.screenY||0):(this.clientX=s.clientX!==void 0?s.clientX:s.pageX,this.clientY=s.clientY!==void 0?s.clientY:s.pageY,this.screenX=s.screenX||0,this.screenY=s.screenY||0),this.button=s.button,this.key=s.key||"",this.ctrlKey=s.ctrlKey,this.altKey=s.altKey,this.shiftKey=s.shiftKey,this.metaKey=s.metaKey,this.pointerId=s.pointerId||0,this.pointerType=s.pointerType,this.state=s.state,this.i=s,s.defaultPrevented&&ue.Z.h.call(this)},ue.prototype.h=function(){ue.Z.h.call(this);const s=this.i;s.preventDefault?s.preventDefault():s.returnValue=!1};var ut="closure_listenable_"+(Math.random()*1e6|0),$p=0;function zp(s,l,h,u,w){this.listener=s,this.proxy=null,this.src=l,this.type=h,this.capture=!!u,this.ha=w,this.key=++$p,this.da=this.fa=!1}function ci(s){s.da=!0,s.listener=null,s.proxy=null,s.src=null,s.ha=null}function ui(s,l,h){for(const u in s)l.call(h,s[u],u,s)}function Yp(s,l){for(const h in s)l.call(void 0,s[h],h,s)}function va(s){const l={};for(const h in s)l[h]=s[h];return l}const Ea="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function wa(s,l){let h,u;for(let w=1;w<arguments.length;w++){u=arguments[w];for(h in u)s[h]=u[h];for(let T=0;T<Ea.length;T++)h=Ea[T],Object.prototype.hasOwnProperty.call(u,h)&&(s[h]=u[h])}}function di(s){this.src=s,this.g={},this.h=0}di.prototype.add=function(s,l,h,u,w){const T=s.toString();s=this.g[T],s||(s=this.g[T]=[],this.h++);const b=qs(s,l,u,w);return b>-1?(l=s[b],h||(l.fa=!1)):(l=new zp(l,this.src,T,!!u,w),l.fa=h,s.push(l)),l};function Gs(s,l){const h=l.type;if(h in s.g){var u=s.g[h],w=Array.prototype.indexOf.call(u,l,void 0),T;(T=w>=0)&&Array.prototype.splice.call(u,w,1),T&&(ci(l),s.g[h].length==0&&(delete s.g[h],s.h--))}}function qs(s,l,h,u){for(let w=0;w<s.length;++w){const T=s[w];if(!T.da&&T.listener==l&&T.capture==!!h&&T.ha==u)return w}return-1}var $s="closure_lm_"+(Math.random()*1e6|0),zs={};function Ca(s,l,h,u,w){if(Array.isArray(l)){for(let T=0;T<l.length;T++)Ca(s,l[T],h,u,w);return null}return h=Sa(h),s&&s[ut]?s.J(l,h,c(u)?!!u.capture:!1,w):Kp(s,l,h,!1,u,w)}function Kp(s,l,h,u,w,T){if(!l)throw Error("Invalid event type");const b=c(w)?!!w.capture:!!w;let k=Ks(s);if(k||(s[$s]=k=new di(s)),h=k.add(l,h,u,b,T),h.proxy)return h;if(u=Xp(),h.proxy=u,u.src=s,u.listener=h,s.addEventListener)C||(w=b),w===void 0&&(w=!1),s.addEventListener(l.toString(),u,w);else if(s.attachEvent)s.attachEvent(Ta(l.toString()),u);else if(s.addListener&&s.removeListener)s.addListener(u);else throw Error("addEventListener and attachEvent are unavailable.");return h}function Xp(){function s(h){return l.call(s.src,s.listener,h)}const l=Qp;return s}function Ia(s,l,h,u,w){if(Array.isArray(l))for(var T=0;T<l.length;T++)Ia(s,l[T],h,u,w);else u=c(u)?!!u.capture:!!u,h=Sa(h),s&&s[ut]?(s=s.i,T=String(l).toString(),T in s.g&&(l=s.g[T],h=qs(l,h,u,w),h>-1&&(ci(l[h]),Array.prototype.splice.call(l,h,1),l.length==0&&(delete s.g[T],s.h--)))):s&&(s=Ks(s))&&(l=s.g[l.toString()],s=-1,l&&(s=qs(l,h,u,w)),(h=s>-1?l[s]:null)&&Ys(h))}function Ys(s){if(typeof s!="number"&&s&&!s.da){var l=s.src;if(l&&l[ut])Gs(l.i,s);else{var h=s.type,u=s.proxy;l.removeEventListener?l.removeEventListener(h,u,s.capture):l.detachEvent?l.detachEvent(Ta(h),u):l.addListener&&l.removeListener&&l.removeListener(u),(h=Ks(l))?(Gs(h,s),h.h==0&&(h.src=null,l[$s]=null)):ci(s)}}}function Ta(s){return s in zs?zs[s]:zs[s]="on"+s}function Qp(s,l){if(s.da)s=!0;else{l=new ue(l,this);const h=s.listener,u=s.ha||s.src;s.fa&&Ys(s),s=h.call(u,l)}return s}function Ks(s){return s=s[$s],s instanceof di?s:null}var Xs="__closure_events_fn_"+(Math.random()*1e9>>>0);function Sa(s){return typeof s=="function"?s:(s[Xs]||(s[Xs]=function(l){return s.handleEvent(l)}),s[Xs])}function se(){E.call(this),this.i=new di(this),this.M=this,this.G=null}y(se,E),se.prototype[ut]=!0,se.prototype.removeEventListener=function(s,l,h,u){Ia(this,s,l,h,u)};function oe(s,l){var h,u=s.G;if(u)for(h=[];u;u=u.G)h.push(u);if(s=s.M,u=l.type||l,typeof l=="string")l=new m(l,s);else if(l instanceof m)l.target=l.target||s;else{var w=l;l=new m(u,s),wa(l,w)}w=!0;let T,b;if(h)for(b=h.length-1;b>=0;b--)T=l.g=h[b],w=fi(T,u,!0,l)&&w;if(T=l.g=s,w=fi(T,u,!0,l)&&w,w=fi(T,u,!1,l)&&w,h)for(b=0;b<h.length;b++)T=l.g=h[b],w=fi(T,u,!1,l)&&w}se.prototype.N=function(){if(se.Z.N.call(this),this.i){var s=this.i;for(const l in s.g){const h=s.g[l];for(let u=0;u<h.length;u++)ci(h[u]);delete s.g[l],s.h--}}this.G=null},se.prototype.J=function(s,l,h,u){return this.i.add(String(s),l,!1,h,u)},se.prototype.K=function(s,l,h,u){return this.i.add(String(s),l,!0,h,u)};function fi(s,l,h,u){if(l=s.i.g[String(l)],!l)return!0;l=l.concat();let w=!0;for(let T=0;T<l.length;++T){const b=l[T];if(b&&!b.da&&b.capture==h){const k=b.listener,Q=b.ha||b.src;b.fa&&Gs(s.i,b),w=k.call(Q,u)!==!1&&w}}return w&&!u.defaultPrevented}function Jp(s,l){if(typeof s!="function")if(s&&typeof s.handleEvent=="function")s=f(s.handleEvent,s);else throw Error("Invalid listener argument");return Number(l)>2147483647?-1:a.setTimeout(s,l||0)}function Aa(s){s.g=Jp(()=>{s.g=null,s.i&&(s.i=!1,Aa(s))},s.l);const l=s.h;s.h=null,s.m.apply(null,l)}class Zp extends E{constructor(l,h){super(),this.m=l,this.l=h,this.h=null,this.i=!1,this.g=null}j(l){this.h=arguments,this.g?this.i=!0:Aa(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function _n(s){E.call(this),this.h=s,this.g={}}y(_n,E);var ba=[];function Na(s){ui(s.g,function(l,h){this.g.hasOwnProperty(h)&&Ys(l)},s),s.g={}}_n.prototype.N=function(){_n.Z.N.call(this),Na(this)},_n.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Qs=a.JSON.stringify,eg=a.JSON.parse,tg=class{stringify(s){return a.JSON.stringify(s,void 0)}parse(s){return a.JSON.parse(s,void 0)}};function Ra(){}function ng(){}var mn={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function Js(){m.call(this,"d")}y(Js,m);function Zs(){m.call(this,"c")}y(Zs,m);var Ot={},Da=null;function er(){return Da=Da||new se}Ot.Ia="serverreachability";function Pa(s){m.call(this,Ot.Ia,s)}y(Pa,m);function yn(s){const l=er();oe(l,new Pa(l))}Ot.STAT_EVENT="statevent";function ka(s,l){m.call(this,Ot.STAT_EVENT,s),this.stat=l}y(ka,m);function le(s){const l=er();oe(l,new ka(l,s))}Ot.Ja="timingevent";function Oa(s,l){m.call(this,Ot.Ja,s),this.size=l}y(Oa,m);function vn(s,l){if(typeof s!="function")throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){s()},l)}function En(){this.g=!0}En.prototype.ua=function(){this.g=!1};function ig(s,l,h,u,w,T){s.info(function(){if(s.g)if(T){var b="",k=T.split("&");for(let H=0;H<k.length;H++){var Q=k[H].split("=");if(Q.length>1){const te=Q[0];Q=Q[1];const Ne=te.split("_");b=Ne.length>=2&&Ne[1]=="type"?b+(te+"="+Q+"&"):b+(te+"=redacted&")}}}else b=null;else b=T;return"XMLHTTP REQ ("+u+") [attempt "+w+"]: "+l+`
`+h+`
`+b})}function sg(s,l,h,u,w,T,b){s.info(function(){return"XMLHTTP RESP ("+u+") [ attempt "+w+"]: "+l+`
`+h+`
`+T+" "+b})}function xt(s,l,h,u){s.info(function(){return"XMLHTTP TEXT ("+l+"): "+og(s,h)+(u?" "+u:"")})}function rg(s,l){s.info(function(){return"TIMEOUT: "+l})}En.prototype.info=function(){};function og(s,l){if(!s.g)return l;if(!l)return null;try{const T=JSON.parse(l);if(T){for(s=0;s<T.length;s++)if(Array.isArray(T[s])){var h=T[s];if(!(h.length<2)){var u=h[1];if(Array.isArray(u)&&!(u.length<1)){var w=u[0];if(w!="noop"&&w!="stop"&&w!="close")for(let b=1;b<u.length;b++)u[b]=""}}}}return Qs(T)}catch{return l}}var tr={NO_ERROR:0,TIMEOUT:8},lg={},xa;function nr(){}y(nr,Ra),nr.prototype.g=function(){return new XMLHttpRequest},xa=new nr;function wn(s){return encodeURIComponent(String(s))}function ag(s){var l=1;s=s.split(":");const h=[];for(;l>0&&s.length;)h.push(s.shift()),l--;return s.length&&h.push(s.join(":")),h}function qe(s,l,h,u){this.j=s,this.i=l,this.l=h,this.S=u||1,this.V=new _n(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new Ma}function Ma(){this.i=null,this.g="",this.h=!1}var La={},ir={};function sr(s,l,h){s.M=1,s.A=gi(be(l)),s.u=h,s.R=!0,Fa(s,null)}function Fa(s,l){s.F=Date.now(),pi(s),s.B=be(s.A);var h=s.B,u=s.S;Array.isArray(u)||(u=[String(u)]),Xa(h.i,"t",u),s.C=0,h=s.j.L,s.h=new Ma,s.g=ph(s.j,h?l:null,!s.u),s.P>0&&(s.O=new Zp(f(s.Y,s,s.g),s.P)),l=s.V,h=s.g,u=s.ba;var w="readystatechange";Array.isArray(w)||(w&&(ba[0]=w.toString()),w=ba);for(let T=0;T<w.length;T++){const b=Ca(h,w[T],u||l.handleEvent,!1,l.h||l);if(!b)break;l.g[b.key]=b}l=s.J?va(s.J):{},s.u?(s.v||(s.v="POST"),l["Content-Type"]="application/x-www-form-urlencoded",s.g.ea(s.B,s.v,s.u,l)):(s.v="GET",s.g.ea(s.B,s.v,null,l)),yn(),ig(s.i,s.v,s.B,s.l,s.S,s.u)}qe.prototype.ba=function(s){s=s.target;const l=this.O;l&&Ye(s)==3?l.j():this.Y(s)},qe.prototype.Y=function(s){try{if(s==this.g)e:{const k=Ye(this.g),Q=this.g.ya(),H=this.g.ca();if(!(k<3)&&(k!=3||this.g&&(this.h.h||this.g.la()||ih(this.g)))){this.K||k!=4||Q==7||(Q==8||H<=0?yn(3):yn(2)),rr(this);var l=this.g.ca();this.X=l;var h=hg(this);if(this.o=l==200,sg(this.i,this.v,this.B,this.l,this.S,k,l),this.o){if(this.U&&!this.L){t:{if(this.g){var u,w=this.g;if((u=w.g?w.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!g(u)){var T=u;break t}}T=null}if(s=T)xt(this.i,this.l,s,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,or(this,s);else{this.o=!1,this.m=3,le(12),dt(this),Cn(this);break e}}if(this.R){s=!0;let te;for(;!this.K&&this.C<h.length;)if(te=cg(this,h),te==ir){k==4&&(this.m=4,le(14),s=!1),xt(this.i,this.l,null,"[Incomplete Response]");break}else if(te==La){this.m=4,le(15),xt(this.i,this.l,h,"[Invalid Chunk]"),s=!1;break}else xt(this.i,this.l,te,null),or(this,te);if(Ua(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),k!=4||h.length!=0||this.h.h||(this.m=1,le(16),s=!1),this.o=this.o&&s,!s)xt(this.i,this.l,h,"[Invalid Chunked Response]"),dt(this),Cn(this);else if(h.length>0&&!this.W){this.W=!0;var b=this.j;b.g==this&&b.aa&&!b.P&&(b.j.info("Great, no buffering proxy detected. Bytes received: "+h.length),pr(b),b.P=!0,le(11))}}else xt(this.i,this.l,h,null),or(this,h);k==4&&dt(this),this.o&&!this.K&&(k==4?ch(this.j,this):(this.o=!1,pi(this)))}else Tg(this.g),l==400&&h.indexOf("Unknown SID")>0?(this.m=3,le(12)):(this.m=0,le(13)),dt(this),Cn(this)}}}catch{}finally{}};function hg(s){if(!Ua(s))return s.g.la();const l=ih(s.g);if(l==="")return"";let h="";const u=l.length,w=Ye(s.g)==4;if(!s.h.i){if(typeof TextDecoder>"u")return dt(s),Cn(s),"";s.h.i=new a.TextDecoder}for(let T=0;T<u;T++)s.h.h=!0,h+=s.h.i.decode(l[T],{stream:!(w&&T==u-1)});return l.length=0,s.h.g+=h,s.C=0,s.h.g}function Ua(s){return s.g?s.v=="GET"&&s.M!=2&&s.j.Aa:!1}function cg(s,l){var h=s.C,u=l.indexOf(`
`,h);return u==-1?ir:(h=Number(l.substring(h,u)),isNaN(h)?La:(u+=1,u+h>l.length?ir:(l=l.slice(u,u+h),s.C=u+h,l)))}qe.prototype.cancel=function(){this.K=!0,dt(this)};function pi(s){s.T=Date.now()+s.H,Va(s,s.H)}function Va(s,l){if(s.D!=null)throw Error("WatchDog timer not null");s.D=vn(f(s.aa,s),l)}function rr(s){s.D&&(a.clearTimeout(s.D),s.D=null)}qe.prototype.aa=function(){this.D=null;const s=Date.now();s-this.T>=0?(rg(this.i,this.B),this.M!=2&&(yn(),le(17)),dt(this),this.m=2,Cn(this)):Va(this,this.T-s)};function Cn(s){s.j.I==0||s.K||ch(s.j,s)}function dt(s){rr(s);var l=s.O;l&&typeof l.dispose=="function"&&l.dispose(),s.O=null,Na(s.V),s.g&&(l=s.g,s.g=null,l.abort(),l.dispose())}function or(s,l){try{var h=s.j;if(h.I!=0&&(h.g==s||lr(h.h,s))){if(!s.L&&lr(h.h,s)&&h.I==3){try{var u=h.Ba.g.parse(l)}catch{u=null}if(Array.isArray(u)&&u.length==3){var w=u;if(w[0]==0){e:if(!h.v){if(h.g)if(h.g.F+3e3<s.F)Ei(h),yi(h);else break e;fr(h),le(18)}}else h.xa=w[1],0<h.xa-h.K&&w[2]<37500&&h.F&&h.A==0&&!h.C&&(h.C=vn(f(h.Va,h),6e3));Wa(h.h)<=1&&h.ta&&(h.ta=void 0)}else pt(h,11)}else if((s.L||h.g==s)&&Ei(h),!g(l))for(w=h.Ba.g.parse(l),l=0;l<w.length;l++){let H=w[l];const te=H[0];if(!(te<=h.K))if(h.K=te,H=H[1],h.I==2)if(H[0]=="c"){h.M=H[1],h.ba=H[2];const Ne=H[3];Ne!=null&&(h.ka=Ne,h.j.info("VER="+h.ka));const gt=H[4];gt!=null&&(h.za=gt,h.j.info("SVER="+h.za));const Ke=H[5];Ke!=null&&typeof Ke=="number"&&Ke>0&&(u=1.5*Ke,h.O=u,h.j.info("backChannelRequestTimeoutMs_="+u)),u=h;const Xe=s.g;if(Xe){const wi=Xe.g?Xe.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(wi){var T=u.h;T.g||wi.indexOf("spdy")==-1&&wi.indexOf("quic")==-1&&wi.indexOf("h2")==-1||(T.j=T.l,T.g=new Set,T.h&&(ar(T,T.h),T.h=null))}if(u.G){const gr=Xe.g?Xe.g.getResponseHeader("X-HTTP-Session-Id"):null;gr&&(u.wa=gr,$(u.J,u.G,gr))}}h.I=3,h.l&&h.l.ra(),h.aa&&(h.T=Date.now()-s.F,h.j.info("Handshake RTT: "+h.T+"ms")),u=h;var b=s;if(u.na=fh(u,u.L?u.ba:null,u.W),b.L){Ha(u.h,b);var k=b,Q=u.O;Q&&(k.H=Q),k.D&&(rr(k),pi(k)),u.g=b}else ah(u);h.i.length>0&&vi(h)}else H[0]!="stop"&&H[0]!="close"||pt(h,7);else h.I==3&&(H[0]=="stop"||H[0]=="close"?H[0]=="stop"?pt(h,7):dr(h):H[0]!="noop"&&h.l&&h.l.qa(H),h.A=0)}}yn(4)}catch{}}var ug=class{constructor(s,l){this.g=s,this.map=l}};function Ba(s){this.l=s||10,a.PerformanceNavigationTiming?(s=a.performance.getEntriesByType("navigation"),s=s.length>0&&(s[0].nextHopProtocol=="hq"||s[0].nextHopProtocol=="h2")):s=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=s?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function ja(s){return s.h?!0:s.g?s.g.size>=s.j:!1}function Wa(s){return s.h?1:s.g?s.g.size:0}function lr(s,l){return s.h?s.h==l:s.g?s.g.has(l):!1}function ar(s,l){s.g?s.g.add(l):s.h=l}function Ha(s,l){s.h&&s.h==l?s.h=null:s.g&&s.g.has(l)&&s.g.delete(l)}Ba.prototype.cancel=function(){if(this.i=Ga(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const s of this.g.values())s.cancel();this.g.clear()}};function Ga(s){if(s.h!=null)return s.i.concat(s.h.G);if(s.g!=null&&s.g.size!==0){let l=s.i;for(const h of s.g.values())l=l.concat(h.G);return l}return N(s.i)}var qa=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function dg(s,l){if(s){s=s.split("&");for(let h=0;h<s.length;h++){const u=s[h].indexOf("=");let w,T=null;u>=0?(w=s[h].substring(0,u),T=s[h].substring(u+1)):w=s[h],l(w,T?decodeURIComponent(T.replace(/\+/g," ")):"")}}}function $e(s){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let l;s instanceof $e?(this.l=s.l,In(this,s.j),this.o=s.o,this.g=s.g,Tn(this,s.u),this.h=s.h,hr(this,Qa(s.i)),this.m=s.m):s&&(l=String(s).match(qa))?(this.l=!1,In(this,l[1]||"",!0),this.o=Sn(l[2]||""),this.g=Sn(l[3]||"",!0),Tn(this,l[4]),this.h=Sn(l[5]||"",!0),hr(this,l[6]||"",!0),this.m=Sn(l[7]||"")):(this.l=!1,this.i=new bn(null,this.l))}$e.prototype.toString=function(){const s=[];var l=this.j;l&&s.push(An(l,$a,!0),":");var h=this.g;return(h||l=="file")&&(s.push("//"),(l=this.o)&&s.push(An(l,$a,!0),"@"),s.push(wn(h).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.u,h!=null&&s.push(":",String(h))),(h=this.h)&&(this.g&&h.charAt(0)!="/"&&s.push("/"),s.push(An(h,h.charAt(0)=="/"?gg:pg,!0))),(h=this.i.toString())&&s.push("?",h),(h=this.m)&&s.push("#",An(h,mg)),s.join("")},$e.prototype.resolve=function(s){const l=be(this);let h=!!s.j;h?In(l,s.j):h=!!s.o,h?l.o=s.o:h=!!s.g,h?l.g=s.g:h=s.u!=null;var u=s.h;if(h)Tn(l,s.u);else if(h=!!s.h){if(u.charAt(0)!="/")if(this.g&&!this.h)u="/"+u;else{var w=l.h.lastIndexOf("/");w!=-1&&(u=l.h.slice(0,w+1)+u)}if(w=u,w==".."||w==".")u="";else if(w.indexOf("./")!=-1||w.indexOf("/.")!=-1){u=w.lastIndexOf("/",0)==0,w=w.split("/");const T=[];for(let b=0;b<w.length;){const k=w[b++];k=="."?u&&b==w.length&&T.push(""):k==".."?((T.length>1||T.length==1&&T[0]!="")&&T.pop(),u&&b==w.length&&T.push("")):(T.push(k),u=!0)}u=T.join("/")}else u=w}return h?l.h=u:h=s.i.toString()!=="",h?hr(l,Qa(s.i)):h=!!s.m,h&&(l.m=s.m),l};function be(s){return new $e(s)}function In(s,l,h){s.j=h?Sn(l,!0):l,s.j&&(s.j=s.j.replace(/:$/,""))}function Tn(s,l){if(l){if(l=Number(l),isNaN(l)||l<0)throw Error("Bad port number "+l);s.u=l}else s.u=null}function hr(s,l,h){l instanceof bn?(s.i=l,yg(s.i,s.l)):(h||(l=An(l,_g)),s.i=new bn(l,s.l))}function $(s,l,h){s.i.set(l,h)}function gi(s){return $(s,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),s}function Sn(s,l){return s?l?decodeURI(s.replace(/%25/g,"%2525")):decodeURIComponent(s):""}function An(s,l,h){return typeof s=="string"?(s=encodeURI(s).replace(l,fg),h&&(s=s.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),s):null}function fg(s){return s=s.charCodeAt(0),"%"+(s>>4&15).toString(16)+(s&15).toString(16)}var $a=/[#\/\?@]/g,pg=/[#\?:]/g,gg=/[#\?]/g,_g=/[#\?@]/g,mg=/#/g;function bn(s,l){this.h=this.g=null,this.i=s||null,this.j=!!l}function ft(s){s.g||(s.g=new Map,s.h=0,s.i&&dg(s.i,function(l,h){s.add(decodeURIComponent(l.replace(/\+/g," ")),h)}))}n=bn.prototype,n.add=function(s,l){ft(this),this.i=null,s=Mt(this,s);let h=this.g.get(s);return h||this.g.set(s,h=[]),h.push(l),this.h+=1,this};function za(s,l){ft(s),l=Mt(s,l),s.g.has(l)&&(s.i=null,s.h-=s.g.get(l).length,s.g.delete(l))}function Ya(s,l){return ft(s),l=Mt(s,l),s.g.has(l)}n.forEach=function(s,l){ft(this),this.g.forEach(function(h,u){h.forEach(function(w){s.call(l,w,u,this)},this)},this)};function Ka(s,l){ft(s);let h=[];if(typeof l=="string")Ya(s,l)&&(h=h.concat(s.g.get(Mt(s,l))));else for(s=Array.from(s.g.values()),l=0;l<s.length;l++)h=h.concat(s[l]);return h}n.set=function(s,l){return ft(this),this.i=null,s=Mt(this,s),Ya(this,s)&&(this.h-=this.g.get(s).length),this.g.set(s,[l]),this.h+=1,this},n.get=function(s,l){return s?(s=Ka(this,s),s.length>0?String(s[0]):l):l};function Xa(s,l,h){za(s,l),h.length>0&&(s.i=null,s.g.set(Mt(s,l),N(h)),s.h+=h.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const s=[],l=Array.from(this.g.keys());for(let u=0;u<l.length;u++){var h=l[u];const w=wn(h);h=Ka(this,h);for(let T=0;T<h.length;T++){let b=w;h[T]!==""&&(b+="="+wn(h[T])),s.push(b)}}return this.i=s.join("&")};function Qa(s){const l=new bn;return l.i=s.i,s.g&&(l.g=new Map(s.g),l.h=s.h),l}function Mt(s,l){return l=String(l),s.j&&(l=l.toLowerCase()),l}function yg(s,l){l&&!s.j&&(ft(s),s.i=null,s.g.forEach(function(h,u){const w=u.toLowerCase();u!=w&&(za(this,u),Xa(this,w,h))},s)),s.j=l}function vg(s,l){const h=new En;if(a.Image){const u=new Image;u.onload=I(ze,h,"TestLoadImage: loaded",!0,l,u),u.onerror=I(ze,h,"TestLoadImage: error",!1,l,u),u.onabort=I(ze,h,"TestLoadImage: abort",!1,l,u),u.ontimeout=I(ze,h,"TestLoadImage: timeout",!1,l,u),a.setTimeout(function(){u.ontimeout&&u.ontimeout()},1e4),u.src=s}else l(!1)}function Eg(s,l){const h=new En,u=new AbortController,w=setTimeout(()=>{u.abort(),ze(h,"TestPingServer: timeout",!1,l)},1e4);fetch(s,{signal:u.signal}).then(T=>{clearTimeout(w),T.ok?ze(h,"TestPingServer: ok",!0,l):ze(h,"TestPingServer: server error",!1,l)}).catch(()=>{clearTimeout(w),ze(h,"TestPingServer: error",!1,l)})}function ze(s,l,h,u,w){try{w&&(w.onload=null,w.onerror=null,w.onabort=null,w.ontimeout=null),u(h)}catch{}}function wg(){this.g=new tg}function cr(s){this.i=s.Sb||null,this.h=s.ab||!1}y(cr,Ra),cr.prototype.g=function(){return new _i(this.i,this.h)};function _i(s,l){se.call(this),this.H=s,this.o=l,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}y(_i,se),n=_i.prototype,n.open=function(s,l){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=s,this.D=l,this.readyState=1,Rn(this)},n.send=function(s){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const l={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};s&&(l.body=s),(this.H||a).fetch(new Request(this.D,l)).then(this.Pa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Nn(this)),this.readyState=0},n.Pa=function(s){if(this.g&&(this.l=s,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=s.headers,this.readyState=2,Rn(this)),this.g&&(this.readyState=3,Rn(this),this.g)))if(this.responseType==="arraybuffer")s.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof a.ReadableStream<"u"&&"body"in s){if(this.j=s.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Ja(this)}else s.text().then(this.Oa.bind(this),this.ga.bind(this))};function Ja(s){s.j.read().then(s.Ma.bind(s)).catch(s.ga.bind(s))}n.Ma=function(s){if(this.g){if(this.o&&s.value)this.response.push(s.value);else if(!this.o){var l=s.value?s.value:new Uint8Array(0);(l=this.B.decode(l,{stream:!s.done}))&&(this.response=this.responseText+=l)}s.done?Nn(this):Rn(this),this.readyState==3&&Ja(this)}},n.Oa=function(s){this.g&&(this.response=this.responseText=s,Nn(this))},n.Na=function(s){this.g&&(this.response=s,Nn(this))},n.ga=function(){this.g&&Nn(this)};function Nn(s){s.readyState=4,s.l=null,s.j=null,s.B=null,Rn(s)}n.setRequestHeader=function(s,l){this.A.append(s,l)},n.getResponseHeader=function(s){return this.h&&this.h.get(s.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const s=[],l=this.h.entries();for(var h=l.next();!h.done;)h=h.value,s.push(h[0]+": "+h[1]),h=l.next();return s.join(`\r
`)};function Rn(s){s.onreadystatechange&&s.onreadystatechange.call(s)}Object.defineProperty(_i.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(s){this.m=s?"include":"same-origin"}});function Za(s){let l="";return ui(s,function(h,u){l+=u,l+=":",l+=h,l+=`\r
`}),l}function ur(s,l,h){e:{for(u in h){var u=!1;break e}u=!0}u||(h=Za(h),typeof s=="string"?h!=null&&wn(h):$(s,l,h))}function Y(s){se.call(this),this.headers=new Map,this.L=s||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}y(Y,se);var Cg=/^https?$/i,Ig=["POST","PUT"];n=Y.prototype,n.Fa=function(s){this.H=s},n.ea=function(s,l,h,u){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+s);l=l?l.toUpperCase():"GET",this.D=s,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():xa.g(),this.g.onreadystatechange=S(f(this.Ca,this));try{this.B=!0,this.g.open(l,String(s),!0),this.B=!1}catch(T){eh(this,T);return}if(s=h||"",h=new Map(this.headers),u)if(Object.getPrototypeOf(u)===Object.prototype)for(var w in u)h.set(w,u[w]);else if(typeof u.keys=="function"&&typeof u.get=="function")for(const T of u.keys())h.set(T,u.get(T));else throw Error("Unknown input type for opt_headers: "+String(u));u=Array.from(h.keys()).find(T=>T.toLowerCase()=="content-type"),w=a.FormData&&s instanceof a.FormData,!(Array.prototype.indexOf.call(Ig,l,void 0)>=0)||u||w||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[T,b]of h)this.g.setRequestHeader(T,b);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(s),this.v=!1}catch(T){eh(this,T)}};function eh(s,l){s.h=!1,s.g&&(s.j=!0,s.g.abort(),s.j=!1),s.l=l,s.o=5,th(s),mi(s)}function th(s){s.A||(s.A=!0,oe(s,"complete"),oe(s,"error"))}n.abort=function(s){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=s||7,oe(this,"complete"),oe(this,"abort"),mi(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),mi(this,!0)),Y.Z.N.call(this)},n.Ca=function(){this.u||(this.B||this.v||this.j?nh(this):this.Xa())},n.Xa=function(){nh(this)};function nh(s){if(s.h&&typeof o<"u"){if(s.v&&Ye(s)==4)setTimeout(s.Ca.bind(s),0);else if(oe(s,"readystatechange"),Ye(s)==4){s.h=!1;try{const T=s.ca();e:switch(T){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var l=!0;break e;default:l=!1}var h;if(!(h=l)){var u;if(u=T===0){let b=String(s.D).match(qa)[1]||null;!b&&a.self&&a.self.location&&(b=a.self.location.protocol.slice(0,-1)),u=!Cg.test(b?b.toLowerCase():"")}h=u}if(h)oe(s,"complete"),oe(s,"success");else{s.o=6;try{var w=Ye(s)>2?s.g.statusText:""}catch{w=""}s.l=w+" ["+s.ca()+"]",th(s)}}finally{mi(s)}}}}function mi(s,l){if(s.g){s.m&&(clearTimeout(s.m),s.m=null);const h=s.g;s.g=null,l||oe(s,"ready");try{h.onreadystatechange=null}catch{}}}n.isActive=function(){return!!this.g};function Ye(s){return s.g?s.g.readyState:0}n.ca=function(){try{return Ye(this)>2?this.g.status:-1}catch{return-1}},n.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.La=function(s){if(this.g){var l=this.g.responseText;return s&&l.indexOf(s)==0&&(l=l.substring(s.length)),eg(l)}};function ih(s){try{if(!s.g)return null;if("response"in s.g)return s.g.response;switch(s.F){case"":case"text":return s.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in s.g)return s.g.mozResponseArrayBuffer}return null}catch{return null}}function Tg(s){const l={};s=(s.g&&Ye(s)>=2&&s.g.getAllResponseHeaders()||"").split(`\r
`);for(let u=0;u<s.length;u++){if(g(s[u]))continue;var h=ag(s[u]);const w=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const T=l[w]||[];l[w]=T,T.push(h)}Yp(l,function(u){return u.join(", ")})}n.ya=function(){return this.o},n.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Dn(s,l,h){return h&&h.internalChannelParams&&h.internalChannelParams[s]||l}function sh(s){this.za=0,this.i=[],this.j=new En,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Dn("failFast",!1,s),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Dn("baseRetryDelayMs",5e3,s),this.Za=Dn("retryDelaySeedMs",1e4,s),this.Ta=Dn("forwardChannelMaxRetries",2,s),this.va=Dn("forwardChannelRequestTimeoutMs",2e4,s),this.ma=s&&s.xmlHttpFactory||void 0,this.Ua=s&&s.Rb||void 0,this.Aa=s&&s.useFetchStreams||!1,this.O=void 0,this.L=s&&s.supportsCrossDomainXhr||!1,this.M="",this.h=new Ba(s&&s.concurrentRequestLimit),this.Ba=new wg,this.S=s&&s.fastHandshake||!1,this.R=s&&s.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=s&&s.Pb||!1,s&&s.ua&&this.j.ua(),s&&s.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&s&&s.detectBufferingProxy||!1,this.ia=void 0,s&&s.longPollingTimeout&&s.longPollingTimeout>0&&(this.ia=s.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}n=sh.prototype,n.ka=8,n.I=1,n.connect=function(s,l,h,u){le(0),this.W=s,this.H=l||{},h&&u!==void 0&&(this.H.OSID=h,this.H.OAID=u),this.F=this.X,this.J=fh(this,null,this.W),vi(this)};function dr(s){if(rh(s),s.I==3){var l=s.V++,h=be(s.J);if($(h,"SID",s.M),$(h,"RID",l),$(h,"TYPE","terminate"),Pn(s,h),l=new qe(s,s.j,l),l.M=2,l.A=gi(be(h)),h=!1,a.navigator&&a.navigator.sendBeacon)try{h=a.navigator.sendBeacon(l.A.toString(),"")}catch{}!h&&a.Image&&(new Image().src=l.A,h=!0),h||(l.g=ph(l.j,null),l.g.ea(l.A)),l.F=Date.now(),pi(l)}dh(s)}function yi(s){s.g&&(pr(s),s.g.cancel(),s.g=null)}function rh(s){yi(s),s.v&&(a.clearTimeout(s.v),s.v=null),Ei(s),s.h.cancel(),s.m&&(typeof s.m=="number"&&a.clearTimeout(s.m),s.m=null)}function vi(s){if(!ja(s.h)&&!s.m){s.m=!0;var l=s.Ea;Ge||p(),ge||(Ge(),ge=!0),v.add(l,s),s.D=0}}function Sg(s,l){return Wa(s.h)>=s.h.j-(s.m?1:0)?!1:s.m?(s.i=l.G.concat(s.i),!0):s.I==1||s.I==2||s.D>=(s.Sa?0:s.Ta)?!1:(s.m=vn(f(s.Ea,s,l),uh(s,s.D)),s.D++,!0)}n.Ea=function(s){if(this.m)if(this.m=null,this.I==1){if(!s){this.V=Math.floor(Math.random()*1e5),s=this.V++;const w=new qe(this,this.j,s);let T=this.o;if(this.U&&(T?(T=va(T),wa(T,this.U)):T=this.U),this.u!==null||this.R||(w.J=T,T=null),this.S)e:{for(var l=0,h=0;h<this.i.length;h++){t:{var u=this.i[h];if("__data__"in u.map&&(u=u.map.__data__,typeof u=="string")){u=u.length;break t}u=void 0}if(u===void 0)break;if(l+=u,l>4096){l=h;break e}if(l===4096||h===this.i.length-1){l=h+1;break e}}l=1e3}else l=1e3;l=lh(this,w,l),h=be(this.J),$(h,"RID",s),$(h,"CVER",22),this.G&&$(h,"X-HTTP-Session-Id",this.G),Pn(this,h),T&&(this.R?l="headers="+wn(Za(T))+"&"+l:this.u&&ur(h,this.u,T)),ar(this.h,w),this.Ra&&$(h,"TYPE","init"),this.S?($(h,"$req",l),$(h,"SID","null"),w.U=!0,sr(w,h,null)):sr(w,h,l),this.I=2}}else this.I==3&&(s?oh(this,s):this.i.length==0||ja(this.h)||oh(this))};function oh(s,l){var h;l?h=l.l:h=s.V++;const u=be(s.J);$(u,"SID",s.M),$(u,"RID",h),$(u,"AID",s.K),Pn(s,u),s.u&&s.o&&ur(u,s.u,s.o),h=new qe(s,s.j,h,s.D+1),s.u===null&&(h.J=s.o),l&&(s.i=l.G.concat(s.i)),l=lh(s,h,1e3),h.H=Math.round(s.va*.5)+Math.round(s.va*.5*Math.random()),ar(s.h,h),sr(h,u,l)}function Pn(s,l){s.H&&ui(s.H,function(h,u){$(l,u,h)}),s.l&&ui({},function(h,u){$(l,u,h)})}function lh(s,l,h){h=Math.min(s.i.length,h);const u=s.l?f(s.l.Ka,s.l,s):null;e:{var w=s.i;let k=-1;for(;;){const Q=["count="+h];k==-1?h>0?(k=w[0].g,Q.push("ofs="+k)):k=0:Q.push("ofs="+k);let H=!0;for(let te=0;te<h;te++){var T=w[te].g;const Ne=w[te].map;if(T-=k,T<0)k=Math.max(0,w[te].g-100),H=!1;else try{T="req"+T+"_"||"";try{var b=Ne instanceof Map?Ne:Object.entries(Ne);for(const[gt,Ke]of b){let Xe=Ke;c(Ke)&&(Xe=Qs(Ke)),Q.push(T+gt+"="+encodeURIComponent(Xe))}}catch(gt){throw Q.push(T+"type="+encodeURIComponent("_badmap")),gt}}catch{u&&u(Ne)}}if(H){b=Q.join("&");break e}}b=void 0}return s=s.i.splice(0,h),l.G=s,b}function ah(s){if(!s.g&&!s.v){s.Y=1;var l=s.Da;Ge||p(),ge||(Ge(),ge=!0),v.add(l,s),s.A=0}}function fr(s){return s.g||s.v||s.A>=3?!1:(s.Y++,s.v=vn(f(s.Da,s),uh(s,s.A)),s.A++,!0)}n.Da=function(){if(this.v=null,hh(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var s=4*this.T;this.j.info("BP detection timer enabled: "+s),this.B=vn(f(this.Wa,this),s)}},n.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,le(10),yi(this),hh(this))};function pr(s){s.B!=null&&(a.clearTimeout(s.B),s.B=null)}function hh(s){s.g=new qe(s,s.j,"rpc",s.Y),s.u===null&&(s.g.J=s.o),s.g.P=0;var l=be(s.na);$(l,"RID","rpc"),$(l,"SID",s.M),$(l,"AID",s.K),$(l,"CI",s.F?"0":"1"),!s.F&&s.ia&&$(l,"TO",s.ia),$(l,"TYPE","xmlhttp"),Pn(s,l),s.u&&s.o&&ur(l,s.u,s.o),s.O&&(s.g.H=s.O);var h=s.g;s=s.ba,h.M=1,h.A=gi(be(l)),h.u=null,h.R=!0,Fa(h,s)}n.Va=function(){this.C!=null&&(this.C=null,yi(this),fr(this),le(19))};function Ei(s){s.C!=null&&(a.clearTimeout(s.C),s.C=null)}function ch(s,l){var h=null;if(s.g==l){Ei(s),pr(s),s.g=null;var u=2}else if(lr(s.h,l))h=l.G,Ha(s.h,l),u=1;else return;if(s.I!=0){if(l.o)if(u==1){h=l.u?l.u.length:0,l=Date.now()-l.F;var w=s.D;u=er(),oe(u,new Oa(u,h)),vi(s)}else ah(s);else if(w=l.m,w==3||w==0&&l.X>0||!(u==1&&Sg(s,l)||u==2&&fr(s)))switch(h&&h.length>0&&(l=s.h,l.i=l.i.concat(h)),w){case 1:pt(s,5);break;case 4:pt(s,10);break;case 3:pt(s,6);break;default:pt(s,2)}}}function uh(s,l){let h=s.Qa+Math.floor(Math.random()*s.Za);return s.isActive()||(h*=2),h*l}function pt(s,l){if(s.j.info("Error code "+l),l==2){var h=f(s.bb,s),u=s.Ua;const w=!u;u=new $e(u||"//www.google.com/images/cleardot.gif"),a.location&&a.location.protocol=="http"||In(u,"https"),gi(u),w?vg(u.toString(),h):Eg(u.toString(),h)}else le(2);s.I=0,s.l&&s.l.pa(l),dh(s),rh(s)}n.bb=function(s){s?(this.j.info("Successfully pinged google.com"),le(2)):(this.j.info("Failed to ping google.com"),le(1))};function dh(s){if(s.I=0,s.ja=[],s.l){const l=Ga(s.h);(l.length!=0||s.i.length!=0)&&(R(s.ja,l),R(s.ja,s.i),s.h.i.length=0,N(s.i),s.i.length=0),s.l.oa()}}function fh(s,l,h){var u=h instanceof $e?be(h):new $e(h);if(u.g!="")l&&(u.g=l+"."+u.g),Tn(u,u.u);else{var w=a.location;u=w.protocol,l=l?l+"."+w.hostname:w.hostname,w=+w.port;const T=new $e(null);u&&In(T,u),l&&(T.g=l),w&&Tn(T,w),h&&(T.h=h),u=T}return h=s.G,l=s.wa,h&&l&&$(u,h,l),$(u,"VER",s.ka),Pn(s,u),u}function ph(s,l,h){if(l&&!s.L)throw Error("Can't create secondary domain capable XhrIo object.");return l=s.Aa&&!s.ma?new Y(new cr({ab:h})):new Y(s.ma),l.Fa(s.L),l}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function gh(){}n=gh.prototype,n.ra=function(){},n.qa=function(){},n.pa=function(){},n.oa=function(){},n.isActive=function(){return!0},n.Ka=function(){};function _e(s,l){se.call(this),this.g=new sh(l),this.l=s,this.h=l&&l.messageUrlParams||null,s=l&&l.messageHeaders||null,l&&l.clientProtocolHeaderRequired&&(s?s["X-Client-Protocol"]="webchannel":s={"X-Client-Protocol":"webchannel"}),this.g.o=s,s=l&&l.initMessageHeaders||null,l&&l.messageContentType&&(s?s["X-WebChannel-Content-Type"]=l.messageContentType:s={"X-WebChannel-Content-Type":l.messageContentType}),l&&l.sa&&(s?s["X-WebChannel-Client-Profile"]=l.sa:s={"X-WebChannel-Client-Profile":l.sa}),this.g.U=s,(s=l&&l.Qb)&&!g(s)&&(this.g.u=s),this.A=l&&l.supportsCrossDomainXhr||!1,this.v=l&&l.sendRawJson||!1,(l=l&&l.httpSessionIdParam)&&!g(l)&&(this.g.G=l,s=this.h,s!==null&&l in s&&(s=this.h,l in s&&delete s[l])),this.j=new Lt(this)}y(_e,se),_e.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},_e.prototype.close=function(){dr(this.g)},_e.prototype.o=function(s){var l=this.g;if(typeof s=="string"){var h={};h.__data__=s,s=h}else this.v&&(h={},h.__data__=Qs(s),s=h);l.i.push(new ug(l.Ya++,s)),l.I==3&&vi(l)},_e.prototype.N=function(){this.g.l=null,delete this.j,dr(this.g),delete this.g,_e.Z.N.call(this)};function _h(s){Js.call(this),s.__headers__&&(this.headers=s.__headers__,this.statusCode=s.__status__,delete s.__headers__,delete s.__status__);var l=s.__sm__;if(l){e:{for(const h in l){s=h;break e}s=void 0}(this.i=s)&&(s=this.i,l=l!==null&&s in l?l[s]:void 0),this.data=l}else this.data=s}y(_h,Js);function mh(){Zs.call(this),this.status=1}y(mh,Zs);function Lt(s){this.g=s}y(Lt,gh),Lt.prototype.ra=function(){oe(this.g,"a")},Lt.prototype.qa=function(s){oe(this.g,new _h(s))},Lt.prototype.pa=function(s){oe(this.g,new mh)},Lt.prototype.oa=function(){oe(this.g,"b")},_e.prototype.send=_e.prototype.o,_e.prototype.open=_e.prototype.m,_e.prototype.close=_e.prototype.close,tr.NO_ERROR=0,tr.TIMEOUT=8,tr.HTTP_ERROR=6,lg.COMPLETE="complete",ng.EventType=mn,mn.OPEN="a",mn.CLOSE="b",mn.ERROR="c",mn.MESSAGE="d",se.prototype.listen=se.prototype.J,Y.prototype.listenOnce=Y.prototype.K,Y.prototype.getLastError=Y.prototype.Ha,Y.prototype.getLastErrorCode=Y.prototype.ya,Y.prototype.getStatus=Y.prototype.ca,Y.prototype.getResponseJson=Y.prototype.La,Y.prototype.getResponseText=Y.prototype.la,Y.prototype.send=Y.prototype.ea,Y.prototype.setWithCredentials=Y.prototype.Fa}).apply(typeof ri<"u"?ri:typeof self<"u"?self:typeof window<"u"?window:{});/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class re{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}re.UNAUTHENTICATED=new re(null),re.GOOGLE_CREDENTIALS=new re("google-credentials-uid"),re.FIRST_PARTY=new re("first-party-uid"),re.MOCK_USER=new re("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let cn="12.11.0";function hp(n){cn=n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pt=new Ai("@firebase/firestore");function we(n,...e){if(Pt.logLevel<=j.DEBUG){const t=e.map(Os);Pt.debug(`Firestore (${cn}): ${n}`,...t)}}function zl(n,...e){if(Pt.logLevel<=j.ERROR){const t=e.map(Os);Pt.error(`Firestore (${cn}): ${n}`,...t)}}function cp(n,...e){if(Pt.logLevel<=j.WARN){const t=e.map(Os);Pt.warn(`Firestore (${cn}): ${n}`,...t)}}function Os(n){if(typeof n=="string")return n;try{return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function un(n,e,t){let i="Unexpected state";typeof e=="string"?i=e:t=e,Yl(n,i,t)}function Yl(n,e,t){let i=`FIRESTORE (${cn}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{i+=" CONTEXT: "+JSON.stringify(t)}catch{i+=" CONTEXT: "+t}throw zl(i),new Error(i)}function dn(n,e,t,i){let r="Unexpected state";typeof t=="string"?r=t:i=t,n||Yl(e,r,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const F={CANCELLED:"cancelled",INVALID_ARGUMENT:"invalid-argument",FAILED_PRECONDITION:"failed-precondition"};class U extends mt{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fn{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kl{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class up{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(re.UNAUTHENTICATED)))}shutdown(){}}class dp{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class fp{constructor(e){this.t=e,this.currentUser=re.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){dn(this.o===void 0,42304);let i=this.i;const r=d=>this.i!==i?(i=this.i,t(d)):Promise.resolve();let o=new fn;this.o=()=>{this.i++,this.currentUser=this.u(),o.resolve(),o=new fn,e.enqueueRetryable((()=>r(this.currentUser)))};const a=()=>{const d=o;e.enqueueRetryable((async()=>{await d.promise,await r(this.currentUser)}))},c=d=>{we("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=d,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit((d=>c(d))),setTimeout((()=>{if(!this.auth){const d=this.t.getImmediate({optional:!0});d?c(d):(we("FirebaseAuthCredentialsProvider","Auth not yet detected"),o.resolve(),o=new fn)}}),0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((i=>this.i!==e?(we("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):i?(dn(typeof i.accessToken=="string",31837,{l:i}),new Kl(i.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return dn(e===null||typeof e=="string",2055,{h:e}),new re(e)}}class pp{constructor(e,t,i){this.P=e,this.T=t,this.I=i,this.type="FirstParty",this.user=re.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class gp{constructor(e,t,i){this.P=e,this.T=t,this.I=i}getToken(){return Promise.resolve(new pp(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(re.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Xl{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class _p{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Br(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){dn(this.o===void 0,3512);const i=o=>{o.error!=null&&we("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${o.error.message}`);const a=o.token!==this.m;return this.m=o.token,we("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(o.token):Promise.resolve()};this.o=o=>{e.enqueueRetryable((()=>i(o)))};const r=o=>{we("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=o,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((o=>r(o))),setTimeout((()=>{if(!this.appCheck){const o=this.V.getImmediate({optional:!0});o?r(o):we("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Xl(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(dn(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Xl(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mp(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let i=0;i<n;i++)t[i]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yp{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let i="";for(;i.length<20;){const r=mp(40);for(let o=0;o<r.length;++o)i.length<20&&r[o]<t&&(i+=e.charAt(r[o]%62))}return i}}function We(n,e){return n<e?-1:n>e?1:0}function vp(n,e){const t=Math.min(n.length,e.length);for(let i=0;i<t;i++){const r=n.charAt(i),o=e.charAt(i);if(r!==o)return xs(r)===xs(o)?We(r,o):xs(r)?1:-1}return We(n.length,e.length)}const Ep=55296,wp=57343;function xs(n){const e=n.charCodeAt(0);return e>=Ep&&e<=wp}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ql="__name__";class Te{constructor(e,t,i){t===void 0?t=0:t>e.length&&un(637,{offset:t,range:e.length}),i===void 0?i=e.length-t:i>e.length-t&&un(1746,{length:i,range:e.length-t}),this.segments=e,this.offset=t,this.len=i}get length(){return this.len}isEqual(e){return Te.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Te?e.forEach((i=>{t.push(i)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,i=this.limit();t<i;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const i=Math.min(e.length,t.length);for(let r=0;r<i;r++){const o=Te.compareSegments(e.get(r),t.get(r));if(o!==0)return o}return We(e.length,t.length)}static compareSegments(e,t){const i=Te.isNumericId(e),r=Te.isNumericId(t);return i&&!r?-1:!i&&r?1:i&&r?Te.extractNumericId(e).compare(Te.extractNumericId(t)):vp(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return ks.fromString(e.substring(4,e.length-2))}}class Ce extends Te{construct(e,t,i){return new Ce(e,t,i)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const i of e){if(i.indexOf("//")>=0)throw new U(F.INVALID_ARGUMENT,`Invalid segment (${i}). Paths must not contain // in them.`);t.push(...i.split("/").filter((r=>r.length>0)))}return new Ce(t)}static emptyPath(){return new Ce([])}}const Cp=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ot extends Te{construct(e,t,i){return new ot(e,t,i)}static isValidIdentifier(e){return Cp.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ot.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Ql}static keyField(){return new ot([Ql])}static fromServerFormat(e){const t=[];let i="",r=0;const o=()=>{if(i.length===0)throw new U(F.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(i),i=""};let a=!1;for(;r<e.length;){const c=e[r];if(c==="\\"){if(r+1===e.length)throw new U(F.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const d=e[r+1];if(d!=="\\"&&d!=="."&&d!=="`")throw new U(F.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);i+=d,r+=2}else c==="`"?(a=!a,r++):c!=="."||a?(i+=c,r++):(o(),r++)}if(o(),a)throw new U(F.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new ot(t)}static emptyPath(){return new ot([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lt{constructor(e){this.path=e}static fromPath(e){return new lt(Ce.fromString(e))}static fromName(e){return new lt(Ce.fromString(e).popFirst(5))}static empty(){return new lt(Ce.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Ce.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Ce.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new lt(new Ce(e.slice()))}}function Ip(n,e,t,i){if(e===!0&&i===!0)throw new U(F.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function Tp(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Sp(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=(function(i){return i.constructor?i.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":un(12329,{type:typeof n})}function Ap(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new U(F.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Sp(n);throw new U(F.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function K(n,e){const t={typeString:n};return e&&(t.value=e),t}function pn(n,e){if(!Tp(n))throw new U(F.INVALID_ARGUMENT,"JSON must be an object");let t;for(const i in e)if(e[i]){const r=e[i].typeString,o="value"in e[i]?{value:e[i].value}:void 0;if(!(i in n)){t=`JSON missing required field: '${i}'`;break}const a=n[i];if(r&&typeof a!==r){t=`JSON field '${i}' must be a ${r}.`;break}if(o!==void 0&&a!==o.value){t=`Expected '${i}' field to equal '${o.value}'`;break}}if(t)throw new U(F.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jl=-62135596800,Zl=1e6;class Se{static now(){return Se.fromMillis(Date.now())}static fromDate(e){return Se.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),i=Math.floor((e-1e3*t)*Zl);return new Se(t,i)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new U(F.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new U(F.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Jl)throw new U(F.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new U(F.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Zl}_compareTo(e){return this.seconds===e.seconds?We(this.nanoseconds,e.nanoseconds):We(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Se._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(pn(e,Se._jsonSchema))return new Se(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Jl;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Se._jsonSchemaVersion="firestore/timestamp/1.0",Se._jsonSchema={type:K("string",Se._jsonSchemaVersion),seconds:K("number"),nanoseconds:K("number")};function bp(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Np extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class at{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(r){try{return atob(r)}catch(o){throw typeof DOMException<"u"&&o instanceof DOMException?new Np("Invalid base64 string: "+o):o}})(e);return new at(t)}static fromUint8Array(e){const t=(function(r){let o="";for(let a=0;a<r.length;++a)o+=String.fromCharCode(r[a]);return o})(e);return new at(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const i=new Uint8Array(t.length);for(let r=0;r<t.length;r++)i[r]=t.charCodeAt(r);return i})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return We(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}at.EMPTY_BYTE_STRING=new at("");const Ms="(default)";class oi{constructor(e,t){this.projectId=e,this.database=t||Ms}static empty(){return new oi("","")}get isDefaultDatabase(){return this.database===Ms}isEqual(e){return e instanceof oi&&e.projectId===this.projectId&&e.database===this.database}}function Rp(n,e){if(!Object.prototype.hasOwnProperty.apply(n.options,["projectId"]))throw new U(F.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new oi(n.options.projectId,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dp{constructor(e,t=null,i=[],r=[],o=null,a="F",c=null,d=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=i,this.filters=r,this.limit=o,this.limitType=a,this.startAt=c,this.endAt=d,this.Ee=null,this.Ie=null,this.Re=null,this.startAt,this.endAt}}function Pp(n){return new Dp(n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ea,V;(V=ea||(ea={}))[V.OK=0]="OK",V[V.CANCELLED=1]="CANCELLED",V[V.UNKNOWN=2]="UNKNOWN",V[V.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",V[V.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",V[V.NOT_FOUND=5]="NOT_FOUND",V[V.ALREADY_EXISTS=6]="ALREADY_EXISTS",V[V.PERMISSION_DENIED=7]="PERMISSION_DENIED",V[V.UNAUTHENTICATED=16]="UNAUTHENTICATED",V[V.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",V[V.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",V[V.ABORTED=10]="ABORTED",V[V.OUT_OF_RANGE=11]="OUT_OF_RANGE",V[V.UNIMPLEMENTED=12]="UNIMPLEMENTED",V[V.INTERNAL=13]="INTERNAL",V[V.UNAVAILABLE=14]="UNAVAILABLE",V[V.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new ks([4294967295,4294967295],0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kp=41943040;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Op=1048576;function Ls(){return typeof document<"u"?document:null}class xp{constructor(e,t,i=1e3,r=1.5,o=6e4){this.Ci=e,this.timerId=t,this.R_=i,this.A_=r,this.V_=o,this.d_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.d_=0}g_(){this.d_=this.V_}p_(e){this.cancel();const t=Math.floor(this.d_+this.y_()),i=Math.max(0,Date.now()-this.f_),r=Math.max(0,t-i);r>0&&we("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.d_} ms, delay with jitter: ${t} ms, last attempt: ${i} ms ago)`),this.m_=this.Ci.enqueueAfterDelay(this.timerId,r,(()=>(this.f_=Date.now(),e()))),this.d_*=this.A_,this.d_<this.R_&&(this.d_=this.R_),this.d_>this.V_&&(this.d_=this.V_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.d_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fs{constructor(e,t,i,r,o){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=i,this.op=r,this.removalCallback=o,this.deferred=new fn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((a=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,i,r,o){const a=Date.now()+i,c=new Fs(e,t,a,r,o);return c.start(i),c}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new U(F.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}var ta,na;(na=ta||(ta={})).Ma="default",na.Cache="cache";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mp(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lp="ComponentProvider",ia=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sa="firestore.googleapis.com",ra=!0;class oa{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new U(F.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=sa,this.ssl=ra}else this.host=e.host,this.ssl=e.ssl??ra;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=kp;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Op)throw new U(F.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Ip("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Mp(e.experimentalLongPollingOptions??{}),(function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new U(F.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new U(F.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new U(F.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(i,r){return i.timeoutSeconds===r.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class la{constructor(e,t,i,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=i,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new oa({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new U(F.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new U(F.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new oa(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(i){if(!i)return new up;switch(i.type){case"firstParty":return new gp(i.sessionIndex||"0",i.iamToken||null,i.authTokenFactory||null);case"provider":return i.client;default:throw new U(F.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const i=ia.get(t);i&&(we(Lp,"Removing Datastore"),ia.delete(t),i.terminate())})(this),Promise.resolve()}}function Fp(n,e,t,i={}){var f;n=Ap(n,la);const r=Si(e),o=n._getSettings(),a={...o,emulatorOptions:n._getEmulatorOptions()},c=`${e}:${t}`;r&&Pr(`https://${c}`),o.host!==sa&&o.host!==c&&cp("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const d={...o,host:c,ssl:r,emulatorOptions:i};if(!Ut(d,a)&&(n._setSettings(d),i.mockUserToken)){let I,y;if(typeof i.mockUserToken=="string")I=i.mockUserToken,y=re.MOCK_USER;else{I=Tr(i.mockUserToken,(f=n._app)==null?void 0:f.options.projectId);const S=i.mockUserToken.sub||i.mockUserToken.user_id;if(!S)throw new U(F.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");y=new re(S)}n._authCredentials=new dp(new Kl(I,y))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Us{constructor(e,t,i){this.converter=t,this._query=i,this.type="query",this.firestore=e}withConverter(e){return new Us(this.firestore,e,this._query)}}class Ae{constructor(e,t,i){this.converter=t,this._key=i,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Vs(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Ae(this.firestore,e,this._key)}toJSON(){return{type:Ae._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,i){if(pn(t,Ae._jsonSchema))return new Ae(e,i||null,new lt(Ce.fromString(t.referencePath)))}}Ae._jsonSchemaVersion="firestore/documentReference/1.0",Ae._jsonSchema={type:K("string",Ae._jsonSchemaVersion),referencePath:K("string")};class Vs extends Us{constructor(e,t,i){super(e,t,Pp(i)),this._path=i,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Ae(this.firestore,null,new lt(e))}withConverter(e){return new Vs(this.firestore,e,this._path)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const aa="AsyncQueue";class ha{constructor(e=Promise.resolve()){this.Yu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new xp(this,"async_queue_retry"),this._c=()=>{const i=Ls();i&&we(aa,"Visibility state changed to "+i.visibilityState),this.M_.w_()},this.ac=e;const t=Ls();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const t=Ls();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise((()=>{}));const t=new fn;return this.cc((()=>this.ec&&this.sc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Yu.push(e),this.lc())))}async lc(){if(this.Yu.length!==0){try{await this.Yu[0](),this.Yu.shift(),this.M_.reset()}catch(e){if(!bp(e))throw e;we(aa,"Operation failed with retryable error: "+e)}this.Yu.length>0&&this.M_.p_((()=>this.lc()))}}cc(e){const t=this.ac.then((()=>(this.rc=!0,e().catch((i=>{throw this.nc=i,this.rc=!1,zl("INTERNAL UNHANDLED ERROR: ",ca(i)),i})).then((i=>(this.rc=!1,i))))));return this.ac=t,t}enqueueAfterDelay(e,t,i){this.uc(),this.oc.indexOf(e)>-1&&(t=0);const r=Fs.createAndSchedule(this,e,t,i,(o=>this.hc(o)));return this.tc.push(r),r}uc(){this.nc&&un(47125,{Pc:ca(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ec(e){for(const t of this.tc)if(t.timerId===e)return!0;return!1}Ic(e){return this.Tc().then((()=>{this.tc.sort(((t,i)=>t.targetTimeMs-i.targetTimeMs));for(const t of this.tc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Tc()}))}Rc(e){this.oc.push(e)}hc(e){const t=this.tc.indexOf(e);this.tc.splice(t,1)}}function ca(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}class Up extends la{constructor(e,t,i,r){super(e,t,i,r),this.type="firestore",this._queue=new ha,this._persistenceKey=(r==null?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new ha(e),this._firestoreClient=void 0,await e}}}function Vp(n,e){const t=typeof n=="object"?n:Hr(),i=typeof n=="string"?n:Ms,r=Vr(t,"firestore").getImmediate({identifier:i});if(!r._initialized){const o=Cr("firestore");o&&Fp(r,...o)}return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe{constructor(e){this._byteString=e}static fromBase64String(e){try{return new xe(at.fromBase64String(e))}catch(t){throw new U(F.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new xe(at.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:xe._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(pn(e,xe._jsonSchema))return xe.fromBase64String(e.bytes)}}xe._jsonSchemaVersion="firestore/bytes/1.0",xe._jsonSchema={type:K("string",xe._jsonSchemaVersion),bytes:K("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ua{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new U(F.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ot(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ht{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new U(F.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new U(F.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return We(this._lat,e._lat)||We(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:ht._jsonSchemaVersion}}static fromJSON(e){if(pn(e,ht._jsonSchema))return new ht(e.latitude,e.longitude)}}ht._jsonSchemaVersion="firestore/geoPoint/1.0",ht._jsonSchema={type:K("string",ht._jsonSchemaVersion),latitude:K("number"),longitude:K("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ct{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(i,r){if(i.length!==r.length)return!1;for(let o=0;o<i.length;++o)if(i[o]!==r[o])return!1;return!0})(this._values,e._values)}toJSON(){return{type:ct._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(pn(e,ct._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new ct(e.vectorValues);throw new U(F.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}ct._jsonSchemaVersion="firestore/vectorValue/1.0",ct._jsonSchema={type:K("string",ct._jsonSchemaVersion),vectorValues:K("object")};function da(n,e,t){if((e=Vt(e))instanceof ua)return e._internalPath;if(typeof e=="string")return jp(n,e);throw Bs("Field path arguments must be of type string or ",n)}const Bp=new RegExp("[~\\*/\\[\\]]");function jp(n,e,t){if(e.search(Bp)>=0)throw Bs(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n);try{return new ua(...e.split("."))._internalPath}catch{throw Bs(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n)}}function Bs(n,e,t,i,r){let o=`Function ${e}() called with invalid data`;o+=". ";let a="";return new U(F.INVALID_ARGUMENT,o+n+a)}const fa="@firebase/firestore",pa="4.13.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ga{constructor(e,t,i,r,o){this._firestore=e,this._userDataWriter=t,this._key=i,this._document=r,this._converter=o}get id(){return this._key.path.lastSegment()}get ref(){return new Ae(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new Wp(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(da("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class Wp extends ga{data(){return super.data()}}class li{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class kt extends ga{constructor(e,t,i,r,o,a){super(e,t,i,r,a),this._firestore=e,this._firestoreImpl=e,this.metadata=o}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new ai(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const i=this._document.data.field(da("DocumentSnapshot.get",e));if(i!==null)return this._userDataWriter.convertValue(i,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new U(F.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=kt._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}kt._jsonSchemaVersion="firestore/documentSnapshot/1.0",kt._jsonSchema={type:K("string",kt._jsonSchemaVersion),bundleSource:K("string","DocumentSnapshot"),bundleName:K("string"),bundle:K("string")};class ai extends kt{data(e={}){return super.data(e)}}class gn{constructor(e,t,i,r){this._firestore=e,this._userDataWriter=t,this._snapshot=r,this.metadata=new li(r.hasPendingWrites,r.fromCache),this.query=i}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((i=>{e.call(t,new ai(this._firestore,this._userDataWriter,i.key,i,new li(this._snapshot.mutatedKeys.has(i.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new U(F.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(r,o){if(r._snapshot.oldDocs.isEmpty()){let a=0;return r._snapshot.docChanges.map((c=>{const d=new ai(r._firestore,r._userDataWriter,c.doc.key,c.doc,new li(r._snapshot.mutatedKeys.has(c.doc.key),r._snapshot.fromCache),r.query.converter);return c.doc,{type:"added",doc:d,oldIndex:-1,newIndex:a++}}))}{let a=r._snapshot.oldDocs;return r._snapshot.docChanges.filter((c=>o||c.type!==3)).map((c=>{const d=new ai(r._firestore,r._userDataWriter,c.doc.key,c.doc,new li(r._snapshot.mutatedKeys.has(c.doc.key),r._snapshot.fromCache),r.query.converter);let f=-1,I=-1;return c.type!==0&&(f=a.indexOf(c.doc.key),a=a.delete(c.doc.key)),c.type!==1&&(a=a.add(c.doc),I=a.indexOf(c.doc.key)),{type:Hp(c.type),doc:d,oldIndex:f,newIndex:I}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new U(F.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=gn._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=yp.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],i=[],r=[];return this.docs.forEach((o=>{o._document!==null&&(t.push(o._document),i.push(this._userDataWriter.convertObjectMap(o._document.data.value.mapValue.fields,"previous")),r.push(o.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function Hp(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return un(61501,{type:n})}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */gn._jsonSchemaVersion="firestore/querySnapshot/1.0",gn._jsonSchema={type:K("string",gn._jsonSchemaVersion),bundleSource:K("string","QuerySnapshot"),bundleName:K("string"),bundle:K("string")},(function(e,t=!0){hp(jr),Bt(new vt("firestore",((i,{instanceIdentifier:r,options:o})=>{const a=i.getProvider("app").getImmediate(),c=new Up(new fp(i.getProvider("auth-internal")),new _p(a,i.getProvider("app-check-internal")),Rp(a,r),a);return o={useFetchStreams:t,...o},c._setSettings(o),c}),"PUBLIC").setMultipleInstances(!0)),Fe(fa,pa,e),Fe(fa,pa,"esm2020")})();const js={apiKey:"AIzaSyBWUZqp8TrL6GEVv4wlhNMF485wlYXncl",authDomain:"supply-chain-project-29398.firebaseapp.com",databaseURL:"https://supply-chain-project-29398-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"supply-chain-project-29398",storageBucket:"supply-chain-project-29398.firebasestorage.app",messagingSenderId:"296070420717",appId:"1:296070420717:web:e34525a95647af6eb894e4"};(!js.apiKey||!js.projectId)&&console.warn("[firebase] Missing Firebase config. Set VITE_FIREBASE_* env vars. See .env.example for required variables.");const _a=Wr(js);Vp(_a);const Gp=sp(_a);function Ws(n){if(typeof n!="string"||!n.startsWith("@{"))return n;try{const t=n.slice(2,-1).split(";"),i={};for(const r of t){const o=r.indexOf("=");if(o!==-1){const a=r.slice(0,o).trim(),c=r.slice(o+1).trim();i[a]=c}}return i}catch{return n}}function qp(n,e){if(!e||!e.state)return null;const t=e.state,i=Ws(t.position),r=Ws(t.motion),o=Ws(t.operationalStatus),a=(i==null?void 0:i.lat)??null,c=(i==null?void 0:i.lon)??null,d=Number(a),f=Number(c);if(d==null||f==null||isNaN(d)||isNaN(f)||d<-90||d>90||f<-180||f>180)return null;const I=(t.vesselType||t.type||"").toLowerCase();let y="ship";return(I.includes("aircraft")||I.includes("plane")||I.includes("flight")||I.includes("passenger"))&&(y="aircraft"),{id:t.vesselId||n||"UNKNOWN",lat:d,lon:f,heading:Number((r==null?void 0:r.cogDegrees)??(r==null?void 0:r.headingDegrees)??0),speed:Number((r==null?void 0:r.sogKnots)??0),type:y,status:(o==null?void 0:o.status)||(o==null?void 0:o.navStatusLabel)||(typeof o=="string"?o:"UNKNOWN"),name:t.name||t.vesselId||"UNNAMED",source:t.source||"RTDB"}}let hi=null,ma=[],ya=[],Hs=!1;self.onmessage=n=>{const{type:e,payload:t}=n.data;if(e==="INIT"){console.log("[telemetryWorker] Initializing Firebase RTDB listener"),self.postMessage({type:"STATUS",payload:"CONNECTING"});try{const i=Yf(Gp,"vessels");hi=Xf(i,r=>{const o=r.val();if(!o){self.postMessage({type:"STATUS",payload:"CONNECTED"});return}const a=[],c=[],d=Object.entries(o);for(let f=0;f<d.length;f++){const[I,y]=d[f],S=qp(I,y);S&&(S.type==="aircraft"?c.push(S):a.push(S))}ma=a,ya=c,Hs=!0,self.postMessage({type:"STATUS",payload:"CONNECTED"})},r=>{console.error("[telemetryWorker] RTDB error:",r.message,r.code),self.postMessage({type:"STATUS",payload:"ERROR"})})}catch(i){console.error("[telemetryWorker] Failed to initialize Firebase listener:",i),self.postMessage({type:"STATUS",payload:"ERROR"})}}e==="CLOSE"&&hi&&(console.log("[telemetryWorker] Closing RTDB listener"),hi(),hi=null)},setInterval(()=>{Hs&&(self.postMessage({type:"TELEMETRY_UPDATE",payload:{vessels:ma,aircraft:ya}}),Hs=!1)},1e3)})();
