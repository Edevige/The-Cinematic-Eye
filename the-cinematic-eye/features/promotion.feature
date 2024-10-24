Feature: Promozione di un utente

  Scenario: Promozione di un utente a utente Pro
    Given l'amministratore è autenticato
    When l'amministratore promuove l'utente con ID 8 a utente Pro
    Then il ruolo dell'utente dovrebbe essere aggiornato a Pro

  Scenario: Declassamento di un utente a utente base
    Given l'amministratore è autenticato
    When l'amministratore declassa l'utente con ID 8 a utente base
    Then il ruolo dell'utente dovrebbe essere rimosso
