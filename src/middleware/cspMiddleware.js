// cspMiddleware.js
export const setCSPHeader = (req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
};
