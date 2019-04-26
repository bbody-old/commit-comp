declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

interface DateRange {
  [type: string]: string;
}

interface ContributorInfo {
  counts: number[];
  dates: string[];
  daysWithCommits: number;
  daysWithoutCommits: number;
  total: number;
  username: string;
  commits: number;
  streak: number;
  percentageOfDays: number;
  commitsPerDay: number;
}

interface FormattedContributions {
  [username: string]: ContributorInfo;
}

interface Ranking {
  name: string;
  id: string;
}

interface HeatMapInfo {
  date: string;
  count: number;
}

interface HeatMap {
  [username: string]: HeatMapInfo;
}

interface RawContribution {
  [username: string]: {
    [year: number]: RawContributionInfo;
    contributions: {
      [year: number]: RawContributionInfo;
    };
  };
}

interface RawContributionInfo {
  [month: number]: {
    [day: number]: {
      count: number;
      date: string;
    },
  };
}

interface State {
  users: string[];
  contributionInfo: RawContribution;
  range: DateRange;
  formattedContributions: FormattedContributions;
  heatMap: HeatMap;
  apiError: boolean;
  usernameError: string;
  invalidUser: string;
  validUser: string;
}

interface Contributor {
  username: string;
  payload: RawContributionInfo;
}

interface FormattedContributor {
  username: string;
  payload: ContributorInfo;
}

interface DatePayload {
  date: string;
  type: 'start' | 'end';
}

interface Getters {
  validUser(): string;
  invalidUser(): string;
  getUsernameError(): string;
  hasAPIError(): boolean;
  getAllUsersInfo(): ContributorInfo[];
  getContributionInfo(user: string): ContributorInfo;
  getUsers(): string[];
  isDevelopmentEnvironment(): boolean;
  getRange(): DateRange;
}
