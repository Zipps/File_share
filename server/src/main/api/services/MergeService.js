/**
 * MergePdfs.js
 *
 * @description :: This is the service for merging PDF files
 * @docs        ::
 */


var fs = require('fs');
var PDFMerge = require('pdf-merge');
var pdfPageCount = require('pdf_page_count');
var pdfkit = require('pdfkit');
var Container = require('../model/UploadFileModel');
var uid = require('uid');
var async = require('async');

//  Constants
var PDFTK_PATH = 'C:/PDFtk_Server/bin/pdftk.exe';
var PDF_EXT = '.pdf';
var FILE_STORAGE = './server/file_storage/';
var TEMP_NAME = 'merged_doc.pdf';

module.exports.merge = function (params, callback) {
    
};