<template>
    <div class="contain">
        <header-search :from="from"></header-search>
        <img :src="bannerImg" alt="" class="bannerImg">
        <div class="formItem">
            <h4>个人信息</h4>
            <input-item :disabled="isShowDetail" :info="formInfo.drugUserName" :is-necessary="!isShowDetail"
                        v-model="userInfo.drugUserName"></input-item>
            <select-item v-if="!isShowDetail" :info="formInfo.certificates" v-model="userInfo.certificatesType"
                         :option-arr="optionArr"
                         :is-necessary="!isShowDetail"></select-item>
            <input-item :disabled="isShowDetail" :info="formInfo.idCard" v-model="userInfo.idCard"
                        :is-necessary="!isShowDetail"></input-item>
            <input-item :disabled="isShowDetail" type="number" :info="formInfo.userAge" v-model="userInfo.userAge"
                        :is-necessary="!isShowDetail"></input-item>
            <input-item :disabled="isShowDetail" :info="formInfo.userPhone" v-model="userInfo.userPhone"
                        :is-necessary="!isShowDetail">
                <template v-slot:label>
                    <div class="whosePhone">
                        <span :class="isUser?'active':''" @click="changePhoneType()">用药者本人</span>
                        <span :class="!isUser?'active':''" @click="changePhoneType(false)">购药者</span>
                    </div>
                </template>
            </input-item>
            <area-select :disabled="isShowDetail" :options="isUser?fuzhouOptions:optionsArr1" :info="formInfo.area"
                         :is-necessary="!isShowDetail" :placeholder="placeholder1"
                         v-model="userInfo.area"></area-select>
            <input-item :disabled="isShowDetail" :info="formInfo.userAddress" :is-necessary="!isShowDetail"
                        v-model="userInfo.userAddress"></input-item>
            <check-item :disabled="isShowDetail" :info="formInfo.userSex" v-model="userInfo.userSex"
                        :show-type="2"></check-item>
        </div>
        <div class="formItem">
            <h4>用药者来源情况<i>*</i></h4>
            <el-checkbox-group v-model="userInfo.from" @change="changeFrom">
                <el-checkbox :disabled="isNotOther" label="1">来自高风险地区</el-checkbox>
                <el-checkbox :disabled="isNotOther" label="2">14天内到过中高风险地区</el-checkbox>
                <el-checkbox :disabled="isNotOther" label="3">与来自中高风险地区人员密切接触</el-checkbox>
                <el-checkbox :disabled="isOther" label="4">其他</el-checkbox>
            </el-checkbox-group>
            <check-item :disabled="isShowDetail" :info="formInfo.isTravel" v-model="userInfo.isTravel"
                        :show-type="1"></check-item>
        </div>
        <div class="formItem">
            <h4>症状<i>*</i></h4>
            <check-item :disabled="isShowDetail" :info="formInfo.isFever" v-model="userInfo.isFever"></check-item>
            <check-item :disabled="isShowDetail" :info="formInfo.isCough" v-model="userInfo.isCough"></check-item>
            <check-item :disabled="isShowDetail" :info="formInfo.isOther" v-model="userInfo.isOther"></check-item>
            <check-item :disabled="isShowDetail" :info="formInfo.isSeeD" v-model="userInfo.isSeeD"></check-item>
        </div>
        <div class="formItem">
            <h4>紧急联系人</h4>
            <input-item :disabled="isShowDetail" :info="formInfo.emergencyContact" :is-necessary="!isShowDetail"
                        v-model="userInfo.emergencyContact"></input-item>
            <input-item :disabled="isShowDetail" :info="formInfo.emergencyPhone" :is-necessary="!isShowDetail"
                        v-model="userInfo.emergencyPhone"></input-item>
        </div>
        <div class="formItem">
            <h4>购药信息</h4>
            <select-item :info="formInfo.drugNames" value-property="id" :is-mulitple="true" show-property="drugNameChn"
                         @getOptions="getOptionArr"
                         v-model="userInfo.drugNames"
                         :option-arr="drugArr"
                         :disabled="isShowDetail"
                         is-search :is-necessary="!isShowDetail"></select-item>
            <date-select :disabled="isShowDetail" :info="formInfo.purchaseTime" :is-necessary="!isShowDetail"
                         v-model="userInfo.purchaseTime"></date-select>
            <input-item :isReadonly="true" :info="formInfo.storeName" :is-necessary="!isShowDetail"
                        v-model="userInfo.storeName"></input-item>
            <area-select :disabled="isShowDetail" :options="optionsArr1" :placeholder="placeholder"
                         :info="formInfo.storeAddress"
                         :is-necessary="!isShowDetail"
                         @changeStoreAddress="isChangeStoreAddress=true"
                         v-model="userInfo.storeAddress"></area-select>
            <input-item :disabled="isShowDetail" :info="formInfo.storeAddressDetail" :is-necessary="!isShowDetail"
                        v-model="userInfo.storeAddressDetail"></input-item>
            <input-item :disabled="isShowDetail" :info="formInfo.storeContact" :is-necessary="!isShowDetail"
                        v-model="userInfo.storeContact"></input-item>
            <input-item :disabled="isShowDetail" :info="formInfo.storeContactPhone"
                        :is-necessary="!isShowDetail"
                        v-model="userInfo.storeContactPhone"></input-item>
            <input-item :disabled="isShowDetail" :info="formInfo.remark" v-model="userInfo.remark"></input-item>
            <button v-if="!isShowDetail" :disabled="isSumbiting" class="submitBtn" @click="validateForm">
                {{isSumbiting?'提交中':'提交'}}
            </button>
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
    import headerSearch from "./components/header";
    import Schema from 'async-validator'
    import {CodeToText, regionData} from 'element-china-area-data'

    export default {
        name: "index",
        components: {inputItem, selectItem, areaSelect, checkItem, dateSelect, headerSearch},
        data() {
            return {
                from: 'add',
                //
                placeholder1: '请选择地址',
                placeholder: '',
                isChangeStoreAddress: false,
                isError: false,
                isSumbiting: false,
                errorMsg: '错误提示语',
                isNotOther: false,
                isOther: false,
                isShowDetail: false,
                isUser: true,
                bannerImg: require("../static/banner.png"),
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
                fuzhouOptions: [{label: '', children: [], value: '1'}],
                optionsArr1: regionData,
                drugArr: [],
                storeArr: [],
                formInfo: {
                    drugUserName: {label: '用药者姓名', placeholder: '请输入用药者姓名'},
                    certificates: {label: '用药者证件', placeholder: '请选择'},
                    area: {label: '目前居住地址', placeholder: '请选择地址'},
                    idCard: {label: '证件号码', placeholder: '请输入用药者证件号码'},
                    userAge: {label: '年龄', placeholder: '请输入用药者的年龄'},
                    userPhone: {label: '联系电话', placeholder: '请输入联系电话'},
                    userAddress: {label: '详细地址', placeholder: '请输入详细地址'},
                    userSex: {label: '性别'},
                    isTravel: {label: '境外旅居史'},
                    isFever: {label: '发烧'},
                    isCough: {label: '咳嗽'},
                    isOther: {label: '其他'},
                    isSeeD: {label: '是否到医院就诊'},
                    emergencyContact: {label: '紧急联系人', placeholder: '请输入紧急联系人姓名'},
                    emergencyPhone: {label: '紧急联系人电话', placeholder: '请输入紧急联系人电话'},
                    drugNames: {label: '购买药品名称', placeholder: '请输入关键字(例如:批准文号+药名+厂家+规格)'},
                    purchaseTime: {label: '购买时间', placeholder: '请选择购买时间'},
                    storeName: {label: '药店名称', placeholder: '请输入药店名称'},
                    storeAddress: {label: '药店地址', placeholder: '请选择药店地址'},
                    storeAddressDetail: {label: '药店详细地址', placeholder: '请输入药店详细地址'},
                    storeContact: {label: '药店联系人', placeholder: '请输入药店联系人'},
                    storeContactPhone: {label: '药店联系人电话', placeholder: '请输入药店联系人电话'},
                    remark: {label: '备注', placeholder: '备注信息'},
                },
                userInfo: {
                    drugUserName: null,
                    from: [],
                    certificatesType: null,
                    idCard: '',
                    userAge: '',
                    area: '',
                    userPhone: '',
                    userAddress: '',
                    userSex: false,
                    isTravel: false,
                    isFever: false,
                    isCough: false,
                    isOther: false,
                    isSeeD: false,
                    emergencyContact: '',
                    emergencyPhone: '',
                    drugNames: null,
                    purchaseTime: null,
                    storeName: null,
                    storeCode: '',
                    storeAddress: [],
                    storeAddressDetail: '',
                    storeContact: '',
                    storeContactPhone: '',
                    remark: '',
                }
            }
        },
        watch: {
            isUser() {
                this.userInfo.area = []
            }
        },
        mounted() {
            if (window.location.href.indexOf('?') > -1 && window.location.href.split('?')[1].indexOf('id=') > -1) {
                this.isShowDetail = true;
                let id = window.location.href.split('?')[1].split('=')[1];
                this.searchDetail(id)
                this.from = 'detail'
            } else {
                let resArr = JSON.parse(JSON.stringify(regionData.filter(i => i.label === '福建省')))
                resArr[0].children = resArr[0].children.filter(i => i.label === '福州市')
                this.fuzhouOptions = resArr;
                this.userInfo.area = "";
                //获取药店信息
                this.getStoreDetail()
            }

        },
        methods: {
            changePhoneType(type = true) {
                if (this.isShowDetail) return false
                this.isUser = type;
            },
            searchDetail(id) {
                this.axios({
                    method: 'post',
                    url: `${this.$root.$data.baseUrl}/mspWechat/disp/drugsaleReg/queryDrugsaleRegList`,
                    data: {id: id, pageNum: '1'}
                }).then(res => {
                    let data = res.data.data[0]
                    this.isUser = data.isUserPhone === '1'
                    this.userInfo = Object.assign(this.userInfo, data)
                    this.placeholder = [data.storeProvince, data.storeCity, data.storeCounty].join('/');
                    this.userInfo.storeAddressDetail = data.storeAddress;
                    this.placeholder1 = [data.province, data.city, data.county].join('/');
                    this.$nextTick(() => {
                        this.userInfo.from = [];
                        if (data.isFromHighRisk === '是') this.userInfo.from.push('1')
                        if (data.isToHighRiskIn14 === '是') this.userInfo.from.push('2')
                        if (data.isCloseWithHighPeople === '是') this.userInfo.from.push('3')
                        if (data.isOtherSource === '是') this.userInfo.from.push('4')
                        if (data.isOtherSource === '是' || data.isFromHighRisk === '是' || data.isToHighRiskIn14 === '是' || data.isCloseWithHighPeople === '是') {
                            this.isOther = true;
                        }
                        if (data.isOtherSource === '是') {
                            this.isNotOther = true;
                        }
                        this.userInfo.isCough = data.isCoughSymptoms === '是';
                        this.userInfo.isFever = data.isFeverSymptoms === '是';
                        this.userInfo.isSeeD = data.isVisitedHospital === '是';
                        this.userInfo.isOther = data.isOtherSymptoms === '是';
                        this.formInfo.drugNames.placeholder = this.userInfo.drugNames;
                        this.userInfo.userSex = data.userSex === '男'
                        this.userInfo.isTravel = data.hasOverseaTravelHis === '有';
                    })

                }).catch((e) => {
                    console.log(e)
                })
            },
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
                    url: `${this.$root.$data.baseUrl}/mspWechat/disp/drugsaleReg/quenyCompNameToCompany`,
                }).then(res => {
                    let data = res.data.data
                    this.userInfo.storeName = data.compName;
                    this.userInfo.storeCode = data.storeCode;
                    this.placeholder = [data.storeProvince, data.storeCity, data.storeCounty].join('/');
                    this.userInfo.storeAddressDetail = data.storeAddress;
                })
            },
            getOptionArr(obj) {
                if (obj) {
                    let data = {regNumb: '', drugNameChn: '', produceCompany: '', drugSpec: ''};
                    if (obj.value.indexOf('+') > -1) {
                        let arr = obj.value.split('+');
                        if (arr.length === 4) {
                            data.regNumb = arr[0]
                            data.drugNameChn = arr[1]
                            data.produceCompany = arr[2]
                            data.drugSpec = arr[3]
                        }
                        if (arr.length === 3) {
                            data.regNumb = arr[0]
                            data.drugNameChn = arr[1]
                            data.produceCompany = arr[2]
                        }
                        if (arr.length === 2) {
                            data.regNumb = arr[0]
                            data.drugNameChn = arr[1]
                        }
                    } else {
                        if (obj.value.length < 8) return false;
                        data.regNumb = obj.value;
                    }
                    this.axios({
                        method: 'post',
                        url: `${this.$root.$data.baseUrl}/mspWechat/disp/drugsaleReg/quenyDrugToName`,
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
                    drugUserName: {
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
                    idCard: {
                        required: true,
                        message: '请输入正确证件号码',
                        Pattern: /\S/g
                    },
                    userAge: {
                        required: true,
                        message: '请输入正确年龄',
                    },
                    userPhone: {
                        required: true,
                        message: '请输入正确联系电话',
                        validator: (rule, value) => {
                            return (/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) || (/0\d{2,3}-[1-9]\d{6,7}/.test(value))
                        }
                    },
                    area: {
                        required: true,
                        message: '请选择居住地区域',
                        validator: (rule, value) => value !== null && value !== ''
                    },
                    userAddress: {
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
                    emergencyContact: {
                        type: 'string',
                        required: true,
                        Pattern: /\S/g,
                        message: '请输入紧急联系人姓名'
                    },
                    emergencyPhone: {
                        required: true,
                        message: '请输入正确紧急联系人电话',
                        validator: (rule, value) => {
                            return (/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) || (/0\d{2,3}-[1-9]\d{6,7}/.test(value))
                        }
                    },
                    drugNames: {
                        required: true,
                        message: '请选择购买药品名称',
                        validator: (rule, value) => value !== null && value !== ''
                    },
                    purchaseTime: {
                        required: true,
                        message: '请选择购药时间',
                        validator: (rule, value) => value !== null && value !== ''
                    },
                    storeName: {
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
                    storeContact: {
                        type: 'string',
                        required: true,
                        Pattern: /\S/g,
                        message: '请输入药店联系人姓名'
                    },
                    storeContactPhone: {
                        required: true,
                        message: '请输入正确药店联系人电话',
                        validator: (rule, value) => {
                            return (/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) || (/0\d{2,3}-[1-9]\d{6,7}/.test(value))
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
                if (this.isShowDetail) {
                    return false;
                }
                this.isSumbiting = true;
                let obj = {};
                obj.drugUserName = this.userInfo.drugUserName;
                obj.idCard = this.userInfo.idCard;
                obj.userAge = this.userInfo.userAge;
                obj.userSex = this.userInfo.userSex ? 'F' : 'M';
                obj.userPhone = this.userInfo.userPhone;
                obj.isUserPhone = this.isUser ? 1 : 0;
                obj.isFromHighRisk = this.userInfo.from.find(i => i === '1') !== undefined ? 1 : 0;
                obj.isCloseWithHighPeople = this.userInfo.from.find(i => i === '3') !== undefined ? 1 : 0;
                obj.isOtherSource = this.userInfo.from.find(i => i === '4') !== undefined ? 1 : 0;
                obj.isToHighRiskIn14 = this.userInfo.from.find(i => i === '2') !== undefined ? 1 : 0;
                obj.hasOverseaTravelHis = this.userInfo.isTravel ? '1' : '2';
                obj.isFeverSymptoms = this.userInfo.isFever ? '1' : '0';
                obj.isCoughSymptoms = this.userInfo.isCough ? '1' : '0';
                obj.isOtherSymptoms = this.userInfo.isOther ? '1' : '0';
                obj.isVisitedHospital = this.userInfo.isSeeD ? '1' : '0';
                obj.emergencyContact = this.userInfo.emergencyContact;
                obj.emergencyPhone = this.userInfo.emergencyPhone;
                obj.purchaseTime = this.userInfo.purchaseTime;
                let list = []
                this.userInfo.drugNames.map(i => {
                    let arr = i.split('+');
                    list.push({id: arr[0], name: arr[1]})
                })
                obj.drugList = list;
                obj.storeContact = this.userInfo.storeContact;
                obj.storeContactPhone = this.userInfo.storeContactPhone;
                obj.remark = this.userInfo.remark;
                obj.userAddress = this.userInfo.userAddress;
                obj.storeAddress = this.userInfo.storeAddressDetail;
                obj.provinceCode = this.userInfo.area[0];
                obj.cityCode = this.userInfo.area[1];
                obj.countyCode = this.userInfo.area[2];
                let address1 = this.decryptCode(this.userInfo.area).split('/')
                let address2 = this.isChangeStoreAddress ? this.decryptCode(this.userInfo.storeAddress).split('/') : this.placeholder.split('/')
                obj.storeCode = this.userInfo.storeCode;
                obj.storeName = this.userInfo.storeName;
                obj.province = address1[0]
                obj.storeProvince = address2[0]
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
                    url: `${this.$root.$data.baseUrl}/mspWechat/disp/drugsaleReg/saveDrug`,
                    data: obj
                }).then(res => {
                    this.isSubmitForm = true;
                    this.isSuccess = res.data.data >= 1
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
        width: 100vw;
        height: 100vh;
        overflow-y: scroll;
        background: #F5F5F5;
    }

    .bannerImg {
        width: 100%;
        display: block;
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
            font-size: .14rem;
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
            font-size: .14rem;
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
        font-size: .14rem;
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
        font-size: .14rem;
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
