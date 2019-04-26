import mutations from '@/store/mutations';

describe('Mutations', () => {
    let state: State;

    beforeEach(() => {
        state = require('@/store/state').default;
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    it('addUser', () => {
        mutations.addUser(state, 'test');

        expect(state.users.length).toBe(1);
        expect(state.users).toContain('test');
    });

    it('setFormattedContributions', () => {
        const contributionInfo = {
            counts: [1],
            dates: [''],
            daysWithCommits: 1,
            daysWithoutCommits: 1,
            total: 2,
            username: 'test',
            commits: 50,
            streak: 2,
            percentageOfDays: 100,
            commitsPerDay: 25,
        } as ContributorInfo;

        mutations.setFormattedContributions(state, { username: 'test', payload: contributionInfo });
        expect(Object.keys(state.formattedContributions)).toContain('test');
        expect(state.formattedContributions.test).toEqual(contributionInfo);
    });

    it('setContributions', () => {
        const rawContributionInfo = {
            1: {
                5: {
                    count: 1,
                    date: 'date',
                },
            },
        } as RawContributionInfo;

        mutations.setContributions(state, { username: 'test', payload: rawContributionInfo });
        expect(Object.keys(state.formattedContributions)).toContain('test');
        expect(state.contributionInfo.test).toEqual(rawContributionInfo);
    });

    it('setDate', () => {
        mutations.setDate(state, { type: 'start', date: 'date' });
        expect(Object.keys(state.range)).toContain('start');
        expect(state.range.start).toBe('date');
    });

    it('setAPIError', () => {
        mutations.setAPIError(state);
        expect(state.apiError).toBe(true);
    });

    it('setInvalidUserError', () => {
        mutations.setInvalidUserError(state, 'test');
        expect(state.invalidUser).toBe('test');

        jest.advanceTimersByTime(1_500);

        expect(state.invalidUser).toBe('');
    });

    it('setValidUser', () => {
        mutations.setValidUser(state, 'test');
        expect(state.validUser).toBe('test');

        jest.advanceTimersByTime(1_500);

        expect(state.validUser).toBe('');
    });

    it('updateQueryString', () => {
        state.range = {
            start: 'start',
            end: 'end',
        };

        state.users = ['test1', 'test2'];

        const router = {
            push: jest.fn(),
        };

        mutations.updateQueryString(state, router as any);

        expect(router.push).toBeCalledWith({
            query: {
                start: 'start',
                end: 'end',
                users: 'test1,test2',
            },
        });
    });
});
