    @echo off
REM Generate SUMO net from node/edge definition
setlocal
set SUMO_HOME=%SUMO_HOME%
netconvert --node-files city.nod.xml --edge-files city.edg.xml --output-file city.net.xml --lefthand
echo Generated city.net.xml
endlocal