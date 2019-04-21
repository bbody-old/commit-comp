<template>
    <v-data-table
    :headers="headers"
    :items="getAllUsersInfo"
    default-sort="rank:asc"
    class="elevation-1"
    >
      <template v-slot:items="props">
          <td>
          {{props.index + 1}}
          </td>
          <td>{{ props.item.username }}</td>
          <td>{{ props.item.commits }}</td>
          <td>{{ props.item.daysWithCommits }} {{ props.item.streak === 1 ? 'day' : 'days' }}</td>
          <td>{{ props.item.percentageOfDays.toFixed(2) }}%</td>
          <td>{{ props.item.streak }} {{ props.item.streak === 1 ? 'day' : 'days' }}</td>
      </template>
    </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Mutation, State, Getter } from 'vuex-class';

@Component
export default class UserTable extends Vue {
    @Getter('getAllUsersInfo') private getAllUsersInfo: any;
    private headers = [
        {
          text: 'Rank',
          align: 'center',
          sortable: true,
          value: 'rank',
        },
        {
          text: 'Username',
          align: 'center',
          sortable: false,
          value: 'username',
        },
        {
          text: 'Total Commits',
          align: 'center',
          sortable: true,
          value: 'commits',
        },
        {
          text: 'Days with commits',
          align: 'center',
          sortable: true,
          value: 'daysWithCommits',
        },
        {
          text: 'Percentage of days',
          align: 'center',
          sortable: true,
          value: 'percentageOfDays',
        },
        {
          text: 'Longest streak',
          align: 'center',
          sortable: true,
          value: 'streak',
        },
    ];
}
</script>
