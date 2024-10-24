import { Given, When, Then } from '@cucumber/cucumber';
import { strictEqual } from 'assert';
import  axios  from 'axios'; // Puoi usare axios per simulare la richiesta API

let loginResponse;
let errorMessage;

Given('l\'utente è sulla pagina di login', function () {
  // Qui puoi simulare il caricamento della pagina di login, se necessario
  console.log('L\'utente è sulla pagina di login');
});

When('l\'utente inserisce l\'email {string} e la password {string}', async function (email, password) {
  try {
    // Simula la chiamata API al server per il login
    loginResponse = await axios.post('http://localhost:3000/login', { 'email':email, 'password':password });
  } catch (error) {
    errorMessage = error.response.data.error;
  }
});

When('l\'utente clicca sul pulsante di login', function () {
  // Questo step è già coperto nella chiamata API, quindi non è necessario altro qui
});

Then('l\'utente dovrebbe essere reindirizzato alla homepage', function () {
  // Verifica che il login sia stato eseguito correttamente e l'utente sia stato reindirizzato
  strictEqual(loginResponse.status, 200);  // Controlla che lo stato sia 200 OK
  console.log('L\'utente è stato reindirizzato alla homepage');
});

Then('l\'utente dovrebbe vedere un messaggio di errore {string}', function (expectedErrorMessage) {
  // Confronta il messaggio di errore effettivo con quello atteso
  strictEqual(errorMessage, expectedErrorMessage);
  console.log('Messaggio di errore visualizzato correttamente:', expectedErrorMessage);
});
