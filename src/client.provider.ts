import { Provider, Logger } from '@nestjs/common';
import { connect } from 'mqtt';
import { MqttModuleOptions } from './mqtt.interface';
import { MQTT_CLIENT_INSTANCE, MQTT_OPTION_PROVIDER, MQTT_LOGGER_PROVIDER } from './mqtt.constants';

export function createClientProvider(): Provider {
  return {
    provide: MQTT_CLIENT_INSTANCE,
    useFactory: (options: MqttModuleOptions, logger: Logger) => {
      const client = connect(options);

      const log = (message: any, error: boolean = false) => {
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
    inject: [MQTT_OPTION_PROVIDER, MQTT_LOGGER_PROVIDER],
  };
}
