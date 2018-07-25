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
  // color: white;
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
    red 20px /* determines size */
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

.tooltip {
  display: block !important;
  z-index: 10000;
}

.tooltip .tooltip-inner {
  background: black;
  color: white;
  font-weight: bold;
  border-radius: 16px;
  padding: 5px 10px 4px;
}

svg {
  min-width: 2em;
  color: $color-base;
}
svg:hover {
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: black;
  z-index: 1;
}

.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
  margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^="left"] {
  margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip.popover .popover-inner {
  background: #f9f9f9;
  color: black;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px hsla(0, 0%, 0%, 0.2);
}

.tooltip.popover .popover-arrow {
  border-color: #f9f9f9;
}

.tooltip[aria-hidden="true"] {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.15s, visibility 0.15s;
}

.tooltip[aria-hidden="false"] {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.15s;
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
