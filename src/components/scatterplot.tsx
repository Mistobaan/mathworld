import { useCallback, useRef, useEffect, useState} from "react";
import ReactDOM from "react-dom/client";
import ScatterPlot from "deepscatter"
import { Tile } from "deepscatter/dist/tile";

import {cn} from "@/lib/utils"

export const TILES_FOLDER_NAME = "tiles";

export type DataPoint = {
  x: number;
  y: number;
  question: string; 
  // lyric_line: string;
  // song: string;
  // performer: string;
  // generic_genre: string;
  // chart_debut: string; // I think? maybe it's been cast when the parquet file is read?
  // gender: "m" | "f" | "x";
  // gpt3_song_is_love_or_sex_or_no: "love" | "sex" | "no";
  // // cliche stuff
  // num_before: number;
  // num_after: number;
  // num_before_song_avg: number;
  // num_after_song_avg: number;
};


export type Labels = {
    features: object;
    name: string;
    labelKey: string;
    sizeKey: string;
  };


  
const EmbeddingScatterPlot = ({className, setSelection}: {className:string, setSelection: (DataPoint)=>void}) => {
    // DeepScattter is loaded through useEffects
    const chartParentId = "deep-scatter-parent-element-id";
    const chartParentRef = useRef(null);
    const scatterPlotRef = useRef(null);
    // const { db, connection } = useDuckDB({ context: ">>>>WRAPPER<<<<" });
    const [initialLoadComplete, setInitiaLoadComplete] = useState<boolean>(false);
    const [datapoint, setDataPoint] = useState<DataPoint|null>();
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    const measuredRef = useCallback(node => {
      if (node !== null) {
        setHeight(node.getBoundingClientRect().height);
        setWidth(node.getBoundingClientRect().width);
        chartParentRef.current = node;
      }
    }, []);

    const termContainer = useRef<HTMLDivElement | null>(null);
    //const plot = new ScatterPlot("embedding-scatterplot", 400, 400);
    useEffect(() => {
      console.log('value changed!', width, height)
      if (scatterPlotRef.current){
        const plot = scatterPlotRef.current as ScatterPlot<Tile>;
        plot.width = width;
        plot.height = height;
      }
    }, [width, height])

    useEffect(() => {
        console.log("update!")
        const prefs = {
            source_url: `/_next/static/${TILES_FOLDER_NAME}`, // tiles live in /public in react app
            max_points: 1000000, // a full cap.
            alpha: 25, // Target saturation for the full page.
            zoom_balance: 0.7, // Rate at which points increase size. https://observablehq.com/@bmschmidt/zoom-strategies-for-huge-scatterplots-with-three-js
            point_size: 5, // Default point size before application of size scaling
            background_color: 'white',
            click_function: 'console.log(JSON.stringify(datum, undefined, 2))',
    
            // encoding API based roughly on Vega Lite: https://vega.github.io/vega-lite/docs/encoding.html
            encoding: {
            x: {
                field: 'x',
                transform: 'literal',
            },
            y: {
                field: 'y',
                transform: 'literal',
            },
            color: {
                constant: '#eb44e8',
            },
            },
        };
        if (chartParentRef.current) {
          const { offsetWidth, offsetHeight } = chartParentRef.current;

          const _plot = new ScatterPlot(`#${chartParentId}`, offsetHeight, offsetWidth);
          _plot.tooltip_html = (point, plot) => {
            return ""
                // const container = document.createElement('div');
                // const root = ReactDOM.createRoot(container);
                // root.render(
                //    <div className={cn("width: 400px; z-index: 1000; foreground-color:white; background-color:black; background-alpha:100%; font-family: 'georgia'; font-size: 18px; border-width: 1px")}>
                //      <span>${point.question}</span>
                //    </div>
                // );
                // console.log("Text:", container.innerText);
                // const text = container.innerText;
                // return text;
          };

          scatterPlotRef.current = _plot;

          // @ts-ignore
          window.plot = _plot; // for debugging

          console.log("created scatter...");
          _plot.plotAPI(prefs).finally(() => {
            console.log("... initial prefs set");
            setInitiaLoadComplete(true);
            _plot.click_function = (datum, plot) => {
              console.log(datum)
              setDataPoint({ x:datum.x, y:datum.y, question:datum.question})
              setSelection({ x:datum.x, y:datum.y, question:datum.question})
              // onClickDataPoint(dataPoint);
              // setInteractionState((state) => ({
              //   ...state,
              //   clickedDataPoint: dataPoint,
              // }));
            };
  
            // _plot.add_labels(
            //   labels.features,
            //   labels.name,
            //   labels.labelKey,
            //   labels.sizeKey
            // );
          });
        }
      }, []);
    
  return (
    <>
       <div className={className} id={chartParentId} ref={measuredRef} />
       {/* <div >
        <span>{datapoint ? datapoint.question: ""}</span>
       </div> */}
    </>
  );
}

export default EmbeddingScatterPlot;