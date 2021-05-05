/*
 * @Descripttion: 
 * @Author: yizheng.yuan
 * @Date: 2021-04-28 18:45:46
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2021-04-28 18:45:48
 */
// 移动端自适应代码

! function(e) {
    var t = e.document,
        n = t.documentElement,
        i = e.devicePixelRatio || 1,
        a = "orientationchange" in e ? "orientationchange" : "resize",
        d = function() {
            var e = n.getBoundingClientRect().width || 360;
            (1 == i || e > 750) && (e = 750), n.style.fontSize = e / 7.5 + "px"
        };
    n.setAttribute("data-dpr", i), t.addEventListener && (e.addEventListener(a, d, !1), "complete" === t.readyState || t.addEventListener("DOMContentLoaded", function() { setTimeout(d) }, !1))
}(window)