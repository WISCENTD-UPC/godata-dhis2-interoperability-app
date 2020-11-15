import { DataSource, GeneratedTemplate, StyleSource } from "../../domain/entities/Template";

export default class implements GeneratedTemplate {
    public readonly id = "PROGRAM_GENERATED_v1";
    public readonly name = "Auto-generated program template";

    public readonly rowOffset = 5;
    public readonly colOffset = 1;

    public readonly dataSources: DataSource[] = [
        {
            type: "row",
            orgUnit: {
                sheet: "Data Entry",
                type: "column",
                ref: "A",
            },
            period: {
                sheet: "Data Entry",
                type: "column",
                ref: "E",
            },
            attribute: {
                sheet: "Data Entry",
                type: "column",
                ref: "D",
            },
            range: {
                sheet: "Data Entry",
                rowStart: 8,
                columnStart: "F",
            },
            dataElement: {
                sheet: "Data Entry",
                type: "row",
                ref: 7,
            },
        },
    ];

    public readonly styleSources: StyleSource[] = [];
}