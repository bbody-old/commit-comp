<template>
  <div id="app">
    <v-app>
      <router-view/>
    </v-app>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {
  State,
  Getter,
  Action,
  Mutation,
  namespace,
} from 'vuex-class';

const moment = require('moment');

function isValidDate(rawDate: any) {
  const date = moment(rawDate, 'YYYY-MM-DD', true);
  return date.isValid();
}

@Component
export default class App extends Vue {
  public created() {
    const usersQuery = this.$route.query.users as string;
    let users: string[] = [];


    if (usersQuery) {
      users = usersQuery.split(',');
    }

    const start = this.$route.query.start && isValidDate(this.$route.query.start) ? this.$route.query.start : false;
    const end = this.$route.query.end && isValidDate(this.$route.query.end) ? this.$route.query.end : false;

    if (!start && !end) { // Default to this month
      const now = moment();

      now.date(1);
      this.$store.commit('setDate', { type: 'start', date: now.format('YYYY-MM-DD')});

      now.add(1, 'month').subtract(1, 'day');
      this.$store.commit('setDate', { type: 'end', date: now.format('YYYY-MM-DD')});
    } else if (!end) {
      this.$store.commit('setDate', { type: 'start', date: start});
    } else if (!start) {
      this.$store.commit('setDate', { type: 'end', date: end});
    } else {
      this.$store.commit('setDate', { type: 'start', date: start});
      this.$store.commit('setDate', { type: 'end', date: end});
    }

    const self = this;
    users.forEach(function(user) {
      self.$store.dispatch('getGithubData', user);
    });
  }
}
</script>

