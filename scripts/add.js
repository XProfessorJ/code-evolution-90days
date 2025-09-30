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

// 2. 写入 README.md
const readmePath = path.join(__dirname, "../README.md");
fs.appendFileSync(readmePath, `    ${filename}\n`);

console.log(`✅ 已创建 src/${filename} 并写入 README.md`);
