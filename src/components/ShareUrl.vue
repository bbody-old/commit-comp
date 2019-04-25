<template>
    <v-container>
        <v-layout row wrap>
            <v-text-field
                :value="getShareLink"
                label="Share Link"
                readonly
            ></v-text-field>
            <v-btn
                :loading="copying"
                :disabled="copying"
                color="success"
                v-clipboard:success="updateCopy"
                v-clipboard:copy="() => getLink"
                >
                Copy to clipboard
                <template v-slot:loader>
                    <span>Copied...</span>
                </template>
            </v-btn>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Mutation, State, Getter } from 'vuex-class';

@Component
export default class ShareUrl extends Vue {
    @Getter('getShareLink') public getShareLink!: string;

    private copying: boolean = false;

    private get getLink() {
        return this.getShareLink;
    }

    public updateCopy() {
        this.copying = true;

        const self = this;
        setTimeout(() => {
            self.copying = false;
        }, 1_000);
    }
}
</script>
