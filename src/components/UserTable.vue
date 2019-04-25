<template>
    <v-data-table
    :headers="headers"
    :items="getAllUsersInfo"
    class="elevation-1"
    hide-actions
    >
      <template v-slot:items="props">
          <td>{{ props.item.username }}</td>
          <td>{{ props.item.commits }}</td>
          <td>{{ props.item.daysWithCommits }} {{ props.item.streak === 1 ? 'day' : 'days' }}</td>
          <td>{{ props.item.commitsPerDay.toFixed(2) }}/day</td>
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
          text: 'Username',
          align: 'center',
          sortable: false,
          value: 'username',
        },
        {
          text: 'Total commits',
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
          text: 'Commits per day',
          align: 'center',
          sortable: true,
          value: 'commitsPerDay',
        },
        {
          text: '% of days',
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
