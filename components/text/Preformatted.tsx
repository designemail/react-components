import React from 'react';
import { classnames } from '../../helpers/component';

const Preformatted = ({ className = '', ...rest }: React.HTMLAttributes<HTMLPreElement>) => {
    return <pre className={classnames(['bg-global-muted p1 mb1 scroll-if-needed', className])} {...rest} />;
};

export default Preformatted;
