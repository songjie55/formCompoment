<template>
  <div class="checkItem">
    <label>{{ info.label }}</label>
    <ul>
      <li
        :class="value?'active':''"
        @click="changeValue(true)"
      >
        {{ showType?'是':'有' }}
      </li>
      <li
        :class="!value?'active':''"
        @click="changeValue(false)"
      >
        {{ showType?'否':'无' }}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "CheckItem",
    model: {
      prop: 'value',
      event: 'valChange'
    },
    props: {
      value: false,
      info: null,
      isTravel: {
        type: Boolean
      },
      showType: {
        default: true,
        type: Boolean
      }
    },
    data() {
      return {
        showValue: false
      }
    },
    methods: {
      changeValue(value) {
        this.showValue = value;
        this.$emit('valChange', value)
      }
    }
  }
</script>

<style scoped lang="less">
    .checkItem {
        margin-bottom: .2rem;
        display: flex;
        font-size: .13rem;
        height: .3rem;
        line-height: .2rem;
        justify-content: space-between;
        border-bottom: 1px solid #E6E9EB;
    }

    label {
        font-weight: 400;
        color: #333333;
        display: block;
        margin-bottom: .05rem;
    }

    ul {
        list-style: none;

        li {
            float: left;
            width: .4rem;
            height: .2rem;
            color: #666666;
            text-align: center;
            border-radius: 0.1rem;
            border: 1px solid #DCDFE0;

            &:nth-child(1) {
                margin-right: .1rem;
            }
        }

        .active {
            color: #fff;
            background-color: #0B9BE3;
            border: none;
        }
    }

</style>
