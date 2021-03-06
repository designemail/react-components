import React, { useState, ChangeEvent, useEffect } from 'react';
import { c } from 'ttag';

import { TYPES, COMPARATORS } from 'proton-shared/lib/filters/constants';
import { Condition, FilterStatement, ConditionType, ConditionComparator } from 'proton-shared/lib/filters/interfaces';
import { classnames, Input, Select, Radio, Tooltip, Icon, Button } from '../../..';
import { OptionProps } from '../../../components/select/Select';

import './FilterConditionsFormRow.scss';

const { SELECT, SUBJECT, SENDER, RECIPIENT } = ConditionType;

interface Props {
    isNarrow: boolean;
    conditionIndex: number;
    statement: FilterStatement;
    condition: Condition;
    handleDelete: (index: number) => void;
    handleUpdateCondition: (index: number, condition: Condition) => void;
    displayDelete: boolean;
}

const FilterConditionsRow = ({
    isNarrow,
    conditionIndex,
    statement,
    condition,
    handleDelete,
    handleUpdateCondition,
    displayDelete,
}: Props) => {
    const typeOptions = TYPES.map(({ label: text, value }, i) => {
        const option: OptionProps = { text, value };
        if (i === 0) {
            option.disabled = true;
        }
        return option;
    });
    const ConditionComparatorOptions = COMPARATORS.map(({ label: text, value }) => ({
        text,
        value,
    }));
    const [isOpen, setIsOpen] = useState(condition.isOpen);
    const [tokens, setTokens] = useState<string[]>(condition.values || []);
    const [inputValue, setInputValue] = useState('');

    const { type, comparator } = condition;

    const statementLabel = statement === FilterStatement.ALL ? c('Label').t`AND` : c('Label').t`OR`;
    const label = conditionIndex === 0 ? c('Label').t`IF` : statementLabel;

    const onAddNewToken = () => {
        setTokens((tokens) => [...tokens, inputValue.trim()]);
        setInputValue('');
    };

    const onRemoveToken = (i: number) => {
        setTokens((tokens) => {
            tokens.splice(i, 1);
            return [...tokens];
        });
    };

    useEffect(() => {
        if (condition.type === SELECT) {
            condition.error = c('Error').t`Empty condition`;
        } else if (
            [SUBJECT, SENDER, RECIPIENT].includes(condition.type) &&
            (!condition.values || !condition.values.length)
        ) {
            condition.error = c('Error').t`Condition incomplete`;
        } else {
            condition.error = '';
        }
    }, [condition]);

    useEffect(() => {
        handleUpdateCondition(conditionIndex, {
            ...condition,
            values: tokens,
        });
    }, [tokens]);

    useEffect(() => {
        handleUpdateCondition(conditionIndex, {
            ...condition,
            isOpen,
        });
    }, [isOpen]);

    const onChangeInputValue = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const renderAttachmentsCondition = () => {
        const withAttachment = condition?.comparator === ConditionComparator.CONTAINS;
        const toggleAttachment = () => {
            handleUpdateCondition(conditionIndex, {
                ...condition,
                comparator: withAttachment ? ConditionComparator.DOES_NOT_CONTAIN : ConditionComparator.CONTAINS,
            });
        };

        return (
            <div className="mt1 flex">
                <Radio
                    id={`condition-${conditionIndex}-with-attachment`}
                    className="flex flex-nowrap pm-radio--onTop mr1"
                    checked={withAttachment}
                    onChange={toggleAttachment}
                >
                    {c('Label').t`With attachment`}
                </Radio>
                <Radio
                    id={`condition-${conditionIndex}-without-attachment`}
                    className="flex flex-nowrap pm-radio--onTop"
                    checked={!withAttachment}
                    onChange={toggleAttachment}
                >
                    {c('Label').t`Without attachment`}
                </Radio>
            </div>
        );
    };

    const renderToken = (token: string, i: number) => (
        <React.Fragment key={`Condition_${conditionIndex}_Token_${i}`}>
            {i > 0 && <span className="ml0-5 mr0-5">{c('Label').t`or`}</span>}
            <span
                key={`condition-${conditionIndex}-token-${i}`}
                className="inline-flex flex-row flex-items-center mb0-5 condition-token"
                role="listitem"
            >
                <span className="ellipsis nodecoration" title={token}>
                    {token}
                </span>
                <button
                    type="button"
                    className="flex pm-badgeLabel-button flex-item-noshrink ml0-5"
                    onClick={() => onRemoveToken(i)}
                >
                    <Icon name="off" size={11} />
                    <span className="sr-only">{c('Action').t`Remove this label`}</span>
                </button>
            </span>
        </React.Fragment>
    );

    const renderGenericCondition = () => {
        return (
            <div className="mt1 flex-item-fluid">
                {tokens.length ? <div className="mb0-5">{tokens.map(renderToken)}</div> : null}
                <div className="flex flex-nowrap">
                    <span className="flex-item-fluid pr1">
                        <Input
                            onChange={onChangeInputValue}
                            type="text"
                            value={inputValue}
                            placeholder={c('Placeholder').t`Type text or keyword`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    onAddNewToken();
                                }
                            }}
                        />
                    </span>
                    <Button disabled={!inputValue.trim()} onClick={onAddNewToken} className="pm-button-blue">{c(
                        'Action'
                    ).t`Insert`}</Button>
                </div>
            </div>
        );
    };

    const renderClosed = () => {
        if (condition?.error) {
            return <em className="pt0-5 color-global-warning">{condition?.error}</em>;
        }

        let label;
        let title;

        if (type === ConditionType.ATTACHMENTS) {
            const attachment =
                condition?.comparator === ConditionComparator.CONTAINS
                    ? c('Label').t`with attachments`
                    : c('Label').t`without attachment`;
            const attachmentStrong = <strong key="attachments">{attachment}</strong>;
            label = c('Label').jt`The email was sent ${attachmentStrong}`;
            title = c('Label').t`The email was sent ${attachment}`;
        } else {
            const typeLabel = TYPES.find((t) => t.value === type)?.label;
            const comparatorLabel = COMPARATORS.find((t) => t.value === comparator)?.label;
            const values = condition?.values?.map((v, i) => {
                const value = <strong key={`${v}${i}`}>{v}</strong>;
                return i > 0 ? (
                    <>
                        {` `}
                        {c('Label').t`or`}
                        {` `}
                        {value}
                    </>
                ) : (
                    value
                );
            });
            const titleValues = condition?.values?.map((v, i) => {
                return i > 0 ? ` or ${v}` : v;
            });
            title = `${typeLabel} ${comparatorLabel} ${titleValues}`;
            label = (
                <>
                    {typeLabel}
                    {` `}
                    {comparatorLabel}
                    {` `}
                    {values}
                </>
            );
        }

        return (
            <span className="mw100 pt0-5 ellipsis" title={title}>
                {label}
            </span>
        );
    };

    const toggleSection = () => setIsOpen((isOpen) => !isOpen);

    return (
        <div className="border-bottom">
            <div className="flex flex-nowrap onmobile-flex-column align-items-center pt1 pb1">
                <button
                    type="button"
                    className={classnames(['w20 alignleft', isNarrow && 'mb1'])}
                    onClick={toggleSection}
                >
                    <Icon name="caret" className={classnames([isOpen && 'rotateX-180'])} />
                    <span className={classnames(['ml0-5', condition.error && 'color-global-warning'])}>{label}</span>
                </button>
                <div className={classnames(['flex flex-column flex-item-fluid', !isNarrow && 'ml1'])}>
                    {isOpen ? (
                        <div className="flex">
                            <span className="w50 pr1">
                                <Select
                                    options={typeOptions}
                                    value={type}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                        handleUpdateCondition(conditionIndex, {
                                            ...condition,
                                            type: e.target.value as ConditionType,
                                        });
                                    }}
                                />
                            </span>
                            {type &&
                                [ConditionType.SUBJECT, ConditionType.SENDER, ConditionType.RECIPIENT].includes(
                                    type
                                ) && (
                                    <span className="w50">
                                        <Select
                                            options={ConditionComparatorOptions}
                                            value={comparator}
                                            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                                handleUpdateCondition(conditionIndex, {
                                                    ...condition,
                                                    comparator: e.target.value as ConditionComparator,
                                                });
                                            }}
                                        />
                                    </span>
                                )}
                        </div>
                    ) : (
                        renderClosed()
                    )}
                    {isOpen && type && type !== ConditionType.SELECT && (
                        <div className="flex">
                            {type === ConditionType.ATTACHMENTS
                                ? renderAttachmentsCondition()
                                : renderGenericCondition()}
                        </div>
                    )}
                </div>
                {displayDelete && (
                    <div>
                        <Button
                            onClick={() => handleDelete(conditionIndex)}
                            className={classnames(['pm-button--for-icon', isNarrow ? 'mt1' : 'ml1'])}
                        >
                            <Tooltip title={c('Action').t`Delete`} className="color-global-warning">
                                <Icon name="trash" />
                            </Tooltip>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterConditionsRow;
