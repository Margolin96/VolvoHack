const devicesInfo = require('./devicesInfo');
const devicesState = require('./devicesState');
const volvoApi = require('../volvo/volvoApi');

/**
 * Get all devices info
 * @param {string} requestId request identifier
 * @param {string} userId user identifier
 * @returns {object} devices object in Yandex format
 */
exports.getDevicesList = async (requestId, userId) => {
  const vehicles = await volvoApi.listAllVehicles();
  const devices = [];

  for (const vehicle of vehicles) {
    devices.push(await devicesInfo.getVehicleDevices(vehicle.vin, vehicle.name));
  }

  return {
    request_id: requestId,
    payload: {
      user_id: userId,
      devices: devices.flat(),
    },
  };
};

/**
 * Get state for each requested device
 * @param {string} requestId request identifier
 * @param {object} data request data
 * @returns {object} states object in Yandex format
 */
exports.getDevicesState = async (requestId, data) => {
  const deviceIds = data.devices.map(d => d.id);
  const states = await devicesState.getAllDevicesState(deviceIds);
  return {
    request_id: requestId,
    payload: {
      devices: states,
    },
  };
};

const setOnOffDeviceState = async (deviceId, value) => {
  const [vin, deviceType] = deviceId.split('_');
  switch (deviceType) {
    case 'climatization':
      if (value) await volvoApi.turnOnClimatization(vin);
      else await volvoApi.turnOffClimatization(vin);
      break;
    case 'engine':
      if (value) await volvoApi.startEngine(vin);
      else await volvoApi.stopEngine(vin);
      break;
    case 'lock':
      if (value) await volvoApi.lockVehicle(vin);
      else await volvoApi.unlockVehicle(vin);
      break;
    case 'flash':
      if (value) await volvoApi.honkAndFlash(vin);
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
 * @param {object} data request data
 * @returns {object} new state results object in Yandex format
 */
exports.setOnOffDevicesStates = async (requestId, data) => {
  const newDeviceStates = data.payload ? data.payload.devices : []
    .map(d => findOnOffCapability(d))
    .filter(d => !!d);

  const setStateResults = [];
  for (const d of newDeviceStates) {
    const cap = d.capabilities.find(v => v.type === 'devices.capabilities.on_off');
    if (cap) {
      setStateResults.push(await setOnOffDeviceState(d.id, cap.state.value));
    }
  }

  return {
    request_id: requestId,
    payload: {
      devices: setStateResults,
    },
  };
};
