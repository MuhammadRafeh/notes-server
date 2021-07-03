const express = require('express');
const AuthModel = require('../models/authModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var fs = require('fs');
var path = require('path');
const fileModel = require('../models/fileModel');
var multer = require('multer');

const router = express.Router();

const saltRounds = 10;

//Here we can create post only after Login
router.post('/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created...',
                authData
            });
        }
    });
});

//--------------------------LOGIN----------------------------------------
router.post('/login', (req, res) => {

    const { username, password } = req.headers;

    var query = AuthModel.findOne({ username });

    query.exec(async function (err, user) {
        //Check if mongodb has problem
        if (err) return res.sendStatus(500);

        //check if User not exists
        if (!user) return res.status(404).send('User not Exists!')

        const match = await bcrypt.compare(password, user.password);

        if (match) {

            //Sending back token
            jwt.sign({ user }, 'secretkey', { expiresIn: '25 days' }, (err, token) => {
                res.json({
                    token
                });
            });

        } else {
            return res.status(400).send('Password Invalid!')
        }
    })

});

//------------------------------SIGN UP-------------------------------------------
router.post('/signup', (req, res) => {
    var { username, password } = req.headers

    // Check if username and password is Incorrect
    if (!username || !password) {
        return res.json({
            response: 'Username/Password is Empty!'
        })
    }

    // Converting plainPassword to Hash Password
    bcrypt.hash(password, saltRounds, function (err, hash) {
        // Store hash in your password DB
        if (err) return res.json({ response: 'bcrypt has error' })

        var newUser = new AuthModel({ username, password: hash });

        newUser.save((err) => {
            if (err) return res.status(409).send('User already Exists!')
            return res.status(200).send('User Created Successfully!')
        })

    });

});

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

router.get('/upload', (req, res) => {

    var query = fileModel.find({})

    query.exec(function (err, image) {
        if (err) return res.json({err: 'went wrong'});
        // athletes contains an ordered list of 5 athletes who play Tennis
        // console.log( '--------------->',image)
        // res.render('imagesPage', { image: image });
        res.contentType('json');
        res.send(image)
    })

    // fileModel.find({}, (err, items) => {
    //     if (err) {
    //         console.log(err);
    //         res.status(500).send('An error occurred', err);
    //     }
    //     else {
    //         res.render('imagesPage', { items: items });
    //     }
    // });
    // res.json({response: 'Ok'})
});

router.post('/upload', upload.single('image'), (req, res, next) => {
    console.log('------------------------', req.file.filename)
    console.log('+++++++++=', req.file)

    var newPost = new fileModel
    newPost.name = req.body.name
    newPost.desc = req.body.desc
    newPost.img = fs.readFileSync(path.join('/home/shikari/Web Development/notes server/' + '/uploads/' + req.file.filename))
    // newPost.img.contentType = 'image/jpeg';

    newPost.save(function (err, a) {
        if (err) return res.statusCode(500);
        console.error('saved img to mongo');
        res.json({
            response: 'Ok'
        })
    })
});

//-------------------------Verify Token-----------------------------------------------
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    // console.log(bearerHeader)
    if (typeof bearerHeader !== 'undefined') {
        req.token = bearerHeader;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}

module.exports = router
