<template>
    <div class="areaSelect">
        <label>{{info.label}}<i v-if="isNecessary">*</i>
            <div class="arrow"></div>
        </label>
        <div class="select" :class="placeholder?'showD':''">
            <el-cascader :disabled="disabled" :placeholder="placeholder" :options="options" :value="address" @change="changeValue">
            </el-cascader>
        </div>
    </div>
</template>

<script>

    export default {
        name: "areaSelect",
        props: {
            placeholder: null,
            options: {
                default: () => [],
                type: Array
            },
            info: null,
            address: {
                default: () => [],
                type: Array
            },
            isNecessary: {
                default: false,
                type: Boolean
            },
            disabled: {
                default: false,
                type: Boolean
            }
        },
        model: {
            prop: 'value',
            event: 'valChange'
        },
        methods: {
            changeValue(value) {
                if (this.placeholder) {
                    this.$emit('changeStoreAddress')
                }
                this.$emit('valChange', value)
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

        .showD {
            .el-cascader {
                .el-input__inner::-webkit-input-placeholder {
                    color: #333333 !important;
                }
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