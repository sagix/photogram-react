export default class {
    constructor(min, max){
        this.min = min
        this.max = max
    }

    apply(node){
        node.style.fontSize = this.max + 'rem';
        if (this._hasOverflow(node.parentNode)) {
            node.style.fontSize = this.min + 'rem';
            if (!this._hasOverflow(node.parentNode)) {
                this._recApplyFontSize(node, this.min, this.max);
            }
        }
    }

    _recApplyFontSize(node, minSize, maxSize) {
        var halfSize = minSize + (maxSize - minSize) / 2;
        node.style.fontSize = halfSize + 'rem';
        if (this._hasOverflow(node.parentNode)) {
            this._recApplyFontSize(node, minSize, halfSize);
        } else {
            if (maxSize - minSize > .05) {
                this._recApplyFontSize(node, halfSize, maxSize);
            }
        }
    }

    _hasOverflow(node) {
        return node.scrollHeight > node.clientHeight;
    }
}
