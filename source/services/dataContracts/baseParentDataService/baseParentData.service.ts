import * as ng from 'angular';

import { IBaseDataService, BaseDataService, IBaseDomainObject } from '../baseDataService/baseData.service';

export interface IBaseParentDataService<TDataType extends IBaseDomainObject, TSearchParams, TResourceDictionaryType>
	extends IBaseDataService<TDataType, TSearchParams>{
	childContracts(id: number): TResourceDictionaryType;
}

export class BaseParentDataService<TDataType extends IBaseDomainObject, TSearchParams, TResourceDictionaryType>
	extends BaseDataService<TDataType, TSearchParams> implements IBaseParentDataService<TDataType, TSearchParams, TResourceDictionaryType> {
	constructor($http: ng.IHttpService, $q: ng.IQService, endpoint: string, mockData: TDataType[], useMock: boolean
			, private resourceDictionaryBuilder: { (id: number): TResourceDictionaryType }) {
		super($http, $q, endpoint, mockData, useMock);
	}

	childContracts(id: number): TResourceDictionaryType {
		return this.resourceDictionaryBuilder(id);
	}
}
