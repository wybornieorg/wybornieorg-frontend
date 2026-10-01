<template>
<g v-tooltip="singleDeputy.name + ' ' + singleDeputy.vote + ' ' + singleDeputy.group">
  <circle :cx='cx' :cy='cy' :r="dotSize" :class="koloruj" :id="i"></circle>
  <text v-if="!isMobile" :x="cx" :y="cy" font-family="mono" :font-size="dotSize * 1.4" stroke="none" fill="white">{{singleDeputy.name[0]}}</text>
</g>
</template>

<script>
import { useMainStore } from '@/store';

export default {
  props: ["singleDeputy", "cx", "cy", "i"],
  setup() {
    return { store: useMainStore() };
  },
  data() {
    return {
      r: 15,
      show: false,
      dotSize: 2
    };
  },
  computed: {
    currentVotingVote() {
      const p = this.$route.params;
      return this.store.userVotes[`${p.kadencja}/${p.posiedzenie}/${p.glosowanie}`];
    },
    isMobile() {
      return this.store.isMobile;
    },
    zgodnosc() {
      let deputyVote =
        this.singleDeputy.vote === "Za"
          ? 1
          : this.singleDeputy.vote === "Przeciw"
            ? -1
            : 0;
      return this.currentVotingVote * deputyVote > 0;
    },
    koloruj() {
      let result = "";
      if (
        this.singleDeputy.vote === "Wstrzymał się" ||
        this.singleDeputy.vote === "Nie oddał głosu"
      ) {
        result = "wstrzymanie";
      } else if (this.singleDeputy.vote === "Nieobecny") {
        result = "nieobecnosc";
      } else if (
        this.currentVotingVote === undefined ||
        this.currentVotingVote === 0
      ) {
        return "";
      } else {
        result = this.zgodnosc ? "zgodny" : "niezgodny";
      }
      return result;
    }
  },
  methods: {
    fetchIMG() {
      return null;
    }
  }
};
</script>

<style scoped lang="scss">
div {
  width: 100px;
}

text {
  dominant-baseline: central;
  text-anchor: middle;
}

.pis {
  stroke: firebrick;
}

.po {
  stroke: gold;
}

.kukiz {
  stroke: black;
}

.nowoczesna {
  stroke: blue;
}

.psl {
  stroke: green;
}

.zgodny {
  fill: green;
}

.niezgodny {
  fill: red;
}

.nieobecnosc {
  fill: black;
}

.wstrzymanie {
  fill: darkorchid;
}

circle {
  stroke: none;
  stroke-width: 2;
  fill: #777;
}

title {
  font-size: 24px;
}
</style>