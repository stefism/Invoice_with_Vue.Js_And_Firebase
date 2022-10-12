import { createStore } from "vuex";
import db from "../firebase/firebaseInit";

export default createStore({
  state: {
    invoiceData: [],
    invoiceModal: null,
    modalActive: null,
  },
  mutations: {
    toggleInvoice(state) {
      state.invoiceModal = !state.invoiceModal;
    },
    toggleModal(state) {
      state.modalActive = !state.modalActive;
    },
  },
  actions: {
    async getInvoices({ commit, state }) {
      const getData = db.collection("invoices");
      const results = await getData.get();
      results.forEach((doc) => {}); //
    },
  },
  modules: {},
});
