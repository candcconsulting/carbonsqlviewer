import * as React from 'react';
import { Button, LabeledInput } from '@itwin/itwinui-react';

import { IModelApp, IModelConnection } from '@itwin/core-frontend';
import { StagePanelLocation, StagePanelSection, UiItemsProvider, Widget, WidgetState } from '@itwin/appui-react';
import { _executeQuery } from '../api/queryAPI'
import "./CoordinateWidget.css";
import { Point3d } from '@itwin/core-geometry';

export class CoordinateWidgetProvider implements UiItemsProvider {
  public static activeIModel?: IModelConnection;

  public readonly id: string = "CoordinateWidgetProvider";
  public static readResults = false;

  public provideWidgets(_stageId: string, _stageUsage: string, location: StagePanelLocation, _section?: StagePanelSection): ReadonlyArray<Widget> {
      const widgets: Widget[] = [];
      // if (imodel && location === StagePanelLocation.Right) {      
      if (location === StagePanelLocation.Bottom) {
          widgets.push({
              id: "CoordinateWidget",
              label: "Coordinates",
              defaultState: WidgetState.Open,
              content: <CoordinatesPanel/>,
          });
      }
      return widgets;
  }
}



const CoordinatesPanel =  () => {

    


  const locateClick = (e : any) => {
    const x = document.getElementById('xPoint') as HTMLInputElement;
    const y = document.getElementById('yPoint') as HTMLInputElement;
    const z = document.getElementById('zPoint') as HTMLInputElement;
    const xValue = parseFloat(x.value) || 0;
    const yValue = parseFloat(y.value) || 0;
    const zValue = parseFloat(z.value) || 0;
    const viewPort = IModelApp.viewManager.selectedView;
    const zoomFactor = 1;
    const centerPoint: Point3d = new Point3d(xValue, yValue, zValue);
    if (viewPort) {
      const returnZoomValue = viewPort.zoom(centerPoint, zoomFactor, {animateFrustumChange: true});
    }
  }

  return (
    <div className='coordinate-container'>
        <LabeledInput label="X" placeholder='X' id='xPoint'/>
        <LabeledInput label="Y" placeholder='Y' id = 'yPoint'/>
        <LabeledInput label="Z" placeholder='Z' id = 'zPoint'/>
        <Button styleType='cta' onClick={locateClick}>{"Locate"}</Button>
    </div>
  );
};