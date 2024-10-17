import { polls, users, upis } from "../models/index.mjs";
import jsonwebtoken from "jsonwebtoken";
import config from "../config/config.mjs";

export default {
    async createPoll(req, res) {
        try {
            const { question, options, userId } = req.body;
    
            // Qui stai creando una struttura di opzioni piatta, dove ogni opzione è un oggetto
            const parsedOptions = options.map(option => ({ option: option.trim(), votes: 0 }));
    
            const newPoll = await polls.create({
                question: question,
                options: parsedOptions,  // Usa l'array di opzioni corretto
                UserId: userId
            });
    
            res.status(201).send(newPoll);
        } catch (error) {
            console.error('Error creating poll:', error);
            res.status(500).send({ error: 'Internal server error' });
        }
    },

    async getAllPolls(req, res) {
        try {
        const poll = await polls.findAll({include: [{ model: users, attributes: ['username'] }]});
        res.status(200).send(poll);
        } catch (error) {
        console.error('Error fetching polls:', error);
        res.status(500).send({ error: 'Internal server error' });
        }
    },

    async voteOnPoll(req, res) {
        try {
            var decode = jsonwebtoken.verify(req.body.token, config.authentication.jwtSecret);
            const { pollId, optionIndex } = req.body;
            const userId = decode.id;
    
            // Trova il sondaggio
            const poll = await polls.findByPk(pollId);
            if (!poll) {
                return res.status(404).send({ error: 'Sondaggio non trovato.' });
            }
    
            // Parsing delle opzioni in modo che Sequelize possa aggiornare correttamente il JSONB
            let options = JSON.parse(JSON.stringify(poll.options));
    
            // Verifica se l'utente ha già votato
            const existingVote = await upis.findOne({ where: { PollId: pollId, UserId: userId } });
            if (existingVote) {
                const previousOptionIndex = existingVote.votedOption;
    
                // Assicurati che il voto precedente non scenda sotto zero
                if (options[previousOptionIndex].votes > 0) {
                    options[previousOptionIndex].votes -= 1;
                }
                options[optionIndex].votes += 1; // Aggiungi il nuovo voto
    
                // Aggiorna l'opzione
                await polls.update({ options: options }, { where: { id: pollId } });
    
                // Aggiorna il voto dell'utente
                await existingVote.update({ votedOption: optionIndex });
            } else {
                // Aggiungi il nuovo voto
                options[optionIndex].votes += 1;
    
                // Aggiorna l'opzione
                await polls.update({ options: options }, { where: { id: pollId } });
    
                // Registra il nuovo voto dell'utente
                await upis.create({ PollId: pollId, UserId: userId, votedOption: optionIndex });
            }
    
            res.status(200).send({ message: 'Voto registrato con successo.', options: options });
        } catch (error) {
            console.error('Errore durante la votazione:', error);
            res.status(500).send({ error: 'Errore interno del server.' });
        }
    },    
    async deletePoll(req, res) {
        try {
            const pollId = req.params.id;
            const poll = await polls.findByPk(pollId);

            if (!poll) {
                return res.status(404).send({ error: 'Sondaggio non trovato.' });
            }

            // Elimina tutte le righe associate nella tabella UPIs
            await upis.destroy({ where: { PollId: pollId } });

            // Elimina il sondaggio
            await poll.destroy();
            res.status(200).send({ message: 'Sondaggio e voti associati eliminati con successo.' });
        } catch (error) {
            console.error('Errore nell\'eliminazione del sondaggio:', error);
            res.status(500).send({ error: 'Errore interno del server.' });
        }
    },
};
