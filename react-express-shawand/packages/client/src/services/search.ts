import { API_HOST } from "../config";
import { ApiSearchResponse, Data } from "../types";

export const searchData = async (search: string): Promise<[Error?, Data?]> => {
  try {
    const res = await fetch(`${API_HOST}/api/users?q=${search}`);
    if (!res.ok) {
      return [new Error(`Error searching data:: ${res.statusText}`), undefined];
    }
    const json = (await res.json()) as ApiSearchResponse;
    return [undefined, json.data];
  } catch (e) {
    if (e instanceof Error) {
      return [e, undefined];
    }
    return [new Error("Unkown error"), undefined];
  }
};
