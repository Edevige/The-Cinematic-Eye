Feature: Login

  Scenario: Login con credenziali valide
    Given l'utente è sulla pagina di login
    When l'utente inserisce l'email "michaeltest@gmail.com" e la password "Testare33"
    And l'utente clicca sul pulsante di login
    Then l'utente dovrebbe essere reindirizzato alla homepage

  Scenario: Login con credenziali non valide
    Given l'utente è sulla pagina di login
    When l'utente inserisce l'email "user@example.com" e la password "wrongpassword"
    And l'utente clicca sul pulsante di login
    Then l'utente vedrà un messaggio di errore "Credenziali errate!"
