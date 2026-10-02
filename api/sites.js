import { handleSites } from '../src/core/app.js';

export default async function handler(req, res) {
  return handleSites(req, res);
}
