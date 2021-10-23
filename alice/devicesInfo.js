const getClimatizationDevice = async (vin, vehicleName) => ({
  id: `${vin}_climatization`,
  type: 'devices.types.thermostat',
  name: 'Обогрев в машине',
  room: 'Машина',
  description: vehicleName,
  capabilities: [
    {
      type: 'devices.capabilities.on_off',
      retrievable: true,
      reportable: false,
      parameters: {
        split: false,
      },
    },
  ],
  properties: [
    {
      type: 'devices.properties.float',
      retrievable: true,
      reportable: false,
      parameters: {
        instance: 'temperature',
        unit: 'unit.temperature.celsius',
      },
    },
  ],
});

const getEngineDevice = async (vin, vehicleName) => ({
  id: `${vin}_engine`,
  type: 'devices.types.other',
  name: 'Машина',
  description: vehicleName,
  capabilities: [
    {
      type: 'devices.capabilities.on_off',
      retrievable: true,
      reportable: false,
      parameters: {
        split: false,
      },
    },
  ],
  properties: [
    {
      type: 'devices.properties.float',
      retrievable: true,
      reportable: false,
      parameters: {
        instance: 'battery_level',
        unit: 'unit.percent',
      },
    },
  ],
});

const getCentralLockDevice = async (vin, vehicleName) => ({
  id: `${vin}_lock`,
  type: 'devices.types.openable',
  name: 'Замок в машине',
  description: vehicleName,
  capabilities: [
    {
      type: 'devices.capabilities.on_off',
      retrievable: true,
      reportable: false,
      parameters: {
        split: false,
      },
    },
  ],
});

const getHonkAndFlashDevice = async (vin, vehicleName) => ({
  id: `${vin}_flash`,
  type: 'devices.types.light',
  name: 'Фары и сигнал машине',
  description: vehicleName,
  capabilities: [
    {
      type: 'devices.capabilities.on_off',
      retrievable: false,
      reportable: false,
      parameters: {
        split: true,
      },
    },
  ],
});

/**
 * Get all smart home virtual devices for specific vehicle
 * @param {string} vin VIN
 * @param {string} vehicleName vehicle name
 * @returns {array} all device objects list
 */
exports.getVehicleDevices = async (vin, vehicleName) => [
  await getEngineDevice(vin, vehicleName),
  await getClimatizationDevice(vin, vehicleName),
  await getCentralLockDevice(vin, vehicleName),
  await getHonkAndFlashDevice(vin, vehicleName),
];
