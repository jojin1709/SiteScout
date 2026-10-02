import { handleRssFeed } from '../../src/core/app.js';

export async function onRequest(context) {
  return handleRssFeed(context.request, null, context.env);
}
