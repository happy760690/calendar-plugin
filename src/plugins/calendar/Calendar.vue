<template>
  <div class="calendar_box">
    <!-- 日历{{modelValue}} -->
    <div class="title_box">
      <span class="prev_year_btn btn" @click="prevYear">&lt;&lt; </span>
      <span class="prev_month_btn btn" @click="prevMonth"> &lt; </span>
      <span class="time_box">{{ state.dateTitle }}</span>
      <span class="next_month_btn btn" @click="nextMonth"> &gt;</span>
      <span class="next_year_btn btn" @click="nextYear"> &gt;&gt;</span>
    </div>
    <ul class="weekly_box">
       <li v-for='(item, wk) in week' :key="wk">{{item}}</li>
    </ul>
    <ul class="day_box" v-for="(item, rk) in state.dayAry" :key="rk">
      <li
        :key="ck"
        v-for="(val, ck) in item"
        :class="{ gray: val.isGrey, isSelect: val.isSelect }"
        @click="selectDay(val)"
      >
        {{ val.text }}
      </li>
    </ul>
  </div>
</template>
<script>
import { onMounted, reactive, watch  } from "vue";

export default {
  name: "Calendar",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },

  setup(props, {emit}) {
    const week = [ "一", "二", "三", "四", "五", "六", "日"];
    let state = reactive({
      num1: null,
      currentDayCount: null,
      dayAry: [],
      dateTitle: ''
    });

    /**
     * 选中日期
     */
    function selectDay(val) {
      let { y, m} = splitDate(state.dateTitle)
      let d = val.text
      state.dateTitle = `${y}/${m}/${d}`
      sendDate();
    }

    const sendDate = () => {
        emit("update:modelValue", state.dateTitle);
    };

    /**
     * 前一天
     */
    function prevMonth() {
      let { y, m, d} = splitDate(state.dateTitle)
      --m
      d = 1;
      if(m == 0){
        --y;
        m = 12
      }
      state.dateTitle = `${y}/${m}/${d}`
    }
    /**
     * 后一天
     */
    function nextMonth(){
      let { y, m, d} = splitDate(state.dateTitle)
      ++m;
      d = 1;
      if(m == 13){
        ++y;
        m = 1;
      }
      state.dateTitle = `${y}/${m}/${d}`
    }
    /**
     * 前一年
     */
    function prevYear(){
      let { y, m, d} = splitDate(state.dateTitle)
      --y;
      state.dateTitle = `${y}/${m}/${d}`
    }
    /**
     * 后一年
     */
    function nextYear(){
      let { y, m, d} = splitDate(state.dateTitle)
      ++y;
      state.dateTitle = `${y}/${m}/${d}`
    }

    /**
     * 拆分日期
     */
    function splitDate(strDate) {
      let strDateArr = strDate.split("/");
      return { y: strDateArr[0], m: strDateArr[1], d: strDateArr[2] };
    }
    /**
     * 用于添加日期信息
     */
    function addDayInfo(arr, isGrey, isSelect, text, operateMethod = "push") {
      arr[operateMethod]({ isGrey, isSelect, text });
    }
    /**
     * 获取传入月份有多少天,获取第一天的开始位置
     */
    function getRunderData(strDate) {
      let { y, m } = splitDate(strDate); // 拆分数据
      return [new Date(y, m, 0).getDate(), new Date(y, m - 1, 0).getDay()];
    }
    /**
     * 获取上个月的总天数
     */
    function getLastMonthDayCount(strDate) {
      let { y, m } = splitDate(strDate); // 拆分数据
      return new Date(y, m - 1, 0).getDate();
    }

    /**
     * 初始化日历数据
     */
    function initCalenderData(strDate) {
      state.dayAry=[];
      let tempArr = []; // 临时存放每一行天的数据
      let curNum = 1; // 记录当前天
      let starLocation = 0; // 初始位置
      let lastMonthDayCount = 0; // 上个月总天数
      let grayFlag = 0; // 标志正在生成下个月日期

      let { d } = splitDate(strDate);

      [state.currentDayCount, starLocation] = getRunderData(strDate); // 获取props传入日期的信息
      lastMonthDayCount = getLastMonthDayCount(strDate); // 上个月总天数

      for (let k = 1; k <= 6; k++) {
        tempArr = [];
        let num = (k - 1) * 7;
        for (let i = num; i < num + 7; i++) {
          if (k > 1) {
            // 除第一行外的处理逻辑
            if (curNum > state.currentDayCount) {
              curNum = 1; // 重置日期
              grayFlag = 1;
            }
            addDayInfo(tempArr, grayFlag, d == curNum && !grayFlag, curNum++);
          } else if (k == 1) {
            if (i < starLocation) {
              // 如果是第一行并且 指针位置小于起始位置
              addDayInfo(tempArr, 1, 0, lastMonthDayCount--, "unshift");
            } else {
              addDayInfo(tempArr, 0, d == curNum, curNum++);
            }
          }
        }
        state.dayAry.push(tempArr);
      }
    }

    initCalenderData(state.dateTitle); // 初始化日历数据


    watch(()=> props.modelValue, () => {
      state.dateTitle = props.modelValue
    })
    watch(()=> state.dateTitle, (strDate) => {
      initCalenderData(strDate);
    })

    onMounted(() => {
      state.dateTitle = props.modelValue
      // setTimeout(() => {
      //   emit("update:modelValue", "2021/4/3");
      // }, 2000);
    });

    return {
      state,
      week,
      selectDay,
      prevMonth,
      nextMonth,
      prevYear,
      nextYear,
      emit,
    };
  },
};
</script>
<style lang="less">
ul,
li,
div,
span {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
.calendar_box {
  width: 400px;
  position: relative;
  margin: auto;
  .title_box {
    height: 50px;
    display: flex;
    width: 300px;
    margin: auto;
    .btn {
      width: 30px;
      font-size: 20px;
      font-weight: 600;
      cursor: pointer;
    }
    .time_box {
      flex: auto;
    }
  }
  .weekly_box,
  .day_box {
    padding: 5px 10px;
    box-sizing: border-box;
    display: flex;
    li {
      flex: 1;
      cursor: pointer;
    }
  }
  .weekly_box {
    border: 1px solid #ccc;
    border-left: none;
    border-right: none;
  }
  .day_box {
    li {
      padding: 10px 0;
    }
    li.gray {
      color: #ccc;
      cursor: no-drop;
    }
    li.isSelect {
      background-color: blue;
      color: #fff;
    }
  }
}
</style>