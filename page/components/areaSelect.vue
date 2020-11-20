<template>
  <div class="areaSelect">
    <label>{{ info.label }}<i v-if="isNecessary">*</i>
      <div class="arrow" />
    </label>
    <div class="select">
      <!--            :placeholder="info.placeholder"-->
      <el-cascader
        v-model="showValue"
        :options="options"
        @change="changeValue"
      />
    </div>
  </div>
</template>

<script>
    import {regionData, CodeToText} from 'element-china-area-data'

    export default {
        name: "AreaSelect",
        model: {
            prop: 'value',
            event: 'valChange'
        },
        props: {
            info: null,
            isNecessary: {
                default: false,
                type: Boolean
            }
        },
        data() {
            return {
                showValue: '',
                options: regionData,
            }
        },
        methods: {
            changeValue(value) {
                this.showValue = value
                let name = '';
                this.showValue.map(item => name += CodeToText[item])
              // eslint-disable-next-line vue/custom-event-name-casing
                this.$emit('valChange', name)
            },
            clearValue() {

            }
        }
    }
</script>

<style lang="less">
    .areaSelect {
        margin-bottom: .2rem;


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

            .el-cascader {
                width: 100%;
                height: 100%;
                line-height: inherit;
            }

            .el-input__inner {
                height: calc(.32rem - 1px);
                padding: 0 !important;
                border: none;
                outline: none;
            }

            .el-input__icon {
                display: none;
            }


        }
    }

    .el-cascader-menu {
        width: 30vw;
        min-width: unset !important;
    }

    .el-cascader-node {
        padding: 0 !important;
    }
</style>
