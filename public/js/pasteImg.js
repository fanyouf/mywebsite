
// 上传图片的具体操作，与具体的服务器端代码有关
const uploadImg = (blog, fileName) => {
  const data = new FormData();
  data.append('file', blog);
  data.append('fileName', fileName);

  return fetch('./uploadImg', {
    method:'post',
    body:data,
  });
};

// 把textarea中选中的内容设置成指定的内容。如果当前并没有选中任何内容，相当于在光标处插入指定内容，
const changeSelectedText = (str) => {
  const obj = document.getElementById('md');

  if (window.getSelection) {
    // 非IE浏览器
    console.log('非IE：');
    obj.setRangeText(str);
    //  在未选中文本的情况下，重新设置光标位置
    obj.selectionStart += str.length;
    obj.focus();

  } else if (document.selection) {
    // IE浏览器
    console.log('IE：');
    obj.focus();
    const sel = document.selection.createRange();
    sel.text = str;
  }

};

const paste_img = (e) => {
  if (e.clipboardData && e.clipboardData.items) {
    const imageContent = e.clipboardData.getData('image/png');
    ele = e.clipboardData.items;
    for (let i = 0; i < ele.length; ++i) {
      // 粘贴图片
      if (ele[i].kind === 'file' && ele[i].type.indexOf('image/') !== -1) {
        const blob = ele[i].getAsFile();
        const filename = `${Date.now()}.png`;
        uploadImg(blob, filename).then(rs => {
          changeSelectedText(`![filename](${document.location.origin}/blog/img/${filename})`);

        });
      }
      // 粘贴文本
      else if (ele[i].kind === 'string' && ele[i].type.indexOf('text/plain') != -1) {
        // 粘贴文本回调函数
        ele[i].getAsString(
          function (str) {
            // insertHtmlAtCaret(document.createTextNode(str));//插入文本到光标处 并移动光标到新位置
          });
      }
      else return;
    }
  }
  else {
    alert('不支持的浏览器');
  }
};


getSelectedText = () => {
  const obj = document.getElementById('md');
  let userSelection;

  if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
    // 非IE浏览器
    // 获取选区的开始位置
    const startPos = obj.selectionStart,
      // 获取选区的结束位置
      endPos = obj.selectionEnd;
    console.log('非IE：');
    console.log(`选区开始点：${startPos}，选区结束点：${endPos}`);

    userSelection = obj.value.substring(startPos, endPos);

  } else if (document.selection) {
    // IE浏览器
    console.log('IE：');
    userSelection = document.selection.createRange().text;
  }

  return userSelection;
};

// 绑定粘贴事件
document.getElementById('md').onpaste = function (event) {
  paste_img(event);
};
