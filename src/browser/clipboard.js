/** Browser clipboard adapter with injected capabilities for deterministic tests. */
export async function copyOutput(payload, capabilities = {}) {
  const clipboard = capabilities.clipboard ?? globalThis.navigator?.clipboard;
  const ClipboardItemCtor = capabilities.ClipboardItemCtor ?? globalThis.ClipboardItem;
  const BlobCtor = capabilities.BlobCtor ?? globalThis.Blob;
  if (!clipboard) throw new Error('Clipboard access is unavailable.');

  if (payload.mode === 'markdown') {
    await clipboard.writeText(payload.markdown);
    return { kind: 'markdown', message: 'Markdown slopied.' };
  }

  if (ClipboardItemCtor && BlobCtor && clipboard.write && payload.html) {
    const item = new ClipboardItemCtor({
      'text/plain': new BlobCtor([payload.plain], { type: 'text/plain' }),
      'text/html': new BlobCtor([payload.html], { type: 'text/html' })
    });
    await clipboard.write([item]);
    return { kind: 'rich', message: 'Copied! You got this! 🙌' };
  }

  await clipboard.writeText(payload.plain);
  return { kind: 'plain', message: 'Copied! Change the world! 🌏' };
}
