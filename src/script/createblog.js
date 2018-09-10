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


  const d = {article, ...blog};//keywords:blog.keywords, categroy:blog.categroy, title:blog.title, dateTime:blog.dateTime};
  ejs.renderFile('./views/front/blog/blog.ejs', d, function (err, html) {
    if (err) {
      console.info(err);
    }
    fs.writeFileSync(`./public/blog/${filename}.html`, html);
    console.info(`./public/blog/${filename}.html --- done`);
  });
};

const blogs = blogBLL.getAll();
blogs.sort(function(a,b){
  return a.filename.substring(0,10) < b.filename.substring(0,10)
})

//  生成博文
blogs.forEach(item => {
  item.dateTime = item.filename.substring(0, 10);
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

// 生成主页
ejs.renderFile('./views/front/index.ejs', {data:blogs}, function (err, html) {
  if (err) {
    console.info(err);
  }

  fs.writeFile('./public/index.html', html, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('./public/index.html 数据写入成功！');
  });
});

// 生成 关于页
ejs.renderFile('./views/front/about.ejs', {data:blogs}, function (err, html) {
  if (err) {
    console.info(err);
  }

  fs.writeFile('./public/about.html', html, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('./public/about.html 数据写入成功！');
  });
});
