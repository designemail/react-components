import React from 'react';
import PropTypes from 'prop-types';
import { useFolders, Loader, Select } from 'react-components';
import { buildTreeview } from 'proton-shared/lib/helpers/folder';
import { range } from 'proton-shared/lib/helpers/array';
import { ROOT_FOLDER } from 'proton-shared/lib/constants';
import { c } from 'ttag';

const printDash = (time = 0) =>
    range(0, time)
        .map(() => ' ∙ ')
        .join('');
const formatOption = ({ Name, ID }, level = 0) => ({ value: ID, text: `${printDash(level)}${Name}` });

const reducer = (acc = [], folder, level = 0) => {
    acc.push(formatOption(folder, level));

    if (Array.isArray(folder.subfolders)) {
        folder.subfolders.forEach((folder) => reducer(acc, folder, level + 1));
    }

    return acc;
};

const ParentFolderSelector = ({ id, value, onChange }) => {
    const [folders, loading] = useFolders();
    const treeview = buildTreeview(folders);
    const options = treeview.reduce((acc, folder) => reducer(acc, folder), [
        { value: ROOT_FOLDER, text: c('Option').t`No parent folder` }
    ]);

    if (loading) {
        return <Loader />;
    }

    return (
        <Select id={id} value={value} options={options} onChange={({ target }) => onChange && onChange(target.value)} />
    );
};

ParentFolderSelector.propTypes = {
    id: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func
};

export default ParentFolderSelector;
