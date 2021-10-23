const getClimatizationDevice = (vin, vehicleName) => ({
  id: `${vin}_climatization`,
  type: 'devices.types.thermostat',
  name: 'Климат-контроль в машине',
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

const getEngineDevice = (vin, vehicleName) => ({
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

const getCentralLockDevice = (vin, vehicleName) => ({
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

const getHonkAndFlashDevice = (vin, vehicleName) => ({
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

const getVehicleDevices = (vin, vehicleName) => [
  getEngineDevice(vin, vehicleName),
  getClimatizationDevice(vin, vehicleName),
  getCentralLockDevice(vin, vehicleName),
  getHonkAndFlashDevice(vin, vehicleName),
];
