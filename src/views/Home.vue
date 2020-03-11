<template>
  <div>
    <template v-if="!isDevelopmentEnvironment">
      <GithubEmbed githubUrl="https://github.com/bbody/commit-comp" />
    </template>
    <v-container grid-list-md text-xs-center>
      <h1>Commit Competition</h1>
      <v-alert
        id="apiError"
        :value="hasAPIError"
        type="error">
        API does not appear to be working, please try again later
      </v-alert>
      <v-layout row wrap>
        <v-flex xs12 v-if="getAllUsersInfo">
          <UserTable />
        </v-flex>
        <v-flex xs12 md6>
          <Users />
        </v-flex>
        <v-flex xs12 md6>
          <DateSelection />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Users from '@/components/Users.vue';
import UserTable from '@/components/UserTable.vue';
import DateSelection from '@/components/DateSelection.vue';
import GithubEmbed from '@/components/GithubEmbed.vue';
import format from 'date-fns/format';
import 'vuetify-daterange-picker/dist/vuetify-daterange-picker.css';

import {
  State,
  Getter,
  Action,
  Mutation,
} from 'vuex-class';

@Component({components: {Users, DateSelection, UserTable, GithubEmbed}})
export default class Home extends Vue {
  @Getter('getContributionInfo') private getContributionInfo: any;
  @Getter('getAllUsersInfo') private getAllUsersInfo: any;
  @Getter('hasAPIError') private hasAPIError!: boolean;
  @Getter('getUsernameError') private getUsernameError!: string;
  @Getter('isDevelopmentEnvironment') private isDevelopmentEnvironment!: boolean;
}
</script>
