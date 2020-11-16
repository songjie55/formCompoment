<template>
    <div class="container infinite-list-wrapper" style="overflow:auto;height: 100vh;">
        <header-search @startSearch="searchList"></header-search>
        <ul class="infinite-list" v-infinite-scroll="loaderMore" infinite-scroll-disabled="disabled"
            infinite-scroll-immediate="false">
            <li class="listItem" v-for="(item,index) in list" :key="item.id">
                <p class="firstLine">
                    <span>用药者姓名</span><span>{{item.drugUserName}}</span><span>症状</span><span>{{getSick(item)}}</span>
                </p>
                <p><span>性别</span><span>{{item.userSex=='F'?'女':'男'}}</span></p>
                <p><span>居住地址</span><span>{{item.userAddress}}</span></p>
                <p><span>联系电话</span>{{item.userPhone}}</p>
                <p><span>用药者来源</span>{{getFrom(item)}}</p>
            </li>
        </ul>
        <p class="tip" v-if="loading">加载中...</p>
        <p class="tip" v-if="noMore">{{list.length===0?'查无数据':'没有更多了'}}</p>
    </div>

</template>

<script>
    import headerSearch from "./components/header";

    export default {
        components: {headerSearch},
        name: "list",
        data() {
            return {
                baseUrl: 'http://192.168.1.183',
                loading: false,
                disabled: false,
                noMore: false,
                list: [],
                limit: 20,
                page: 1,
                searchForm: {
                    drugUserName: '',
                    idCard: '',
                    purchaseTime: '',
                    drugNames: ''
                }
            }
        },
        beforeMount() {
            this.loaderMore()
        },
        methods: {
            getSick(item) {
                let res = '无';
                if (item.isCoughSymptoms !== '否') {
                    res = '咳嗽'
                } else if (item.isFeverSymptoms !== '否') {
                    res = '发烧'
                } else if (item.isOtherSymptoms !== '否') {
                    res = '其他症状'
                } else if (item.isVisitedHospital !== '否') {
                    res = '到过医院就诊'
                }
                return res
            },
            getFrom(item) {
                let res = '其他';
                if (item.isCloseWithHighPeople !== '否') {
                    res = '与来自中高风险地区人员密切接触'
                } else if (item.isFromHighRisk !== '否') {
                    res = '来自高风险地区'
                } else if (item.isToHighRiskIn14 !== '否') {
                    res = '14天内到过中高风险地区'
                }
                return res
            },
            searchList(params) {
                this.searchForm = Object.assign({page: this.page}, params)
                this.list = []
                this.page = 1
                this.loaderMore()
            },
            loaderMore() {
                if (this.loading === true) return false//阻止多次加载
                this.loading = true;
                this.axios({
                    method: 'post',
                    url: `${this.baseUrl}/mspWechat/disp/drugsaleReg/queryDrugsaleRegList`,
                    data: Object.assign({page: this.page}, this.searchForm)
                }).then(res => {
                    if (res.data.data.length > 0) {
                        this.list.push(...res.data.data)
                        this.page++;
                    } else {
                        this.noMore = true;
                        this.disabled = true;
                    }
                    this.loading = false;
                }).catch((e) => {
                    console.log(e)
                    this.loading = false;
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

    ul {
        list-style: none;
    }

    .tip {
        font-size: .16rem;
        line-height: .3rem;
        text-align: center;
    }

    .listItem {
        width: 90%;
        padding: 2% 5%;
        font-size: .13rem;
        margin: 0 auto .15rem;
        background: #FFFFFF;
        box-shadow: 0px 5px 15px 0px rgba(179, 179, 179, 0.3);
        border-radius: 10px;
        box-sizing: border-box;

        p {
            line-height: .25rem;

            span {
                display: block;
                float: left;
                width: 70%;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;

                &:first-child {
                    width: 30%;
                }
            }

            &:after {
                clear: both;
                content: '';
                display: block;
            }
        }

        .firstLine {
            span:nth-child(n+2) {
                width: 23%;
            }
        }

    }
</style>