#!/usr/bin/env node

import animaux from 'animaux';
import {
  group,
  intro,
  outro,
  select,
  confirm,
  text,
  spinner,
  cancel,
} from '@clack/prompts';
import chalk from 'chalk';
import { sync } from 'cross-spawn';

import { version } from '../package.json';

import TYPESCRIPT_TEMPLATE_MAP from '../with-typescript/map.json';
import JAVASCRIPT_TEMPLATE_MAP from '../with-javascript/map.json';
import { dirname, join } from 'node:path';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const tsmap = TYPESCRIPT_TEMPLATE_MAP.map.map((t) => [
  t,
  join(__dirname, '../with-typescript/', t),
]);
const jsmap = JAVASCRIPT_TEMPLATE_MAP.map.map((t) => [
  t,
  join(__dirname, '../with-javascript/', t),
]);

const commonmap = ['package.json', 'README.md'].map((t) => [
  t,
  join(__dirname, '../common-template/', t),
]);

const app = animaux({ name: 'create-dobs', version: version });

app.action(async () => {
  intro('create-dobs');

  const groupOutput = await group(
    {
      cwd: () => text({ message: 'What is project directory?', placeholder: './' }),
      template: () =>
        select({
          message: 'Select a project template.',
          options: [
            {
              value: 'ts',
              label: chalk.blue('TypeScript'),
            },
            {
              value: 'js',
              label: chalk.yellow('JavaScript'),
            },
          ],
        }),

      install: () => confirm({ message: 'Do you want to install dependencies?' }),
    },
    {
      // On Cancel callback that wraps the group
      // So if the user cancels one of the prompts in the group this function will be called
      onCancel: () => {
        cancel('Operation cancelled.');
        process.exit(0);
      },
    },
  );

  const map = groupOutput.template === 'js' ? jsmap : tsmap;
  mkdirSync(dirname(join(groupOutput.cwd)), { recursive: true });

  for (const [file, originalFile] of [...map, ...commonmap]) {
    mkdirSync(dirname(join(groupOutput.cwd, file)), { recursive: true });
    writeFileSync(join(groupOutput.cwd, file), readFileSync(originalFile));
  }

  const s = spinner();

  s.start('Installing via yarn');

  sync('yarn', ['install'], {
    stdio: 'inherit',
    cwd: join(process.cwd(), groupOutput.cwd),
  });

  s.stop('Installed via yarn');
  outro(`You're all set!`);
});

app.parse(process.argv.slice(2));
