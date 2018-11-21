
var express = require('express');
const path = require("path");
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname)))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});

var sendEmail = (emailData) => {
    return new Promise(async (resolve, reject) => {
        console.log(emailData);
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
             
            }
        });


        text =
            `
            מספר טלפון 
            ${emailData['template-contactform-phone']} 
             סוג השירות המבוקש
            ${emailData['template-contactform-service']}

               
            ${emailData['template-contactform-message']}
           `


        var mailOptions = {
            from: emailData['template-contactform-email'],
            to: 'info@ab-heightworks.co.il',
            subject: emailData['template-contactform-subject'],
            text: text
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                reject(error)
            } else {
                console.log('Email sent: ' + info.response);
                resolve(info);
            }
        });
    })

}


app.post('/sendEmail', async (req, response) => {
    let email = await sendEmail(req.body)
    if (email) {
        return response.status(200).json({
            message: 'ההודעה נשלחה בהצלחה, נציגנו יצור קשר בהקדם.',
            obj: email
        });
    } else {
        return response.status(500).json({
            message: 'שגיאה בשליחה',
            obj: email
        });
    }


});


var server = app.listen(3000, () => {
    var host = server.address().address
    var port = server.address().port

    console.log("App listening at http://%s:%s", host, port)
})


