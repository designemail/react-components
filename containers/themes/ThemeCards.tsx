import React from 'react';
import { ThemeCard, Block } from '../..';
import { ThemeTypes } from 'proton-shared/lib/themes/themes';

interface Theme {
    label: string;
    identifier: ThemeTypes;
    src: string;
}

interface Props {
    themeIdentifier: ThemeTypes;
    onChange: (themeType: ThemeTypes) => void;
    disabled: boolean;
    list: Theme[];
}

const ThemeCards = ({ themeIdentifier, onChange, disabled, list }: Props) => {
    return (
        <Block className="flex">
            {list.map(({ identifier, label, src }) => {
                return (
                    <ThemeCard
                        key={label}
                        label={label}
                        id={label}
                        alt={label}
                        src={src}
                        checked={themeIdentifier === identifier}
                        onChange={() => onChange(identifier)}
                        disabled={disabled}
                    />
                );
            })}
        </Block>
    );
};

export default ThemeCards;
