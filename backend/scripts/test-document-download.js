const { sequelize } = require('../config/database');
const User = require('../models/User');
const Document = require('../models/Document');
const path = require('path');
const fs = require('fs').promises;

const testDocumentDownload = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Connected to database successfully.');

    // Check user@gmail.com
    const user = await User.findOne({
      where: { email: 'user@gmail.com' }
    });

    if (!user) {
      console.log('❌ User with email user@gmail.com not found!');
      return;
    }

    console.log('✅ User found:');
    console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);

    // Check user's documents
    const documents = await Document.findAll({
      where: { user_id: user.id }
    });

    console.log(`\nFound ${documents.length} document(s) for user@gmail.com:`);
    
    if (documents.length === 0) {
      console.log('❌ No documents found for user@gmail.com');
      console.log('The user needs to upload documents first before admin can download them.');
      return;
    }

    documents.forEach((doc, index) => {
      console.log(`\nDocument ${index + 1}:`);
      console.log(`- ID: ${doc.id}`);
      console.log(`- Original Filename: ${doc.original_filename}`);
      console.log(`- Stored Filename: ${doc.filename}`);
      console.log(`- File Path: ${doc.filepath}`);
      console.log(`- File Size: ${doc.file_size} bytes`);
      console.log(`- MIME Type: ${doc.mime_type}`);
      console.log(`- Upload Date: ${doc.upload_date}`);
      
      // Check if file exists on filesystem
      fs.access(doc.filepath)
        .then(() => {
          console.log(`- File Status: ✅ File exists on filesystem`);
        })
        .catch(() => {
          console.log(`- File Status: ❌ File NOT found on filesystem`);
        });
    });

    // Check uploads directory
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    console.log(`\nChecking uploads directory: ${uploadsDir}`);
    
    try {
      const files = await fs.readdir(uploadsDir);
      console.log(`Files in uploads directory: ${files.length}`);
      files.forEach(file => {
        console.log(`- ${file}`);
      });
    } catch (error) {
      console.log(`❌ Error reading uploads directory: ${error.message}`);
    }
    
    // Close database connection
    await sequelize.close();
    console.log('\nDatabase connection closed.');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Run the script
testDocumentDownload(); 