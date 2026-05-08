// Sprint 6 MCP integration test via JSON-RPC
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { registerApplicationTools } from './src/mcp-applications.ts';
import { db } from './src/server/db.ts';

const server = new McpServer({ name: 'test-server', version: '1.0.0' });
registerApplicationTools(server);

async function callTool(name, args) {
  const requestBody = {
    jsonrpc: '2.0',
    id: Math.floor(Math.random() * 100000),
    method: 'tools/call',
    params: { name, arguments: args }
  };

  const request = new Request('http://localhost/mcp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  const { handleMcpRequest } = await import('./src/utils/mcp-handler.ts');
  const response = await handleMcpRequest(request, server);
  const json = await response.json();

  if (json.error) throw new Error(json.error.message);
  return JSON.parse(json.result.content[0].text);
}

async function listTools() {
  const requestBody = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
    params: {}
  };
  const request = new Request('http://localhost/mcp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });
  const { handleMcpRequest } = await import('./src/utils/mcp-handler.ts');
  const response = await handleMcpRequest(request, server);
  const json = await response.json();
  if (json.error) throw new Error(json.error.message);
  return json.result.tools;
}

const tests = [];
function test(n, fn) { tests.push({ name: n, fn }); }
function assert(c, m) { if (!c) throw new Error(m); }

let testId;

test('Server has 7 tools listed', async () => {
  const tools = await listTools();
  assert(tools.length === 7, `expected 7 tools, got ${tools.length}`);
});

test('addApplication with applied status', async () => {
  const res = await callTool('addApplication', {
    title: 'TEST-MCP-Role', company: 'TEST-MCP-Corp', status: 'applied',
    applied_at: '2024-03-01'
  });
  assert(res.id, 'has id');
  assert(res.heard_back_at === null, 'heard_back_at null for applied');
  testId = res.id;
});

test('addApplication with interview auto-sets heard_back_at', async () => {
  const res = await callTool('addApplication', {
    title: 'TEST-MCP-Int', company: 'TEST-MCP-IntCo', status: 'interview',
    applied_at: '2024-03-02'
  });
  assert(res.heard_back_at !== null, 'heard_back_at set for interview');
});

test('listApplications returns array', async () => {
  const res = await callTool('listApplications', { limit: 10 });
  assert(Array.isArray(res), 'returns array');
});

test('listApplications with search filter', async () => {
  const res = await callTool('listApplications', { search: 'MCP', limit: 10 });
  assert(res.some(a => a.title.includes('MCP')), 'filter works');
});

test('getApplication returns record', async () => {
  const res = await callTool('getApplication', { id: testId });
  assert(res.id === testId, 'id matches');
});

test('updateApplicationStatus transitions status and sets heard_back_at', async () => {
  const res = await callTool('updateApplicationStatus', { id: testId, status: 'interview' });
  assert(res.status === 'interview', 'status changed');
  assert(res.heard_back_at !== null, 'heard_back_at set on transition');
});

test('deleteApplication removes record', async () => {
  const res = await callTool('deleteApplication', { id: testId });
  assert(res.deleted === true, 'deleted');
  const gone = await callTool('getApplication', { id: testId });
  assert(gone === null, 'record gone');
});

test('settings round-trip', async () => {
  await callTool('updateSettings', { visible_fields: ['location', 'salary'] });
  const get = await callTool('getSettings', {});
  assert(JSON.stringify(get.visible_fields) === JSON.stringify(['location', 'salary']), 'round-trip');
});

(async () => {
  let passed = 0, failed = 0;
  for (const t of tests) {
    try { await t.fn(); console.log(`✅ ${t.name}`); passed++; }
    catch (e) { console.log(`❌ ${t.name}: ${e.message}`); failed++; }
  }
  console.log(`\nResults: ${passed}/${passed+failed} passed`);
  if (failed > 0) process.exit(1);
})();
