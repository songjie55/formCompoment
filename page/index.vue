<template>
    <div class="contain">
        <div class="formItem">
            <h4>个人信息</h4>
            <input-item :info="formInfo.name" is-necessary v-model="userInfo.name"></input-item>
            <select-item :info="formInfo.certificates" v-model="userInfo.certificatesType" :option-arr="optionArr"
                         is-necessary></select-item>
            <input-item :info="formInfo.certificatesNumber" v-model="userInfo.certificatesNumber"
                        is-necessary></input-item>
            <input-item type="number" :info="formInfo.age" v-model="userInfo.age" is-necessary></input-item>
            <input-item type="number" :info="formInfo.tel" v-model="userInfo.tel" is-necessary>
                <template v-slot:label>
                    <div class="whosePhone">
                        <span :class="isUser?'active':''" @click="isUser=true">用药者本人</span>
                        <span :class="!isUser?'active':''" @click="isUser=false">购药者</span>
                    </div>
                </template>
            </input-item>
            <area-select :info="formInfo.area" is-necessary v-model="userInfo.area"></area-select>
            <input-item :info="formInfo.detailAddress" is-necessary v-model="userInfo.detailAddress"></input-item>
        </div>
        <div class="formItem">
            <h4>用药者来源情况<i>*</i></h4>
            <el-radio-group v-model="userInfo.from">
                <el-radio label="1">来自高风险地区</el-radio>
                <el-radio label="2">14天内到过中高风险地区</el-radio>
                <el-radio label="3">与来自中高风险地区人员密切接触</el-radio>
                <el-radio label="4">其他</el-radio>
            </el-radio-group>
            <check-item :info="formInfo.isTravel" v-model="userInfo.isTravel" :showType="false"></check-item>
        </div>
        <div class="formItem">
            <h4>用药者来源情况<i>*</i></h4>
            <check-item :info="formInfo.isFever" v-model="userInfo.isFever"></check-item>
            <check-item :info="formInfo.isCough" v-model="userInfo.isCough"></check-item>
            <check-item :info="formInfo.isOther" v-model="userInfo.isOther"></check-item>
            <check-item :info="formInfo.isSeeD" v-model="userInfo.isSeeD"></check-item>
        </div>
        <div class="formItem">
            <h4>紧急联系人</h4>
            <input-item :info="formInfo.emergency" is-necessary v-model="userInfo.emergency"></input-item>
            <input-item :info="formInfo.emergencyPhone" is-necessary v-model="userInfo.emergencyPhone"
                        type="number"></input-item>
        </div>
        <div class="formItem">
            <h4>购药信息</h4>
            <select-item :info="formInfo.drugName" v-model="userInfo.drugName" :option-arr="drugArr"
                         is-search is-necessary></select-item>
            <date-select :info="formInfo.buyTime" is-necessary v-model="userInfo.buyTime"></date-select>
            <select-item :info="formInfo.drugstore" v-model="userInfo.drugstore" :option-arr="storeArr"
                         is-search is-necessary></select-item>
            <area-select :info="formInfo.storeAddress" is-necessary v-model="userInfo.storeAddress"></area-select>
            <input-item :info="formInfo.storeAddressDetail" is-necessary
                        v-model="userInfo.storeAddressDetail"></input-item>
            <input-item :info="formInfo.storeManager" is-necessary v-model="userInfo.storeManager"></input-item>
            <input-item type="number" :info="formInfo.storePhone" is-necessary
                        v-model="userInfo.storePhone"></input-item>
            <input-item :info="formInfo.note" v-model="userInfo.note"></input-item>
            <button class="submitBtn" @click="submitForm">提交</button>
        </div>
        <div v-if="isSubmitForm" class="resultBox">
            <img :src="isSuccess?sucImg:failImg" alt="">
            <p>提交{{isSuccess?'成功':'失败'}}</p>
        </div>
    </div>
</template>

<script>
    import inputItem from './components/inputItem'
    import selectItem from "./components/selectItem";
    import areaSelect from "./components/areaSelect";
    import checkItem from "./components/checkItem";
    import dateSelect from "./components/dateSelect";
    import axios from 'axios'
    import Schema from 'async-validator'

    export default {
        name: "index",
        components: {inputItem, selectItem, areaSelect, checkItem, dateSelect},
        data() {
            return {
                axiosConfig: {},
                isUser: true,
                sucImg: require("../static/success.jpg"),
                failImg: require("../static/fail.jpg"),
                isSuccess: true,
                isSubmitForm: false,
                optionArr: [
                    {label: '居民身份证', value: 1},
                    {label: '居民户口簿', value: 2},
                    {label: '护照', value: 3},
                    {label: '军官证', value: 4},
                    {label: '驾驶证', value: 5},
                    {label: '港澳居民来往内地通行证', value: 6}
                ],
                drugArr: [
                    {label: '阿莫西林', value: 1},
                    {label: '阿司匹林', value: 2},
                    {label: '999感冒灵', value: 3}
                ],
                storeArr: [
                    {label: '999药店', value: 1},
                    {label: '88药店', value: 2},
                    {label: '头皮发麻药店', value: 3}
                ],
                formInfo: {
                    name: {label: '用药者姓名', placeholder: '请输入用药者姓名'},
                    certificates: {label: '用药者证件', placeholder: '请选择'},
                    area: {label: '目前居住地址', placeholder: '请选择地址'},
                    certificatesNumber: {label: '证件号码', placeholder: '请输入用药者证件号码'},
                    age: {label: '年龄', placeholder: '请输入用药者的年龄'},
                    tel: {label: '联系电话', placeholder: '请输入联系电话'},
                    detailAddress: {label: '详细地址', placeholder: '请输入详细地址'},
                    isTravel: {label: '境外旅居史'},
                    isFever: {label: '发烧'},
                    isCough: {label: '咳嗽'},
                    isOther: {label: '其他'},
                    isSeeD: {label: '是否到医院就诊'},
                    emergency: {label: '紧急联系人', placeholder: '请输入紧急联系人姓名'},
                    emergencyPhone: {label: '紧急联系人电话', placeholder: '请输入紧急联系人电话'},
                    drugName: {label: '购买药品名称', placeholder: '请输入购买药品名称'},
                    buyTime: {label: '购买时间', placeholder: '请输入购买时间'},
                    drugstore: {label: '药店名称', placeholder: '请输入药店名称'},
                    storeAddress: {label: '药店地址', placeholder: '请输入药店地址'},
                    storeAddressDetail: {label: '药店详细地址', placeholder: '请输入药店详细地址'},
                    storeManager: {label: '药店联系人', placeholder: '请输入药店联系人'},
                    storePhone: {label: '药店联系人电话', placeholder: '请输入药店联系人电话'},
                    note: {label: '备注', placeholder: '备注信息'},
                },
                userInfo: {
                    name: '',
                    from: '',
                    certificatesType: null,
                    certificatesNumber: '',
                    age: '',
                    area: '',
                    tel: '',
                    detailAddress: '',
                    isTravel: false,
                    isFever: false,
                    isCough: false,
                    isOther: false,
                    isSeeD: false,
                    emergency: '',
                    emergencyPhone: '',
                    drugName: null,
                    buyTime: null,
                    drugstore: null,
                    storeAddress: '',
                    storeAddressDetail: '',
                    storeManager: '',
                    storePhone: '',
                    note: '',
                }
            }
        },
        beforeCreate() {
            let vw = document.body.clientWidth,
                html = document.getElementsByTagName('html')[0];
            html.style.fontSize = (100 * vw / 375) + 'px'
        },
        mounted() {
            this.getOptionArr()
        },
        methods: {
            getOptionArr() {
            },
            submitForm() {
                this.validateForm()
                // axios()
            },
            validateForm() {
                console.log(this.userInfo);
                //     certificatesNumber: '',
                //     age: '',
                //     area: '',
                //     tel: '',
                //     detailAddress: '',
                //     isTravel: false,
                //     isFever: false,
                //     isCough: false,
                //     isOther: false,
                //     isSeeD: false,
                //     emergency: '',
                //     emergencyPhone: '',
                //     drugName: null,
                //     buyTime: null,
                //     drugstore: null,
                //     storeAddress: '',
                //     storeAddressDetail: '',
                //     storeManager: '',
                //     storePhone: '',
                //     note: ''
                const descriptor = {
                    name: {
                        type: 'string',
                        require: true,
                        message: '请输入正确姓名'
                    },
                    from: {
                        require: true,
                        message: '请选择来源情况'
                    },
                    certificatesType: {
                        require: true,
                        message: '请选择证件类型'
                    }
                };
                const validator = new Schema(descriptor);
                validator.validate(this.userInfo).then(() => {
                }).catch((error, fields) => {
                    console.log(error)
                    console.log(fields)
                })
            }
        }
    }
</script>

<style lang="less">
    * {
        padding: 0;
        margin: 0;
    }

    body {
        background: #F5F5F5;
    }

    .formItem {
        padding: 0 .15rem;
        margin-bottom: .1rem;
        background: #fff;
        overflow: hidden;

        &:last-child {
            margin-bottom: 0;
        }

        .el-radio {
            margin-right: 0;
            margin-bottom: .15rem;
            display: flex;
            color: #666666;
            font-size: .13rem;
        }

        .el-radio__input.is-checked + .el-radio__label {
            color: unset;
        }
    }


    h4 {
        line-height: .16rem;
        font-size: .16rem;
        font-weight: bold;
        color: #333333;
        overflow: hidden;
        margin: .15rem -0px;

        i {
            color: #FE2828;
        }

    }

    .whosePhone {
        float: right;

        span {
            font-size: .13rem;
            color: #666666;
            padding: 0.02rem 0.07rem;
            line-height: .2rem;
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

    .submitBtn {
        display: block;
        width: 90%;
        line-height: .4rem;
        height: .4rem;
        margin: 0.3rem auto 0.3rem;
        background: #0B9BE3;
        border-radius: .05rem;
        color: #ffffff;
        font-size: .18rem;
        border: none;
    }

    .resultBox {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 100;
        background: #fff;
        width: 100vw;
        height: 80vh;
        font-size: .13rem;
        color: #333333;
        text-align: center;
        padding-top: 20vh;

        img {
            width: 20%;
        }
    }
</style>