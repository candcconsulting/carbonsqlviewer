import * as React from 'react';
import { Button, LabeledInput, Table, ToggleSwitch } from '@itwin/itwinui-react';
import type { /*CellProps, */Column,  } from 'react-table';
import { IModelApp, IModelConnection } from '@itwin/core-frontend';
import { StagePanelLocation, StagePanelSection, UiItemsProvider, Widget, WidgetState } from '@itwin/appui-react';
import { _executeQuery } from '../api/queryAPI'
import { colorModels, colourElements, resetElements } from '../api/elements';
import { Cartographic } from '@itwin/core-common';
import './ModelWidget.css';


export class ModelWidgetProvider implements UiItemsProvider {
  public static activeIModel?: IModelConnection;


  public readonly id: string = "ModelWidgetProvider";
  public static readResults = false;

  public provideWidgets(_stageId: string, _stageUsage: string, location: StagePanelLocation, _section?: StagePanelSection): ReadonlyArray<Widget> {
      // const imodel = ModelWidgetProvider.activeIModel;
      const widgets: Widget[] = [];
      // if (imodel && location === StagePanelLocation.Right) {      
      if (location === StagePanelLocation.Right) {
          widgets.push({
              id: "Model Widget",
              label: "Model Search",
              defaultState: WidgetState.Open,
              content: <ResultsPanel/>,
          });
      }
      return widgets;
  }
}



const ResultsPanel =  () => {
  type TableDataType = {    
    [index : string] : string,
    title : string,
    link: string;
    snippet: string;
  };
  const [readResults, setReadResults] = React.useState(false);
  const [results, setResults] = React.useState<any[]>([])
  const [showIsolate, setShowIsolate] = React.useState(false);
  const [showEmphasize, setShowEmphasize] = React.useState(false);
  const [searching, setSearching] = React.useState(false);
   
  const urlSubject = (window as any).urlSubject
  console.log(`in model results panel Subject=${urlSubject}`)

  const imodel = IModelApp.viewManager.selectedView?.iModel;
  const searchClick = async (e: React.MouseEvent) => {
    setSearching(true);
    console.log('SearchClick has been clicked')
    const ecInstanceHTML = document.getElementById("ecInstanceId") as HTMLInputElement | null;
    const codeValueHTML = document.getElementById("codeValue") as HTMLInputElement | null;

    // set userLabel to HTMLElement value or blank string if undefined   
    const ecInstance = ecInstanceHTML ? ecInstanceHTML.value : "";
    const codeValue = codeValueHTML ? codeValueHTML.value : "";

    // we cannot use wildcards when the string is blank
    // add where clause separately and build up from userLabel, category and fileName
    let wherecInstance = ""
    if (ecInstance  !== "")
      wherecInstance = `ecInstanceId IN (${ecInstance})`;

    let whereCodeValue = ""
    if (codeValue !== "")
      whereCodeValue = `codevalue LIKE '%${codeValue}%'`;

    let whereClause = ""
      if (wherecInstance !== "") {
        whereClause = wherecInstance;
      }
      if (whereCodeValue !== "") {
        if (whereClause !== "")
          whereClause = `${whereClause} AND ${whereCodeValue}`;
        else
          whereClause = whereCodeValue;
      } 
      if (whereClause !== "") 
        whereClause = "where " + whereClause;
    //const ecSQL = `select ge.ecInstanceId, ge.ecClassId, ge.userlabel, ge.codevalue as CodeValue, parent.id as Parent from bis.element ge  ${whereClause}`
    const ecSQL = `WITH RECURSIVE children(id, parent, userLabel, className, codeValue) AS (
      SELECT ECInstanceId, Parent.Id, userlabel, ecClassId, codevalue
      FROM Bis.Subject
      ${whereClause}
      
      UNION ALL
      
      SELECT e.ECInstanceId, e.Parent.Id, e.userlabel, e.ecClassId, e.codevalue
      FROM Bis.Element e
      JOIN children c ON c.id = e.Parent.Id
    )
    SELECT *
    FROM children` 
    
    if (imodel) {
      const records = await _executeQuery(imodel, ecSQL)
      // console.log (`Number of records returned ${records.length}`)
      // setResults(records);
       
      const ids = []
      for (const record of records) {
        ids.push(record.id);
      }
      const extents = await imodel?.models.queryExtents(ids);
      const spatialExtents = [];
      for (const extent of extents) {        
        const myExtents : any = extent.extents
        
        let geocentricExtent = { low : Cartographic.fromDegrees({longitude : 0, latitude : 0, height : 0}),
                                 high : Cartographic.fromDegrees({longitude : 0, latitude : 0, height : 0})
                               }
        if (extent.status === 0) {
          try {
            const lowCartographic = await imodel.spatialToCartographic(myExtents.low );
            const highCartographic = await imodel.spatialToCartographic(myExtents.high);

            geocentricExtent = {
              low: lowCartographic,
              high: highCartographic,
            };
          }
          catch (error) {
            console.log(error);
          }
        }
        spatialExtents.push(geocentricExtent);
      }

      const mergedData = [];
      for (const extent of extents) {
        const record = records.find((r) => r.id === extent.id);
        if (record) {
          mergedData.push({ ...record, extent });
        }
      }
      setResults(mergedData);
      for (const id of ids) {
        colorModels(IModelApp.viewManager.selectedView, id)
      }


          // colourElements(IModelApp.viewManager.selectedView, ids, false)
          // const response = await IModelApp.viewManager.selectedView?.changeViewedModels(ids);
          // resetElements(IModelApp.viewManager.selectedView);
    }
    setSearching(false);
  }

  const emphasizeClick = (e : any) => {    
    setShowEmphasize(!showEmphasize);

  }

  const isolateClick = (e : any) => {    
    setShowIsolate(!showIsolate);

  }


  React.useEffect(() => {    
    if (readResults) {          
      const storedResults = localStorage.getItem("iTwinSearchResults");
      const returnResults : TableDataType [] = [] 
      if (storedResults) {
        const results : any = JSON.parse(storedResults)
        if (results.length > 0) {
          for (const result in results) {
            returnResults.push( {
              title : results[result].title,
              link : results[result].link,
              snippet : results[result].snippet
            })
          }
          console.log(storedResults + ' and parsed results ' + results);
          localStorage.setItem("ReadSearchResults", JSON.stringify(false));
          setResults(returnResults);
        }
        else
        setResults([]);
      }
      setReadResults(false);
    }
  },[readResults])

  React.useEffect(() => {
    const imodel = IModelApp.viewManager.selectedView?.iModel;
    if (imodel) {
      if (showIsolate || showEmphasize) {
        if (results.length > 0) {
          const instanceIds = []
          for (const result in results) {
            instanceIds.push(results[result].id)          
          } 
          if (showIsolate)
            IModelApp.viewManager.selectedView?.changeViewedModels(instanceIds)        
          if (showEmphasize)
            colourElements(IModelApp.viewManager.selectedView, instanceIds, false)
        }
      }
      else {
        const ids = []
        for (const model of imodel.models) {
          ids.push(model.id);
        }
        if (!showIsolate)
          IModelApp.viewManager.selectedView?.changeViewedModels(ids);  
        if (!showEmphasize && !showIsolate)
          resetElements(IModelApp.viewManager.selectedView);
      }
    }
  
  }, [showIsolate, showEmphasize, results])

/*
const onClickHandler = (props: CellProps<{
  name: string;
  description: string;
}>) => {console.log(props.row.original.name)};
*/

  const columns = React.useMemo(
    (): Column<TableDataType>[] => [
      {
        id: 'id',
        Header: 'ecInstanceId',
        accessor: 'id',
        width: '40%',
      },
      {
        id: 'className',
        Header: 'Class',
        accessor: 'className',        
      },
      {
        id: 'codeValue',
        Header: 'Codevalue',
        accessor: 'codeValue',
      },
      {
        id: 'userLabel',
        Header: 'user Label',
        accessor: 'userLabel',
      },
      {
        id: 'parent',
        Header: 'Parent',
        accessor: 'parent',
      },

    ],
    []
  );

  const rowProps = React.useCallback((row: any) => {
    return {
      status: row.original.status,
    };
  }, []);

  return (
    <div className="model-widget-container">
      <div className="model-control-container">
        <LabeledInput label="ecInstanceId" placeholder='ecInstanceId' id='ecInstanceId'/>
        <LabeledInput label="Code Value" placeholder='codeValue' id='codeValue'/>
        <Button styleType='cta' onClick={searchClick} disabled={searching}>{searching ? "Searching..." : "Search"}</Button>
        <ToggleSwitch label="Isolate" checked={showIsolate} onChange={isolateClick} />
        <ToggleSwitch label="Emphasize" checked={showEmphasize} onChange={emphasizeClick} />
      </div>
      <Table
        columns={columns}
        emptyTableContent='No data.'
        data={results}
        rowProps={rowProps}
        density='condensed'
      />
    </div>
  );
};