const throwNonSerializableEntity = (key) => {
  throw new Error(`A non serializable entity detected in store @[${key} slice]`);
};

const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const uid = () => `${performance.now().toString(36)}${Math.random().toString(36)}`.substring(2);

const createState = (state) => {
  const temp = (state && { ...state }) || {};
  const sState = {};
  const dState = {};
  const rState = {};

  Object.keys(temp).forEach((key) => {
    const propKey = `__${key}`;
    sState[propKey] = temp[key];

    const listeners = Object.create(null);
    const setValue = (val) => {
      if (isEqual(val, sState[propKey])) return;
      sState[propKey] = val;
      Object.values(listeners).forEach((listener) => listener(val));
    };

    Object.defineProperty(sState, key, {
      get: () => {
        const prop = Object.create(null);
        prop.value = sState[propKey];
        const id = uid();
        prop.subscribe = (callback) => {
          listeners[id] = callback;
        };
        prop.unsubscribe = () => delete listeners[id];
        return prop;
      },
      set: (val) => setValue(val),
    });

    Object.defineProperty(dState, key, {
      get: () => sState[propKey],
      set: (val) => setValue(val),
    });

    Object.defineProperty(rState, key, {
      get: () => sState[propKey],
    });
  });
  return { subscribers: sState, dispatchers: dState, readOnly: rState };
};

const configureStore = (slices) => {
  const dispatcherState = Object.create(null);
  const subscriberState = Object.create(null);
  const readOnlyState = Object.create(null);
  const reducers = Object.create(null);

  Object.keys(slices).forEach((key) => {
    const slice = slices[key];
    const { subscribers, dispatchers, readOnly } = createState(slice.state);
    Object.defineProperty(dispatcherState, key, { get: () => dispatchers });
    Object.defineProperty(subscriberState, key, { get: () => subscribers });
    Object.defineProperty(readOnlyState, key, { get: () => readOnly });
    reducers[key] = slice.reducer;
  });

  const dispatch = (action) => {
    const [slice, type] = action.type.split('/');
    const reducer = reducers[slice];

    reducer(dispatcherState[slice], { type, payload: action.payload });
  };

  return {
    dispatch,
    getState: () => readOnlyState,
    getSubscriber: () => subscriberState,
  };
};

export const configureStore2 = (slices) => {
  const state = Object.create(null);
  const reducers = Object.create(null);

  Object.keys(slices).forEach((key) => {
    const slice = slices[key];
    state[key] = slice.state;
    reducers[key] = slice.reducer;
  });

  let id = 0;
  let subscribers = [];

  const subscribe = (lId, callback) => {
    let identifier = lId;
    if (!identifier) {
      id += 1;
      identifier = id;
    }

    const item = Object.create(null);
    item.id = identifier;
    item.callback = callback;

    subscribers.push(item);
    return identifier;
  };

  const unsubscribe = (id) => {
    subscribers = subscribers.filter((item) => item.id !== id);
  };

  const dispatch = (action) => {
    const [slice, type] = action.type.split('/');
    const reducer = reducers[slice];
    const currentState = { ...state[type] };
    const temp = reducer(currentState, { type, payload: action.payload });
    try {
      if (isEqual(temp, currentState)) {
        state[slice] = temp;
        subscribers.forEach((item) => item.callback());
      }
    } catch {
      throwNonSerializableEntity(slice);
    }
  };

  return {
    subscribe,
    unsubscribe,
    dispatch,
    getState: () => state,
  };
};

export default configureStore;
