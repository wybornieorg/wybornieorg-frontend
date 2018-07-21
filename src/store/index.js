import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    userVotes: {},
    domain: 'https://sejmor.herokuapp.com',
    votingsCache: {},
    loading: 0
  },
  mutations: {
    userVote: (state, props) => {
      if (props.vote === null) {
        Vue.delete(state.userVotes, props.numbers)
      } else {
        Vue.set(state.userVotes, props.numbers, props.vote ? 1 : -1)
      }
    },
    loadingUp (state) {
      state.loading++
    },
    loadingDown (state) {
      state.loading--
    },
    loadSavedData: (state, props) => {
      state.userVotes = props
    },
    cacheVoting: (state, props) => {
      console.log('caching ' + props.numbers)
      Vue.set(state.votingsCache, props.numbers, props.data)
    },
    adjustVotes (state, props) {
      if ((props.votingIntention === 'odrzucenie')) {
        for (let deputy of props.deputies) {
          deputy.vote = switchVote(deputy.vote)
        }
      }
      return props
    }
  },
  actions: {
  },
  getters: {
    isMobile: () => {
      return (window.innerHeight / window.innerWidth) > 1
    },
    currentVoting: (state) => (prop) => {
      return state.votingsCache[prop]
    }
  }
})

function switchVote (vote) {
  if (vote === 'Za') {
    return 'Przeciw'
  } else if (vote === 'Przeciw') {
    return 'Za'
  } else {
    return vote
  }
}
