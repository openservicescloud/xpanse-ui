/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useEffect, useState } from 'react';
import { To, useLocation, useNavigate } from 'react-router-dom';
import { Button, Divider, Select } from 'antd';
import { HomeOutlined, LeftOutlined } from '@ant-design/icons';
import { SelectCloudProvider } from './SelectCloudProvider';
import { serviceVendorApi } from '../../../xpanse-api/xpanseRestApiClient';
import {
    CreateRequestCategoryEnum,
    CreateRequestCspEnum,
    Ocl,
    RegisterServiceEntity,
    VersionOclVo,
} from '../../../xpanse-api/generated';
import { SelectFlavor } from './SelectFlavor';
import { OrderSubmitProps } from './OrderSubmit';
import { DeployParam } from './VariableElement/OrderCommon';
import Navigate from './Navigate';

function CreateService(): JSX.Element {
    const navigate = useNavigate();
    const [versionOptions, setVersionOptions] = useState<{ value: string; label: string }[]>([]);
    const [versionValue, setVersionValue] = useState<string>('');
    const [serviceName, setServiceName] = useState<string>('');
    const [categoryName, setCategoryName] = useState<string>('');
    const [oclList, setOclList] = useState<Ocl[]>([]);
    const [service, setService] = useState<RegisterServiceEntity | undefined>(undefined);
    const location = useLocation();

    const handleChangeVersion = (value: string) => {
        console.log('versionValue: ', versionValue);
        console.log('serviceName: ', serviceName);
        console.log('categoryName: ', categoryName);
        setVersionValue(value);
    };

    const goBackPage = function (cfg: any) {
        navigate(-1);
    };

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
                console.log('rsp from CreateService: ', rsp);
                let versions: { value: string; label: string }[] = [];
                let ocl: Ocl[] = [];
                let versionInfo = new Set();
                rsp.forEach((item) => {
                    versionInfo.add(item.ocl?.serviceVersion);
                    let versionItem = { value: item.ocl?.serviceVersion || '', label: item.ocl?.serviceVersion || '' };
                    versions.push(versionItem);
                    let oclItem: Ocl | undefined = item.ocl;
                    if (oclItem instanceof Ocl) {
                        ocl.push(oclItem);
                    }
                });

                setVersionOptions(versions);
                setVersionValue(versions[0].value);
                setOclList(ocl);
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
                <SelectCloudProvider versionValue={versionValue} oclList={oclList} />
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
