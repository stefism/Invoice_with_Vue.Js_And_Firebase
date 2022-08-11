<template>
  <div @click="checkClick" class="invoice-wrap flex flex-column" ref="invoiceWrap">
    <form @submit.prevent="submitForm" class="invoice-content">
        <h1>Нова фактура</h1>

        <!-- Bill from -->
        <div class="bill-from flex flex-column">
            <h4>Продавач</h4>

            <div class="input flex flex-column">
                <label for="billerStreetAddress">Адрес</label>
                <input required type="text" id="billerStreetAddress" v-model="billerStreetAddress">
            </div>

            <div class="location-details flex">

                <div class="input flex flex-column">
                    <label for="billerCity">Град</label>
                    <input required type="text" id="billerCity" v-model="billerCity">
                </div>
                <div class="input flex flex-column">
                    <label for="billerZipCode">Пощенски код</label>
                    <input required type="text" id="billerZipCode" v-model="billerZipCode">
                </div>
                <div class="input flex flex-column">
                    <label for="billerCountry">Държава</label>
                    <input required type="text" id="billerCountry" v-model="billerCountry">
                </div>

            </div>
        </div>

        <!-- Bill to -->
        <div class="bill-to flex flex-column">
            <h4>Купувач</h4>
            <div class="input flex flex-column">
                <label for="clientName">Име</label>
                <input required type="text" id="clientName" v-model="clientName">
            </div>
            <div class="input flex flex-column">
                <label for="clientEmail">И-мейл</label>
                <input required type="text" id="clientEmail" v-model="clientEmail">
            </div>
            <div class="input flex flex-column">
                <label for="clientStreetAddress">Адрес</label>
                <input required type="text" id="clientStreetAddress" v-model="clientStreetAddress">
            </div>

            <div class="location-details flex">

                <div class="input flex flex-column">
                    <label for="clientCity">Град</label>
                    <input required type="text" id="clientCity" v-model="clientCity">
                </div>
                <div class="input flex flex-column">
                    <label for="clientZipCode">Пощенски код</label>
                    <input required type="text" id="clientZipCode" v-model="clientZipCode">
                </div>
                <div class="input flex flex-column">
                    <label for="clientCountry">Държава</label>
                    <input required type="text" id="clientCountry" v-model="clientCountry">
                </div>

            </div>
        </div>

        <!-- Invoice Work Details -->
        <div class="invoice-work flex flex-column">
            <div class="payment flex">
                <div class="input flex flex-column">
                    <label for="invoiceDate">Дата на издаване</label>
                    <input disabled type="text" id="invoiceDate" v-model="invoiceDate">
                </div>
                <div class="input flex flex-column">
                    <label for="paymenyDueDate">Крайна дата за плащане</label>
                    <input disabled type="text" id="paymenyDueDate" v-model="paymenyDueDate">
                </div>
            </div>
            <div class="input flex flex-column">
                <label for="paymentTerms">Срок за плащане</label>
                <select id="paymentTerms" v-model="paymentTerms">
                    <option value="5">5 работни дни</option>
                    <option value="10">10 работни дни</option>
                    <option value="30">30 работни дни</option>
                </select>
            </div>
            <div class="input flex flex-column">
                <label for="productDescription">Описание на стоката</label>
                <input required type="text" id="productDescription" v-model="productDescription">
            </div>
        </div>
    </form>
  </div>
</template>

<script>
export default {
    name: 'invoiceModal',
    data() {
        return {
            billerStreetAddress: '',
            billerCity: '',
            billerZipCode: null,
            billerCountry: '',
            clientName: '',
            clientEmail: '',
            clientStreetAddress: '',
            clientCity: '',
            clientZipCode: null,
            clientCountry: '',
            invoiceDataUnix: null,
            invoiceDate: null,
            paymentTerms: null,
            paymenyDueDateUnix: null,
            paymenyDueDate: null,
            productDescription: '',
            invoicePending: null,
            invoiceDraft: null,
            invoiceItemList: [],
            invoiceTotal: 0
        }
    }
}
</script>

<style>

</style>