/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useEffect, useState } from 'react';
import { To, useLocation, useNavigate } from 'react-router-dom';
import { Button, Divider, Select, Space, Tabs } from 'antd';
import { SelectCloudProvider } from './SelectCloudProvider';
import { serviceVendorApi } from '../../../xpanse-api/xpanseRestApiClient';
import {
    Area,
    CreateRequestCategoryEnum,
    CreateRequestCspEnum,
    Flavor,
    Ocl,
    RegisterServiceEntity,
} from '../../../xpanse-api/generated';
import { OrderSubmitProps } from './OrderSubmit';
import { DeployParam } from './VariableElement/OrderCommon';
import Navigate from './Navigate';
import { Tab } from 'rc-tabs/lib/interface';

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

function CreateService(): JSX.Element {
    const navigate = useNavigate();
    const [versionOptions, setVersionOptions] = useState<{ value: string; label: string }[]>([]);
    const [versionValue, setVersionValue] = useState<string>('');
    const [serviceName, setServiceName] = useState<string>('');
    const [categoryName, setCategoryName] = useState<string>('');
    const [service, setService] = useState<Ocl | undefined>(undefined);
    const [versionMapper, setVersionMapper] = useState<Map<string, RegisterServiceEntity[]>>(
        new Map<string, RegisterServiceEntity[]>()
    );
    const location = useLocation();

    const [tabPosition, setTabPosition] = useState<TabPosition>('top');
    const [cloudProviderValue, setCloudProviderValue] = useState<string>('');
    const [cloudServiceProviderList, setCloudServiceProviderList] = useState<Tab[]>([]);
    const [flavorMapper, setFlavorMapper] = useState<Map<string, Flavor[]>>(new Map<string, Flavor[]>());
    const [areaMapper, setAreaMapper] = useState<Map<string, Area[]>>(new Map<string, Area[]>());

    const [csp, setCsp] = useState<{ name: string; logo: string }[]>([]);

    const onChangeCloudProvider = (key: string) => {
        setCloudProviderValue(key.charAt(0).toLowerCase() + key.slice(1));
    };

    const handleChangeVersion = (value: string) => {
        setVersionValue(value);
    };

    const [areaValue, setAreaValue] = useState<string>('');
    const [areaList, setAreaList] = useState<Area[]>([]);
    const [items, setItems] = useState<Tab[]>([]);

    const onChangeAreaValue = (key: string) => {
        setAreaValue(key);
    };
    const [regionValue, setRegionValue] = useState<string>('');
    const [regionOptions, setRegionOptions] = useState<{ value: string; label: string }[]>([{ value: '', label: '' }]);
    const handleChangeRegion = (value: string) => {
        setRegionValue(value);
    };
    const [flavorOptions, setFlavorOptions] = useState<{ value: string; label: string }[]>([]);
    const [flavorValue, setFlavorValue] = useState<string>('');
    const handleChangeFlavor = (value: string) => {
        setFlavorValue(value);
    };

    useEffect(() => {
        if (areaList.length > 0) {
            const regions: { value: string; label: string }[] = areaList
                .filter((v) => (v as Area).name === areaValue)
                .flatMap((v) => {
                    if (!v || !v.regions) {
                        return { value: '', label: '' };
                    }
                    return v.regions.map((region) => {
                        if (!region) {
                            return { value: '', label: '' };
                        }
                        return {
                            value: region,
                            label: region,
                        };
                    });
                });
            setRegionOptions(regions);
            setRegionValue(regions[0].value);
        } else {
            return;
        }
    }, [areaValue, areaList]);

    const goBackPage = function (cfg: any) {
        navigate(-1);
    };

    function group(list: any[], key: string): Map<string, any[]> {
        let map: Map<string, any[]> = new Map<string, any[]>();
        list.map((val) => {
            if (!map.has(val[key])) {
                map.set(
                    val[key],
                    list.filter((data) => data[key] == val[key])
                );
            }
        });
        return map;
    }
    const gotoOrderSubmit = function () {
        let props: OrderSubmitProps = {
            category: categoryName as CreateRequestCategoryEnum,
            name: serviceName,
            version: versionValue,
            region: regionValue,
            csp: cloudProviderValue as CreateRequestCspEnum,
            flavor: flavorValue,
            params: new Array<DeployParam>(),
        };

        if (service !== undefined && service?.deployment.context !== undefined) {
            for (let param of service?.deployment.context) {
                props.params.push({
                    name: param.name,
                    kind: param.kind,
                    type: param.type,
                    example: param.example === undefined ? '' : param.example,
                    description: param.description,
                    value: param.value === undefined ? '' : param.value,
                    mandatory: param.mandatory,
                    validator: param.validator === undefined ? '' : param.validator,
                });
            }
        }

        navigate('/order', {
            state: {
                props: props,
            },
        });
    };
    console.log('service: ', service);

    useEffect(() => {
        const categoryName = location.search.split('?')[1].split('&')[0].split('=')[1];
        const serviceName = location.search.split('?')[1].split('&')[1].split('=')[1];
        if (!categoryName || !serviceName) {
            return;
        }
        setCategoryName(categoryName);
        setServiceName(serviceName);
        serviceVendorApi.listRegisteredServices(categoryName, '', serviceName, '').then((rsp) => {
            if (rsp.length > 0) {
                let versions: { value: string; label: string }[] = [];
                const result: Map<string, RegisterServiceEntity[]> = group(rsp, 'version');
                setVersionMapper(result);
                result.forEach((v, k) => {
                    let versionItem = { value: k || '', label: k || '' };
                    versions.push(versionItem);
                });
                setVersionOptions(versions);
                setVersionValue(versions[0].value);
            } else {
                return;
            }
        });
    }, [location]);

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
        if (oclList.length > 0) {
            oclList.forEach((item) => {
                if (item.serviceVersion === versionValue) {
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
                        setService(item);
                    }
                }
            });
            setCsp(cspItems);
            setCloudProviderValue(cspItems[0].name);
        } else {
            return;
        }
    }, [versionValue, versionMapper]);

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

    useEffect(() => {
        const flavorList: Flavor[] = flavorMapper.get(versionValue) || [];
        let flavors: { value: string; label: string }[] = [];
        if (flavorList.length > 0) {
            flavorList.map((flavor) => {
                let flavorItem = { value: flavor.name, label: flavor.name };

                flavors.push(flavorItem);
            });
            setFlavorOptions(flavors);
            setFlavorValue(flavors[0].value);
        } else {
            return;
        }
    }, [versionValue, flavorMapper]);

    return (
        <>
            <div>
                <Navigate text={'<< Back'} to={-1 as To} />
                <div className={'Line'} />
            </div>
            <div className={'services-content'}>
                <div className={'content-title'}>
                    Service: {serviceName}&nbsp;&nbsp;&nbsp;&nbsp; Version:&nbsp;
                    <Select
                        value={versionValue}
                        style={{ width: 120 }}
                        onChange={handleChangeVersion}
                        options={versionOptions}
                    />
                </div>
                <Divider />
                {/*<SelectCloudProvider versionValue={versionValue} versionMapper={versionMapper} />*/}
                <div className={'cloud-provider-tab-class'}>Cloud Service Provider:</div>
                {/*<div className={'cloud-provider-tab-class content-title'}>*/}
                {/*    <Tabs type="card" tabPosition={tabPosition} items={cloudServiceProviderList} onChange={onChange} />*/}
                {/*</div>*/}

                <div className={'services-content-body'}>
                    {csp.map((item, index) => {
                        return (
                            <div
                                onClick={(e) => {
                                    onChangeCloudProvider(item.name);
                                }}
                                key={index}
                                // className={'cloud-provider-select'}
                                // onClick={(e) => null}
                            >
                                <img className='cloud-provider-select' src={item.logo} />
                                <div className='service-type-option-info'>
                                    <span className='service-type-option-description service-type-option'>
                                        Cloud Provider: {item.name}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className={'cloud-provider-tab-class content-title'}>
                    <Tabs defaultActiveKey={'1'} tabPosition={tabPosition} items={items} onChange={onChangeAreaValue} />
                </div>
                <div className={'cloud-provider-tab-class region-flavor-content'}>Region:</div>
                <div className={'cloud-provider-tab-class region-flavor-content'}>
                    <Space wrap>
                        <Select
                            className={'select-box-class'}
                            defaultValue={regionValue}
                            value={regionValue}
                            style={{ width: 450 }}
                            onChange={handleChangeRegion}
                            options={regionOptions}
                        />
                    </Space>
                </div>
                <div className={'cloud-provider-tab-class region-flavor-content'}>Flavor:</div>
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
            </div>
            <div>
                <div className={'Line'} />
                <div className={'order-param-item-row'}>
                    <div className={'order-param-item-left'} />
                    <div className={'order-param-submit'}>
                        <Button type='primary' onClick={gotoOrderSubmit}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateService;
