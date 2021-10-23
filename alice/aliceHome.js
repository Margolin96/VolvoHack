const devicesInfo = require('./devicesInfo');
const devicesState = require('./devicesState');
const volvoApi = require('../volvo/volvoApi');

/**
 * Get all devices info
 * @param {string} requestId request identifier
 * @param {string} userId user identifier
 * @returns {object} devices object in Yandex format
 */
exports.getDevicesList = (requestId, userId) => {
  const vehicles = volvoApi.listAllVehicles();
  const devices = vehicles
    .map(vehicle => devicesInfo.getVehicleDevices(vehicle.vin, vehicle.name))
    .flat();

  return {
    request_id: requestId,
    payload: {
      user_id: userId,
      devices,
    },
  };
};

/**
 * Get state for each requested device
 * @param {string} requestId request identifier
 * @param {json} data request data
 * @returns {object} states object in Yandex format
 */
exports.getDevicesState = (requestId, data) => {
  const deviceIds = data.devices.map(d => d.id);
  const states = devicesState.getAllDevicesState(deviceIds);
  return {
    request_id: requestId,
    payload: {
      devices: states,
    },
  };
};

const setOnOffDeviceState = (deviceId, value) => {
  const [vin, deviceType] = deviceId.split('_');
  switch (deviceType) {
    case 'climatization':
      if (value) volvoApi.turnOnClimatization(vin);
      else volvoApi.turnOffClimatization(vin);
      break;
    case 'engine':
      if (value) volvoApi.startEngine(vin);
      else volvoApi.stopEngine(vin);
      break;
    case 'lock':
      if (value) volvoApi.lockVehicle(vin);
      else volvoApi.unlockVehicle(vin);
      break;
    case 'flash':
      if (value) volvoApi.honkAndFlash(vin);
      // no turn off functionality
      break;
    default:
      throw new Error(`Unknown device type: ${deviceType}`);
  }

  return {
    id: deviceId,
    capabilities: [
      {
        type: 'devices.capabilities.on_off',
        state: {
          instance: 'on',
          action_result: {
            status: 'DONE',
          },
        },
      },
    ],
  };
};

const findOnOffCapability = (deviceData) => {
  const onOffCapability = deviceData.capabilities
      .find(c => c.type === 'devices.capabilities.on_off');

  if (onOffCapability) {
    return { id: deviceData.id, value: onOffCapability.state.value };
  }

  return null;
};

/**
 * Set new devices states
 * @param {string} requestId request identifier
 * @param {json} data request data
 * @returns {json} new state results object in Yandex format
 */
exports.setOnOffDevicesStates = (requestId, data) => {
  const newDeviceStates = data.payload.devices
    .map(d => findOnOffCapability(d))
    .filter(d => !!d);

  const setStateResults = newDeviceStates.map(d => setOnOffDeviceState(d.id, d.value));
  return {
    request_id: requestId,
    payload: {
      devices: setStateResults,
    },
  };
};
