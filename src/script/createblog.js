const markjs = require('marked');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const blogBLL = require('../bll/blog.js');
const filePath = './src/blog/';
const results = [];

const create = function (blog) {
  const filename = blog.filename;
  const fileFullName = path.join(filePath, filename);

  const data = fs.readFileSync(fileFullName, 'utf8');
  const article = markjs(data);


  const d = {article, title:blog.title, dateTime:blog.filename.substring(0, 10)};
  ejs.renderFile('./views/blog/blog.ejs', d, function (err, html) {
    if (err) {
      console.info(err);
    }
    fs.writeFileSync(`./public/blog/${filename}.html`, html);
    console.info(`./public/blog/${filename}.html --- done`);
  });
};

const blogs = blogBLL.getAll();

blogs.forEach(item => {
  const fileFullName = path.join(filePath, item.filename);
  // filePath+"/"+filename不能用/直接连接，Unix系统是”/“，Windows系统是”\“
  fs.stat(fileFullName, function (err, stats) {
    if (err) throw err;
    // 文件
    if (stats.isFile()) {
      create(item);
    }
  });
});

fs.readFile('./views/index.ejs', function (err, data) {
  if (err) {
    console.info(err);
  }
  const template = data.toString();
  const html = ejs.render(template, {data:blogs});// 用dictionary数据源填充template


  fs.writeFile('./public/index.html', html, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('./public/index.html 数据写入成功！');
  });
});
