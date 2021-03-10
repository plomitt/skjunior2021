module.exports = function parseIncomingFiles(req) {
  return new Promise(function (resolve, reject) {
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      const filesPaths = renameFiles(files);
      resolve(filesPaths);
    });
  });
};
