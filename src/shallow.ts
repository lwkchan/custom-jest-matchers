import { ReactElement } from 'react';
import { createRenderer, ShallowRenderer } from 'react-test-renderer/shallow';

type Shallow = { result: ReactElement; renderer: ShallowRenderer };

const shallow = (component: ReactElement): Shallow => {
    const renderer = createRenderer();
    renderer.render(component);
    const result = renderer.getRenderOutput();

    return {
        result,
        renderer,
    };
};

export default shallow;
