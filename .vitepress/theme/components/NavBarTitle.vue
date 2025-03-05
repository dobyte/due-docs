<template>
<a class="NavBarTitle" href="/">
    <span class="text">due</span>
</a>
</template>
  
<style scoped>
  .NavBarTitle {
    display: flex;
    align-items: center;
    padding-top: 1px;
    height: var(--vt-nav-height);
    transition: opacity 0.25s;
  }
  
  .NavBarTitle:hover {
    opacity: 0.9;
  }
  
  .text {
    font-size: 28px;
    font-weight: 600;
    background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
</style>
  