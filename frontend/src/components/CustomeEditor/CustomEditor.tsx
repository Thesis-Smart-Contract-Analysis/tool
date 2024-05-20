import { Editor } from "@monaco-editor/react";
import React from "react";

const CustomEditor: React.FC<{
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  readOnly: boolean;
}> = ({ value, setValue, readOnly = false }) => {
  return (
    <Editor
      value={value}
      onChange={(value) => {
        setValue(value as string);
      }}
      defaultLanguage="sol"
      options={{
        readOnly,
      }}
    />
  );
};

export default CustomEditor;
