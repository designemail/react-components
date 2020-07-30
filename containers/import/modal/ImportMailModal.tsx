import React, { useState, useMemo, FormEvent } from 'react';
import { c } from 'ttag';
import {
    Alert,
    FormModal,
    ConfirmModal,
    PrimaryButton,
    Button,
    useApi,
    useModals,
    useLoading,
    useAddresses,
    generateUID,
} from '../../..';
import {
    getAuthenticationMethod,
    createMailImport,
    createJobImport,
    getMailImportFolders,
    getMailImport,
} from 'proton-shared/lib/api/mailImport';
import { noop } from 'proton-shared/lib/helpers/function';

import { MailImportFolderModel, Step, ImportModalModel, MailImportFolder, IMPORT_ERROR } from '../interfaces';

import ImportMailWizard from '../../../components/import/ImportMailWizard';

import ImportStartStep from './steps/ImportStartStep';
import ImportPrepareStep from './steps/ImportPrepareStep';
import ImportStartedStep from './steps/ImportStartedStep';

const DEFAULT_MODEL: ImportModalModel = {
    step: Step.START,
    needDetails: false,
    importID: '',
    email: '',
    password: '',
    port: '',
    imap: '',
    errorCode: 0,
    newFolders: [],
    oldFolders: [],
};

const prepareFolders = (folders: MailImportFolder[]): MailImportFolderModel[] =>
    folders.map((folder) => ({ ...folder, id: generateUID('folder'), name: folder.Name }));

interface Props {
    onClose?: () => void;
}

const ImportMailModal = ({ onClose = noop, ...rest }: Props) => {
    const [loading, withLoading] = useLoading();
    const { createModal } = useModals();
    const [addresses] = useAddresses();
    const [address] = addresses || [];
    const [model, setModel] = useState<ImportModalModel>(DEFAULT_MODEL);
    const api = useApi();

    const title = useMemo(() => {
        switch (model.step) {
            case Step.START:
                return c('Title').t`Start a new import`;
            case Step.PREPARE:
                return c('Title').t`Start import process`;
            case Step.STARTED:
                return c('Title').t`Import in progress`;
            default:
                return '';
        }
    }, [model.step]);

    const wizardSteps = [
        c('Wizard step').t`Authentication`,
        c('Wizard step').t`Import strategy`,
        c('Wizard step').t`Confirmation`,
    ];

    const handleCancel = () => {
        createModal(
            <ConfirmModal onConfirm={onClose}>
                <Alert type="warning">{c('Warning').t`Are you sure you want to cancel your import?`}</Alert>
            </ConfirmModal>
        );
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setModel({ ...model, errorCode: 0 });

        if (model.step === Step.START && model.needDetails) {
            try {
                const { Importer } = await api(
                    createMailImport({
                        Email: model.email,
                        ImapHost: model.imap,
                        ImapPort: parseInt(model.port),
                        Sasl: 'PLAIN',
                        Code: model.password,
                    })
                );
                const { Folders = [] } = await api(getMailImportFolders(Importer.ID));
                setModel({
                    ...model,
                    newFolders: prepareFolders(Folders),
                    oldFolders: Folders,
                    importID: Importer.ID,
                    step: Step.PREPARE,
                });
            } catch (error) {
                const { data: { Code } = { Code: 0 } } = error;

                console.log(Code);

                if ([IMPORT_ERROR.AUTH_CREDENTIALS, IMPORT_ERROR.AUTH_IMAP].includes(Code)) {
                    setModel({
                        ...model,
                        errorCode: Code,
                    });
                    return;
                }
                if (Code === IMPORT_ERROR.ALREADY_EXISTS) {
                    alert('oh no, import already exists');
                }
            }

            return;
        }

        if (model.step === Step.START) {
            const { Authentication } = await api(getAuthenticationMethod({ Email: model.email }));
            const { ImapHost, ImapPort, ImporterID } = Authentication;

            /* @todo Refactor this, lot of repetition */
            /*       Same with the needDetails */
            if (ImporterID) {
                try {
                    const { Importer } = await api(getMailImport(ImporterID));

                    const { Folders = [] } = await api(getMailImportFolders(Importer.ID, { Code: model.password }));

                    setModel({
                        ...model,
                        newFolders: prepareFolders(Folders),
                        oldFolders: Folders,
                        importID: Importer.ID,
                        step: Step.PREPARE,
                    });
                } catch (error) {
                    const { data: { Code } = { Code: 0 } } = error;

                    if ([IMPORT_ERROR.AUTH_CREDENTIALS, IMPORT_ERROR.AUTH_IMAP].includes(Code)) {
                        setModel({
                            ...model,
                            errorCode: Code,
                        });
                        return;
                    }
                }
            } else if (ImapHost) {
                try {
                    const { Importer } = await api(
                        createMailImport({
                            Email: model.email,
                            ImapHost,
                            ImapPort,
                            Sasl: 'PLAIN',
                            Code: model.password,
                        })
                    );

                    const { Folders = [] } = await api(getMailImportFolders(Importer.ID));

                    console.log(Folders);

                    setModel({
                        ...model,
                        newFolders: prepareFolders(Folders),
                        oldFolders: Folders,
                        importID: Importer.ID,
                        step: Step.PREPARE,
                    });
                } catch (error) {
                    const { data: { Code } = { Code: 0 } } = error;

                    if ([IMPORT_ERROR.AUTH_CREDENTIALS, IMPORT_ERROR.AUTH_IMAP].includes(Code)) {
                        setModel({
                            ...model,
                            errorCode: Code,
                        });
                        return;
                    }
                }
            } else {
                setModel({
                    ...model,
                    imap: '',
                    port: ImapPort,
                    needDetails: true,
                });
            }
            return;
        }

        if (model.step === Step.PREPARE) {
            await api(
                createJobImport(model.importID, {
                    AddressID: address.ID,
                    Folders: model.newFolders.map(({ name, Name, DestinationLabelID }) => {
                        if (typeof DestinationLabelID !== 'undefined') {
                            return {
                                SourceFolder: Name,
                                DestinationLabelID,
                            };
                        }
                        return {
                            SourceFolder: Name,
                            DestinationLabelName: name,
                        };
                    }),
                })
            );
            setModel({
                ...model,
                step: Step.STARTED,
            });
            return;
        }

        if (model.step === Step.STARTED) {
            onClose();
            return;
        }
    };

    const cancel = useMemo(() => {
        if (model.step === Step.STARTED) {
            return null;
        }

        return <Button loading={loading} onClick={handleCancel}>{c('Action').t`Cancel`}</Button>;
    }, [model.step, loading]);

    const submit = useMemo(() => {
        switch (model.step) {
            case Step.START:
                const disabled = model.needDetails
                    ? !model.email || !model.password || !model.imap || !model.port
                    : !model.email || !model.password;
                return (
                    <PrimaryButton type="submit" disabled={disabled} loading={loading}>
                        {c('Action').t`Next`}
                    </PrimaryButton>
                );
            case Step.PREPARE:
                return <PrimaryButton type="submit">{c('Action').t`Start import`}</PrimaryButton>;
            case Step.STARTED:
                return <PrimaryButton type="submit">{c('Action').t`Close`}</PrimaryButton>;
            default:
                return null;
        }
    }, [model.step, model.email, model.password, model.needDetails, model.imap, model.port, loading]);

    return (
        <FormModal
            title={title}
            loading={loading}
            submit={submit}
            close={cancel}
            onSubmit={(e: FormEvent<HTMLFormElement>) => withLoading(handleSubmit(e))}
            onClose={handleCancel}
            {...rest}
        >
            <ImportMailWizard step={model.step} steps={wizardSteps} />
            {model.step === Step.START && <ImportStartStep model={model} setModel={setModel} />}
            {model.step === Step.PREPARE && (
                <ImportPrepareStep address={address} title={title} model={model} setModel={setModel} />
            )}
            {model.step === Step.STARTED && <ImportStartedStep />}
        </FormModal>
    );
};

export default ImportMailModal;
