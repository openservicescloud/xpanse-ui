import { ResponseContext, RequestContext, HttpFile } from '../http/http';
import { Configuration} from '../configuration'


import { ObservableAdminApi } from './ObservableAPI';

import { AdminApiRequestFactory, AdminApiResponseProcessor} from "../apis/AdminApi";
export class PromiseAdminApi {
    private api: ObservableAdminApi

    public constructor(
        configuration: Configuration,
        requestFactory?: AdminApiRequestFactory,
        responseProcessor?: AdminApiResponseProcessor
    ) {
        this.api = new ObservableAdminApi(configuration, requestFactory, responseProcessor);
    }

    /**
     */
    public health(_options?: Configuration): Promise<SystemStatus> {
        const result = this.api.health(_options);
        return result.toPromise();
    }


}



import { ObservableServiceApi } from './ObservableAPI';

import { ServiceApiRequestFactory, ServiceApiResponseProcessor} from "../apis/ServiceApi";
export class PromiseServiceApi {
    private api: ObservableServiceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ServiceApiRequestFactory,
        responseProcessor?: ServiceApiResponseProcessor
    ) {
        this.api = new ObservableServiceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Start a task to deploy registered service.
     * @param createRequest 
     */
    public deploy(createRequest: CreateRequest, _options?: Configuration): Promise<string> {
        const result = this.api.deploy(createRequest, _options);
        return result.toPromise();
    }

    /**
     * Start a task to destroy the deployed service using id.
     * @param id 
     */
    public destroy(id: string, _options?: Configuration): Promise<Response> {
        const result = this.api.destroy(id, _options);
        return result.toPromise();
    }

    /**
     * @param id 
     */
    public openApi(id: string, _options?: Configuration): Promise<string> {
        const result = this.api.openApi(id, _options);
        return result.toPromise();
    }

    /**
     * Get deployed service using id.
     * @param id Task id of deploy service
     */
    public serviceDetail(id: string, _options?: Configuration): Promise<DeployServiceEntity> {
        const result = this.api.serviceDetail(id, _options);
        return result.toPromise();
    }

    /**
     * List the deployed services.
     */
    public services(_options?: Configuration): Promise<Array<ServiceVo>> {
        const result = this.api.services(_options);
        return result.toPromise();
    }


}



import { ObservableServiceVendorApi } from './ObservableAPI';

import { ServiceVendorApiRequestFactory, ServiceVendorApiResponseProcessor} from "../apis/ServiceVendorApi";
import { SystemStatus } from '../models/SystemStatus';
import { CreateRequest } from '../models/CreateRequest';
import { DeployServiceEntity } from '../models/DeployServiceEntity';
import { ServiceVo } from '../models/ServiceVo';
import { OclDetailVo } from '../models/OclDetailVo';
import { RegisterServiceEntity } from '../models/RegisterServiceEntity';
import { CategoryOclVo } from '../models/CategoryOclVo';
import { Ocl } from '../models/Ocl';
export class PromiseServiceVendorApi {
    private api: ObservableServiceVendorApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ServiceVendorApiRequestFactory,
        responseProcessor?: ServiceVendorApiResponseProcessor
    ) {
        this.api = new ObservableServiceVendorApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get registered service using id.
     * @param id id of registered service
     */
    public detail(id: string, _options?: Configuration): Promise<OclDetailVo> {
        const result = this.api.detail(id, _options);
        return result.toPromise();
    }

    /**
     * Register new service with URL of Ocl file.
     * @param oclLocation URL of Ocl file
     */
    public fetch(oclLocation: string, _options?: Configuration): Promise<string> {
        const result = this.api.fetch(oclLocation, _options);
        return result.toPromise();
    }

    /**
     * Update registered service using id and ocl file url.
     * @param id id of registered service
     * @param oclLocation URL of Ocl file
     */
    public fetchUpdate(id: string, oclLocation: string, _options?: Configuration): Promise<Response> {
        const result = this.api.fetchUpdate(id, oclLocation, _options);
        return result.toPromise();
    }

    /**
     * Get category list.
     */
    public listCategories(_options?: Configuration): Promise<Array<string>> {
        const result = this.api.listCategories(_options);
        return result.toPromise();
    }

    /**
     * List registered service with query params.
     * @param categoryName category of the service
     * @param cspName name of the service provider
     * @param serviceName name of the service
     * @param serviceVersion version of the service
     */
    public listRegisteredServices(categoryName?: string, cspName?: string, serviceName?: string, serviceVersion?: string, _options?: Configuration): Promise<Array<RegisterServiceEntity>> {
        const result = this.api.listRegisteredServices(categoryName, cspName, serviceName, serviceVersion, _options);
        return result.toPromise();
    }

    /**
     * List registered service group by serviceName, serviceVersion, cspName with category.
     * @param categoryName category of the service
     */
    public listRegisteredServicesTree(categoryName: string, _options?: Configuration): Promise<Array<CategoryOclVo>> {
        const result = this.api.listRegisteredServicesTree(categoryName, _options);
        return result.toPromise();
    }

    /**
     * Register new service using ocl model.
     * @param ocl 
     */
    public register(ocl: Ocl, _options?: Configuration): Promise<string> {
        const result = this.api.register(ocl, _options);
        return result.toPromise();
    }

    /**
     * Unregister registered service using id.
     * @param id id of registered service
     */
    public unregister(id: string, _options?: Configuration): Promise<Response> {
        const result = this.api.unregister(id, _options);
        return result.toPromise();
    }

    /**
     * Update registered service using id and ocl model.
     * @param id id of registered service
     * @param ocl 
     */
    public update(id: string, ocl: Ocl, _options?: Configuration): Promise<Response> {
        const result = this.api.update(id, ocl, _options);
        return result.toPromise();
    }


}


