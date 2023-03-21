/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Divider, Select } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { SelectCloudProvider } from './SelectCloudProvider';
import { serviceVendorApi } from '../../../xpanse-api/xpanseRestApiClient';
import { Ocl, VersionOclVo } from '../../../xpanse-api/generated';

function CreateService(): JSX.Element {
    const navigate = useNavigate();
    const [versionOptions, setVersionOptions] = useState<{ value: string; label: string }[]>([]);
    const [versionValue, setVersionValue] = useState<string>('');
    const [serviceName, setServiceName] = useState<string>('');
    const [categoryName, setCategoryName] = useState<string>('');
    const [oclList, setOclList] = useState<Ocl[]>([]);
    const location = useLocation();

    const handleChangeVersion = (value: string) => {
        setVersionValue(value);
    };

    const goBackPage = function (cfg: any) {
        navigate(-1);
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
        <div className={'services-content'}>
            <div className={'back-button-class'}>
                <Button type='text' onClick={goBackPage}>
                    <LeftOutlined />
                    Back
                </Button>
            </div>
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
    );
}

export default CreateService;
