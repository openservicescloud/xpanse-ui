/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { FormOutlined } from '@ant-design/icons';
import '../../../styles/services.css';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createServicePageRoute } from '../../utils/constants';
import { serviceVendorApi } from '../../../xpanse-api/xpanseRestApiClient';

function Services(): JSX.Element {
    const [services, setServices] = useState<{ name: string; content: string }[]>([]);
    const [isSelected, setIsSelected] = useState<number>();
    const navigate = useNavigate();
    const location = useLocation();

    const onClicked = function (cfg: string) {
        console.log('cfg: ', cfg);
        navigate(
            createServicePageRoute
                .concat('?serviceName=', location.hash.split('#')[1])
                .concat('&name=', cfg.replace(' ', ''))
        );
    };

    useEffect(() => {
        const categoryName = location.hash.split('#')[1];
        if (!categoryName) {
            return;
        }
        serviceVendorApi.listRegisteredServicesTree(categoryName).then((rsp) => {
            if(rsp.length > 0){
                console.log('rsp from Services: ', rsp);
                let serviceList: { name: string; content: string }[] = [];
                rsp.forEach((item) => {
                    let serviceItem = {
                        name: item.name || '',
                        content: item.versions[0].cloudProvider[0].details[0].description,
                        // icon: item.versions[0].cloudProvider[0].details[0].icon,
                    };
                    serviceList.push(serviceItem);
                });
                setServices(serviceList);
            }else{
                return(<></>)
            }

        });
    }, [location]);

    return (
        <div className={'services-content'}>
            <div className={'content-title'}>
                <FormOutlined />
                &nbsp;Select Service
            </div>
            <div className={'services-content-body'}>
                {services.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className={'service-type-option-detail'}
                            onClick={(e) => onClicked(item.name)}
                        >
                            <div className='service-type-option-image'>
                                <img className='service-type-option-service-icon'/>
                            </div>
                            <div className='service-type-option-info'>
                                <span className='service-type-option'>{item.name}</span>
                                <span className='service-type-option-description'>{item.content}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Services;
