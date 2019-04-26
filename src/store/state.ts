import moment from 'moment';

export default {
    users: [],
    contributionInfo: {},
    range: {
      start: moment().date(1).format('YYYY-MM-DD'),
      end: moment().month(moment().month() + 1).subtract(1, 'day').format('YYYY-MM-DD'),
    },
    formattedContributions: {},
    heatMap: {},
    apiError: false,
    usernameError: '',
    invalidUser: '',
    validUser: '',
} as State;
