/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { SelectRegion } from './SelectRegion';
import { Tab } from 'rc-tabs/lib/interface';
import { Area } from '../../../xpanse-api/generated';

type TabPosition = 'left' | 'right' | 'top' | 'bottom';
export const SelectArea = ({
    cloudProviderValue,
    areaMapper,
}: {
    cloudProviderValue: string;
    areaMapper: Map<string, Area[]>;
}): JSX.Element => {
    const [tabPosition, setTabPosition] = useState<TabPosition>('top');
    const [areaValue, setAreaValue] = useState<string>('');
    const [areaList, setAreaList] = useState<Area[]>([]);
    const [items, setItems] = useState<Tab[]>([]);

    const onChange = (key: string) => {
        setAreaValue(key);
    };
    useEffect(() => {
        const areaList: Area[] = areaMapper.get(cloudProviderValue) || [];
        setAreaList(areaList);
        if (areaList.length > 0) {
            const areaItems: Tab[] = areaList.map((area: Area) => {
                if (!area.name) {
                    return { key: '', label: '' };
                }
                const name = area.name;
                return {
                    label: name,
                    key: name,
                    children: ['Area： '.concat(name)],
                };
            });

            setItems(areaItems);
            setAreaValue(areaList[0].name);
        } else {
            return;
        }
    }, [cloudProviderValue, areaMapper]);

    return (
        <>
            <div className={'cloud-provider-tab-class content-title'}>
                <Tabs defaultActiveKey={'1'} tabPosition={tabPosition} items={items} onChange={onChange} />
            </div>
            <SelectRegion areaValue={areaValue} areaList={areaList} />
        </>
    );
};
