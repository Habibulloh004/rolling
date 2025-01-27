"use server";
import { posterToken, posterUrl, production, url } from "@/lib/utils";
import { cookies } from "next/headers";

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
export async function createIncomingOrder(data) {
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
    `${posterUrl}/api/incomingOrders.createIncomingOrder?token=${posterToken}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.error(error));
  return res;
}
export async function createOrder(data) {
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

  const res = fetch(`${url}/add_order`, requestOptions)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.error(error));
  return res;
}
export async function createOrderPoster(data) {
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
    `${posterUrl}/api/incomingOrders.createIncomingOrder?token=${posterToken}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.error(error));
  return res;
}

export async function updateClient(data) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const raw = JSON.stringify(data);

  const requestOptions = {
    method: "POST",
    body: raw,
    headers: myHeaders,
    redirect: "follow",
  };

  const res = fetch(
    `${posterUrl}/api/clients.updateClient?token=${posterToken}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((error) => console.error(error));
  return res;
}
export async function saveCookie(cookie) {
  try {
    // Assuming cookies() is a valid function that returns a cookie store
    const cookieStore = await cookies();

    await cookieStore.set({
      name: "client",
      value: JSON.stringify(cookie),
      options: {
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        httpOnly: true, // Optional: Prevent access to the cookie from client-side JavaScript
        secure: production, // Optional: Ensures the cookie is sent over HTTPS only
      },
    });

    return "data"; // or return a success status if needed
  } catch (error) {
    console.error("Failed to save cookie:", error);
    throw error; // Propagate the error to the caller
  }
}
