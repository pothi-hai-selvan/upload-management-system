const { sequelize } = require('../config/database');
const User = require('../models/User');
const Document = require('../models/Document');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');

const fixDownloadIssue = async () => {
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
      console.log('Creating a test document...');
      
      // Create a test document
      const testContent = 'This is a test document for download testing.';
      const testFilename = `test-document-${Date.now()}.txt`;
      const uploadDir = './uploads';
      const filepath = path.join(uploadDir, testFilename);
      
      // Ensure uploads directory exists
      try {
        await fs.mkdir(uploadDir, { recursive: true });
      } catch (error) {
        // Directory might already exist
      }
      
      // Write test file
      await fs.writeFile(filepath, testContent);
      
      // Create document record
      const testDocument = await Document.create({
        user_id: user.id,
        filename: testFilename,
        original_filename: 'test-document.txt',
        filepath: filepath,
        file_size: testContent.length,
        mime_type: 'text/plain'
      });
      
      console.log('✅ Test document created:');
      console.log(`- ID: ${testDocument.id}`);
      console.log(`- Filename: ${testDocument.filename}`);
      console.log(`- Filepath: ${testDocument.filepath}`);
      console.log(`- Size: ${testDocument.file_size} bytes`);
      
      documents.push(testDocument);
    }

    // Test each document
    for (const doc of documents) {
      console.log(`\n📄 Testing document: ${doc.original_filename}`);
      console.log(`- ID: ${doc.id}`);
      console.log(`- Filepath: ${doc.filepath}`);
      
      // Check if file exists
      try {
        await fs.access(doc.filepath);
        console.log('✅ File exists on filesystem');
        
        // Check file size
        const stats = await fs.stat(doc.filepath);
        console.log(`- Actual file size: ${stats.size} bytes`);
        console.log(`- Database file size: ${doc.file_size} bytes`);
        
        if (stats.size !== doc.file_size) {
          console.log('⚠️  File size mismatch! Updating database...');
          doc.file_size = stats.size;
          await doc.save();
          console.log('✅ File size updated in database');
        }
        
        // Test file reading
        const content = await fs.readFile(doc.filepath);
        console.log(`✅ File is readable (${content.length} bytes)`);
        
      } catch (error) {
        console.log(`❌ File access error: ${error.message}`);
        
        // Try to fix filepath if it's relative
        const absolutePath = path.resolve(doc.filepath);
        console.log(`Trying absolute path: ${absolutePath}`);
        
        try {
          await fs.access(absolutePath);
          console.log('✅ File found with absolute path');
          
          // Update filepath in database
          doc.filepath = absolutePath;
          await doc.save();
          console.log('✅ Filepath updated in database');
          
        } catch (absError) {
          console.log(`❌ Still cannot access file: ${absError.message}`);
        }
      }
    }

    // Check uploads directory
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    console.log(`\n📁 Checking uploads directory: ${uploadsDir}`);
    
    try {
      const files = await fs.readdir(uploadsDir);
      console.log(`Files in uploads directory: ${files.length}`);
      files.forEach(file => {
        console.log(`- ${file}`);
      });
    } catch (error) {
      console.log(`❌ Error reading uploads directory: ${error.message}`);
    }
    
    // Test download endpoint simulation
    console.log('\n🔧 Testing download endpoint simulation...');
    const testDoc = documents[0];
    if (testDoc) {
      console.log(`Testing download for document ID: ${testDoc.id}`);
      console.log(`Filepath: ${testDoc.filepath}`);
      console.log(`MIME Type: ${testDoc.mime_type}`);
      console.log(`Original Filename: ${testDoc.original_filename}`);
    }
    
    // Close database connection
    await sequelize.close();
    console.log('\nDatabase connection closed.');
    
    console.log('\n🎯 Next steps:');
    console.log('1. Restart the backend server');
    console.log('2. Try downloading documents from admin panel');
    console.log('3. Check browser console for any errors');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Run the script
fixDownloadIssue(); 