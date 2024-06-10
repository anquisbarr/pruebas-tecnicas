import React, { useState } from "react";
import { toast, Toaster } from "sonner";
import "./App.css";
import { uploadFile } from "./services/upload";
import { Search } from "./steps/Search";
import { Data } from "./types";

const APP_STATUS = {
  IDLE: "idle",
  ERROR: "error",
  READY_UPLOAD: "ready-upload",
  UPLOADING: "uploading",
  READY_USAGE: "ready-usage",
} as const;

type AppStatusType = (typeof APP_STATUS)[keyof typeof APP_STATUS];

function App() {
  const [status, setStatus] = useState<AppStatusType>(APP_STATUS.IDLE);
  const [data, setData] = useState<Data>([]);
  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = e?.target.files ?? [];
    if (file) {
      setFile(file);
      setStatus(APP_STATUS.READY_UPLOAD);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status !== APP_STATUS.READY_UPLOAD || !file) {
      return;
    }

    setStatus(APP_STATUS.UPLOADING);

    const [err, newData] = await uploadFile(file);
    console.log(newData);

    if (err) {
      setStatus(APP_STATUS.ERROR);
      toast.error("Error uploading file");
      return;
    }

    if (!newData) {
      setStatus(APP_STATUS.ERROR);
      toast.error("Error uploading file");
      return;
    }

    setData(newData);
    setStatus(APP_STATUS.READY_USAGE);
    toast.success("Files upload successfully!");
  };

  const show_button =
    status === APP_STATUS.READY_UPLOAD ||
    status === APP_STATUS.UPLOADING ||
    status === APP_STATUS.READY_USAGE;

  const showInput = status !== APP_STATUS.READY_USAGE;

  return (
    <>
      <Toaster />
      <h4>Challange: Upload CSV file and display the data in a table</h4>
      <div>
        {showInput && (
          <form onSubmit={handleSubmit}>
            <label>
              <input
                name="file"
                type="file"
                accept=".csv"
                onChange={handleInputChange}
              />
            </label>
            {show_button && (
              <button disabled={status === APP_STATUS.UPLOADING}>
                Subir archivo
              </button>
            )}
          </form>
        )}

        {status === APP_STATUS.READY_USAGE && <Search initialData={data} />}
      </div>
    </>
  );
}

export default App;
