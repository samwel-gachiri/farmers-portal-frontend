<template>
  <v-card class="tw-px-4 md:tw-px-8 tw-flex tw-justify-center tw-mt-4" flat>
    <div v-if="!bankLoading" class="tw-w-full md:tw-w-64">
      <v-form v-model="isValid">
        <v-autocomplete
            class="my-3"
            v-model="form.bankName"
            :loading="bankNameLoading"
            :items="bankNameItems"
            :search-input.sync="bankNameSearch2"
            hide-no-data
            hide-details
            label="Bank Name"
            :rules="[required('Bank Name')]"
        ></v-autocomplete>
        <v-autocomplete
            class="my-3"
            v-model="form.bankBranch"
            :loading="bankBranchLoading"
            :items="bankBranchItems"
            :search-input.sync="bankBranchSearch2"
            hide-no-data
            hide-details
            label="Bank Branch"
            :rules="[required('Bank Branch')]"
        ></v-autocomplete>
        <v-text-field
            class="my-3"
            v-model="form.bankAccount"
            label="Account No."
            type="number"
            :rules="[required('Account No.')]"
        ></v-text-field>
        <v-card-actions class="col-sm-6 offset-sm-3">
          <v-btn block small
                 id="bankUpdate"
                 color="secondary"
                 @click="update"
                 :disabled="!isValid"
                 :loading="loading">
            Update Details
          </v-btn>
        </v-card-actions>
      </v-form>
    </div>
    <div v-else class="tw-w-full tw-flex tw-justify-center">
      <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
      ></v-progress-circular>
    </div>
  </v-card>
</template>

<script>
/* eslint-disable no-unused-expressions */

import validations from '@/utils/validations.js';
import axios from 'axios';
import helpers from '@/utils/helpers.js';
import { mapState } from 'vuex';

export default {
  name: 'BankForm',
  data() {
    return {
      form: {
        bankName: '',
        bankBranch: '',
        bankAccount: '',
      },
      bankNames: [],
      bankNameLoading: false,
      bankNameItems: [],
      bankNameObj: {},
      bankNameSearch2: null,
      bankBranch: null,
      bankBranches: [],
      bankBranchLoading: false,
      bankBranchItems: [],
      bankBranchObj: {},
      bankBranchSearch2: null,
      isValid: false,
      ...validations,
      loading: false,
      bankLoading: true,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
  },
  watch: {
    async bankBranchSearch2(val) {
      val && val !== this.form.bankBranch && this.bankBranchFilter2(val);
      this.bankBranchObj = await this.bankBranches.find((x) => x.branchName === this.form.bankBranch);
    },
    async bankNameSearch2(val) {
      val && val !== this.form.bankName && this.bankNameFilter2(val);
      this.bankNameObj = await this.bankNames.find((x) => x.bankName === this.form.bankName);
      this.bankBranch = null;
      if (!helpers.objIsEmpty(this.bankNameObj)) this.getBankBranches2(this.bankNameObj.bankCode);
    },
  },
  mounted() {
    this.getBankNames2();
    this.getUserBank();
  },
  methods: {
    update() {
      this.loading = true;
      axios.post('/customer/quotation/clients/bankdetails/create', {
        clientEmail: this.user.email, bankId: this.bankNameObj.bankCode, branchId: this.bankBranchObj.bankRefCode, accountNo: this.form.bankAccount, clientPin: this.user['custom:kra-pin'],
      }).then(() => {
        this.loading = false;
        this.$toast.success('Details updated successfully', 'Bank Details');
      });
    },
    getUserBank() {
      axios.get(`/customer/gis/clients/bankdetails/findByPin?pinNo=${this.user['custom:kra-pin']}`).then((response) => {
        this.bankLoading = false;
        const bank = response.data.object;
        this.form = {
          bankName: bank.bankName,
          bankBranch: bank.bankBranch,
          bankAccount: bank.accountNo,
        };
        this.bankBranchItems = bank.bankBranch !== null ? [bank.bankBranch] : [];
        this.bankNameItems = bank.bankName !== null ? [bank.bankName] : [];
      });
    },
    getBankNames2() {
      this.bankNameLoading = true;
      axios.get('/customer/gis/banks/retrieveAll').then((response) => {
        this.bankNameLoading = false;
        this.bankNames = response.data.object;
      });
    },
    async getBankBranches2(id) {
      this.bankBranchLoading = true;
      await axios.get(`/customer/gis/banks/branches?bankCode=${id}&limit=5000&pageNumber=1`).then((response) => {
        this.bankBranchLoading = false;
        this.bankBranches = response.data.object.pageItems;
      });
    },
    bankNameFilter2(v) {
      const names = [];
      this.bankNames.forEach((name) => {
        names.push(name.bankName);
      });
      setTimeout(() => {
        this.bankNameItems = names.filter((e) => (e || '').toUpperCase().indexOf((v || '').toUpperCase()) > -1);
      }, 500);
    },
    bankBranchFilter2(v) {
      const branches = [];
      this.bankBranches.forEach((branch) => {
        branches.push(branch.branchName);
      });
      setTimeout(() => {
        this.bankBranchItems = branches.filter((e) => (e || '').toUpperCase().indexOf((v || '').toUpperCase()) > -1);
      }, 500);
    },
  },
};
</script>
