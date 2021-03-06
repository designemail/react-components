import React from 'react';
import PropTypes from 'prop-types';
import ReactIntlTelInput from 'react-intl-tel-input';
import 'design-system/_sass/react-styles/react-intl-tel-input/_intlTelInput.scss';
import { classnames } from '../../helpers/component';

const IntlTelInput = ({ containerClassName, inputClassName, ...rest }) => (
    <ReactIntlTelInput
        containerClassName={classnames(['intl-tel-input', containerClassName])}
        inputClassName={classnames(['pm-field', inputClassName])}
        {...rest}
    />
);

IntlTelInput.propTypes = {
    containerClassName: PropTypes.string,
    inputClassName: PropTypes.string,
};

export default IntlTelInput;
