<template>
    <v-card>
        <v-toolbar color="light-blue lighten-1" dark>
            <v-toolbar-title>Date Range</v-toolbar-title>
        </v-toolbar>
        <v-list two-line>
            <v-list-tile>
                <v-list-tile-content>
                    <v-list-tile-title>{{getRange.start}}</v-list-tile-title>
                    <v-list-tile-sub-title>From</v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
                <v-list-tile-content>
                    <v-list-tile-title>{{getRange.end}}</v-list-tile-title>
                    <v-list-tile-sub-title>Until</v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-card-actions>
            <v-flex xs12>
                <v-daterange :value="getRange" @input="setRange"></v-daterange>
            </v-flex>
        </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Action, Getter } from 'vuex-class';
// const VDaterange = require('vuetify-daterange-picker').VDaterange;
import { VDaterange } from 'vuetify-daterange-picker';
import 'vuetify-daterange-picker/dist/vuetify-daterange-picker.css';

@Component({components: { VDaterange }})
export default class DateSelection extends Vue {
    @Getter('getRange') public getRange: any;
    @Action('setRange') public setRange: any;
}
</script>
