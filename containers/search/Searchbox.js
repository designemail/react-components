import React from 'react';
import { c } from 'ttag';
import PropTypes from 'prop-types';
import { SearchInput, Icon, classnames } from 'react-components';

const Searchbox = ({ delay, className = '', advanced, placeholder = '', value = '', onSearch, onChange }) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch && onSearch(value);
    };

    const handleReset = (event) => {
        event.preventDefault();
        onChange('');
        onSearch && onSearch('');
    };

    return (
        <form
            role="search"
            name="searchbox"
            className={classnames([
                'searchbox-container relative flex-item-centered-vert',
                className,
                value !== '' && advanced && 'searchbox-container--reset-advanced',
            ])}
            onSubmit={handleSubmit}
            onReset={handleReset}
        >
            <label htmlFor="global_search">
                <span className="sr-only">{placeholder}</span>
                <SearchInput
                    delay={delay}
                    value={value}
                    onChange={onChange}
                    id="global_search"
                    placeholder={placeholder}
                    className="searchbox-field"
                />
            </label>
            <button type="submit" className="searchbox-search-button flex">
                <Icon name="search" className="mauto searchbox-search-button-icon" />
                <span className="sr-only">{c('Action').t`Search`}</span>
            </button>
            {value.length ? (
                <button type="reset" className="searchbox-advanced-search-button flex">
                    <Icon name="close" className="mauto searchbox-search-button-icon" />
                    <span className="sr-only">{c('Action').t`Clear`}</span>
                </button>
            ) : null}
            {advanced}
        </form>
    );
};

Searchbox.propTypes = {
    delay: PropTypes.number,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onSearch: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    advanced: PropTypes.node,
};

export default Searchbox;
