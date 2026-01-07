const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create the user
        user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        await user.save();

        // 4. Create Token
        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token });
            }
        );

    } catch (err) {
        console.error("Error in Register:", err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @desc    Authenticate user & get token
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // 3. Return Token AND Role
        const payload = { user: { id: user.id, role: user.role } };

        jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                // UPDATE: We now send the role and name back too!
                res.json({ 
                    token, 
                    user: {
                        id: user.id,
                        name: user.name,
                        role: user.role 
                    }
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};