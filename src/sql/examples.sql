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