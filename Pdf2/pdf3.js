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
    console.log(range.startContainer);
    FirstDad = findParentDivRecursive(range.startContainer);
    LastDad = findParentDivRecursive(range.endContainer);
    currentElement = FirstDad;
   
    while (currentElement.nextSibling != LastDad) {
        console.log(currentElement.childNodes);
        for (var i = 0; i < currentElement.childNodes.length; i++) {
            if (currentElement.childNodes[i].nodeName === 'SPAN' && !currentElement.childNodes[i].classList.contains(highlightCls)) {
                var newSpan = document.createElement('span');
                newSpan.classList.add('highlight');
                newSpan.textContent = currentElement.childNodes[i].textContent;
                currentElement.childNodes[i].removeChild(currentElement.childNodes[i].firstChild);
                currentElement.childNodes[i].appendChild(newSpan);
            }
        }
        currentElement = currentElement.nextSibling;
    }

    for (var i = 0; i < LastDad.childNodes.length; i++) {
        if (LastDad.childNodes[i].nodeName === 'SPAN' && !LastDad.childNodes[i].classList.contains(highlightCls)) {
            var newSpan = document.createElement('span');
            newSpan.classList.add('highlight');
            newSpan.textContent = LastDad.childNodes[i].textContent;
            LastDad.childNodes[i].removeChild(LastDad.childNodes[i].firstChild);
            LastDad.childNodes[i].appendChild(newSpan);
        }
    }
    console.log('end', LastDad);
}

function appendClonedRangeFirst(FirstDad, spanElements) {
    FirstDad.childNodes.forEach(spanElement => {
        if (spanElement.nodeType === Node.ELEMENT_NODE && spanElement.nodeName === 'SPAN' && !spanElement.classList.contains(highlightCls)) {
            var newSpan = document.createElement('span');
            newSpan.textContent = spanElement.textContent;
            if (spanElement.id) {
                newSpan.id = spanElement.id;
            }
            var list = spanElements[0].parentElement.childNodes
            spanElements[0].parentElement.insertBefore(newSpan, list[0]);
            spanElement.parentElement.removeChild(spanElement);
        }
    });
    // removeEmptySpans(FirstDad.nextSibling);

    FirstDad.parentElement.removeChild(FirstDad);
}

function appendClonedRangeLast(LastDad, spanElements) {
    console.log(LastDad.childNodes);
    LastDad.childNodes.forEach(spanElement => {
        if (spanElement.nodeType === Node.ELEMENT_NODE && spanElement.nodeName === 'SPAN' && !spanElement.classList.contains(highlightCls)) {        

            var newSpan = document.createElement('span');
            newSpan.textContent = spanElement.textContent;

            if (spanElement.id) {
                newSpan.id = spanElement.id;
            }

            spanElements[spanElements.length - 1].parentElement.appendChild(newSpan);
        }
    });

    LastDad.parentElement.removeChild(LastDad);
}

function removeEmptySpans(parentElement) {
    // Lấy tất cả các phần tử span con của parentElement
    var spans = parentElement.querySelectorAll('span');
    console.log(spans);
    
    // Duyệt qua tất cả các phần tử span và kiểm tra nội dung của chúng
    spans.forEach(span => {
        if (!span.textContent.trim()) { // Kiểm tra nếu nội dung span rỗng hoặc chỉ chứa khoảng trắng
            try {
                span.parentElement.removeChild(span); // Xóa span nếu không có nội dung
            } catch (error) {
                console.error('Error removing span:', error);
            }
        }
    });

    // Kiểm tra nếu không còn span nào trong parentElement
    // console.log(parentElement.querySelectorAll('span'));
    if (parentElement.querySelectorAll('span').length === 0) {
        try {
            parentElement.parentElement.removeChild(parentElement); // Xóa parentElement
            return false;
        } catch (error) {
            console.error('Error removing parentElement:', error);
        }
    }
    
    return true;
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

function myFunction(event) {
    if (event.keyCode == 16) {
        // Execute command if user presses the SHIFT button:
        document.execCommand("bold");
    }
}

function Bold() {
    console.log("bold");
    document.execCommand("bold");
}  