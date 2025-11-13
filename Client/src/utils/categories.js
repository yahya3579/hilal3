import useAuthStore from './store';

export const CATEGORY_FILTER_MONTH = 4; // April
export const CATEGORY_FILTER_YEAR = 2025;

// Helper function to get dynamic categories from store based on current path
export const getDynamicCategoriesForPath = (pathname, searchParams = null) => {
    const categories = useAuthStore.getState().categories;
    const publications = useAuthStore.getState().publications;
    const currentPublication = useAuthStore.getState().currentPublication;
    
    // Return empty categories if data is not loaded yet
    if (!categories || categories.length === 0 || !publications || publications.length === 0) {
        console.log('Categories or publications not loaded yet');
        return {
            label: "Category",
            categories: []
        };
    }
    
    // Extract publication name from pathname (remove leading slash)
    let pathPublicationName = pathname === "/" ? "hilal-english" : pathname.substring(1);
    let targetPublicationName = pathPublicationName;
    
    // If we're on the articles page and have a publication parameter, use that instead
    if (pathname === "/articles" && searchParams) {
        const publicationParam = searchParams.get('publication');
        
        if (publicationParam) {
            // For articles page, use the publication parameter directly as the pathPublicationName
            pathPublicationName = publicationParam;
        }
    }
    
    // Check if we're on a publication page (hilal-english, hilal-urdu, etc.)
    const isPublicationPage = publications.some(pub => pathname === `/${pub.name}`) || pathname === "/";
    
    let publicationId = null;
    
    if (isPublicationPage) {
        // On publication pages, use the current path to determine publication
        const publication = publications.find(pub => pub.name === pathPublicationName);
        publicationId = publication ? publication.id : null;
        targetPublicationName = publication ? publication.name : pathPublicationName;
        
        // Store the current publication in the store
        if (publication) {
            useAuthStore.getState().setCurrentPublication(publication);
        }
    } else {
        // On other pages (ebooks, archives, etc.), use the stored publication
        if (currentPublication) {
            publicationId = currentPublication.id;
            targetPublicationName = currentPublication.name;
        } else {
            // Fallback to hilal-english if no stored publication
            const defaultPublication = publications.find(pub => pub.name === "hilal-english");
            publicationId = defaultPublication ? defaultPublication.id : null;
            targetPublicationName = defaultPublication ? defaultPublication.name : "hilal-english";
        }
    }
    
    // Filter categories from store based on the publication_id
    let filteredCategories = categories.filter(category => 
        category.publication === publicationId
    );
    
    const monthCategoryCache = useAuthStore.getState().monthCategoryCache;
    const cacheKey = `${CATEGORY_FILTER_YEAR}-${CATEGORY_FILTER_MONTH}`;
    const categoriesByPublication = monthCategoryCache?.[cacheKey] || {};
    const aprilCategories = categoriesByPublication[targetPublicationName] || [];
    const allowedCategoryIds = new Set(aprilCategories.map(category => category.id));
    
    if (allowedCategoryIds.size > 0) {
        filteredCategories = filteredCategories.filter(category => allowedCategoryIds.has(category.id));
    }
    
    return {
        label: "Category",
        categories: filteredCategories.map(category => ({
            id: category.id,
            name: category.name,
            displayName: category.display_name
        }))
    };
};

// Helper function to get the current publication from pathname using API data
export const getCurrentPublicationFromPath = (pathname) => {
    const publications = useAuthStore.getState().publications;
    
    // Extract publication name from pathname (remove leading slash)
    const pathPublicationName = pathname === "/" ? "hilal-english" : pathname.substring(1);
    
    // Find the publication by name (URL-friendly) and return its name
    const publication = publications.find(pub => pub.name === pathPublicationName);
    return publication ? publication.name : "hilal-english";
};

// Helper function to generate category URL with publication context
export const getCategoryUrl = (categoryId, currentPath, searchParams = null, includeCurrentDate = false) => {
    // Get publications from store first
    const publications = useAuthStore.getState().publications;
    const currentPublication = useAuthStore.getState().currentPublication;
    
    let publication = getCurrentPublicationFromPath(currentPath);
    
    // If we're on the articles page, check if there's a publication parameter in the URL
    if (currentPath === "/articles" && searchParams) {
        const publicationParam = searchParams.get('publication');
        if (publicationParam) {
            // Find publication by name (URL-friendly) from URL parameter
            const paramPublication = publications.find(pub => pub.name === publicationParam);
            publication = paramPublication ? paramPublication.name : publication;
        }
    }
    
    // Check if we're on a publication page
    const isPublicationPage = currentPath === "/" || currentPath === "/articles" || 
        publications.some(pub => currentPath === `/${pub.name}`);
    
    let displayName = "hilal-english"; // Default fallback
    
    if (isPublicationPage) {
        // On publication pages, use the current path to determine publication
        const publicationObj = publications.find(pub => pub.name === publication);
        displayName = publicationObj ? publicationObj.name : "hilal-english";
    } else {
        // On other pages, use the stored publication
        if (currentPublication) {
            displayName = currentPublication.name;
        }
    }
    
    // Build base URL with category and publication
    let url = `/articles?category=${categoryId}&publication=${displayName}`;
    
    // Add configured month and year if requested (for navbar category dropdown)
    if (includeCurrentDate) {
        url += `&month=${CATEGORY_FILTER_MONTH}&year=${CATEGORY_FILTER_YEAR}`;
    }
    
    return url;
};
