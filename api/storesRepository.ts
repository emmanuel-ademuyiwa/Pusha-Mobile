import {
  CollectionsEndpoints,
  IChangeCollectionProductsPayload,
  ICreateCollectionPayload,
  ICreateCollectionWithProductsPayload,
  ICreateShippingFeePayload,
  ICreateStoreFeePayload,
  ICreateStorePayload,
  IEditCollectionPayload,
  IEditShippingFeePayload,
  IEditStoreFeePayload,
  ListStoreAttributesEndpoint,
  StoreEndpoints
} from '@baze-sdk/schema'

import {UseEndpoint} from '@/utils/api'

export default {
  createStore: (payload: typeof StoreEndpoints.createStore.bodyType) => {
    return UseEndpoint({
      endpoint: StoreEndpoints.createStore,
      payload
    })
  },
  updateStore: async (
    payload: Partial<ICreateStorePayload>,
    storeId: string
  ) => {
    return UseEndpoint({
      endpoint: StoreEndpoints.editStore,
      payload,
      query: {id: storeId}
    })
  },
  fetchStoreConfigOptions: () => {
    return UseEndpoint({
      endpoint: ListStoreAttributesEndpoint
    })
  },
  fetchSubdomainSuggestion: (storeId: string) => {
    return UseEndpoint({
      endpoint: StoreEndpoints.fetchSubdomainSuggestion,
      query: {id: storeId}
    })
  },
  publishStore: (storeId: string, payload: string) => {
    return UseEndpoint({
      endpoint: StoreEndpoints.publishStore,
      payload: {subdomain: payload},
      query: {id: storeId}
    })
  },
  createCollection: (storeId: string, payload: ICreateCollectionPayload) => {
    return UseEndpoint({
      endpoint: CollectionsEndpoints.createCollection,
      payload,
      query: {id: storeId}
    })
  },
  createCollectionWithProducts: (
    storeId: string,
    payload: ICreateCollectionWithProductsPayload
  ) => {
    return UseEndpoint({
      endpoint: CollectionsEndpoints.createCollectionWithProducts,
      payload,
      query: {id: storeId}
    })
  },
  listCollection: (storeId: string) => {
    return UseEndpoint({
      endpoint: CollectionsEndpoints.listCollectionsForStore,
      query: {id: storeId}
    })
  },
  getCollection: (collectionId: string) => {
    return UseEndpoint({
      endpoint: CollectionsEndpoints.viewOneCollection,
      query: {id: collectionId}
    })
  },
  editCollectionName: (
    collectionId: string,
    payload: IEditCollectionPayload
  ) => {
    return UseEndpoint({
      endpoint: CollectionsEndpoints.editCollection,
      payload,
      query: {id: collectionId}
    })
  },
  editCollectionProducts: (
    collectionId: string,
    payload: IChangeCollectionProductsPayload
  ) => {
    return UseEndpoint({
      endpoint: CollectionsEndpoints.changeCollectionProducts,
      query: {id: collectionId},
      payload
    })
  },
  deleteCollection: (collectionId: string) => {
    return UseEndpoint({
      endpoint: CollectionsEndpoints.deleteCollection,
      query: {id: collectionId}
    })
  },
  addShippingFee: (storeId: string, payload: ICreateShippingFeePayload) => {
    return UseEndpoint({
      endpoint: StoreEndpoints.addShippingFee,
      payload,
      query: {id: storeId}
    })
  },
  editShippingFee: (storeId: string, payload: IEditShippingFeePayload) => {
    return UseEndpoint({
      endpoint: StoreEndpoints.editShippingFee,
      payload,
      query: {id: storeId}
    })
  },
  addStoreCharge: (storeId: string, payload: ICreateStoreFeePayload) => {
    return UseEndpoint({
      endpoint: StoreEndpoints.addOtherFee,
      payload,
      query: {id: storeId}
    })
  },
  editStoreCharge: (storeId: string, payload: IEditStoreFeePayload) => {
    return UseEndpoint({
      endpoint: StoreEndpoints.editOtherFee,
      payload,
      query: {id: storeId}
    })
  }
}
