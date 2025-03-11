import Select, { StylesConfig } from "react-select";
import { sampleSchema, SampleSchemaType } from "./validation/sample";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import chroma from "chroma-js";

type Option = {
  id: number;
  value: string;
  label: string;
  status: string;
  hex_color_code: string;
};

const sampleOptions: Option[] = [
  {
    id: 1,
    value: "red",
    label: "red",
    status: "Active",
    hex_color_code: "#f71b1b",
  },
  {
    id: 2,
    value: "blue",
    label: "blue",
    status: "Active",
    hex_color_code: "#0000ff",
  },
  {
    id: 3,
    value: "yellow",
    label: "yellow",
    status: "Archive",
    hex_color_code: "#dbeb1f",
  },
];

const dot = (color = "transparent") => ({
  alignItems: "center",
  display: "flex",

  ":before": {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: "block",
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

const colorStyles: StylesConfig<Option> = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    borderRadius: 0,
    height: 50,
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.hex_color_code);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? color.css()
        : isFocused
        ? color.alpha(0.1).css()
        : undefined,
      color: isDisabled
        ? "#ccc"
        : isSelected
        ? chroma.contrast(color, "white") > 2
          ? "white"
          : "black"
        : data.hex_color_code,
      cursor: isDisabled ? "not-allowed" : "default",
      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled
          ? isSelected
            ? color.css()
            : color.alpha(0.3).css()
          : undefined,
      },
    };
  },
  input: (styles) => ({
    ...styles,
    ...dot(),
  }),
  placeholder: (styles) => ({
    ...styles,
    ...dot("#cccccc"),
  }),
  singleValue: (styles, { data }) => {
    const color = chroma(data.hex_color_code);
    return {
      ...styles,
      ...dot(color.css()),
    };
  },
};

const App = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SampleSchemaType>({
    resolver: zodResolver(sampleSchema),
    defaultValues: {
      name: sampleOptions[2].value,
    },
  });

  const onSubmit: SubmitHandler<SampleSchemaType> = async (formData) => {
    console.table(formData);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Name: </label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Select
              styles={colorStyles}
              options={sampleOptions}
              isSearchable={true}
              noOptionsMessage={() => "存在しない色です。"}
              isOptionDisabled={(option) => option.status === "Archive"}
              value={sampleOptions.find(
                (element) => element.value === field.value
              )}
              getOptionLabel={(option) =>
                option.label +
                (option.status === "Archive" ? " (非推奨の色です)" : "")
              }
              onChange={(newValue) =>
                field.onChange((newValue as Option)?.value)
              }
            />
          )}
        />
        <br />
        <ErrorMessage
          errors={errors}
          name="name"
          message={errors.name?.message}
        />
        <br />
        <input type="submit" value="送信" />
      </form>
    </>
  );
};

export default App;
