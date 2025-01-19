"use client"
import React from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";

const MyMap = ({ latitude, longitude }) => {
  return (
    <YMaps query={{ apikey:"0cce4c39-8879-4e3c-b343-288c3e6adcd0"}}>
      <Map
        defaultState={{
          center: [latitude, longitude],
          zoom: 17,
        }}
        width="100%"
        height="100%"
      >
        <Placemark geometry={[latitude, longitude]} />
      </Map>
    </YMaps>
  );
};

export default MyMap;
