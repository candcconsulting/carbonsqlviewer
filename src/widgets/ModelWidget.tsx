import * as React from 'react';
import { Button, LabeledInput, Table, ToggleSwitch } from '@itwin/itwinui-react';
import type { CellProps, Column,  } from 'react-table';
import { IModelApp, IModelConnection } from '@itwin/core-frontend';
import { StagePanelLocation, StagePanelSection, UiItemsProvider, Widget, WidgetState } from '@itwin/appui-react';
import { _executeQuery } from '../api/queryAPI'
import { colourElements, resetElements } from '../api/elements';


export class ModelWidgetProvider implements UiItemsProvider {
  public static activeIModel?: IModelConnection;

  public readonly id: string = "ModelWidgetProvider";
  public static readResults = false;

  public provideWidgets(_stageId: string, _stageUsage: string, location: StagePanelLocation, _section?: StagePanelSection): ReadonlyArray<Widget> {
      const imodel = ModelWidgetProvider.activeIModel;
      const widgets: Widget[] = [];
      // if (imodel && location === StagePanelLocation.Right) {      
      if (location === StagePanelLocation.Right) {
          widgets.push({
              id: "Model Widget",
              label: "Model Widget",
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
  

  console.log('in results panel')

  const imodel = IModelApp.viewManager.selectedView?.iModel;
  const searchClick = async (e: React.MouseEvent) => {
    console.log('SearchClick has been clicked')
    const ecInstanceHTML = document.getElementById("ecInstanceId") as HTMLInputElement | null;

    // set userLabel to HTMLElement value or blank string if undefined   
    const ecInstance = ecInstanceHTML ? ecInstanceHTML.value : "";

    // we cannot use wildcards when the string is blank
    // add where clause separately and build up from userLabel, category and fileName
    let whereUserLabel = ""
    if (ecInstance  !== "")
      whereUserLabel = `ecInstanceId IN (${ecInstance})`;
    let whereClause = ""
      if (whereUserLabel !== "") {
        whereClause = whereUserLabel;
      }
      if (whereClause !== "") 
        whereClause = "where " + whereClause;
    const ecSQL = `select ge.ecInstanceId, ge.ecClassId, ge.userlabel, ge.codevalue as CodeValue, parent.id as Parent from bis.element ge  ${whereClause}`
    
    // "select * from bis.category"
    if (imodel) {
      const records = await _executeQuery(imodel, ecSQL)
      console.log (`Number of records returned ${records.length}`)
      setResults(records);
      resetElements(IModelApp.viewManager.selectedView);
    }
    
  }

  const isolateClick = (e : any) => {
    console.log(`Isolate Clicked ${showIsolate}`);
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
    if (showIsolate) {
      if (results.length > 0) {
        const instanceIds = []
        for (const result in results) {
          instanceIds.push(results[result].id)          
        } 
        colourElements(IModelApp.viewManager.selectedView, instanceIds, false)
      }
    }
    else
      resetElements(IModelApp.viewManager.selectedView);
  }, [showIsolate])

const onClickHandler = (props: CellProps<{
  name: string;
  description: string;
}>) => {console.log(props.row.original.name)};

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
    <div style={{ minWidth: 'min(100%, 350px)' }}>
      <LabeledInput label="ecInstanceId" placeholder='ecInstanceId' id='ecInstanceId'/>
      <Button styleType='cta' onClick={searchClick}>Search</Button>
      <ToggleSwitch label="Isolate" checked={showIsolate} onChange={isolateClick} />

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