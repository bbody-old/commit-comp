import axios from 'axios';
import { Route } from 'vue-router/types/router';
import { ActionContext } from 'vuex';

export default {
    setRange: ({commit}: any,
               {start, end, router}: {start: string, end: string, router: Route}) => {
        if (start) {
          commit('setDate', {type: 'start', date: start});
        }

        if (end) {
          commit('setDate', {type: 'end', date: end});
        }

        commit('updateQueryString', router);
      },
      getGithubData: ({commit}: any,
                      {username, router, firstRun}:
                      {username: string, router: Route, firstRun: boolean}) => {
        return axios.get(`https://api.github.com/users/${username}`)
          .then(() => {
            // Username is valid
            commit('addUser', username);

            if (!firstRun) {
              commit('setValidUser', username);
            }

            commit('updateQueryString', router);

            return axios.get(`https://github-contributions-api.now.sh/v1/${username}?format=nested`)
              .then((response) => {
                return response.data.contributions;
              })
              .then((contributionInfo) => {
                  commit('setContributions', {username, payload: contributionInfo});
              })
              .catch((error: Error) => {
                commit('setFormattedContributions', {username, payload: false});
                commit('setAPIError', true);
              });
          }).catch((error: any) => {
            if (error && error.response && error.response.status === 404) {
              commit('setInvalidUserError', username);
            } else if (error && error.response && error.response.status === 403) {
              // Add because the Github API is getting overwhelmed
              commit('addUser', username);
              commit('setAPIError', true);
              commit('updateQueryString', router);
            } else {
              commit('setAPIError', true);
            }
          });
      },
};
