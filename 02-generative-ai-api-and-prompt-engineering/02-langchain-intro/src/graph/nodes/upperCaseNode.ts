import { type GraphStateType } from "../graph.ts";

export function upperCaseNode(state: GraphStateType): GraphStateType {
    const responseText = state.output.toUpperCase();

    return {
        ...state,
        output: responseText
    }
}
