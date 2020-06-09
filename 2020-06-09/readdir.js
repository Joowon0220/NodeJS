var testFolder = './data/';
var fs = require('fs');

fs.readdir(testFolder, function(error, filelist){
    console.log(filelist);  //배열의 형태로 디렉토리에 있는 파일목록을 알려줌
})