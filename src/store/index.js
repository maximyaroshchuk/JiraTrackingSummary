import { createStore } from 'vuex';

export default createStore({
    state: {
        inputFormat: '',
        outputFormat: '',
        isLoading: false,
    },
    mutations: {
        setInputFormat(state, format) {
            state.inputFormat = format;
        },
        setOutputFormat(state, format) {
            state.outputFormat = format;
        },
        setLoading(state, isLoading) {
            state.isLoading = isLoading;
        },
    },
    actions: {
        async convertFile({ commit }, { inputFile, inputFormat, outputFormat }) {
            commit('setLoading', true);
            try {
                const formData = new FormData();
                formData.append('file', inputFile);
                formData.append('inputFormat', inputFormat);
                formData.append('outputFormat', outputFormat);

                const response = await fetch('http://localhost:3000/api/convert', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    return url;
                } else {
                    throw new Error('Conversion error');
                }
            } catch (error) {
                console.error(error);
                throw error;
            } finally {
                commit('setLoading', false);
            }
        },
    },
});
