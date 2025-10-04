// SoftWire India Authentication API Server
// Simple Node.js/Express backend for registration and login

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:8000', 'https://softwireindia.com', 'https://www.softwireindia.com'],
    credentials: true
}));

// Rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many authentication attempts. Please try again later.'
    }
});

// Initialize SQLite database
const db = new sqlite3.Database('./users.db');

// Create users table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        email_verified INTEGER DEFAULT 0,
        verification_token TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
    )`);
});

// Email transporter configuration
const emailTransporter = nodemailer.createTransporter({
    // Configure with your email provider
    service: 'gmail', // or your preferred service
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-email-password'
    }
});

// Helper function to send verification email
async function sendVerificationEmail(email, token, firstName) {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:8000'}/verify-email.html?token=${token}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@softwireindia.com',
        to: email,
        subject: 'Welcome to SoftWire India - Verify Your Email',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #667eea;">Welcome to SoftWire India, ${firstName}!</h2>
                <p>Thank you for registering with us. Please verify your email address to complete your registration.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Verify Email Address
                    </a>
                </div>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
                <hr style="margin: 30px 0;">
                <p style="color: #666; font-size: 12px;">
                    This verification link will expire in 24 hours. If you didn't create this account, please ignore this email.
                </p>
            </div>
        `
    };
    
    return emailTransporter.sendMail(mailOptions);
}

// Registration endpoint
app.post('/api/register', authLimiter, async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        
        // Validation
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }
        
        // Check if user already exists
        db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
            
            if (row) {
                return res.status(400).json({
                    success: false,
                    message: 'An account with this email already exists'
                });
            }
            
            try {
                // Hash password
                const saltRounds = 12;
                const passwordHash = await bcrypt.hash(password, saltRounds);
                
                // Generate verification token
                const verificationToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
                
                // Insert user into database
                db.run(
                    'INSERT INTO users (first_name, last_name, email, password_hash, verification_token) VALUES (?, ?, ?, ?, ?)',
                    [firstName, lastName, email, passwordHash, verificationToken],
                    async function(err) {
                        if (err) {
                            console.error('Database insert error:', err);
                            return res.status(500).json({
                                success: false,
                                message: 'Failed to create account'
                            });
                        }
                        
                        try {
                            // Send verification email
                            await sendVerificationEmail(email, verificationToken, firstName);
                            
                            res.status(201).json({
                                success: true,
                                message: 'Registration successful! Please check your email for verification.'
                            });
                        } catch (emailError) {
                            console.error('Email sending error:', emailError);
                            res.status(201).json({
                                success: true,
                                message: 'Account created successfully, but verification email could not be sent. Please contact support.'
                            });
                        }
                    }
                );
            } catch (hashError) {
                console.error('Password hashing error:', hashError);
                res.status(500).json({
                    success: false,
                    message: 'Failed to process registration'
                });
            }
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Login endpoint
app.post('/api/login', authLimiter, async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        
        // Find user in database
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
            
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }
            
            try {
                // Verify password
                const isPasswordValid = await bcrypt.compare(password, user.password_hash);
                
                if (!isPasswordValid) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid email or password'
                    });
                }
                
                // Check if email is verified
                if (!user.email_verified) {
                    return res.status(400).json({
                        success: false,
                        message: 'Please verify your email address before logging in'
                    });
                }
                
                // Generate JWT token
                const tokenExpiry = rememberMe ? '30d' : '1d';
                const token = jwt.sign(
                    { 
                        userId: user.id, 
                        email: user.email,
                        firstName: user.first_name,
                        lastName: user.last_name
                    },
                    JWT_SECRET,
                    { expiresIn: tokenExpiry }
                );
                
                // Update last login
                db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
                
                res.json({
                    success: true,
                    token,
                    user: {
                        id: user.id,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        email: user.email
                    },
                    redirectUrl: '/index.html'
                });
                
            } catch (compareError) {
                console.error('Password comparison error:', compareError);
                res.status(500).json({
                    success: false,
                    message: 'Login processing failed'
                });
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Email verification endpoint
app.get('/api/verify-email', (req, res) => {
    const { token } = req.query;
    
    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Verification token is required'
        });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        db.run(
            'UPDATE users SET email_verified = 1, verification_token = NULL WHERE email = ? AND verification_token = ?',
            [decoded.email, token],
            function(err) {
                if (err) {
                    console.error('Database update error:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Verification failed'
                    });
                }
                
                if (this.changes === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid or expired verification token'
                    });
                }
                
                res.json({
                    success: true,
                    message: 'Email verified successfully! You can now log in.'
                });
            }
        );
        
    } catch (tokenError) {
        console.error('Token verification error:', tokenError);
        res.status(400).json({
            success: false,
            message: 'Invalid or expired verification token'
        });
    }
});

// Token verification endpoint
app.get('/api/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided'
        });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({
            success: true,
            user: decoded
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'SoftWire India API is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`SoftWire India API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;