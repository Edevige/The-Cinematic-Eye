<template>
        <!-- Striscia orizzontale con gli strumenti per filtrare i Film in varie pagine (dove è necessario) -->
        <div class="d-flex justify-content-around bg-secondary text-white p-3">
            <div class="p-2">Genere</div>
            <div class="form-group">
        <label>Anno di Rilascio:</label>
        <input type="number" v-model="searchParams.releaseYear" min="1890" max="new Date().getFullYear()">
      </div>

            <div class="p-2">Durata</div>
            <div class="p-2">Regista</div>
            <div class="p-2">Cast</div>


        <div class="form-group">
            <label>Valutazione Media (0 a 10):</label>
            <input type="range" v-model.number="searchParams.rating" min="0" max="10" step="0.5">
            <span>{{ searchParams.rating }}</span>
        </div>
            

        <div class="form-group">
            <label>Materiale per adulti:</label>
            <select v-model="searchParams.adult">
                <option value="">Indifferente</option>
                <option value="true">Contiene materiale per adulti</option>
                <option value="false">Non contiene materiale per adulti</option>
            </select>
        </div>
        </div>

</template>