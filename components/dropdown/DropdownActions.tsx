import React, { ReactNode } from 'react';
import { c } from 'ttag';
import { Info, Button, Group, ButtonGroup } from '../../index';

import DropdownMenu from './DropdownMenu';
import DropdownMenuButton, { Props as DropdownMenuButtonProps } from './DropdownMenuButton';
import SimpleDropdown from './SimpleDropdown';
import { classnames } from '../../helpers/component';

const wrapTooltip = (text: string | ReactNode, tooltip?: string) => {
    if (!tooltip) {
        return text;
    }
    if (typeof text !== 'string') {
        return text;
    }
    return (
        <>
            <span className="mr0-5">{text}</span>
            <Info title={tooltip} />
        </>
    );
};

interface DropdownActionProps extends DropdownMenuButtonProps {
    key?: string;
    text: string | ReactNode;
    tooltip?: string;
    onClick?: () => void;
}

interface Props {
    loading?: boolean;
    disabled?: boolean;
    list?: DropdownActionProps[];
    className?: string;
}

const DropdownActions = ({ loading = false, disabled = false, list = [], className = '' }: Props) => {
    if (!list.length) {
        return null;
    }

    const [{ text, tooltip, ...restProps }, ...restList] = list;

    if (list.length === 1) {
        return (
            <Button loading={loading} disabled={disabled} className={className} {...restProps}>
                {wrapTooltip(text, tooltip)}
            </Button>
        );
    }

    return (
        <Group>
            <ButtonGroup disabled={disabled} loading={loading} className={className} {...restProps}>
                {wrapTooltip(text, tooltip)}
            </ButtonGroup>
            <SimpleDropdown
                originalPlacement="bottom-right"
                disabled={disabled}
                loading={loading}
                className={classnames(['pm-button pm-group-button pm-button--for-icon', className])}
                title={c('Title').t`Open actions dropdown`}
                content=""
                data-test-id="dropdown:open"
            >
                <DropdownMenu>
                    {restList.map(({ text, tooltip, ...restProps }, index) => {
                        return (
                            <DropdownMenuButton className="alignleft" key={index} {...restProps}>
                                {wrapTooltip(text, tooltip)}
                            </DropdownMenuButton>
                        );
                    })}
                </DropdownMenu>
            </SimpleDropdown>
        </Group>
    );
};

export default DropdownActions;
