import React, { useState, useEffect } from 'react';
import DeckGL from 'deck.gl';
import Mapbox from "react-map-gl"

import { load, fetchFile, parse } from "@loaders.gl/core";
import { ZipLoader } from '@loaders.gl/zip';

import { csvParse } from 'd3-dsv';


import { renderLayers } from "./RenderLayers";


//バイナリデータ(text)をデコードする
async function decodeText(buffer, charset = "utf-8") {
    if (window.TextDecoder) {
        const decoder = new TextDecoder(charset);
        return decoder.decode(buffer);
    }

    return new Promise((resolve, reject) => {
        const blob = new Blob([buffer], { type: `text/plain;charset=${charset}` });
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = () => {
            reject(reader.error);
        }
        reader.readAsText(blob, charset);
    });
}


// 初期ビューポートの設定
const INITIAL_VIEW_STATE = {
    latitude: 35.73202612464274,
    longitude: 137.53268402693763,
    bearing: 0,
    pitch: 0,
    zoom: 5
};


const cast = (d) => {
    Object.keys(d).forEach(key=>{
        if(!isNaN(+d[key])) d[key] = +d[key]
    })

    return d
}



function Map() {
    const [data, setData] = useState([]);
    const [viwState, setViewState] = useState(INITIAL_VIEW_STATE)



    //データの読み込み
    useEffect(() => {
        const getData = async () => {
            const url = "./data/wind.zip"
            const buff = await parse(fetchFile(url), ZipLoader);
            const fileName = Object.keys(buff)[0];
            decodeText(buff[fileName]).then((text) => {
                //テキストデータをパースしてオブジェクトへ変換する
                const csv = csvParse(text, cast);
                setData(csv)
            });
        }
        getData();
    }, [])    

    return (
        <div>
            <DeckGL
                initialViewState={viwState}
                controller={true}
                layers={renderLayers({
                    data
                })}
            >
                <Mapbox
                    mapboxAccessToken="pk.eyJ1Ijoic2hpbWl6dSIsImEiOiJjam95MDBhamYxMjA1M2tyemk2aHMwenp5In0.i2kMIJulhyPLwp3jiLlpsA"
                    mapStyle="mapbox://styles/mapbox/dark-v10"
                />
            </DeckGL>
            <div className="attribution">
                <a
                    href="http://www.openstreetmap.org/about/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    © OpenStreetMap
                </a>
            </div>
        </div>
    );
}

export default Map;