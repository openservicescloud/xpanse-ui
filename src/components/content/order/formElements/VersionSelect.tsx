/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useEffect, useState } from 'react';
import { RegisterServiceEntity } from '../../../../xpanse-api/generated';
import { Select } from 'antd';

export default function VersionSelect({
    defaultVersion,
    serviceName,
    versionMapper,
    onChangeHandler,
}: {
    defaultVersion: string;
    serviceName: string;
    versionMapper: Map<string, RegisterServiceEntity[]>;
    onChangeHandler: (value: string) => void;
}): JSX.Element {
    const [versionOptions, setVersionOptions] = useState<{ value: string; label: string }[]>([]);
    const [selectVersion, setSelectVersion] = useState<string>('');

    useEffect(() => {
        if (versionMapper.size <= 0) {
            return;
        }

        let versions: { value: string; label: string }[] = [];
        versionMapper.forEach((v, k) => {
            let versionItem = { value: k || '', label: k || '' };
            versions.push(versionItem);
        });
        setVersionOptions(versions);
        setSelectVersion(defaultVersion);
    }, [versionMapper]);

    const onChangeVersion = (value: string) => {
        setSelectVersion(value);
        onChangeHandler(value);
    };

    return (
        <>
            <div className={'content-title'}>
                Service: {serviceName}&nbsp;&nbsp;&nbsp;&nbsp; Version:&nbsp;
                <Select
                    value={selectVersion}
                    style={{ width: 120 }}
                    onChange={onChangeVersion}
                    options={versionOptions}
                />
            </div>
        </>
    );
}
