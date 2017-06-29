import './css/dp.scss';
import utils from './utils';

class DP {
  constructor(target, opts = {}) {
    this.setting = {
      date: new Date(),
      minDate: null,
      maxDate: null,
      onComplete: null,
      showDate: true,
      showTime: true
    }

    this.target = target;
    const setting = Object.assign({}, this.setting, opts)
    for (const key in setting) {
      this[key] = setting[key];
    }
    this.init();
  }

  init() {
    if (typeof this.target === 'string') {
      this.target = document.querySelector(this.target);
    }

    if (!this.target) {
      throw new Error('Not target element founded ...');
    }

    const now = new Date();
    this.date = utils.getDateTime(now);
    this.viewDate = (this.target.value && this.target.value.split(/-|\s|:/)) || utils.shallowCopy(this.date);
    this.viewDate = this.viewDate.map(x => +x);
    this.value = utils.shallowCopy(this.viewDate);
    if (this.minDate) {
      this.minDate = utils.getDateTime(this.minDate);
    }
    if (this.maxDate) {
      this.maxDate = utils.getDateTime(this.maxDate);
    }
    this.animate = {};
    this.initDom();
    this.initEvent();
  }
  initDom() {
    this.doms = {};
    const container = this.doms.container = document.createElement('div');
    this.container = container;
    container.style.display = 'none';
    container.className = 'dp-container';
    const doms = [
      '<div class="dp-hd">',
      '<div class="dp-prev">',
      '<svg><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>',
      '</div>',
      '<div class="dp-curr">',
      '<div class="dp-year">2017 年</div>',
      '<div class="dp-month">6 月</div>',
      '</div>',
      '<div class="dp-next">',
      '<svg><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" ></path></svg>',
      '</div>',
      '</div>',
      '<div class="dp-bd">',
      '</div>',


    ];

    if (this.showTime) {
      doms.push(      '<div class="dp-timer">',
      '<input type="text" class="dp-time-input" style="display: none;" />',
      '<div class="dp-time"><div class="hour"></div>:<div class="minite"></div></div>',
      '<div class="bar"><div class="handle" style="left: 0;"></div></div>',
      '<div class="dp-timer-text">',
      '<span style="left: 0%">00:00</span>',
      '<span style="left: 25%">06:00</span>',
      '<span style="left: 50%">12:00</span>',
      '<span style="left: 75%">18:00</span>',
      '<span style="left: 100%">23:59</span>',
      '</div>',
      '</div>',);
    }

    doms.push('<div class="dp-ft">',
      '<button class="dp-cancle">取消</button>',
      '<button class="dp-clear">清除</button>',
      '<button class="dp-now">此刻</button>',
      '<button class="dp-confirm">确定</button>',
      '</div>');

    container.innerHTML = doms.join('');
    const targetOffset = utils.getOffset(this.target);
    container.style.left = targetOffset.x + 'px';
    container.style.top = this.target.offsetHeight + targetOffset.y + 'px';
    document.body.appendChild(container);

    this.doms = {
      body: container.querySelector('.dp-bd'),
      prev: container.querySelector('.dp-prev'),
      next: container.querySelector('.dp-next'),
      year: container.querySelector('.dp-year'),
      month: container.querySelector('.dp-month'),
      hour: container.querySelector('.hour'),
      minite: container.querySelector('.minite'),
      timeInput: container.querySelector('.dp-time-input'),
      time: container.querySelector('.dp-time'),
      timerBar: container.querySelector('.dp-timer .bar'),
      barHandle: container.querySelector('.dp-timer .handle'),
      cancle: container.querySelector('.dp-cancle'),
      clear: container.querySelector('.dp-clear'),
      now: container.querySelector('.dp-now'),
      confirm: container.querySelector('.dp-confirm')
    }

    this.changeHead();
    this.createDateTable();
    this.initHour();
    this.initMinite();
  }

  initHour() {
    if (!this.showTime) {
      return;
    }
    const ul = this.doms.hourBox = document.createElement('ul');
    for (let i = 0; i <= 24; i++ ) {
      const li = document.createElement('li');
      li.innerHTML = utils.insertZero(i);
      ul.appendChild(li);
    }
    this.doms.hour.appendChild(ul);
  }

  initMinite() {
    if (!this.showTime) {
      return;
    }
    const ul = this.doms.miniteBox = document.createElement('ul');
    for (let i = 0; i < 60; i++ ) {
      const li = document.createElement('li');
      li.innerHTML = utils.insertZero(i);
      ul.appendChild(li);
    }
    this.doms.minite.appendChild(ul);
  }

  initTimer() {
    if (!this.showTime) {
      return;
    }
    const hour = this.viewDate[3];
    const minite = this.viewDate[4];
    this.doms.barHandle.style.left = (hour * 60 + minite) / 1440 * this.doms.timerBar.offsetWidth+ 'px';
    this.doms.hourBox.style.transform = 'translate(0, ' + (-hour * 20) + 'px)';
    this.doms.miniteBox.style.transform = 'translate(0, ' + (-minite * 20) + 'px)';
    this.doms.timeInput.value = utils.insertZero(hour) + ':' + utils.insertZero(minite);
  }

  changeHead() {
    this.doms.year.innerHTML = this.viewDate[0] + '年';
    this.doms.month.innerHTML = utils.insertZero(this.viewDate[1]) + '月';
  }

  createDateTable() {
    this.viewType = DP.type.date;
    let date = utils.shallowCopy(this.viewDate);
    const
      table = document.createElement('table'),
      today = this.date[2];

    date[1]--;
    date = new Date(...date);

    table.className = 'dp-date-table';

    date.setDate(1);
    const firstDay = date.getDay();
    date.setDate(0);
    const lastMonthTotalDays = date.getDate();
    date.setMonth(date.getMonth() + 1);
    date.setDate(0)
    const totalDays = date.getDate();
    let row, col, days = [];

    for (let i = 0; i < totalDays; i++) {
      days.push(i + 1);
    }

    for (let i = 0; i < firstDay - 1; i++) {
      days.unshift(lastMonthTotalDays - i);
    }

    for (let i = 0, j = 7 - days.length % 7; i < j; i++) {
      days.push(i + 1);
    }

    row = table.insertRow();

    // 插入星期
    for (let i = 0; i < DP.week.length; i++) {
      col = row.insertCell();
      col.innerHTML = DP.week[i];
    }

    for (let i = 0; i < days.length; i++) {
      if (i % 7 === 0) {
        row = table.insertRow();
      }

      col = row.insertCell();
      col.innerHTML = days[i];
      if (i > firstDay - 2 && i < totalDays + firstDay - 1) {
        col.className = "pick";
        col.setAttribute('data', days[i]);
        if (utils.compareDate(this.viewDate.slice(0, 2).concat(days[i]), this.value, true) === 0) {
          col.classList.add('current');
        }
        let disabled = false;
        if (this.minDate) {
          if (utils.compareDate(this.viewDate.slice(0, 2).concat(days[i]), this.minDate, true) < 0) {
            disabled = true;
          }
        }

        if (this.maxDate) {
          if (utils.compareDate(this.viewDate.slice(0, 2).concat(days[i]), this.maxDate, true) > 0) {
            disabled = true;
          }
        }

        if (disabled) {
          col.classList.add('disabled');
        } else {
          this.selectDay(col);
        }

        if (utils.compareDate(this.viewDate.slice(0, 2).concat(days[i]), this.date, true) === 0) {
          col.classList.add('today');
          col.innerHTML = '今天';
        }
      }
    }

    this.doms.body.innerHTML = '';
    this.doms.body.appendChild(table);
    this.changeHead();
  }

  createMonthTable() {
    this.viewType = DP.type.month;
    const table = document.createElement('table');
    table.className = 'dp-month-table';
    let row, col;
    for (let i = 0; i < 12; i++) {
      if (i % 3 === 0) {
        row = table.insertRow();
      }
      col = row.insertCell();
      col.classList.add('pick');
      if (utils.compareDate([this.viewDate[0], i + 1], this.value) === 0) {
        col.classList.add('current');
      }
      col.setAttribute('data', i + 1);
      col.innerHTML = i + 1 + '月';
      this.selectMont(col);
    }

    this.doms.body.innerHTML = '';
    this.doms.body.appendChild(table);
    this.changeHead();
  }

  createYearTable() {
    this.viewType = DP.type.year;
    const
      table = document.createElement('table'),
      startYear = Math.floor(this.viewDate[0] / 10) * 10;

    table.className = 'dp-year-table';
    let row, col;
    for (let i = 0; i < 10; i++) {
      if (i % 4 === 0) {
        row = table.insertRow();
      }
      col = row.insertCell();
      col.classList.add('pick');
      if (startYear + i === this.value[0]) {
        col.classList.add('current');
      }
      col.setAttribute('data', startYear + i);
      col.innerHTML = startYear + i;
      this.selectYear(col);
    }
    this.doms.body.innerHTML = '';
    this.doms.body.appendChild(table);
    this.changeHead();
  }

  getValue() {
    if (!this.onComplete) {
      let value = utils.shallowCopy(this.value);
      value = value.map((x, index) => {
        if (index === 0) {
          return x;
        }
        return utils.insertZero(x);
      });
      return value.slice(0, 3).join('-') + (this.showTime ? (' ' + value.slice(3).join(':')) : '');
    } else {
      return this.onComplete(...this.value);
    }
  }

  initEvent() {
    this.doms.prev.addEventListener('click', (e) => {
      e.stopPropagation();
      switch (this.viewType) {
        case DP.type.date:
          this.viewDate[1] -= 1;
          if (this.viewDate[1] < 1) {
            this.viewDate[0] -= 1;
            this.viewDate[1] = 12;
          }
          this.createDateTable();
          break;
        case DP.type.month:
          this.viewDate[0] -= 1;
          this.createMonthTable();
          break;
        case DP.type.year:
          this.viewDate[0] -= 10;
          this.createYearTable();
      }

    });

    this.doms.next.addEventListener('click', (e) => {
      e.stopPropagation();
      switch (this.viewType) {
        case DP.type.date:
          this.viewDate[1] += 1;
          if (this.viewDate[1] > 12) {
            this.viewDate[0] += 1;
            this.viewDate[1] = 1;
          }
          this.createDateTable();
          break;
        case DP.type.month:
          this.viewDate[0] += 1;
          this.createMonthTable();
          break;
        case DP.type.year:
          this.viewDate[0] += 10;
          this.createYearTable();
      }
      this.changeHead();
    });

    this.doms.month.addEventListener('click', (e) => {
      e.stopPropagation();
      this.createMonthTable();
    });

    this.doms.year.addEventListener('click', (e) => {
      e.stopPropagation();
      this.createYearTable();
    });

    this.target.addEventListener('click', (e) => {
      e.stopPropagation();
      this.show();
    });

    this.container.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.showTime) {
        this.doms.time.style.display = 'block';
        this.doms.timeInput.style.display = 'none';
      }
    });

    this.doms.cancle.addEventListener('click', () => {
      this.hidden();
    });

    this.doms.clear.addEventListener('click', () => {
      this.target.value = '';
      this.hidden();
    });

    this.doms.now.addEventListener('click', () => {
      this.value = utils.shallowCopy(this.date);
      this.viewDate = utils.shallowCopy(this.date);
      this.createDateTable();
    });

    this.doms.confirm.addEventListener('click', () => {
      this.value = utils.shallowCopy(this.viewDate);
      this.target.value = this.getValue();
      this.hidden();
    });

    document.documentElement.addEventListener('click', (e) => {
      let ele = e.target;
      while (ele) {
        if (ele === this.doms.container) {
          return;
        }
        ele = ele.parentNode;
      }
      this.hidden();
    });

    if (this.showTime) {
      this.initTimerEvent();
    }
  }

  initTimerEvent() {
    let
      mouseDown = false,
      sP = {},
      eP = {},
      eleLeft,
      barWitdth;

    this.doms.time.addEventListener('click', (e) => {
      e.stopPropagation();
      this.doms.time.style.display = 'none';
      this.doms.timeInput.style.display = 'block';
      this.doms.timeInput.focus();
    });

    this.doms.timeInput.addEventListener('keyup', (e) => {
      if (e.keyCode ===  13) {
        this.doms.time.style.display = 'block';
        this.doms.timeInput.style.display = 'none';
        let timeStr = this.doms.timeInput.value.split(/:|：/),
          hour = +timeStr[0],
          minite = +timeStr[1];

        if (!hour || !minite || +hour > 23 || +hour < 0 || +minite > 59 || +minite < 0) {
          hour = 0;
          minite = 0;
        }

        this.viewDate[3] = hour;
        this.viewDate[4] = minite;

        this.initTimer();
      }
    });

    this.doms.barHandle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!barWitdth) {
        barWitdth = this.doms.timerBar.offsetWidth;
      }
      mouseDown = true;
      eleLeft = parseFloat(getComputedStyle(this.doms.barHandle).left);
      sP = {
        x: e.pageX,
        y: e.pageY
      }
    });

    document.documentElement.addEventListener('mousemove', (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!mouseDown) {
        return;
      }
      eP = {
        x: e.pageX,
        y: e.pageY
      }

      let left = eleLeft + eP.x - sP.x;
      left = left < 0 ? 0 : (left > barWitdth ? barWitdth : left);
      let hour = Math.floor(left / (barWitdth / 24)),
        minite = Math.round(left / (barWitdth / 1440) % 6);

      if (hour == '24' && minite == '00') {
        hour = 23;
        minite = 59;
      }
      this.viewDate[3] = hour;
      this.viewDate[4] = minite;
      this.doms.hourBox.style = 'transform: translate(0,' + -hour * 20 + 'px)';
      this.doms.miniteBox.style = 'transform: translate(0,' + -minite * 20 + 'px)';
      this.doms.barHandle.style.left = left + 'px';
    });

    document.documentElement.addEventListener('mouseup', (e) => {
      mouseDown = false;
    });
  }

  selectDay(ele) {
    ele.addEventListener('click', (e) => {
      e.stopPropagation();
      this.viewDate[2] = +ele.getAttribute('data');
      this.value[0] = this.viewDate[0];
      this.value[1] = this.viewDate[1];
      this.value[2] = this.viewDate[2];
      this.createDateTable();
    });

    ele.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      this.viewDate[2] = +ele.getAttribute('data');
      this.value = utils.shallowCopy(this.viewDate);
      this.target.value = this.getValue();
      this.hidden();
    });
  }

  selectMont(ele) {
    ele.addEventListener('click', (e) => {
      e.stopPropagation();
      this.viewDate[1] = +ele.getAttribute('data')
      this.createDateTable();
    });
  }

  selectYear(ele) {
    ele.addEventListener('click', (e) => {
      e.stopPropagation();
      this.viewDate[0] = +ele.getAttribute('data');
      this.createMonthTable();
    });
  }

  show() {
    if (getComputedStyle(this.container).display === 'block') {
      return;
    }
    this.animate.hidden && this.animate.hidden();
    const container = this.container;
    container.style.display = 'block';
    container.classList.add('dp-show');
    this.viewDate = utils.shallowCopy(this.viewDate);
    this.createDateTable();
    this.initTimer();
    const show = this.animate.show = () => {
      container.removeEventListener('animationend', show);
      container.classList.remove('dp-show');
    }
    container.addEventListener('animationend', show);
  }

  hidden() {
    if (getComputedStyle(this.container).display === 'none') {
      return;
    }
    this.animate.show && this.animate.show();
    const container = this.container;
    container.classList.add('dp-hidden');
    const hidden = this.animate.hidden = function() {
      container.removeEventListener('animationend', hidden);
      container.style.display = 'none';
      container.classList.remove('dp-hidden');
    }
    container.addEventListener('animationend', hidden);
  }
}

DP.type = {
  year: 0,
  month: 1,
  date: 2
}

DP.week = ['一', '二', '三', '四', '五', '六', '日'];

module.exports = DP;
