<template>
<div>
  <v-container grid-list-md text-xs-center>
    <h1>Commit Competition</h1>
    <v-layout row wrap>
      <v-flex xs12 md9 v-if="getAllUsersInfo">
        <UserTable />
      </v-flex>
      <v-flex xs12 md3>
        <Users />
        <DateSelection />
      </v-flex>
    </v-layout>
  </v-container>
  <v-footer inset app color="light-blue lighten-1" dark>
    <v-layout
      justify-center
      row
      wrap
    >
      <v-flex
        primary
        lighten-2
        py-3
        text-xs-center
        white--text
        xs12
      >
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
}
</script>
