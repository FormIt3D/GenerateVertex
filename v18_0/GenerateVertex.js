if (typeof GenerateVertex == 'undefined')
{
    GenerateVertex = {};
}

// IDs for inputs whose values need to be updated
let XCoordinateInputID = 'XCoordinateInput';
let YCoordinateInputID = 'YCoordinateInput';
let ZCoordinateInputID = 'ZCoordinateInput';

GenerateVertex.initializeUI = function()
{
    debugger;
    
    // create an overall container for all objects that comprise the "content" of the plugin
    // everything except the footer
    var contentContainer = document.createElement('div');
    contentContainer.id = 'contentContainer';
    contentContainer.className = 'contentContainer'
    window.document.body.appendChild(contentContainer);

    // create the header
    contentContainer.appendChild(new FormIt.PluginUI.HeaderModule('Generate Vertex', 'Generate a standalone vertex at the given XYZ coordinates.').element);

    // create the X-coordinate input element
    contentContainer.appendChild(new FormIt.PluginUI.TextInputModule('X Coordinate: ', 'coordinateModule', 'inputModuleContainerTop', XCoordinateInputID, FormIt.PluginUI.convertValueToDimensionString).element);
    document.getElementById(XCoordinateInputID).value = 0;

    // create the Y-coordinate input element
    contentContainer.appendChild(new FormIt.PluginUI.TextInputModule('Y Coordinate: ', 'coordinateModule', 'inputModuleContainer', YCoordinateInputID, FormIt.PluginUI.convertValueToDimensionString).element);
    document.getElementById(YCoordinateInputID).value = 0;

    // create the Z-coordinate input element
    contentContainer.appendChild(new FormIt.PluginUI.TextInputModule('Z Coordinate: ', 'coordinateModule', 'inputModuleContainer', ZCoordinateInputID, FormIt.PluginUI.convertValueToDimensionString).element);
    document.getElementById(ZCoordinateInputID).value = 0;

    // create the button to execute the generation
    contentContainer.appendChild(new FormIt.PluginUI.Button('Generate Vertex', GenerateVertex.CreateVertex).element)

    // create the footer
    document.body.appendChild(new FormIt.PluginUI.FooterModule().element);
}

GenerateVertex.updateUI = function()
{
    // set the initial XYZ coordinate inputs to use the current units

    // X input
    FormIt.PluginUI.convertValueToDimensionString(
        document.getElementById(XCoordinateInputID).value,
         function(result)
        {
            document.getElementById(XCoordinateInputID).value = JSON.parse(result);
        });
    
    // Y input
    FormIt.PluginUI.convertValueToDimensionString(
        document.getElementById(YCoordinateInputID).value,
        function(result)
        {
            document.getElementById(YCoordinateInputID).value = JSON.parse(result);
        });

    // Z input
    FormIt.PluginUI.convertValueToDimensionString(
        document.getElementById(ZCoordinateInputID).value,
        function(result)
        {
            document.getElementById(ZCoordinateInputID).value = JSON.parse(result);
        });
}

// generate the vertex in 3D space
GenerateVertex.CreateVertex = async function()
{
    console.clear();
    console.log("Generate Vertex");
    await FormIt.UndoManagement.BeginState();

    // get current history
    let nHistoryID = await FormIt.GroupEdit.GetEditingHistoryID();
    //console.log("Current history: " + JSON.stringify(nHistoryID));

    let posX = FormIt.PluginUtils.currentUnits(await FormIt.StringConversion.StringToLinearValue((document.getElementById(XCoordinateInputID).value))).second;
    let posY = FormIt.PluginUtils.currentUnits(await FormIt.StringConversion.StringToLinearValue((document.getElementById(YCoordinateInputID).value))).second;
    let posZ = FormIt.PluginUtils.currentUnits(await FormIt.StringConversion.StringToLinearValue((document.getElementById(ZCoordinateInputID).value))).second;

    let point3d = await WSM.Geom.Point3d(posX, posY, posZ);
    console.log("Value = " + document.getElementById(XCoordinateInputID).value);
    console.log("Conversion = " + (await FormIt.StringConversion.StringToLinearValue("0'")).second);

    await WSM.APICreateVertex(nHistoryID, point3d);

    await FormIt.UndoManagement.EndState("Generate Vertex Plugin");
}