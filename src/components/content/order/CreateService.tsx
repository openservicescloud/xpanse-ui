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
import { Ocl, RegisterServiceEntity, VersionOclVo } from '../../../xpanse-api/generated';
import { SelectFlavor } from './SelectFlavor';

function CreateService(): JSX.Element {
    const navigate = useNavigate();
    const [versionOptions, setVersionOptions] = useState<{ value: string; label: string }[]>([]);
    const [versionValue, setVersionValue] = useState<string>('');
    const [serviceName, setServiceName] = useState<string>('');
    const [categoryName, setCategoryName] = useState<string>('');
    const [oclList, setOclList] = useState<Ocl[]>([]);
    const location = useLocation();

    const handleChangeVersion = (value: string) => {
        console.log('versionValue: ',versionValue);
        console.log('serviceName: ',serviceName);
        console.log('categoryName: ',categoryName);
        setVersionValue(value);
    };

    const goBackPage = function (cfg: any) {
        navigate(-1);
    };

    function group(list:any[], key:string): Map<string, any[]>{
        let map:Map<string, any[]> = new Map<string, any[]>();
        list.map(val=>{
            if(!map.has(val[key])){
                map.set(val[key],list.filter(data=>data[key]==val[key]));
            }
        });
        return map;
    }

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
                const result:Map<string, RegisterServiceEntity[]> = group(rsp,"version");
                result.forEach((v,k)=>{
                    let versionItem = { value: k || '', label: k || '' };
                    versions.push(versionItem);
                })
                setVersionOptions(versions);
                setVersionValue(versions[0].value);
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
