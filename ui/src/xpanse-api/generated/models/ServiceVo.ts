/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

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

export class ServiceVo {
    /**
     * The ID of the service
     */
    'id'?: string;
    /**
     * The catalog of the service
     */
    'category'?: ServiceVoCategoryEnum;
    /**
     * The name of the service
     */
    'name'?: string;
    /**
     * The version of the service
     */
    'version'?: string;
    /**
     * The provider of the service
     */
    'csp'?: ServiceVoCspEnum;
    /**
     * The flavor of the service
     */
    'flavor'?: string;
    /**
     * The state of the service
     */
    'serviceState'?: ServiceVoServiceStateEnum;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{ name: string; baseName: string; type: string; format: string }> = [
        {
            name: 'id',
            baseName: 'id',
            type: 'string',
            format: 'uuid',
        },
        {
            name: 'category',
            baseName: 'category',
            type: 'ServiceVoCategoryEnum',
            format: '',
        },
        {
            name: 'name',
            baseName: 'name',
            type: 'string',
            format: '',
        },
        {
            name: 'version',
            baseName: 'version',
            type: 'string',
            format: '',
        },
        {
            name: 'csp',
            baseName: 'csp',
            type: 'ServiceVoCspEnum',
            format: '',
        },
        {
            name: 'flavor',
            baseName: 'flavor',
            type: 'string',
            format: '',
        },
        {
            name: 'serviceState',
            baseName: 'serviceState',
            type: 'ServiceVoServiceStateEnum',
            format: '',
        },
    ];

    static getAttributeTypeMap() {
        return ServiceVo.attributeTypeMap;
    }

    public constructor() {}
}

export type ServiceVoCategoryEnum =
    | 'AI'
    | 'COMPUTE'
    | 'CONTAINER'
    | 'STORAGE'
    | 'NETWORK'
    | 'DATABASE'
    | 'MEDIA_SERVICE'
    | 'SECURITY'
    | 'MIDDLEWARE'
    | 'OTHERS';
export type ServiceVoCspEnum = 'aws' | 'azure' | 'alibaba' | 'huawei' | 'openstack';
export type ServiceVoServiceStateEnum =
    | 'registered'
    | 'deploying'
    | 'deploy_success'
    | 'deploy_failed'
    | 'destroying'
    | 'destroy_success'
    | 'destroy_failed';