import React, { useState } from 'react';
import { c } from 'ttag';
import PropTypes from 'prop-types';
import { Table, TableHeader, TableBody, TableRow, Info } from 'react-components';

import AddressStatus from './AddressStatus';
import AddressCatchAll from './AddressCatchAll';

const AddressesTable = ({ domain, domainAddresses }) => {
    const [addresses, setAddresses] = useState(() => domainAddresses);

    const handleChange = ({ ID }) => (newValue) => {
        setAddresses(
            addresses.map((address) => {
                return {
                    ...address,
                    CatchAll: address.ID === ID ? +newValue : 0,
                };
            })
        );
    };

    return (
        <Table>
            <TableHeader
                cells={[
                    c('Title header for addresses domain table').t`Address`,
                    c('Title header for addresses domain table').t`Status`,
                    <>
                        {c('Title header for addresses domain table').t`Catch all`}
                        <Info url="https://protonmail.com/support/knowledge-base/catch-all/" />
                    </>,
                ]}
            />
            <TableBody colSpan={4}>
                {addresses.map((address) => {
                    const key = address.ID;
                    return (
                        <TableRow
                            key={key}
                            cells={[
                                <div key={key} className="ellipsis" title={address.Email}>
                                    {address.Email}
                                </div>,
                                <AddressStatus key={key} address={address} />,
                                <AddressCatchAll
                                    key={key}
                                    address={address}
                                    domain={domain}
                                    onChange={handleChange(address)}
                                />,
                            ]}
                        />
                    );
                })}
            </TableBody>
        </Table>
    );
};

AddressesTable.propTypes = {
    domain: PropTypes.object.isRequired,
    domainAddresses: PropTypes.array.isRequired,
};

export default AddressesTable;
