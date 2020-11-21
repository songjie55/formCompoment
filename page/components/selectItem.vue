<template>
  <div class="wrap">
    <label>{{ info.label }}<i v-if="isNecessary">*</i>
      <div class="arrow" />
    </label>
    <div class="select">
      <el-select
        :filterable="isSearch"
        :value="value"
        :placeholder="info.placeholder"
        @change="changeValue"
      >
        <!--补个value不然值变了，但是不会回显-->
        <el-option
          v-for="item in [{value: '', label: '请选择'}, ...optionArr]"
          :key="item.value"
          :disabled="item.label=='请选择'"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SelectItem",
    model: {
      prop: 'value',
      event: 'valChange'
    },
    props: {
      value: '',//这里的默认值和option中的只能用空字符串表示默认未选择，不然Option的颜色会不一样
      optionArr: {
        default: [],
        type: Array
      },
      info: null,
      isSearch: {
        default: false,
        type: Boolean
      },
      isNecessary: {
        default: false,
        type: Boolean
      }
    },
    methods: {
      changeValue(val) {
        this.$emit('valChange', val)
      }
    }
  }
</script>

<style lang="less">
    .wrap {
        margin-bottom: .2rem;
    }

    label {
        font-size: .13rem;
        font-weight: 400;
        color: #333333;
        display: block;

        i {
            color: #FE2828;
        }

        margin-bottom: .05rem;

        &:after {
            clear: both;
            content: '';
            display: block;
        }

        .arrow {
            margin-top: .1rem;
            box-sizing: border-box;
            float: right;
            width: .08rem;
            height: .05rem;
            border-top: 0.04rem solid #999999;
            border-right: 0.04rem solid #fff;
            border-left: 0.04rem solid #fff;
        }
    }


    .select {
        display: block;
        width: 100%;
        height: .32rem;
        line-height: .32rem;
        font-size: .13rem;
        border: unset;
        border-bottom: 1px solid #E6E9EB;
        outline: none;

        &::-webkit-input-placeholder {
            color: #aab2bd;
        }

        &[disabled] {
            background: transparent;
        }

        .el-select {
            width: 100%;
            height: 100%;
        }

        .el-input__inner {
            height: calc(.32rem - 1px);
            padding: 0 !important;
            border: none;
            outline: none;
        }

        .el-select__caret {
            display: none;
        }

    }

</style>
