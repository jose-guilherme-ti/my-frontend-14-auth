import { fetchRemote } from "@/utils/fetchRemote";
export interface CounterStore {
    count: number;
    increment: () => void;
}

//const useCounterStore = await fetchRemote("./counterStore");
