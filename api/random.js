import { handleRandom } from '../src/core/app.js';

export default async function handler(req, res) {
  return handleRandom(req, res);
}
