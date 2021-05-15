if (typeof GenerateVertex == 'undefined')
{
    GenerateVertex = {};
}

/*** web/UI code - runs natively in the plugin process ***/

// IDs of input elements that need to be referenced or updated
let XCoordinateInputID = 'XCoordinateInput';
let YCoordinateInputID = 'YCoordinateInput';
let ZCoordinateInputID = 'ZCoordinateInput';

GenerateVertex.initializeUI = async function()
{
    // create an overall container for all objects that comprise the "content" of the plugin
    // everything except the footer
    let contentContainer = document.createElement('div');
    contentContainer.id = 'contentContainer';
    contentContainer.className = 'contentContainer'
    window.document.body.appendChild(contentContainer);

    // create the header
    contentContainer.appendChild(new FormIt.PluginUI.HeaderModule('Generate Vertex', 'Generate a standalone vertex at the given XYZ coordinates.').element);

    // create the X-coordinate input element
    contentContainer.appendChild(new FormIt.PluginUI.TextInputModule('X Coordinate: ', 'coordinateModule', 'inputModuleContainerTop', XCoordinateInputID, FormIt.PluginUI.convertValueToDimensionString).element);
    document.getElementById(XCoordinateInputID).value = await FormIt.StringConversion.LinearValueToString(0);

    // create the Y-coordinate input element
    contentContainer.appendChild(new FormIt.PluginUI.TextInputModule('Y Coordinate: ', 'coordinateModule', 'inputModuleContainer', YCoordinateInputID, FormIt.PluginUI.convertValueToDimensionString).element);
    document.getElementById(YCoordinateInputID).value = await FormIt.StringConversion.LinearValueToString(0);

    // create the Z-coordinate input element
    contentContainer.appendChild(new FormIt.PluginUI.TextInputModule('Z Coordinate: ', 'coordinateModule', 'inputModuleContainer', ZCoordinateInputID, FormIt.PluginUI.convertValueToDimensionString).element);
    document.getElementById(ZCoordinateInputID).value = await FormIt.StringConversion.LinearValueToString(0);

    // create the button to execute the generation
    contentContainer.appendChild(new FormIt.PluginUI.Button('Generate Vertex', GenerateVertex.CreateVertex).element);

    // create the footer
    document.body.appendChild(new FormIt.PluginUI.FooterModule().element);
}

GenerateVertex.updateUI = async function()
{
    // set the initial XYZ coordinate inputs to use the current units

    // X input
    document.getElementById(XCoordinateInputID).value = await FormIt.StringConversion.LinearValueToString((await FormIt.StringConversion.StringToLinearValue(document.getElementById(XCoordinateInputID).value)).second);
    
    // Y input
    document.getElementById(YCoordinateInputID).value = await FormIt.StringConversion.LinearValueToString((await FormIt.StringConversion.StringToLinearValue(document.getElementById(YCoordinateInputID).value)).second);

    // Z input
    document.getElementById(ZCoordinateInputID).value = await FormIt.StringConversion.LinearValueToString((await FormIt.StringConversion.StringToLinearValue(document.getElementById(ZCoordinateInputID).value)).second);
}

/*** application code - runs asynchronously from plugin process to communicate with FormIt ***/

// generate the vertex in 3D space
GenerateVertex.CreateVertex = async function()
{
    console.clear();
    console.log("Generate Vertex");
    await FormIt.UndoManagement.BeginState();

    // get current history
    let nHistoryID = await FormIt.GroupEdit.GetEditingHistoryID();
    //console.log("Current history: " + JSON.stringify(nHistoryID));

    let posX = (await FormIt.StringConversion.StringToLinearValue((document.getElementById(XCoordinateInputID).value))).second;
    let posY = (await FormIt.StringConversion.StringToLinearValue((document.getElementById(YCoordinateInputID).value))).second;
    let posZ = (await FormIt.StringConversion.StringToLinearValue((document.getElementById(ZCoordinateInputID).value))).second;

    let point3d = await WSM.Geom.Point3d(posX, posY, posZ);

    await WSM.APICreateVertex(nHistoryID, point3d);

    await FormIt.UndoManagement.EndState("Generate Vertex Plugin");
}