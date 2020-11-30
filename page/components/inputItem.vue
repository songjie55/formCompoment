<template>
  <div class="wrap">
    <label>{{ info.label }}<i v-if="isNecessary">*</i>
      <slot name="label" />
    </label>
    <input
      :type="type"
      :value="value"
      :placeholder="info.placeholder"
      @input="changeValue"
    >
  </div>
</template>

<script>
  export default {
    name: "InputItem",
    model: {
      prop: 'value',
      event: 'valChange'
    },
    props: {
      value: '',//添加一个回显
      type: {
        default: 'text',
        type: String
      },
      info: null,
      isNecessary: {
        default: false,
        type: Boolean
      }
    },
    methods: {
      changeValue(el) {
        this.$emit('valChange', el.target.value)
      }
    }
  }
</script>

<style scoped lang="less">
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
    }

    input {
        display: block;
        width: 100%;
        line-height: .32rem;
        font-size: .13rem;
        border: unset;
        border-bottom: 1px solid #E6E9EB;
        outline: none;

        &::-webkit-input-placeholder {
            color: #aab2bd;
        }
    }
    .shitbox{
      background-color: yellow;
    }
</style>
