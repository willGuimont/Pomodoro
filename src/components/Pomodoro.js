const axios = require('axios').default;

export default {
  data: () => {
    return {
      secondsPerMinutes: 60,
      timerTypes: Object.freeze({
        Pomodoro: "pomodoro",
        Short: "short",
        Long: "long"
      }),

      timeString: "",
      timeSeconds: 0,
      maxTime: 0,
      selectedType: "",
      progressPercent: 0,
      paused: false,
      ringtone: null,
      ringtonePlayed: false,
      justSetTime: false,
      title: "Pomodoro",
    };
  },
  methods: {
    getDefaultTime: function(type) {
      let timeInMin;
      if (type == this.timerTypes.Pomodoro) timeInMin = 25;
      else if (type == this.timerTypes.Short) timeInMin = 5;
      else if (type == this.timerTypes.Long) timeInMin = 10;
      return timeInMin * this.secondsPerMinutes;
    },
    updateTimeString: function() {
      let minutes = Math.floor(
        this.timeSeconds / this.secondsPerMinutes
      ).toString();

      if (minutes.length < 2) {
        minutes = "0" + minutes;
      }

      let seconds = (this.timeSeconds % this.secondsPerMinutes).toString();
      if (seconds.length < 2) {
        seconds = "0" + seconds;
      }
      this.timeString = `${minutes}:${seconds}`;
    },
    selectTime: function(type) {
      this.pauseTimer();
      this.selectedType = type;
      this.maxTime = this.getDefaultTime(type);
      this.timeSeconds = this.maxTime;
      this.updateTimeString();
      this.stopRingtone();
      this.ringtonePlayed = false;
      this.justSetTime = true;
      this.startTimer();
    },
    updateProgressBar: function() {
      this.progressPercent = Math.ceil(
        (1 - this.timeSeconds / this.maxTime) * 100
      );
    },
    tick: function() {
      if (this.justSetTime) {
        this.justSetTime = false;
        return;
      }
      if (!this.paused && this.timeSeconds > 0) {
        this.timeSeconds -= 1;
        this.updateTimeString();
        this.updateProgressBar();
        this.title = this.timeString;
      } else if (!this.ringtonePlayed && this.timeSeconds === 0) {
        this.playRingtone();
        this.notify();
        this.ringtonePlayed = true;
        this.title = "Time's up!";
        axios.post('http://localhost:5000/pomodoro_end', {type: this.selectedType});
      }
    },
    notify: function() {
      this.$notification.show('Pomodoro', {body: 'Timed out'}, {});
    },
    startTimer: function() {
      this.paused = false;
    },
    pauseTimer: function() {
      this.paused = true;
      this.stopRingtone();
      this.title = "Pomodoro";
    },
    resetTimer: function() {
      this.pauseTimer();
      this.selectTime(this.selectedType);
      this.stopRingtone();
      this.ringtonePlayed = false;
      this.startTimer();
    },
    playRingtone: function() {
      const playPromise = this.ringtone.play();
      if (playPromise !== null) {
        playPromise.catch(() => {});
      }
    },
    stopRingtone: function() {
      this.ringtone.pause();
      this.ringtone.currentTime = 0;
    }
  },
  created: function() {
    this.ringtone = new Audio(require("../assets/ringtone.mp3"));
    this.selectTime(this.timerTypes.Pomodoro);
    this.pauseTimer();
    setInterval(this.tick, 1000);
    this.$notification.show('Pomodoro', {body: 'Notification enabled !'}, {});
  }
};
