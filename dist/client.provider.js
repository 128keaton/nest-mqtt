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
            client.on('connect', () => {
                logger.log('MQTT: Connected', 'MQTT');
            });
            client.on('disconnect', packet => {
                logger.log('MQTT: Disconnected', 'MQTT');
            });
            client.on('error', error => {
                logger.error(error);
            });
            client.on('reconnect', () => {
                logger.log('MQTT: Reconnecting', 'MQTT');
            });
            client.on('close', error => {
                logger.log('MQTT: Connection Closed', 'MQTT');
                logger.error(error);
            });
            client.on('offline', () => {
                logger.log('MQTT: Connection Offline', 'MQTT');
            });
            return client;
        },
        inject: [mqtt_constants_1.MQTT_OPTION_PROVIDER, mqtt_constants_1.MQTT_LOGGER_PROVIDER],
    };
}
exports.createClientProvider = createClientProvider;
//# sourceMappingURL=client.provider.js.map