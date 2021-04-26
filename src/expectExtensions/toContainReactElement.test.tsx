import React from 'react';
import shallow from '../shallow';

function CustomElement({}: any) {
  return <div>Custom element</div>;
}

describe('toContainReactElement', () => {
  it('finds React elements with correct props', () => {
    expect(<button type="button">Test</button>).toContainReactElement(
      'button',
      { type: 'button' }
    );
  });
  it('finds React elements when no props are given', () => {
    expect(<button type="button">Test</button>).toContainReactElement('button');
  });
  it('finds React elements with correct props using asymmetric matchers', () => {
    expect(
      <button type="button" onClick={jest.fn()}>
        Test
      </button>
    ).toContainReactElement('button', {
      type: 'button',
      onClick: expect.any(Function),
    });

    expect(
      <input type="text" name="favouriteDisneyFilm" />
    ).toContainReactElement('input', {
      type: 'text',
      name: expect.stringMatching(/^favourite/),
    });

    expect(
      <input type="text" name="favouriteDisneyFilm" />
    ).toContainReactElement(
      'input',
      expect.objectContaining({
        type: 'text',
      })
    );

    const matchingAdvantage = 'We got no troubles';
    expect(
      <CustomElement
        advantages={[
          matchingAdvantage,
          'Down here all the fish is happy',
          'Life is the bubbles',
        ]}
      />
    ).toContainReactElement(CustomElement, {
      advantages: expect.arrayContaining([matchingAdvantage]),
    });
  });

  it('is able to handle deeply nested objects as props', () => {
    interface Props {
      deepNestedObject: object;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function Component({ deepNestedObject }: Props) {
      // doesn't really matter what this returns, we only want to test the top-level Component
      return <div />;
    }

    const deepNestedObject = {
      protagonist: 'ariel',
      loveInterest: 'prince eric',
      villain: 'ursula',
      filmInfo: {
        year: '1989',
        writtenBy: ['Ron Clements', 'John Musker'],
        budget: 4000000,
      },
      songs: [
        { name: 'kiss the girl', genre: 'pop', length: '2:43' },
        { name: 'under the sea', genre: 'calypso', length: '3:16' },
      ],
    };

    expect(
      <Component deepNestedObject={deepNestedObject} />
    ).toContainReactElement(Component, { deepNestedObject });
  });

  it('is able to find deeply nested React elements in a render', () => {
    const handleClick = jest.fn();
    function Component() {
      return (
        <div>
          <div>
            <h1>Hello world</h1>
            <div>
              <div>
                <button type="button">Hello world</button>
              </div>
            </div>

            <CustomElement handleClick={handleClick} index={0} isLoading />
          </div>
        </div>
      );
    }
    const { result } = shallow(<Component />);

    expect(result).toContainReactElement('button', {
      type: 'button',
      children: 'Hello world',
    });
    expect(result).toContainReactElement(CustomElement, {
      handleClick,
      index: 0,
      isLoading: true,
    });
  });

  it('can match when arrays in props have different references (not ===)', () => {
    const films = ['Mulan', 'Lion King', 'Beauty and the Beast'];

    function Component() {
      return (
        // Spread so they do not have the same reference
        <CustomElement films={[...films]} />
      );
    }
    const { result } = shallow(<Component />);

    expect(result).toContainReactElement(CustomElement, { films });
  });

  it('can handle when there is an inline undefined in a tree', () => {
    function Component() {
      return (
        <div>
          {undefined}
          <button type="button">Find me</button>
        </div>
      );
    }
    const { result } = shallow(<Component />);
    expect(result).toContainReactElement('button', {
      type: 'button',
      children: 'Find me',
    });
  });
});
