const fs = require('fs');
const url = './src/db/blog.log';
const mdUrl = "./src/blog/"
const getAll = function () {
  const d = fs.readFileSync(url);

  return JSON.parse(d);
};
const writeLog = function (data){
    fs.writeFile(url, JSON.stringify(data), function (err) {
        if (err) {
          return console.error(err);
        }
        console.info('保存blog.log成功');
      });
}
exports.saveEdit = function(blog){
    // 保存新的md文件
    fs.writeFile(`./src/blog/${blog.filename}`, blog.content, function (err2) {
        if (err2) {
          return console.error(err2);
        }
        console.info('保存md文件成功');
      });
    // 更新 blog.log
    let rs = getAll();
    let item = rs.find(item => item.filename === blog.filename)
    if (item) {
        item.title = blog.title;
        item.keywords = blog.keywords;
    }
    try{

        writeLog(rs);
    }
    catch(e){
        return false;
    }

    return true;
}
exports.getBlog = function (filename) {
  const allblog = getAll();
  //console.info(allblog)
  let item = allblog.find(item => item.filename === filename)
  if (item) {
    return {
        ...item,
        content:fs.readFileSync(mdUrl+"/"+filename)
    }
  }
  else {
    return null;
  }

};

exports.getAll = getAll;
exports.add = function (params) {
  fs.readFile(url, function (err, data) {
    if (err) {
      console.info(err);
    }
    const d = new Date();
    let filename = [
      d.getFullYear(),
      d.getMonth() > 9 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`, // 月份
      d.getDate() > 10 ? d.getDate() : `0${d.getDate()}`, // 日
      d.getHours(), // 小时
      d.getHours(), // 小时
      d.getMinutes(), // 分
      d.getMilliseconds(), // 毫秒
    ].join('-');
    filename = `${filename}.md`;
    const rs = JSON.parse(data.toString());
    let index = 1;
    if (rs.length !== 0) {
      index = rs[rs.length - 1].index + 1;
    }
    rs.push({index, title:params.title, keywords:params.keywords, filename});

    const str = JSON.stringify(rs);
    fs.writeFile(url, str, function (err1) {
      if (err) {
        return console.error(err1);
      }
      console.log('blog添加写入blog.log成功！');
      fs.writeFile(`./src/blog/${filename}`, params.content, function (err2) {
        if (err) {
          return console.error(err2);
        }
        console.info('保存md文件成功');
      });
    });
  });

};

