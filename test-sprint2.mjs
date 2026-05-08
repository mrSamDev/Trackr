// Sprint 2 comprehensive test — verifies all DONE implementation tasks
import { appRouter } from './src/integrations/trpc/router.ts';
import { db } from './src/server/db.ts';

const caller = appRouter.createCaller({});
const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

// Clean test data
db.query("DELETE FROM applications WHERE title LIKE 'TEST-%'").run();

// 1. applications.create — basic
test('Create application with status=applied', async () => {
  const app = await caller.applications.create({
    title: 'TEST-Engineer', company: 'TEST-Corp', status: 'applied',
    applied_at: '2024-01-15', location: 'Remote', salary: '100k',
    job_url: 'https://example.com', source: 'LinkedIn', notes: 'Nice role'
  });
  assert(app.id > 0, 'id should be > 0');
  assert(app.title === 'TEST-Engineer', 'title match');
  assert(app.heard_back_at === null, 'heard_back_at null for applied');
  global.testAppId = app.id;
});

// 2. applications.create — auto heard_back_at
test('Create application with status=interview auto-sets heard_back_at', async () => {
  const app = await caller.applications.create({
    title: 'TEST-Designer', company: 'TEST-Design', status: 'interview',
    applied_at: '2024-02-01'
  });
  assert(app.heard_back_at !== null, 'heard_back_at should be set for interview');
  assert(new Date(app.heard_back_at).toISOString().startsWith('2026'), 'heard_back_at is ISO datetime');
  global.testAppId2 = app.id;
});

// 3. applications.list — empty input
test('List returns array including created records', async () => {
  const list = await caller.applications.list({});
  assert(Array.isArray(list), 'list is array');
  assert(list.some(a => a.title === 'TEST-Engineer'), 'contains TEST-Engineer');
});

// 4. applications.list — search filter
test('List filtering by search works', async () => {
  const list = await caller.applications.list({ search: 'Engineer' });
  assert(list.every(a => a.title.includes('Engineer') || a.company.includes('Engineer')), 'search filter');
});

// 5. applications.list — status filter
test('List filtering by status works', async () => {
  const list = await caller.applications.list({ status: 'interview' });
  assert(list.every(a => a.status === 'interview'), 'status filter');
});

// 6. applications.list — combined filters
test('List filtering by search+status works', async () => {
  const list = await caller.applications.list({ search: 'TEST', status: 'applied' });
  assert(list.every(a => a.status === 'applied'), 'combined status filter');
});

// 7. applications.get
test('Get by id returns correct record', async () => {
  const got = await caller.applications.get({ id: global.testAppId });
  assert(got !== null, 'found');
  assert(got.title === 'TEST-Engineer', 'title match');
});

// 8. applications.get — not found
test('Get by invalid id returns null', async () => {
  const got = await caller.applications.get({ id: 999999 });
  assert(got === null, 'null for missing');
});

// 9. applications.update
test('Update changes fields and bumps updated_at', async () => {
  const before = await caller.applications.get({ id: global.testAppId });
  await new Promise(r => setTimeout(r, 50));
  const updated = await caller.applications.update({
    id: global.testAppId,
    data: { title: 'TEST-Updated' }
  });
  assert(updated.title === 'TEST-Updated', 'title updated');
  assert(new Date(updated.updated_at) > new Date(before.updated_at), 'updated_at bumped');
});

// 10. applications.update — preserves heard_back_at
test('Update does not overwrite existing heard_back_at', async () => {
  const before = await caller.applications.get({ id: global.testAppId2 });
  const updated = await caller.applications.update({
    id: global.testAppId2,
    data: { title: 'TEST-Still-Interview' }
  });
  assert(updated.heard_back_at === before.heard_back_at, 'heard_back_at preserved on update');
});

// 11. settings.getVisibleFields + setVisibleFields
test('Settings round-trip', async () => {
  const set = await caller.settings.setVisibleFields({ fields: ['location', 'salary'] });
  assert(set.fields.length === 2, 'set returns fields');
  const get = await caller.settings.getVisibleFields();
  assert(JSON.stringify(get) === JSON.stringify(['location', 'salary']), 'get matches');
});

// 12. applications.delete
test('Delete removes record', async () => {
  const del = await caller.applications.delete({ id: global.testAppId });
  assert(del.deleted === true, 'deleted true');
  const gone = await caller.applications.get({ id: global.testAppId });
  assert(gone === null, 'record gone');
});

// Run
(async () => {
  let passed = 0, failed = 0;
  for (const t of tests) {
    try {
      await t.fn();
      console.log(`✅ ${t.name}`);
      passed++;
    } catch (e) {
      console.log(`❌ ${t.name}: ${e.message}`);
      failed++;
    }
  }
  console.log(`\nResults: ${passed}/${passed+failed} passed`);
  if (failed > 0) process.exit(1);
})();
