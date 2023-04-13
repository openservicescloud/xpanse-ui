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

import { DeployVariable } from './DeployVariable';

/**
 * The deployment of the managed service
 */
export class Deployment {
    /**
     * The type of the Deployer which will handle the service deployment
     */
    'kind': DeploymentKindEnum;
    /**
     * The variables for the deployment, which will be passed to the deployer
     */
    'variables': Array<DeployVariable>;
    /**
     * The real deployer, something like terraform scripts...
     */
    'deployer': string;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{ name: string; baseName: string; type: string; format: string }> = [
        {
            name: 'kind',
            baseName: 'kind',
            type: 'DeploymentKindEnum',
            format: '',
        },
        {
            name: 'variables',
            baseName: 'variables',
            type: 'Array<DeployVariable>',
            format: '',
        },
        {
            name: 'deployer',
            baseName: 'deployer',
            type: 'string',
            format: '',
        },
    ];

    static getAttributeTypeMap() {
        return Deployment.attributeTypeMap;
    }

    public constructor() {}
}

export type DeploymentKindEnum = 'terraform';
