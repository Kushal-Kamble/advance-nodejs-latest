const express = require('express');
const app = express();
const path = require('path')

app.use(express.static(path.join(__dirname,'public')))

// static file ke liye jaise css image js waghera 

app.get('/', (req, res) => {
  const filePath = '/users/yahubaba/docs/report.pdf'
    
  // console.log("BaseName:" + path.basename(filePath))
  // console.log("DirName:" + path.dirname(filePath))
  // console.log("ExtName:" + path.extname(filePath))

  // const parsed = path.parse(filePath)
  // console.log(parsed)

  const fullPath = path.join(__dirname,'public','images','avatar.jpg')
  console.log(fullPath)

  // const absolutePath = path.resolve('public', 'image.jpg')
  // console.log(absolutePath)

  res.send("Path Module")
});


app.listen(5000, () => {
    console.log(`Server is running on port 5000`);
});
