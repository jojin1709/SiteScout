import {handleCron} from '../../../src/core/app.js';export const onRequest=({request,env})=>handleCron(request,env);
