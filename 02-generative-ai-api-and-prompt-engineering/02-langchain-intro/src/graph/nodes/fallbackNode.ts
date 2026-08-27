import { AIMessage } from "@langchain/core/messages";
import { type GraphStateType } from "../graph.ts";

export function fallbackNode(state: GraphStateType): GraphStateType {
    const message = 'Unknown command. Please use "uppercase" or "lowercase".';
    const fallbackMessage = new AIMessage(message).content.toString();

    return {
        ...state,
        output: fallbackMessage,
        messages: [
            ...state.messages,
        ]
    }
}
