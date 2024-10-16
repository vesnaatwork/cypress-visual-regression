// cleanupScreenshots.js
const fs = require('fs-extra');
const path = require('path');

// Define the paths whose contents you want to delete
const foldersToClean = [
  path.join(__dirname, 'cypress/screenshots', 'compare'), // Adjust the relative path as needed
  path.join(__dirname, 'cypress/screenshots', 'visualRegresion.spec.js') // Adjust the relative path as needed
];

// Function to delete contents of the specified folders
const cleanFolderContents = async (folder) => {
  try {
    if (await fs.pathExists(folder)) {
      const files = await fs.readdir(folder); // Get all files in the directory
      await Promise.all(files.map(file => fs.unlink(path.join(folder, file)))); // Delete each file
      console.log(`Cleaned contents of: ${folder}`);
    } else {
      console.log(`Folder not found: ${folder}`);
    }
  } catch (error) {
    console.error(`Error cleaning contents of ${folder}:`, error);
  }
};

// Run the cleanup for each folder
const cleanAllFolders = async () => {
  for (const folder of foldersToClean) {
    await cleanFolderContents(folder);
  }
  console.log('Cleanup complete!');
};

// Execute the cleanup function
cleanAllFolders().catch(err => {
  console.error('Error during cleanup:', err);
});
