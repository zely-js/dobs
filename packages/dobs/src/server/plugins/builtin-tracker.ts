import chalk from 'chalk';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { SourceMapConsumer } from 'source-map';
import { Plugin } from '~/dobs/plugin';

function parseError(err: Error) {
  const st = err.stack?.split('\n').slice(1);
  return st?.map((stack) => {
    stack = stack.slice(7);
    const $ = {
      at: '',
      loc: '',
    };

    $.loc = (/\([^)]*\)/.exec(stack) || [])[0] || '';
    $.at = stack.replace($.loc, '');

    return $;
  });
}

export function errorTracker(): Plugin {
  return {
    name: 'dobs/plugins:error-tracker',

    async handleError(ctx) {
      const { error } = ctx;

      const stacks = parseError(error);
      const occured = stacks[0].loc.slice(1, -1);
      const sliced = occured.split(':');

      const column = sliced.pop();
      const line = sliced.pop();

      const trace = {
        filename: occured,
        line: Number(line),
        column: Number(column),
      };
      const targetFile = `${sliced.join(':').replace(/\\/g, '/')}.map`;

      if (!existsSync(targetFile)) return console.error(error);

      const tracer = JSON.parse(readFileSync(targetFile, 'utf-8') as string);

      const sourcemap = new SourceMapConsumer(tracer);

      const result = (await sourcemap).originalPositionFor(trace);
      const target = join(dirname(sliced.join(':')), result.source);

      stacks.unshift({
        at: '',
        loc: `${target}:${result.line}:${result.column}`,
      });

      // errorWithStacks(e.message, stacks);

      const lines = [];

      const errorFile = (readFileSync(target, 'utf-8') as string).split('\n');

      lines.push(
        chalk.dim(
          chalk.yellow(
            `  • ${relative(process.cwd(), target)}:${result.line}:${result.column}`,
          ),
        ),
      );

      if (result.line - 1 > 0) {
        lines.push(
          `  ${chalk.gray(`${result.line - 1} | `)}${errorFile[result.line - 2]}`,
        );
      }
      lines.push(
        `  ${chalk.gray(`${result.line} | `)}${chalk.red(chalk.underline(errorFile[result.line - 1]))}`,
      );
      if (errorFile[result.line]) {
        lines.push(`  ${chalk.gray(`${result.line + 1} | `)}${errorFile[result.line]}`);
      }

      console.log(chalk.red(chalk.bold(` ERROR : ${error.message}`)));

      for (const line of lines) {
        console.log(line);
      }
      console.log();
    },
  };
}
