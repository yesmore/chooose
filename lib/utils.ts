import ms from "ms";

export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
  if (!timestamp) return "never";
  return `${ms(Date.now() - new Date(timestamp).getTime())}${
    timeOnly ? "" : " ago"
  }`;
};

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const json = await res.json();
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number;
      };
      error.status = res.status;
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }

  return res.json();
}

// export const fetcherSWR = (...args: any[]) =>
// fetch(...args).then((res) => res.json());

export function nFormatter(num: number, digits?: number) {
  if (!num) return "0";
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol
    : "0";
}

export function capitalize(str: string) {
  if (!str || typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const truncate = (str: string, length: number) => {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length)}...`;
};

export const isAllAlphabetic = (inputString: string) => {
  return /^[A-Za-z]+$/.test(inputString);
};

export function isEmail(str: string) {
  const reg = /^([a-zA-Z\d._%+-]+)@([a-zA-Z\d.-]+\.[a-zA-Z]{2,})$/;
  return reg.test(str);
}

export function getAvatarById(id: string) {
  return `https://avatars.dicebear.com/api/micah/${id}.svg`;
}

export function formatDate(dateString: string) {
  const sourceDate = new Date(dateString).getTime();
  const currentDate = new Date().getTime();

  const timeDiff = currentDate - sourceDate;
  const secondsDiff = Math.floor(timeDiff / 1000); // 计算秒数差

  if (secondsDiff < 60) {
    return `${secondsDiff}秒前`;
  } else if (secondsDiff < 3600) {
    // 不足1小时
    const minutesDiff = Math.floor(secondsDiff / 60);
    return `${minutesDiff}分钟前`;
  } else if (secondsDiff < 86400) {
    // 不足1天
    const hoursDiff = Math.floor(secondsDiff / 3600);
    return `${hoursDiff}小时前`;
  } else {
    const daysDiff = Math.floor(secondsDiff / 86400);
    return `${daysDiff}天前`;
  }
}

export function generateName(id: string) {
  return `未知病友${id.slice(-6)}`;
}
