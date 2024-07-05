window.onload = function () {
        document.getElementById('highlight').addEventListener("click", function(){
        console.log("hightlight clicked");
    });
}

function getSelectedSpan(mode) {
    var selection = window.getSelection();
    if (selection.rangeCount === 0) {
        return;
    }
    var range = selection.getRangeAt(0);

    console.log(range);

    //start
    var rangeStart = new Range();
    rangeStart.setStart(range.startContainer, range.startOffset);
    rangeStart.setEnd(range.startContainer, range.startContainer.textContent.length);

    applyToRange(rangeStart, mode);

    //end
    var rangeEnd = new Range();
    rangeEnd.setStart(range.endContainer, 0);
    rangeEnd.setEnd(range.endContainer, range.endOffset);

    applyToRange(rangeEnd, mode);

    //middle
    let spansInRange = getSpansInRange(document.getElementById('allvoice'), range.startContainer, range.endContainer);
    console.log(spansInRange);
    for(i=0; i<spansInRange.length-1; i++){
        Sonpromax(spansInRange[i], mode);
    }
}
function getSpansInRange(rootNode, startNode, endNode) {
    let spanList = [];
    let isInRange = false;
    function traverse(node) {
        if (node === startNode) {
            isInRange = true;
        }
        if (isInRange && node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'span') {
            spanList.push(node);
        }
        for (let i = 0; i < node.childNodes.length; i++) {
            traverse(node.childNodes[i]);
        }
        if (node === endNode) {
            isInRange = false;
        }
    }
    traverse(rootNode);
    return spanList;
}

//node này cần dưới dạng benAkey3
function Sonpromax(node, mode){
    var newSpan = document.createElement('span');
    newSpan.classList.add(mode);
    newSpan.textContent = node.textContent;
    node.textContent = '';
    node.appendChild(newSpan);
}

function CreateRange(node, mode){
    var range = new Range();
    range.selectNodeContents(node);
    applyToRange(range, mode);
}

function applyToRange(range, mode){
    var span = document.createElement('SPAN');
    span.innerHTML = range.toString();
    span.className = mode;
    range.deleteContents();
    range.insertNode(span);
}

function enableEditMode_test() {
    var allvoice = document.getElementById("allvoice");
    if (allvoice) {
        allvoice.contentEditable = true;
    } else {
        console.error("Element with id 'allvoice' not found.");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    enableEditMode_test();
});

function enableEditMode() {
    document.designMode = "on";
}
