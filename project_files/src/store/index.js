import { createStore } from 'vuex'

export default createStore({
  state: {
    invoiceModal: null
  },
  mutations: {
    toggleInvoice(state) {
      state.invoiceModal = !state.invoiceModal;
    }
  },
  actions: {
  },
  modules: {
  }
})
