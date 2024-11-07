const multer = require("multer");
const moment = require("moment");

const FileTypes = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const validFormat = FileTypes[file.mimetype];

    let errors = !validFormat ? new Error("Invalid Filetype") : null;

    cb(errors, `${process.env.FILESYSTEM_DISK}`);
  },
  filename: function (req, file, cb) {
    const fileExtension = FileTypes[file.mimetype];
    const timestamp = moment().format("YMDDHms");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${timestamp}_${uniqueSuffix}.${fileExtension}`);
  },
});

exports.uploadOptions = multer({
  storage: storage,
});
