<script setup lang="ts">
import { onMounted } from 'vue'
import { load, base } from './sponsors'

onMounted(load)
</script>

<template>
  <section id="hero">
    <h1 class="tagline">
      基于<span class="accent">Go语言</span>开发的<br />高性能分布式游戏服务器框架
    </h1>
    <p class="description">
      旨在为高性能分布式游戏服务器开发提供完善、高效、标准化的解决方案
    </p>
    <p class="actions">
      <a class="get-started" href="/guide/quick-start">
        快速开始
        <svg
          class="icon"
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 24 24"
        >
          <path
            d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"
          />
        </svg>
      </a>
      <a class="github" href="https://github.com/dobyte/due" target="_blank">
        <svg 
          class="icon" 
          xmlns="http://www.w3.org/2000/svg" 
          aria-hidden="true" 
          focusable="false" 
          viewBox="0 0 24 24"
          >
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
        </svg>
        GitHub
      </a>
    </p>
  </section>

  <section id="highlights" class="vt-box-container">
    <div class="vt-box">
      <h2>分布式</h2>
      <p>框架整体围绕着分布式应用场景构建，能够满足任何类型的分布式游戏和应用的开发。</p>
    </div>
    <div class="vt-box">
      <h2>模块化</h2>
      <p>框架借鉴了 <a href="https://github.com/go-kratos/kratos" target="_blank">Kratos</a> 的模块设计思路，开发者可根据自身业务特点选用不同的模块来实现功能。</p>
    </div>
    <div class="vt-box">
      <h2>高性能</h2>
      <p>框架原生实现了一套集群内部的通信方案，普通机器单线程也能轻松实现20W+的TPS。</p>
    </div>
    <div class="vt-box">
      <h2>标准化</h2>
      <p>框架原生提供标准化的开发规范，无论多么复杂的项目也能轻松应对。</p>
    </div>
    <div class="vt-box">
      <h2>易扩展</h2>
      <p>采用良好的接口设计，方便开发者设计实现自有功能。</p>
    </div>
    <div class="vt-box">
      <h2>稳定性</h2>
      <p>所有发布的正式版本均已通过内部真实业务的严格测试，具备较高的稳定性。</p>
    </div>
  </section>

</template>

<style scoped>
section {
  padding: 42px 32px;
}

#hero {
  padding: 96px 32px;
  text-align: center;
}

.tagline {
  font-size: 70px;
  line-height: 1.25;
  font-weight: 900;
  letter-spacing: -1.5px;
  max-width: 960px;
  margin: 0px auto;
}

html:not(.dark) .accent,
.dark .tagline {
  background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.description {
  max-width: 960px;
  line-height: 1.5;
  color: var(--vt-c-text-2);
  transition: color 0.5s;
  font-size: 22px;
  margin: 24px auto 40px;
}

.actions a {
  font-size: 16px;
  display: inline-block;
  background-color: var(--vt-c-bg-mute);
  padding: 8px 18px;
  font-weight: 500;
  border-radius: 8px;
  transition: background-color 0.5s, color 0.5s;
}

.actions .github {
  background: linear-gradient(var(--vt-c-bg-mute), var(--vt-c-bg-mute)) padding-box,
    linear-gradient(45deg, #42d392, #647eff) border-box;
  border: 2px solid transparent;
}

.actions .github:hover {
  background: linear-gradient(var(--vt-c-gray-light-4), var(--vt-c-gray-light-4)) padding-box,
    linear-gradient(45deg, #42d392, #647eff) border-box;
}

.dark .actions .github:hover {
  background: linear-gradient(var(--vt-c-gray-dark-3), var(--vt-c-gray-dark-3)) padding-box,
    linear-gradient(45deg, #42d392, #647eff) border-box;
}

.actions .github .icon {
  width: 20px;
  height: 20px;
  margin-top: -3px;
}

.actions .get-started,
.actions .setup {
  margin-right: 18px;
}

.actions .icon {
  display: inline;
  position: relative;
  top: -1px;
  margin-left: 2px;
  fill: currentColor;
  transition: transform 0.2s;
}

.actions .get-started:hover .icon {
  transform: translateX(2px);
}

.actions .github {
  color: var(--vt-c-text-code);
}

.actions .github:hover {
  background-color: var(--vt-c-gray-light-4);
  transition-duration: 0.2s;
}

.dark .github .github:hover {
  background-color: var(--vt-c-gray-dark-3);
}

.actions .get-started {
  font-weight: 600;
  background-color: var(--vt-c-green);
  color: #fff;
}

.actions .get-started:hover {
  background-color: var(--vt-c-green-dark);
  transition-duration: 0.2s;
}

.dark .actions .get-started:hover {
  background-color: var(--vt-c-green-light);
}

#highlights {
  max-width: 960px;
  margin: 0px auto;
  color: var(--vt-c-text-2);
}

#highlights h2 {
  font-weight: 600;
  font-size: 20px;
  letter-spacing: -0.4px;
  color: var(--vt-c-text-1);
  transition: color 0.5s;
  margin-bottom: 0.75em;
}

#highlights p {
  font-weight: 400;
  font-size: 15px;
}

#highlights p a {
  color: var(--vt-c-green-light);
  transition: color 0.25s;
}

#highlights .vt-box {
  background-color: transparent;
}


@media (max-width: 960px) {
  .tagline {
    font-size: 64px;
    letter-spacing: -0.5px;
  }
  .description {
    font-size: 18px;
    margin-bottom: 48px;
  }
}

@media (max-width: 794px) {
  .tagline {
    font-size: 48px;
    letter-spacing: -0.5px;
  }
  .actions .github {
    margin-top: 18px;
  }
}

@media (max-width: 576px) {
  #hero {
    padding: 56px 32px;
  }
  .description {
    font-size: 16px;
    margin: 18px 0 30px;
  }
  #special-spsr {
    flex-direction: column;
  }
  #special-spsr img {
    height: 36px;
    margin: 8px 0;
  }
  #special-spsr span {
    text-align: center !important;
  }
  #highlights h3 {
    margin-bottom: 0.6em;
  }
  #highlights .vt-box {
    padding: 20px 36px;
  }
  .actions a {
    margin: 18px 0;
  }
  .actions .github {
    margin-top: 0;
  }
}

@media (max-width: 370px) {
  .tagline {
    font-size: 36px;
  }
}
</style>
