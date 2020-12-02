let mixinOptions = {
    data() {
        // return {baseUrl: 'http://fuzgxqmsp.cn'}
        return {baseUrl: 'http://192.168.7.166'}
    },
    beforeCreate() {
        let vw = document.body.clientWidth,
            html = document.getElementsByTagName('html')[0];
        html.style.fontSize = (100 * vw / 375) + 'px'
    }
}
export default mixinOptions
