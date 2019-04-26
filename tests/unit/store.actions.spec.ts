import actions from '@/store/actions';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

describe('Actions', () => {
    let state: State;

    beforeEach(() => {
        state = require('@/store/state').default;
    });

    describe('setRange', () => {
        it('all variables', () => {
            const router = 'router';
            const context = {
                commit: jest.fn(),
            };

            actions.setRange(context, {start: '2018-01-01', end: '2018-01-31', router: router as any});

            expect(context.commit).toBeCalledTimes(3);
            expect(context.commit.mock.calls[0]).toEqual(['setDate', {type: 'start', date: '2018-01-01'}]);
            expect(context.commit.mock.calls[1]).toEqual(['setDate', {type: 'end', date: '2018-01-31'}]);
            expect(context.commit.mock.calls[2]).toEqual(['updateQueryString', router]);
        });

        it('does not have end', () => {
            const router = 'router';
            const context = {
                commit: jest.fn(),
            };

            actions.setRange(context, {start: '2018-01-01', router: router as any} as any);

            expect(context.commit).toBeCalledTimes(2);
            expect(context.commit.mock.calls[0]).toEqual(['setDate', {type: 'start', date: '2018-01-01'}]);
            expect(context.commit.mock.calls[1]).toEqual(['updateQueryString', router]);
        });

        it('all does not have start', () => {
            const router = 'router';
            const context = {
                commit: jest.fn(),
            };

            actions.setRange(context, {end: '2018-01-31', router: router as any} as any);

            expect(context.commit).toBeCalledTimes(2);
            expect(context.commit.mock.calls[0]).toEqual(['setDate', {type: 'end', date: '2018-01-31'}]);
            expect(context.commit.mock.calls[1]).toEqual(['updateQueryString', router]);
        });
    });

    describe('getGithubData', () => {
        let axiosMock: any;
        beforeEach(() => {
            axiosMock = new AxiosMockAdapter(axios);
        });

        it('Throws an error in the case of a server error', async () => {
            const router = 'router';
            const context = {
                commit: jest.fn(),
            };

            axiosMock.onGet('https://api.github.com/users/test', {}).replyOnce(500, {});

            await actions.getGithubData(context, {username: 'test', router: router as any});

            expect(context.commit).toBeCalledTimes(1);
            expect(context.commit.mock.calls[0]).toEqual(['setAPIError', true]);
        });

        it('Throws an error in the case of no Github user', async () => {
            const router = 'router';
            const context = {
                commit: jest.fn(),
            };

            axiosMock.onGet('https://api.github.com/users/test', {}).replyOnce(404, {});

            await actions.getGithubData(context, {username: 'invaliduser', router: router as any});

            expect(context.commit).toBeCalledTimes(1);
            expect(context.commit.mock.calls[0]).toEqual(['setInvalidUserError', 'invaliduser']);
        });

        it('Throws an error in the case of Github API getting overwhelmed', async () => {
            const router = 'router';
            const context = {
                commit: jest.fn(),
            };

            axiosMock.onGet('https://api.github.com/users/invaliduser', {}).replyOnce(403, {});

            await actions.getGithubData(context, {username: 'invaliduser', router: router as any});

            expect(context.commit).toBeCalledTimes(3);
            expect(context.commit.mock.calls[0]).toEqual(['addUser', 'invaliduser']);
            expect(context.commit.mock.calls[1]).toEqual(['setAPIError', true]);
            expect(context.commit.mock.calls[2]).toEqual(['updateQueryString', router]);
        });

        it('Throws an error in the case of the contributions API getting overwhelmed', async () => {
            const router = 'router';
            const context = {
                commit: jest.fn(),
            };

            axiosMock.onGet('https://api.github.com/users/test', {}).replyOnce(200, {});
            axiosMock.onGet('https://github-contributions-api.now.sh/v1/test?format=nested', {}).replyOnce(500, {});
            await actions.getGithubData(context, {username: 'test', router: router as any});

            expect(context.commit).toBeCalledTimes(5);

            expect(context.commit.mock.calls[0]).toEqual(['addUser', 'test']);
            expect(context.commit.mock.calls[1]).toEqual(['setValidUser', 'test']);
            expect(context.commit.mock.calls[2]).toEqual(['updateQueryString', router]);
            expect(context.commit.mock.calls[3]).toEqual(
                ['setFormattedContributions', { username: 'test', payload: false }]);
            expect(context.commit.mock.calls[4]).toEqual(['setAPIError', true]);
        });

        it('Successfully handles both API', async () => {
            const router = 'router';
            const context = {
                commit: jest.fn(),
            };

            axiosMock.onGet('https://api.github.com/users/test', {}).replyOnce(200, {});
            axiosMock.onGet('https://github-contributions-api.now.sh/v1/test?format=nested',
                {}).replyOnce(200, {contributions: 'payload'});
            await actions.getGithubData(context, {username: 'test', router: router as any});

            expect(context.commit).toBeCalledTimes(4);

            expect(context.commit.mock.calls[0]).toEqual(['addUser', 'test']);
            expect(context.commit.mock.calls[1]).toEqual(['setValidUser', 'test']);
            expect(context.commit.mock.calls[2]).toEqual(['updateQueryString', router]);
            expect(context.commit.mock.calls[3]).toEqual(
                ['setContributions', { username: 'test', payload: 'payload' }]);
        });
    });
});
