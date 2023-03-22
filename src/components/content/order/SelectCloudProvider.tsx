/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useEffect, useState } from 'react';
import { Tab } from 'rc-tabs/lib/interface';
import { SelectArea } from './SelectArea';
import { Area, RegisterServiceEntity, CloudServiceProviderNameEnum, Flavor, Ocl } from '../../../xpanse-api/generated';
import { SelectFlavor } from './SelectFlavor';

interface CSP {
    name: string;
    logo: string;
}

const defaultLogo: string =
    'https://user-images.githubusercontent.com/1907997/226828054-8d66e3c0-ae2e-451e-8d8f-e414bf7bde9c.png';

const cspList: { name: string; logo: string }[] = [
    {
        name: 'Huawei',
        logo: 'https://user-images.githubusercontent.com/1907997/226822430-07591362-4a62-4d31-8a24-823e4b7c4c45.png',
    },
    {
        name: 'Azure',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Microsoft_Azure_Logo.svg',
    },
    {
        name: 'Alibaba',
        logo: 'https://img.alicdn.com/tfs/TB13DzOjXP7gK0jSZFjXXc5aXXa-212-48.png',
    },
    { name: 'Openstack', logo: defaultLogo },
];

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

    const [csp, setCsp] = useState<{ name: string; logo: string }[]>([]);

    const onChange = (key: string) => {
        setCloudProviderValue( key.charAt(0).toLowerCase() + key.slice(1));
    };

    useEffect(() => {
        let oclList: Ocl[] = [];
        const flavorMapper: Map<string, Flavor[]> = new Map<string, Flavor[]>();
        const areaMapper: Map<string, Area[]> = new Map<string, Area[]>();
        versionMapper.forEach((v, k) => {
            if (k === versionValue) {
                let ocls: Ocl[] = [];
                v.map((registerServiceEntity) => {
                    if (registerServiceEntity.ocl instanceof Ocl) {
                        ocls.push(registerServiceEntity.ocl);
                    }
                });
                oclList = ocls;
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

        let cspItems: CSP[] = [];
        if(oclList.length>0){
            oclList.forEach((item)=>{
                if(item.serviceVersion === versionValue){
                    if (item && item.cloudServiceProvider) {
                        const name = item.cloudServiceProvider.name;
                        let result = name.charAt(0).toUpperCase() + name.slice(1);
                        cspList.forEach((item) => {
                            if (result === item.name) {
                                cspItems.push({
                                    name: item.name,
                                    logo: item.logo,
                                });
                            }
                        });
                    }
                }
            });
            setCsp(cspItems);
            setCloudProviderValue(cspItems[0].name)
        }else {
            return;
        }


    }, [versionValue, versionMapper]);

    console.log('csp: ', csp);

    return (
        <>
            <div className={'cloud-provider-tab-class'}>Cloud Service Provider:</div>
            {/*<div className={'cloud-provider-tab-class content-title'}>*/}
            {/*    <Tabs type="card" tabPosition={tabPosition} items={cloudServiceProviderList} onChange={onChange} />*/}
            {/*</div>*/}

            <div className={'services-content-body'}>
                {csp.map((item, index) => {
                    return (
                        <div onClick={(e) => {
                            onChange(item.name);
                        }}
                            key={index}
                            // className={'cloud-provider-select'}
                            // onClick={(e) => null}
                        >
                            <img
                                className='cloud-provider-select'
                                src={item.logo}

                            />
                            <div className='service-type-option-info'>
                                <span className='service-type-option-description service-type-option'>Cloud Provider: {item.name}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
            <SelectArea cloudProviderValue={cloudProviderValue} areaMapper={areaMapper} />
            <SelectFlavor versionValue={versionValue} flavorMapper={flavorMapper} />
        </>
    );
};
