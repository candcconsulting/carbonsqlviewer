"select  * from bis.category where codevalue like '%ZZ%'"
"select g.ecInstanceId, g.userlabel, ca.codevalue from bis.geometricelement3d g join bis.category ca on g.category.id where ca.codevalue = 'IM-Zz_90_20-P-ConstructionLine'"

"select g.ecInstanceId, g.userlabel, ca.codevalue from bis.geometricelement3d g join bis.category ca on g.category.id where ca.codeValue = 'AR-Ss\_40\_20\_30\_28-M-ExternalFurniture' LIMIT 10"
"select g.ecInstanceId, g.userlabel, ca.codevalue from bis.geometricelement3d g join bis.category ca on g.category.id = ca.ecinstanceid where g.userlabel = 'Point Entity 3d: 99' LIMIT 10"

"select * from bis.geometricelement3d g where g.userlabel like '%Point Entity 3d%'"
"select ge.ecinstanceid, ca.codevalue, ge.userlabel from bis.GeometricElement3d ge join bis.category ca on ge.category.id = ca.ECInstanceId where ca.codevalue like 'DR-Ss_50_30_08_85-M-SurfaceWaterChannel' LIMIT 10"
"select ge.ecinstanceid, ca.codevalue, ge.userlabel from bis.GeometricElement3d ge join bis.category ca on ge.category.id = ca.ECInstanceId where ge.userlable like 'line' LIMIT 10"

"select ge.ecInstanceId, ge.userlabel, ca.codevalue as Category, rl.userlabel as Model from bis.geometricelement3d ge join bis.category ca on ge.category.id = ca.ecinstanceid join bis.externalsourceaspect ea on ge.ecinstanceid = ea.element.id join bis.externalsource es on es.ecinstanceid = ea.source.id join bis.repositorylink rl on rl.ecinstanceid = es.repository.id where ge.userlabel like 'Line' LIMIT 10"

"select ge.ecInstanceId, ge.userlabel, ca.codevalue as Category, rl.userlabel as Model from generic.graphic3d ge join bis.category ca on ge.category.id = ca.ecinstanceid join bis.externalsourceaspect ea on ge.ecinstanceid = ea.element.id join bis.externalsource es on es.ecinstanceid = ea.source.id join bis.repositorylink rl on rl.ecinstanceid = es.repository.id where rl.userlabel like '1CP02-BVS_WSP-DR-DM3-SS07_SL13_B1-023001%' "

"select * from meta.ecclassdef where name like '%category%'"

"select * from bis.category where codevalue like 'DR-Ss_50_30_08_85-M-SurfaceWaterChannel'"
"select ge.ecinstanceid, ca.codevalue, ge.userlabel, rl.userlabel from generic.physicalobject ge join bis.category ca on ge.category.id = ca.ecinstanceid join bis.externalsourceaspect ea on ge.ecinstanceid = ea.element.id join bis.externalsource es on es.ecinstanceid = ea.source.id join bis.repositorylink rl on rl.ecinstanceid = es.repository.id where ca.codeValue like 'AR-SS_%'"

"select * from bis.category ca join bis.geometricelement3d ge on ge.category.id = ca.ecinstanceid where ca.codevalue like 'EL-SS_%' "

"select * from bis.category ca join bis.geometricelement3d ge on ge.category.id = ca.ecinstanceid where ca.codeValue like 'AR%Beam%'"
"select * from bis.spatialcategory ca where ca.codeValue like 'AR%Beam%'"

"select * from bis.geometricelement3d ge where category.id in ('0x80000003670','0x9000000690f','0xa0000001738')"

"select * from bis.category ca where ca.codeValue like 'AR-SS%'"

"select * from bis.physicalpartition rl where rl.codevalue like '%1CP02-BVS_WSP-ME-DMB-SS07_SL14-014001%'"
"select * from bis.physicalpartition where codevalue like '%1CP01-MDS_ARP-AR-DMB-SS08_SL32-995001%'"
"select * from bis.element where parent.id = 0x5a0000003e21"
"select * from bis.element where ecInstanceId IN (0x5a0000003e21)"
"select ge.ecInstanceId, ge.ecClassId, ge.userlabel, ge.codevalue as CodeValue from bis.element ge  "
"select * from bis.spatialmodel sm join bis.element e on sm.ecinstanceid = e.ecinstanceid"

"SELECT ECInstanceId, Parent.Id FROM Bis.Subject where ECInstanceId = 0x5a0000000047"
"WITH RECURSIVE
  elements (id, parentId) AS (
    SELECT ECInstanceId, Parent.Id FROM Bis.Subject WHERE ECInstanceId = 0x3000000000c
    UNION ALL
    SELECT e.ECInstanceId, e.Parent.Id FROM Bis.Element e JOIN elements pe ON pe.id = e.Parent.Id
  )
SELECT * FROM elements"
"WITH RECURSIVE models(id, parentId) AS ( SELECT ECInstanceId, Parent.Id FROM Bis.Subject WHERE ECInstanceId = 0x5a0000000047 UNION ALL SELECT e.ECInstanceId, e.Parent.Id FROM Bis.Element e JOIN models pe ON pe.id = e.Parent.Id ) SELECT id, parentId FROM models"

"WITH RECURSIVE children(id, parent_id) AS (
  SELECT ECInstanceId, Parent.Id
  FROM Bis.Subject
  WHERE ECInstanceId = '0x5a0000000047'
  
  UNION ALL
  
  SELECT e.ECInstanceId, e.Parent.Id
  FROM Bis.Element e
  JOIN children c ON c.id = e.Parent.Id
)
SELECT *
FROM children;"

"select * from bis.spatialIndex"

WITH RECURSIVE children(id, parent, userLabel, className, codeValue) AS (
      SELECT ECInstanceId, Parent.Id, userlabel, ecClassId, codevalue
      FROM Bis.Subject
      where userlabel LIKE '%-WP11a-%'
      
      UNION ALL
      
      SELECT e.ECInstanceId, e.Parent.Id, e.userlabel, e.ecClassId, e.codevalue
      FROM Bis.Element e
      JOIN children c ON c.id = e.Parent.Id
    )
    SELECT *
    FROM children