import { Given, When, Then } from '@cucumber/cucumber';
import axios from 'axios';
import assert, { strictEqual } from 'assert';

let registrationResponse;
let errorMessage;
console.log('INIZIO TEST REGISTRAZIONE\n')
// Step per simulare l'accesso alla pagina di registrazione
Given('l\'utente è sulla pagina di registrazione', function () {
  console.log('Utente è sulla pagina di registrazione.');
});

// Step per l'inserimento del nome utente, email e password
When('l\'utente inserisce il nome utente {string}, l\'email {string} e la password {string} e decide di settare l\'iscrizione alla newsletter a {string}', async function (username, email, password, subscribed) {
  try {
    // Invia richiesta POST per registrare un nuovo utente
    registrationResponse = await axios.post('http://localhost:3000/register', {
      username: username,
      email: email,
      password: password,
      subscribed: subscribed
    });
  } catch (error) {
    if (error.response && error.response.data) {
      errorMessage = error.response.data.error;
      console.log('AOOOOOO', errorMessage)
    } else {
      errorMessage = 'Errore di rete o risposta non valida';
    }
  }
});

// Step per simulare l'invio del form di registrazione
When('l\'utente invia il form di registrazione', function () {
  // In questo caso, la richiesta di registrazione è stata inviata nello step precedente
  console.log('Form di registrazione inviato.');
});

// Step per verificare che l'utente sia stato registrato con successo
Then('l\'utente dovrebbe essere registrato con successo', function () {
  assert(registrationResponse, 'La risposta del server per la registrazione è undefined');
  strictEqual(registrationResponse.status, 200, 'La registrazione non è andata a buon fine');
  assert(registrationResponse.data.user, 'L\'utente non è stato creato correttamente');
  console.log('Utente registrato con successo:', registrationResponse.data.user);
});

// Step per verificare che l'utente riceva un token di autenticazione
Then('l\'utente dovrebbe ricevere un token di autenticazione', function () {
  assert(registrationResponse.data.token, 'Token JWT non restituito');
  console.log('Token ricevuto:', registrationResponse.data.token);
});

// Step per verificare che venga mostrato un messaggio di errore
Then('l\'utente dovrebbe vedere un messaggio di errore {string}', function (expectedErrorMessage) {
    strictEqual(errorMessage, expectedErrorMessage, `Messaggio di errore atteso: "${expectedErrorMessage}", ma trovato: "${errorMessage}"`);
    console.log('L\'utente vede l\'errore: ' + errorMessage)
    console.log('FINE TEST REGISTRAZIONE\n')
});
