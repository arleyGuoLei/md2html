const path = require("path");
const fs = require("fs");
const md = require("md-directory");

/**
 * 要转换的目录名称
 */
const dirName = "posts";
const outputName = `${dirName}_dist`;

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
const html = fs.readFileSync(path.join(__dirname, "src/index.html"), "utf-8");

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
  if (!fsExistsSync(path.join(__dirname, `${outputName}`))) {
    fs.mkdir(path.join(__dirname, `${outputName}`), function(error) {
      if (error) {
        console.log(error);
        return false;
      }
      console.log(`创建目录: ${path.join(__dirname, `${outputName}`)}`);
    });
  }
  fs.writeFileSync(path.join(__dirname, `${outputName}/${filename}`), content);
  console.log(`写出: ${path.join(__dirname, `${outputName}/${filename}`)}`);
});
