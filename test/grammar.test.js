import assert from 'node:assert/strict';
import test from 'node:test';
import { serializePlain, tally, transform } from '../src/domain/index.js';

const REPORTED_EXCERPT = `What words will express the central point? Which claims should the writer retain? How should the team explain the result? Why does the method matter? What evidence will persuade the reader? Is the conclusion stable?

The writer and editor review the draft: Never use vague claims, put the evidence first, and explain the constraint. The writer is used to seeing clichés. The method is a modest review practice, and the editor records the result.

The process remains deliberately awkward. The team checks the wording, and the editor approves the change. A broader review follows: preserve the question, retain the colon, and keep the sentence readable.`;

function plain(source) {
  return serializePlain(transform(source));
}

test('reported excerpt preserves question force and colon leads while retaining parody density', () => {
  const document = transform(REPORTED_EXCERPT);
  const output = serializePlain(document);
  const counts = new Map(tally(document).map((item) => [item.key, item.count]));

  assert.equal((output.match(/\?/g) ?? []).length, 6);
  assert.equal((output.match(/(?:draft|follows):/gi) ?? []).length, 2);
  assert.ok((counts.get('hedge') ?? 0) > 0);
  assert.ok((counts.get('significance') ?? 0) > 0);
  assert.ok((counts.get('bold') ?? 0) > 0);
  assert.ok((counts.get('emDash') ?? 0) > 0);
  assert.ok(wordCount(output) <= Math.floor(wordCount(REPORTED_EXCERPT) * 2.25));
  assert.doesNotMatch(output, /:,|—[.?]/);
  assert.doesNotMatch(output, /leveraged to seeing|not only one can/i);
  assert.doesNotMatch(output, /underscores\s+(?:What|Never|put|said|scrupulous)\b/i);
  assert.match(output, /the writer is used to seeing clichés/i);
});

test('questions and emphatic questions receive lexical changes without declarative tails', () => {
  for (const source of ['What words will express it?', 'Really?!']) {
    const output = plain(source);
    assert.match(output, /[?!]+$/);
    assert.doesNotMatch(output, /underscores|speaks to its wider significance|It is important to note/i);
  }
});

test('colon and semicolon leads retain terminal punctuation and avoid tails', () => {
  for (const source of [
    'The draft ends here:',
    'The draft ends here;',
    'Never use vague claims.'
  ]) {
    const output = plain(source);
    assert.match(output, /[:;.]$/);
    assert.doesNotMatch(output, /—|underscores|speaks to its wider significance/i);
  }
});

test('dependent-clause openings avoid declarative rewrites and tails', () => {
  for (const source of [
    'Because the method is a useful review practice for the team.',
    'Although the process has a clear purpose for reviewers.',
    'Since the writer uses the tool during difficult reviews.',
    'While the editor checks the wording before publication.'
  ]) {
    const output = plain(source);
    assert.match(output, /\.$/);
    assert.doesNotMatch(output, /represents|serves as|features|underscores|speaks to its wider significance|It is important to note/i);
  }
});

test('habitual used to remains intact while verbal use stays eligible', () => {
  assert.match(plain('The writer is used to seeing clichés.'), /\bused to seeing\b/i);
  assert.doesNotMatch(plain('The writer is used to seeing clichés.'), /leveraged to seeing|harnessed to seeing|operationalized to seeing/i);
  assert.match(plain('A writer uses the tool.'), /leverages|harnesses|operationalizes/i);
});

test('complete coordinated clauses use grammatical full-clause parallelism', () => {
  const output = plain('The writer reviews the method, and the editor approves the change.');
  assert.match(output, /It is not only the case that .*?, but also the case that /i);
  assert.doesNotMatch(output, /not only one can/i);
});

test('uncertain topics use a noun-phrase fallback', () => {
  const output = plain('The method demonstrates a useful pattern for teams reviewing difficult changes while the group records practical outcomes and discusses surrounding constraints in considerable detail.');
  assert.match(output, /underscores the broader proposition/i);
  assert.doesNotMatch(output, /underscores\s+(?:What|Never|put|said|scrupulous)\b/i);
});

function wordCount(value) {
  return (value.match(/\b[\p{L}\p{N}][\p{L}\p{N}'’-]*\b/gu) ?? []).length;
}
