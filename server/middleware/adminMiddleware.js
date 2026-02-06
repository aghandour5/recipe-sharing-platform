const db = require('../config/db');

// Hardcoded list of admin emails
// TODO: Add your email here to become an admin
const ADMIN_EMAILS = ['admin@example.com', 'aghan@example.com'];

const protectAdmin = async (req, res, next) => {
    try {
        // req.user.id is set by the 'protect' middleware which MUST run before this
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Not authorized, no user found' });
        }

        const result = await db.query('SELECT email FROM users WHERE id = $1', [req.user.id]);
        const user = result.rows[0];

        if (user && ADMIN_EMAILS.includes(user.email)) {
            next();
        } else {
            res.status(403).json({
                message: 'Access denied: You are not an admin.',
                userEmail: user ? user.email : 'unknown'
            });
        }
    } catch (error) {
        console.error('Admin Middleware Error:', error);
        res.status(500).json({ message: 'Server error checking admin status' });
    }
};

module.exports = { protectAdmin };
