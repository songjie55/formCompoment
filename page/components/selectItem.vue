<template>
    <div class="wrap">
        <label>{{info.label}}<i v-if="isNecessary">*</i>
            <div class="arrow"></div>
        </label>
        <div class="select">
            <el-select :remote="isSearch"
                       :disabled="disabled"
                       :multiple="isMulitple"
                       :remote-method="getOptionArr"
                       :loading="loading&&isSearch"
                       :reserve-keyword="isSearch"
                       :filterable="isSearch" :value="value" :placeholder="info.placeholder" @change="changeValue">
                <!--补个value不然值变了，但是不会回显-->
                <template v-if="isMulitple">
                    <el-option
                            v-for="item in options2"
                            :key="item[valueProperty]"
                            :label="item[showProperty]"
                            :value="getValue(item)">
                        <template v-slot>
                            <p style="display: flex;justify-content: space-between">
                                <span style="display:block;max-width: 40vw;white-space: nowrap;text-overflow: ellipsis;overflow: hidden">{{item.drugNameChn}}</span>
                                <span style="display:block;max-width: 40vw;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;text-align:right;">{{item.produceCompany}}</span>
                            </p>
                        </template>
                    </el-option>
                </template>
                <template v-else>
                    <el-option
                            v-for="item in options1"
                            :disabled="item.label=='请选择'"
                            :key="item[valueProperty]"
                            :label="item[showProperty]"
                            :value="item[showProperty]">
                    </el-option>
                </template>
            </el-select>
        </div>
    </div>
</template>

<script>
    export default {
        name: "selectItem",
        props: {
            value: null,//这里的默认值和option中的只能用空字符串表示默认未选择，不然Option的颜色会不一样
            optionArr: {
                default: () => [],
                type: Array
            },
            info: null,
            valueProperty: {
                default: 'label',
                type: String
            },
            showProperty: {
                default: 'label',
                type: String
            },
            disabled: {
                default: false,
                type: Boolean
            },
            isSearch: {
                default: false,
                type: Boolean
            },
            isNecessary: {
                default: false,
                type: Boolean
            },
            isMulitple: {
                default: false,
                type: Boolean
            }
        },
        model: {
            prop: 'value',
            event: 'valChange'
        },
        watch: {
            optionArr(nv, ov) {
                this.options2 = nv;
                this.loading = false
            }
        },
        data() {
            return {
                loading: false,
                options1: [{value: '', label: '请选择'}, ...this.optionArr],
                options2: this.optionArr
            }
        },
        methods: {
            changeValue(val) {
                this.$emit('valChange', val)
            },
            getValue(item) {
                return `${item.id}+${item.drugNameChn}`
            },
            getOptionArr(query) {
                if (query !== '') {
                    this.loading = true;
                    this.$emit('getOptions', {value: query})
                } else {
                    this.loading = false;
                    this.options2 = [];
                }
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

        .el-select__input {
            padding-left: 0;
            margin-left: 0;
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