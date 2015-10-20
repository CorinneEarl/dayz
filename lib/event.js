'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _dataEvent = require('./data/event');

var _dataEvent2 = _interopRequireDefault(_dataEvent);

var Event = (function (_React$Component) {
    _inherits(Event, _React$Component);

    function Event() {
        _classCallCheck(this, Event);

        _get(Object.getPrototypeOf(Event.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(Event, [{
        key: 'onClick',
        value: function onClick(ev) {
            if (!this.props.onClick) {
                return;
            }
            this.props.onClick(this.props.layout.event, ev.target);
            ev.stopPropagation();
        }
    }, {
        key: 'render',
        value: function render() {
            var _this = this;

            var classes = ['event', 'span-' + this.props.layout.span];
            if (this.props.layout.startsBefore) classes.push('is-continuation');
            if (this.props.layout.endsAfter) classes.push('is-continued');
            if (this.props.layout.stack) classes.push('stack-' + this.props.layout.stack);

            var range = this.props.layout.event.range();
            if (!this.props.layout.event.isMultiDay()) {
                classes.push('hour-' + range.start.hour());
                classes.push('duration-' + range.diff('hours'));
            }
            return _react2['default'].createElement(
                'div',
                { onClick: function (e) {
                        return _this.onClick(e);
                    },
                    key: this.props.layout.event.key,
                    className: classes.join(' ')
                },
                this.props.layout.event.render()
            );
        }
    }], [{
        key: 'propTypes',
        value: {
            layout: _react2['default'].PropTypes.object.isRequired,
            onClick: _react2['default'].PropTypes.func
        },
        enumerable: true
    }]);

    return Event;
})(_react2['default'].Component);

exports['default'] = Event;
module.exports = exports['default'];