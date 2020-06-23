var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
 
function templateHTML(title, list, body){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <a href="/create">create</a> <!--create라는 페이지로 이동 -->
    ${body}
  </body>
  </html>
  `;
}
function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}
 
var app = http.createServer(function(request,response){ 
    //app에 접속할 때마다 create서버에 전달된 콜백함수를 요청하여 사용함 
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
          response.writeHead(200);
          response.end(template);
        });
      } else {
        fs.readdir('./data', function(error, filelist){
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    } else if(pathname === '/create'){  //create누르면 글작성 ui나오고 post형식으로 전송
      fs.readdir('./data', function(error, filelist){
        var title = 'WEB - create';
        var list = templateList(filelist);
        var template = templateHTML(title, list, `
          <form action="http://localhost:3000/create_process" method="post">  
          <!--url안에 쿼리스트링으로 보내는 데이터가 보이면 안되니까 post로 숨김-->
          <!--method생략하면 get으로 받아들여짐--> 

            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `);
        response.writeHead(200);
        response.end(template);
      });
    }else if(pathname==='/create_process') {
        var body = '';
        request.on('data', function(data){ 
        //post방식으로 전송되는 데이터의 양이 많을경우, 
        //조각조각 서버쪽에서 수신할 때마다 콜백함수 호출
        //data라는 인자를 통해 전송
            body = body + data;
        });
        request.on('end', function(){
        //더이상 들어올 정보가 없으면 end 다음 함수 호출 
            var post = qs.parse(body);
            //qs라는 모듈이 갖고있는 함수중에 parse를 사용하여
            //우리가 갖고있는 body를 포스트에 담아죠!
            // -> 정보객체화
            var title = post.title;
            var description = post.description
        });
        
        response.writeHead(200);
        response.end('success');
      } 
    
    else {
      response.writeHead(404);
      response.end('Not found');
    }
 
 
 
});
app.listen(3000);