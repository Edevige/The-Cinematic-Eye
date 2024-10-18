

// emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'kaylin.schmidt@ethereal.email',
        pass: 'jqh1wU6HrfamhnuPdX'
    }
});

export async function send() {
    const response= await transporter.sendMail({
        from: 'Michael',
        to: 'kaylin.schmidt@ethereal.email',
        text: 'CIAOOOOOOO'
    })
}

/**
 * Crea un account di test su Ethereal
 * @returns {Promise<Object>} Dati dell'account di test
 */
async function createTestAccount() {
  let testAccount = await tr.createTestAccount();
  return testAccount;
}

/**
 * Invia una newsletter tramite Nodemailer utilizzando Ethereal
 * @param {string} to - Indirizzo email del destinatario
 * @param {string} subject - Oggetto dell'email
 * @param {string} htmlContent - Contenuto HTML dell'email
 */
async function sendNewsletter(to, subject, htmlContent) {
  try {
    let testAccount = await createTestAccount();

    // Configura il trasportatore con i dettagli di Ethereal
    let transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure, // true per 465, false per altre porte
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // Opzioni dell'email
    let mailOptions = {
      from: '"Il Tuo Sito" <no-reply@iltuosito.com>', // Mittente
      to: to, // Destinatario
      subject: subject, // Oggetto
      html: htmlContent, // Contenuto HTML
    };

    // Invia l'email
    let info = await transporter.sendMail(mailOptions);

    console.log('Messaggio inviato: %s', info.messageId);
    console.log('Anteprima URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Errore nell\'invio dell\'email:', error);
  }
}

module.exports = { sendNewsletter };
