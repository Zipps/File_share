var container = {
    "files": [
        {
            "key": Math.round(Math.random() * 100000000000),
            "filename": "test_file",
            "size": 10,
            "pageCount": 3,
            "contentType": "application/pdf",
            "uploadDate": Date.now()
        },
        {
            "key": Math.round(Math.random() * 100000000000),
            "filename": "test_file",
            "size": 10,
            "pageCount": 2,
            "contentType": "application/pdf",
            "uploadDate": Date.now()
        }
    ]
};

module.exports = container;
