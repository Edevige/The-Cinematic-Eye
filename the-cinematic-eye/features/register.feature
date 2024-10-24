Feature: Registrazione di un nuovo utente

  Scenario: Registrazione con dati validi
    Given l'utente è sulla pagina di registrazione
    When l'utente inserisce il nome utente "newUser", l'email "newuser@example.com" e la password "Password123" e decide di settare l'iscrizione alla newsletter a "true"
    And l'utente invia il form di registrazione
    Then l'utente dovrebbe essere registrato con successo
    And l'utente dovrebbe ricevere un token di autenticazione

  Scenario: Registrazione con email già esistente
    Given l'utente è sulla pagina di registrazione
    When l'utente inserisce il nome utente "existingUser", l'email "michaeltes@gmail.com" e la password "password123" e decide di settare l'iscrizione alla newsletter a "true"
    And l'utente invia il form di registrazione
    Then l'utente dovrebbe vedere un messaggio di errore "L'email è già stata utilizzata"
