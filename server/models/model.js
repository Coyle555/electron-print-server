import Printer from "unix-print";
import fs from "fs";

const Model = {
  Printer: Printer,

  DATA_DEFAULT: ["printer"],

  tmpNameGenerator: (length) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  getDefaultPrintingOptions: () => {
    const options = {};

    Model.DATA_DEFAULT.forEach((el) => {
      const output = fs.readFileSync(`./data/${el}.txt`, "utf8");
      console.log(output);
      options[el] = output;
    });

    return options;
  },

  printFile: (filepath, options, def, fnc) => {
    const optionsDef = Model.getDefaultPrintingOptions();
    options.printer =
      options.printer || optionsDef["printer"] !== "[default]"
        ? optionsDef["printer"]
        : def["printer"];

    Printer.print(filepath, options).then(fnc);

    return true;
  },
};

export default Model;
