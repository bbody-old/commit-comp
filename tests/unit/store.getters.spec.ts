import getters from '@/store/getters';

describe('Getters', () => {
    let state: State;

    beforeEach(() => {
        state = require('@/store/state').default;
    });

    it('validUser', () => {
        state.validUser = 'test';
        expect(getters.validUser(state)).toBe('test');
    });

    it('invalidUser', () => {
        state.invalidUser = 'test';
        expect(getters.invalidUser(state)).toBe('test');
    });

    it('getUsernameError', () => {
        state.usernameError = 'test';
        expect(getters.getUsernameError(state)).toBe('test');
    });

    it('validUser', () => {
        state.validUser = 'test';
        expect(getters.validUser(state)).toBe('test');
    });

    it('hasAPIError', () => {
        state.apiError = true;
        expect(getters.hasAPIError(state)).toBeTruthy();

        state.apiError = false;
        expect(getters.hasAPIError(state)).toBeFalsy();
    });

    it('getUsers', () => {
        state.users = ['test1', 'test2'];
        expect(getters.getUsers(state)).toEqual(['test1', 'test2']);
    });

    it('isDevelopmentEnvironment', () => {
        process.env.NODE_ENV = 'development';
        expect(getters.isDevelopmentEnvironment()).toBeTruthy();

        process.env.NODE_ENV = 'production';
        expect(getters.isDevelopmentEnvironment()).toBeFalsy();
    });

    it('getRange', () => {
        const range = {
            start: 'start',
            end: 'end',
        };

        state.range = range;

        expect(getters.getRange(state)).toEqual(range);
    });

    it('getAllUsersInfo', () => {
        state.range = {
            start: '2018-01-05',
            end: '2018-01-06',
        };

        state.users = ['test'];

        const contributionInfo = {
            counts: [1, 0],
            dates: ['2018-01-05', '2018-01-06'],
            daysWithCommits: 1,
            daysWithoutCommits: 1,
            total: 2,
            username: 'test',
            commits: 1,
            streak: 1,
            percentageOfDays: 50,
            commitsPerDay: 0.5,
        } as ContributorInfo;

        const customGetters = {
            getUsers: () => ['test'],
            getContributionInfo: (username: string) => false as ContributorInfo | boolean,
        };

        expect(getters.getAllUsersInfo(state, customGetters as any)).toEqual([]);

        customGetters.getContributionInfo = (username: string) => contributionInfo;

        const contributionArray = [
            {
                commits: 1,
                commitsPerDay: 0.5,
                counts: [1, 0],
                dates: ['2018-01-05', '2018-01-06'],
                daysWithCommits: 1,
                daysWithoutCommits: 1,
                percentageOfDays: 50,
                streak: 1,
                total: 2,
                username: 'test',
            },
        ];

        expect(getters.getAllUsersInfo(state, customGetters as any)).toEqual(contributionArray);
    });

    it('getContributionInfo', () => {
        state.range = {
            start: '2018-01-05',
            end: '2018-01-06',
        };
        state.contributionInfo = {};

        expect(getters.getContributionInfo(state)('test')).toBe(false);

        const rawContributionInfo = {
            1: {
                5: {
                    count: 1,
                    date: '2018-01-05',
                },
                6: {
                    count: 0,
                    date: '2018-01-06',
                },
            },
        } as RawContributionInfo;

        const rawContribution = {
            test: {
                2018: rawContributionInfo,
                contributions: {
                    2019: rawContributionInfo,
                },
            },
        } as RawContribution;

        const contributionInfo = {
            counts: [1, 0],
            dates: ['2018-01-05', '2018-01-06'],
            daysWithCommits: 1,
            daysWithoutCommits: 1,
            total: 2,
            username: 'test',
            commits: 1,
            streak: 1,
            percentageOfDays: 50,
            commitsPerDay: 0.5,
        } as ContributorInfo;

        state.contributionInfo = rawContribution;

        expect(getters.getContributionInfo(state)('test')).toEqual(contributionInfo);
    });
});
