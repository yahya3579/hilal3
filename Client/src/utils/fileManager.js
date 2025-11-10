// utils/fileManager.js

// Function to upload file to backend
export const uploadFileToBackend = async (file, entityType, entityId) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('entity_type', entityType);
        formData.append('entity_id', entityId);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload-file/`, {
            method: 'POST',
            body: formData,
            // Note: No Authorization header needed since FileUploadView uses AllowAny
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'File upload failed');
        }

        const result = await response.json();
        console.log('File upload successful:', result);
        
        return result;
    } catch (error) {
        console.error('Error uploading file to backend:', error);
        throw error;
    }
};

// Function to get the backend media URL for a file
export const getBackendFileUrl = (filename, entityType = 'articles') => {
    if (!filename) return null;
    
    // If filename already contains the full path, return it as is
    if (filename.includes('/')) {
        return `/${filename}`;
    }
    
    // Return the backend media URL
    return `${import.meta.env.VITE_API_URL}/media/uploads/${entityType}/${filename}`;
};

// Function to handle file upload and return the path for database storage
export const handleFileUpload = async (file, entityType, entityId) => {
    if (!file) return null;

    try {
        // Get file extension
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        // Validate file type based on entity type
        if (entityType === 'magazines') {
            // Magazines can have both images and PDFs
            if (!['jpg', 'jpeg', 'png', 'pdf'].includes(fileExtension)) {
                throw new Error('Invalid file type. Magazines support: .jpg, .jpeg, .png, .pdf');
            }
        } else {
            // Other entities only support images
            if (!['jpg', 'jpeg', 'png'].includes(fileExtension)) {
                throw new Error('Invalid file type. Only .jpg, .jpeg, .png are supported');
            }
        }

        // Create filename with entity ID
        const filename = `${entityId}.${fileExtension}`;
        
        // Upload file to backend
        await uploadFileToBackend(file, entityType, entityId);
        
        console.log(`File uploaded: ${filename}`);
        console.log(`File saved to backend: media/uploads/${entityType}/${filename}`);
        console.log(`File will be accessible at: ${import.meta.env.VITE_API_URL}/media/uploads/${entityType}/${filename}`);
        console.log(`Database will store: ${filename}`);
        
        // Return only the filename for database storage
        return filename;
    } catch (err) {
        console.error("File upload error:", err);
        throw err;
    }
};

// Function to get file URL from stored path
export const getFileUrl = (filename, entityType = 'articles') => {
    return getBackendFileUrl(filename, entityType);
};

// Function to get magazine PDF URL
export const getMagazinePdfUrl = (filename) => {
    if (!filename) return null;
    
    // If filename already contains the full path, return it as is
    if (filename.includes('/')) {
        return `/${filename}`;
    }
    
    // Return the backend media URL for magazine PDFs
    return `${import.meta.env.VITE_API_URL}/media/uploads/magazinesPdf/${filename}`;
};

// Function to upload magazine PDF to backend with specific naming convention
export const uploadMagazinePdfToBackend = async (file, magazineId) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('entity_type', 'magazinesPdf');
        formData.append('entity_id', magazineId);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload-file/`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'PDF upload failed');
        }

        const result = await response.json();
        console.log('Magazine PDF upload successful:', result);
        
        return result.filename; // Return the filename for database storage
    } catch (error) {
        console.error('Error uploading magazine PDF to backend:', error);
        throw error;
    }
};

// Function to get billboard image URL
export const getBillboardImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL (Cloudinary or other), return as is
    if (typeof imagePath === 'string' && imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // If it's just a filename, construct the backend URL
    return `${import.meta.env.VITE_API_URL}/media/uploads/billboards/${imagePath}`;
};