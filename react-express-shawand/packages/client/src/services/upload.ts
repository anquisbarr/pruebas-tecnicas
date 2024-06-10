import { API_HOST } from "../config";
import { ApiUploadResponse, Data } from "../types";

export const uploadFile = async (file: File): Promise<[Error?, Data?]> => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await fetch(`${API_HOST}/api/files`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      return [new Error(`Error uploading file: ${res.statusText}`), undefined];
    }
    const json = (await res.json()) as ApiUploadResponse;
    return [undefined, json.data];
  } catch (e) {
    if (e instanceof Error) {
      return [e, undefined];
    }
    return [new Error("Unkown error"), undefined];
  }
};
