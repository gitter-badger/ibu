/**
 * [IMGvalidation evaluates a large image and ensures it meets standards set here: https://wiki.lib.utk.edu/pages/viewpage.action?pageId=11927581]
 * @param  {[String]} input [Image filename]
 * @return {[Array]}       [Success] or [Collection, Filename, Error 1, Error 2, Error 3, ...]
 *
 */

var exif = require('exiftool');
var fs   = require('fs');
var status = [];
var filename;
const IbuErrorDoc = require('./schema');
const db = require('../config/db');

function fileRead(err, data){
  var message;
  console.log(filename);
  if (err){
    message = "Cannot read file";
  }
  else {
    message = "Successfully read file";
  }
  postResults(message, data);
}

function postResults(x, data) {
  switch(x){
    case "Cannot read file":
      status.push(x);
      postStatus(status);
      break;
    case "Cannot read exif data":
      status.push(x);
      postStatus(status);
      break;
    case "Successfully read file":
      exif.metadata(data, testExif);
      break;
    case "Successfully read exif":
      readExif(data);
      break;
  }
}

function postStatus(x, y){
  IbuErrorDoc.findOneAndUpdate({"filename":filename,"collection":y,"IMGerrors":x});
}

function testExif(err, metadata){
  var message;
  if(err){
    message = "Cannot read exif data";
  }
  else {
    message = "Successfully read exif";
  }
  postResults(message, metadata);
}

function readExif(metadata) {
  var collection;
  if(metadata['keywords']){
    collection = metadata['keywords'];
  }
  else {
    collection = "No collection";
  }
  console.log(metadata);
    switch(metadata['description']) {
    // Test for Book Imaging
    case 'Book Imaging':
      // Is it a TIFF or a JP2
      if ((metadata['format'] != 'image/tiff') && (metadata['fileType'] != 'TIFF') && (metadata['fileTypeExtension'] != 'tif') && (metadata['fileTypeExtension'] != 'jp2')) {
        status.push("Incorrect file format")
      }
      // Is it 400 PPI
      if (metadata['xResolution'] != '400' || metadata['yResolution'] != '400') {
        status.push("Incorrect PPI")
      }
      // Is it 16 Bit Depth
      if (metadata['bitsPerSample'] == '8 8 8') {
        status.push("Wrong Color Depth")
      }
      // Is it Color
      if (metadata['colorSpaceData'] != 'RGB') {
        status.push("Not color")
      }
      break;
    case 'Document Imaging':
      // Is it a TIFF or a JP2
      if ((metadata['format'] != 'image/tiff') && (metadata['fileType'] != 'TIFF') && (metadata['fileTypeExtension'] != 'tif') && (metadata['fileTypeExtension'] != 'jp2')) {
        status.push("Incorrect file format")
      }
      // Is it 400 PPI
      if (metadata['xResolution'] != '400' || metadata['yResolution'] != '400') {
        status.push("Incorrect PPI")
      }
      // Is it 16 Bit Depth
      if (metadata['bitsPerSample'] == '8 8 8') {
        status.push("Wrong Color Depth")
      }
      // Is it Color
      if (metadata['colorSpaceData'] != 'RGB') {
        status.push("Not color")
      }
      break;
    //Test for Maps, Drawings, and Oversize Materials
    case 'Maps, Drawings, Over-sized Original':
      //Is it a TIFF or JP2
      if ((metadata['format'] != 'image/tiff') && (metadata['fileType'] != 'TIFF') && (metadata['fileTypeExtension'] != 'tif') && (metadata['fileTypeExtension'] != 'jp2')) {
        status.push("Incorrect file format")
      }
      // Is it 400 PPI
      if (metadata['xResolution'] != '400' || metadata['yResolution'] != '400') {
        status.push("Incorrect PPI")
      }
      // Is it 8 Bit Color Depth
      if (metadata['bitsPerSample'] != '8 8 8') {
        status.push("Wrong Color Depth")
      }
      break;
    // Test for Photographs
    case 'Photographs':
      if ((metadata['format'] != 'image/tiff') && (metadata['fileType'] != 'TIFF') && (metadata['fileTypeExtension'] != 'tif')) {
        status.push("Incorrect file format")
      }
      // Is it Color
      if (metadata['colorSpaceData'] != 'RGB') {
        status.push("Not color")
      }
      // Is it 600 PPI
      if (metadata['xResolution'] != '600' || metadata['yResolution'] != '600') {
        status.push("Incorrect PPI")
      }
      // Is it 16 Bit Depth
      if (metadata['bitsPerSample'] == '8 8 8') {
        status.push("Wrong Color Depth")
      }
      break;
    // Test for Small Negatives
    case 'Photographic Still Film up to 4" x 5"':
      if ((metadata['format'] != 'image/tiff') && (metadata['fileType'] != 'TIFF') && (metadata['fileTypeExtension'] != 'tif')) {
        status.push("Incorrect file format")
      }
      // Is it 4000 PPI
      if (metadata['xResolution'] != '4000' || metadata['yResolution'] != '4000') {
        status.push("Incorrect PPI")
      }
      // Is it 16 Bit Depth
      if (metadata['bitsPerSample'] == '8 8 8') {
        status.push("Wrong Color Depth")
      }
      break;
    // Test for Larger Negatives
    case 'Photographic Still Film Larger than 4" x 5"':
      if ((metadata['format'] != 'image/tiff') && (metadata['fileType'] != 'TIFF') && (metadata['fileTypeExtension'] != 'tif')) {
        status.push("Incorrect file format")
      }
      // Is it 4000 PPI
      if (metadata['xResolution'] != '2000' || metadata['yResolution'] != '2000') {
        status.push("Incorrect PPI")
      }
      // Is it 16 Bit Depth
      if (metadata['bitsPerSample'] == '8 8 8') {
        status.push("Wrong Color Depth")
      }
      break;
    // Test for Artwork Reproduction
    case 'Reproduction of Artwork':
      if ((metadata['format'] != 'image/tiff') && (metadata['fileType'] != 'TIFF') && (metadata['fileTypeExtension'] != 'tif')) {
        status.push("Incorrect file format")
      }
      // Is it Color
      if (metadata['colorSpaceData'] != 'RGB') {
        status.push("Not color")
      }
      // Is it 12000 PPI
      if (metadata['xResolution'] != '12000' && metadata['yResolution'] != '12000') {
        status.push("Incorrect PPI")
      }
      // Is it 16 Bit Depth
      if (metadata['bitsPerSample'] == '8 8 8') {
        status.push("Wrong Color Depth")
      }
      break;
    default:
      status.push("No material type description declared.");
  }
  if (status.length >= 1){
    status.splice(0, 0, metadata['keywords'], filename);
    postStatus(status, collection);
  }
  if (status.length == 0){
    status.push('Success');
    postStatus(status, collection);
  }
}

function startProcessing (file, callback){
  fs.readFile(file, callback);
};

module.exports = function letsBegin(file){
  filename = file;
  console.log(file, filename);
  startProcessing(file,fileRead);
};


