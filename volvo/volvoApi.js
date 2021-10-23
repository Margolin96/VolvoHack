require('dotenv').config();

const state = {
  flash: false,
  fuelLevel: 30,
  fuelTankCapacity: 50,
  engineStarted: false,
  outsideTemprature: 22,
  locked: false,
  climatization: false,
  windowsOpened: false,
  doorsOpened: false,
  warnings: {},
};
module.exports.state = state;

setInterval(() => {
  // Fake data changing
  state.doorsOpened = Math.random() > 0.5;
  state.warnings = Math.random() > 0.5 ? { warn: {} } : {};
}, 10000);
setInterval(() => {
  state.outsideTemprature += Math.ceil((Math.random() * 10 - 7) / 3);
  state.outsideTemprature = Math.max(30, state.outsideTemprature);
}, 5000);

const volvo = require('./api');

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
exports.listAllVehicles = async () => await volvo.get('/v1/vehicles');

/**
 * Get vehicle parameters object (Not presented in API)
 * @param {string} vin VIN
 * @returns {{fuelTankCapacity: number}} parameters object
 */
const getVehicleParameters = () => ({
  fuelTankCapacity: state.fuelTankCapacity,
});

/**
 * Get fuel level in percent from full one
 * @param {string} vin VIN
 * @returns {number} fuel level percent 0-100
 */
exports.getFuelPercent = async (vin) => {
  if (!process.env.mock) state.fuelLevel = await volvo.get(`/v1/vehicles/${vin}/fuel`).fuelAmount.value;

  const { fuelTankCapacity } = getVehicleParameters(vin);

  return Math.floor((state.fuelLevel / fuelTankCapacity) * 100);
};

/**
 * Get outside temperature for vehicle
 * @param {string} vin VIN
 * @returns {number} outside temperature in celcius
 */
exports.getOutsideTemperature = async (vin) => {
  if (!process.env.mock) state.outsideTemprature = await volvo.get(`/v1/vehicles/${vin}/environment`).externalTemp.value;

  return state.outsideTemprature;
};

/**
 * Checks if climatization system ON or not (Not presented in API)
 * @param {string} vin VIN
 * @returns {boolean} true if climatization on
 */
exports.isClimatizationOn = () => state.climatization;

/**
 * Turns climatization system ON
 * @param {string} vin VIN
 * @returns {void} nothing
 */
exports.turnOnClimatization = async (vin) => {
  if (!process.env.mock) await volvo.post(`/v1/vehicles/${vin}/commands/climatization-start`);

  state.climatization = true;
};

/**
 * Turns climatization system OFF
 * @param {string} vin VIN
 * @returns {void} nothing
 */
exports.turnOffClimatization = async (vin) => {
  if (!process.env.mock) await volvo.post(`/v1/vehicles/${vin}/commands/climatization-stop`);

  state.climatization = false;
};

/**
 * Checks if central lock is locked or not
 * @param {string} vin VIN
 * @returns {boolean} true if locked
 */
exports.isVehicleLocked = async (vin) => {
  if (!process.env.mock) state.locked = await volvo.get(`/v1/vehicles/${vin}/doors`).carLocked.value === 'LOCKED';

  return state.locked;
};

/**
 * Checks if headlights is ON or not (Not presented in API)
 * @param {string} vin VIN
 * @returns {boolean} true if ON
 */
exports.isFlashOn = () => state.flash;

/**
 * Send a lock command to the vehicle
 * @param {string} vin VIN
 * @returns {void} nothing
 */
exports.lockVehicle = async (vin) => {
  if (!process.env.mock) await volvo.post(`/v1/vehicles/${vin}/commands/lock`);

  state.locked = true;
};

/**
 * Send an unlock command to the vehicle
 * @param {string} vin VIN
 * @returns {void} nothing
 */
exports.unlockVehicle = async (vin) => {
  if (!process.env.mock) await volvo.post(`/v1/vehicles/${vin}/commands/unlock`);

  state.locked = false;
};

/**
 * Checks if engine is started or not
 * @param {string} vin VIN
 * @returns {boolean} true if started
 */
exports.isEngineStarted = async (vin) => {
  if (!process.env.mock) state.engineStarted = await volvo.get(`/v1/vehicles/${vin}/engine-status`).engineRunning.status === 'RUNNING';

  return state.engineStarted;
};

/**
 * Starts vehicle's engine
 * @param {string} vin VIN
 * @returns {void} nothing
 */
exports.startEngine = async (vin) => {
  if (!process.env.mock) await volvo.post(`/v1/vehicles/${vin}/commands/engine-start`);

  state.engineStarted = true;
};

/**
 * Stops vehicle's engine
 * @param {string} vin VIN
 * @returns {void} nothing
 */
exports.stopEngine = async (vin) => {
  if (!process.env.mock) await volvo.post(`/v1/vehicles/${vin}/commands/engine-stop`);

  state.engineStarted = false;
};

/**
 * Send a honk and flash command to the vehicle
 * @param {string} vin VIN
 * @returns {void} nothing
 */
exports.honkAndFlash = async (vin) => {
  if (!process.env.mock) await volvo.post(`/v1/vehicles/${vin}/commands/honk-flash`);
};

/**
 * Checks whether any of doors or windows is open
 * @param {string} vin VIN
 * @returns {boolean} true if open
 */
exports.isAnyDoorOrWindowOpen = async (vin) => {
  if (!process.env.mock) state.windowsOpened = Object.values(await volvo.get(`/v1/vehicles/${vin}/windows`)).some(v => v.value === 'OPEN');
  if (!process.env.mock) state.doorsOpened = Object.values(await volvo.get(`/v1/vehicles/${vin}/doors`)).some(v => v.value === 'UNLOCKED');

  return state.doorsOpened || state.windowsOpened;
};

/**
 * Checks if there are any warnings requiring human involvement: danger tyre status,
 * engine coolant, oil pressure, bulb failure etc
 * @param {string} vin VIN
 * @returns {boolean} true if there is any warning
 */
exports.isAnyWarning = async (vin) => {
  if (!process.env.mock) state.warnings = await volvo.get(`/v1/vehicles/${vin}/warnings`);

  return Object.keys(state.warnings).length;
};
