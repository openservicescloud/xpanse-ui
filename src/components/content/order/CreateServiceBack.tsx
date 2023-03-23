/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useEffect, useState } from 'react';
import { To, useLocation, useNavigate } from 'react-router-dom';
import { Button, Divider, Select } from 'antd';
import { SelectCloudProvider } from './SelectCloudProvider';
import { serviceVendorApi } from '../../../xpanse-api/xpanseRestApiClient';
import {
    CreateRequestCategoryEnum,
    CreateRequestCspEnum,
    Flavor,
    Ocl,
    RegisterServiceEntity,
} from '../../../xpanse-api/generated';
import { OrderSubmitProps } from './OrderSubmit';
import { DeployParam } from './orderInputItem/OrderCommon';
import Navigate from './Navigate';

function CreateService(): JSX.Element {
    const navigate = useNavigate();
    const [versionOptions, setVersionOptions] = useState<{ value: string; label: string }[]>([]);
    const [versionValue, setVersionValue] = useState<string>('');
    const [serviceName, setServiceName] = useState<string>('');
    const [categoryName, setCategoryName] = useState<string>('');
    const [service, setService] = useState<RegisterServiceEntity | undefined>(undefined);
    const [versionMapper, setVersionMapper] = useState<Map<string, RegisterServiceEntity[]>>(
        new Map<string, RegisterServiceEntity[]>()
    );
    const location = useLocation();

    const handleChangeVersion = (value: string) => {
        setVersionValue(value);
    };

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
            region: 'todo',
            csp: service === undefined ? 'huawei' : (service.csp as CreateRequestCspEnum),
            flavor: 'todo',
            params: new Array<DeployParam>(),
        };

        if (service !== undefined && service.ocl?.deployment.context !== undefined) {
            for (let param of service.ocl?.deployment.context) {
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
                <SelectCloudProvider versionValue={versionValue} versionMapper={versionMapper} />
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