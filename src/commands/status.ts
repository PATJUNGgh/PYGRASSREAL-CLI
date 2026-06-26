import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { isLoggedIn, getUserEmail, getApiUrl } from '../services/config.js';

export async function statusCommand(): Promise<void> {
  console.log(chalk.cyan('\n=== PyGrassReal CLI Status ===\n'));

  // 1. ตรวจสอบข้อมูลเซสชันล็อกอิน
  if (isLoggedIn()) {
    console.log(`Connection:     ${chalk.green('Connected')}`);
    console.log(`API Endpoint:   ${chalk.underline(getApiUrl())}`);
    console.log(`Account Email:  ${chalk.bold(getUserEmail())}`);
  } else {
    console.log(`Connection:     ${chalk.yellow('Disconnected')}`);
    console.log(`Authentication: You are not logged in. Run ${chalk.bold('pgr_bin login')} to connect.`);
  }

  console.log(chalk.gray('\n-----------------------------------------\n'));

  // 2. ตรวจสอบข้อมูลโปรเจกต์ในโฟลเดอร์ปัจจุบัน
  const configPath = path.join(process.cwd(), 'pygrass.config.json');

  if (fs.existsSync(configPath)) {
    try {
      const fileContent = fs.readFileSync(configPath, 'utf-8');
      const config = JSON.parse(fileContent);

      console.log(`Project Configuration:`);
      console.log(`- Project Folder:   ${chalk.green('Initialized')}`);
      console.log(`- Project Name:     ${chalk.bold(config.name || 'N/A')}`);
      console.log(`- Project ID:       ${chalk.bold(config.projectId || 'Unregistered (Created on first publish)')}`);
      console.log(`- Model Version:    ${config.version || '1.0.0'}`);
      console.log(`- Entry Script:     ${config.entryFile || 'N/A'}`);
      console.log(`- Parameters Schema:${config.parameters || 'N/A'}`);
    } catch (error: any) {
      console.log(`Project Config:     ${chalk.red('Invalid (Failed to parse JSON)')}`);
      console.error(chalk.red(`Error Details:      ${error.message}`));
    }
  } else {
    console.log(`Project Folder:     ${chalk.yellow('Not Initialized')}`);
    console.log(`Suggestion:         Run ${chalk.bold('pgr_bin init')} to setup configuration in this folder.`);
  }
  console.log();
}
