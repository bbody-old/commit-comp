import moment from 'moment';

export default {
    validUser: (store: State) => store.validUser,
    invalidUser: (store: State) => store.invalidUser,
    getUsernameError: (store: State) => store.usernameError,
    hasAPIError: (store: State) => store.apiError,
    getUsers: (store: State) => store.users,
    isDevelopmentEnvironment: () => process.env.NODE_ENV === 'development',
    getRange: (store: State) => store.range,
    getAllUsersInfo: (store: State, getters: Getters) => {
        const users = getters.getUsers as string[];
        const infoArray: any[] = [];

        users.forEach((user: string) => {
            const info = getters.getContributionInfo(user);
            if (info) {
                infoArray.push(info);
            }
        });
        return infoArray;
    },
    getContributionInfo: (store: State) => (username: string) => {
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
                store.contributionInfo[username].contributions! :
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
};
