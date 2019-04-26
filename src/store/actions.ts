import axios from 'axios';
import { Route } from 'vue-router/types/router';
import { ActionContext } from 'vuex';

export default {
    setRange: (context: any,
               {start, end, router}: {start: string, end: string, router: Route}) => {
        if (start) {
          context.commit('setDate', {type: 'start', date: start});
        }

        if (end) {
          context.commit('setDate', {type: 'end', date: end});
        }

        context.commit('updateQueryString', router);
      },
      getGithubData: (context: any,
                      {username, router}: {username: string, router: Route}) => {
        return axios.get(`https://api.github.com/users/${username}`)
          .then(() => {
            // Username is valid
            context.commit('addUser', username);
            context.commit('setValidUser', username);
            context.commit('updateQueryString', router);

            return axios.get(`https://github-contributions-api.now.sh/v1/${username}?format=nested`)
              .then((response) => {
                return response.data.contributions;
              })
              .then((contributionInfo) => {
                  context.commit('setContributions', {username, payload: contributionInfo});
              })
              .catch((error: Error) => {
                context.commit('setFormattedContributions', {username, payload: false});
                context.commit('setAPIError', true);
              });
          }).catch((error: any) => {
            if (error && error.response && error.response.status === 404) {
              context.commit('setInvalidUserError', username);
            } else if (error && error.response && error.response.status === 403) {
              // Add because the Github API is getting overwhelmed
              context.commit('addUser', username);
              context.commit('setAPIError', true);
              context.commit('updateQueryString', router);
            } else {
              context.commit('setAPIError', true);
            }
          });
      },
};
