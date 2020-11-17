<template>
    <div class="header" v-clickOutSide="closeForm">
        <i class="el-icon-arrow-left backBtn" @click="backPage"></i>
        <button v-if="from==='list'" @click="isShowForm =!isShowForm" style="font-size: .2rem;">
            <i class="el-icon-search"></i>
        </button>
        <div class="searchForm" :class="isShowForm?'show':'hide'">
            <el-form ref="searchForm" :model="searchForm" label-width="100px">
                <el-form-item prop="drugUserName">
                    <span slot="label" class="labelSpan">
                        <img :src="imgList[3]" alt="">
                        姓名
                    </span>
                    <el-input v-model="searchForm.drugUserName" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item prop="idCard">
                     <span slot="label" class="labelSpan">
                        <img :src="imgList[2]" alt="">
                        身份证号
                    </span>
                    <el-input v-model="searchForm.idCard" placeholder="请输入身份证号"></el-input>
                </el-form-item>
                <el-form-item prop="purchaseTime">
                    <span slot="label" class="labelSpan">
                        <img :src="imgList[1]" alt="">
                        购药时间
                    </span>
                    <el-date-picker
                            format="yyyy-MM-dd"
                            value-format="yyyyMMdd"
                            v-model="searchForm.purchaseTime"
                            type="date"
                            placeholder="选择购药时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="drugNames">
                     <span slot="label" class="labelSpan">
                        <img :src="imgList[0]" alt="">
                        药品名称
                    </span>
                    <el-input v-model="searchForm.drugNames" placeholder="请输入药品名称"></el-input>
                </el-form-item>
            </el-form>
            <div class="btnList">
                <button class="submitBtn" @click="searchList">查询</button>
                <button class="submitBtn" @click="resetForm">重置</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "headerSearch",
        data() {
            return {
                baseUrl: 'http://192.168.1.183',
                isShowForm: false,
                imgList: [
                    require('../../static/drug.png'),
                    require('../../static/time.png'),
                    require('../../static/id.png'),
                    require('../../static/name.png')
                ],
                searchForm: {
                    drugUserName: '',
                    idCard: '',
                    purchaseTime: '',
                    drugNames: ''
                }
            }
        },
        props: {
            from: {
                default: 'list',
                type: String
            },
        },
        methods: {
            closeForm() {
                this.isShowForm = false;
            },
            searchList() {
                this.$emit('startSearch', this.searchForm)
                this.isShowForm = false;
            },
            backPage() {
                if (this.from === 'list' || this.from === 'add') {
                    window.opener = null;
                    window.close();
                } else if (this.from = 'detail') {
                    window.location.href = `${this.$root.$data.baseUrl}/mspWechat/wechat/distList/index.html`
                }
            },
            resetForm() {
                this.$refs.searchForm.resetFields();
            }
        },
        directives: {
            clickOutSide: {
                bind(el, binding, vnode, oldVnode) {
                    document.addEventListener('click', function (ev) {
                        if (!el.contains(ev.target)) {
                            vnode.context[binding.expression]()
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .header {
        display: flex;
        position: relative;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 0 2%;
        box-sizing: border-box;
        height: 40px;
        background-color: #1b2c5f;
        font-size: .13rem;
        color: #ffffff;

        i {
            font-size: 22px;
            padding: 0 0.2rem;
        }

        button {
            padding: 0 .2rem;
            outline: none;
            background-color: transparent;
            border: none;
            color: #ffffff;
            font-size: .13rem;
            line-height: .4rem;
        }

        .searchForm {
            width: 100%;
            position: absolute;
            padding: .1rem 5%;
            box-sizing: border-box;
            left: 50%;
            transform: translateX(-50%);
            background: #fff;
            border-bottom: 1px solid #eee;
            transition: all 500ms;

            .labelSpan {
                display: flex;
                align-items: center;

                img {
                    width: 15px;
                    height: 15px;
                    margin-right: .05rem;
                }
            }

            .el-date-editor.el-input, .el-date-editor.el-input__inner {
                width: 100% !important;
            }

            .btnList {
                width: 100%;
                text-align: center;

                &:after {
                    content: '';
                    display: block;
                }

                button {
                    display: inline;
                    color: #333333;
                    border-radius: .05rem;
                    border: 1px solid #eee;

                    &:nth-child(1) {
                        margin-right: 0.15rem;
                    }
                }
            }

        }

        .show {
            visibility: visible;
            opacity: 1;
            top: 40px;
        }

        .hide {
            visibility: hidden;
            opacity: 0;
            top: -60px;
        }
    }
</style>