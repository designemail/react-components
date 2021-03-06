import React, { useState, useEffect } from 'react';
import { c } from 'ttag';

import {
    Condition,
    FilterStatement,
    ConditionType,
    ConditionComparator,
    SimpleFilterModalModel,
} from 'proton-shared/lib/filters/interfaces';
import { classnames, Radio, LinkButton } from '../../..';

import FilterConditionsFormRow from './FilterConditionsFormRow';

const conditionTemplate = {
    type: ConditionType.SELECT,
    comparator: ConditionComparator.CONTAINS,
    isOpen: true,
};

interface Props {
    isNarrow: boolean;
    model: SimpleFilterModalModel;
    onChange: (newModel: SimpleFilterModalModel) => void;
    isDark: boolean;
}

const FilterConditionsForm = ({ isNarrow, model, isDark, onChange }: Props) => {
    const [conditions, setConditions] = useState<Condition[]>(
        model.conditions.length ? model.conditions : [conditionTemplate]
    );

    const onAddCondition = () => {
        setConditions((conditions: Condition[]) => {
            return [...conditions, { ...conditionTemplate }];
        });
    };

    const onDeleteCondition = (i: number) => {
        setConditions((conditions: Condition[]) => {
            conditions.splice(i, 1);
            return [...conditions];
        });
    };

    const onUpdateCondition = (index: number, condition: Condition) => {
        setConditions((conditions: Condition[]) => {
            conditions[index] = condition;
            return [...conditions];
        });
    };

    useEffect(() => {
        onChange({ ...model, conditions });
    }, [conditions]);

    return (
        <>
            <div className="flex flex-nowrap mb0 onmobile-flex-column border-bottom">
                <div className={classnames(['w20', isNarrow && 'mb1'])}>{c('Label').t`Statement`}</div>
                <div className={classnames([!isNarrow && 'ml1'])}>
                    <Radio
                        id="statement-all"
                        className="flex flex-nowrap mb1 pm-radio--onTop"
                        checked={model.statement === FilterStatement.ALL}
                        onChange={() =>
                            onChange({
                                ...model,
                                statement: FilterStatement.ALL,
                            })
                        }
                    >
                        {c('Label').t`ALL`}
                        <em
                            className={classnames(['ml0-5', isDark ? 'color-global-muted' : 'color-global-altgrey'])}
                        >{c('Info').t`(Filter if ALL of the following conditions are met)`}</em>
                    </Radio>
                    <Radio
                        id="statement-any"
                        className="flex flex-nowrap mb1 pm-radio--onTop"
                        checked={model.statement === FilterStatement.ANY}
                        onChange={() =>
                            onChange({
                                ...model,
                                statement: FilterStatement.ANY,
                            })
                        }
                    >
                        {c('Label').t`ANY`}
                        <em
                            className={classnames(['ml0-5', isDark ? 'color-global-muted' : 'color-global-altgrey'])}
                        >{c('Info').t`(Filter if ANY of the following conditions are met)`}</em>
                    </Radio>
                </div>
            </div>
            {conditions.map((condition, i) => (
                <FilterConditionsFormRow
                    key={`Condition_${i}`}
                    isNarrow={isNarrow}
                    condition={condition}
                    conditionIndex={i}
                    handleDelete={onDeleteCondition}
                    handleUpdateCondition={onUpdateCondition}
                    statement={model.statement}
                    displayDelete={conditions.length > 1}
                />
            ))}
            <LinkButton onClick={onAddCondition} className="mt1 mb0-5">
                <strong>{c('Action').t`Add condition`}</strong>
            </LinkButton>
        </>
    );
};

export default FilterConditionsForm;
