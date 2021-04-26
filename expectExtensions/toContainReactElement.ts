import deepEqual from 'fast-deep-equal';
import {ComponentType, ReactElement} from 'react';
import {ObjectOfAny} from '../../types';
import {isObject} from '../../utils/objects';
import stepThroughComponents from '../stepThroughComponents';

function findMatchingComponents<TProps>(
  tree: ReactElement,
  componentType: ComponentType<TProps>,
  expectedProps?: ObjectOfAny
): ReactElement[] {
  const matchingElements: ReactElement[] = [];

  try {
    stepThroughComponents(tree, (currentElement) => {
      const isMatchingComponentType = currentElement?.type === componentType;

      if (isMatchingComponentType && !expectedProps) {
        matchingElements.push(currentElement);
      }

      if (isMatchingComponentType && expectedProps) {
        // check for matching props
        const currentElProps = currentElement.props;

        const expectedPropKeys = Object.keys(expectedProps);

        const isMatchingPropObject =
          expectedProps.asymmetricMatch?.(currentElProps) ||
          expectedPropKeys.every((key) => {
            // return true if prop values match

            if (
              isObject(currentElProps[key]) &&
              isObject(expectedProps[key]) &&
              deepEqual(currentElProps[key], expectedProps[key])
            ) {
              // @todo extend to display differences between currentElProps[key] and expectedProps[key] on console using jest-diff. https://jestjs.io/docs/en/expect#thisutils
              // check for object deep equality
              return true;
            }

            if (
              Array.isArray(currentElProps[key]) &&
              Array.isArray(expectedProps[key]) &&
              deepEqual(currentElProps[key], expectedProps[key])
            ) {
              return true;
            }

            // check for value equality
            if (currentElProps[key] === expectedProps[key]) {
              return true;
            }

            // check for asymmetric matches
            if (expectedProps[key]?.asymmetricMatch?.(currentElProps[key])) {
              return true;
            }

            return false;
          });

        if (isMatchingPropObject) {
          matchingElements.push(currentElement);
        }
      }
    });

    return matchingElements;
  } catch (e) {
    // if the above loop errors, return any matching elements we already have
    return matchingElements;
  }
}

export function toContainReactElement<TProps>(
  this: jest.MatcherContext,
  received: ReactElement,
  expectedComponentType: ComponentType<TProps>,
  props?: TProps
) {
  let pass = true;

  // recursively look through the received snapshot
  const matchingElements = findMatchingComponents(received, expectedComponentType, props);

  if (matchingElements.length === 0) {
    pass = false;
  }

  // @todo change message so that we can see if it's the componentType that has failed or the mismatching props
  if (pass) {
    return {
      message: () => `expected ${expectedComponentType.name || expectedComponentType} not to be within snapshot`,
      pass: true,
    };
  }
  return {
    message: () => `expected component ${expectedComponentType.name || expectedComponentType} to be within snapshot`,
    pass: false,
  };
}
