<template>
  <Default>
    <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-select
            v-model="selectedDb"
            :items="databases"
            label="Select Database"
            outlined
            dense
            @change="fetchClasses"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-select
            v-model="selectedClass"
            :items="classes"
            item-value="name"
            item-text="name"
            label="Select Class"
            outlined
            dense
            @change="fetchStudents"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-select
            v-model="sortBy"
            :items="['Class Name', 'Stream Name']"
            label="Sort By"
            outlined
            dense
            @change="sortData"
        />
      </v-col>
    </v-row>

    <v-data-table
        :headers="headers"
        :items="students"
        :items-per-page="pageSize"
        :page.sync="page"
        class="elevation-1"
    >
      <template v-slot:item.balance="{ item }">
        <span class="font-weight-bold text-red">{{ item.balance }}</span>
      </template>
    </v-data-table>

    <v-pagination v-model="page" :length="totalPages" @input="fetchStudents" />
  </v-container>
  </Default>
</template>

<script>
import axios from 'axios';
import Default from '@/components/layout/Default';

export default {
  components: { Default },
  data() {
    return {
      selectedDb: 'mainschool',
      databases: ['mainschool', 'kimorori'],
      selectedClass: '*SELECT*',
      classes: [{ name: '*SELECT*' }],
      students: [],
      page: 1,
      pageSize: 10,
      totalPages: 1,
      sortBy: '',
      headers: [
        { text: 'Adm', value: 'adm' },
        { text: 'Name', value: 'name1' },
        { text: 'Class', value: 'clazz.name' },
        { text: 'Stream', value: 'stream.name' },
        { text: 'Balance', value: 'balance' },
      ],
    };
  },
  methods: {
    async fetchClasses() {
      try {
        const response = await axios.get(
          `/${this.selectedDb}/classes`,
        );
        this.classes = [{ name: '*SELECT*' }, ...response.data.data];
        this.selectedClass = '*SELECT*';
        this.fetchStudents();
      } catch (error) {
        console.error('Error fetching classes', error);
      }
    },
    async fetchStudents() {
      try {
        const endpoint = this.selectedClass === '*SELECT*'
          ? `/${this.selectedDb}/students?page=${this.page - 1}&size=${this.pageSize}`
          : `/${this.selectedDb}/class/students?className=${this.selectedClass}&page=${this.page - 1}&size=${this.pageSize}`;

        const response = await axios.get(endpoint);
        this.students = response.data.content;
        this.totalPages = response.data.totalPages;
      } catch (error) {
        console.error('Error fetching students', error);
      }
    },
    sortData() {
      if (this.sortBy === 'Class Name') {
        this.students.sort((a, b) => a.clazz.name.localeCompare(b.clazz.name));
      } else if (this.sortBy === 'Stream Name') {
        this.students.sort((a, b) => a.stream.name.localeCompare(b.stream.name));
      }
    },
  },
  created() {
    this.fetchClasses();
  },
};
</script>

<style scoped>
.text-red {
  color: red;
}
</style>
