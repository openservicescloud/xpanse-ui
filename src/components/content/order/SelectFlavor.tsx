/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useEffect, useState } from 'react';
import { Button, Select, Space, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Flavor } from '../../../xpanse-api/generated';

export const SelectFlavor = ({ flavorMapper, versionValue }: { flavorMapper: Map<string, Flavor[]>, versionValue:string }): JSX.Element => {
    const navigate = useNavigate();
    const [flavorValue, setFlavorValue] = useState<string>('');
    const handleChangeFlavor = (value: string) => {
        console.log(`selected ${value}`);
        setFlavorValue(value);
    };
    const onClicked = function (cfg: any) {
        navigate('/home');
    };

    useEffect(() => {
        flavorMapper.get(versionValue)
    }, [flavorMapper]);

    return (
        <div>
            Flavor:&nbsp;
            <Space wrap>
                <Select
                    defaultValue='lucy'
                    style={{ width: 120 }}
                    onChange={handleChangeFlavor}
                    options={[
                        { value: 'jack', label: 'Jack' },
                        { value: 'lucy', label: 'Lucy' },
                        { value: 'Yiminghe', label: 'yiminghe' },
                        { value: 'disabled', label: 'Disabled', disabled: true },
                    ]}
                />
            </Space>
            <div>
                <Button type='primary' style={{ backgroundColor: '#1677ff' }} onClick={onClicked}>
                    Next
                </Button>
            </div>
        </div>
    );
};
