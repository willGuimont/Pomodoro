import VueTimepicker from 'vue2-timepicker'
import 'vue2-timepicker/dist/VueTimepicker.css'

export default {
  components: {
    VueTimepicker
  },
  data: () => {
    return {
      secondsPerMinute: 60,
      secondsPerHour: 60 * 60,
      timerTypes: Object.freeze({
        Pomodoro: "pomodoro",
        Short: "short",
        Long: "long"
      }),
      pomodoroTime: {
        HH: "00",
        mm: "30",
        ss: "00"
      },
      shortTime: {
        HH: "00",
        mm: "05",
        ss: "00"
      },
      longTime: {
        HH: "00",
        mm: "10",
        ss: "00"
      },

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
    getDefaultTime: function (type) {
      let timerToSeconds = t => {
        return Number(t.HH) * this.secondsPerHour + Number(t.mm) * this.secondsPerMinute + Number(t.ss);
      };
      if (type == this.timerTypes.Pomodoro) return timerToSeconds(this.pomodoroTime);
      else if (type == this.timerTypes.Short) return timerToSeconds(this.shortTime);
      else if (type == this.timerTypes.Long) return timerToSeconds(this.longTime);
    },
    resetTimes: function () {
      this.$cookies.config("1y");

      this.pomodoroTime.HH = "00";
      this.pomodoroTime.mm = "30";
      this.pomodoroTime.ss = "00";

      this.shortTime.HH = "00";
      this.shortTime.mm = "05";
      this.shortTime.ss = "00";

      this.longTime.HH = "00";
      this.longTime.mm = "10";
      this.longTime.ss = "00";

      this.setCookies();
    },
    updateTimeString: function () {
      let floorAndPad = t => {
        let time = Math.floor(
          t
        ).toString();
        if (time.length < 2) {
          time = "0" + time;
        }
        return time;
      };
      var secondsValue = this.timeSeconds;
      let hours = floorAndPad(secondsValue / this.secondsPerHour);
      secondsValue = secondsValue % this.secondsPerHour;

      let minutes = floorAndPad(secondsValue / this.secondsPerMinute);
      secondsValue = secondsValue % this.secondsPerMinute;

      let seconds = floorAndPad(secondsValue);
      this.timeString = `${hours}:${minutes}:${seconds}`;
    },
    setCookies: function () {
      this.$cookies.config("1y");

      this.$cookies.set("ph", this.pomodoroTime.HH);
      this.$cookies.set("pm", this.pomodoroTime.mm);
      this.$cookies.set("ps", this.pomodoroTime.ss);

      this.$cookies.set("sh", this.shortTime.HH);
      this.$cookies.set("sm", this.shortTime.mm);
      this.$cookies.set("ss", this.shortTime.ss);

      this.$cookies.set("lh", this.longTime.HH);
      this.$cookies.set("lm", this.longTime.mm);
      this.$cookies.set("ls", this.longTime.ss);
    },
    selectTime: function (type) {
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
    updateProgressBar: function () {
      this.progressPercent = Math.ceil(
        (1 - this.timeSeconds / this.maxTime) * 100
      );
    },
    tick: function () {
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
      }
    },
    notify: function () {
      this.$notification.show('Pomodoro', { body: 'Timed out' }, {});
    },
    startTimer: function () {
      this.paused = false;
    },
    pauseTimer: function () {
      this.paused = true;
      this.stopRingtone();
      this.title = "Pomodoro";
    },
    resetTimer: function () {
      this.pauseTimer();
      this.selectTime(this.selectedType);
      this.stopRingtone();
      this.ringtonePlayed = false;
      this.startTimer();
    },
    playRingtone: function () {
      const playPromise = this.ringtone.play();
      if (playPromise !== null) {
        playPromise.catch(() => { });
      }
    },
    stopRingtone: function () {
      this.ringtone.pause();
      this.ringtone.currentTime = 0;
    }
  },
  created: function () {
    let loadCookies = () => {
      if (!this.$cookies.isKey("ph")) {
        return;
      }
      this.pomodoroTime.HH = this.$cookies.get("ph");
      this.pomodoroTime.mm = this.$cookies.get("pm");
      this.pomodoroTime.ss = this.$cookies.get("ps");
  
      this.shortTime.HH = this.$cookies.get("sh");
      this.shortTime.mm = this.$cookies.get("sm");
      this.shortTime.ss = this.$cookies.get("ss");
  
      this.longTime.HH = this.$cookies.get("lh");
      this.longTime.mm = this.$cookies.get("lm");
      this.longTime.ss = this.$cookies.get("ls");
    }
    this.ringtone = new Audio(require("../assets/ringtone.mp3"));
    loadCookies();
    this.selectTime(this.timerTypes.Pomodoro);
    this.pauseTimer();
    setInterval(this.tick, 1000);
    this.$notification.show('Pomodoro', { body: 'Notification enabled !' }, {});
  }
};
