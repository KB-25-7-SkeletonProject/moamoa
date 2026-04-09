<template>
  <div class="login-shell">
    <section class="login-card">
      <p class="login-eyebrow">MOAMOA LOGIN</p>
      <h1 class="login-title">모아모아</h1>
      <h2 class="login-title">가계부를 시작해보세요</h2>
      <!-- <p class="login-copy">
        아이디와 비밀번호를 입력하고 로그인하면 오늘 출석이 자동으로 반영됩니다.
      </p> -->

      <form class="login-form" @submit.prevent="submit">
        <label>
          <span class="field-label">아이디</span>
          <input
            v-model="username"
            class="field-input"
            type="text"
            autocomplete="username"
            placeholder="아이디를 입력하세요"
          />
        </label>

        <label>
          <span class="field-label">비밀번호</span>
          <input
            v-model="password"
            class="field-input"
            type="password"
            autocomplete="current-password"
            placeholder="비밀번호를 입력하세요"
          />
        </label>

        <button type="submit" class="action-button login-button">로그인</button>
        <button type="button" class="action-button login-button">
          회원가입
        </button>
      </form>

      <!-- <div class="login-note">
        <strong>테스트 안내</strong>
        <p>아무 아이디와 비밀번호나 입력해도 로그인됩니다.</p>
      </div> -->
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')

function submit() {
  const trimmedUsername = username.value.trim()
  const trimmedPassword = password.value.trim()

  if (!trimmedUsername || !trimmedPassword) {
    window.alert('아이디와 비밀번호를 모두 입력해주세요.')
    return
  }

  window.alert(`${trimmedUsername}님, 로그인 화면만 남긴 최소 버전입니다.`)
}
</script>
