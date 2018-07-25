<template>
<div class="app-nav">
  <div>
    <router-link class="logo" :to="{ name: 'home' }"><img src="/img/icons/logo.svg" alt="wybornie"></router-link>
  </div>

  <div v-for="(menu, index) in menus" :key="index" class="glow">
    <font-awesome-icon v-tooltip="menu.name" :icon="menu.icon" @click="menu.emitEvent" />
  </div>

  <div id="listBtn" class="glow">
    <font-awesome-icon v-tooltip="'Lista głosowań'" icon="bars" @click="$emit('votingList')" />
  </div>
  <div>
    <router-link :to="{ name: 'loading', params: {dane: this.userVotes} }">
      <font-awesome-icon v-tooltip="'Zapisz swoje głosy'" icon="save" />
    </router-link>
  </div>
</div>
</template>

<script>
export default {
  name: "app-nav",
  data() {
    return {
      menus: [
        {
          name: "Statystyki",
          icon: "chart-bar",
          emitEvent: () => this.$emit("staty")
        },
        {
          name: "Poprzednie głosowanie",
          icon: "arrow-circle-left",
          emitEvent: () => this.switchVoting(-1)
        },
        {
          name: "Następne głosowanie",
          icon: "arrow-circle-right",
          emitEvent: () => this.switchVoting(1)
        }
      ]
    };
  },
  mounted() {
    this.registerKbdHandlers();
  },
  computed: {
    userVotes() {
      return window.btoa(JSON.stringify(this.$store.state.userVotes));
    }
  },
  methods: {
    switchVoting(direction) {
      document.dispatchEvent(
        new CustomEvent("voteSwitch", {
          detail: direction
        })
      );
    },
    registerKbdHandlers() {
      document.addEventListener("keydown", event => {
        if (event.key === "ArrowLeft") {
          this.switchVoting(-1);
        }
        if (event.key === "ArrowRight") {
          this.switchVoting(1);
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.app-nav {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background: #222;
  min-height: 10vmin;
}

.logo {
  height: 10vmin;
  width: 10vmin;
}

.logo img {
  width: 100%;
  height: 100%;
}

.app-nav * {
  user-select: none;
}

.app-nav > div {
  height: 10vmin;
  width: 10vmin;
  cursor: pointer;
  padding: 1vmin;
  box-sizing: border-box;
}

.app-nav svg {
  height: 8vmin;
  width: 8vmin;
}

@media screen and (max-aspect-ratio: 1/1) {
  .app-nav {
    position: sticky;
    top: 0;
    width: 100vw;
    flex-direction: row;
  }
  #listBtn {
    display: block;
  }
}

@media screen and (min-aspect-ratio: 1/1) {
  .app-nav {
    height: 100vh;
  }
  #listBtn {
    display: none;
  }
}
</style>
