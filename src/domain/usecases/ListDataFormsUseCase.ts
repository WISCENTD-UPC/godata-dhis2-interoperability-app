import { InstanceRepository } from "../repositories/InstanceRepository";

export class ListDataFormsUseCase {
    constructor(private instance: InstanceRepository) {}

    public async execute() {
        const dataSets = await this.instance.getDataForms({ type: ["dataSets"] });
        const programs = await this.instance.getDataForms({ type: ["programs"] });
        return { dataSets, programs };
    }
}