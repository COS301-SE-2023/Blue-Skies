
window.scrollUtils = {
    getCurrentScrollPosition: function(dotnetHelper) {
        window.onscroll = function () {
            var scrollY = window.scrollY;
            dotnetHelper.invokeMethodAsync('UpdateScrollPosition', scrollY);
        };
    }
};
