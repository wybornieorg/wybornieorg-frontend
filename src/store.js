import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    userVotes: {},
    domain: "https://sejmor.herokuapp.com",
    votingsCache: {},
    loading: 0
  },
  mutations: {
    userVote: (state, props) => {
      if (props.vote === null) {
        Vue.delete(state.userVotes, props.numbers);
      } else {
        Vue.set(state.userVotes, props.numbers, props.vote ? 1 : -1);
      }
    },
    loadingUp(state) {
      state.loading++;
    },
    loadingDown(state) {
      state.loading--;
    },
    loadSavedData: (state, props) => {
      state.userVotes = props;
    },
    cacheVoting: (state, props) => {
      Vue.set(state.votingsCache, props.numbers, props.data);
    },
    adjustVotes(state, props) {
      if (props.votingIntention === "odrzucenie") {
        for (let deputy of props.deputies) {
          deputy.vote = switchVote(deputy.vote);
        }
      }
      return props;
    }
  },
  actions: {
    fetchVoting({ commit, state }, props) {
      if (props.votingNumbers.indexOf("undefined") === -1) {
        commit("loadingUp");
        axios
          .get(state.domain + "/dev/glosowania/" + props.votingNumbers)
          .then(response => {
            commit("adjustVotes", response.data);
            commit("cacheVoting", {
              numbers: props.votingNumbers,
              data: response.data
            });
            commit("loadingDown");
          });
      }
    }
  },
  getters: {
    isMobile: () => {
      return window.innerHeight / window.innerWidth > 1;
    },
    currentVoting: state => prop => {
      return state.votingsCache[prop];
    }
  }
});

function switchVote(vote) {
  if (vote === "Za") {
    return "Przeciw";
  } else if (vote === "Przeciw") {
    return "Za";
  } else {
    return vote;
  }
}
