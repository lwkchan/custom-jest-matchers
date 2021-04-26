import React from 'react';
import shallow from '../shallow';
import BaseModal from '../../components/BaseModal/BaseModal';
import FormLayoutSidebar from '../../components/Layout/FormLayout/Sidebar/Sidebar';
import ProductCard from '../../components/ProductCard/ProductCard';
import RenderOnLocales from '../../RenderOnLocales';
import {Locale} from '../../RootProvider/LocaleContext';
import {Product} from '../../types';

describe('toContainReactElement', () => {
  it('finds React elements with correct props', () => {
    expect(<button type="button">Test</button>).toContainReactElement('button', {type: 'button'});
  });
  it('finds React elements when no props are given', () => {
    expect(<button type="button">Test</button>).toContainReactElement('button');
  });
  it('finds React elements with correct props using asymmetric matchers', () => {
    expect(
      <button type="button" onClick={jest.fn()}>
        Test
      </button>
    ).toContainReactElement('button', {type: 'button', onClick: expect.any(Function)});

    expect(<input type="text" name="favouriteDisneyFilm" />).toContainReactElement('input', {
      type: 'text',
      name: expect.stringMatching(/^favourite/),
    });

    expect(<input type="text" name="favouriteDisneyFilm" />).toContainReactElement(
      'input',
      expect.objectContaining({
        type: 'text',
      })
    );

    const matchingAdvantage = 'We got no troubles';
    expect(
      <FormLayoutSidebar advantages={[matchingAdvantage, 'Down here all the fish is happy', 'Life is the bubbles']} />
    ).toContainReactElement(FormLayoutSidebar, {
      advantages: expect.arrayContaining([matchingAdvantage]),
    });
  });

  it('is able to handle deeply nested objects as props', () => {
    interface Props {
      deepNestedObject: object;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function Component({deepNestedObject}: Props) {
      // doesn't really matter what this returns, we only want to test the top-level Component
      return <div />;
    }

    const deepNestedObject = {
      protagonist: 'ariel',
      loveInterest: 'prince eric',
      villain: 'ursula',
      filmInfo: {year: '1989', writtenBy: ['Ron Clements', 'John Musker'], budget: 4000000},
      songs: [
        {name: 'kiss the girl', genre: 'pop', length: '2:43'},
        {name: 'under the sea', genre: 'calypso', length: '3:16'},
      ],
    };

    expect(<Component deepNestedObject={deepNestedObject} />).toContainReactElement(Component, {deepNestedObject});
  });

  it('is able to find deeply nested React elements in a render', () => {
    const handleSelectClick = jest.fn();
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
            <BaseModal>
              <ProductCard handleSelectClick={handleSelectClick} index={0} product={{} as Product} isProductLoading />
            </BaseModal>
          </div>
        </div>
      );
    }
    const {result} = shallow(<Component />);

    expect(result).toContainReactElement('button', {type: 'button', children: 'Hello world'});
    expect(result).toContainReactElement(ProductCard, {
      handleSelectClick,
      index: 0,
      product: {},
      isProductLoading: true,
    });
    expect(result).toContainReactElement(BaseModal);
  });

  it('can match when arrays in props have different references (not ===)', () => {
    const locales = [Locale.nl, Locale.uk, Locale.test];

    function Component() {
      return (
        // Spread locales so they do not have the same reference
        <RenderOnLocales locales={[...locales]}>
          <p>Hello Lago</p>
        </RenderOnLocales>
      );
    }
    const {result} = shallow(<Component />);

    expect(result).toContainReactElement(RenderOnLocales, {locales});
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
    const {result} = shallow(<Component />);
    expect(result).toContainReactElement('button', {type: 'button', children: 'Find me'});
  });
});
