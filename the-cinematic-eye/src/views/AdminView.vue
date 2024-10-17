<template>
    <div v-if="loading">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div v-else class="container mt-5">
        <h2>Report degli Utenti</h2>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Reason</th>
                    <th>Text</th>
                    <th>User ID</th>
                    <th>Actions</th> <!-- Aggiunta colonna per le azioni -->
                </tr>
            </thead>
            <tbody>
                <tr v-for="report in reports" :key="report.id">
                    <td>{{ report.id }}</td>
                    <td>{{ report.reason }}</td>
                    <td>{{ report.text }}</td>
                    <td>{{ report.UserId }}</td>
                    <td>
                        <button @click="deleteReport(report.id)" class="btn btn-danger">Elimina</button> <!-- Pulsante di eliminazione -->
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import apiUtils from '@/services/apiUtils';

export default {
    name: 'admin',
    data() {
        return {
            reports: [], // Array per memorizzare i report
            loading: true,
        };
    },
    async created() {
        await this.fetchReports();
    },
    methods: {
        // Funzione per recuperare i report dal backend
        async fetchReports() {
            try {
                const response = await apiUtils.getReports();
                if (response && response.data) {
                    this.reports = response.data;
                }
                this.loading = false;
            } catch (error) {
                console.error('Errore nel recuperare i report:', error);
            }
        },

        // Funzione per eliminare un report dal database
        async deleteReport(reportId) {
            try {
                await apiUtils.deleteReport(reportId); // Chiama l'API per eliminare il report
                this.reports = this.reports.filter(report => report.id !== reportId); // Aggiorna l'elenco dei report localmente
            } catch (error) {
                console.error('Errore nell\'eliminazione del report:', error);
            }
        }
    }
};
</script>

<style scoped>
.container {
    padding: 20px;
}
table {
    width: 100%;
}
</style>
