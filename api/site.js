import { handleSite } from '../src/core/app.js';

export default async function handler(req, res) {
  return handleSite(req, res);
}
