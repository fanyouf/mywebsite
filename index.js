const express = require('express');
const app = express();
const fs = require('fs');

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

const ejs = require('ejs');
app.set('view engine', 'ejs');


app.get('/get', function (req, res) {
  const rs = res.render('index.ejs', {titleName:'test'});
  console.info(rs);
//  res.send('Hello World123');
});

app.get('/static', function (req, res) {
  fs.readFile('./views/index.ejs', function (err, data) {
    if (err) {
      console.info(err);
    }
    const template = data.toString();
    const html = ejs.render(template, {titleName:'test'});// 用dictionary数据源填充template
    res.send(html);

    fs.writeFile('static.html', html, function (err) {
      if (err) {
        return console.error(err);
      }
      console.log('数据写入成功！');
    });
  });
});
const server = app.listen(8081, function () {

  const host = server.address().address;
  const port = server.address().port;

  console.log('应用实例，访问地址为 http://%s:%s', host, port);

});
