const path = require("path");
const fs = require("fs");
const md = require("md-directory");

/**
 * 要转换的目录名称
 */
const dirName = "posts";
const outputName = `${dirName}_dist`;

console.log(`转换目录: ${dirName}`);
console.log(`输出目录: ${outputName}`);

/**
 * 目录是否存在
 * @param {String} path 文件夹路径
 */
function fsExistsSync(path) {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

const contents = md.parseDirSync(path.join(__dirname, dirName));
const html = fs.readFileSync(path.join(__dirname, "./index.html"), "utf-8");

if (!fsExistsSync(path.join(__dirname, `${outputName}`))) {
  fs.mkdirSync(path.join(__dirname, `${outputName}`));
  console.log(`创建目录: ${path.join(__dirname, `${outputName}`)}`);
}

Object.keys(contents).forEach(key => {
  const filename = key.replace(/\.md$/, ".html");
  /**
   * 替换标题
   */
  let content = html.replace("${{ title }}", key.replace(/\.md$/, ""));
  content = content.replace(
    "${{ article }}",
    contents[key].content.replace("\n", "")
  );

  fs.writeFileSync(path.join(__dirname, `${outputName}/${filename}`), content);
  console.log(`写出: ${path.join(__dirname, `${outputName}/${filename}`)}`);
});
