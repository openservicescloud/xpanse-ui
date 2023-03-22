/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useEffect, useState } from 'react';
import { Divider, Select, Tabs } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import { SelectArea } from './SelectArea';
import { Area, Flavor, Ocl } from '../../../xpanse-api/generated';
import { SelectFlavor } from './SelectFlavor';

type TabPosition = 'left' | 'right' | 'top' | 'bottom';
export const SelectCloudProvider = ({
    versionValue,
    oclList,
}: {
    versionValue: string;
    oclList: Ocl[];
}): JSX.Element => {
    const [tabPosition, setTabPosition] = useState<TabPosition>('top');
    const [cloudProviderValue, setCloudProviderValue] = useState<string>('');
    const [cloudServiceProviderList, setCloudServiceProviderList] = useState<Tab[]>([]);
    const [flavorMapper, setFlavorMapper] = useState<Map<string, Flavor[]>>(new Map<string, Flavor[]>());
    const [areaMapper, setAreaMapper] = useState<Map<string, Area[]>>(new Map<string, Area[]>());

    const onChange = (key: string) => {
        setCloudProviderValue(key);
    };

    useEffect(() => {
        const flavorMapper: Map<string, Flavor[]> = new Map<string, Flavor[]>();
        const areaMapper: Map<string, Area[]> = new Map<string, Area[]>();
        const items: Tab[] = oclList
            .filter((v) => (v as Ocl).serviceVersion === versionValue)
            .flatMap((v) => {
                if (!v || !v.cloudServiceProvider) {
                    return { key: '', label: '' };
                }
                if (!v.cloudServiceProvider.name) {
                    return { key: '', label: '' };
                }
                areaMapper.set(v.cloudServiceProvider.name || '', v.cloudServiceProvider.areas || []);
                flavorMapper.set(v.serviceVersion, v.flavors);
                setCloudProviderValue(v.cloudServiceProvider.name);
                const name = v.cloudServiceProvider.name;
                return {
                    label: name,
                    key: name,
                    children: ['CloudProvider： '.concat(name)],
                };
            });
        setCloudServiceProviderList(items);
        setAreaMapper(areaMapper);
        setFlavorMapper(flavorMapper);
    }, [oclList, versionValue]);

    return (
        <>
            <div className={'cloud-provider-tab-class'}>
                    Cloud Service Provider
            </div>
            <div className={'cloud-provider-tab-class content-title'}>
                <Tabs type="card" tabPosition={tabPosition} items={cloudServiceProviderList} onChange={onChange} />
            </div>
            <SelectArea cloudProviderValue={cloudProviderValue} areaMapper={areaMapper} />
            <SelectFlavor versionValue={versionValue} flavorMapper={flavorMapper} />
        </>
    );
};
