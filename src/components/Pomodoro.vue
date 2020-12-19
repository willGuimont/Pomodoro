<template>
  <div>
    <div>
      <vue-headful :title="title" description="Pomodoro Timer" />
    </div>
    <h1 class="title">Pomodoro Timer</h1>
    <div>
      <button
        class="button break-button"
        v-bind:class="{ 'is-focused': selectedType === timerTypes.Pomodoro }"
        v-on:click="selectTime(timerTypes.Pomodoro)"
      >
        Pomodoro
      </button>
      <button
        class="button break-button"
        v-bind:class="{ 'is-focused': selectedType === timerTypes.Short }"
        v-on:click="selectTime(timerTypes.Short)"
      >
        Short Break
      </button>
      <button
        class="button break-button"
        v-bind:class="{ 'is-focused': selectedType === timerTypes.Long }"
        v-on:click="selectTime(timerTypes.Long)"
      >
        Long Break
      </button>
    </div>
    <h2 class="timer">{{ timeString }}</h2>
    <div class="progress-container">
      <progress
        class="progress"
        v-bind:value="progressPercent"
        max="100"
      ></progress>
    </div>
    <div class="action-buttons">
      <button
        class="button is-success is-rounded action-button"
        v-on:click="startTimer()"
      >
        Start
      </button>
      <button
        class="button is-danger is-rounded action-button"
        v-on:click="pauseTimer()"
      >
        Pause
      </button>
      <button class="button is-rounded action-button" v-on:click="resetTimer()">
        Reset
      </button>
    </div>
    <div class="time-inputs">
      <div class="time-input">
        <div class="time-input-text">Pomodoro</div>
        <vue-timepicker
          class="time-input-picker"
          v-model="pomodoroTime"
          format="HH:mm:ss"
          hide-clear-button
          auto-scroll
          v-on:change="setCookies()"
        ></vue-timepicker>
      </div>
      <div class="time-input">
        <div class="time-input-text">Short Break</div>
        <vue-timepicker
          class="time-input-picker"
          v-model="shortTime"
          format="HH:mm:ss"
          hide-clear-button
          auto-scroll
          v-on:change="setCookies()"
        ></vue-timepicker>
      </div>
      <div class="time-input">
        <div class="time-input-text">Long Break</div>
        <vue-timepicker
          class="time-input-picker"
          v-model="longTime"
          format="HH:mm:ss"
          hide-clear-button
          auto-scroll
          v-on:change="setCookies()"
        ></vue-timepicker>
      </div>
    </div>
    <button class="button is-rounded is-dark reset-time" v-on:click="resetTimes()">
      Reset times
    </button>
  </div>
</template>

<script src="./Pomodoro.js"/>>
<style lang="css" src="./Pomodoro.css"/>
