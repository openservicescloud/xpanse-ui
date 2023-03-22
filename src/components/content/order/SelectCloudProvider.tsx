/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useEffect, useState } from 'react';
import { Divider, Select, Tabs } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import { SelectArea } from './SelectArea';
import { Area, RegisterServiceEntity, CloudServiceProviderNameEnum, Flavor, Ocl } from '../../../xpanse-api/generated';
import { SelectFlavor } from './SelectFlavor';
import { SelectRegion } from './SelectRegion';

interface CSP {
    name: string;
    icon?: string;
    logo?: string;
}

const defaultLogo: string =
    'https://user-images.githubusercontent.com/1907997/226828054-8d66e3c0-ae2e-451e-8d8f-e414bf7bde9c.png';

const cspMap: Map<CloudServiceProviderNameEnum, CSP> = new Map([
    [
        'huawei',
        {
            name: 'Huawei',
            logo: 'https://user-images.githubusercontent.com/1907997/226822430-07591362-4a62-4d31-8a24-823e4b7c4c45.png',
        },
    ],
    [
        'azure',
        {
            name: 'Azure',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Microsoft_Azure_Logo.svg',
        },
    ],
    ['openstack', { name: 'Openstack', logo: defaultLogo }],
]);

type TabPosition = 'left' | 'right' | 'top' | 'bottom';
export const SelectCloudProvider = ({
    versionValue,
    versionMapper,
}: {
    versionValue: string;
    versionMapper: Map<string, RegisterServiceEntity[]>;
}): JSX.Element => {
    const [tabPosition, setTabPosition] = useState<TabPosition>('top');
    const [cloudProviderValue, setCloudProviderValue] = useState<string>('');
    const [cloudServiceProviderList, setCloudServiceProviderList] = useState<Tab[]>([]);
    const [flavorMapper, setFlavorMapper] = useState<Map<string, Flavor[]>>(new Map<string, Flavor[]>());
    const [areaMapper, setAreaMapper] = useState<Map<string, Area[]>>(new Map<string, Area[]>());

    const [oclList, setOclList] = useState<Ocl[]>([]);
    const [csp, setCsp] = useState<CSP[]>([
        {
            name: 'Openstack',
            logo: cspMap.get('openstack')?.logo === undefined ? defaultLogo : cspMap.get('openstack')?.logo,
        },
    ]);

    const onChange = (key: string) => {
        setCloudProviderValue(key);
    };

    useEffect(() => {
        let oclList : Ocl[]= [];
        const flavorMapper: Map<string, Flavor[]> = new Map<string, Flavor[]>();
        const areaMapper: Map<string, Area[]> = new Map<string, Area[]>();
        versionMapper.forEach((v, k) => {
            if (k === versionValue) {
                let ocls: Ocl[] = [];
                v.map((registerServiceEntity) => {
                    let oclItem: Ocl | undefined = registerServiceEntity.ocl;
                    if (oclItem instanceof Ocl) {
                        ocls.push(oclItem);
                    }
                });
                oclList=ocls;
            }
        });
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
                flavorMapper.set(v.serviceVersion || '', v.flavors || []);
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
    }, [versionValue, versionMapper]);

    return (
        <>
            <div className={'cloud-provider-tab-class'}>Cloud Service Provider:</div>
            {/*<div className={'cloud-provider-tab-class content-title'}>*/}
            {/*    <Tabs type="card" tabPosition={tabPosition} items={cloudServiceProviderList} onChange={onChange} />*/}
            {/*</div>*/}

            <div className={'services-content-body'}>
                {csp.map((item, index) => {
                    return (
                        <div
                            key={index}
                            // className={'cloud-provider-select'}
                            // onClick={(e) => null}
                        >
                            {/*<div className='service-type-option-image'>*/}
                            {/*    <img className='service-type-option-service-icon' src={item.icon} />*/}
                            {/*</div>*/}
                            <img
                                className='cloud-provider-select'
                                src={item.logo}
                                onClick={(e) => {
                                    onChange(item.name);
                                }}
                            />
                            {/*<div className='service-type-option-info'>*/}
                            {/*    <span className='service-type-option'>{item.name}</span>*/}
                            {/*    <span className='service-type-option-description'>{item.name}</span>*/}
                            {/*</div>*/}
                            Cloud Provider: {cloudProviderValue}
                        </div>
                    );
                })}
            </div>
            <SelectArea cloudProviderValue={cloudProviderValue} areaMapper={areaMapper} />
            <SelectFlavor versionValue={versionValue} flavorMapper={flavorMapper} />
        </>
    );
};
