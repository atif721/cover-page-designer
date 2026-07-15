import { Text } from "@react-pdf/renderer";

export function getOrdinalParts(num: number): {
  number: number;
  suffix: string;
} {
  const lastTwoDigits = num % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return { number: num, suffix: "th" };
  }

  const lastDigit = num % 10;
  switch (lastDigit) {
    case 1:
      return { number: num, suffix: "st" };
    case 2:
      return { number: num, suffix: "nd" };
    case 3:
      return { number: num, suffix: "rd" };
    default:
      return { number: num, suffix: "th" };
  }
}

export function renderWithSuffix(num: number) {
  const { number, suffix } = getOrdinalParts(num);
  return (
    <>
      {number}
      <sup>{suffix}</sup>
    </>
  );
}

export function renderWithSuffixPDF(num: number) {
  const { number, suffix } = getOrdinalParts(num);
  return (
    <Text>
      {number}
      <Text
        style={{
          fontSize: 10,
          verticalAlign: "super",
        }}
      >
        {suffix}
      </Text>
    </Text>
  );
}
