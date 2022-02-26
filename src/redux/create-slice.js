/**
 * @typedef {Object} Action
 * @property {string} type
 * @property payload
*/

/**
 * @callback ActionCreator
 * @returns {Action}
*/

/**
 * @param {Object} config
 * @param {string} config.name
 * @param {Object} config.initialState
 * @param {Object} config.reducers
 */

const createSlice = (config) => {
  const reducer = (state, { type, payload }) => {
    // let s = state;
    const func = config.reducers[type];
    if (func) {
      func(state, { payload });
      // s = { ...s };
    }
    // return s;
  };

  /**
   * @type {Object.<string, ActionCreator>}
   */
  const actions = Object.create(null);
  Object.keys(config.reducers).forEach((key) => {
    actions[key] = (payload) => ({ type: `${config.name}/${key}`, payload });
  });

  return {
    actions,
    reducer: {
      state: config.initialState,
      reducer,
    },
  };
};

export default createSlice;
