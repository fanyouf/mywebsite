const fs = require('fs');
const url = './src/db/blog.log';
const mdUrl = "./src/blog/"
const filePath = './src/blog/';
const path = require('path')
const markjs = require('marked')
const ejs = require('ejs');

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
exports.getCategoryByName = function(title){
  if(title ==='other')
    title = ''
  const allblog = getAll();
  return allblog.filter(item=>item.categroy == title)
};
exports.getCategory = function(){
  const allblog = getAll();
  let rs = {}

  allblog.forEach(item => {
    let c = item.categroy || 'other'
    rs[c] = (rs[c] ? parseInt(rs[c]) : 0) + 1
    
  });
  let arr = []
  for( var k in rs){
    arr.push({title:k,num:rs[k]})
  }
  return arr;
}

exports.staticCategory = function(){
  const allblog = getAll();
  let rs = {}

  allblog.forEach(item => {
    let c = item.categroy || 'other'
    rs[c] = (rs[c] ? parseInt(rs[c]) : 0) + 1
    
  });
  let arr = []
  for( var k in rs){
    arr.push({title:k,num:rs[k]})
  }
  ejs.renderFile('./views/front/categories.ejs',{categories:arr}, function(err, html){
    if(err){
      console.info(err)
    }

    fs.writeFileSync(`./public/categories.html`, html);
  });

}
exports.static = function(filename){
  const fileFullName = path.join(filePath, filename);

  const data = fs.readFileSync(fileFullName, 'utf8');
  const blogs = getAll();
  const blog = blogs.find(item=>item.filename)
  const article = markjs(data);
  const d = {article, keywords:blog.keywords,title:blog.title, dateTime:blog.filename.substring(0, 10)}
  ejs.renderFile('./views/front/blog/blog.ejs', d, function(err, html){
    if(err){
      console.info(err)
    }
    // str => 输出绘制后的 HTML 字符串
    console.info(html)
    fs.writeFileSync(`./public/blog/${filename}.html`, html);
  });

  return true;
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
        item.categroy = blog.categroy;
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
  const rs = getAll();
  const d = new Date();
  let filename = [
    d.getFullYear(),
    d.getMonth() > 9 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`, // 月份
    d.getDate() > 10 ? d.getDate() : `0${d.getDate()}`, // 日
    d.getHours() > 10 ? d.getHours() : `0${d.getHours()}`, // 小时
    d.getMinutes() > 10 ? d.getMinutes() : `0${d.getMinutes()}`, // 分
    d.getSeconds() > 10 ? d.getSeconds() : `0${d.getSeconds()}`,
    d.getMilliseconds(), // 毫秒
  ].join('-');
  filename = `${filename}.md`;
    
  let index = 1;
  if (rs.length !== 0) {
    index = rs[rs.length - 1].index + 1;
  }
  rs.push({index,categroy:params.categroy,title:params.title, keywords:params.keywords, filename});

  const str = JSON.stringify(rs);

  fs.writeFileSync(url, str)

  console.log('blog添加写入blog.log成功！');
  fs.writeFileSync(`./src/blog/${filename}`, params.content)
  console.info(`保存md文件 ./src/blog/${filename} 成功`);
  return true;
};

