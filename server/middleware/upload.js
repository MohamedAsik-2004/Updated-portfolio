const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = 'uploads/';
    
    if (file.fieldname === 'resume' || file.originalname.endsWith('.pdf')) {
      dest = 'uploads/resume/';
    } else if (file.fieldname === 'profilePhoto' || file.fieldname === 'heroPhoto') {
      dest = 'uploads/profile/';
    } else {
      dest = 'uploads/projects/';
    }

    const absoluteDest = path.join(__dirname, '..', dest);

    if (!fs.existsSync(absoluteDest)) {
      fs.mkdirSync(absoluteDest, { recursive: true });
    }
    
    cb(null, absoluteDest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (file.fieldname === 'resume') {
      // Overwrite/store as static filename for easier linking
      cb(null, `resume${ext}`);
    } else {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  
  const ext = path.extname(file.originalname).toLowerCase();
  const isValidExt = allowedExtensions.includes(ext);
  const isValidMime = allowedMimeTypes.includes(file.mimetype);

  if (isValidExt && isValidMime) {
      cb(null, true);
  } else {
      cb(new Error('Invalid file type. Only JPG, JPEG, PNG, WEBP, and PDF files are allowed.'), false);
  }
};

// 10MB general limit
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

module.exports = upload;
