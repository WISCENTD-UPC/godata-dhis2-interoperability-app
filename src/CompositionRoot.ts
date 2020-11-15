import { D2Api } from "./types/d2-api";
import { ConfigWebRepository, JsonConfig } from "./data/ConfigWebRepository";

import { InstanceDhisRepository } from "./data/InstanceDhisRepository";
import { StorageConstantRepository } from "./data/StorageConstantRepository";
import { StorageDataStoreRepository } from "./data/StorageDataStoreRepository";
import { TemplateWebRepository } from "./data/TemplateWebRepository";
import { Instance } from "./domain/entities/Instance";
import { ConfigRepository } from "./domain/repositories/ConfigRepository";
import { InstanceRepository } from "./domain/repositories/InstanceRepository";
import { StorageRepository } from "./domain/repositories/StorageRepository";
import { TemplateRepository } from "./domain/repositories/TemplateRepository";

import { DeleteThemeUseCase } from "./domain/usecases/DeleteThemeUseCase";
//import { ListLanguagesUseCase } from "./domain/usecases/ListLanguagesUseCase";
import { ListThemesUseCase } from "./domain/usecases/ListThemesUseCase";
import { SaveThemeUseCase } from "./domain/usecases/SaveThemeUseCase";

import { ReadSettingsUseCase } from "./domain/usecases/ReadSettingsUseCase"
import { WriteSettingsUseCase } from "./domain/usecases/WriteSettingsUseCase"
import { GetDefaultSettingsUseCase } from "./domain/usecases/GetDefaultSettingsUseCase"

import { ListDataFormsUseCase } from "./domain/usecases/ListDataFormsUseCase"

export interface CompositionRootOptions {
    appConfig: JsonConfig;
    dhisInstance: Instance;
    mockApi?: D2Api;
}

export class CompositionRoot {
    private static compositionRoot: CompositionRoot;
    private readonly instance: InstanceRepository;
    private readonly config: ConfigRepository;
    private readonly storage: StorageRepository;
    private readonly templateManager: TemplateRepository;
    

    private constructor({ appConfig, dhisInstance, mockApi }: CompositionRootOptions) {
        this.instance = new InstanceDhisRepository(dhisInstance, mockApi); 
        this.config = new ConfigWebRepository(appConfig);
        this.storage =
            this.config.getAppStorage() === "dataStore"
                ? new StorageDataStoreRepository(dhisInstance, mockApi)
                : new StorageConstantRepository(dhisInstance, mockApi);
        this.templateManager = new TemplateWebRepository(this.storage);
        
    }

    public static initialize(options: CompositionRootOptions) {
        if (!CompositionRoot.compositionRoot) {
            CompositionRoot.compositionRoot = new CompositionRoot(options);
        }
    }

    public static attach(): CompositionRoot {
        if (!CompositionRoot.compositionRoot) {
            throw new Error("Composition root has not been initialized");
        }
        return CompositionRoot.compositionRoot;
    }
    /*
    public get orgUnits() {
        return {
            getUserRoots: new GetOrgUnitRootsUseCase(this.instance),
            getRootsByForm: new GetFormOrgUnitRootsUseCase(this.instance),
        };
    }

    public get form() {
        return {
            getDataPackage: new GetFormDataPackageUseCase(this.instance),
        };
    }*/
    public get templates() {
        return {
            list: new ListDataFormsUseCase(this.instance),
        };
    }

    public get themes() {
        return {
            list: new ListThemesUseCase(this.templateManager),
            save: new SaveThemeUseCase(this.templateManager),
            delete: new DeleteThemeUseCase(this.templateManager),
        };
    }
    
    public get settings() {
        return {
            getDefault: new GetDefaultSettingsUseCase(this.config),
            read: new ReadSettingsUseCase(this.storage),
            write: new WriteSettingsUseCase(this.storage),
        };
    }
    /*
    public get languages() {
        return {
            list: new ListLanguagesUseCase(this.instance),
        };
    }*/
}