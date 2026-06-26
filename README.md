# PGR CLI (PyGrassReal Command Line Interface)

เครื่องมือ Command Line Interface สำหรับใช้ในการจัดการโครงงาน อิมพอร์ตพารามิเตอร์ และอัปเดตโมเดล Parametric Grass ขึ้นสู่ระบบคลาวด์ของ PyGrassReal

---

## 🛠️ การติดตั้งและใช้งานระหว่างการพัฒนา (Local Development)

### 1. ติดตั้ง Dependencies
เปิด Terminal ในโฟลเดอร์ `CLI_PGR` แล้วรัน:
```bash
npm install
```

### 2. คอมไพล์โปรเจกต์ (Build)
เนื่องจากเครื่องมือนี้เขียนขึ้นด้วย TypeScript ต้องทำคอมไพล์เป็น JavaScript ก่อนรันจริง:
```bash
npm run build
```

### 3. เชื่อมต่อคำสั่งสำหรับใช้งานโลคอล (Local Link)
ทดลองติดตั้ง CLI นี้บนเครื่องตนเองเพื่อทดสอบการพิมพ์คำสั่งผ่าน Terminal:
```bash
npm link
```
หลังจากรันสำเร็จ คุณจะสามารถพิมพ์เรียกใช้คำสั่ง **`pgr_bin`** ได้จากทุกทีบนเครื่องของคุณ

---

## 🚀 ขั้นตอนการนำขึ้น GitHub และ เผยแพร่ไปยัง npm (Publishing Guide)

เพื่อให้คนอื่นหรือคุณเองสามารถดาวน์โหลดผ่าน `npm install -g pgr-cli` ได้โดยง่ายและเป็นอัตโนมัติ ให้ทำตามขั้นตอนดังต่อไปนี้:

### ขั้นตอนที่ 1: ลงทะเบียนและสร้าง Token บน npmjs.com
1. สมัคร/ล็อกอินบัญชีบนเว็บ [npmjs.com](https://www.npmjs.com/)
2. ไปที่รูปโปรไฟล์ของคุณ -> **Access Tokens** -> **Generate New Token**
3. เลือกประเภทเป็น **Classic Token**
4. ตั้งชื่อ Token เช่น `github-actions-publish`
5. ตรวจสอบให้แน่ใจว่าเลือกสิทธิ์เป็น **Publish** (หรือ **Automation**)
6. กดปุ่มสร้างแล้วก๊อปปี้รหัส Token นั้นเก็บไว้ (สำคัญมาก: มันจะแสดงแค่ครั้งเดียว)

### ขั้นตอนที่ 2: ตั้งค่า Secrets ใน GitHub Repository
เมื่อคุณทำการสร้าง Repository ใหม่บน GitHub และอัปโหลดไฟล์/โฟลเดอร์ทั้งหมด**ภายใน**โฟลเดอร์ `CLI_PGR` ขึ้นไปแล้ว (โดยให้ไฟล์ `package.json` อยู่ที่ระดับนอกสุด (root) ของ Repository):
1. เข้าไปยังหน้ารวม Repository ของโปรเจกต์นี้บน GitHub
2. ไปที่เมนู **Settings** -> **Secrets and variables** -> **Actions**
3. กดปุ่ม **New repository secret**
4. ตั้งชื่อ Secret: `NPM_TOKEN`
5. วางรหัส Token ที่ได้รับจาก npmjs (ขั้นตอนที่ 1) ลงในช่อง **Secret**
6. กดปุ่ม **Add secret** เพื่อบันทึก

### ขั้นตอนที่ 3: สั่งเผยแพร่แพ็กเกจอัตโนมัติ (Trigger Release)
ทางโปรเจกต์ได้เตรียมระบบ GitHub Actions Workflow ไว้ในไฟล์ `.github/workflows/publish.yml` แล้ว เมื่อต้องการปล่อยเวอร์ชันใหม่ ให้ทำผ่านการสร้าง Git Tag:
1. อัปเดตเลขเวอร์ชันในไฟล์ `package.json` เสมอ (เช่น `"version": "1.0.1"`)
2. ส่งคำสั่งสร้าง Tag และ push ขึ้นไปบน GitHub:
   ```bash
   git add .
   git commit -m "release: version 1.0.1"
   git tag v1.0.1
   git push origin main --tags
   ```
3. GitHub Actions จะทำงานตรวจพบ Tag `v*` และดำเนินการติดตั้ง คอมไพล์ และทำ `npm publish` ขึ้นสู่นะบบ npmjs โดยอัตโนมัติ!

---

## 💻 รายการคำสั่งของ pgr_bin ที่พร้อมใช้งาน
* **`pgr_bin login`** - เชื่อมโยงบัญชีและเก็บ Session
* **`pgr_bin init`** - สร้างไฟล์ `pygrass.config.json` ในโฟลเดอร์โมเดล
* **`pgr_bin status`** - ตรวจสอบสถานะการเชื่อมต่อและโปรเจกต์
* **`pgr_bin publish`** - บีบอัดและอัปโหลดโมเดลขึ้น PyGrassReal Cloud
* **`pgr_bin logout`** - ลงชื่อออกและเคลียร์เซสชัน
