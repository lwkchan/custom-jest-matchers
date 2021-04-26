import React from 'react';
import shallow from './shallow';
import stepThroughComponents from './stepThroughComponents';

describe('stepThroughComponents', () => {
  const callback = jest.fn();

  beforeEach(() => {
    callback.mockReset();
  });
  it('can step through a single component', () => {
    stepThroughComponents(
      <button type="button">Lose feathers</button>,
      callback
    );

    expect(callback).toHaveBeenCalledWith(
      <button type="button">Lose feathers</button>
    );
  });
  it('can step through an array of components', () => {
    const arrayOfDivs = [<div id="1" />, <div id="2" />, <div id="3" />];
    expect.assertions(arrayOfDivs.length);
    stepThroughComponents(arrayOfDivs, callback);

    arrayOfDivs.forEach((div) => {
      expect(callback).toHaveBeenCalledWith(div);
    });
  });
  it('can step through a complex component tree', () => {
    // eslint-disable-next-line jsx-a11y/alt-text
    const nestedImg = <img src="mock-src.jpg" />;
    const nestedList = (
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul>
    );
    const nestedDiv = (
      <div>
        <article>
          <header>Header</header>
          {nestedImg}
        </article>
        {nestedList}
      </div>
    );
    const component = (
      <div>
        {nestedDiv}
        <button type="submit">Hello</button>
      </div>
    );
    const TestTree = () => component;

    const { result } = shallow(<TestTree />);

    stepThroughComponents(result, callback);

    // check for nested components
    expect(callback).toHaveBeenCalledWith(component);
    expect(callback).toHaveBeenCalledWith(<button type="submit">Hello</button>);
    expect(callback).toHaveBeenCalledWith(nestedImg);
    expect(callback).toHaveBeenCalledWith(nestedList);
    expect(callback).toHaveBeenCalledWith(nestedDiv);
    expect(callback).toHaveBeenCalledWith(<li>1</li>);
    expect(callback).toHaveBeenCalledWith(<li>2</li>);
    expect(callback).toHaveBeenCalledWith(<li>3</li>);

    expect(callback).toHaveBeenCalledTimes(15);
  });
});
