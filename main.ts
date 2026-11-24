// Tiny stack VM: a correct interpreter of make.fun's tiny stack ISA v1.
// Mirrors generator/subject/vm.mjs (the rule): checks in order (step, pc,
// opcode, immediate, stack), wrapping 32-bit arithmetic, all ten traps.
import{mkdirSync as k,readdirSync as R,readFileSync as F,writeFileSync as W}from'node:fs';
import{join as J}from'node:path';
function run(p,i,o){
 const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256);
 let s=0,c=0,l=0,g=0,n=0,t=0;
 for(;;){
  if(t===1e6)return[l,10];
  if(n<0||n>=p.length)return[l,9];
  const q=p[n];
  const m=q===1?1:q===2?4:q>=48&&q<52?2:0;
  if(n+m>=p.length)return[l,9];
  t++;
  const x=n+1+m;
  n=x;
  switch(q){
   case 0:return[l,0];
   case 1:if(s===256)return[l,3];D[s++]=(p[x-1]<<24)>>24;break;
   case 2:if(s===256)return[l,3];D[s++]=p[x-4]|p[x-3]<<8|p[x-2]<<16|p[x-1]<<24;break;
   case 3:if(s<1)return[l,2];s--;break;
   case 4:if(s<1)return[l,2];if(s===256)return[l,3];D[s]=D[s-1];s++;break;
   case 5:if(s<2)return[l,2];{const v=D[s-1];D[s-1]=D[s-2];D[s-2]=v;break;}
   case 6:if(s<2)return[l,2];if(s===256)return[l,3];D[s]=D[s-2];s++;break;
   case 7:if(s<3)return[l,2];{const a=D[s-3];D[s-3]=D[s-2];D[s-2]=D[s-1];D[s-1]=a;break;}
   case 23:if(s<1)return[l,2];D[s-1]=-D[s-1];break;
   case 27:if(s<1)return[l,2];D[s-1]=~D[s-1];break;
   case 16:case 17:case 18:case 19:case 20:case 21:case 22:case 24:case 25:case 26:case 28:case 29:case 30:case 32:case 33:case 34:{
    if(s<2)return[l,2];
    const b=D[s-1],a=D[s-2];
    let r;
    if(q===16)r=a+b;
    else if(q===17)r=a-b;
    else if(q===18)r=Math.imul(a,b);
    else if(q===19){if(!b)return[l,4];r=a===-2147483648&&b===-1?a:a/b;}
    else if(q===20){if(!b)return[l,4];r=b===-1?0:a%b;}
    else if(q===21){if(!b)return[l,4];r=Math.floor((a>>>0)/(b>>>0));}
    else if(q===22){if(!b)return[l,4];r=(a>>>0)%(b>>>0);}
    else if(q===24)r=a&b;
    else if(q===25)r=a|b;
    else if(q===26)r=a^b;
    else if(q===28)r=a<<(b&31);
    else if(q===29)r=a>>(b&31);
    else if(q===30)r=a>>>(b&31);
    else if(q===32)r=a===b?1:0;
    else if(q===33)r=a<b?1:0;
    else r=(a>>>0)<(b>>>0)?1:0;
    D[s-2]=r;s--;
    break;}
   case 48:case 49:case 50:{
    const v=((p[x-2]|p[x-1]<<8)<<16)>>16;
    let y=1;
    if(q!==48){if(s<1)return[l,2];const d=D[--s];y=q===49?d===0:d!==0;}
    if(y)n=x+v;
    break;}
   case 51:if(c===64)return[l,7];C[c++]=x;n=p[x-2]|p[x-1]<<8;break;
   case 52:if(!c)return[l,8];n=C[--c];break;
   case 64:{if(s<1)return[l,2];const a=D[s-1];if(a<0||a>255)return[l,6];D[s-1]=M[a];break;}
   case 65:{if(s<2)return[l,2];const a=D[s-1],v=D[s-2];if(a<0||a>255)return[l,6];s-=2;M[a]=v;break;}
   case 80:{if(s<1)return[l,2];const y=String(D[s-1]);if(l+y.length>65536)return[l,11];s--;for(let j=0;j<y.length;j++)o[l++]=y.charCodeAt(j);break;}
   case 81:if(s<1)return[l,2];if(l+1>65536)return[l,11];o[l++]=D[--s]&255;break;
   case 82:if(s===256)return[l,3];D[s++]=g<i.length?i[g++]:-1;break;
   case 83:if(s<1)return[l,2];return[l,D[--s]&255];
   default:return[l,5];
  }
 }
}
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
for(const d of R(I).sort()){
 const p=F(J(I,d,'program.bin')),i=F(J(I,d,'input.bin')),o=new Uint8Array(65536),[l,c]=run(p,i,o);
 k(J(O,d),{recursive:true});W(J(O,d,'stdout.bin'),o.subarray(0,l));W(J(O,d,'exit.txt'),c+'\n');
}
