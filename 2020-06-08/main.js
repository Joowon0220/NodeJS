var http = require('http');
var fs = require('fs');
var url = require('url');
 
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

 
    if(pathname === '/'){ // pathname을 통해서는 홈과 각각의 페이지 구분 불가 (/밑으로 추가되는게 아니라서)
      if(queryData.id === undefined){ //queryData.id가 없으면 홈, 있으면 페이지
       
      fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
        var title = 'welcome';
        var description = 'Hello, Node.js';
        var template = `
        <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          <ul>
            <li><a href="/?id=HTML">HTML</a></li>
            <li><a href="/?id=CSS">CSS</a></li>
            <li><a href="/?id=JavaScript">JavaScript</a></li>
          </ul>
          <h2>${title}</h2>
          <p>${description}</p>
        </body>
        </html>
        `;
        response.writeHead(200);
        response.end(template);
      });
    }else{
      fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
        //특정 디렉토리 안에서 파일을 읽어서 description이라는 변수값을 생성
        var title = queryData.id;
        var template = `
        <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          <ul>
            <li><a href="/?id=HTML">HTML</a></li>
            <li><a href="/?id=CSS">CSS</a></li>
            <li><a href="/?id=JavaScript">JavaScript</a></li>
          </ul>
          <h2>${title}</h2>
          <p>${description}</p> 
        </body>
        </html>
        `;
        response.writeHead(200);
        response.end(template);
      });

    }
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
 
 
 
});
app.listen(3000);