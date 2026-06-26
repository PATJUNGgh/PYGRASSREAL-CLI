import Conf from 'conf';

interface ConfigSchema {
  token?: string;
  apiUrl: string;
  userEmail?: string;
}

// สร้าง config instance เพื่อเก็บข้อมูลการตั้งค่าและ session โลคอล
const config = new Conf<ConfigSchema>({
  projectName: 'pgr-cli',
  defaults: {
    apiUrl: 'https://api.pygrassreal.com', // URL หลักในการติดต่อ API (ปรับเปลี่ยนได้)
  },
});

export function setToken(token: string): void {
  config.set('token', token);
}

export function getToken(): string | undefined {
  return config.get('token');
}

export function clearToken(): void {
  config.delete('token');
  config.delete('userEmail');
}

export function setUserEmail(email: string): void {
  config.set('userEmail', email);
}

export function getUserEmail(): string | undefined {
  return config.get('userEmail');
}

export function getApiUrl(): string {
  return config.get('apiUrl');
}

export function setApiUrl(url: string): void {
  config.set('apiUrl', url);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
