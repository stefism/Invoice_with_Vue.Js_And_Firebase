import { createStore } from "vuex";
import db from "../firebase/firebaseInit";

export default createStore({
  state: {
    invoiceData: [],
    invoiceModal: null,
    modalActive: null,
    invoicesLoaded: null,
    currentInvoice: null,
    editInvoice: null,
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
    },
    invoicesLoaded(state) {
      state.invoicesLoaded = true;
    },
    setCurrentInvoice(state, currInvoiceId) {
      state.currentInvoice = state.invoiceData.find(
        (i) => i.invoiceId == currInvoiceId
      );
    },
    toggleEditInvoice(state) {
      state.editInvoice = !state.editInvoice;
    },
    deleteInvoice(state, payload) {
      //payload = current Invoice Id
      state.invoiceData = state.invoiceData.filter((i) => i.docId != payload);
    },
    updateStatusToPaid(state, payload) {
      const invoice = state.invoiceData.find((i) => i.docId == payload);

      if (invoice) {
        invoice.invoicePaid = true;
        invoice.invoicePending = false;
      }
    },
    updateStatusToPending(state, payload) {
      const invoice = state.invoiceData.find((i) => i.docId == payload);

      if (invoice) {
        invoice.invoicePaid = false;
        invoice.invoiceDraft = false;
        invoice.invoicePending = true;
      }
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
    async updateInvoice({ commit, dispatch }, { docId, routeId }) {
      commit("deleteInvoice", docId);
      await dispatch("getInvoices");
      commit("toggleInvoice");
      commit("toggleEditInvoice");
      commit("setCurrentInvoice", routeId);
    },
    async deleteInvoiceFromDb({ commit }, docId) {
      const invoice = db.collection("invoices").doc(docId);
      await invoice.delete();
      commit("deleteInvoice", docId);
    },
    async updateStatusToPaidToDb({ commit }, docId) {
      const invoice = db.collection("invoices").doc(docId);
      await invoice.update({
        invoicePaid: true,
        invoicePending: false,
      });
      commit("updateStatusToPaid", docId);
    },
    async updateStatusToPendingToDb({ commit }, docId) {
      const invoice = db.collection("invoices").doc(docId);
      await invoice.update({
        invoicePaid: false,
        invoicePending: true,
        invoiceDraft: false,
      });
      commit("updateStatusToPending", docId);
    },
  },
  modules: {},
});
