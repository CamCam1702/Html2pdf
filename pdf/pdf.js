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

const highlightCls = "highlight";

function getSelectedSpan() {
    var selection = window.getSelection();
    console.log(selection.rangeCount);
    var range = selection.getRangeAt(0);

    // First Dad của m đây
    var commonAncestorContainer = range.commonAncestorContainer;

    console.log(commonAncestorContainer);

    var startContainer = range.startContainer;
    var endContainer = range.endContainer;

    var ori1 = startContainer.textContent;
    var ori2 = endContainer.textContent;

    console.log(startContainer);
    console.log(endContainer);

    console.log("" + range.startOffset + " " + range.endOffset);
    console.log("" + startContainer.textContent.length + " " + endContainer.textContent.length);

    var clonedRange = range.cloneContents();

    var spanElements = clonedRange.querySelectorAll('span');
    // for ech span element, add the class highlight if it is not already there
    spanElements.forEach(spanElement => {
        if (!spanElement.classList.contains(highlightCls)) {
            spanElement.classList.add(highlightCls);
        }
    });
    console.log("" + spanElements[0].textContent.length + " " + spanElements[spanElements.length - 1].textContent.length);
    console.log(spanElements[0].parentElement);
    console.log(spanElements[spanElements.length - 1].parentElement);

    var s1 = ori1.substring(0,range.startOffset);
    var s2 = ori2.substring(range.endOffset, endContainer.textContent.length);

    //convert s1 and s2 to text nodes
    s1 = document.createTextNode(s1);
    s2 = document.createTextNode(s2);

    console.log(s1);
    console.log(s2);

    spanElements[0].parentElement.insertBefore(s1, spanElements[0]);
    spanElements[spanElements.length - 1].parentElement.appendChild(s2);

    console.log(spanElements[0].parentElement);
    console.log(spanElements[spanElements.length - 1].parentElement);

    startContainer.parentElement.removeChild(startContainer);
    endContainer.parentElement.removeChild(endContainer);

    range.deleteContents();
    range.insertNode(clonedRange);

    //TODO: append all element from start(end) container to the cloned range

    console.log(clonedRange);

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