<script lang="ts">
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  setup() {
    // ページがロードされたときに実行される処理
    onMounted(() => {
      const queryOptions = { active: true, currentWindow: true }
      chrome.tabs.query(queryOptions, (tabs) => {
        console.log('inn')
        // なんたらかんたら
        const h1Elements = document.querySelectorAll('h1')

        h1Elements.forEach((element) => {
          console.log(h1Elements)

          element.textContent = 'あ'
        })
      })

      alert('test')
      console.log(document)

      //  // すべてのテキストを「あ」に変更する
      //  const allTextElements = document.querySelectorAll('*')
      //  allTextElements.forEach((element) => {
      //    console.log(allTextElements)
      //    element.textContent = 'あ'
      //  })

      //  // 例外的に h1 要素のテキストを元に戻す
      //  const mainTitleElement = document.querySelector('h1')
      //  if (mainTitleElement) {
      //    mainTitleElement.textContent = 'Hello Vue 3 with Composition API and TypeScript!'
      //  }
    })

    return {}
  }
})
</script>

<style>
/* スタイルを適用する場合はここに記述 */
</style>

<!--<script setup lang="ts">
import { ref } from 'vue'
const color = ref('#000000')

async function changeColor(color: string) {
  // 現在のタブ情報を取得
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  // 開いているタブのbodyの色を変更する
  await chrome.scripting.executeScript({
    target: { tabId: tab.id || 0 },
    args: [color],
    func: (args) => {
      document.body.style.background = args
    }
  })
}
</script>

<template>
  <div class="HomeView">
    <h2>home</h2>
    <div>
      <input v-model="color" type="color" @update:model-value="changeColor($event)" />
    </div>
  </div>
</template>-->
