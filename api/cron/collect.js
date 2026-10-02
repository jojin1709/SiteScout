import { handleCron } from '../../src/core/app.js';

export default async function handler(req, res) {
  return handleCron(req, res);
}
