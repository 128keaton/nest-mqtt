"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClientProvider = void 0;
const mqtt_1 = require("mqtt");
const mqtt_constants_1 = require("./mqtt.constants");
function createClientProvider() {
    return {
        provide: mqtt_constants_1.MQTT_CLIENT_INSTANCE,
        useFactory: (options, logger) => {
            const client = (0, mqtt_1.connect)(options);
            const log = (message, error = false) => {
                if (options.logger && options.logger.useBuiltinLogging === false) {
                    return;
                }
                if (error) {
                    return logger.error(message);
                }
                logger.log(message);
            };
            client.on('connect', () => {
                log('MQTT: Connected');
            });
            client.on('disconnect', _ => {
                log('MQTT: Disconnected');
            });
            client.on('error', error => {
                log(error, true);
                setTimeout(() => {
                    if (!client.connected) {
                        client.reconnect();
                    }
                }, options.reconnectPeriod || 1000);
            });
            client.on('reconnect', () => {
                log('MQTT: Reconnecting');
            });
            client.on('close', error => {
                log('MQTT: Connection Closed');
                log(error, true);
                setTimeout(() => {
                    if (!client.connected) {
                        client.reconnect();
                    }
                }, options.reconnectPeriod || 1000);
            });
            client.on('offline', () => {
                log('MQTT: Connection Offline');
                setTimeout(() => {
                    if (!client.connected) {
                        client.reconnect();
                    }
                }, options.reconnectPeriod || 1000);
            });
            return client;
        },
        inject: [mqtt_constants_1.MQTT_OPTION_PROVIDER, mqtt_constants_1.MQTT_LOGGER_PROVIDER],
    };
}
exports.createClientProvider = createClientProvider;
//# sourceMappingURL=client.provider.js.map