/**
 * Created by px on 2017/3/28.
 */
var Scroll = (function (win, doc, $) {
    var CusScrollBar = function () {}
    $.extend(CusScrollBar.prototype, {
        init : function (options) {
            var self = this;
            self.options = {
                scrollDir : "y",
                contSelector : "",
                barSelector : "",
                sliderSelector : ""
            }
            $.extend(true, self.options, options || {});
            self.initDomEvent().sliderTo();
        },
        initDomEvent : function () {
            var opts = this.options;
            this.$cont = $(opts.contSelector);
            this.$slider = $(opts.sliderSelector);
            this.$bar = opts.barSelector ? $(opts.barSelector) : self.$slider.parent();
            this.$doc = $(doc);
            this.initSliderDragEVent();
            return this;
        },
        initSliderDragEVent : function () {
            var self = this,
                bar = self.$bar,
                slider = self.$slider,
                sliderEl = slider[0];
            slider.height(bar.height() * bar.height() / self.$cont[0].scrollHeight);
            if (sliderEl){
                var doc = this.$doc,
                dragStartPagePosition,
                dragStartScrollPosition,
                dragContBarRate;
                slider.on("mousedown", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    dragStartPagePosition = e.pageY;
                    dragStartScrollPosition = self.$cont.eq(0).scrollTop();
                    dragContBarRate = self.getMaxScrollPosition() / self.getMaxSliderPosition();
                    doc.on({
                        "mousemove.scroll" : mousemoveHandler,
                        "mouseup.scroll" : function (e) {
                            doc.off(".scroll");
                        }
                    })
                })
                function mousemoveHandler(e) {
                    e.preventDefault();
                    if (dragStartPagePosition == null){
                        return;
                    }
                    self.scrollTo(dragStartScrollPosition + (e.pageY - dragStartPagePosition) * dragContBarRate);
                }
            }
            if (bar){
                var dragStartScrollPosition,
                    sliderCenter,
                    dragContBarRate;
                bar.on({
                    mousedown : function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        dragStartScrollPosition = self.$cont.eq(0).scrollTop();
                        sliderCenter = slider.offset().top + slider.height() * 0.5;
                        dragContBarRate = self.getMaxScrollPosition() / self.getMaxSliderPosition();
                        self.scrollTransition(dragStartScrollPosition + (e.pageY - sliderCenter) * dragContBarRate)
                    }
                })
            }
        },
        getMaxScrollPosition : function () {
            var self = this;
            return Math.max(self.$cont.height(), self.$cont[0].scrollHeight) - self.$cont.height();
        },
        getMaxSliderPosition : function () {
            var self = this;
            return self.$bar.height() - self.$slider.height();
        },
        scrollTo : function (positionVal) {
            var self = this;
            self.$cont.scrollTop(positionVal);
        },
        scrollTransition : function (topVal) {
            var self = this;
            self.$cont.stop().animate({scrollTop : topVal}, 400);
        },
        getSliderPosition : function () {
            var self = this,
                maxSliderPosition = self.getMaxSliderPosition();
            return Math.min(maxSliderPosition, maxSliderPosition * self.$cont[0].scrollTop / self.getMaxScrollPosition())
            // self.$slider.css(top, topVal + "px");
        },
        sliderTo : function () {
            var self = this,
                slider = self.$slider,
                startTime = new Date();
            self.$cont.on({
                scroll : function () {
                    var currentTime = new Date();
                    if (currentTime - startTime >= 16){
                        slider.css("top", self.getSliderPosition() + "px");
                        startTime = currentTime;
                    }
                }
            })
        },
        resize : function () {
            var self = this,
                bar = self.$bar,
                slider = self.$slider;
            $(win).on({
                resize : function () {
                    slider.height(bar.height() * bar.height() / self.$cont[0].scrollHeight);
                }
            })
        }
    })
    var init = function (op) {
        new CusScrollBar().init(op);
    }
    return {
        CusScrollBar : init
    }
})(window, document, jQuery);
Scroll.CusScrollBar({
    contSelector : ".scroll_cont",
    barSelector : ".scroll_bar",
    sliderSelector : ".scroll_slider"
})



















































