import { createStore } from "vuex";
import db from "../firebase/firebaseInit";

export default createStore({
  state: {
    invoiceData: [],
    invoiceModal: null,
    modalActive: null,
    invoicesLoaded: null,
    currentInvoice: null,
  },
  mutations: {
    toggleInvoice(state) {
      state.invoiceModal = !state.invoiceModal;
    },
    toggleModal(state) {
      state.modalActive = !state.modalActive;
    },
    setInvoiceData(state, payload) {
      state.invoiceData.push(payload);
      console.log(state.invoiceData);
    },
    invoicesLoaded(state) {
      state.invoicesLoaded = true;
    },
    setCurrentInvoice(state, currInvoiceId) {
      state.currentInvoice = state.invoiceData.find(
        (i) => i.invoiceId == currInvoiceId
      );
    },
  },
  actions: {
    async getInvoices({ commit, state }) {
      const getData = db.collection("invoices");
      const results = await getData.get();

      results.forEach((doc) => {
        if (!state.invoiceData.some((invoice) => invoice.docId == doc.id)) {
          const data = {
            docId: doc.id,
            invoiceId: doc.data().invoiceId,
            billerStreetAddress: doc.data().billerStreetAddress,
            billerCity: doc.data().billerCity,
            billerZipCode: doc.data().billerZipCode,
            billerCountry: doc.data().billerCountry,
            clientName: doc.data().clientName,
            clientEmail: doc.data().clientEmail,
            clientStreetAddress: doc.data().clientStreetAddress,
            clientCity: doc.data().clientCity,
            clientZipCode: doc.data().clientZipCode,
            clientCountry: doc.data().clientCountry,
            invoiceDateUnix: doc.data().invoiceDateUnix,
            invoiceDate: doc.data().invoiceDate,
            paymentTerms: doc.data().paymentTerms,
            paymentDueDateUnix: doc.data().paymentDueDateUnix,
            paymentDueDate: doc.data().paymentDueDate,
            productDescription: doc.data().productDescription,
            invoiceItemList: doc.data().invoiceItemList,
            invoiceTotal: doc.data().invoiceTotal,
            invoicePending: doc.data().invoicePending,
            invoiceDraft: doc.data().invoiceDraft,
            invoicePaid: doc.data().invoicePaid,
          };

          commit("setInvoiceData", data);
        }
      });

      commit("invoicesLoaded");
    },
  },
  modules: {},
});
