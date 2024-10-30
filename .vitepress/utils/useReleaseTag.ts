import { onMounted, ref } from 'vue'

export function useReleaseTag() {
  const releaseTag = ref('')

  onMounted(async () => {
    const result = await fetch('https://api.github.com/repos/dobyte/due/releases/latest')
    const json = await result.json()
    releaseTag.value = json?.tag_name ?? ''
  })

  return {
    releaseTag
  }
}
