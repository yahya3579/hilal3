// utils/localUpload.js
import { handleFileUpload, getFileUrl as getFileUrlFromHandler, uploadMagazinePdfToBackend } from './fileManager';

// Generic function to save file locally and return the path for database storage
export const saveFileLocally = async (file, entityType, entityId) => {
    return handleFileUpload(file, entityType, entityId);
};

// Function to get file URL from stored filename
export const getFileUrl = (filename, entityType = 'articles') => {
    return getFileUrlFromHandler(filename, entityType);
};

// Specific upload functions for different entity types
export const uploadArticleImage = async (file, articleId) => {
    return saveFileLocally(file, 'articles', articleId);
};

export const uploadAuthorImage = async (file, authorId) => {
    return saveFileLocally(file, 'authors', authorId);
};

export const uploadGalleryImage = async (file, galleryId) => {
    return saveFileLocally(file, 'gallery', galleryId);
};

export const uploadMagazineImage = async (file, magazineId) => {
    return saveFileLocally(file, 'magazines', magazineId);
};

export const uploadPublicationImage = async (file, publicationId) => {
    return saveFileLocally(file, 'publications', publicationId);
};

export const uploadMagazinePdf = async (file, magazineId) => {
    return uploadMagazinePdfToBackend(file, magazineId);
};
