<template>
    <div class="container infinite-list-wrapper" style="overflow:auto;height: 100vh;">
        <header-search @startSearch="searchList"></header-search>
        <ul class="infinite-list" v-infinite-scroll="loaderMore" infinite-scroll-disabled="disabled">
            <li class="listItem" v-for="(item,index) in list" :key="index">
                <p class="firstLine">
                    <span>用药者姓名</span><span>{{item.drugUserName}}</span><span>症状</span><span>{{item.sick}}</span>
                </p>
                <p><span>性别</span><span>{{item.userSex=='F'?'女':'男'}}</span></p>
                <p><span>居住地址</span><span>{{item.address}}</span></p>
                <p><span>联系电话</span>{{item.userPhone}}</p>
                <p><span>用药者来源</span>{{item.from}}</p>
            </li>
        </ul>
        <p class="tip" v-if="loading">加载中...</p>
        <p class="tip" v-if="noMore">没有更多了</p>
    </div>

</template>

<script>
    import headerSearch from "./components/header";

    export default {
        components: {headerSearch},
        name: "list",
        data() {
            return {
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
            // this.loaderMore()
            for (let i = 0; i < 20; i++) {
                this.list.push({
                    id: 1,
                    drugUserName: '用户1',
                    address: '地址123',
                    sick: '无',
                    userSex: 'F',
                    userPhone: '12345678965',
                    from: '地球'
                })
            }
        },
        methods: {
            searchList(params) {
                console.log(params)
                this.searchForm = Object.assign({}, params)
                this.list = []
                this.page = 1
                this.loaderMore()
            },
            loaderMore() {
                this.loading = true;
                this.axios({
                    method: 'post',
                    url: `${this.baseUrl}/mspWechat/disp/drugsaleReg/queryDrugsaleRegList`,
                    data: this.searchForm
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
                //
                for (let i = 0; i < 20; i++) {
                    this.list.push({
                        id: 1,
                        drugUserName: '用户1',
                        address: '地址123',
                        sick: '无',
                        userSex: 'F',
                        userPhone: '12345678965',
                        from: '地球'
                    })
                }
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
    .tip{
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