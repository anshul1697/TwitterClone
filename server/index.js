// to run: cmd- npm run dev
const express = require('express');
const cors = require('cors');
const monk = require('monk');
const app = express();
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');

app.use(cors()); // to add cors headers in the incoming req to server
app.use(express.json()); //json body parser 


const db = monk(process.env.MONGO_URI || 'localhost/tweeter'); //telling monk to conect to DB named tweeter on localhost
const tweets = db.get('tweets') //creating collection
const filter = new Filter();

app.get('/', (req, res) => {
    res.json({
        message: "This is a get request on http://localhost:5400/ server"
    });
});

//validation to protect server
function isValid(tweet) {
    return tweet.name && tweet.name.toString().trim() !== '' &&
        tweet.content && tweet.content.toString().trim() !== '';
}

app.get('/tweets', (req, res) => {
    //console.log('This is a get request on /tweets on localhost server')
    tweets
        .find()
        .then(tweets => res.json(tweets));
});
// we are using this here and not on top because it will count get req as a hit
//JS follow waterfall model 
// order only matters when app spins up 
app.use(rateLimit({
    windowsMs: 2 * 1000, //30 seconds
    max: 10
}));

app.post('/tweets', (req, res) => {
    console.log('Hitting server')
    //console.log(req.body); //in case of incoming post req, it will log out whatever client send to us
    console.log(isValid(req.body))

    if (isValid(req.body)) {
        //send to db
        const tweet = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
        };

        //inserting data into collections 
        tweets
            .insert(tweet)
            //resonding client with what is created 
            .then(createdTweet => {
                res.json(createdTweet)
                //console.log(createdTweet);
            })
    } else {
        res.status(422);
        res.json({
            message: 'Hey! name and content are required.'
        });
    }
})

app.listen(5400, () => {
    console.log("Listening on http://localhost:5400");
});