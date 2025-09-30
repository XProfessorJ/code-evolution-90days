const fs = require("fs");
const path = require("path");

const filename = process.argv[2]; // 获取命令行参数
if (!filename) {
  console.error("❌ 请输入文件名，例如: npm run challenge -- hello.ts");
  process.exit(1);
}

const srcDir = path.join(__dirname, "../src");
if (!fs.existsSync(srcDir)) {
  fs.mkdirSync(srcDir);
}

// 1. 创建文件
const filePath = path.join(srcDir, filename);
fs.writeFileSync(filePath, "", { flag: "wx" }); // flag=wx 避免覆盖已有文件

// 2. 获取当前日期 (YYYY-MM-DD)
const now = new Date();
const dateStr = now.toISOString().split("T")[0]; // e.g. "2025-09-30"

// 3. 写入 README.md
const readmePath = path.join(__dirname, "../README.md");
// fs.appendFileSync(readmePath, `    - ${filename}  ${dateStr}\n`);
fs.appendFileSync(readmePath, `|${filename}|${dateStr}| |\n`);
console.log(`✅ 已创建 src/${filename} 并写入 README.md (${dateStr})`);
