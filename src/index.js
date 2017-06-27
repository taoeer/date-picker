import './css/dp.scss';
import utils from './utils';

class DP {
  constructor(target, opts) {
    this.target = target;
    for(const key in opts) {
      this[key] = opts[key];
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

    this.date = this.date || new Date();
    this.viewDate = [this.date.getFullYear(), this.date.getMonth() + 1, this.date.getDate()];
    this.value = [this.date.getFullYear(), this.date.getMonth() + 1, this.date.getDate()];
    this.initDom();
    this.initEvent();
  }
  getElementOffset(ele) {
    const offset = {
      x: 0,
      y: 0
    }
    while(ele) {
      offset.x += ele.offsetLeft;
      offset.y += ele.offsetTop;
      ele = ele.offsetParent;
    }
    return offset;
  }
  initDom() {
    this.doms = {};
    const dpBox = this.doms.container = document.createElement('div');
    this.dpBox = dpBox;
    dpBox.style.display = 'none';
    dpBox.className = 'dp-container';
    dpBox.innerHTML = [
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
      // '<div class="dp-ft">',
      //   '<button>取消</button>',
      //   '<button>清除</button>',
      //   '<button>此刻</button>',
      //   '<button>确定</button>',
      // '</div>'
    ].join('');
    const targetOffset = this.getElementOffset(this.target);
    dpBox.style.left = targetOffset.x + 'px';
    dpBox.style.top = this.target.offsetHeight + targetOffset.y + 'px';
    document.body.appendChild(dpBox);
    this.doms.body = dpBox.querySelector('.dp-bd');
    this.doms.prev = dpBox.querySelector('.dp-prev');
    this.doms.next = dpBox.querySelector('.dp-next');
    this.doms.year = dpBox.querySelector('.dp-year');
    this.doms.month = dpBox.querySelector('.dp-month');
    this.changeHead();
    this.createDateTable();
  }

  changeHead() {
    this.doms.year.innerHTML = this.viewDate[0] + '年';
    this.doms.month.innerHTML = utils.insertZero(this.viewDate[1]) + '月';
  }

  createDateTable() {
    this.viewType = DP.type.date;

    const
      date = new Date(this.viewDate.join('/')),
      table = document.createElement('table'),
      today = this.date.getDate();

    table.className = 'dp-date-table';

    date.setDate(1);
    const firstDay = date.getDay();
    date.setDate(0);
    const lastMonthTotalDays = date.getDate();
    date.setMonth(date.getMonth() + 1);
    date.setDate(0)
    const totalDays = date.getDate();
    let row, col;

    let days = [];
    for(let i = 0; i < totalDays; i++) {
      days.push(i + 1);
    }

    for (let i = 0; i < firstDay - 1; i ++) {
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
      if (i > firstDay - 2 && i < totalDays + firstDay - 1) {
        col.className = "pick";
        col.setAttribute('data', days[i]);
        this.selectDay(col);
      }
      if (today === i + 1) {
        col.classList.add('today');
        col.innerHTML = '今天';
      } else {
        col.innerHTML = days[i];
      }
    }

    this.doms.body.innerHTML = '';
    this.doms.body.appendChild(table);
  }

  createMonthTable() {
    this.viewType = DP.type.month;
    const table = document.createElement('table');
    table.className = 'dp-month-table';
    let row, col;
    for (let i = 0 ; i < 12; i ++) {
      if(i % 3 === 0) {
        row = table.insertRow();
      }
      col = row.insertCell();
      col.classList.add('pick');
      if (this.date.getMonth() == i ) {
        col.classList.add('current');
      }
      col.setAttribute('data', i + 1);
      col.innerHTML = i + 1 + '月';
      this.selectMont(col);
    }

    this.doms.body.innerHTML = '';
    this.doms.body.appendChild(table);
  }

  createYearTable() {
     this.viewType = DP.type.year;
    const
      table = document.createElement('table'),
      startYear = Math.floor(this.viewDate[0]/10) * 10;

    table.className = 'dp-year-table';
    let row, col;
      for (let i = 0; i < 10; i++) {
        if (i % 4 === 0) {
          row = table.insertRow();
        }
        col = row.insertCell();
        col.classList.add('pick');
        if (startYear + i === this.viewDate[0]) {
          col.classList.add('current');
        }
        col.setAttribute('data', startYear + i);
        col.innerHTML = startYear + i;
        this.selectYear(col);
      }
      this.doms.body.innerHTML = '';
      this.doms.body.appendChild(table);
  }

  initEvent() {
    this.doms.prev.addEventListener('click', (e) => {
      e.stopPropagation();
      switch(this.viewType) {
        case DP.type.date:
          this.viewDate[1] -= 1;
          if (this.viewDate[1] < 1) {
            this.viewDate[0] -= 1;
            this.viewDate[1] = 12;
          }
          this.value[0] = this.viewDate[0];
          this.value[1] = this.viewDate[1];
          this.createDateTable();
          break;
        case DP.type.month:
          this.viewDate[0] -= 1;
          this.createMonthTable();
          this.value[0] = this.viewDate[0];
          this.value[1] = this.viewDate[1];
          break;
        case DP.type.year:
          this.viewDate[0] -= 10;
          this.createYearTable();
      }
      this.changeHead();
    });

    this.doms.next.addEventListener('click', (e) => {
      e.stopPropagation();
      switch(this.viewType) {
        case DP.type.date:
          this.viewDate[1] += 1;
          if (this.viewDate[1] > 12) {
            this.viewDate[0] += 1;
            this.viewDate[1] = 1;
          }
          this.createDateTable();
          this.value[0] = this.viewDate[0];
          this.value[1] = this.viewDate[1];
          break;
        case DP.type.month:
          this.viewDate[0] += 1;
          this.createMonthTable();
          this.value[0] = this.viewDate[0];
          this.value[1] = this.viewDate[1];
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

    document.documentElement.addEventListener('click', (e) => {
      let ele = e.target;
      while(ele) {
        if (ele === this.doms.container) {
          return;
        }
        ele = ele.parentNode;
      }
      this.hidden();
    });
  }

  selectDay(ele) {
    ele.addEventListener('click', (e) => {
      e.stopPropagation();
      this.value[2] = +ele.getAttribute('data');
      this.target.value = this.value.join('-');
      this.hidden();
    });
  }

  selectMont(ele) {
    ele.addEventListener('click', (e) => {
      e.stopPropagation();
      this.viewDate[1] = +ele.getAttribute('data')
      this.value[1] = +ele.getAttribute('data');
      this.createDateTable();
      this.changeHead();
    });
  }

  selectYear(ele) {
    ele.addEventListener('click', (e) => {
      e.stopPropagation();
      this.viewDate[0] = +ele.getAttribute('data');
      this.value[0] = +ele.getAttribute('data');
      this.createMonthTable();
      this.changeHead();
    });
  }

  show() {
    const container = this.doms.container
    container.style.display = 'block';
    container.classList.add('dp-show');
    container.addEventListener('animationend', function show() {
      this.removeEventListener('animationend', show);
      this.classList.toggle('dp-show');
    });
  }

  hidden() {
    const container = this.doms.container;
    container.classList.add('dp-hidden');
    container.addEventListener('animationend', function hidden() {
      this.removeEventListener('animationend', hidden);
      this.style.display = 'none';
      this.classList.toggle('dp-hidden');
    });
  }
}

DP.type = {
  year: 0,
  month: 1,
  date: 2
}

DP.week = ['一', '二', '三', '四', '五', '六', '日'];

new DP('#dp', {
  format: 'yyyy-MM-dd'
});

module.exports = DP;
