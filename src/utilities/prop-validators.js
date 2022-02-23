export const requirableValidator = (validate) => {
  const requirable = (isRequired, props, propName, componentName) => {
    const component = componentName || 'ANONYMOUS';
    if (props[propName] == null) {
      if (isRequired) {
        return new Error(`Required ${propName}  was not specified in ${component}.`);
      }
      return null;
    }
    return validate(props, propName, componentName);
  };

  const chainedValidator = requirable.bind(null, false);
  chainedValidator.isRequired = chainedValidator.bind(null, true);
  return chainedValidator;
};

export const noteValidator = (props, propName, componentName) => {
  const component = componentName || 'ANONYMOUS';
  const note = props[propName];
  if (!note) return new Error(`${propName} is required in ${component} but found none!`);
  if (!note.title) return new Error(`title MUST not be empty in ${propName} @ ${component}`);

  return null;
};

export const anyArray = (props, propName, componentName) => {
  const component = componentName || 'ANONYMOUS';
  if (Array.isArray(props[propName])) return null;
  return new Error(`${propName} MUST be an array in ${component}`);
};

export const styleValidator = requirableValidator((props, propName, componentName) => {
  const style = props[propName];
  if (!style) return null;
  const type = typeof style;
  if (type !== 'object') {
    throw new Error(`${propName} MUST be an object in ${componentName}`);
  }
  if (Array.isArray(style)) {
    throw new Error(`Object of type array is not acceptable as ${propName} in ${componentName}`);
  }
  try {
    JSON.stringify(style);
  } catch {
    throw new Error(`${propName} MUST be a serializable object in ${componentName}`);
  }
  return null;
});

export const genericValidator = () => null;
