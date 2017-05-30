/*
Copyright 2017 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/*
  Demonstration of parsing simplified ndjson files from  Quick, Draw! dataset with node.js.
  Read in all of the simplified drawings into memory and log out some properties.

  https://github.com/googlecreativelab/quickdraw-dataset
  https://quickdraw.withgoogle.com/data

  This demo assumes you've put the file "face-simple.ndjson" into a folder called "data"
  in the same directory as this script.
*/
var fs = require('fs');
var ndjson = require('ndjson'); // npm install ndjson

function parseSimplifiedDrawings(fileName, callback) {
  var drawings = [];
  var fileStream = fs.createReadStream(fileName)
  fileStream
    .pipe(ndjson.parse())
    .on('data', function(obj) {
      drawings.push(obj)
    })
    .on("error", callback)
    .on("end", function() {
      callback(null, drawings)
    });
}

parseSimplifiedDrawings("data/face-simple.ndjson", function(err, drawings) {
  if(err) return console.error(err);
  drawings.forEach(function(d) {
    // Do something with the drawing
    console.log(d.key_id, d.countrycode);
  })
  console.log("# of drawings:", drawings.length);
})
