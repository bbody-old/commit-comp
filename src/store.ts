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
  },
  getters: {
    getUsernameError: (store) => store.usernameError,
    hasAPIError: (store) => store.apiError,
    getHeatMapData: (store) => (username: string) => store.heatMap[username],
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
      const contributions = store.formattedContributions[username];

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

      if (formattedContributionInfo.total > 0) {
        formattedContributionInfo.commitsPerDay =
          (formattedContributionInfo.commits / formattedContributionInfo.total) * 100.0;
      } else {
        formattedContributionInfo.commitsPerDay = 0;
      }

      return formattedContributionInfo;
    },
    // getContributions: (store) => (username: string) => store.formattedContributions[user],
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
      // let users = Object.values(store.formattedContributions);
      listToRank = listToRank.sort((a, b) => {
        return b[rankingAttribute] - a[rankingAttribute];
      });

      return listToRank.map((a) => a.username);
    },
    getShareLink: (store, getters) => {
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'http://commit-comp.bbody.io';
      const users = getters.getUsers;
      const startDate = getters.getStartDate;
      const endDate = getters.getEndDate;

      const usersQuery = users && users.length ? `users=${users}&` : '';
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

      const queryUrl = query.length > 0 ? `?${query.join('&')}` : '';

      return `${baseUrl}/#/${queryUrl}`;
    },
    getStartDate: (store) => {
      return store.range.start;
    },
    getEndDate: (store) => {
      return store.range.end;
    },
    getRange: (store, getters) => {
      const rangeObject = {
        start: getters.getStartDate,
        end: getters.getEndDate,
      };
      return rangeObject;
    },
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
    setHeatMap: (store, {username, payload}) => {
      store.heatMap[username] = payload;
    },
    setDate: (store, {type, date}) => {
      store.range[type] = date;
    },
    setAPIError: (store) => {
      store.apiError = true;
      setTimeout(() => {
        store.apiError = false;
      }, 1500);
    },
    setRanking: (store, ranking) => {
      // store.ranking = ranking;
      Vue.set(store, 'ranking', ranking);
    },
  },
  actions: {
    setRange: (context, range) => {
      context.commit('setDate', {type: 'start', date: range.start});
      context.commit('setDate', {type: 'end', date: range.end});
    },
    getGithubData: (context, username) => {
      context.commit('addUser', username);
      return axios.get(`https://github-contributions-api.now.sh/v1/${username}?format=nested`)
        .then((response) => {
          return response.data.contributions;
        })
        .then((contributionInfo) => {
            context.commit('setContributions', {username, payload: contributionInfo});

            const state = context.state;
            const details = [];
            const now  = moment();
            let tempDate = moment().subtract('year', 1);

              // const contributionInfo = state.contributionInfo[username];
            while (true) {
                if (tempDate.isAfter(now)) {
                  break;
                }

                const year = tempDate.year();
                const month = tempDate.month() + 1;
                const date = tempDate.date();

                const contribution = year === now.year() ?
                  contributionInfo.contributions[year][month][date] :
                  contributionInfo[year][month][date];

                details.push({
                  date: contribution.date,
                  count: contribution.count,
                } as HeatMap);

                tempDate = tempDate.add('day', 1);
              }

            context.commit('setHeatMap', {username, payload: details});
        })
        .catch((error: Error) => {
          context.commit('setFormattedContributions', {username, payload: false});
          context.commit('setAPIError', true);
        });
    },
  },
});
