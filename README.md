# Custom Jest Matchers

## Setup

First, make sure that you have the correct peer dependencies installed.

To integrate with your tests, currently, you will need copy from the matcher and set it by adding a [`setupFilesAfterEnv` in `jest.config.js`](https://jestjs.io/docs/configuration#setupfilesafterenv-array). Then, you'll need to extend expect by using `expect.extend` in that `afterEnv` file.

See how this is done in this by looking at our [`jest.config.js`](https://github.com/lwkchan/custom-jest-matchers/blob/main/jest.config.js) and [`afterEnv.ts`](https://github.com/lwkchan/custom-jest-matchers/tree/main/src/test).

## Rules

### `.toContainReactElement`

Finds a matching React element in a [shallow render](https://reactjs.org/docs/shallow-renderer.html)

```tsx
it('finds React elements', () => {
  expect(<button type="button">Test</button>).toContainReactElement('button');
});
```

The second argument can be used to specify props.

```tsx
it('finds React elements with correct props', () => {
  expect(<button type="button">Test</button>).toContainReactElement('button', {
    type: 'button',
  });
});
```

## To do

- [ ] Set up on NPM registry
- [ ] Add more rules
