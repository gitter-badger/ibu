/**
 * ingestion.js
 * expects:  
 * 1. path of directory
 * 2. namespace
 * 3. model
 * output:
 *  log of drush run
 */
 // 
// build command pieces
// serveruri is the location of the drupal_home on the drupal server
let serveruri = 'http://dlwork.lib.utk.edu/dev/';
let contentmodel = 'islandora:sp_basic_image';
let parentpid = '';
// namespace
let namespace = '';
// target is the local directory holding the ingest files
let target = '';
// execute drush command
var exec = require('child_process').exec;
var cmd = 'drush -v --user=user --uri='.serveruri.' ibsp --content_models='.contentmodel.' --type=directory --parent='.parentpid.' --namespace='.namespace.' --target=-v --user=user --uri=http://localhost ibsp --content_models=islandora:sp_basic_image --type=directory --parent=collections:sanborn --namespace=sanborn --target='target;

exec(cmd, function(error, stdout, stderr) {
  // command output is in stdout
  console.log(error);
});