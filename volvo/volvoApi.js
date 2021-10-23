let token = '';
let apiKey = '';
let endpoint = '';
let inited = false;

/**
 * Initialize Volvo API client
 * @returns {void} nothing
 */
exports.init = () => {
  if (inited) return;

  token = process.env.VOLVO_API_TOKEN;
  if (!token) throw new Error('VOLVO_API_TOKEN environment variable is not specified.');

  apiKey = process.env.VOLVO_API_KEY;
  if (!apiKey) throw new Error('VOLVO_API_KEY environment variable is not specified.');

  endpoint = process.env.VOLVO_API_ENDPOINT;
  if (!endpoint) throw new Error('VOLVO_API_ENDPOINT environment variable is not specified.');

  inited = true;
};

/**
 * Get all vehicles for current user, single user supported for demo
 * @returns {{vin: string, name: string}[]} vehicles list
 */
exports.listAllVehicles = () => {
  // GET - https://api.volvocars.com/connected-vehicle/v1/vehicles
  // TODO API call
  // for each VIN — GET - https://api.volvocars.com/connected-vehicle/v1/vehicles/{vin}
  return [
    {
      vin: 'test',
      name: 'XC60', // data.descriptions.model + ' ' + data.externalColour
    },
  ];
};

/**
 * Get vehicle parameters object
 * @param {string} vin VIN
 * @returns {{fuelTankCapacity: number}} parameters object
 */
const getVehicleParameters = vin => ({
  // not presented in API right now, returns stab
  fuelTankCapacity: 150,
});

/**
 * Get fuel level in percent from full one
 * @param {string} vin VIN
 * @returns {number} fuel level percent 0-100
 */
exports.getFuelPercent = (vin) => {
  const pars = getVehicleParameters(vin);
  const fuelLevel = 0; // TODO API call
  return Math.floor((fuelLevel / pars.fuelTankCapacity) * 100);
};

/**
 * Get outside temperature for vehicle
 * @param {string} vin VIN
 * @returns {number} outside temperature in celcius
 */
exports.getOutsideTemperature = (vin) => {
  throw new Error('Not implemented'); // TODO API call
};

/**
 * Checks if climatization system ON or not
 * @param {string} vin VIN
 * @returns {boolean} true if climatization on
 */
exports.isClimatizationOn = (vin) => {
  throw new Error('Not implemented'); // TODO API call
};

/**
 * Turns climatization system ON
 * @param {string} vin VIN
 * @returns {void} nothing
 */
exports.turnOnClimatization = (vin) => {
  throw new Error('Not implemented'); // TODO API call
};

/**
 * Turns climatization system OFF
 * @param {string} vin VIN
 * @returns {void} nothing
 */
exports.turnOffClimatization = (vin) => {
  throw new Error('Not implemented'); // TODO API call
};

/**
 * Checks if central lock is locked or not
 * @param {string} vin VIN
 * @returns {boolean} true if locked
 */
exports.isVehicleLocked = (vin) => {
  throw new Error('Not implemented'); // TODO API call
};

/**
 * Send a lock command to the vehicle
 * @param {string} vin VIN
 * @returns {void} nothing
 */
exports.lockVehicle = (vin) => {
  throw new Error('Not implemented'); // TODO API call
};

/**
 * Send an unlock command to the vehicle
 * @param {string} vin VIN
 * @returns {void} nothing
 */
exports.unlockVehicle = (vin) => {
  throw new Error('Not implemented'); // TODO API call
};

/**
 * Checks if engine is started or not
 * @param {string} vin VIN
 * @returns {boolean} true if started
 */
exports.isEngineStarted = (vin) => {
  throw new Error('Not implemented'); // TODO API call
};

/**
 * Starts vehicle's engine
 * @param {string} vin VIN
 * @returns {void} nothing
 */
exports.startEngine = (vin) => {
  throw new Error('Not implemented'); // TODO API call
};

/**
 * Stops vehicle's engine
 * @param {string} vin VIN
 * @returns {void} nothing
 */
exports.stopEngine = (vin) => {
  throw new Error('Not implemented'); // TODO API call
};

/**
 * Send a honk and flash command to the vehicle
 * @param {string} vin VIN
 * @returns {void} nothing
 */
exports.honkAndFlash = (vin) => {
  throw new Error('Not implemented'); // TODO API call
};

/**
 * Checks whether any of doors or windows is open
 * @param {string} vin VIN
 * @returns {boolean} true if open
 */
exports.isAnyDoorOrWindowOpen = (vin) => {
  throw new Error('Not implemented'); // TODO API call
};

/**
 * Checks if there are any warnings requiring human involvement: danger tyre status,
 * engine coolant, oil pressure, bulb failure etc
 * @param {string} vin VIN
 * @returns {boolean} true if there is any warning
 */
exports.isAnyWarning = (vin) => {
  throw new Error('Not implemented'); // TODO API call
};
