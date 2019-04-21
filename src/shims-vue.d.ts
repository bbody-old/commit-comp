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
}

interface FormattedContributions {
  [username: string]: ContributorInfo;
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
