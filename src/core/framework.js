import {FRAMEWORK_PATTERNS} from './config.js';
export function detectFramework(html=''){for(const [name,patterns] of FRAMEWORK_PATTERNS){if(patterns.some(p=>p instanceof RegExp?p.test(html):html.includes(p)))return name}return 'Other'}
