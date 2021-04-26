import {isValidElement, ReactElement} from 'react';

// steps through components in a tree and allows you to run a function on it
function stepThroughComponents(
  currentElement: ReactElement | ReactElement[],
  callback: (element: ReactElement) => void
): void {
  if (Array.isArray(currentElement)) {
    currentElement.forEach((el) => {
      if (isValidElement(el)) {
        stepThroughComponents(el, callback);
      }
    });
    return;
  }

  if (currentElement.props?.children) {
    stepThroughComponents(currentElement.props.children, callback);
  }

  callback(currentElement);
}

export default stepThroughComponents;
