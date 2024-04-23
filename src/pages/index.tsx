import { Button } from "@/components/ui/button";
import { useState } from "react";

import EmbeddingScatterPlot from "@/components/scatterplot";

export type DataPoint = {
  x: number;
  y: number;
  question: string; 
}

export default function PlaygroundPage() {
  const [selection, setSelection] = useState<DataPoint>(null)
  const onResetZoomClicked = () =>{
    console.log('works')
  }

  return (
    <>
      {/* <nav className="z-20 h-flex max-w-200 shrink-0 grow-0 justify-around gap-4 border-t border-gray-200 p-2.5 shadow-lg backdrop-blur-sm dark:border-slate-600/60 dark:bg-slate-800/50 fixed top-2/4 -translate-y-2/4 left-6 min-h-[auto] min-w-[200px] flex-col rounded-lg border"> */}
      <div className="z-20 fixed top-0/4 h-100 w-full backdrop-blur-sm p-2.5" >
        <text className="text-center text-xl font-bold "> Data Visualizaton: GSM8K </text>
      </div>
      <nav className="z-20 fixed p-2.5 top-1/4 backdrop-blur-sm right-6 max-w-[400px]">
        <small className="text-center text-xs font-bold"> Question </small>
        <div className="prose p-2.5 flex bg-white/80 ">{selection?.question || "no point selected"}</div>
        {/* <Button onClick={onResetZoomClicked}>
          Reset Zoom
        </Button> */}
      </nav>
        <EmbeddingScatterPlot className="h-full w-full overscroll-none" setSelection={setSelection}/>
      {/* <Drawer>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer> */}
    </>
  );
}
