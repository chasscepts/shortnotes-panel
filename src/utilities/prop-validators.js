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

export const genericValidator = () => null;
