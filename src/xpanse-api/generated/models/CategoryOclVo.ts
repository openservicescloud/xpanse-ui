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

import { HttpFile } from '../http/http';
import { VersionOclVo } from './VersionOclVo';

export class CategoryOclVo {
    /**
    * Name of the registered service.
    */
    'name': string;
    /**
    * List of the registered service group by service version.
    */
    'versions': Array<VersionOclVo>;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "name",
            "baseName": "name",
            "type": "string",
            "format": ""
        },
        {
            "name": "versions",
            "baseName": "versions",
            "type": "Array<VersionOclVo>",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return CategoryOclVo.attributeTypeMap;
    }

    public constructor() {
    }
}
