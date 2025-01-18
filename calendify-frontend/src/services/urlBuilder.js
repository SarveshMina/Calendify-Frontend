// src/services/urlBuilder.js

// Pulled from your .env or .env.production
const BACKEND_URL = process.env.VUE_APP_BACKEND_URL;
// const FUNCTION_KEY = process.env.VUE_APP_FUNCTION_KEY;

/**
 * Appends the Azure Function key as a query parameter to your path.
 * Example usage: buildFunctionUrl('/register') -> 'https://.../register?code=...'
 */
export function buildFunctionUrl(path) {
    // Ensure leading slash
    const trimmedPath = path.startsWith('/') ? path : `/${path}`;
    return `${BACKEND_URL}${trimmedPath}`;
}

//?code=${FUNCTION_KEY}