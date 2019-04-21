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
  },
  getters: {
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

      return formattedContributionInfo;
    },
    // getContributions: (store) => (username: string) => store.formattedContributions[user],
    getUsers: (store) => store.users,
    getRankedUsers: (store, getters) => {
      let listToRank: any[] = [];
      store.users.forEach((user: string) => {
        const info = getters.getContributionInfo(user);
        console.log(info);
        if (!info) {
          listToRank.push(info);
        }
      });

      // let users = Object.values(store.formattedContributions);
      listToRank = listToRank.sort((a, b) => {
        return b.daysWithCommits - a.daysWithCommits;
      });

      return listToRank.map((a) => a.username);
      // return ['bbody'];
    },
    getShareLink: (store, getters) => {
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://commit-comp.bbody.io';
      const users = getters.getUsers;
      const startDate = getters.getStartDate;
      const endDate = getters.getEndDate;

      const usersQuery = users && users.length ? `users=${users}&` : '';
      const query = [];

      if (users && users.length) {
        query.push(`users=${query.push(users.join(','))}`);
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
            // let formattedContributionInfo = {
            //   days: [],
            //   dates: [],
            //   colours: [],
            //   daysWithCommits: 0,
            //   daysWithoutCommits: 0,
            //   total: 0,
            //   username,
            //   commits: 0,
            //   streak: 0
            // };
            const state = context.state;

            // for (let year = state.startDate.year; year <= state.endDate.year; year++) { // Loop through years
            //   for (let month = state.startDate.month; month <= state.endDate.month; month++) { // Loop through months
            //     for (let day = state.startDate.day; day <= state.endDate.day; day++) { // Loop through days
            //       const contribution = year == 2019 ?
            //         contributionInfo.contributions[year][month][day] : contributionInfo[year][month][day];
            //       const count = contribution.count;
            //       const colour = contribution.color;
            //       const date = contribution.date;

            //       formattedContributionInfo.days.push(count);
            //       formattedContributionInfo.colours.push(colour);
            //       formattedContributionInfo.dates.push(date);

            //       formattedContributionInfo.username = username;
            //       if (count > 0) {
            //         formattedContributionInfo.daysWithCommits++;
            //       } else {
            //         formattedContributionInfo.daysWithoutCommits++;
            //       }
            //     }
            //   }
            // }
            // const now = moment();
            // let tempDate = getMomentDate(state.startDate);
            // const endDate = getMomentDate(state.endDate);
            // let currentStreak = 0;
            // while (true) {
            //   if (tempDate.isAfter(endDate) || tempDate.isSameOrAfter(now)) {
            //     break;
            //   }

            //   const year = tempDate.year();
            //   const month = tempDate.month() + 1;
            //   const day = tempDate.date();

            //   console.log('month', month);

            //   const contribution = year === now.year() ?
            //     contributionInfo.contributions[year][month][day] : contributionInfo[year][month][day];
            //   const count = contribution.count;
            //   const colour = contribution.color;
            //   const date = contribution.date;

            //   formattedContributionInfo.days.push(count);
            //   formattedContributionInfo.colours.push(colour);
            //   formattedContributionInfo.dates.push(date);

            //   formattedContributionInfo.username = username;
            //   formattedContributionInfo.commits += count;

            //   if (count > 0) {
            //     formattedContributionInfo.daysWithCommits++;
            //     currentStreak++;
            //     formattedContributionInfo.streak = Math.max(currentStreak, formattedContributionInfo.streak);
            //   } else {
            //     formattedContributionInfo.streak = Math.max(currentStreak, formattedContributionInfo.streak);
            //     currentStreak = 0;
            //     formattedContributionInfo.daysWithoutCommits++;
            //   }
            //   console.log(tempDate.format('DD/MM/YYYY'), count);
            //   tempDate = tempDate.add('day', 1);
            // }
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



            // for (let year = oneYearAgo.year(); year <= state.endDate.year; year++) { // Loop through years
            //   for (let month = oneYearAgo.month(); month <= state.endDate.month; month++) { // Loop through months
            //     for (let day = oneYearAgo.day(); day <= state.endDate.day; day++) { // Loop through days
            //       const contribution = year == 2019 ?
            //         contributionInfo.contributions[year][month][day] : contributionInfo[year][month][day];
            //       const count = contribution.count;
            //       const colour = contribution.color;
            //       const date = contribution.date;

            //       formattedContributionInfo.days.push(count);
            //       formattedContributionInfo.colours.push(colour);
            //       formattedContributionInfo.dates.push(date);
            //     }
            //   }
            // }
            // formattedContributionInfo.total = formattedContributionInfo.daysWithCommits +
            //   formattedContributionInfo.daysWithoutCommits;

            // context.commit('setFormattedContributions', {username, payload: formattedContributionInfo});
        })
        .catch((error: Error) => {
          context.commit('setFormattedContributions', {username, payload: false});
          console.error(error);
        });
    },
  },
});
