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
            <check-item :info="formInfo.userSex" v-model="userInfo.userSex" :show-type="2"></check-item>
        </div>
        <div class="formItem">
            <h4>用药者来源情况<i>*</i></h4>
            <el-checkbox-group v-model="userInfo.from" @change="changeFrom">
                <el-checkbox :disabled="isNotOther" label="1">来自高风险地区</el-checkbox>
                <el-checkbox :disabled="isNotOther" label="2">14天内到过中高风险地区</el-checkbox>
                <el-checkbox :disabled="isNotOther" label="3">与来自中高风险地区人员密切接触</el-checkbox>
                <el-checkbox :disabled="isOther" label="4">其他</el-checkbox>
            </el-checkbox-group>
            <check-item :info="formInfo.isTravel" v-model="userInfo.isTravel" :show-type="1"></check-item>
        </div>
        <div class="formItem">
            <h4>症状<i>*</i></h4>
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
            <select-item :info="formInfo.drugName" value-property="id" :is-mulitple="true" show-property="drugNameChn"
                         @getOptions="getOptionArr"
                         v-model="userInfo.drugName"
                         :option-arr="drugArr"
                         is-search is-necessary></select-item>
            <date-select :info="formInfo.buyTime" is-necessary v-model="userInfo.buyTime"></date-select>
            <input-item :disabled="true" :info="formInfo.drugstore" is-necessary
                        v-model="userInfo.drugstore"></input-item>
            <area-select :placeholder="placeholder" :info="formInfo.storeAddress" is-necessary
                         @changeStoreAddress="isChangeStoreAddress=true"
                         v-model="userInfo.storeAddress"></area-select>
            <input-item :info="formInfo.storeAddressDetail" is-necessary
                        v-model="userInfo.storeAddressDetail"></input-item>
            <input-item :info="formInfo.storeManager" is-necessary v-model="userInfo.storeManager"></input-item>
            <input-item type="number" :info="formInfo.storePhone" is-necessary
                        v-model="userInfo.storePhone"></input-item>
            <input-item :info="formInfo.note" v-model="userInfo.note"></input-item>
            <button :disabled="isSumbiting" class="submitBtn" @click="validateForm">{{isSumbiting?'提交中':'提交'}}</button>
        </div>
        <div v-if="isSubmitForm" class="resultBox">
            <img :src="isSuccess?sucImg:failImg" alt="">
            <p>提交{{isSuccess?'成功':'失败'}}</p>
        </div>
        <div class="errorMsg" :class="isError?'showMsg':''">
            <p>{{errorMsg}}</p>
            <button @click="isError=false">确定</button>
        </div>
    </div>
</template>

<script>
    import inputItem from './components/inputItem'
    import selectItem from "./components/selectItem";
    import areaSelect from "./components/areaSelect";
    import checkItem from "./components/checkItem";
    import dateSelect from "./components/dateSelect";
    import Schema from 'async-validator'
    import {CodeToText} from 'element-china-area-data'

    export default {
        name: "index",
        components: {inputItem, selectItem, areaSelect, checkItem, dateSelect},
        data() {
            return {
                placeholder: '',
                isChangeStoreAddress: false,
                isError: false,
                isSumbiting: false,
                errorMsg: '错误提示语',
                isNotOther: false,
                isOther: false,
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
                drugArr: [],
                storeArr: [],
                formInfo: {
                    name: {label: '用药者姓名', placeholder: '请输入用药者姓名'},
                    certificates: {label: '用药者证件', placeholder: '请选择'},
                    area: {label: '目前居住地址', placeholder: '请选择地址'},
                    certificatesNumber: {label: '证件号码', placeholder: '请输入用药者证件号码'},
                    age: {label: '年龄', placeholder: '请输入用药者的年龄'},
                    tel: {label: '联系电话', placeholder: '请输入联系电话(手机)'},
                    detailAddress: {label: '详细地址', placeholder: '请输入详细地址'},
                    userSex: {label: '性别'},
                    isTravel: {label: '境外旅居史'},
                    isFever: {label: '发烧'},
                    isCough: {label: '咳嗽'},
                    isOther: {label: '其他'},
                    isSeeD: {label: '是否到医院就诊'},
                    emergency: {label: '紧急联系人', placeholder: '请输入紧急联系人姓名'},
                    emergencyPhone: {label: '紧急联系人电话', placeholder: '请输入紧急联系人电话'},
                    drugName: {label: '购买药品名称', placeholder: '请输入模糊查询关键字(例如:药名+制药公司+规格)'},
                    buyTime: {label: '购买时间', placeholder: '请输入购买时间'},
                    drugstore: {label: '药店名称', placeholder: '请输入药店名称'},
                    storeAddress: {label: '药店地址', placeholder: '请输入药店地址'},
                    storeAddressDetail: {label: '药店详细地址', placeholder: '请输入药店详细地址'},
                    storeManager: {label: '药店联系人', placeholder: '请输入药店联系人'},
                    storePhone: {label: '药店联系人电话', placeholder: '请输入药店联系人电话'},
                    note: {label: '备注', placeholder: '备注信息'},
                },
                userInfo: {
                    name: null,
                    from: [],
                    certificatesType: null,
                    certificatesNumber: '',
                    age: '',
                    area: '',
                    tel: '',
                    detailAddress: '',
                    userSex: false,
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
                    storeCode: '',
                    storeAddress: [],
                    storeAddressDetail: '',
                    storeManager: '',
                    storePhone: '',
                    note: '',
                }
            }
        },
        mounted() {
            //获取药店信息
            this.getStoreDetail()
        },
        methods: {
            changeFrom() {
                if (this.userInfo.from.length > 0) {
                    if (this.userInfo.from.find(i => i === '4')) {
                        this.isOther = false;
                        this.isNotOther = true;
                    } else {
                        this.isOther = true;
                        this.isNotOther = false;
                    }
                } else {
                    this.isOther = false;
                    this.isNotOther = false;
                }
            },
            decryptCode(list) {
                let name = '';
                list.map(item => name += CodeToText[item] + '/')
                return name
            },
            showErrorMsg(msg) {
                this.isError = true;
                this.errorMsg = msg;
            },
            getStoreDetail() {
                this.axios({
                    method: 'get',
                    url: `${this.baseUrl}/mspWechat/disp/drugsaleReg/quenyCompNameToCompany`,
                }).then(res => {
                    let data = res.data.data
                    this.userInfo.drugstore = data.compName;
                    this.userInfo.storeCode = data.storeCode;
                    this.placeholder = [data.storeProvince, data.storeCity, data.storeCounty].join('/');
                    this.userInfo.storeAddressDetail = data.storeAddress;
                })
            },
            getOptionArr(obj) {
                if (obj) {
                    let data = {drugNameChn: '', produceCompany: '', drugSpec: ''};
                    if (obj.value.indexOf('+') > -1) {
                        let arr = obj.value.split('+');
                        if (arr.length === 3) {
                            data.drugNameChn = arr[0]
                            data.produceCompany = arr[1]
                            data.drugSpec = arr[2]
                        }
                        if (arr.length === 2) {
                            data.drugNameChn = arr[0]
                            data.produceCompany = arr[1]
                        }
                    } else {
                        data.drugNameChn = obj.value;
                    }
                    this.axios({
                        method: 'post',
                        url: `${this.baseUrl}/mspWechat/disp/drugsaleReg/quenyDrugToName`,
                        data: data,
                    }).then(res => {
                        if (res.data.data.length > 1000) {
                            this.showErrorMsg('查询结果过多，请添加关键词进行匹配')
                            return false
                        }
                        this.drugArr = res.data.data;
                    })
                }
            },
            validateForm() {
                if (this.isSumbiting) {
                    return false;
                }
                const descriptor = {
                    name: {
                        type: 'string',
                        required: true,
                        Pattern: /\S/g,
                        message: '请输入正确姓名'
                    },
                    certificatesType: {
                        required: true,
                        message: '请选择证件类型',
                        validator: (rule, value) => value !== null && value !== ''
                    },
                    certificatesNumber: {
                        required: true,
                        message: '请输入正确证件号码',
                        Pattern: /\S/g
                    },
                    age: {
                        required: true,
                        message: '请输入正确年龄',
                    },
                    tel: {
                        required: true,
                        message: '请输入正确联系电话',
                        validator: (rule, value) => {
                            return /^1(3|4|5|6|7|8|9)\d{9}$/.test(value)
                        }
                    },
                    area: {
                        required: true,
                        message: '请选择居住地区域',
                        validator: (rule, value) => value !== null && value !== ''
                    },
                    detailAddress: {
                        type: 'string',
                        required: true,
                        Pattern: /\S/g,
                        message: '请输入详细地址'
                    },
                    from: {
                        required: true,
                        message: '请选择来源情况',
                        validator: (rule, value) => value !== null && value !== ''
                    },
                    emergency: {
                        type: 'string',
                        required: true,
                        Pattern: /\S/g,
                        message: '请输入紧急联系人姓名'
                    },
                    emergencyPhone: {
                        required: true,
                        message: '请输入紧急联系人联系电话',
                        validator: (rule, value) => {
                            return /^1(3|4|5|6|7|8|9)\d{9}$/.test(value)
                        }
                    },
                    drugName: {
                        required: true,
                        message: '请选择购买药品名称',
                        validator: (rule, value) => value !== null && value !== ''
                    },
                    buyTime: {
                        required: true,
                        message: '请选择购药时间',
                        validator: (rule, value) => value !== null && value !== ''
                    },
                    drugstore: {
                        required: true,
                        message: '请选择药店名称',
                        validator: (rule, value) => value !== null && value !== ''
                    },
                    storeAddress: {
                        required: true,
                        message: '请选择药店所属区域',
                        validator: (rule, value) => value !== null && value !== ''
                    },
                    storeAddressDetail: {
                        type: 'string',
                        required: true,
                        Pattern: /\S/g,
                        message: '请输入药店详细地址'
                    },
                    storeManager: {
                        type: 'string',
                        required: true,
                        Pattern: /\S/g,
                        message: '请输入药店联系人姓名'
                    },
                    storePhone: {
                        required: true,
                        message: '请输入药店联系人联系电话',
                        validator: (rule, value) => {
                            return /^1(3|4|5|6|7|8|9)\d{9}$/.test(value)
                        }
                    }
                };
                const validator = new Schema(descriptor);
                validator.validate(this.userInfo, {first: true}).then(() => {
                    console.log('passed')
                    this.postForm();
                }).catch(({errors, fields}) => {
                    this.showErrorMsg(`${errors[0].message}`)
                })
            },
            postForm() {
                this.isSumbiting = true;
                let obj = {};
                obj.drugUserName = this.userInfo.name;
                obj.idCard = this.userInfo.certificatesNumber;
                obj.userAge = this.userInfo.age;
                obj.userSex = this.userInfo.userSex ? 'F' : 'M';
                obj.userPhone = this.userInfo.tel;
                obj.isUserPhone = this.isUser ? 1 : 0;
                obj.isFromHighRisk = this.userInfo.from.find(i => i === '1') !== undefined ? 1 : 0;
                obj.isCloseWithHighPeople = this.userInfo.from.find(i => i === '3') !== undefined ? 1 : 0;
                obj.isOtherSource = this.userInfo.from.find(i => i === '4') !== undefined ? 1 : 0;
                obj.isToHighRiskIn14 = this.userInfo.from.find(i => i === '2') !== undefined ? 1 : 0;
                obj.hasOverseaTravelHis = this.userInfo.isTravel ? '1' : '0';
                obj.isFeverSymptoms = this.userInfo.isFever ? '1' : '0';
                obj.isCoughSymptoms = this.userInfo.isCough ? '1' : '0';
                obj.isOtherSymptoms = this.userInfo.isOther ? '1' : '0';
                obj.isVisitedHospital = this.userInfo.isSeeD ? '1' : '0';
                obj.emergencyContact = this.userInfo.emergency;
                obj.emergencyPhone = this.userInfo.emergencyPhone;
                obj.purchaseTime = this.userInfo.buyTime;
                let list = []
                this.userInfo.drugName.map(i => {
                    let arr = i.split('+');
                    list.push({id: arr[0], name: arr[1]})
                })
                obj.drugList = list;
                obj.storeContact = this.userInfo.storeManager;
                obj.storeContactPhone = this.userInfo.storePhone;
                obj.remark = this.userInfo.note;
                obj.userAddress = this.userInfo.detailAddress;
                let address1 = this.decryptCode(this.userInfo.area).split('/')
                let address2 = this.isChangeStoreAddress ? this.decryptCode(this.userInfo.storeAddress).split('/') : this.placeholder.split('/')
                obj.storeCode = this.userInfo.storeCode;
                obj.storeName = this.userInfo.drugstore;
                obj.province = address1[0]
                obj.storeProvince = address1[0]
                obj.city = address1[1]
                obj.storeCity = address2[1]
                if (address1.length > 2) {
                    obj.county = address1[2]
                }
                if (address2.length > 2) {
                    obj.storeCounty = address2[2]
                }


                this.axios({
                    method: 'post',
                    url: `${this.baseUrl}/mspWechat/disp/drugsaleReg/saveDrug`,
                    data: obj
                }).then(res => {
                    this.isSubmitForm = true;
                    this.isSuccess = res.data.data.data >= 1
                    this.isSumbiting = false;
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
        z-index: 100;
        left: 0;
        top: 0;
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

    .errorMsg {
        width: 60vw;
        padding: .2rem .1rem;
        border-radius: .15rem;
        background: #fff;
        position: fixed;
        z-index: -100;
        left: 50%;
        font-size: .13rem;
        top: 50%;
        transform: translate(-50%, -60%);
        text-align: center;
        border: 1px solid #eee;
        visibility: hidden;
        transition: all 500ms;

        button {
            margin-top: 0.2rem;
            margin-right: 0.1rem;
            float: right;
            display: block;
            border-radius: 0.15rem;
            border: none;
            color: #fff;
            background: #0B9BE3;
            padding: 0.1rem 0.15rem;
            outline: none;
        }
    }

    .showMsg {
        z-index: 100;
        transform: translate(-50%, -50%);
        visibility: visible;
    }

    .el-checkbox {
        display: block !important;
    }
</style>