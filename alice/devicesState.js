const api = require('../volvo/volvoApi');

const getClimatizationState = async (vin) => {
  const isClimatizationOn = await api.isClimatizationOn(vin);
  const outsideTemperature = await api.getOutsideTemperature(vin);
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

const getEngineState = async (vin) => {
  const isEngineOn = await api.isEngineStarted(vin);
  const fuelLevelPercent = await api.getFuelPercent(vin);
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

const getCentralLockState = async (vin) => {
  const isVehicleLocked = await api.isVehicleLocked(vin);
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

const getFlashState = async (vin) => {
  const isFlashOn = await api.isFlashOn(vin);
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

const getDeviceState = async (deviceId) => {
  const [vin, deviceType] = deviceId.split('_');
  switch (deviceType) {
    case 'climatization':
      return await getClimatizationState(vin);
    case 'engine':
      return await getEngineState(vin);
    case 'lock':
      return await getCentralLockState(vin);
    case 'flash':
      return await getFlashState(vin);
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
