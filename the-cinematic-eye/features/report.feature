Feature: Gestione dei report

  Scenario: Creazione di un report da parte di un utente Pro
    Given l'utente Pro è autenticato e sulla pagina di report
    When l'utente inserisce la motivazione "creazione forum" e il testo "Richiesta di creazione di un nuovo forum"
    And invia la richiesta di report
    Then il report dovrebbe essere creato con successo

  Scenario: Eliminazione di un report da parte di un amministratore
    Given l'amministratore è autenticato e ha accesso alla pagina degli amministratori
    When l'amministratore elimina il report con ID 8
    Then il report dovrebbe essere eliminato con successo
