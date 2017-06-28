export default {
  insertZero(val, num = 2) {
    return (0 + '' + val).slice(-num);
  },
  getOffset(ele) {
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
  },
  /**
   * 比较两个日期是否相等
   * @param  {[type]} paramA 日期
   * @param  {[type]} paramB 日期
   * @param  {[type]} compareDate   是否比较date
   */
  compareDate(paramA, paramB, compareDate) {
    paramA = this.shallowCopy(paramA);
    paramB = this.shallowCopy(paramB);
    paramA[1] = this.insertZero(paramA[1]);
    paramA[2] = this.insertZero(paramA[2]);
    paramB[1] = this.insertZero(paramB[1]);
    paramB[2] = this.insertZero(paramB[2]);
    return +paramA.slice(0, compareDate ? 3 : 2).join('') - +paramB.slice(0, compareDate ? 3 : 2).join('');
  },
  shallowCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  getDate(date) {
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
  }
}
