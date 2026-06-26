import { Command } from 'commander';
import chalk from 'chalk';
import { loginCommand, logoutCommand } from './commands/auth.js';
import { initCommand } from './commands/init.js';
import { statusCommand } from './commands/status.js';
import { publishCommand } from './commands/publish.js';

const program = new Command();

program
  .name('pgr_bin')
  .description('CLI tool for PyGrassReal Platform')
  .version('1.0.0');

// Register commands
program
  .command('login')
  .description('Login to PyGrassReal')
  .action(loginCommand);

program
  .command('logout')
  .description('Logout from PyGrassReal')
  .action(logoutCommand);

program
  .command('init')
  .description('Initialize config for current project')
  .action(initCommand);

program
  .command('status')
  .description('Check project and auth status')
  .action(statusCommand);

program
  .command('publish')
  .description('Publish current project to PyGrassReal cloud')
  .option('-f, --force', 'force overwrite if project exists', false)
  .action(publishCommand);

// Global error handler for unknown commands
program.on('command:*', () => {
  console.error(chalk.red('\nError: Invalid command. Use --help to see available commands.\n'));
  process.exit(1);
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
