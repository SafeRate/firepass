import React from "react";
import MaskedInput from "react-text-mask";
import { Input } from "@chakra-ui/react";

const InputPhoneNumber = (parentProps: any) => {
  const { onChange, ...styleProps } = parentProps;
  return (
    <MaskedInput
      mask={[
        "(",
        /[1-9]/,
        /\d/,
        /\d/,
        ")",
        " ",
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ]}
      onChange={onChange}
      type="tel"
      render={(ref, props) => <Input ref={ref} {...props} {...styleProps} />}
    />
  );
};

export default InputPhoneNumber;
