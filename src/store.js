import { defineStore } from 'pinia';
import axios from 'axios';

// Production API lives on its own origin. Override at build time with
// VITE_API_URL (see vite.config.js).
export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:3000' : 'https://api.wybornie.org');

// User votes are persisted locally so they survive a page refresh — until now
// they only lived in memory and were lost unless the user bookmarked a
// #/wczytaj/<base64> link.
const STORAGE_KEY = 'wybornie.userVotes';

function loadSavedVotes() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    // Corrupt entry or storage disabled (private mode / quota) — start empty.
    return {};
  }
}

function persistVotes(votes) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
  } catch (e) {
    // Storage unavailable; votes stay in memory for this session only.
  }
}

function switchVote(vote) {
  if (vote === 'Za') {
    return 'Przeciw';
  } else if (vote === 'Przeciw') {
    return 'Za';
  }
  return vote;
}

export const useMainStore = defineStore('main', {
  state: () => ({
    userVotes: loadSavedVotes(),
    domain: API_URL,
    votingsCache: {},
    loading: 0,
    kadencjeList: []
  }),

  getters: {
    isMobile: () => window.innerHeight / window.innerWidth > 1,
    currentVoting: (state) => (prop) => state.votingsCache[prop]
  },

  actions: {
    userVote({ numbers, vote }) {
      if (vote === null) {
        delete this.userVotes[numbers];
      } else {
        this.userVotes[numbers] = vote ? 1 : -1;
      }
      persistVotes(this.userVotes);
    },
    loadingUp() {
      this.loading++;
    },
    loadingDown() {
      this.loading--;
    },
    loadSavedData(votes) {
      this.userVotes = votes;
      persistVotes(this.userVotes);
    },
    cacheVoting({ numbers, data }) {
      this.votingsCache[numbers] = data;
    },
    // Flips the deputy votes when the voting's intention was "odrzucenie",
    // so that "Za"/"Przeciw" line up with what the user actually chose.
    adjustVotes(voting) {
      if (voting && voting.votingIntention === 'odrzucenie' && voting.deputies) {
        for (const deputy of voting.deputies) {
          deputy.vote = switchVote(deputy.vote);
        }
      }
      return voting;
    },
    // Which terms the backend actually has data for. Drives the term picker so
    // a new kadencja shows up without a code change.
    async fetchKadencje() {
      try {
        const response = await axios.get(this.domain + '/dev/kadencje');
        const list = response.data
          .map((row) => parseInt(row.kadencja))
          .filter((n) => !Number.isNaN(n));
        this.kadencjeList = [...new Set(list)].sort((a, b) => a - b);
      } catch (e) {
        // Leave it empty; the view falls back to a static range.
      }
      return this.kadencjeList;
    },
    async fetchVoting({ votingNumbers }) {
      if (votingNumbers.indexOf('undefined') !== -1) {
        return;
      }
      this.loadingUp();
      try {
        const response = await axios.get(
          this.domain + '/dev/glosowania/' + votingNumbers
        );
        this.adjustVotes(response.data);
        this.cacheVoting({ numbers: votingNumbers, data: response.data });
      } finally {
        this.loadingDown();
      }
    },
    async fetchVotingsBulk() {
      this.loadingUp();
      try {
        const fetchList = [];
        for (const numbers in this.userVotes) {
          if (this.currentVoting(numbers) === undefined) {
            fetchList.push(numbers);
          }
        }
        if (fetchList.length > 0) {
          const response = await axios.get(
            this.domain +
              '/dev/glosowaniaBulk/' +
              window.btoa(JSON.stringify(fetchList))
          );
          for (const voting of response.data) {
            if (!voting) {
              continue;
            }
            this.adjustVotes(voting);
            this.cacheVoting({
              numbers: `${voting.numbers.kadencja}/${voting.numbers.posiedzenie}/${voting.numbers.glosowanie}`,
              data: voting
            });
          }
        }
      } finally {
        this.loadingDown();
      }
    }
  }
});