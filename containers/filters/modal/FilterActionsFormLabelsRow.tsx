import React from 'react';
import { c } from 'ttag';

import { Label } from 'proton-shared/lib/interfaces/Label';
import { Actions } from 'proton-shared/lib/filters/interfaces';
import { Checkbox, Button, Tooltip, classnames, Icon, useModals } from '../../..';

import EditLabelModal from '../../labels/modals/Edit';

interface Props {
    labels: Label[];
    isNarrow: boolean;
    actions: Actions;
    handleUpdateActions: (onUpdateActions: Partial<Actions>) => void;
    isDark: boolean;
}

type ChangePayload = {
    labels: string[];
    isOpen: boolean;
};

const FilterActionsFormLabelsRow = ({ actions, isNarrow, handleUpdateActions, labels, isDark }: Props) => {
    const { createModal } = useModals();
    const { labelAs } = actions;
    const { isOpen } = labelAs;

    const handleChangeModel = (payload: Partial<ChangePayload>) => {
        handleUpdateActions({
            labelAs: {
                ...actions.labelAs,
                ...payload,
            },
        });
    };

    const toggleSection = () => {
        handleChangeModel({ isOpen: !isOpen });
    };

    const handleClear = () => {
        handleChangeModel({ labels: [] });
    };

    const handleCreateLabel = async () => {
        const label: Label = await new Promise((resolve, reject) => {
            createModal(
                <EditLabelModal onAdd={resolve as () => undefined} onClose={reject as () => undefined} type="label" />
            );
        });

        handleChangeModel({ labels: [...labelAs.labels, label.Name] });
    };

    const renderClosed = () => {
        if (!labelAs?.labels.length) {
            return (
                <em className={classnames([isDark ? 'color-global-muted' : 'color-global-altgrey'])}>{c('Info')
                    .t`No label selected`}</em>
            );
        }

        return (
            <div className="pm-badgeLabel-container">
                {labelAs?.labels.map((labelName: string) => {
                    const label = labels?.find((l) => l.Name === labelName);

                    return (
                        <span
                            key={labelName}
                            className="ml0-5 mr0-5 mb0-5 badgeLabel flex flex-row flex-items-center ellipsis"
                            role="listitem"
                            style={{
                                color: label?.Color,
                            }}
                            title={label?.Name}
                        >
                            <span className="pm-badgeLabel-link color-white ellipsis">{label?.Name}</span>
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="border-bottom flex flex-nowrap onmobile-flex-column align-items-center pt1 pb1">
            <button type="button" className={classnames(['w20 alignleft', isNarrow && 'mb1'])} onClick={toggleSection}>
                <Icon name="caret" className={classnames([isOpen && 'rotateX-180'])} />
                <span className={classnames(['ml0-5', actions.error && 'color-global-warning'])}>
                    {c('Label').t`Label as`}
                </span>
            </button>
            <div className={classnames(['flex-item-fluid', !isNarrow && 'ml1'])}>
                {isOpen ? (
                    <>
                        <div className="w100">
                            {labels.length ? (
                                labels.map((label: Label) => (
                                    <div className="mb0-5 inbl pm-badgeLabel-container ellipsis" key={label.Name}>
                                        <Checkbox
                                            className="mr1 flex-nowrap"
                                            checked={labelAs.labels.includes(label.Name)}
                                            onChange={() => {
                                                const index = labelAs.labels.indexOf(label.Name);
                                                if (index >= 0) {
                                                    labelAs.labels.splice(index, 1);
                                                    handleChangeModel({ labels: [...labelAs.labels] });
                                                } else {
                                                    handleChangeModel({ labels: [...labelAs.labels, label.Name] });
                                                }
                                            }}
                                            labelOnClick={(e) => e.stopPropagation()}
                                        >
                                            <span
                                                className="ml0-5 badgeLabel flex flex-row flex-items-center"
                                                role="listitem"
                                                style={{
                                                    color: label.Color,
                                                }}
                                                title={label.Name}
                                            >
                                                <span className="pm-badgeLabel-link color-white ellipsis">
                                                    {label.Name}
                                                </span>
                                            </span>
                                        </Checkbox>
                                    </div>
                                ))
                            ) : (
                                <div className="pt0-5 mb1">{c('Label').t`No label found`}</div>
                            )}
                        </div>
                        <Button className="mt0" onClick={handleCreateLabel}>
                            {c('Action').t`Create label`}
                        </Button>
                    </>
                ) : (
                    <div className="mt0-5">{renderClosed()}</div>
                )}
            </div>
            <div>
                <Button
                    disabled={!labelAs?.labels.length}
                    onClick={handleClear}
                    className={classnames(['pm-button--for-icon', isNarrow ? 'mt1' : 'ml1'])}
                >
                    <Tooltip
                        title={c('Action').t`Reset`}
                        className={classnames([isDark ? 'color-global-muted' : 'color-global-altgrey'])}
                    >
                        <Icon name="remove-text-formatting" />
                    </Tooltip>
                </Button>
            </div>
        </div>
    );
};
export default FilterActionsFormLabelsRow;
