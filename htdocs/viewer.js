   "use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) {if (window.CP.shouldStopExecution(1)){break;}if (b.hasOwnProperty(p)) d[p] = b[p];
window.CP.exitedLoop(1);
}
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var data = [
    {
        src: 'https://unsplash.it/800/300?image=1',
        title: 'title',
        content: 'content'
    },
    {
        src: 'https://unsplash.it/800/1300?image=22',
        title: 'title',
        content: 'content'
    },
    {
        src: 'https://unsplash.it/1800/1300?image=13',
        title: 'title',
        content: 'content'
    },
    {
        src: 'https://unsplash.it/800/600?image=8',
        title: 'title',
        content: 'content'
    },
    {
        src: 'https://unsplash.it/200/300?image=15',
        title: 'title',
        content: 'content'
    },
    {
        src: 'https://unsplash.it/800/300?image=6',
        title: 'title',
        content: 'content'
    },
    {
        src: 'https://unsplash.it/800/300?image=1',
        title: 'title',
        content: 'content'
    },
    {
        src: 'https://unsplash.it/800/1300?image=22',
        title: 'title',
        content: 'content'
    },
    {
        src: 'https://unsplash.it/1800/1300?image=13',
        title: 'title',
        content: 'content'
    },
    {
        src: 'https://unsplash.it/800/600?image=8',
        title: 'title',
        content: 'content'
    },
    {
        src: 'https://unsplash.it/200/300?image=15',
        title: 'title',
        content: 'content'
    },
    {
        src: 'https://unsplash.it/800/300?image=6',
        title: 'title',
        content: 'content'
    }
];
// ------------
var Component = React.Component, PropTypes = React.PropTypes;
var ZOOM_LEVEL = {
    MIN: 0,
    MAX: 4
};
var VISIBLE_INDICATORS_COUNT = 8;
var KEY_CODE = {
    LEFT: 37,
    RIGTH: 39
};
var OFFSET_DEFAULT = {
    x: 0,
    y: 0
};
var ImageWrapper = (function (_super) {
    __extends(ImageWrapper, _super);
    function ImageWrapper(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = {
            loading: false,
            onload: false,
            zoom: 0,
            offset: OFFSET_DEFAULT
        };
        _this.draggable = false;
        _this.offsetRange = OFFSET_DEFAULT;
        _this.clientOffset = {
            x: undefined,
            y: undefined
        };
        return _this;
    }
    ImageWrapper.prototype.loadImage = function (src) {
        var _this = this;
        this.state.loading = true;
        this.setState(this.state);
        this.src = new Image();
        this.src.src = src;
        this.src.onload = function () {
            if (!_this.src)
                return;
            _this.state.loading = false;
            _this.state.onload = true;
            _this.setState(_this.state);
        };
        this.src.onerror = function () {
            if (!_this.src)
                return;
            _this.state.loading = false;
            _this.state.onload = false;
            _this.setState(_this.state);
        };
    };
    ImageWrapper.prototype.resetOffset = function () {
        this.state.offset = OFFSET_DEFAULT;
        this.setState(this.state);
    };
    ImageWrapper.prototype.setOffsetRange = function () {
        var zoom = this.state.zoom;
        var dx = this.image.scrollWidth * (1 + zoom / 2) - this.imageOuter.clientWidth;
        var dy = this.image.scrollHeight * (1 + zoom / 2) - this.imageOuter.clientHeight;
        this.offsetRange = {
            x: Math.max(0, dx / 2),
            y: Math.max(0, dy / 2)
        };
    };
    ImageWrapper.prototype.zoomIn = function () {
        if (!this.state.onload)
            return;
        this.state.zoom = Math.min(this.state.zoom + 1, ZOOM_LEVEL.MAX);
        this.setState(this.state);
        this.setOffsetRange();
    };
    ImageWrapper.prototype.zoomOut = function () {
        if (!this.state.onload)
            return;
        this.state.zoom = Math.max(0, this.state.zoom - 1);
        this.setState(this.state);
        this.resetOffset();
        this.setOffsetRange();
    };
    ImageWrapper.prototype.onMoveStart = function (e) {
        if (!this.offsetRange.x && !this.offsetRange.y) {
            return;
        }
        this.clientOffset = {
            x: e.clientX,
            y: e.clientY
        };
        this.draggable = true;
    };
    ImageWrapper.prototype.onMove = function (e) {
        if (!e.clientX && !e.clientY || !this.draggable) {
            return;
        }
        var offset = {
            x: e.clientX - this.clientOffset.x,
            y: e.clientY - this.clientOffset.y
        };
        this.clientOffset = {
            x: e.clientX,
            y: e.clientY
        };
        this.state.offset = {
            x: this.state.offset.x + offset.x,
            y: this.state.offset.y + offset.y
        };
        this.setState(this.state);
    };
    ImageWrapper.prototype.onMoveEnd = function (e) {
        if (!this.mounted)
            return;
        this.draggable = false;
        var offset = {
            x: Math.abs(this.state.offset.x),
            y: Math.abs(this.state.offset.y)
        };
        if (Math.abs(this.state.offset.x) >= this.offsetRange.x) {
            this.state.offset.x = this.state.offset.x < 0 ? Math.min(0, -(this.offsetRange.x)) : Math.max(0, this.offsetRange.x);
            this.setState(this.state);
        }
        if (Math.abs(this.state.offset.y) >= this.offsetRange.y) {
            this.state.offset.y = this.state.offset.y < 0 ? Math.min(0, -(this.offsetRange.y)) : Math.max(0, this.offsetRange.y);
            this.setState(this.state);
        }
    };
    ImageWrapper.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.props.image.src != nextProps.image.src) {
            this.resetOffset();
            this.loadImage(nextProps.image.src);
            this.setState({
                zoom: 0
            });
        }
    };
    ImageWrapper.prototype.componentDidMount = function () {
        this.mounted = true;
        this.loadImage(this.props.image.src);
        window.addEventListener('resize', this.setOffsetRange.bind(this));
        document.documentElement.addEventListener("mouseup", this.onMoveEnd.bind(this));
    };
    ImageWrapper.prototype.componentWillUnmount = function () {
        this.mounted = false;
        if (!!this.src) {
            this.src = undefined;
        }
        window.removeEventListener('resize', this.setOffsetRange.bind(this));
        document.documentElement.removeEventListener("mouseup", this.onMoveEnd.bind(this));
    };
    ImageWrapper.prototype.render = function () {
        var _this = this;
        var _a = this.props, image = _a.image, index = _a.index, showIndex = _a.showIndex;
        var _b = this.state, offset = _b.offset, zoom = _b.zoom, loading = _b.loading;
        var value = "translate3d(" + offset.x + "px, " + offset.y + "px, 0px)";
        var imageCls = "zoom-" + zoom + " image-outer " + (this.draggable ? 'dragging' : '');
        var caption = (React.createElement("p", { className: "caption" },
            image.title ? React.createElement("span", { className: "title" }, image.title) : null,
            image.title && image.content ? React.createElement("span", null, " - ") : null,
            image.title ? React.createElement("span", { className: "content" }, image.content) : null));
        return (React.createElement("div", { className: "image-wrapper" },
            React.createElement("div", { style: { transform: value }, ref: function (component) { return _this.imageOuter = component; }, className: imageCls }, loading ? (React.createElement("div", { className: "spinner" },
                React.createElement("div", { className: "bounce" }))) : React.createElement("img", { className: "image", ref: function (component) { return _this.image = component; }, src: image.src, alt: image.title || '', draggable: false, onDragStart: function (e) { return e.preventDefault(); }, onMouseMove: this.onMove.bind(this), onMouseDown: this.onMoveStart.bind(this), onMouseUp: this.onMoveEnd.bind(this) })),
            React.createElement("div", { className: "tool-bar" },
                showIndex && React.createElement("div", { className: "index-indicator" }, index),
                caption,
                React.createElement("div", { className: "button-group" },
                    React.createElement("div", { className: "zoom-out button", onClick: this.zoomOut.bind(this) }),
                    React.createElement("div", { className: "zoom-in button", onClick: this.zoomIn.bind(this) })))));
    };
    return ImageWrapper;
}(Component));
var ImageViewer = (function (_super) {
    __extends(ImageViewer, _super);
    function ImageViewer(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            activeIndex: _this.props.activeIndex
        };
        return _this;
    }
    ImageViewer.prototype.renderIndicators = function (list) {
        var _this = this;
        var activeIndex = this.state.activeIndex;
        var ret = Math.round(VISIBLE_INDICATORS_COUNT / 2);
        var length = list.length;
        return list.map(function (item, index) {
            var isActive = activeIndex === index;
            var itemInvisible = length > VISIBLE_INDICATORS_COUNT && (index < Math.min(length - VISIBLE_INDICATORS_COUNT - 1, activeIndex - ret) || index > Math.max(activeIndex + ret, VISIBLE_INDICATORS_COUNT));
            var itemCls = "indicators-item " + (isActive ? 'active' : '') + " " + (itemInvisible ? 'invisible' : '') + " " + (_this.props.showPreview ? 'preview' : '');
            return (React.createElement("div", { key: index, className: itemCls, onClick: _this.itemControl.bind(_this, index) }, _this.props.showPreview && (React.createElement("div", { className: "image", style: { background: "url(" + item.src + ")" } }))));
        });
    };
    ImageViewer.prototype.onPrev = function () {
        var index = (this.state.activeIndex + this.props.images.length - 1) % this.props.images.length;
        this.itemControl(index);
    };
    ImageViewer.prototype.onNext = function () {
        var index = (this.state.activeIndex + 1) % this.props.images.length;
        this.itemControl(index);
    };
    ImageViewer.prototype.itemControl = function (index) {
        if (index === this.state.activeIndex)
            return;
        this.state.activeIndex = index;
        this.setState(this.state);
    };
    ImageViewer.prototype.onKeyDown = function (e) {
        if (!this.mounted)
            return;
        e.stopPropagation();
        switch (e.which || e.keyCode) {
            case KEY_CODE.LEFT:
                this.onPrev();
                break;
            case KEY_CODE.RIGTH:
                this.onNext();
                break;
        }
    };
    ImageViewer.prototype.componentDidMount = function () {
        this.mounted = true;
        document.documentElement.addEventListener("keydown", this.onKeyDown.bind(this));
    };
    ImageViewer.prototype.componentWillUnmount = function () {
        this.mounted = false;
        document.documentElement.removeEventListener("keydown", this.onKeyDown.bind(this));
    };
    ImageViewer.prototype.render = function () {
        var _this = this;
        var _a = this.props, images = _a.images, showIndex = _a.showIndex, prefixCls = _a.prefixCls;
        var activeIndex = this.state.activeIndex;
        var indicatorVisible = images.length > 1;
        return (React.createElement("div", { className: "react-image-viewer " + prefixCls + "-image-viewer", ref: function (component) { return _this.container = component; } },
            React.createElement(ImageWrapper, { showIndex: showIndex, index: activeIndex + 1 + "/" + images.length, image: images[activeIndex] }),
            indicatorVisible ?
                React.createElement("div", { className: "direction-control-button" },
                    React.createElement("div", { className: "prev-button button", onClick: this.onPrev.bind(this) },
                        React.createElement("div", { className: "bar" })),
                    React.createElement("div", { className: "next-button button", onClick: this.onNext.bind(this) },
                        React.createElement("div", { className: "bar" })),
                    React.createElement("div", { className: "indicators" }, indicatorVisible && this.renderIndicators(images)))
                : null));
    };
    return ImageViewer;
}(Component));
ImageViewer.defaultProps = {
    prefixCls: 'react-image-viewer',
    className: '',
    showIndex: true,
    showPreview: true,
    activeIndex: 0
};
ImageViewer.propTypes = {
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    showIndex: PropTypes.bool,
    showPreview: PropTypes.bool,
    activeIndex: PropTypes.number
};
var Modal = (function (_super) {
    __extends(Modal, _super);
    function Modal(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            visible: false,
            activeIndex: undefined
        };
        return _this;
    }
    Modal.prototype.open = function (activeIndex) {
        this.setState({
            visible: true,
            activeIndex: activeIndex || 0
        });
    };
    Modal.prototype.close = function () {
        this.setState({
            visible: false,
            activeIndex: undefined
        });
    };
    Modal.prototype.render = function () {
        var _a = this.props, images = _a.images, prefixCls = _a.prefixCls, className = _a.className, showIndex = _a.showIndex, showPreview = _a.showPreview;
        var activeIndex = this.state.activeIndex;
        return this.state.visible ? (React.createElement("div", { className: 'modal' },
            React.createElement(ImageViewer, { showPreview: showPreview, showIndex: showIndex, prefixCls: prefixCls, activeIndex: activeIndex, images: images }),
            React.createElement("div", { className: 'close-button', onClick: this.close.bind(this) }))) : null;
    };
    return Modal;
}(Component));
var Root = (function (_super) {
    __extends(Root, _super);
    function Root() {
        return _super.apply(this, arguments) || this;
    }
    Root.prototype.render = function () {
        var _this = this;
        var images = this.props.images;
        return (React.createElement("div", { className: "image-gallery" },
            images.map(function (item, index) { return (React.createElement("div", { className: "image-item", key: index, onClick: _this.open.bind(_this, index) },
                React.createElement("div", { className: "image-inner", style: { background: "url(" + item.src + ")" } }))); }),
            React.createElement(Modal, { images: images, showIndex: true, showPreview: true, ref: function (component) { return _this.modal = component; } })));
    };
    Root.prototype.open = function (index) {
        this.modal.open(index);
    };
    return Root;
}(Component));
ReactDOM.render(React.createElement(Root, { images: data }), document.getElementById('root'));
  //# sourceURL=pen.js