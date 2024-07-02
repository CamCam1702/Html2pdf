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

    FirstDad = findParentDivRecursive(range.startContainer);
    LastDad = findParentDivRecursive(range.endContainer);

    // console.log(FirstDad);
    // console.log(FirstDad);

    var startContainer = range.startContainer;
    var endContainer = range.endContainer;

    var ori1 = startContainer.textContent;
    var ori2 = endContainer.textContent;

    var clonedRange = range.cloneContents();

    var spanElements = clonedRange.querySelectorAll('span');
    console.log(spanElements);
    // for ech span element, add the class highlight if it is not already there
    spanElements.forEach(spanElement => {
        if (!spanElement.classList.contains(highlightCls)) {
            spanElement.classList.add(highlightCls);
        }
    });

    var s1Text = ori1.substring(0, range.startOffset);
    var s2Text = ori2.substring(range.endOffset, endContainer.textContent.length);

    // Tạo các phần tử span cho s1 và s2
    var s1Span = document.createElement('span');
    s1Span.textContent = s1Text;

    var s2Span = document.createElement('span');
    s2Span.textContent = s2Text;

    console.log(spanElements);
    spanElements[0].parentElement.insertBefore(s1Span, spanElements[0]);
    spanElements[spanElements.length - 1].parentElement.appendChild(s2Span);
    console.log(spanElements);
    console.log(endContainer);

    // console.log(startContainer);
    startContainer.parentElement.removeChild(startContainer);
    endContainer.parentElement.removeChild(endContainer);

    
    // console.log(FirstDad.querySelectorAll('span'));
    // var fCheck = removeEmptySpans(FirstDad);
    // console.log('fCheck:', fCheck);
    // LastDad = findParentDivRecursive(clonedRange.endContainer);
    console.log(LastDad);
    console.log(LastDad.childNodes);
    appendClonedRangeFirst(FirstDad, spanElements);
    // appendClonedRangeLast(LastDad, spanElements);   


    range.deleteContents();
    range.insertNode(clonedRange);

    //TODO: append all element from start(end) container to the cloned range

    // return startContainer.parentElement.textContent.length;
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
    console.log(LastDad.childNodes.length);
    var cnt = 0;
    LastDad.childNodes.forEach(spanElement => {
        // if (spanElement.nodeType === Node.ELEMENT_NODE && spanElement.nodeName === 'SPAN' && !spanElement.classList.contains(highlightCls)) {
        //     console.log(spanElement);
        //     var newSpan = document.createElement('span');
        //     newSpan.textContent = spanElement.textContent;
        //     if (spanElement.id) {
        //         newSpan.id = spanElement.id;
        //     }
        //     spanElements[spanElements.length - 1].parentElement.appendChild(newSpan);
        // }
        console.log(spanElement);
        cnt ++;
    });
    console.log('cnt:', cnt);

    // LastDad.parentElement.removeChild(LastDad);
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
