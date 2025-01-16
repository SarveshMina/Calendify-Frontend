// src/services/urlBuilder.js

// Pulled from your .env or .env.production
// e.g. VUE_APP_BACKEND_URL=https://calendarapp-functions.azurewebsites.net
// e.g. VUE_APP_FUNCTION_KEY=OxAzsFbx-dIb3NIC4JCalE1OJOYXcdkK_rwCrCVWZZiGAzFu_Iyrqg==

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

// ?code=${FUNCTION_KEY}