
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
                user: 'abolnikliron@gmail.com',
                pass: 'Abolnik91'
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
            to: 'abolnikliron@gmail.com',
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
            message: 'המייל נשלח בהצלחה',
            obj: email
        });
    } else {
        return response.status(500).json({
            message: 'שגיאה',
            obj: email
        });
    }


});


var server = app.listen(8080, () => {
    var host = server.address().address
    var port = server.address().port

    console.log("App listening at http://%s:%s", host, port)
})


