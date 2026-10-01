<template>
<div id="main-app">
  <app-nav @staty="showStats = true" @votingList="showList = !showList"></app-nav>

  <popup v-if="showStats" @close="showStats = false">
    <template #header>
      <h1>Statystyki</h1>
    </template>
    <template #content>
      <stats></stats>
    </template>
  </popup>

  <transition name="fade">
    <div v-show="loading" id="loading-thing"></div>
  </transition>
  <votings-list @hideList="showList = !showList" v-show="!isMobile || showList"></votings-list>
  <router-view></router-view>

</div>
</template>

<script>
import { useMainStore } from '@/store';
import Popup from '@/components/generic/Popup.vue';
import Stats from '@/components/Stats.vue';
import Voting from '@/components/Voting.vue';
import VotingsList from '@/components/VotingsList.vue';
import AppNav from '@/components/AppNav.vue';

export default {
  name: "mainapp",
  components: {
    Popup,
    AppNav,
    Stats,
    Voting,
    VotingsList
  },
  setup() {
    return { store: useMainStore() };
  },
  data() {
    return {
      showStats: false,
      showList: false
    };
  },
  created() {
    // `isMobile` reads the viewport, so it can't be used in data() directly.
    this.showList = this.isMobile;
  },
  computed: {
    loading() {
      return this.store.loading;
    },
    isMobile() {
      return this.store.isMobile;
    }
  }
};
</script>

<style>
#main-app {
  display: flex;
  height: 100vh;
  width: 100vw;
}

#loading-thing {
  position: fixed;
  top: 15vmin;
  left: calc(50vw - 5.5vmin);
  z-index: 99;
  height: 10vmin;
  width: 10vmin;
  border: 2vmin solid crimson;
  border-left: 2vmin solid white;
  border-bottom: 2vmin solid white;
  border-radius: 100%;
  animation: 1s rotate360 infinite ease-in-out;
  box-shadow: white 0 0 5vmin 0vmin inset, white 0 0 5vmin 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.blink-enter-active,
.blink-leave-active {
  transition: opacity 2s;
}

.blink-enter *,
.blink-leave-to {
  opacity: 0;
}

@keyframes rotate360 {
  to {
    transform: rotate(360deg);
  }
}

@media screen and (max-aspect-ratio: 1/1) {
  #main-app {
    flex-direction: column;
  }
  .list-hidden {
    visibility: hidden;
  }
}
</style>