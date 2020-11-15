<template>
    <div class="header" v-clickOutSide="closeForm">
        <button @click="backPage">返回</button>
        <button @click="isShowForm =!isShowForm">搜索表</button>
        <div class="searchForm" v-show="isShowForm">
            <el-form ref="searchForm" :model="searchForm" label-width="80px">
                <el-form-item label="姓名">
                    <el-input v-model="searchForm.drugUserName" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="身份证号">
                    <el-input v-model="searchForm.idCard" placeholder="请输入身份证号"></el-input>
                </el-form-item>
                <el-form-item label="购药时间">
                    <el-date-picker
                            format="yyyy-MM-dd"
                            value-format="yyyyMMdd"
                            v-model="searchForm.purchaseTime"
                            type="date"
                            placeholder="选择购药时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="药品名称">
                    <el-input v-model="searchForm.drugNames" placeholder="请输入药品名称"></el-input>
                </el-form-item>
            </el-form>
            <button class="submitBtn" @click="searchList">查询</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "headerSearch",
        data() {
            return {
                isShowForm: false,
                searchForm: {
                    drugUserName: '1',
                    idCard: '2',
                    purchaseTime: '3',
                    drugNames: '4'
                }
            }
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
                window.opener = null;
                window.close();
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
        height: .4rem;
        background-color: #0B9BE3;

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
            top: 0.4rem;
            padding: .1rem 5%;
            box-sizing: border-box;
            left: 50%;
            transform: translateX(-50%);
            background: #fff;
            border-bottom: 1px solid #eee;

            .el-date-editor.el-input, .el-date-editor.el-input__inner {
                width: 100% !important;
            }

            .submitBtn {
                display: block;
                margin: 0 auto;
                border: 1px solid #eee;
                color: #333333;
                border-radius: .05rem;
            }
        }
    }
</style>