<template>
<div id="app">
  <router-view/>
</div>
</template>

<style lang="scss">
@import url("/Lato2OFLWeb/LatoLatin/latolatinfonts.css");

body {
  margin: 0;
  font-family: "Lato", "LatoLatinWeb", sans-serif;
  font-size: 2vmin;
  background: #444;
}
div {
  box-sizing: border-box;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
#app {
  display: flex;
  justify-content: center;
}
a {
  text-decoration: none;
  font-weight: bold;
  outline: none;
  color: $color-base;
  transition: 0.2s;
}
a:hover {
  border: none;
  outline: none;
}
a:active {
  color: inherit;
}
*:focus {
  outline: none;
}
.glow {
  transition: 0.2s;
}
.glow:hover * {
  stroke: white;
}
.glow:active {
  color: inherit;
}
.gradient {
  background-image: repeating-linear-gradient(
    45deg,
    yellow,
    yellow 10px,
    red 10px,
    red 20px
  );
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

svg {
  min-width: 2em;
  color: $color-base;
}

/* --- floating-vue theming (replaces the old v-tooltip 2 styles) --- */

/* Tooltips: black bubble, white bold text */
.v-popper--theme-tooltip .v-popper__inner {
  background: black;
  color: white;
  font-weight: bold;
  border-radius: 16px;
  padding: 5px 10px 4px;
}
.v-popper--theme-tooltip .v-popper__arrow-outer,
.v-popper--theme-tooltip .v-popper__arrow-inner {
  border-color: black;
}

/* Popovers: light card */
.v-popper--theme-popover .v-popper__inner {
  background: #f9f9f9;
  color: black;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px hsla(0, 0%, 0%, 0.2);
}
.v-popper--theme-popover .v-popper__arrow-outer,
.v-popper--theme-popover .v-popper__arrow-inner {
  border-color: #f9f9f9;
}

@media screen and (max-aspect-ratio: 1/1) {
  body {
    font-size: 3.5vmin;
  }
  .list-hidden {
    visibility: hidden;
  }
  svg {
    stroke-width: 3.5vmin;
  }
}
</style>