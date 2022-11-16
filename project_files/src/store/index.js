import { createStore } from "vuex";
import db from "../firebase/firebaseInit";

export default createStore({
  state: {
    invoiceData: [],
    contacts: [],
    invoiceModal: null,
    modalActive: null,
    invoicesLoaded: null,
    contactsLoaded: null,
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
    setContact(state, payload) {
      state.contacts.push(payload);
    },
    orderInvoicesByInvoiceNumber(state) {
      state.invoiceData = state.invoiceData.sort(
        (a, b) => b.invoiceId - a.invoiceId
      );
    },
    invoicesLoaded(state) {
      state.invoicesLoaded = true;
    },
    contactsLoaded(state) {
      state.contactsLoaded = true;
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
            sellerBulstat: doc.data().sellerBulstat,
            sellerCompanyName: doc.data().sellerCompanyName,
            sellerStreetAddress: doc.data().sellerStreetAddress,
            sellerCity: doc.data().sellerCity,
            sellerZipCode: doc.data().sellerZipCode,
            sellerCountry: doc.data().sellerCountry,
            clientName: doc.data().clientName,
            clientBulstat: doc.data().clientBulstat,
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
    async getContacts({ commit, state }) {
      const getContacts = db.collection("contacts");
      const result = await getContacts.get();

      result.forEach((doc) => {
        if (!state.contacts.some((c) => c.docId == doc.id)) {
          const data = {
            docId: doc.id,
            clientName: doc.data().clientName,
            clientBulstat: doc.data().clientBulstat,
            clientEmail: doc.data().clientEmail,
            clientStreetAddress: doc.data().clientStreetAddress,
            clientCity: doc.data().clientCity,
            clientZipCode: doc.data().clientZipCode,
            clientCountry: doc.data().clientCountry,
          };

          commit("setContact", data);
        }
      });

      commit("contactsLoaded");
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
