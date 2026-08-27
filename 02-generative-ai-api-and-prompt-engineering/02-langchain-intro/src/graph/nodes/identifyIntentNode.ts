import { type GraphStateType } from "../graph.ts";

export function identifyIntent(state: GraphStateType): GraphStateType {
    const input = state.messages.at(-1)?.text ?? "";
    const inputLower = input.toLowerCase();

    let command: GraphStateType["command"] = 'unknown';

    if (inputLower.includes("upper")) {
        command = "uppercase";
    } else if (inputLower.includes("lower")) {
        command = "lowercase";
    }

    return {
        ...state,
        command,
        output: input
    }
}
