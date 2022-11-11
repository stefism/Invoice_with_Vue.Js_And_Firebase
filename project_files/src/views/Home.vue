<template>
  <div class="home container">
    <div class="header flex">
      <div class="left flex flex-column">
        <h1>Фактури</h1>
        <span>Имате общо {{ filteredData.length }} фактури</span>
      </div>
      <div class="right flex">
        <div @click="toggleFilterMenu" class="filter flex">
          <span
            >Филтър по статус
            <span v-if="filteredInvoice">: {{ filteredInvoice }}</span>
          </span>
          <img src="../assets/icon-arrow-down.svg" alt="arrow icon" />
          <ul v-show="filterMenu" class="filter-menu">
            <li @click="filteredInvoices">Чернови</li>
            <li @click="filteredInvoices">Очакващи плащане</li>
            <li @click="filteredInvoices">Платени</li>
            <li @click="filteredInvoices">Изчисти филтъра</li>
          </ul>
        </div>
        <div @click="newInvoice" class="button flex">
          <div class="inner-button flex">
            <img src="../assets/icon-plus.svg" alt="plus icon" />
          </div>
          <span>Нова фактура</span>
        </div>
      </div>
    </div>
    <div v-if="invoiceData.length > 0">
      <Invoice
        v-for="(invoice, index) in filteredData"
        :invoice="invoice"
        :key="index"
      />
    </div>
    <div v-else class="empty flex flex-column">
      <img src="@/assets/illustration-empty.svg" alt="" />
      <h3>В момента няма налични фактури.</h3>
      <p>Създайте нова фактура като кликнете върху бутона "Нова фактура".</p>
    </div>
  </div>
</template>

<script>
import Invoice from "../components/Invoice.vue";
import { mapMutations, mapState } from "vuex";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",
  components: { Invoice },
  data() {
    return {
      filterMenu: false,
      filteredInvoice: null,
    };
  },
  methods: {
    ...mapMutations(["toggleInvoice"]),

    newInvoice() {
      this.toggleInvoice();
    },
    toggleFilterMenu() {
      this.filterMenu = !this.filterMenu;
    },
    filteredInvoices(e) {
      if (e.target.innerText == "Изчисти филтъра") {
        this.filteredInvoice = null;
      } else {
        this.filteredInvoice = e.target.innerText;
      }
    },
  },
  computed: {
    ...mapState(["invoiceData"]),
    filteredData() {
      return this.invoiceData.filter((i) => {
        if (this.filteredInvoice == "Чернови") {
          return i.invoiceDraft == true;
        }
        if (this.filteredInvoice == "Очакващи плащане") {
          return i.invoicePending == true;
        }
        if (this.filteredInvoice == "Платени") {
          return i.invoicePaid == true;
        }
        return i;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  color: #fff;

  .header {
    margin-bottom: 65px;

    .left,
    .right {
      flex: 1;
    }

    .right {
      justify-content: flex-end;
      align-items: center;

      .button,
      .filter {
        align-items: center;

        span {
          font-size: 12px;
        }
      }

      .filter {
        position: relative;
        margin-right: 40px;
        cursor: pointer;

        img {
          margin-left: 12px;
          width: 9px;
          height: 5px;
        }

        .filter-menu {
          width: 120px;
          position: absolute;
          top: 25px;
          list-style: none;
          background-color: #1e2139;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);

          li {
            cursor: pointer;
            font-size: 12px;
            padding: 10px 20px;

            &:hover {
              color: #1e2139;
              background-color: #fff;
            }
          }
        }
      }

      .button {
        padding: 8px 10px;
        background-color: #7c5dfa;
        border-radius: 40px;

        .inner-button {
          margin-right: 8px;
          border-radius: 50%;
          padding: 8px;
          align-items: center;
          justify-content: center;
          background-color: #fff;

          img {
            width: 10px;
            height: 10px;
          }
        }
      }
    }
  }

  .empty {
    margin-top: 160px;
    align-items: center;

    img {
      width: 214px;
      height: 200px;
    }

    h3 {
      font-size: 20px;
      margin-top: 40px;
    }

    p {
      text-align: center;
      max-width: 224px;
      font-size: 12px;
      font-weight: 300;
      margin-top: 16px;
    }
  }
}
</style>
