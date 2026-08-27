import { AIMessage } from "langchain";
import { type GraphStateType } from "../graph.ts";

export function chatResponse(state: GraphStateType): GraphStateType {
    const responseText = state.output;

    const aiMessage = new AIMessage(responseText);

    return {
        ...state,
        messages: [
            ...state.messages,
            aiMessage
        ]
    }
}
