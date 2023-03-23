/**
 * OpenAPI definition
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * OpenAPI spec version: v0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { ProviderOclVo } from './ProviderOclVo';
import { HttpFile } from '../http/http';

/**
 * List of the registered service group by service version.
 */
export class VersionOclVo {
    /**
     * Version of the registered service.
     */
    'version': string;
    /**
     * List of the registered services group by service version.
     */
    'cloudProvider': Array<ProviderOclVo>;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{ name: string; baseName: string; type: string; format: string }> = [
        {
            name: 'version',
            baseName: 'version',
            type: 'string',
            format: '',
        },
        {
            name: 'cloudProvider',
            baseName: 'cloudProvider',
            type: 'Array<ProviderOclVo>',
            format: '',
        },
    ];

    static getAttributeTypeMap() {
        return VersionOclVo.attributeTypeMap;
    }

    public constructor() {}
}
