const assert = require('node:assert/strict');
const test = require('node:test');
const bcrypt = require('bcryptjs');
const app = require('../server');

test('loads the API without native binary dependencies', async () => {
  const password = 'portfolio-smoke-test';
  const hash = await bcrypt.hash(password, 4);

  assert.equal(await bcrypt.compare(password, hash), true);
});

test('serves a health response without requiring a database connection', async (t) => {
  const server = app.listen(0, '127.0.0.1');
  t.after(() => server.close());

  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/api/v1/health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    success: true,
    message: 'StudyNotion API is healthy',
  });
});
