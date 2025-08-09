import { parse, stringify } from "yaml";

/**
 * Custom YAML engine for gray-matter that uses double quotes for strings
 */
export const doubleQuoteYamlEngine = {
  parse: (str: string) => {
    return parse(str);
  },
  stringify: (obj: any) => {
    return stringify(obj, {
      defaultStringType: "PLAIN",
      defaultKeyType: "PLAIN",
      lineWidth: 0,
      doubleQuotedAsJSON: true,
      singleQuote: false,
    });
  },
};
