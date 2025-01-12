"use server"
import { posterToken, posterUrl } from "@/lib/utils";

export async function createClient(data) { 
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append(
    "Cookie",
    "pos_session=V2YAPQJhB2pXfAghVTwGMw9tA2pQJwJxV25aIwdzVmkFYwdvAQxXN1NnAidXOgAkVjwKY1MyBDoAcFVlXWwMPVZrXmUBZVxrCTZTZldhBG5XZgAwAmcHYlcwCGtVMQZkD24DNVA3AmFXPVo1BzBWZgU5BzQBa1c%2FUzYCJ1c6ACRWPAphUzAEOgBwVW9deAxTVmteMAFiXHgJZVMmV3YEL1c8AHQCbgdhVzQIaFUkBjMPZANlUCsCM1c%2BWmgHLlYyBSIHMwFiV2hTIQI%2BV3IAbVY3CmBTOgQiACdVdV1tDH5WVV41AWFcbwluUyFXJwQ2V3QAPQJmB2FXPQhwVVYGbQ8uAyRQaAJjV2VaAgd1Vm4FeAdoAT5XO1MsAjJXLwBjVjUKflMwBCIAaVV1XTIMPVY5Xm4BJFxmCWFTJldxBFJXZgBkAiAHOVdxCDtVcgZ7D38Da1BsAjhXOlpnBzNWNgU5BzEBa1doUzsCMlc6ACRWPAppUzoEIgAnVXVdbQx%2BVlVeMAFnXH4JYVN3Vz4Eflc9ADcCbgdyVyUIaVV7"
  );

  const raw = JSON.stringify(data);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const res = fetch(
    `${posterUrl}/api/clients.createClient?token=${posterToken}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.error(error));
  return res;
}
