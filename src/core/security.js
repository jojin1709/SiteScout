import {HOST_SUFFIXES} from './config.js';
export function hostnameAllowed(hostname){
  const h = hostname.toLowerCase().replace(/\.$/, '');
  // Must be a subdomain of supported cloud platforms (e.g. app.vercel.app, not vercel.app or google.com)
  return HOST_SUFFIXES.some(s => h.endsWith(`.${s}`) && h !== s);
}
export function safeUrl(raw){let u;try{u=new URL(raw)}catch{return null}if(u.protocol!=='https:'||u.username||u.password||!hostnameAllowed(u.hostname))return null;u.hash='';return u;}
export function normalizeCandidate(raw){const u=safeUrl(raw);if(!u)return null;u.pathname=u.pathname||'/';return u.toString();}
export function isMaliciousResult(r){const tags=JSON.stringify(r||{}).toLowerCase();return ['phishing','malicious','malware','credential theft','adult'].some(x=>tags.includes(x));}
