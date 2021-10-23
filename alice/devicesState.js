const getClimatizationState = (vin) => {
  const isClimatizationOn = true; // TODO api call by VIN
  const outsideTemperature = 44; // TODO api call by VIN
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
  const isEngineOn = true; // TODO api call by VIN
  const fuelLevelPercent = 44; // TODO api call by VIN
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
  const isVehicleLocked = true; // TODO api call by VIN
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

const getDeviceState = (deviceId) => {
  const [vin, deviceType] = deviceId.split('_');
  switch (deviceType) {
    case 'climatization':
      return getClimatizationState(vin);
    case 'engine':
      return getEngineState(vin);
    case 'lock':
      return getCentralLockState(vin);
    default:
      throw new Error(`Unknown device type: ${deviceType}`);
  }
};
