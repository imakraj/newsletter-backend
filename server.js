const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const bodyParser = require('body-parser');
const app = express();
const request = require('request');
const dotenv = require('dotenv');

dotenv.config({path: './data/config.env'});

console.log(`https://${process.env.MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST}`)

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors({
    origin: [
        'http://127.0.0.1:5173',
        'https://newsletter-frontend-l3xs.onrender.com',
        'https://ashmitshahi.com'
      ],  
    credentials: true,
}));

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});

app.post('/subscribe', (req, res) => {
    const { email } = req.body;
    console.log(email);

    const mcData = {
        members: [
            {
                email_address: email,
                status: 'pending'
            }
        ]
    }

    const mcDataPost = JSON.stringify(mcData);

    const options = {
        url: `https://${process.env.MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST}`,
        method: 'POST',
        headers: {
            Authorization: `auth ${process.env.MAILCHIMP_API}`
        },
        body: mcDataPost
    }


    if (email) {
        request(options, (err, response, body) => {
            if (err) {
                res.json({ error: err })
            } else {
                res.status(201).json({
                    success: true,
                    message: "Subscription Successful"
                })
            }
        })
    } else {
        res.status(404).json({ success: false, message: 'Failed' })
    }
})


const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});