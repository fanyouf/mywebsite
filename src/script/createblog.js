const markjs = require('marked');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const filePath = './src/blog/';
const results = [];

const create = function (filename) {
  const fileFullName = path.join(filePath, filename);


  const data = fs.readFileSync(fileFullName, 'utf8');

  const index = data.indexOf('#');
  const strs = data.substring(0, index);
  const article = markjs(data.substring(index));

  results.push(Object.assign(JSON.parse(strs), {filePath:filename}));

  fs.readFile('./views/blog/blog.ejs', function (err, data) {
    if (err) {
      console.info(err);
    }
    const template = data.toString();
    const html = ejs.render(template, {article});// 用dictionary数据源填充template

    fs.writeFile(`./public/blog/${filename}.html`, html, function (err) {
      if (err) {
        return console.error(err);
      }
      console.log('数据写入成功！');
    });
  });


};


fs.readdir(filePath, function (err, files) {
  if (err) {
    console.log(err);

    return;
  }
  const count = files.length;
  // console.log(files);

  files.forEach(function (filename) {
    const fileFullName = path.join(filePath, filename);
    // filePath+"/"+filename不能用/直接连接，Unix系统是”/“，Windows系统是”\“
    fs.stat(fileFullName, function (err, stats) {
      if (err) throw err;
      // 文件
      if (stats.isFile()) {
        create(filename);
      }
    });
  });

  fs.readFile('./views/index.ejs', function (err, data) {
    if (err) {
      console.info(err);
    }
    const template = data.toString();
    const html = ejs.render(template, {data:results});// 用dictionary数据源填充template


    fs.writeFile('./public/index.html', html, function (err) {
      if (err) {
        return console.error(err);
      }
      console.log('数据写入成功！');
    });
  });
});


// 读入


