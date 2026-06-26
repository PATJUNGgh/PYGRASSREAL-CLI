import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { setToken, clearToken, setUserEmail, isLoggedIn } from '../services/config.js';

export async function loginCommand(): Promise<void> {
  if (isLoggedIn()) {
    console.log(chalk.yellow('\nYou are already logged in.'));
    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'relogin',
        message: 'Do you want to log in again with a different account?',
        default: false,
      },
    ]);
    if (!confirm.relogin) return;
  }

  console.log(chalk.cyan('\n=== PyGrassReal Login ===\n'));
  console.log('To login, please obtain an API Token from your dashboard.');
  console.log(`Dashboard URL: ${chalk.underline('https://pygrassreal.com/developer')}\n`);

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'email',
      message: 'Enter your email:',
      validate: (input) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input) ? true : 'Please enter a valid email address';
      }
    },
    {
      type: 'password',
      name: 'token',
      message: 'Enter your API Token:',
      mask: '*',
      validate: (input) => (input ? true : 'API Token is required'),
    },
  ]);

  const spinner = ora('Verifying token with PyGrassReal server...').start();

  try {
    // ในอนาคต: เชื่อมต่อ API จริงเพื่อตรวจสอบสิทธิ์
    // const response = await axios.post(`${getApiUrl()}/api/v1/auth/verify`, {}, {
    //   headers: { Authorization: `Bearer ${answers.token}` }
    // });
    
    // จำลองผลลัพธ์การติดต่อกับ API Server (Mock Delay)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setToken(answers.token);
    setUserEmail(answers.email);

    spinner.succeed(chalk.green(' Login successful! Session saved locally.'));
  } catch (error) {
    spinner.fail(chalk.red(' Login failed. Invalid API token or network issue.'));
  }
}

export async function logoutCommand(): Promise<void> {
  if (!isLoggedIn()) {
    console.log(chalk.yellow('\nYou are not currently logged in.'));
    return;
  }

  const confirm = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'logout',
      message: 'Are you sure you want to log out?',
      default: true,
    },
  ]);

  if (confirm.logout) {
    clearToken();
    console.log(chalk.green('\nSuccessfully logged out and session cleared.'));
  }
}
