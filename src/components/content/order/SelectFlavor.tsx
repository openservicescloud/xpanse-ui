/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useEffect, useState } from 'react';
import { Button, Select, Space, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Flavor } from '../../../xpanse-api/generated';

export const SelectFlavor = ({
    flavorMapper,
    versionValue,
}: {
    flavorMapper: Map<string, Flavor[]>;
    versionValue: string;
}): JSX.Element => {
    const navigate = useNavigate();
    const [flavorOptions, setFlavorOptions] = useState<{ value: string; label: string }[]>([]);
    const [flavorValue, setFlavorValue] = useState<string>('');
    const handleChangeFlavor = (value: string) => {
        console.log(`selected ${value}`);
        setFlavorValue(value);
    };
    const onClicked = function (cfg: any) {
        navigate('/home');
    };

    useEffect(() => {
        const flavorList: Flavor[] = flavorMapper.get(versionValue) || [];
        let flavors: { value: string; label: string }[] = [];
        flavorList.map((flavor) => {
            let flavorItem = { value: flavor.name, label: flavor.name };

            flavors.push(flavorItem);
        });
        setFlavorOptions(flavors);
        // setFlavorValue(flavors[0].value);
    }, [versionValue, flavorMapper]);

    return (
        <>
            <div className={'cloud-provider-tab-class region-flavor-content'}>
                Flavor:
            </div>
            <div className={'cloud-provider-tab-class region-flavor-content'}>
                <Space wrap>
                    <Select
                        className={'select-box-class'}
                        value={flavorValue}
                        style={{ width: 450 }}
                        onChange={handleChangeFlavor}
                        options={flavorOptions}
                    />
                </Space>
            </div>
        </>
    );
};
