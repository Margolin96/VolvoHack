const state = {
  engineStarted: false,
  outsideTemprature: 22,
  locked: false,
  climatization: false,
  doorsOpened: false,
  hasWarnings: false,
};

setInterval(() => {
  state.outsideTemprature += Math.ceil(Math.random() * 10 - 5);
  state.doorsOpened = Math.random() > 0.5;
  state.hasWarnings = Math.random() > 0.5;
}, 1000);

const { call: volvoCall } = require('./api');

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
exports.listAllVehicles = async () => await volvoCall('/v1/vehicles');
  // GET - https://api.volvocars.com/connected-vehicle/v1/vehicles
  // TODO API call
  // for each VIN — GET - https://api.volvocars.com/connected-vehicle/v1/vehicles/{vin}
  // return [
  //   {
  //     vin: 'test',
  //     name: 'XC60', // data.descriptions.model + ' ' + data.externalColour
  //   },
  // ];

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
  const fuelLevel = Math.random() * 100; // TODO API call
  return Math.floor((fuelLevel / pars.fuelTankCapacity) * 100);
};

/**
 * Get outside temperature for vehicle
 * @param {string} vin VIN
 * @returns {number} outside temperature in celcius
 */
exports.getOutsideTemperature = (vin) => {
  return state.outsideTemprature;
};

/**
 * Checks if climatization system ON or not
 * @param {string} vin VIN
 * @returns {boolean} true if climatization on
 */
exports.isClimatizationOn = (vin) => {
  return state.climatization;
};

/**
 * Turns climatization system ON
 * @param {string} vin VIN
 * @returns {void} nothing
 */
exports.turnOnClimatization = (vin) => {
  state.climatization = true;
  return true;
};

/**
 * Turns climatization system OFF
 * @param {string} vin VIN
 * @returns {void} nothing
 */
exports.turnOffClimatization = (vin) => {
  state.climatization = false;
  return true;
};

/**
 * Checks if central lock is locked or not
 * @param {string} vin VIN
 * @returns {boolean} true if locked
 */
exports.isVehicleLocked = (vin) => {
  return state.locked;
};

/**
 * Checks if headlights is ON or not
 * @param {string} vin VIN
 * @returns {boolean} true if ON
 */
exports.isFlashOn = (vin) => {
  return state.flash;
};

/**
 * Send a lock command to the vehicle
 * @param {string} vin VIN
 * @returns {void} nothing
 */
exports.lockVehicle = (vin) => {
  state.locked = true;
  return true;
};

/**
 * Send an unlock command to the vehicle
 * @param {string} vin VIN
 * @returns {void} nothing
 */
exports.unlockVehicle = (vin) => {
  state.locked = false;
  return true;
};

/**
 * Checks if engine is started or not
 * @param {string} vin VIN
 * @returns {boolean} true if started
 */
exports.isEngineStarted = (vin) => {
  return state.engineStarted;
};

/**
 * Starts vehicle's engine
 * @param {string} vin VIN
 * @returns {void} nothing
 */
exports.startEngine = (vin) => {
  state.engineStarted = true;
  return true;
};

/**
 * Stops vehicle's engine
 * @param {string} vin VIN
 * @returns {void} nothing
 */
exports.stopEngine = (vin) => {
  state.engineStarted = false;
  return true;
};

/**
 * Send a honk and flash command to the vehicle
 * @param {string} vin VIN
 * @returns {void} nothing
 */
exports.honkAndFlash = (vin) => {
  // TODO: on/off/on/off/on/off flash
  return true;
};

/**
 * Checks whether any of doors or windows is open
 * @param {string} vin VIN
 * @returns {boolean} true if open
 */
exports.isAnyDoorOrWindowOpen = (vin) => {
  return state.doorsOpened;
};

/**
 * Checks if there are any warnings requiring human involvement: danger tyre status,
 * engine coolant, oil pressure, bulb failure etc
 * @param {string} vin VIN
 * @returns {boolean} true if there is any warning
 */
exports.isAnyWarning = (vin) => {
  return state.hasWarnings;
};
