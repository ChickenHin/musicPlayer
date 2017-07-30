// 跨浏览器事件处理
var EventUtil = {
	// 绑定事件
	addHandler: function(element, type, handler) {
        if(element.addEventListener) {
        	element.addEventListener(type, handler, false);
        } else if(element.attachEvent) {
        	element.attachEvent("on" + type, handler);
        } else {
        	element["on" + type] = handler;
        }
	},
	// 移出事件
	removeHandler: function(element, tyoe, handler) {
		if(element.removeEventListener) {
			element.removeEventListener(type, handler, false);
		} else if(element.detachEvent) {
			element.detachEvent("on" + type, handler);
		} else {
			element["on" + type] = null;
		}
	},
	// 取得事件对象
	getEvent: function(event) {
		return event ? event : window.event;
	},
	// 取得事件目标
	getTarget: function(event) {
        return event.target || event.srcElement;
	},
	// 取消事件的默认行为
	preventDefault: function(event) {
        if(event.preventDefault) {
        	event.preventDefault();
        } else {
        	event.returnValue = false;
        }
	},
	// 阻止事件冒泡
	stopPropagation: function(event) {
		if(event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancleBubble = true;
		}
	}
};