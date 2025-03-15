const bcrypt = require('bcryptjs');
const JWTController = require('../general/JWTController');
const {createUser} = require("./userController");
const {getCollection} = require("../collections/generalCollectionsService");


let usersCollection
const getCollections = async () => {
    usersCollection = await getCollection('users')
}

getCollections().catch(console.error);

function setCORSHeaders(req, res) {
    const allowedOrigins = ['http://localhost:5173', '', process.env.APPLICATION_URL];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
}

async function register(req, res) {
    setCORSHeaders(req, res);

    const {email, password, fullname} = req.body;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const fullnamePattern = /^(?!\s*$).{2,}$/;

    const existingUser = await usersCollection.findOne({email});

    if (existingUser) {
        return res.status(409).json({error: "User already registered"});
    }

    if (!email || !password || !fullname) {
        return res.status(400).json({error: "All fields are required"});
    }

    if (!emailPattern.test(email)) {
        return res.status(400).json({error: "Invalid email format"});
    }

    if (!fullnamePattern.test(fullname)) {
        return res.status(400).json({error: "Fullname must be at least 2 characters long"});
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        let userId = null;

        await createUser({fullname, email, hashedPassword}).then((response) => {
            userId = response
        })

        res.status(201).json({message: "User registered successfully."});
    } catch (error) {
        console.error("AUTH0001 Error registering user:", error);
        res.status(500).json({error: "AUTH0001 Internal server error"});
    }
}

async function login(req, res) {
    setCORSHeaders(req, res);

    const {email, password} = req.body;

    try {
        const user = await usersCollection.findOne(
            {email},
        );

        if (!user) {
            return res.status(400).json({
                needRegister: true,
                error: "There is no user with such an email address, please register first."
            });
        }


        if (!email || !password) {
            return res.status(400).json({error: "Email and password are required"});
        }

        if (user && await bcrypt.compare(password, user.password)) {
            const accessToken = JWTController.generateToken(user);
            res.json({
                accessToken,
                user
            });
        } else {
            res.status(403).json({error: "Invalid email or password"});
        }
    } catch (error) {
        res.status(500).json({error: `AUTH0003 Internal server error: ${error}`});
    }
}

module.exports = {
    register,
    login,
};