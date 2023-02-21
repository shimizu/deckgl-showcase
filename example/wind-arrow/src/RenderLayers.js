import { TileLayer, BitmapLayer, TextLayer } from 'deck.gl';
import chroma from "chroma-js"

const cs = chroma.scale(["skyblue", "darkblue"]).domain([0, 25])

export function renderLayers(props) {
  const {data} = props;


 
  const text = new TextLayer({
    id: 'text-layer',
    data:data,
    pickable: false,
    sizeUnits:"meters",
    sizeScale:24,
    sizeMinPixels: 6,
    sizeMaxPixels:24,
    getPosition: d => {
      return [d.long, d.lat]
    },
    getText: d => "→",
    getColor:d => cs(d.speed).rgb(),
    getSize: 1000,
    getAngle: d => d.Direction,
    getTextAnchor: 'middle',
    getAlignmentBaseline: 'center',
    characterSet:["→"]
  });

 

  //レイヤーの重なり順を配列で指定(先頭のレイヤーが一番下になる)
  return [text];
}
