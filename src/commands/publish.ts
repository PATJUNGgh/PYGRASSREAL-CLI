import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import chalk from 'chalk';
import ora from 'ora';
import { isLoggedIn } from '../services/config.js';

interface PublishOptions {
  force: boolean;
}

export async function publishCommand(options: PublishOptions): Promise<void> {
  // 1. ตรวจสอบสถานะการเข้าสู่ระบบ
  if (!isLoggedIn()) {
    console.error(chalk.red('\nError: You must be logged in to publish. Please run `pgr_bin login` first.\n'));
    process.exit(1);
  }

  const configPath = path.join(process.cwd(), 'pygrass.config.json');

  // 2. ตรวจสอบว่าโฟลเดอร์นี้มี configuration หรือยัง
  if (!fs.existsSync(configPath)) {
    console.error(chalk.red('\nError: Project configuration not found. Run `pgr_bin init` to set up this folder.\n'));
    process.exit(1);
  }

  let config: any;
  try {
    const fileContent = fs.readFileSync(configPath, 'utf-8');
    config = JSON.parse(fileContent);
  } catch (error: any) {
    console.error(chalk.red(`\nError: Failed to parse pygrass.config.json. ${error.message}\n`));
    process.exit(1);
  }

  const entryPath = path.resolve(process.cwd(), config.entryFile || '');
  const parametersPath = path.resolve(process.cwd(), config.parameters || '');

  // 3. ตรวจสอบการมีอยู่จริงของไฟล์สำคัญ (Entry script และ Parameters file)
  if (!fs.existsSync(entryPath)) {
    console.error(chalk.red(`\nError: Entry script not found at path "${config.entryFile}"`));
    process.exit(1);
  }

  if (!fs.existsSync(parametersPath)) {
    console.error(chalk.red(`\nError: Parameters schema file not found at path "${config.parameters}"`));
    process.exit(1);
  }

  console.log(chalk.cyan('\n=== Publishing Project to PyGrassReal ===\n'));
  console.log(`Project Name: ${chalk.bold(config.name)}`);
  console.log(`Version:      ${config.version}`);
  console.log(`Force Option: ${options.force ? chalk.yellow('Enabled') : chalk.gray('Disabled')}`);

  const spinner = ora('Preparing project bundle (zipping contents)...').start();

  const tempZipPath = path.join(process.cwd(), '.temp_project_bundle.zip');
  const output = fs.createWriteStream(tempZipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', async () => {
    spinner.text = 'Uploading bundle file to PyGrassReal Cloud...';
    
    try {
      // ในขั้นตอนการใช้งานจริง:
      // const formData = new FormData();
      // formData.append('bundle', fs.createReadStream(tempZipPath));
      // formData.append('config', JSON.stringify(config));
      // await axios.post(`${getApiUrl()}/api/v1/publish`, formData, {
      //   headers: {
      //     ...formData.getHeaders(),
      //     Authorization: `Bearer ${getToken()}`
      //   }
      // });
      
      // จำลองสถานการณ์อัปโหลดไฟล์ (Mock delay)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const mockProjectId = config.projectId || `proj_${Math.random().toString(36).substring(2, 9)}`;

      // บันทึก project id กลับลงไปใน config ในกรณีที่อัปโหลดครั้งแรก
      if (!config.projectId) {
        config.projectId = mockProjectId;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
      }

      spinner.succeed(chalk.green(' Upload successful!'));
      console.log(chalk.green(`\n🚀 Project successfully published!`));
      console.log(`🔗 Web Dashboard URL: ${chalk.underline(`https://pygrassreal.com/dashboard/project/${mockProjectId}`)}\n`);

    } catch (error: any) {
      spinner.fail(chalk.red(` Upload failed: ${error.message}`));
    } finally {
      // ลบไฟล์ zip ชั่วคราวออกจากโฟลเดอร์ผู้ใช้
      if (fs.existsSync(tempZipPath)) {
        fs.unlinkSync(tempZipPath);
      }
    }
  });

  archive.on('error', (err) => {
    spinner.fail(chalk.red('Failed to zip project directory.'));
    console.error(err);
    if (fs.existsSync(tempZipPath)) fs.unlinkSync(tempZipPath);
  });

  archive.pipe(output);

  // นำไฟล์ที่กำหนดใน config เข้าไปใน zip bundle
  archive.file(entryPath, { name: path.basename(config.entryFile) });
  archive.file(parametersPath, { name: path.basename(config.parameters) });
  archive.file(configPath, { name: 'pygrass.config.json' });

  // นำไฟล์ธรรมดาอื่นๆ ใน Root (ยกเว้น node_modules, dist, git และไฟล์ชั่วคราว) เข้า zip
  const files = fs.readdirSync(process.cwd());
  for (const file of files) {
    const fullPath = path.join(process.cwd(), file);
    const stat = fs.statSync(fullPath);
    if (
      file !== 'node_modules' &&
      file !== 'dist' &&
      file !== '.git' &&
      file !== 'pygrass.config.json' &&
      file !== path.basename(config.entryFile) &&
      file !== path.basename(config.parameters) &&
      !file.startsWith('.') &&
      stat.isFile()
    ) {
      archive.file(fullPath, { name: file });
    }
  }

  await archive.finalize();
}
