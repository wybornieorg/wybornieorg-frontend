<template>
<div class="voting-menu">
  <popup v-if="dbUpdate" @close="dbUpdate = false">
    <template #header>
      <h1><font-awesome-icon icon="sync-alt" />Ups!</h1>
    </template>
    <template #content>
      <h3>Właśnie trwa synchronizacja bazy danych <a href="https://wybornie.org">wybornie.org</a> ze stroną Sejmu!</h3>
      <p>Z tego powodu nie wszystkie funkcje są dostępne (brak niektórych głosowań, brak artykułów mamprawowiedziec.pl i nazw zwyczajowych). Jeśli Ci to przeszkadza, spróbuj odświeżyć stronę za 5 minut i skorzystaj kiedy przestanie się pojawiać to okno!</p>
      <strong>Nie zapomnij zapisać swoich głosów, usuną się, jeśli odświeżysz bez zapisania ich!</strong>
    </template>
  </popup>
  <div class="sort-filter-menu">
    <VDropdown :distance="16" theme="popover">
      <div v-tooltip="'Kadencje'" class="tooltip-target b3 glow">
        <span>{{kadencje}}</span>
      </div>

      <template #popper>
          <div v-for="(item, index) in kadencjeOptions" :key="index">
            <input v-close-popper :id="'k' + item" type="radio" :value="item" v-model="kadencje">
            <label :for="'k' + item">{{item}}</label>
          </div>
      </template>
    </VDropdown>

    <VDropdown :distance="16" theme="popover">
      <div v-tooltip="'Sortowanie'" class="sortowanie tooltip-target b3 glow">
        <font-awesome-icon v-if="sortowanie === 'data'" icon="calendar" />
        <font-awesome-icon v-if="sortowanie === 'frekwencja'" icon="users" />
        <font-awesome-icon v-if="sortowanieKierunek === 'rosnaco'" icon="sort-up" />
        <font-awesome-icon v-if="sortowanieKierunek === 'malejaco'" icon="sort-down" />
      </div>

      <template #popper>
          <div>
            <div>
              <input type="radio" id="malejaco" value="malejaco" v-model="sortowanieKierunek">
              <label for="malejaco"><font-awesome-icon icon="sort-down" />malejąco</label>
            </div>
            <div>
              <input type="radio" id="rosnaco" value="rosnaco" v-model="sortowanieKierunek">
              <label for="rosnaco"><font-awesome-icon icon="sort-up" />rosnąco</label>
            </div>
          </div>
          <div>
            <div>
              <input v-close-popper type="radio" id="data" value="data" v-model="sortowanie">
              <label for="data"><font-awesome-icon icon="calendar" />data</label>
            </div>
            <div>
              <input v-close-popper type="radio" id="frekwencja" value="frekwencja" v-model="sortowanie">
              <label for="frekwencja"><font-awesome-icon icon="users" />frekwencja</label>
            </div>
          </div>
      </template>
    </VDropdown>

    <VDropdown :distance="16" theme="popover">
      <div v-tooltip="'Filtrowanie'" class="tooltip-target b3 glow">
        <font-awesome-icon icon="filter" />
      </div>

      <template #popper>
          <div class="filtrowanie-status">
            <div>
              <input id="uchwalonoCB" type="checkbox" value="uchwalono" v-model="filtrowanieStatus">
              <label for="uchwalonoCB">uchwalone</label>
            </div>
            <div>
              <input id="odrzuconyCB" type="checkbox" value="odrzucony" v-model="filtrowanieStatus">
              <label for="odrzuconyCB">odrzucone</label>
            </div>
            <div>
              <input id="nazwane" type="checkbox" value="nazwane" v-model="filtrowanieNazwane">
              <label for="nazwane">nazwane</label>
            </div>
            <div>
              <input id="mamprawowiedziec" type="checkbox" value="mamprawowiedziec" v-model="filtrowanieMPW">
              <label for="mamprawowiedziec">#noweprawa
                <a target="_blank" href="http://serwis.mamprawowiedziec.pl/tag.php?tag=1&s=wchodzi%20w%20%C5%BCycie"><font-awesome-icon icon="external-link-alt" /></a>
              </label>
            </div>
            <div>
              <input id="prawoUE" type="checkbox" v-model="filtrowanieUE">
              <label for="prawoUE">prawo UE</label>
            </div>
          </div>
      </template>
    </VDropdown>

    <VDropdown :distance="16" theme="popover" @show="focusSearch">
      <div v-tooltip="'Wyszukiwanie'" class="tooltip-target b3 glow search">
        <font-awesome-icon icon="search" />
      </div>

      <template #popper>
          <div class="filtrowanie-nazwa">
            <input type="text" id="filtrowanieNazwa" v-model="filtrowanieNazwa" placeholder="Filtruj tytuły, np. 'podatk'">
          </div>
      </template>
    </VDropdown>
    <div class="center nowrap">
      Σ {{votingsProcessed.length}}
    </div>
  </div>

  <div id="scrollable-container">
    <div class="voting-list" @click="$emit('hideList')">
      <votings-list-item :id="index" v-for="(voting, index) in votingsDisplayed" :key="index" :voting='voting'></votings-list-item>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import { useMainStore } from '@/store';
import VotingsListItem from '@/components/VotingsListItem.vue';
import Popup from '@/components/generic/Popup.vue';

// Used only when /dev/kadencje can't be reached.
const FALLBACK_KADENCJE = [3, 4, 5, 6, 7, 8, 9, 10];
const FALLBACK_DEFAULT_KADENCJA = 9;

export default {
  name: "votings-list",
  setup() {
    return { store: useMainStore() };
  },
  data() {
    const routeKadencja = this.$route.params.kadencja;
    return {
      votings: [],
      dbUpdate: false,
      pagination: 0,
      itemsPerPage: 10,
      listHidden: true,
      kadencje: routeKadencja ? parseInt(routeKadencja) : undefined,
      sortowanie: "data",
      filtrowanieStatus: ["odrzucony", "uchwalono"],
      filtrowanieUE: true,
      filtrowanieNazwane: false,
      filtrowanieMPW: false,
      sortowanieKierunek: "malejaco",
      filtrowanieNazwa: ""
    };
  },
  watch: {
    kadencje: function() {
      this.$router.replace({
        name: "voting",
        params: {
          kadencja: this.kadencje
        }
      });
      this.fetchVotings(this.kadencje);
    },
    votingsProcessed: function() {
      this.pagination = 0;
      const container = document.querySelector("#scrollable-container");
      if (container) {
        container.scrollTop = 0;
      }
    }
  },
  components: {
    Popup,
    VotingsListItem
  },
  computed: {
    // Descending, so the newest term is at the top of the picker.
    kadencjeOptions() {
      const list = this.store.kadencjeList.length
        ? this.store.kadencjeList
        : FALLBACK_KADENCJE;
      return [...list].sort((a, b) => b - a);
    },
    latestKadencja() {
      return this.store.kadencjeList.length
        ? Math.max(...this.store.kadencjeList)
        : FALLBACK_DEFAULT_KADENCJA;
    },
    votingsProcessed() {
      return this.votings
        .filter(item => {
          let result =
            this.filtrowanieStatus.indexOf(item.status) !== -1 &&
            (item.projects || []).every(a => {
              return (
                a.tytul
                  .toLowerCase()
                  .indexOf(this.filtrowanieNazwa.toLowerCase()) !== -1
              );
            }) &&
            (!this.filtrowanieNazwane || item.nazwa !== null) &&
            (!this.filtrowanieMPW || item.mpw);
          return result;
        })
        .sort((a, b) => {
          if (this.sortowanie === "data") {
            return new Date(b["votingDate"]) - new Date(a["votingDate"]);
          } else {
            return b[this.sortowanie] - a[this.sortowanie];
          }
        });
    },
    votingsDisplayed() {
      return this.votingsProcessed.slice(0, 10 + 10 * this.pagination);
    },
    userVotes() {
      return this.store.userVotes;
    }
  },
  async mounted() {
    await this.store.fetchKadencje();
    if (this.kadencje === undefined) {
      // Opens on the newest term the backend has data for.
      this.kadencje = this.latestKadencja;
    } else {
      this.fetchVotings(this.kadencje);
    }

    const container = document.querySelector("#scrollable-container");
    if (container) {
      container.addEventListener("scroll", el => {
        if (
          el.target.scrollTop /
            (el.target.scrollHeight - el.target.clientHeight) >
          0.9
        ) {
          this.pagination++;
        }
      });
    }
    document.addEventListener("voteSwitch", ev => {
      this.switchVoting(ev.detail);
    });
  },
  methods: {
    fetchVotings(kadencja) {
      this.store.loadingUp();
      this.$http
        .get(this.store.domain + "/dev/glosowania/" + kadencja)
        .then(response => {
          this.store.loadingDown();
          this.dbUpdate = response.data.collectorStatus;
          this.votings = response.data.votings;
        })
        .catch(() => {
          this.store.loadingDown();
        });
    },
    hideList() {
      this.listHidden = true;
    },
    switchVoting(state) {
      let self = this;

      let currentVotingIndex = self.votingsProcessed.findIndex(item => {
        return (
          item.numbers.kadencja === parseInt(self.$route.params.kadencja) &&
          item.numbers.posiedzenie ===
            parseInt(self.$route.params.posiedzenie) &&
          item.numbers.glosowanie === parseInt(self.$route.params.glosowanie)
        );
      });

      const target = self.votingsProcessed[currentVotingIndex + state];
      if (!target) {
        return;
      }

      self.$router.push({
        name: "voting",
        params: {
          kadencja: target.numbers.kadencja,
          posiedzenie: target.numbers.posiedzenie,
          glosowanie: target.numbers.glosowanie
        }
      });
    },
    focusSearch() {
      setTimeout(() => {
        const el = document.querySelector("#filtrowanieNazwa");
        if (el) {
          el.focus();
        }
      }, 100);
    }
  }
};
</script>

<style scoped lang="scss">
.voting-menu {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  z-index: 40;
}

.sort-filter-menu {
  display: flex;
  flex-direction: row;
  flex-flow: wrap;
  justify-content: space-around;
  background: #333;
  color: white;
  height: 10vmin;
  font-size: 150%;
}

.sort-filter-menu > div {
  width: 10vmin;
  height: 10vmin;
  user-select: none;
}
.sortowanie svg:last-child {
  color: white;
}
.b3 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10vmin;
  width: 10vmin;
  font-weight: bold;
  cursor: pointer;
  box-sizing: border-box;
}
.b3 svg {
  height: 8vmin;
  width: 8vmin;
}

span {
  vertical-align: middle;
  font-size: 10vmin;
  height: 10vmin;
}

.b3 * {
  position: absolute;
  z-index: 99;
}

.v-popper__inner label {
  cursor: pointer;
}

.filtrowanie-nazwa {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.filtrowanie-nazwa input {
  color: black;
  background-color: transparent;
  width: 13em;
  border: none;
}

.filtrowanie-status {
  flex-direction: column;
  align-items: flex-start;
}

.filtrowanie-status * {
  display: flex;
}

img {
  max-width: 10em;
}

input[type="radio"] {
  visibility: hidden;
  position: absolute;
}

.nowrap {
  white-space: nowrap;
}

.voting-list {
  display: flex;
  flex-flow: column;
  height: calc(100vh - 10vmin);
}

#scrollable-container {
  overflow-y: scroll;
  background: #333;
}

.error {
  color: red;
  transition: none;
}

@media screen and (max-aspect-ratio: 1/1) {
  .voting-menu {
    position: fixed;
  }

  .v-popper__inner * {
    font-size: 5vmin;
  }
}
</style>