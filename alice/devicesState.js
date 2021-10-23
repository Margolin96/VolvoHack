const api = require('../volvo/volvoApi');

const getClimatizationState = (vin) => {
  const isClimatizationOn = api.isClimatizationOn(vin);
  const outsideTemperature = api.getOutsideTemperature(vin);
  return {
    id: `${vin}_climatization`,
    capabilities: [
      {
        type: 'devices.capabilities.on_off',
        state: {
          instance: 'on',
          value: isClimatizationOn,
        },
      },
    ],
    properties: [
      {
        type: 'devices.properties.float',
        state: {
          instance: 'temperature',
          value: outsideTemperature,
        },
      },
    ],
  };
};

const getEngineState = (vin) => {
  const isEngineOn = api.isEngineStarted(vin);
  const fuelLevelPercent = api.getFuelPercent(vin);
  return {
    id: `${vin}_engine`,
    capabilities: [
      {
        type: 'devices.capabilities.on_off',
        state: {
          instance: 'on',
          value: isEngineOn,
        },
      },
    ],
    properties: [
      {
        type: 'devices.properties.float',
        state: {
          instance: 'battery_level',
          value: fuelLevelPercent,
        },
      },
    ],
  };
};

const getCentralLockState = (vin) => {
  const isVehicleLocked = api.isVehicleLocked(vin);
  return {
    id: `${vin}_lock`,
    capabilities: [
      {
        type: 'devices.capabilities.on_off',
        state: {
          instance: 'on',
          value: isVehicleLocked,
        },
      },
    ],
  };
};

const getFlashState = (vin) => {
  const isFlashOn = api.isFlashOn(vin);
  return {
    id: `${vin}_flash`,
    capabilities: [
      {
        type: 'devices.capabilities.on_off',
        state: {
          instance: 'on',
          value: isFlashOn,
        },
      },
    ],
  };
};

const getDeviceState = (deviceId) => {
  const [vin, deviceType] = deviceId.split('_');
  switch (deviceType) {
    case 'climatization':
      return getClimatizationState(vin);
    case 'engine':
      return getEngineState(vin);
    case 'lock':
      return getCentralLockState(vin);
    case 'flash':
      return getFlashState(vin);
    default:
      throw new Error(`Unknown device type: ${deviceType}`);
  }
};

/**
 * Get current states for some devices
 * @param {string[]} deviceIds list of device ids
 * @returns {array} state objects array
 */
exports.getAllDevicesState = async (deviceIds) => {
  const devices = [];
  for (const id of deviceIds) {
    devices.push(await getDeviceState(id));
  }
  return devices;
};
