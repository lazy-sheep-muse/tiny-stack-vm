import{mkdirSync as k,readdirSync as R,readFileSync as F,writeFileSync as W}from'node:fs';
const B=[(a,b)=>a+b,(a,b)=>a-b,Math.imul,(a,b)=>a/b,(a,b)=>a%b,(a,b)=>(a>>>0)/(b>>>0),(a,b)=>(a>>>0)%(b>>>0),0,(a,b)=>a&b,(a,b)=>a|b,(a,b)=>a^b,0,(a,b)=>a<<(b&31),(a,b)=>a>>(b&31),(a,b)=>a>>>(b&31),0,(a,b)=>a===b|0,(a,b)=>a<b|0,(a,b)=>(a>>>0)<(b>>>0)|0];
function run(p,i,o){
 const D=new Int32Array(320),C=D.subarray(256),M=new Int32Array(256);
 let s=0,c=0,l=0,g=0,n=0,t=0;
 const E=z=>[l,z];
 for(;;){
  if(t===1e6)return E(10);
  const q=p[n],m=q<3?[0,1,4][q]:q>47&&q<52?2:0;
  if(n<0||n+m>=p.length)return E(9);
  t++;const x=n+=1+m;
  const N=q===7?3:q>15&&q<35&&q!==23&&q!==27&&q!==31||",5,6,65,".includes(","+q+",")?2:",3,4,23,27,49,50,64,80,81,83,".includes(","+q+",")?1:0;
  if(s<N)return E(2);
  if(",1,2,4,6,82,".includes(","+q+",")&&s===256)return E(3);
  switch(q){
   case 0:return E(0);
   case 1:D[s++]=p[x-1]<<24>>24;break;
   case 2:D[s++]=p.readInt32LE(x-4);break;
   case 3:s--;break;
   case 4:D[s]=D[s-1];s++;break;
   case 5:[D[s-1],D[s-2]]=[D[s-2],D[s-1]];break;
   case 6:D[s]=D[s-2];s++;break;
   case 7:[D[s-3],D[s-2],D[s-1]]=[D[s-2],D[s-1],D[s-3]];break;
   case 23:D[s-1]=-D[s-1];break;
   case 27:D[s-1]=~D[s-1];break;
   case 16:case 17:case 18:case 19:case 20:case 21:case 22:case 24:case 25:case 26:case 28:case 29:case 30:case 32:case 33:case 34:{
    const b=D[s-1],a=D[s-2];
    if(q>18&&q<23&&!b)return E(4);
    D[s-2]=B[q-16](a,b);s--;
    break;}
   case 48:case 49:case 50:{
    const v=p.readInt16LE(x-2);
    if(q===48)n=x+v;
    else{const d=D[--s];if(q>49^d===0)n=x+v;}
    break;}
   case 51:if(c===64)return E(7);C[c++]=x;n=p[x-2]|p[x-1]<<8;break;
   case 52:if(!c)return E(8);n=C[--c];break;
   case 64:{const a=D[s-1];if(a>>>0>255)return E(6);D[s-1]=M[a];break;}
   case 65:{const a=D[s-1],v=D[s-2];if(a>>>0>255)return E(6);s-=2;M[a]=v;break;}
   case 80:{const y=String(D[s-1]);if(l+y.length>65536)return E(11);s--;for(const j of y)o[l++]=j.charCodeAt();break;}
   case 81:if(l>65535)return E(11);o[l++]=D[--s]&255;break;
   case 82:D[s++]=g<i.length?i[g++]:-1;break;
   case 83:return E(D[--s]&255);
   default:return E(5);
  }
 }
}
const e=process.env,I=e.MAKEFUN_INPUT_DIR??'/input',O=e.MAKEFUN_OUTPUT_DIR??'/output';
for(const d of R(I)){
 const p=F(I+'/'+d+'/program.bin'),i=F(I+'/'+d+'/input.bin'),o=new Uint8Array(1<<16),[l,c]=run(p,i,o);
 k(O+'/'+d,{recursive:true});W(O+'/'+d+'/stdout.bin',o.subarray(0,l));W(O+'/'+d+'/exit.txt',c+'\n');
}
