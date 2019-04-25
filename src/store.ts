import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import moment from 'moment';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    users: [] as string[],
    contributionInfo: {} as RawContribution,
    range: {
      start: moment().date(1).format('YYYY-MM-DD'),
      end: moment().month(moment().month() + 1).subtract(1, 'day').format('YYYY-MM-DD'),
    } as DateRange,
    formattedContributions: {} as FormattedContributions,
    heatMap: {} as HeatMap,
    apiError: false as boolean,
    usernameError: '' as string,
    invalidUser: '' as string,
    validUser: '' as string,
  },
  getters: {
    validUser: (store) => store.validUser,
    invalidUser: (store) => store.invalidUser,
    getUsernameError: (store) => store.usernameError,
    hasAPIError: (store) => store.apiError,
    getAllUsersInfo: (store, getters) => {
      const users = getters.getUsers;
      const infoArray: any[] = [];

      users.forEach((user: string) => {
        const info = getters.getContributionInfo(user);
        if (info) {
          infoArray.push(info);
        }
      });
      return infoArray;
    },
    getContributionInfo: (store) => (username: string) => {
      const tempDate = moment(store.range.start, 'YYYY-MM-DD');
      const endDate = moment(store.range.end, 'YYYY-MM-DD');

      const formattedContributionInfo = {
        counts: [],
        dates: [],
        daysWithCommits: 0,
        daysWithoutCommits: 0,
        total: 0,
        username,
        commits: 0,
        streak: 0,
        percentageOfDays: 0,
        commitsPerDay: 0,
      } as ContributorInfo;

      let streak = 0;

      if (!store.contributionInfo[username]) {
        return false;
      }

      while (true) {
        if (tempDate.isAfter(endDate) || tempDate.isSameOrAfter(moment())) {
          break;
        }

        const info = (tempDate.year() === moment().year() ?
          store.contributionInfo[username].contributions :
          store.contributionInfo[username])[tempDate.year()][tempDate.month() + 1][tempDate.date()];


        formattedContributionInfo.counts.push(info.count);
        formattedContributionInfo.dates.push(info.date);

        formattedContributionInfo.commits += info.count;

        if (info.count > 0) {
          formattedContributionInfo.daysWithCommits += 1;
          streak++;
          formattedContributionInfo.streak = Math.max(streak, formattedContributionInfo.streak);
        } else {
          formattedContributionInfo.daysWithoutCommits += 1;
          streak = 0;
        }

        tempDate.add(1, 'day');
      }

      formattedContributionInfo.total = formattedContributionInfo.daysWithCommits +
        formattedContributionInfo.daysWithoutCommits;
      formattedContributionInfo.percentageOfDays = (
        (formattedContributionInfo.daysWithCommits / formattedContributionInfo.total)
        * 100.0);

      if (formattedContributionInfo.commits > 0) {
        formattedContributionInfo.commitsPerDay =
          formattedContributionInfo.commits / formattedContributionInfo.total;
      } else {
        formattedContributionInfo.commitsPerDay = 0;
      }

      return formattedContributionInfo;
    },
    getUsers: (store) => store.users,
    getRankedUsers: (store, getters) => {
      let listToRank: any[] = [];

      store.users.forEach((user: string) => {
        const info = getters.getContributionInfo(user);
        if (!info) {
          listToRank.push(info);
        }
      });

      const rankingAttribute = getters.getRanking;

      listToRank = listToRank.sort((a, b) => {
        return b[rankingAttribute] - a[rankingAttribute];
      });

      return listToRank.map((a) => a.username);
    },
    isDevelopmentEnvironment: (store) => process.env.NODE_ENV === 'development',
    getShareLink: (store, getters) => {
      const baseUrl = getters.isDevelopmentEnvironment ?
        'http://localhost:8080' : 'https://commit-comp.bbody.io';
      const users = getters.getUsers;
      const startDate = getters.getStartDate;
      const endDate = getters.getEndDate;
      const query = [];

      if (users && users.length) {
        query.push(`users=${users.join(',')}`);
      }

      if (startDate) {
        query.push(`start=${startDate}`);
      }

      if (endDate) {
        query.push(`end=${endDate}`);
      }

      const urlQuery = query.length > 0 ? `?${query.join('&')}` : '';

      return `${baseUrl}/#/${urlQuery}`;
    },
    getRange: (store) => store.range,
  },
  mutations: {
    addUser: (store, username: string) => {
      store.users.push(username);
    },
    setFormattedContributions: (store, data) => {
      Vue.set(store.formattedContributions, data.username, data.payload);
    },
    setContributions: (store, data) => {
      Vue.set(store.contributionInfo, data.username, data.payload);
    },
    setDate: (store, {type, date}) => {
      store.range[type] = date;
    },
    setAPIError: (store) => {
      store.apiError = true;
    },
    setInvalidUserError: (store, username) => {
      store.invalidUser = username;
      setTimeout(() => {
        store.invalidUser = '';
      }, 1_500);
    },
    setValidUser: (store, username) => {
      store.validUser = username;
      setTimeout(() => {
        store.validUser = '';
      }, 1_500);
    },
    updateQueryString: (store, router) => {
      const query = {
        start: store.range.start,
        end: store.range.end,
        users: store.users.join(','),
      };
      router.push({query});
    },
  },
  actions: {
    setRange: (context, {start, end, router}) => {
      if (start) {
        context.commit('setDate', {type: 'start', date: start});
      }

      if (end) {
        context.commit('setDate', {type: 'end', date: end});
      }

      context.commit('updateQueryString', router);
    },
    getGithubData: (context, {username, router}) => {
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
  },
});
