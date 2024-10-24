<template>
    <div class="main">
        <div class="dropzone-container" :style="isDragging && 'border-color: green;'" @dragover="dragover"
            @dragleave="dragleave" @drop="drop">
            <input type="file" multiple name="file" id="fileInput" class="hidden-input" @change="onChange" ref="file"
                accept=".pdf,.jpg,.jpeg,.png" />

            <label v-if="this.files.length < 1" for="fileInput" class="file-label">
                <div v-if="isDragging">Rilascia il file qui.</div>
                <div v-else>Trascina l'immagine profilo o <u>clicca qui</u> per caricarla.</div>
            </label>
            <div class="preview-container mt-4" v-if="files.length">
                <div v-for="file in files" :key="file.name" class="preview-card">
                    <div>
                        <img class="preview-img" :src="generateURL(file)" />
                        <p>
                            {{ file.name }}
                        </p>
                    </div>
                    <div>
                        <button class=" ml-2" type="button" @click="remove(files.indexOf(file))" title="Remove file">
                            <b>×</b>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <button class="align-self-center  mb-2" style="margin-top: 2em ;" type="button" @click="uploadFiles()" title="Upload">
            <b>Carica</b>
        </button>
    </div>
    
</template>

<script>
import apiUtils from '@/services/apiUtils';

export default {
    data() {
        return {
            isDragging: false,
            files: [],
        };
    },
    methods: {
        onChange() {
            if (this.files.length < 1)
                this.files.push(...this.$refs.file.files);
        },
        dragover(e) {
            e.preventDefault();
            this.isDragging = true;
        },
        dragleave() {
            this.isDragging = false;
        },
        drop(e) {
            e.preventDefault();
            this.$refs.file.files = e.dataTransfer.files;
            this.onChange();
            this.isDragging = false;
        },
        remove(i) {
            this.files.splice(i, 1);
        },
        generateURL(file) {
            let fileSrc = URL.createObjectURL(file);
            setTimeout(() => {
                URL.revokeObjectURL(fileSrc);
            }, 1000);
            return fileSrc;
        },
        uploadFiles() {
            const files = this.files;
            const formData = new FormData();
            files.forEach((file) => {
                formData.append("files", file);
            });
            formData.append("userId", "1");
            apiUtils.uploadImage(formData);
        },
    },
};
</script>

<style lang="scss" scoped>
.main {
    display: flex;
    flex-direction: column !important;
    flex-grow: 1;
    align-items: center;
    height: 100vh;
    justify-content: center;
    text-align: center;
}

.dropzone-container {
    padding: 4rem;
    background: #f7fafc;
    border: 2px dashed;
    border-color: #9e9e9e;
}

.hidden-input {
    opacity: 0;
    overflow: hidden;
    position: absolute;
    width: 1px;
    height: 1px;
}

.file-label {
    font-size: 20px;
    display: block;
    cursor: pointer;
}

.preview-container {
    display: flex;
    margin-top: 2rem;
}

.preview-card {
    display: flex;
    border: 1px solid #a2a2a2;
    padding: 5px;
    margin-left: 5px;
}

.preview-img {
    width: 50px;
    height: 50px;
    border-radius: 5px;
    border: 1px solid #a2a2a2;
    background-color: #a2a2a2;
}
</style>