window.onload = function () {
    document.getElementById("check").addEventListener('click', () => {
        getSelectedSpan();
    });
}

function getSelectedText() {
    var selection = window.getSelection();
    return selection;
}

function highlightSelectedText() {
    var selection = getSelectedText();
    var selection_text = selection.toString();

    var span = document.createElement('SPAN');
    span.textContent = selection_text;
    span.className = "highlight";

    var range = selection.getRangeAt(0);
    range.deleteContents();
    // range.insertNode(span);
}

function getSelectedSpan() {
    var selection = window.getSelection();
    console.log(selection.rangeCount);
    var range = selection.getRangeAt(0);
    var startContainer = range.startContainer;

    console.log(startContainer.parentElement);
    console.log(startContainer.parentElement.textContent.length);
    console.log(selection.toString().length);
    console.log(findParentDivRecursive(startContainer));
    var dady = findParentDivRecursive(startContainer);
    console.log(dady.textContent.length);
    
    // return startContainer.parentElement.textContent.length;
}

function findParentDivRecursive(element) {
    if (!element) {
        return null;
    }
    
    if (element.nodeName === 'DIV') {
        return element;
    } else {
        return findParentDivRecursive(element.parentElement);
    }
}
