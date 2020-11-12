import { D2Api, D2ApiDefault, DataStore } from "../types/d2-api";
import { Instance } from "../domain/entities/Instance";
import { StorageRepository } from "../domain/repositories/StorageRepository";

const dataStoreNamespace = "interoperability";

export class StorageDataStoreRepository extends StorageRepository {
    private api: D2Api;
    private dataStore: DataStore;

    constructor({ url }: Instance, mockApi?: D2Api) {
        super();
        this.api = mockApi ?? new D2ApiDefault({ baseUrl: url });
        this.dataStore = this.api.dataStore(dataStoreNamespace);
    }

    public async getObject<T extends object>(key: string, defaultValue: T): Promise<T> {
        const value = await this.dataStore.get<T>(key).getData();
        if (!value) await this.saveObject(key, defaultValue);
        return value ?? defaultValue;
    }

    public async saveObject<T extends object>(key: string, value: T): Promise<void> {
        await this.dataStore.save(key, value).getData();
    }

    public async removeObject(key: string): Promise<void> {
        try {
            await this.dataStore.delete(key).getData();
        } catch (error) {
            if (!error.response || error.response.status !== 404) {
                throw error;
            }
        }
    }
}