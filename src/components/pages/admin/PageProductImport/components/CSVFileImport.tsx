import React from "react";
import Typography from "@mui/material/Typography";
import axios, { AxiosError } from "axios";
import Box from "@mui/material/Box";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<any>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);

    // Get the presigned URL
    let authorizationToken = localStorage.getItem("authorization_token");
    if (!authorizationToken) {
      authorizationToken = btoa("dheeraj_anumula:TEST_PASSWORD");
      localStorage.setItem("authorization_token", authorizationToken);
    }
    try {
      const response = await axios({
        method: "GET",
        url,
        params: {
          name: encodeURIComponent(file?.name),
        },
        headers: {
          Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
        },
      });
      console.log("File to upload: ", file?.name);
      console.log("Uploading to: ", response.data);
      const result = await fetch(response.data, {
        method: "PUT",
        body: file,
      });
      console.log("Result: ", result);
      setFile("");
    } catch (error: AxiosError | any) {
      if (error?.response?.status === 401) {
        alert("Unauthorized!");
      }

      if (error?.response?.status === 403) {
        alert(`${error?.response?.data?.message} - status code: 403`);
      }
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
