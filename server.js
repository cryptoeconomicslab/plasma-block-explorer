const express = require('express');
const app = express();

app.use(express.static('dist'));

app.listen(1234, () => {
  console.log('Example app listening on port 1234!');
});

