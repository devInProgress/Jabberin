fs = require('fs');

function displayDirectories(err, directories) {
  console.log(directories);
}

fs.readdir('../', displayDirectories);

console.log('supposed to execute after readdir operation');