<template>
  <div>本页面可直接访问!</div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DemoPage',
})

definePage({
  meta: {
    title: '测试页面',
    componentName: 'DemoPage',
    cache: 'DemoPage',
    sort: 101,
    auth: '*',
    icon: 'i-icon-park-outline-home',
  },
})
</script>

<style scoped></style>
