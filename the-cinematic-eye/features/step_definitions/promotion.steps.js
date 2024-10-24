import { Given, When, Then } from '@cucumber/cucumber';
import axios from 'axios';
import assert, { strictEqual } from 'assert';

let promotionResponse;
let errorMessage;
let adminToken;
console.log('INIZIO TEST PROMOZIONE\n')
// Step per simulare l'autenticazione dell'amministratore
Given('l\'amministratore è autenticato', async function () {
  try {
    // Autenticazione dell'amministratore per ottenere il token JWT
    const loginResponse = await axios.post('http://localhost:3000/login', {
      email: 'samueletest@gmail.com',  // Inserisci l'email dell'amministratore
      password: 'Testare33'    // Inserisci la password dell'amministratore
    });
    
    // Salva il token per le richieste successive
    adminToken = loginResponse.data.token;

    console.log('Amministratore autenticato con token:', adminToken);
  } catch (error) {
    throw new Error('Errore durante l\'autenticazione dell\'amministratore: ' + error.message);
  }
});

// Step per la promozione di un utente
When('l\'amministratore promuove l\'utente con ID {int} a utente Pro', async function (userId) {
  try {
    // Invio della richiesta per promuovere l'utente a Pro (ruolo 2)
    promotionResponse = await axios.post('http://localhost:3000/updateUserRole', {
      token: adminToken, // Il token JWT dell'amministratore
      userId: userId,
      role: 2 // Ruolo Pro
    });
    console.log('Utente con ID '+ userId + 'promosso a utente Pro');
  } catch (error) {
    if (error.response && error.response.data) {
      errorMessage = error.response.data.error;
    } else {
      errorMessage = 'Errore nella promozione dell\'utente';
    }
  }
});

// Step per verificare la promozione
Then('il ruolo dell\'utente dovrebbe essere aggiornato a Pro', function () {
  assert(promotionResponse, 'La risposta del server per la promozione è undefined');
  strictEqual(promotionResponse.status, 200, 'Il ruolo non è stato aggiornato con successo');
  assert(promotionResponse.data.success, 'Il ruolo non è stato aggiornato correttamente');
  console.log('Ruolo aggiornato con successo:', promotionResponse.data.message);
});

// Step per il declassamento di un utente
When('l\'amministratore declassa l\'utente con ID {int} a utente base', async function (userId) {
  try {
    // Invio della richiesta per declassare l'utente a base (ruolo 0)
    promotionResponse = await axios.post('http://localhost:3000/updateUserRole', {
      token: adminToken, // Il token JWT dell'amministratore
      userId: userId,
      role: 0 // Ruolo base (0)
    });
    console.log('Utente con ID '+ userId + 'declassato a utente Base');
  } catch (error) {
    if (error.response && error.response.data) {
      errorMessage = error.response.data.error;
    } else {
      errorMessage = 'Errore nel declassamento dell\'utente';
    }
  }
});

// Step per verificare il declassamento
Then('il ruolo dell\'utente dovrebbe essere rimosso', function () {
  assert(promotionResponse, 'La risposta del server per il declassamento è undefined');
  strictEqual(promotionResponse.status, 200, 'Il ruolo non è stato rimosso con successo');
  assert(promotionResponse.data.success, 'Il ruolo non è stato rimosso correttamente');
  console.log('Ruolo rimosso con successo:', promotionResponse.data.message);
  console.log('FINE TEST PROMOZIONE\n')
});
