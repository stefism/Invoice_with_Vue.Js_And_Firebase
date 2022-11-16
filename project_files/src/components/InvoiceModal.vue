<template>
  <div
    @click="checkClick"
    class="invoice-wrap flex flex-column"
    ref="invoiceWrap"
  >
    <form @submit.prevent="submitForm" class="invoice-content">
      <Loading v-show="loading" />
      <h1 v-if="!editInvoice">Нова фактура</h1>
      <h1 v-else>Редактиране на фактура</h1>

      <!-- Bill from -->
      <div class="bill-from flex flex-column">
        <h4>Продавач</h4>

        <div class="input flex flex-column">
          <label for="sellerCompanyName">Име на фирмата</label>
          <input
            required
            type="text"
            id="sellerCompanyName"
            v-model="invoice.sellerCompanyName"
          />
        </div>
        <div class="input flex flex-column">
          <label for="sellerBulstat">БУЛСТАТ</label>
          <input
            required
            type="text"
            id="sellerBulstat"
            v-model="invoice.sellerBulstat"
          />
        </div>
        <div class="input flex flex-column">
          <label for="sellerStreetAddress">Адрес</label>
          <input
            required
            type="text"
            id="sellerStreetAddress"
            v-model="invoice.sellerStreetAddress"
          />
        </div>

        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="sellerCity">Град</label>
            <input
              required
              type="text"
              id="sellerCity"
              v-model="invoice.sellerCity"
            />
          </div>
          <div class="input flex flex-column">
            <label for="sellerZipCode">Пощенски код</label>
            <input
              required
              type="text"
              id="sellerZipCode"
              v-model="invoice.sellerZipCode"
            />
          </div>
          <div class="input flex flex-column">
            <label for="sellerCountry">Държава</label>
            <input
              required
              type="text"
              id="sellerCountry"
              v-model="invoice.sellerCountry"
            />
          </div>
        </div>
      </div>

      <!-- Bill to -->
      <div class="bill-to flex flex-column">
        <div>
          <span style="color: burlywood; margin-right: 180px">Купувач</span>
          <button
            class="purple contacts"
            style="
              width: 150px;
              height: 20px;
              align-self: end;
              padding-top: 0px;
            "
            type="button"
            @click="addNewContact"
          >
            {{ newContact ? "ОТКАЖИ" : "Добави купувач" }}
          </button>
          <button
            :class="{ disabled: !isItemToEdit }"
            class="purple contacts"
            style="
              width: 180px;
              height: 20px;
              align-self: end;
              padding-top: 0px;
            "
            type="button"
            @click="editContact"
          >
            {{ isContactEdit ? "ОТКАЖИ" : "Редактирай купувач" }}
          </button>
        </div>
        <div class="input flex flex-column">
          <label for="clientName">Име</label>
          <select
            v-if="!newContact && !isContactEdit && !editInvoice"
            @change="onClientNameSelected"
            name="clientName"
            id="clientName"
          >
            <option value="">--Изберете име на купувач--</option>
            <option
              v-for="(contact, index) in contacts"
              :key="index"
              :value="contact.docId"
            >
              {{ contact.clientName }}
            </option>
          </select>
          <input
            v-else-if="editInvoice"
            :disabled="!newContact && !isContactEdit"
            required
            type="text"
            id="clientName"
            v-model="selectedContact.clientName"
          />
          <input
            v-else
            required
            type="text"
            id="clientName"
            v-model="selectedContact.clientName"
          />
        </div>
        <div class="input flex flex-column">
          <label for="clientBulstat">Булстат</label>
          <input
            :disabled="!newContact && !isContactEdit"
            required
            type="text"
            id="clientBulstat"
            v-model="selectedContact.clientBulstat"
          />
        </div>
        <div class="input flex flex-column">
          <label for="clientEmail">И-мейл</label>
          <input
            :disabled="!newContact && !isContactEdit"
            required
            type="text"
            id="clientEmail"
            v-model="selectedContact.clientEmail"
          />
        </div>
        <div class="input flex flex-column">
          <label for="clientStreetAddress">Адрес</label>
          <input
            :disabled="!newContact && !isContactEdit"
            required
            type="text"
            id="clientStreetAddress"
            v-model="selectedContact.clientStreetAddress"
          />
        </div>

        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="clientCity">Град</label>
            <input
              :disabled="!newContact && !isContactEdit"
              required
              type="text"
              id="clientCity"
              v-model="selectedContact.clientCity"
            />
          </div>
          <div class="input flex flex-column">
            <label for="clientZipCode">Пощенски код</label>
            <input
              :disabled="!newContact && !isContactEdit"
              required
              type="text"
              id="clientZipCode"
              v-model="selectedContact.clientZipCode"
            />
          </div>
          <div class="input flex flex-column">
            <label for="clientCountry">Държава</label>
            <input
              :disabled="!newContact && !isContactEdit"
              required
              type="text"
              id="clientCountry"
              v-model="selectedContact.clientCountry"
            />
          </div>
        </div>
      </div>

      <!-- Invoice Work Details -->
      <div class="invoice-work flex flex-column">
        <div class="payment flex">
          <div class="input flex flex-column">
            <label for="invoiceDate">Дата на издаване</label>
            <input
              disabled
              type="text"
              id="invoiceDate"
              v-model="invoice.invoiceDate"
            />
          </div>
          <div class="input flex flex-column">
            <label for="paymenyDueDate">Крайна дата за плащане</label>
            <input
              disabled
              type="text"
              id="paymenyDueDate"
              v-model="invoice.paymentDueDate"
            />
          </div>
        </div>
        <div class="input flex flex-column">
          <label for="paymentTerms">Срок за плащане</label>
          <select id="paymentTerms" v-model="invoice.paymentTerms">
            <option value="5">5 работни дни</option>
            <option value="10">10 работни дни</option>
            <option value="30">30 работни дни</option>
          </select>
        </div>

        <div class="work-items">
          <h3>Артикули</h3>
          <table class="item-list">
            <tr class="table-heading flex">
              <th class="item-name">Име на артикула</th>
              <th class="qty">Количество</th>
              <th class="price">Цена</th>
              <th class="total">Обща сума</th>
            </tr>
            <tr
              class="table-items flex"
              v-for="(item, index) in invoice.invoiceItemList"
              :key="index"
            >
              <td class="item-name">
                <input type="text" v-model="item.itemName" />
              </td>
              <td class="qty"><input type="text" v-model="item.qty" /></td>
              <td class="price"><input type="text" v-model="item.price" /></td>
              <td class="total flex">
                {{ (item.total = item.qty * item.price) }} лв.
              </td>
              <img
                @click="deleteInvoiceItem(item.id)"
                src="../assets/icon-delete.svg"
                alt="delete icon"
              />
            </tr>
          </table>

          <div @click="addNewInvoiceItem" class="flex button">
            <img src="../assets/icon-plus.svg" alt="plus icon" />
            Добави нов артикул
          </div>
        </div>
      </div>

      <!-- Save and Exit -->
      <div class="save flex">
        <div class="left">
          <button type="button" @click="closeInvoice" class="red">
            Откажи
          </button>
        </div>
        <div class="right flex">
          <button
            v-if="!editInvoice"
            type="submit"
            @click="saveDraft"
            class="dark-purple"
            :class="{ disabled: this.invoice.invoiceItemList.length == 0 }"
          >
            Запис чернова
          </button>
          <button
            v-if="!editInvoice"
            type="submit"
            @click="publishInvoice"
            class="purple"
            :class="{ disabled: this.invoice.invoiceItemList.length == 0 }"
          >
            Създай
          </button>
          <button v-if="editInvoice" type="submit" class="purple">
            Редакция
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { uid } from "uid";
import db from "../firebase/firebaseInit.js";

import Loading from "../components/Loading.vue";

export default {
  name: "invoiceModal",
  components: { Loading },
  data() {
    return {
      loading: null,
      invoice: {
        docId: null,
        sellerBulstat: "",
        sellerCompanyName: "",
        sellerStreetAddress: "",
        sellerCity: "",
        sellerZipCode: null,
        sellerCountry: "",
        clientName: "",
        clientBulstat: "",
        clientEmail: "",
        clientStreetAddress: "",
        clientCity: "",
        clientZipCode: null,
        clientCountry: "",
        invoiceDataUnix: null,
        invoiceDate: null,
        paymentTerms: null,
        paymentDueDateUnix: null,
        paymentDueDate: null,
        invoicePending: null,
        invoiceDraft: null,
        invoiceItemList: [],
        invoiceTotal: 0,
      },
      selectedContact: {},
      newContact: false,
      isContactEdit: false,
    };
  },
  created() {
    if (!this.editInvoice) {
      this.invoice.invoiceDataUnix = Date.now();
      this.invoice.invoiceDate = new Date(
        this.invoice.invoiceDataUnix
      ).toLocaleDateString("bg-bg");
    }

    if (this.editInvoice) {
      for (const key in this.currentInvoice) {
        this.invoice[key] = this.currentInvoice[key];
      }
      this.selectedContact.clientBulstat = this.currentInvoice.clientBulstat;
      this.selectedContact.clientCity = this.currentInvoice.clientCity;
      this.selectedContact.clientCountry = this.currentInvoice.clientCountry;
      this.selectedContact.clientEmail = this.currentInvoice.clientEmail;
      this.selectedContact.clientName = this.currentInvoice.clientName;
      this.selectedContact.clientStreetAddress =
        this.currentInvoice.clientStreetAddress;
      this.selectedContact.clientZipCode = this.currentInvoice.clientZipCode;
      this.selectedContact.docId = this.currentInvoice.docId;
    }
  },
  methods: {
    ...mapMutations(["toggleInvoice", "toggleModal", "toggleEditInvoice"]),
    ...mapActions(["updateInvoice", "getInvoices"]),
    addNewContact() {
      this.newContact = !this.newContact;
      this.selectedContact = {};
    },
    editContact() {
      this.isContactEdit = !this.isContactEdit;

      if (!this.isContactEdit) {
        this.selectedContact = {};
      }
    },
    onClientNameSelected(e) {
      const selectedContactId = e.target.value;

      this.selectedContact = JSON.parse(
        JSON.stringify(this.contacts.find((c) => c.docId == selectedContactId))
      );

      if (!this.selectedContact) {
        this.selectedContact = {};
      }
    },
    checkClick(event) {
      if (event.target == this.$refs.invoiceWrap) {
        this.toggleModal();
      }
    },
    closeInvoice() {
      this.toggleInvoice();
      if (this.editInvoice) {
        this.toggleEditInvoice();
      }
    },
    addNewInvoiceItem() {
      this.invoice.invoiceItemList.push({
        id: uid(),
        itemName: "",
        qty: "",
        price: 0,
        total: 0,
      });
    },
    deleteInvoiceItem(id) {
      this.invoice.invoiceItemList = this.invoice.invoiceItemList.filter(
        (item) => item.id != id
      );
    },
    calculateInvoiceTotal() {
      this.invoice.invoiceTotal = 0;
      this.invoice.invoiceItemList.forEach((item) => {
        this.invoice.invoiceTotal += item.total;
      });
    },
    publishInvoice() {
      this.invoice.invoicePending = true;
    },
    saveDraft() {
      this.invoice.invoiceDraft = true;
    },
    submitForm() {
      if (this.editInvoice) {
        this.updateInvoiceLocal();
        return;
      }

      this.uploadInvoice();
    },
    async uploadInvoice() {
      this.loading = true;

      this.calculateInvoiceTotal();

      const dataBase = await db.collection("invoices").doc();

      if (this.newContact) {
        const contacts = await db.collection("contacts").doc();

        const newContact = {
          id: uid(10),
          clientName: this.selectedContact.clientName,
          clientBulstat: this.selectedContact.clientBulstat,
          clientCity: this.selectedContact.clientCity,
          clientCountry: this.selectedContact.clientCountry,
          clientStreetAddress: this.selectedContact.clientStreetAddress,
          clientEmail: this.selectedContact.clientEmail,
          clientZipCode: this.selectedContact.clientZipCode,
        };

        await contacts.set(newContact);
      }

      if (this.isContactEdit) {
        const currContact = await db
          .collection("contacts")
          .doc(this.selectedContact.docId);

        await currContact.update({
          clientName: this.invoice.clientName,
          clientBulstat: this.invoice.clientBulstat,
          clientEmail: this.invoice.clientEmail,
          clientStreetAddress: this.invoice.clientStreetAddress,
          clientCity: this.invoice.clientCity,
          clientZipCode: this.invoice.clientZipCode,
          clientCountry: this.invoice.clientCountry,
        });
      }

      let lastInvoiceIdNumber = [];
      let newInvoice = {};

      if (this.invoiceData.length > 0) {
        lastInvoiceIdNumber = this.invoiceData;
        lastInvoiceIdNumber = lastInvoiceIdNumber.sort(
          (a, b) => b.invoiceId - a.invoiceId
        )[0];

        const newInvoiceNumber = lastInvoiceIdNumber.invoiceId + 1;
        newInvoice = {
          invoiceId: newInvoiceNumber,
        };
      } else {
        newInvoice = {
          invoiceId: 1000000001,
        };
      }

      for (const key in this.$data.invoice) {
        newInvoice[key] = this.$data.invoice[key];
      }

      await dataBase.set(newInvoice);

      this.loading = false;

      this.toggleInvoice();
      this.getInvoices();
    },

    async updateInvoiceLocal() {
      this.loading = true;

      this.calculateInvoiceTotal();

      const dataBase = await db.collection("invoices").doc(this.invoice.docId);

      await dataBase.update({
        sellerBulstat: this.invoice.sellerBulstat,
        sellerCompanyName: this.invoice.sellerCompanyName,
        sellerStreetAddress: this.invoice.sellerStreetAddress,
        sellerCity: this.invoice.sellerCity,
        sellerZipCode: this.invoice.sellerZipCode,
        sellerCountry: this.invoice.sellerCountry,
        clientName: this.invoice.clientName,
        clientBulstat: this.invoice.clientBulstat,
        clientEmail: this.invoice.clientEmail,
        clientStreetAddress: this.invoice.clientStreetAddress,
        clientCity: this.invoice.clientCity,
        clientZipCode: this.invoice.clientZipCode,
        clientCountry: this.invoice.clientCountry,
        paymentTerms: this.invoice.paymentTerms,
        paymentDueDate: this.invoice.paymentDueDate,
        paymentDueDateUnix: this.invoice.paymentDueDateUnix,
        invoiceItemList: this.invoice.invoiceItemList,
        invoiceTotal: this.invoice.invoiceTotal,
      });

      this.loading = false;

      const data = {
        docId: this.invoice.docId,
        routeId: this.$route.params.invoiceId,
      };

      this.updateInvoice(data);
    },
  },
  computed: {
    ...mapState(["editInvoice", "currentInvoice", "invoiceData", "contacts"]),
    isItemToEdit() {
      if (this.selectedContact && this.selectedContact.docId != undefined) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    "invoice.paymentTerms"() {
      const futureDate = new Date();
      this.invoice.paymentDueDateUnix = futureDate.setDate(
        futureDate.getDate() + parseInt(this.invoice.paymentTerms)
      );
      this.invoice.paymentDueDate = new Date(
        this.invoice.paymentDueDateUnix
      ).toLocaleDateString("bg-bg");
    },
  },
};
</script>

<style lang="scss" scoped>
.contacts:hover {
  background-color: cadetblue;
}
.invoice-wrap {
  position: fixed;
  top: 0;
  left: 0;
  background-color: transparent;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 900px) {
    left: 90px;
  }

  .disabled {
    background-color: #a9b2ca;
    cursor: none;
    pointer-events: none;
  }

  .invoice-content {
    position: relative;
    padding: 56px;
    max-width: 700px;
    width: 100%;
    background-color: #141625;
    color: #fff;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);

    h1 {
      margin-bottom: 48px;
      color: #fff;
    }

    h3 {
      margin-bottom: 16px;
      font-size: 18px;
      color: #777f98;
    }

    h4 {
      color: #7c5dfa;
      font-size: 12px;
      margin-bottom: 24px;
    }

    .bill-to,
    .bill-from {
      margin-bottom: 48px;

      .location-details {
        gap: 16px;
        div {
          flex: 1;
        }
      }
    }

    .invoice-work {
      .payment {
        gap: 24px;
        div {
          flex: 1;
        }
      }

      .work-items {
        .item-list {
          width: 100%;

          .table-heading,
          .table-items {
            gap: 16px;
            font-size: 12px;

            .item-name {
              flex-basis: 50%;
            }

            .qty {
              flex-basis: 10%;
            }

            .price {
              flex-basis: 20%;
            }

            .total {
              flex-basis: 20%;
              align-self: center;
            }
          }

          .table-heading {
            margin-bottom: 16px;

            th {
              text-align: left;
            }
          }

          .table-items {
            position: relative;
            margin-bottom: 24px;

            img {
              position: absolute;
              top: 15px;
              right: 0;
              width: 12px;
              height: 16px;
            }
          }
        }

        .button {
          color: #fff;
          background-color: #252945;
          align-items: center;
          justify-content: center;
          width: 100%;

          img {
            margin-right: 4px;
          }
        }
      }
    }

    .save {
      margin-top: 60px;

      div {
        flex: 1;
      }

      .right {
        justify-content: flex-end;
      }
    }
  }

  .input {
    margin-bottom: 24px;
  }

  label {
    font-size: 12px;
    margin-bottom: 6px;
  }

  input,
  select {
    width: 100%;
    background-color: #1e2139;
    color: #fff;
    border-radius: 4px;
    padding: 12px 4px;
    border: none;

    &:focus {
      outline: none;
    }
  }
}
</style>
