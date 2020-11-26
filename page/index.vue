<template>
    <div class="contain">
        <img src="../static/123.jpg" alt="" style="width: 100%;">
        <div class="formItem">
            <h4>个人信息</h4>
            <input-item
                    v-model="userInfo.name"
                    :info="formInfo.name"
                    is-necessary
            />
            <select-item
                    v-model="userInfo.certificatesType"
                    :info="formInfo.certificates"
                    :option-arr="optionArr"
                    is-necessary
            />
            <input-item
                    v-model="userInfo.certificatesNumber"
                    :info="formInfo.certificatesNumber"
                    is-necessary
            />
            <input-item
                    v-model="userInfo.age"
                    type="number"
                    :info="formInfo.age"
                    is-necessary
            />
            <input-item
                    v-model="userInfo.tel"
                    type="number"
                    :info="formInfo.tel"
                    is-necessary
            >
                <template #label>
                    <div class="whosePhone">
            <span
                    :class="isUser?'active':''"
                    @click="isUser=true"
            >用药者本人</span>
                        <span
                                :class="!isUser?'active':''"
                                @click="isUser=false"
                        >购药者</span>
                    </div>
                </template>
            </input-item>
            <area-select
                    v-model="userInfo.area"
                    :info="formInfo.area"
                    is-necessary
            />
            <input-item
                    v-model="userInfo.detailAddress"
                    :info="formInfo.detailAddress"
                    is-necessary
            />
        </div>
        <div class="formItem">
            <h4>用药者来源情况<i>*</i></h4>
            <el-radio-group v-model="userInfo.from">
                <el-radio label="1">
                    来自高风险地区
                </el-radio>
                <el-radio label="2">
                    14天内到过中高风险地区
                </el-radio>
                <el-radio label="3">
                    与来自中高风险地区人员密切接触
                </el-radio>
                <el-radio label="4">
                    其他
                </el-radio>
            </el-radio-group>
            <check-item
                    v-model="userInfo.isTravel"
                    :info="formInfo.isTravel"
                    :show-type="false"
            />
        </div>
        <div class="formItem">
            <h4>症状<i>*</i></h4>
            <check-item
                    v-model="userInfo.isFever"
                    :info="formInfo.isFever"
            />
            <check-item
                    v-model="userInfo.isCough"
                    :info="formInfo.isCough"
            />
            <check-item
                    v-model="userInfo.isOther"
                    :info="formInfo.isOther"
            />
            <check-item
                    v-model="userInfo.isSeeD"
                    :info="formInfo.isSeeD"
            />
        </div>
        <div class="formItem">
            <h4>紧急联系人</h4>
            <input-item
                    v-model="userInfo.emergency"
                    :info="formInfo.emergency"
                    is-necessary
            />
            <input-item
                    v-model="userInfo.emergencyPhone"
                    :info="formInfo.emergencyPhone"
                    is-necessary
                    type="number"
            />
        </div>
        <div class="formItem">
            <h4>购药信息</h4>
            <select-item
                    v-model="userInfo.drugName"
                    :info="formInfo.drugName"
                    :option-arr="drugArr"
                    is-search
                    is-necessary
            />
            <date-select
                    v-model="userInfo.buyTime"
                    :info="formInfo.buyTime"
                    is-necessary
            />
            <select-item
                    v-model="userInfo.drugstore"
                    :info="formInfo.drugstore"
                    :option-arr="storeArr"
                    is-search
                    is-necessary
            />
            <area-select
                    v-model="userInfo.storeAddress"
                    :info="formInfo.storeAddress"
                    is-necessary
            />
            <input-item
                    v-model="userInfo.storeAddressDetail"
                    :info="formInfo.storeAddressDetail"
                    is-necessary
            />
            <input-item
                    v-model="userInfo.storeManager"
                    :info="formInfo.storeManager"
                    is-necessary
            />
            <input-item
                    v-model="userInfo.storePhone"
                    type="number"
                    :info="formInfo.storePhone"
                    is-necessary
            />
            <input-item
                    v-model="userInfo.note"
                    :info="formInfo.note"
            />
            <button
                    class="submitBtn"
                    @click="validateForm"
            >
                提交
            </button>
        </div>
        <div
                v-if="isSubmitForm"
                class="resultBox"
        >
            <img
                    :src="isSuccess?sucImg:failImg"
                    alt=""
            >
            <p>提交{{ isSuccess?'成功':'失败' }}</p>
        </div>
        <div
                class="errorMsg"
                :class="isError?'showMsg':''"
        >
            <p>{{ errorMsg }}</p>
            <button @click="isError=false">
                确定
            </button>
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

  export default {
    name: "Index",
    components: { inputItem, selectItem, areaSelect, checkItem, dateSelect },
    data() {
      return {
        axiosConfig: {},
        isError: false,
        errorMsg: '错误提示语',
        isUser: true,
        sucImg: require("../static/success.jpg"),
        failImg: require("../static/fail.jpg"),
        isSuccess: true,
        isSubmitForm: false,
        optionArr: [
          { label: '居民身份证', value: 1 },
          { label: '居民户口簿', value: 2 },
          { label: '护照', value: 3 },
          { label: '军官证', value: 4 },
          { label: '驾驶证', value: 5 },
          { label: '港澳居民来往内地通行证', value: 6 }
        ],
        drugArr: [
          { label: '阿莫西林', value: 1 },
          { label: '阿司匹林', value: 2 },
          { label: '999感冒灵', value: 3 }
        ],
        storeArr: [
          { label: '999药店', value: 1 },
          { label: '88药店', value: 2 },
          { label: '头皮发麻药店', value: 3 }
        ],
        formInfo: {
          name: { label: '用药者姓名', placeholder: '请输入用药者姓名' },
          certificates: { label: '用药者证件', placeholder: '请选择' },
          area: { label: '目前居住地址', placeholder: '请选择地址' },
          certificatesNumber: { label: '证件号码', placeholder: '请输入用药者证件号码' },
          age: { label: '年龄', placeholder: '请输入用药者的年龄' },
          tel: { label: '联系电话', placeholder: '请输入联系电话(手机)' },
          detailAddress: { label: '详细地址', placeholder: '请输入详细地址' },
          isTravel: { label: '境外旅居史' },
          isFever: { label: '发烧' },
          isCough: { label: '咳嗽' },
          isOther: { label: '其他' },
          isSeeD: { label: '是否到医院就诊' },
          emergency: { label: '紧急联系人', placeholder: '请输入紧急联系人姓名' },
          emergencyPhone: { label: '紧急联系人电话', placeholder: '请输入紧急联系人电话' },
          drugName: { label: '购买药品名称', placeholder: '请输入购买药品名称' },
          buyTime: { label: '购买时间', placeholder: '请输入购买时间' },
          drugstore: { label: '药店名称', placeholder: '请输入药店名称' },
          storeAddress: { label: '药店地址', placeholder: '请输入药店地址' },
          storeAddressDetail: { label: '药店详细地址', placeholder: '请输入药店详细地址' },
          storeManager: { label: '药店联系人', placeholder: '请输入药店联系人' },
          storePhone: { label: '药店联系人电话', placeholder: '请输入药店联系人电话' },
          note: { label: '备注', placeholder: '备注信息' }
        },
        userInfo: {
          name: null,
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
          storeAddress: null,
          storeAddressDetail: '',
          storeManager: '',
          storePhone: '',
          note: ''
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
      showErrorMsg(msg) {
        this.isError = true;
        this.errorMsg = msg;
      },
      getOptionArr() {
      },
      validateForm() {
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
            message: '请输入正确年龄'
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
            message: '请选择来源情况'
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
        validator.validate(this.userInfo, { first: true }).then(() => {
          this.postForm();
        }).catch(({ errors, fields }) => {
          this.showErrorMsg(`${errors[0].message}`)
        })
      },
      postForm() {
        //eslint规则测试
        // let x;
        // if(x==true) console.log(123)
        // for (let i = 0; i < 10; i--) {
        // }
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

    .unused-css {
        //测试
        color: blue;
    }
</style>
