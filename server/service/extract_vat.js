var Promise = require('bluebird');
var inspect = require('eyes').inspector({
  maxLength:20000,
  stream: null
});
var pdf_extract = require('pdf-extract');

var options = {
  type: 'ocr'
}

const vatRegExp = /(FR)?( [0-9A-Z]{2}|[0-9A-Z]{2})( [0-9]{9}|[0-9]{9})/g

var extractVat = function(data) {
  var matches = []
  while (match = vatRegExp.exec(data)) {
    if (match[1] && match[2] && match[3]) {
      matches.push(match[0])
    }
  }

  if (matches.length == 0) {
    return false
  }

  return matches.map(sanitizeVat)
};

var sanitizeVat = function(vat) {
  return vat.replace(/\s+/g, '');
};

module.exports = function(url) {
  return new Promise(function(resolve, reject) {

    processor = pdf_extract(url, options, function(err) {
      if (err) {
        return reject(err);
      }
    });

    processor.on('complete', function(data) {
      ocrResult = inspect(data.text_pages);

      if (vat = extractVat(ocrResult)) {
        return resolve(vat);
      } else {
        error = new Error('no valid vat in this file');
        return reject(error);
      }
    });

    processor.on('error', reject);
  });
};
