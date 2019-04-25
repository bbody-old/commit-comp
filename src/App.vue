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

// const moment = require('moment');
import moment from 'moment';

const isValidDate = (rawDate: any) => {
  const date = moment(rawDate, 'YYYY-MM-DD', true);
  return date.isValid();
};

@Component
export default class App extends Vue {
  @Action('setRange') public setRange: any;
  @Mutation('setUserTriggeredAction') public setUserTriggeredAction: any;
  public created() {
    const usersQuery = this.$route.query.users as string;
    let users: string[] = [];

    if (usersQuery) {
      users = usersQuery.split(',');
    }

    let start = (this.$route.query.start && isValidDate(this.$route.query.start) ?
      this.$route.query.start : '') as string;
    let end = (this.$route.query.end && isValidDate(this.$route.query.end) ?
      this.$route.query.end : '') as string;

    if (!start && !end) { // Default to this month
      const now = moment();

      now.date(1);
      start = now.format('YYYY-MM-DD');

      now.add(1, 'month').subtract(1, 'day');
      end = now.format('YYYY-MM-DD');
    } else if (!end) {
      const startMoment = moment(start, 'YYYY-MM-DD');

      end = startMoment.add(1, 'month').format('YYYY-MM-DD');
    } else if (!start) {
      const endMoment = moment(end, 'YYYY-MM-DD');

      start = endMoment.subtract(1, 'month').format('YYYY-MM-DD');
    }

    this.$store.dispatch('setRange', {router: this.$router, start, end});

    const self = this;
    users.forEach((user) => {
      self.$store.dispatch('getGithubData', {username: user, router: this.$router});
    });
  }
}
</script>

