import { createStore } from 'vuex'

export default createStore({
  state: {
    invoiceModal: null,
    modalActive: null
  },
  mutations: {
    toggleInvoice(state) {
      state.invoiceModal = !state.invoiceModal;
    },
    toggleModal(state) {
      state.modalActive = !state.modalActive;
    }
  },
  actions: {
  },
  modules: {
  }
})
