"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const _eventEmitter = new react_native_1.NativeEventEmitter(react_native_1.NativeModules.RNShakeEvent);
exports.default = {
    addListener: (callback) => {
        const _subscription = _eventEmitter.addListener('ShakeEvent', () => {
            callback?.();
        });
        return _subscription;
    },
    removeAllListeners: () => _eventEmitter.removeAllListeners('ShakeEvent'),
    removeCurrentListener: () => _eventEmitter.removeCurrentListener(),
};
//# sourceMappingURL=index.js.map