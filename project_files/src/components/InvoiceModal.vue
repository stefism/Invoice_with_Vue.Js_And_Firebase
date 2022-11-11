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
          <label for="billerStreetAddress">Адрес</label>
          <input
            required
            type="text"
            id="billerStreetAddress"
            v-model="invoice.billerStreetAddress"
          />
        </div>

        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="billerCity">Град</label>
            <input
              required
              type="text"
              id="billerCity"
              v-model="invoice.billerCity"
            />
          </div>
          <div class="input flex flex-column">
            <label for="billerZipCode">Пощенски код</label>
            <input
              required
              type="text"
              id="billerZipCode"
              v-model="invoice.billerZipCode"
            />
          </div>
          <div class="input flex flex-column">
            <label for="billerCountry">Държава</label>
            <input
              required
              type="text"
              id="billerCountry"
              v-model="invoice.billerCountry"
            />
          </div>
        </div>
      </div>

      <!-- Bill to -->
      <div class="bill-to flex flex-column">
        <h4>Купувач</h4>
        <div class="input flex flex-column">
          <label for="clientName">Име</label>
          <input
            required
            type="text"
            id="clientName"
            v-model="invoice.clientName"
          />
        </div>
        <div class="input flex flex-column">
          <label for="clientEmail">И-мейл</label>
          <input
            required
            type="text"
            id="clientEmail"
            v-model="invoice.clientEmail"
          />
        </div>
        <div class="input flex flex-column">
          <label for="clientStreetAddress">Адрес</label>
          <input
            required
            type="text"
            id="clientStreetAddress"
            v-model="invoice.clientStreetAddress"
          />
        </div>

        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="clientCity">Град</label>
            <input
              required
              type="text"
              id="clientCity"
              v-model="invoice.clientCity"
            />
          </div>
          <div class="input flex flex-column">
            <label for="clientZipCode">Пощенски код</label>
            <input
              required
              type="text"
              id="clientZipCode"
              v-model="invoice.clientZipCode"
            />
          </div>
          <div class="input flex flex-column">
            <label for="clientCountry">Държава</label>
            <input
              required
              type="text"
              id="clientCountry"
              v-model="invoice.clientCountry"
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
        <div class="input flex flex-column">
          <label for="productDescription">Описание на стоката</label>
          <input
            required
            type="text"
            id="productDescription"
            v-model="invoice.productDescription"
          />
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
        billerStreetAddress: "",
        billerCity: "",
        billerZipCode: null,
        billerCountry: "",
        clientName: "",
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
        productDescription: "",
        invoicePending: null,
        invoiceDraft: null,
        invoiceItemList: [],
        invoiceTotal: 0,
      },
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
    }
  },
  methods: {
    ...mapMutations(["toggleInvoice", "toggleModal", "toggleEditInvoice"]),
    ...mapActions(["updateInvoice", "getInvoices"]),
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

      let newInvoice = {
        invoiceId: uid(10),
      };

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
        billerStreetAddress: this.invoice.billerStreetAddress,
        billerCity: this.invoice.billerCity,
        billerZipCode: this.invoice.billerZipCode,
        billerCountry: this.invoice.billerCountry,
        clientName: this.invoice.clientName,
        clientEmail: this.invoice.clientEmail,
        clientStreetAddress: this.invoice.clientStreetAddress,
        clientCity: this.invoice.clientCity,
        clientZipCode: this.invoice.clientZipCode,
        clientCountry: this.invoice.clientCountry,
        paymentTerms: this.invoice.paymentTerms,
        paymentDueDate: this.invoice.paymentDueDate,
        paymentDueDateUnix: this.invoice.paymentDueDateUnix,
        productDescription: this.invoice.productDescription,
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
    ...mapState(["editInvoice", "currentInvoice"]),
  },
  watch: {
    paymentTerms() {
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
