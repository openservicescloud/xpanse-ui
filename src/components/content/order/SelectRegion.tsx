/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useEffect, useState } from 'react';
import { Select, Space, Tabs } from 'antd';
import { Area } from '../../../xpanse-api/generated';

export const SelectRegion = ({ areaValue, areaList }: { areaValue: string; areaList: Area[] }): JSX.Element => {
    const [regionValue, setRegionValue] = useState<string>('');
    const [regionOptions, setRegionOptions] = useState<{ value: string; label: string }[]>([]);
    const handleChangeRegion = (value: string) => {
        console.log(`selected ${value}`);
        setRegionValue(value);
    };

    useEffect(() => {
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
        // setRegionValue(regionOptions[0].value);
    }, [areaValue, areaList]);

    return (
        <div>
            Region:&nbsp;
            <Space wrap>
                <Select
                    value={regionValue}
                    style={{ width: 120 }}
                    onChange={handleChangeRegion}
                    options={regionOptions}
                />
            </Space>
        </div>
    );
};
