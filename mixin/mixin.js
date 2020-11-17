let mixinOptions = {
    data() {
        return {baseUrl: 'http://192.168.1.22:7070'}
    },
    beforeCreate() {
        let vw = document.body.clientWidth,
            html = document.getElementsByTagName('html')[0];
        html.style.fontSize = (100 * vw / 375) + 'px'
    }
}
export default mixinOptions