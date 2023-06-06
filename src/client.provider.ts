import { Provider, Logger } from '@nestjs/common';
import { connect } from 'mqtt';
import { MqttModuleOptions } from './mqtt.interface';
import { MQTT_CLIENT_INSTANCE, MQTT_OPTION_PROVIDER, MQTT_LOGGER_PROVIDER } from './mqtt.constants';

export function createClientProvider(): Provider {
  return {
    provide: MQTT_CLIENT_INSTANCE,
    useFactory: (options: MqttModuleOptions, logger: Logger) => {
      const client = connect(options);

      client.on('connect', () => {
        logger.log('MQTT: Connected', 'MQTT');
        // console.log(packet);
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
    inject: [MQTT_OPTION_PROVIDER, MQTT_LOGGER_PROVIDER],
  };
}
