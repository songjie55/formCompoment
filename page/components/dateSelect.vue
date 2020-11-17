<template>
    <div class="wrap">
        <label>{{info.label}}<i v-if="isNecessary">*</i>
            <div class="arrow"></div>
        </label>
        <div class="select dataSelect">
            <el-date-picker
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :value="value"
                    type="datetime"
                    @input="changeValue"
                    :placeholder="info.placeholder">
            </el-date-picker>
        </div>

    </div>
</template>

<script>
    export default {
        name: "dateItem",
        model: {
            prop: 'value',
            event: 'valChange'
        },
        props: {
            value:'',
            info: null,
            isNecessary: {
                default: false,
                type: Boolean
            }
        },
        methods: {
            changeValue(value) {
                this.$emit('valChange', value)
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

    .dataSelect {
        .el-input {
            width: 100% !important;
        }

        .el-input__icon {
            display: none;
        }
    }

</style>