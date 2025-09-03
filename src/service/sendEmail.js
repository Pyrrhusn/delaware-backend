const nodemailer = require('nodemailer');




async function sendEmail(bestelling) {

    //nu moet er nog de email van recipient gevonden worden
    //opmaak van de email
    //kijken of text in html of react kan teruggegeven worden

    /*placeholders voor data dat in de email moet
    

    const emailKlant = zoekEmailById(bestelling.KLANT_ID) methods iets
    const message = ...
    const leverancier
    const orderId
    const etc...

    */
    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false, 
        auth: {
          user: 'delawaregroupghent@outlook.com', 
          pass: 'testww123' 
        }
      });


    try {
        await transporter.sendMail({
            from: 'delawareGroupGhent@outlook.com', //later kunnen we ook aliassen toepassen ?
            to: "joris.xu@student.hogent.be", //moet email van klant worden
            subject: 'Betalingsherinnering OrderIDXYZ',  //string
            text: "Beste klant\n U hebt een openstaande factuur bij xyz " //message worden
        });
        return 'email sent succesfully';
    } catch (error) {
        throw new Error('sendEmail Service folder yeaaaas');
    }
}

module.exports =  {
    sendEmail,
};

