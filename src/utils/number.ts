function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = "0." + new Array(e).join("0") + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split("+")[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += new Array(e + 1).join("0");
    }
  }
  return x;
}

export function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function normalize(number: string, decimals: number) {
  return parseFloat(
    (
      parseFloat(number) *
      (decimals
        ? parseFloat(
            `0.${new Array((decimals > 16 ? 16 : decimals) - 1)
              .fill(0)
              .join("")}1`
          )
        : 1)
    ).toFixed(decimals > 16 ? 16 : decimals)
  );
}
export const _ = (v) => {
  return parseFloat(parseFloat(v === 0 ? "0.000000001" : v).toFixed(9));
};
