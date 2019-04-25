<template>
  <v-card>
    <v-toolbar color="light-blue lighten-1" dark>
      <v-toolbar-title>Github Users</v-toolbar-title>
    </v-toolbar>

    <v-alert
      :value="validUser"
      type="success"
    >
      Successfully added {{validUser}}.
    </v-alert>

    <v-alert
      :value="invalidUser"
      type="error"
    >
      {{invalidUser}} is not a valid Github user.
    </v-alert>

    <v-alert
      :value="usernameBlank"
      type="error"
    >
      Username not entered
    </v-alert>

    <v-alert
      :value="usernameDuplicate"
      type="error"
    >
      {{username}} already exists in the list
    </v-alert>

    <v-list two-line>
      <template v-for="(user) in getUsers">
        <v-subheader :key="user">
          <a v-bind:href="'https://github.com/' + user">{{ user }}</a>
        </v-subheader>
      </template>
    </v-list>

    <v-divider></v-divider>
    <v-card-actions>
    <v-text-field
      label="Username"
      v-model="username"
      @keyup.enter="submitInput"
    ></v-text-field>
    <v-btn v-on:click="submitInput" color="success" small fab>
      <v-icon>add</v-icon>
    </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Mutation, State, Getter } from 'vuex-class';

@Component
export default class Users extends Vue {
    @Getter public getUsers!: string[];
    @Getter public invalidUser!: string;
    @Getter public validUser!: string;

    public username = '';
    public success = false;
    public usernameBlank = false;
    public usernameDuplicate = false;
    public submitInput() {
        if (!this.username) {
          this.usernameBlank = true;
          const self = this;
          setTimeout(() => {
            this.usernameBlank = false;
          }, 1500);

          return;
        }

        if (this.getUsers.includes(this.username)) {
          this.usernameDuplicate = true;

          setTimeout(() => {
            this.usernameDuplicate = false;
            this.username = '';
          }, 1_500);

          return;
        }

        this.$store.dispatch('getGithubData', this.username);

        this.success = true;

        setTimeout(() => {
            this.success = false;
            this.username = '';
          }, 1_500);
    }
}
</script>
