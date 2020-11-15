//todo
import { DataForm } from "../entities/DataForm"

export interface GetDataFormsParams {
    ids?: string[];
    type?: Array<"dataSets" | "programs">;
}

export interface InstanceRepository {
    getDataForms(options?: GetDataFormsParams): Promise<DataForm[]>
}