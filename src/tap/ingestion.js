/**
 * ingestion.js
 */
 // 

 //---- example  file reader
var fs = require('fs');


if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + ".");
    process.exit(-1);
}

var path = process.argv[2];

fs.readdir(path, function(err, items) {
    console.log(items);

    for (var i=0; i<items.length; i++) {
        console.log(items[i]);
    }
});
// build command pieces
let serveruri = 'http://dlwork.lib.utk.edu/dev/';
let contentmodel = 'islandora:sp_basic_image';
let parentpid = '';
let namespace = '';
// target is the local directory holding the ingest files
let target = '';
// execute drush command
var exec = require('child_process').exec;
var cmd = 'drush -v --user=user --uri='.serveruri.' ibsp --content_models='.contentmodel.' --type=directory --parent='.parentpid.' --namespace='.namespace.' --target=-v --user=user --uri=http://localhost ibsp --content_models=islandora:sp_basic_image --type=directory --parent=collections:sanborn --namespace=sanborn --target='target;

exec(cmd, function(error, stdout, stderr) {
  // command output is in stdout
});
