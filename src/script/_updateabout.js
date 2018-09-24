const markjs = require('marked');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const blogBLL = require('../bll/blog.js');
const filePath = './src/blog/';

const blogs = blogBLL.getAll();
blogs.sort(function(a,b){
  return a.filename.substring(0,10) < b.filename.substring(0,10)
})


// 生成 关于页
ejs.renderFile('./views/front/about.ejs', {data:blogs,title:'关于我'}, function (err, html) {
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
