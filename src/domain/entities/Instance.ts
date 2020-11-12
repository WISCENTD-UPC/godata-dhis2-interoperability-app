//the structure is the same for DHIS2 and Go.Data
interface BaseInstance {
    url: string;
}

interface LocalInstance extends BaseInstance {
    url: string;
}

interface ExternalInstance extends BaseInstance {
    url: string;
    username: string;
    password: string;
}

export type Instance = LocalInstance | ExternalInstance;