const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const cache = new Map();
function load(name) {
  const file = path.join(root, name.replace(/^@\//, '') + '.ts');
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} }; cache.set(file, module);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  new Function('require', 'module', 'exports', code)(load, module, module.exports);
  return module.exports;
}
const { createTrainingPlan } = load('@/lib/training-engine');
const base = {
 athleteId: 'test-01', sessionId: 1, coachStatus: 'full', coachApproved: true, coachName: 'Test Coach',
 readinessInput: { present: true, pain: false, medicalConcern: false, ready: 5, energy: 5, sleep: 5, hydration: 5, soreness: 0, stress: 1 },
 movementInput: { control: 5, alignment: 5, balance: 5, usableRange: 5, observations: [], priority: 'general' }
};
assert.equal(createTrainingPlan(base).approvedStatus, 'full');
for (const flag of ['pain','medicalConcern']) {
 const plan = createTrainingPlan({...base, readinessInput: {...base.readinessInput, [flag]: true}});
 assert.equal(plan.approvedStatus, 'refer'); assert.equal(plan.blocks.length, 1); assert.equal(plan.blocks[0].name, 'Hold / Refer');
}
assert.equal(createTrainingPlan({...base, readinessInput: {...base.readinessInput, present: false}}).approvedStatus, 'hold');
assert.equal(createTrainingPlan({...base, coachStatus: 'modified'}).approvedStatus, 'modified');
assert.equal(createTrainingPlan({...base, coachStatus: 'hold'}).approvedStatus, 'hold');
assert.equal(createTrainingPlan({...base, movementInput: {...base.movementInput, control: 1, alignment: 1, balance: 1, usableRange: 1}}).approvedStatus, 'hold');
console.log('PASS: 7 training-rule scenarios, including pain, medical concern, absence, and restrictive coach decisions.');
process.env.NEXT_PUBLIC_SCHOOL_ID = 'test-academy';
process.env.NEXT_PUBLIC_SCHOOL_NAME = 'Test Academy';
process.env.NEXT_PUBLIC_PROGRAM_NAME = 'Performance Lab';
const { school, schoolTitle } = load('@/lib/school');
assert.equal(school.name, 'Test Academy');
assert.equal(schoolTitle, 'Test Academy | TCPS Performance Lab');
const memory = new Map();
global.window = {localStorage: {getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)}};
const storage = load('@/lib/storage');
storage.saveRecord({athleteId:'athlete-07'});
assert.ok(memory.has('tcps-test-academy-record:athlete-07'));
assert.ok(!memory.has('tcps-cresset-record:athlete-07'));
console.log('PASS: school branding and isolated school record namespace.');
