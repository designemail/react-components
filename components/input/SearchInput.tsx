import React, { useState, useEffect, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'proton-shared/lib/helpers/function';

import Input, { Props as InputProps } from './Input';
import useDebounceInput from './useDebounceInput';

/**
 * <SearchInput delay={500} onChange={handleChange} value={keywords} />
 * @param delay used to debounce search value (default: 0)
 * @param onChange returns directly the value and not the event
 * @param value initial
 */
interface Props extends Omit<InputProps, 'onChange'> {
    delay?: number;
    onChange?: (value: string) => void;
    value?: string;
}
const SearchInput = ({ delay = 200, onChange = noop, value = '', ...rest }: Props) => {
    const [keywords, setKeywords] = useState(value);
    const words = useDebounceInput(keywords, delay);

    const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => setKeywords(target.value);

    useEffect(() => {
        onChange(words);
    }, [words]);

    useEffect(() => {
        setKeywords(value);
    }, [value]);

    return <Input value={keywords} onChange={handleChange} type="search" {...rest} />;
};

SearchInput.propTypes = {
    delay: PropTypes.number,
    onChange: PropTypes.func,
    value: PropTypes.string
};

export default SearchInput;