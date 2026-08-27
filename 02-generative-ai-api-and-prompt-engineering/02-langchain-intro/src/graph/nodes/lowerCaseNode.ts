import { type GraphStateType } from "../graph.ts";

export function lowerCaseNode(state: GraphStateType): GraphStateType {
    const responseText = state.output.toLowerCase();

    return {
        ...state,
        output: responseText
    }
}
