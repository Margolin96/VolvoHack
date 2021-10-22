class VolvoApi {
  /**
   * Class constructor, one instance per vehicle
   * @param {string} vin current vehicle VIN number as an identifier
   */
  constructor(vin) {
    this.token = process.env.VOLVO_API_TOKEN;
    if (!this.token) throw new Error('VOLVO_API_TOKEN environment variable is not specified.');

    this.endpoint = process.env.VOLVO_API_ENDPOINT;
    if (!this.endpoint) throw new Error('VOLVO_API_ENDPOINT environment variable is not specified.');

    this.vin = vin;
  }

  /**
   * Get vehicle parameters object
   * @returns {{fuelTankCapacity: number}} parameters object
   */
  getVehicleParameters() {
    // not presented in API right now, returns stab
    return {
      fuelTankCapacity: 150,
    };
  }

  /**
   * Get fuel level in percent from full one
   * @returns {number} fuel level percent 0-100
   */
  getFuelPercent() {
    const pars = this.getVehicleParameters();
    const fuelLevel = 0; // TODO API call
    return Math.floor((fuelLevel / pars.) * 100);
  }

  /**
   * Checks if climatization system ON or not
   * @returns {boolean} true if climatization on
   */
  isClimatizationOn() {
    throw new Error('Not implemented'); // TODO API call
  }

  /**
   * Turns climatization system ON
   * @returns {void} nothing
   */
  turnOnClimatization() {
    throw new Error('Not implemented'); // TODO API call
  }

  /**
   * Turns climatization system OFF
   * @returns {void} nothing
   */
  turnOffClimatization() {
    throw new Error('Not implemented'); // TODO API call
  }

  /**
   * Send a lock command to the vehicle
   * @returns {void} nothing
   */
  lockVehicle() {
    throw new Error('Not implemented'); // TODO API call
  }

  /**
   * Send a honk and flash command to the vehicle
   * @returns {void} nothing
   */
  honkAndFlash() {
    throw new Error('Not implemented'); // TODO API call
  }

  /**
   * Checks whether any of doors or windows is open
   * @returns {boolean} true if open
   */
  isAnyDoorOrWindowOpen() {
    throw new Error('Not implemented'); // TODO API call
  }

  /**
   * Checks if there are any warnings requiring human involvement: danger tyre status,
   * engine coolant, oil pressure, bulb failure etc
   * @returns {boolean} true if open
   */
  isAnyWarnings() {
    throw new Error('Not implemented'); // TODO API call
  }
}
