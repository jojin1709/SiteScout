import { handleHealth } from '../src/core/app.js';

export default async function handler(req, res) {
  return handleHealth(req, res);
}
