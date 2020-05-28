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
  Demonstration of parsing binary files from  Quick, Draw! dataset with NodeJS.

  https://github.com/googlecreativelab/quickdraw-dataset
  https://quickdraw.withgoogle.com/data

  This demo assumes you've put the file "face.bin" into a folder called "data"
  in the same directory as this script.
*/
var fs = require('fs');
var Parser = require('binary-parser').Parser;
var BigInteger = require('javascript-biginteger').BigInteger;

var Drawing = Parser.start()
  .endianess('little')
  .array('key_id', {
      type: 'uint8',
      length: 8
  })
  .string('countrycode', { length: 2, encoding: 'ascii' })
  // .uint8('recognized')
  .bit1('recognized')
  .uint32le('timestamp') // unix timestamp in seconds
  .uint16le('n_strokes')
  .array('strokes', {
    type: Parser.start()
      .uint16le('n_points')
      .array('x', {
        type: 'uint8',
        length: 'n_points'
      })
      .array('y', {
        type: 'uint8',
        length: 'n_points'
      }),
    length: 'n_strokes'
  });

function parseBinaryDrawings(fileName, callback) {
  fs.readFile(fileName, function(err, buffer) {
    var unpacked = Parser.start()
      .array('drawings', {
          type: Drawing,
          // length: 2
          readUntil: 'eof'
      }).parse(buffer);
    // console.log("unpacked", unpacked)
    var drawings = unpacked.drawings.map(function(d) {
      var ka = d.key_id;
      // the key is a long integer so we have to parse it specially
      var key = BigInteger(0);
      for (var i = 7; i >= 0; i--) {
        key = key.multiply(256);
        key = key.add(ka[i]);
      }
      var strokes = d.strokes.map(function(d,i) { return [ d.x, d.y ] });
      return {
        'key_id': key.toString(),
        'countrycode': d.countrycode,
        'recognized': !!d.recognized, //convert to boolean
        'timestamp': d.timestamp * 1000, // turn it into milliseconds
        'drawing': strokes
      }
    })
    callback(null, drawings);
  })
}

parseBinaryDrawings("data/face.bin", function(err, drawings) {
  if(err) return console.error(err);
  drawings.forEach(function(d) {
    // Do something with the drawing
    console.log(d.key_id, d.countrycode)
  })
  console.log("# of drawings:", drawings.length)
})
