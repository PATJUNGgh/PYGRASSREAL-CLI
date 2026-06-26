import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';

export async function initCommand(): Promise<void> {
  const configPath = path.join(process.cwd(), 'pygrass.config.json');

  // ตรวจสอบว่ามีไฟล์ config เดิมอยู่แล้วหรือไม่
  if (fs.existsSync(configPath)) {
    console.log(chalk.yellow('\nWarning: pygrass.config.json already exists in this directory.'));
    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: 'Do you want to overwrite the existing configuration with new settings?',
        default: false,
      },
    ]);
    if (!confirm.overwrite) {
      console.log(chalk.gray('Initialization cancelled.'));
      return;
    }
  }

  console.log(chalk.cyan('\n=== Initialize PyGrassReal Project ===\n'));

  const questions = [
    {
      type: 'input',
      name: 'name',
      message: 'Project Name:',
      default: path.basename(process.cwd()),
      validate: (input: string) => (input.trim() ? true : 'Project name cannot be empty'),
    },
    {
      type: 'input',
      name: 'projectId',
      message: 'Project ID (Leave blank if you want to register a new project on publish):',
      default: '',
    },
    {
      type: 'input',
      name: 'version',
      message: 'Project Version:',
      default: '1.0.0',
    },
    {
      type: 'input',
      name: 'entryFile',
      message: 'Path to Entry Script (e.g. main.py):',
      default: './main.py',
    },
    {
      type: 'input',
      name: 'parameters',
      message: 'Path to Parameters Schema File (e.g. parameters.json):',
      default: './parameters.json',
    },
  ];

  const answers = await inquirer.prompt(questions);

  const configContent = {
    projectId: answers.projectId.trim() || null,
    name: answers.name.trim(),
    version: answers.version.trim(),
    entryFile: answers.entryFile.trim(),
    parameters: answers.parameters.trim(),
    createdAt: new Date().toISOString(),
  };

  try {
    fs.writeFileSync(configPath, JSON.stringify(configContent, null, 2), 'utf-8');
    console.log(chalk.green(`\nSuccess: Created ${chalk.bold('pygrass.config.json')} in current folder!`));
    console.log(chalk.gray('You can now edit this file manually or run `pgr_bin publish` to upload it.\n'));
  } catch (error: any) {
    console.error(chalk.red(`\nError: Failed to write configuration file. ${error.message}\n`));
  }
}
