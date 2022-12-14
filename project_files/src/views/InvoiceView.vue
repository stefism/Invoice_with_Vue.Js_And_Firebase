<template>
  <div v-if="currentInvoice" class="invoice-view container">
    <router-link class="nav-link flex" :to="{ name: 'Home' }">
      <img src="@/assets/icon-arrow-left.svg" alt="" /> Назад
    </router-link>
    <div class="header flex">
      <div class="left flex">
        <span>Status</span>
        <div
          class="status-button flex"
          :class="{
            paid: currentInvoice.invoicePaid,
            draft: currentInvoice.invoiceDraft,
            pending: currentInvoice.invoicePending,
          }"
        >
          <span v-if="currentInvoice.invoicePaid">Платена</span>
          <span v-if="currentInvoice.invoiceDraft">Чернова</span>
          <span v-if="currentInvoice.invoicePending">Чакаща</span>
        </div>
      </div>
      <div class="right flex">
        <button @click="toggleEditInvoice_" class="dark-purple">
          Редакция
        </button>
        <button @click="deleteInvoice(currentInvoice.docId)" class="red">
          Премахване
        </button>
        <button
          v-if="currentInvoice.invoicePending"
          @click="updateStatusToPaid(currentInvoice.docId)"
          class="green"
        >
          Маркирай като платена
        </button>
        <button
          v-if="currentInvoice.invoiceDraft || currentInvoice.invoicePaid"
          @click="updateStatusToPending(currentInvoice.docId)"
          class="orange"
        >
          Маркирай като чакаща
        </button>
      </div>
    </div>
    <div id="invoiceToExport" class="invoice-details flex flex-column">
      <div class="top flex">
        <div class="left flex flex-column">
          <p><span>Фактура № </span>{{ currentInvoice.invoiceId }}</p>
          <p>
            БУЛСТАТ: <b>{{ currentInvoice.sellerBulstat }}</b>
          </p>
        </div>
        <div class="right flex flex-column">
          <p>
            Фирма:
            <b style="font-size: 16px">{{
              currentInvoice.sellerCompanyName
            }}</b>
          </p>
          <p>ул. № {{ currentInvoice.sellerStreetAddress }}</p>
          <p>град: {{ currentInvoice.sellerCity }}</p>
          <p>Пощенски код: {{ currentInvoice.sellerZipCode }}</p>
          <p>Държава: {{ currentInvoice.sellerCountry }}</p>
        </div>
      </div>
      <div class="middle flex">
        <div class="payment flex flex-column">
          <h4>Дата на издаване</h4>
          <p>{{ currentInvoice.invoiceDate }}</p>
          <h4>Дата на плащане</h4>
          <p>{{ currentInvoice.paymentDueDate }}</p>
        </div>
        <div class="bill flex flex-column">
          <h4>Купувач</h4>
          <p>{{ currentInvoice.clientName }}</p>
          <p>{{ currentInvoice.clientStreetAddress }}</p>
          <p>{{ currentInvoice.clientCity }}</p>
          <p>{{ currentInvoice.clientZipCode }}</p>
          <p>{{ currentInvoice.clientCountry }}</p>
        </div>
        <div class="send-to flex flex-column">
          <h4>Булстат на купувача</h4>
          <p>{{ currentInvoice.clientBulstat }}</p>
          <br />
          <h4>Имейл</h4>
          <p>{{ currentInvoice.clientEmail }}</p>
        </div>
      </div>
      <div class="bottom flex flex-column">
        <div class="billing-items">
          <div class="heading flex">
            <p>Име на стоката</p>
            <p>Брой</p>
            <p>Цена</p>
            <p>Общо</p>
          </div>
          <div
            v-for="(item, index) in currentInvoice.invoiceItemList"
            :key="index"
            class="item flex"
          >
            <p>{{ item.itemName }}</p>
            <p>{{ item.qty }}</p>
            <p>{{ item.price }}</p>
            <p>{{ item.total }}</p>
          </div>
        </div>
        <div class="total flex">
          <p>Обща сума</p>
          <p>{{ currentInvoice.invoiceTotal }}</p>
        </div>
        <button @click="generatePDF" class="green">
          Експортирай като PDF файл
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
  name: "invoiceView",
  components: {},
  data() {
    return {
      test: ["fdfdfdf", "sdsdsdsd", "sdsdsdfr", "sdfdfdf"],
    };
  },
  created() {
    this.setCurrentInvoice(this.$route.params.invoiceId);
  },
  methods: {
    ...mapMutations([
      "setCurrentInvoice",
      "toggleEditInvoice",
      "toggleInvoice",
    ]),
    ...mapActions([
      "deleteInvoiceFromDb",
      "updateStatusToPendingToDb",
      "updateStatusToPaidToDb",
    ]),
    toggleEditInvoice_() {
      this.toggleEditInvoice();
      this.toggleInvoice();
    },
    async deleteInvoice(docId) {
      await this.deleteInvoiceFromDb(docId);
      this.$router.push({ name: "Home" });
    },
    updateStatusToPaid(docId) {
      this.updateStatusToPaidToDb(docId);
    },
    updateStatusToPending(docId) {
      this.updateStatusToPendingToDb(docId);
    },
    makePDF() {
      window.html2canvas = html2canvas;
      const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
        putOnlyUsedFonts: true,
      });
      doc.setFont("courier");
      doc.getFontList();
      doc.setFontSize(12);
      doc.output("blob");
      doc.setLanguage({ name: "bg" });
      doc.setFillColor("black");

      doc.html(document.getElementById("app"), {
        callback: function (pdf) {
          pdf.save("my_file.pdf");
        },
      });
    },
    pdf2() {
      const documentCurr = document.getElementById("invoiceToExport");
      const docDef = { content: documentCurr };
      let pdf = pdfMake.createPdf(docDef);
      pdf.open();
    },
  },
  computed: {
    ...mapState(["currentInvoice"]),
  },
};
</script>

<style lang="scss" scoped>
.invoice-view {
  .nav-link {
    margin-bottom: 32px;
    align-items: center;
    color: #fff;
    font-size: 12px;
    img {
      margin-right: 16px;
      width: 7px;
      height: 10px;
    }
  }

  .header,
  .invoice-details {
    background-color: #1e2139;
    border-radius: 20px;
  }

  .header {
    align-items: center;
    padding: 24px 32px;
    font-size: 12px;

    .left {
      align-items: center;

      span {
        color: #dfe3fa;
        margin-right: 16px;
      }
    }

    .right {
      flex: 1;
      justify-content: flex-end;

      button {
        color: #fff;
      }
    }
  }

  .invoice-details {
    padding: 48px;
    margin-top: 24px;

    .top {
      div {
        color: #dfe3fa;
        flex: 1;
      }

      .left {
        font-size: 12px;

        p:first-child {
          font-size: 24px;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 8px;
        }

        p:nth-child(2) {
          font-size: 16px;
        }

        span {
          color: #888eb0;
        }
      }

      .right {
        font-size: 12px;
        align-items: flex-end;
      }
    }

    .middle {
      margin-top: 50px;
      color: #dfe3fa;
      gap: 16px;

      h4 {
        font-size: 12px;
        font-weight: 400;
        margin-bottom: 12px;
      }

      p {
        font-size: 16px;
      }

      .bill,
      .payment {
        flex: 1;
      }

      .payment {
        h4:nth-child(3) {
          margin-top: 32px;
        }

        p {
          font-weight: 600;
        }
      }

      .bill {
        p:nth-child(2) {
          font-size: 16px;
        }

        p:nth-child(3) {
          margin-top: auto;
        }

        p {
          font-size: 12px;
        }
      }

      .send-to {
        flex: 2;
      }
    }

    .bottom {
      margin-top: 50px;

      .billing-items {
        padding: 32px;
        border-radius: 20px 0px 0 0;
        background-color: #252945;

        .heading {
          color: #dfe3fa;
          font-size: 12px;
          margin-bottom: 32px;

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }

        .item {
          margin-bottom: 32px;
          font-size: 13px;
          color: #fff;

          &:last-child {
            margin-bottom: 0;
          }

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }
      }

      .total {
        color: #fff;
        padding: 32px;
        background-color: rgba(12, 14, 22, 0.7);
        align-items: center;
        border-radius: 0 0 20px 20px;

        p {
          flex: 1;
          font-size: 12px;
        }

        p:nth-child(2) {
          font-size: 28px;
          text-align: right;
        }
      }
    }
  }
}
</style>
