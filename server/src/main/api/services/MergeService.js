/**
 * MergePdfs.js
 *
 * @description :: This is the service for merging PDF files
 * @docs        ::
 */





module.exports.mergePdf = function(fileDirectory, outputFileName) {
    var merge = new PDFMerge(pdfFileList(fileDirectory), PDFTK_PATH);
    merge.asNewFile(outputFilePath(fileDirectory, outputFileName)).merge(function(err) {
        if(err != null){
            console.log("Error merging files: " + err);
        }
        else {
            console.log("Files merged.");
        }
    });
};

var pdfFileList = function(fileDirectory) {
    var pdfList = [];
    fs.readdirSync(fileDirectory).forEach(function(file) {
        var fileExtention = path.extname(file);
        if (fileExtention == PDF_EXT) {
            console.log(fileDirectory + file);
            pdfList.push(fileDirectory + '/' + file);
        }
    });
    return pdfList;
};

var outputFilePath = function(outputDirectory, outputFileName) {
    var fileExtention = path.extname(outputFileName);
    if(fileExtention != PDF_EXT) {
        outputFileName += PDF_EXT;
    }
    return outputDirectory + '/' + outputFileName;
};