import { load } from 'module-loader-ts';
import { isAbsolute, join } from 'node:path';

import type { ResolvedServerConfig, ServerEntry } from '~/dobs/config';

export async function loadServerEntry(
  config: ResolvedServerConfig,
): Promise<ServerEntry> {
  let entry = config.serverEntry;

  if (!isAbsolute(entry)) entry = join(config.cwd, entry);

  return await load(entry, {
    extensions: ['', '.ts', '.js', '.mts', '.cts', '.mjs', '.cjs'],
  });
}
