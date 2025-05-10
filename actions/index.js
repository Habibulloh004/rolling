"use server";
import {
  url,
  posterToken,
  posterUrl,
  production,
  urlRender,
} from "@/lib/utils";
import { cookies } from "next/headers";

export async function sendSmsToUser(code, phone) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    phone: phone,
    message: `Rolling Sushi: Ilovamizda ro'yxatdan o'tkaningiz uchun minnatdorchilik bildiramiz. Tasdiqlash uchun kod: ${code}`,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const res = fetch(`${url}/send_sms`, requestOptions)
    .then((response) => response.json())
    .then((result) => JSON.parse(result.message))
    .catch((error) => console.error(error));
  return res;
}

export async function getCategories() {
  const myHeaders = new Headers();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const res = fetch(
    "https://joinposter.com/api/menu.getCategories?token=046902:6281755091471320780488d484cc4b78",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => result.response)
    .catch((error) => console.error(error));
  return res;
}
export async function getOrder(id) {
  const myHeaders = new Headers();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const res = fetch(`${url}/get_order/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.error(error));
  return res;
}
export async function getOrderRender(id) {
  const myHeaders = new Headers();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const res = fetch(`${urlRender}/api/transaction/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.error(error));
  return res;
}
export async function getAllOrders() {
  const myHeaders = new Headers();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const res = fetch(`${url}/get_all_orders`, requestOptions)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.error(error));
  return res;
}

export async function getClientGroup() {
  const myHeaders = new Headers();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const res = fetch(
    `${posterUrl}/api/clients.getGroups?token=${posterToken}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => result.response)
    .catch((error) => console.error(error));
  return res;
}

export async function getClient(id) {
  const cookieStore = await cookies();
  const myHeaders = new Headers();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const res = fetch(
    `${posterUrl}/api/clients.getClient?token=${posterToken}&client_id=${id}`,
    requestOptions
  )
    .then((response) => response.json())
    .then(async (result) => {
      await cookieStore.set({
        name: "client",
        value: JSON.stringify(result.response),
        options: {
          maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
          httpOnly: true, // Optional: Prevent access to the cookie from client-side JavaScript
          secure: production, // Optional: Ensures the cookie is sent over HTTPS only
        },
      });
      return result.response;
    })
    .catch((error) => {
      console.log(error);
    });

  return res;
}
export async function getClientData(id) {
  const cookieStore = await cookies();
  const myHeaders = new Headers();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const res = fetch(
    `${posterUrl}/api/clients.getClient?token=${posterToken}&client_id=${id}`,
    requestOptions
  )
    .then((response) => response.json())
    .then(async (result) => {
      return result.response;
    })
    .catch((error) => {
      console.log(error, "error");
    });

  return res;
}
export async function getSpotsData() {
  const myHeaders = new Headers();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const res = fetch(
    `${posterUrl}/api/spots.getSpots?token=${posterToken}`,
    requestOptions
  )
    .then((response) => response.json())
    .then(async (result) => {
      return result.response;
    })
    .catch((error) => {
      console.log(error);
    });

  return res;
}

export async function getClients() {
  const myHeaders = new Headers();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const res = fetch(
    `${posterUrl}/api/clients.getClients?token=${posterToken}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => result.response)
    .catch((error) => console.error(error));
  return res;
}
