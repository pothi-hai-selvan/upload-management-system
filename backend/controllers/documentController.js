const { Document, User } = require('../models');
const path = require('path');
const fs = require('fs').promises;

// Upload document (User only)
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { originalname, filename, path: filepath, size, mimetype } = req.file;

    // Create document record
    const document = await Document.create({
      user_id: req.user.id,
      filename: filename,
      original_filename: originalname,
      filepath: filepath,
      file_size: size,
      mime_type: mimetype
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        document: {
          id: document.id,
          filename: document.filename,
          original_filename: document.original_filename,
          file_size: document.file_size,
          mime_type: document.mime_type,
          upload_date: document.upload_date
        }
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
};

// Get user's own documents
const getUserDocuments = async (req, res) => {
  try {
    const documents = await Document.findAll({
      where: { user_id: req.user.id },
      order: [['upload_date', 'DESC']],
      attributes: { exclude: ['filepath'] }
    });

    res.json({
      success: true,
      data: { documents }
    });
  } catch (error) {
    console.error('Get user documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get documents',
      error: error.message
    });
  }
};

// Admin: Get documents by user ID or email
const getDocumentsByUser = async (req, res) => {
  try {
    const { userId, email } = req.body;

    if (!userId && !email) {
      return res.status(400).json({
        success: false,
        message: 'User ID or email is required'
      });
    }

    let user;
    if (userId) {
      user = await User.findByPk(userId);
    } else if (email) {
      user = await User.findOne({ where: { email } });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const documents = await Document.findAll({
      where: { user_id: user.id },
      order: [['upload_date', 'DESC']],
      attributes: { exclude: ['filepath'] },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        documents
      }
    });
  } catch (error) {
    console.error('Get documents by user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get documents',
      error: error.message
    });
  }
};

// Admin: Get all documents
const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.findAll({
      order: [['upload_date', 'DESC']],
      attributes: { exclude: ['filepath'] },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({
      success: true,
      data: { documents }
    });
  } catch (error) {
    console.error('Get all documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get documents',
      error: error.message
    });
  }
};

// Download document (User can download their own, Admin can download any)
const downloadDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findByPk(documentId, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Check permissions
    if (req.user.role === 'user' && document.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if file exists
    try {
      await fs.access(document.filepath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    // Set headers for download
    res.setHeader('Content-Type', document.mime_type);
    res.setHeader('Content-Disposition', `attachment; filename="${document.original_filename}"`);
    res.setHeader('Content-Length', document.file_size);

    // Send file
    res.sendFile(path.resolve(document.filepath));
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      message: 'Download failed',
      error: error.message
    });
  }
};

// Delete document (User can delete their own, Admin can delete any)
const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findByPk(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Check permissions
    if (req.user.role === 'user' && document.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Delete file from filesystem
    try {
      await fs.unlink(document.filepath);
    } catch (error) {
      console.warn('File not found on filesystem:', error.message);
    }

    // Delete from database
    await document.destroy();

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Delete failed',
      error: error.message
    });
  }
};

module.exports = {
  uploadDocument,
  getUserDocuments,
  getDocumentsByUser,
  getAllDocuments,
  downloadDocument,
  deleteDocument
}; 