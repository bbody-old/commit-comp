<template>
<div>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12 md4>
        <h1>Commit Competition</h1>
      </v-flex>
      <v-flex xs12 offset-md4 md4>
        <v-select
          :value="getRanking"
          :items="getRankings"
          @change="setRanking"
          menu-props="auto"
          label="Rank by"
          item-text="name"
          item-value="id"
          hide-details
          prepend-icon="gavel"
          single-line
        ></v-select>
      </v-flex>
      <v-alert
        :value="hasAPIError"
        type="error">
        API does not appear to be working, please try again later
      </v-alert>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 md9 v-if="getAllUsersInfo">
        <UserTable />
      </v-flex>
      <v-flex xs12 md3>
        <Users />
        <v-divider class="mb-3 mt-3"></v-divider>
        <DateSelection />
      </v-flex>
    </v-layout>
  </v-container>
  <v-footer inset app color="light-blue lighten-1" dark>
    <v-layout justify-center row wrap >
      <v-flex primary lighten-2 pb-5 text-xs-center white--text xs12>
        <ShareUrl/>
      </v-flex>
    </v-layout>
  </v-footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Users from '@/components/Users.vue';
import ShareUrl from '@/components/ShareUrl.vue';
import UserTable from '@/components/UserTable.vue';
import DateSelection from '@/components/DateSelection.vue';
import format from 'date-fns/format';
import 'vuetify-daterange-picker/dist/vuetify-daterange-picker.css';

import {
  State,
  Getter,
  Action,
  Mutation,
} from 'vuex-class';

@Component({components: {Users, ShareUrl, DateSelection, UserTable}})
export default class Home extends Vue {
  @Getter('getRankedUsers') private getRankedUsers: any;
  @Getter('getContributionInfo') private getContributionInfo: any;
  @Getter('getHeatMapData') private getHeatMapData: any;
  @Getter('getAllUsersInfo') private getAllUsersInfo: any;
  @Getter('hasAPIError') private hasAPIError!: boolean;
  @Getter('getUsernameError') private getUsernameError!: string;
  @Getter('getRankings') private getRankings!: string[];
  @Getter('getRanking') private getRanking!: string;
  @Mutation('setRanking') private setRanking!: (store: any, ranking: string) => {};
}
</script>
