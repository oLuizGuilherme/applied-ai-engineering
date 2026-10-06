import { tool } from "@langchain/core/tools";
import csvtojson from "csvtojson";
import { z } from "zod";

export function getCSVTOJSONTool() {
    return tool(
        async ({ csvText }) => {
            const result = await csvtojson().fromString(csvText);
            console.log('[getCSVToJSONTool] conversion result finished', result.length, 'records');

            return JSON.stringify(result);
        },
        {
            name: 'csv_to_json',
            description: 'Converts CSV text to JSON format.',
            schema: z.object({
                csvText: z.string().describe('The CSV text to be converted to JSON.')
            })
        }
    )
}