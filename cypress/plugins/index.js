const fs = require('fs-extra');
const path = require('path');

module.exports = (on, config) => {
  on('task', {
    readScreenshotFile({ filePath }) {
      const resolvedPath = path.resolve(filePath);
      if (fs.existsSync(resolvedPath)) {
        return fs.readFileSync(resolvedPath, 'base64');
      }
      throw new Error(`File not found: ${resolvedPath}`);
    },
    writeScreenshotFile({ filePath, content }) {
      fs.ensureDirSync(path.dirname(filePath));
      fs.writeFileSync(path.resolve(filePath), content, 'base64');
      return null;
    },
    log(message) {
      console.log(message);
      return null;
    }
  });

  return config;
};