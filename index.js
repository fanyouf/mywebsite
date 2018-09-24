const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
// app.use(express.bodyParser());
const path = require('path');


const multer = require('multer');

const upload = multer({
  dest: './public/blog/img',
});


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
const ejs = require('ejs');
app.set('view engine', 'ejs');
app.set('./views', path.join(__dirname, './views'));


const blogBLL = require('./src/bll/blog.js');


app.post('/uploadImg', upload.single('file'), function (req, res, next) {
  console.info(req.file.path, req.file.originalname, req.body);
  fs.rename(req.file.path, `./public/blog/img/${req.body.fileName}`, function (err) {
    if (err) {
      throw err;
    }
    console.log('上传成功!');
  });
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(req.file) + JSON.stringify(req.body));
});

app.get('/test', function (req, res) {
  // const rs = res.render('./blog/blog.ejs', {title:'asdfsd', dateTime:'asdfsd', article:'afds', titleName:'test'});
  const rs = ejs.render('aa<%- include("header.ejs") %>bb', {titleName:'test'});

//   ejs.renderFile(filename, data, options, function(err, str){
//     // str => 输出绘制后的 HTML 字符串
//     res.end(rs);
// });
});

app.get('/add', function (req, res) {
  const rs = res.render('./admin/add.ejs', {titleName:'test'});
  console.info(rs);
//  res.send('Hello World123');
});


app.get('/staticCategory', function (req, res) {
  const filename = req.query.filename;
  console.info(filename);
  if (blogBLL.staticCategory()) {
    res.json({success:true});
  }
  else {
    res.json({success:false});
  }
});

app.get('/static', function (req, res) {
  const filename = req.query.filename;
  console.info(filename);
  if (blogBLL.static(filename)) {
    res.json({success:true});
  }
  else {
    res.josn({success:false});
  }
});

app.get('/edit', function (req, res) {
  const filename = req.query.filename;
  const blog = blogBLL.getBlog(filename);
  res.render('./admin/edit.ejs', {blog});
});

app.get('/categoryDetail', function (req, res) {
  const title = req.query.title;
  console.info(req.query);
  fs.readFile('./views/admin/categoryDetail.ejs', function (err, data) {
    if (err) {
      console.info(err);
    }
    const template = data.toString();
    const blogs = blogBLL.getCategoryByName(title);
    const html = ejs.render(template, {blogs});// 用dictionary数据源填充template
    res.send(html);
  });
});

app.get('/category', function (req, res) {
  fs.readFile('./views/admin/categories.ejs', function (err, data) {
    if (err) {
      console.info(err);
    }

    const template = data.toString();
    const categories = blogBLL.getCategory();
    const html = ejs.render(template, {categories});// 用dictionary数据源填充template
    res.send(html);
  });
});

app.get('/admin', function (req, res) {
  fs.readFile('./views/admin/index.ejs', function (err, data) {
    if (err) {
      console.info(err);
    }

    const template = data.toString();
    const blogs = blogBLL.getAll();
    const html = ejs.render(template, {blogs});// 用dictionary数据源填充template
    res.send(html);

    fs.writeFile('static.html', html, function (err) {
      if (err) {
        return console.error(err);
      }
      console.log('数据写入成功！');
    });
  });
});

app.post('/add', function (req, res) {
  console.info(req.body);

  const response = {
    'title':req.body.title,
    'keywords':req.body.keywords,
    'content':req.body.content,
  };
  blogBLL.add(response);
  res.json(response);
});
app.post('/saveEdit', function (req, res) {
  if (blogBLL.saveEdit(req.body)) {
    res.json({success:1});
  }
  else {
    res.json({success:0});
  }
});


app.get('/admin', function (req, res) {
  res.end('管理员');
});
const server = app.listen(8081, function () {

  const host = server.address().address;
  const port = server.address().port;

  console.log('应用实例，访问地址为 http://%s:%s', host, port);

});
