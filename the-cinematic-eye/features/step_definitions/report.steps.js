import { Given, When, Then } from '@cucumber/cucumber';
import axios from 'axios';
import assert, { strictEqual } from 'assert';

let reportResponse;
let deleteResponse;
let errorMessage;

// Simula l'autenticazione dell'utente Pro
Given('l\'utente Pro è autenticato e sulla pagina di report', async function () {
  // Simulazione di autenticazione o preparazione della richiesta
  console.log('Utente Pro autenticato.');
});

// Step per l'inserimento della motivazione e del testo del report
When('l\'utente inserisce la motivazione {string} e il testo {string}', async function (reason, text) {
  try {
    // Simula la creazione di un report inviando una richiesta POST al server
    reportResponse = await axios.post('http://localhost:3000/createReport', {
      reason: reason,
      text: text,
      userId: 11 // Simuliamo che l'utente Pro abbia ID 2
    });
  } catch (error) {
    if (error.response && error.response.data) {
      errorMessage = error.response.data.error;
    } else {
      errorMessage = 'Errore nella creazione del report';
    }
  }
});

// Simula l'invio della richiesta di report
When('invia la richiesta di report', function () {
  // In questo caso, la richiesta di report è già stata inviata nello step precedente
  console.log('Richiesta di report inviata.');
});

// Verifica che il report sia stato creato con successo
Then('il report dovrebbe essere creato con successo', function () {
  strictEqual(reportResponse.status, 201, 'Il report non è stato creato con successo');
  assert(reportResponse.data, 'Il report creato non è stato restituito correttamente');
  console.log('Report creato con successo:', reportResponse.data);
});

////////////////////////////////////////////////////////////////////////////////

// Simula l'autenticazione dell'amministratore
Given('l\'amministratore è autenticato e ha accesso alla pagina degli amministratori', async function () {
  // Simula l'autenticazione dell'amministratore
  console.log('Amministratore autenticato.');
});

// Step per eliminare un report specifico
When('l\'amministratore elimina il report con ID {int}', async function (reportId) {
  try {
    // Simula l'eliminazione del report inviando una richiesta DELETE al server
    deleteResponse = await axios.delete(`http://localhost:3000/reports/${reportId}`);
  } catch (error) {
    if (error.response && error.response.data) {
      errorMessage = error.response.data.error;
    } else {
      errorMessage = 'Errore nella cancellazione del report';
    }
  }
});

// Verifica che il report sia stato eliminato con successo
Then('il report dovrebbe essere eliminato con successo', function () {
  assert(deleteResponse, 'La risposta del server per l\'eliminazione del report è undefined');
  strictEqual(deleteResponse.status, 200, 'Il report non è stato eliminato con successo');
  assert(deleteResponse.data.message === 'Report eliminato con successo.', 'Messaggio di successo non corrisponde');
  console.log('Report eliminato con successo');
});
