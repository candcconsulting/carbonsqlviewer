/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { QueryRowFormat } from "@itwin/core-common";
import { IModelConnection } from "@itwin/core-frontend";



export const _executeQuery = async (imodel: IModelConnection, query: string) => {
  const rows = [];
  try {
    const result = imodel.query(query, undefined, {
      rowFormat: QueryRowFormat.UseJsPropertyNames,
    })
    if (result) {
      for await (const row of result) {
        rows.push(row);
      }
    }
    else 
      console.log("no records returned")
    return rows;
  } catch (e) {
    const _e = e as Error;
    console.log(_e.message + " running ecSQL " + query);
  }
  return rows;
};
