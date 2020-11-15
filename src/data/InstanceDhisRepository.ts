import { GetDataFormsParams, InstanceRepository } from "../domain/repositories/InstanceRepository";
import { Instance } from "../domain/entities/Instance";
import { D2Api, D2ApiDefault } from "../types/d2-api";
import { DataForm, DataFormPeriod } from "../domain/entities/DataForm";

export class InstanceDhisRepository implements InstanceRepository {
    private api: D2Api;

    constructor({ url }: Instance, mockApi?: D2Api) {
        this.api = mockApi ?? new D2ApiDefault({ baseUrl: url});
    }

    public async getDataForms({
        type = ["dataSets", "programs"],
        ids,
    }: GetDataFormsParams = {}): Promise<DataForm[]> {
        const dataSets = type.includes("dataSets") ? await this.getDataSets(ids) : [];
        const programs = type.includes("programs") ? await this.getPrograms(ids) : [];

        return [...dataSets, ...programs];
    }

    private async getDataSets(ids?: string[]): Promise<DataForm[]> {
        const { objects } = await this.api.models.dataSets
            .get({
                paging: false,
                fields: {
                    id: true,
                    displayName: true,
                    name: true,
                    attributeValues: { value: true, attribute: { code: true } },
                    dataSetElements: { dataElement: { id: true, formName: true, name: true } },
                    periodType: true,
                    access: true,
                },
                filter: {
                    id: ids ? { in: ids } : undefined,
                },
            })
            .getData();

        return objects.map(
            ({ displayName, name, access, periodType, dataSetElements, ...rest }) => ({
                ...rest,
                type: "dataSets",
                name: displayName ?? name,
                periodType: periodType as DataFormPeriod,
                //@ts-ignore https://github.com/EyeSeeTea/d2-api/issues/43
                readAccess: access.data?.read,
                //@ts-ignore https://github.com/EyeSeeTea/d2-api/issues/43
                writeAccess: access.data?.write,
                dataElements: dataSetElements
                    .map(({ dataElement }) => dataElement)
                    .map(({ formName, name, ...rest }) => ({
                        ...rest,
                        name: formName ?? name,
                    })),
            })
        );
    }

    private async getPrograms(ids?: string[]): Promise<DataForm[]> {
        const { objects } = await this.api.models.programs
            .get({
                paging: false,
                fields: {
                    id: true,
                    displayName: true,
                    name: true,
                    attributeValues: { value: true, attribute: { code: true } },
                    programStages: {
                        programStageDataElements: {
                            dataElement: { id: true, formName: true, name: true },
                        },
                    },
                    access: true,
                },
                filter: {
                    id: ids ? { in: ids } : undefined,
                    programType: { eq: "WITHOUT_REGISTRATION" },
                },
            })
            .getData();

        return objects.map(({ displayName, name, access, programStages, ...rest }) => ({
            ...rest,
            type: "programs",
            name: displayName ?? name,
            periodType: "Daily",
            //@ts-ignore https://github.com/EyeSeeTea/d2-api/issues/43
            readAccess: access.data?.read,
            //@ts-ignore https://github.com/EyeSeeTea/d2-api/issues/43
            writeAccess: access.data?.write,
            dataElements: programStages
                .flatMap(({ programStageDataElements }) =>
                    programStageDataElements.map(({ dataElement }) => dataElement)
                )
                .map(({ formName, name, ...rest }) => ({ ...rest, name: formName ?? name })),
        }));
    }
}