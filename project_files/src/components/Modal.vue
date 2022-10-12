<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="modal flex">
    <div class="modal-content">
        <p>Сигурни ли сте, че искате да излезете? Промените няма да бъдат запазени.</p>
        <div class="actions flex">
            <button @click="closeModal" class="purple">Отказ</button>
            <button @click="closeInvoice" class="red">Изход</button>
        </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'modal',
    methods: {
        ...mapMutations(['toggleModal', 'toggleInvoice']),
        closeModal() {
            this.toggleModal();
        },
        closeInvoice() {
            this.toggleModal();
            this.toggleInvoice();
        }
    }
}
</script>

<style lang="scss" scoped>
.modal {
  z-index: 100;
  position: fixed;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  .modal-content {
    border-radius: 20px;
    padding: 48px 32px;
    max-width: 450px;
    background-color: #252945;
    color: #fff;
    p {
      text-align: center;
    }
    .actions {
      margin-top: 24px;
      button {
        flex: 1;
      }
    }
  }
}
</style>