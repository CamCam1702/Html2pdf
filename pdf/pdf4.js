
// window.addEventListener('click',
document.addEventListener('DOMContentLoaded', () => {
    const article = document.getElementById("allvoice");
    const commentsContainer = document.getElementById("comment-list");
    var flag = false;
    const commentsArray = [
        { id: 'comment-box-1', comment: 'Sửa lại căn lề đi', name: 'Lý Công Thành', active: true },
        { id: 'comment-box-2', comment: 'Đổi điện thoại thành phone', name: 'Nguyễn Hoàng Long', active: true },
        { id: 'comment-box-3', comment: 'Đừng sửa chỗ này', name: 'Lưu Thị Lâm Oanh', active: false }
    ];
    const btn_comment = document.getElementById("comment");
    let commentIdCounter = 3; // cách sưa tạm thời

    const eventHandlers = {};

    // function findAndAddEventListeners() {
    //     commentsArray.forEach(comment => {
    //         if(comment.active){
    //             const elements = document.querySelectorAll(.${comment.id});
    //             elements.forEach(element => {
    //                 element.addEventListener('click', () => {
    //                     console.log(element.classList.length);
    //                     if (!document.getElementById(comment.id)) {
    //                         if(element.classList.length == 2){
    //                         addCommentDB(comment.id, comment.comment, comment.name);
    //                     }else if(element.classList.length > 2){
    //                         addCommentDB(comment.id, comment.comment, comment.name); 
    //                         const matchedComments = [];
    //                     element.classList.forEach(cls => {
    //                         if (cls !== "highlight") {
    //                             const matchedComment = commentsArray.find(c => c.id === cls);
    //                             if (matchedComment) {
    //                                 matchedComments.push(matchedComment);
    //                                 addMulCommentDB(matchedComments);
    //                             }
    //                         }
    //                     });
    //                     console.log(matchedComments);
    //                     }
    //                 }
    //                 });
    //             });
    //         }
            
    //     });
    // }

    const processedElements = new Set();
    

    function findAndAddEventListeners() {
        commentsArray.forEach(comment => {
            // var flag = false;
            if (comment.active) {
                const elements = document.querySelectorAll(`.${comment.id}`);
                // console.log(comment.id);
                // console.log(elements);
                // elements.forEach(element => {
                for(var i=0; i<elements.length; i++) {
                    var element = elements[i];
                    // if(flag){
                    //     return;
                    // }
                    if (!processedElements.has(element)) {
                        processedElements.add(element);
                        element.addEventListener('click', () => { 
                            console.log("chạy click");
                            event.stopPropagation();
                            // console.log(element);
                            if (!document.getElementById(comment.id)) {
                                if (element.classList.length == 2 || true) {
                                    // console.log("có 2 cái");
                                    addCommentDB(comment.id, comment.comment, comment.name);
                                    // flag = true;
                                } else if (element.classList.length > 2) {
                                    console.log("có nhiều cái");
                                    const matchedComments = [];
                                    element.classList.forEach(cls => {
                                        if (cls !== "highlight") {
                                            const matchedComment = commentsArray.find(c => c.id === cls);
                                            matchedComments.push(matchedComment);
                                        }
                                    });
                                    addMulCommentDB(matchedComments);
                                }
                            }
                        });
                        // console.log("đã set hàm");
                        // console.log(element);
                    }
                }
            }
        });
    }

    findAndAddEventListeners();

    btn_comment.addEventListener('click', () => {
        var selection = window.getSelection();
        if(selection.rangeCount > 0){
            var range = selection.getRangeAt(0);
            console.log(range);
            addComment(null, null, null, range); 
        }
    });

    function createCommentBox(id, content, name) {
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-box';
        commentItem.id = `comment-container-${id}`;
    
        commentItem.innerHTML = `
            <div class="comment-header">
                <div class="comment-author">
                    <span id="comment-name-${id}">${name || 'Anonymous'}</span>
                </div>
            </div>
            <div class="comment-content">
                <textarea id="comment-text-${id}" rows="5" class="comment-textarea">${content}</textarea>
                <p>Comment or add others with @</p>
            </div>
            <div class="comment-footer">
                <div class="">
                    <button class="comment-delete-docs" id="delete-${id}" title="Delete">Delete</button>
                    <button class="comment-cancel-docs" title="Cancel">Cancel</button>
                    <button class="comment-submit comment-submit-enable" id="submit-${id} title="Submit"">Comment</button>
                </div>
            </div>
        `;
        commentsContainer.appendChild(commentItem);
        const deleteButton = document.querySelector(`#delete-${id}`);
    }

    function createSubComment(commentElement, id, content, name) {
        commentElement.innerHTML += `
        <hr>
            <div class="comment-header">
                <div class="comment-author">
                    <span id="comment-name-${id}">${name || 'Anonymous'}</span>
                </div>
            </div>
            <div class="comment-content">
                <textarea id="comment-text-${id}" rows="5" class="comment-textarea">${content}</textarea>
                <p>Comment or add others with @</p>
            </div>
            <div class="comment-footer">
                <div class="">
                    <button class="comment-delete-docs" id="delete-${id}">Delete</button>
                    <button class="comment-cancel-docs">Cancel</button>
                    <button class="comment-submit comment-submit-enable" id="submit-${id}">Comment</button>
                </div>
            </div>
        `;
    }

    function addCommentDB(id = null, content  = '', name = '') {
        // if(!flag){
        //     return;
        // }else{
        //     flag = true;
        // }
        const existingCommentBox = document.querySelector('.comment-box');
        if (existingCommentBox) {
            commentsContainer.removeChild(existingCommentBox);
        }
        if (!id) {
            commentIdCounter++;  // Tăng giá trị biến đếm mỗi khi tạo comment box
            id = `comment-box-${commentIdCounter}`;  // Tạo ID duy nhất
            content = '';
        }
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-box';
        commentItem.id = id; 
        commentItem.setAttribute('tabindex', '0'); 
        commentItem.innerHTML = `
            <div class="comment-header">
                <div class="comment-author">
                    <span id="comment-name-${id}">${name}</span>
                </div>
            </div>
            <div class="comment-content">
                <textarea id="comment-text-${commentIdCounter}" rows="5" class="comment-textarea">${content}</textarea>
                <p>Comment or add others with @</p>
            </div>
            <div class="comment-footer">
                <div class="">
                    <button class="comment-delete-docs" id="delete-${commentIdCounter}">Delete</button>
                    <button class="comment-cancel-docs">Cancel</button>
                    <button class="comment-submit comment-submit-enable" id="submit-${commentIdCounter}">Comment</button>
                </div>
            </div>
        `;
        commentsContainer.appendChild(commentItem);
        const commentTextarea = document.querySelector(`#comment-text-${commentIdCounter}`);
        const commentSubmitButton = document.querySelector(`#submit-${commentIdCounter}`);
        const cancelButton = commentItem.querySelector('.comment-cancel-docs');
        const deleteButton = document.querySelector(`#delete-${commentIdCounter}`);
        
        cancelButton.addEventListener('click', () => {
            commentsContainer.removeChild(commentItem);
        });

        deleteButton.addEventListener('click', () => {
            const elements = document.querySelectorAll(`.${id}`);
            elements.forEach(element => {
                element.classList.remove('highlight');  // Loại bỏ highlight
            });
            commentsContainer.removeChild(commentItem);
            
            // Xóa comment khỏi mảng
            const commentIndex = commentsArray.findIndex(c => c.id === id);
            if (commentIndex !== -1) {
                commentsArray.splice(commentIndex, 1);
            }

            console.log(commentsArray);  // In ra mảng để kiểm tra

            // Loại bỏ sự kiện click trên các phần tử
            elements.forEach(element => {
                const clone = element.cloneNode(true);
                element.parentNode.replaceChild(clone, element);
            });
            // console.log(commentsArray);
        });
    }

    function addMulCommentDB(comment = []){
        const existingCommentBox = document.querySelector('.comment-box');
        if (existingCommentBox) {
            commentsContainer.removeChild(existingCommentBox);
        }
        commentIdCounter++;  // Tăng giá trị biến đếm mỗi khi tạo comment box
        id = `comment-box-${commentIdCounter}`;  // Tạo ID duy nhất
        content = '';

        for (let i = 0; i < comment.length; i++) {
            if (comment[i].active) {
                id = comment[i].id;
                console.log(comment[i].id);
                createCommentBox(comment[i].id, comment[i].comment, comment[i].name);
                break;
            }
        }
        const commentBox = document.querySelector(`#comment-container-${id}`);
        console.log(comment[1].id);
        createSubComment(commentBox, comment[1].id, comment[1].comment, comment[1].name)

    }

    function addComment(id = null, content = '', name = '', range) {
        const existingCommentBox = document.querySelector('.comment-box');
        if (existingCommentBox) {
            commentsContainer.removeChild(existingCommentBox);
        }
        if (!id) {
            commentIdCounter++;  // Tăng giá trị biến đếm mỗi khi tạo comment box
            id = `comment-box-${commentIdCounter}`;  // Tạo ID duy nhất
            content = '';
            name = 'Lý Công Thành';
        }
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-box';
        commentItem.id = id; 
        commentItem.setAttribute('tabindex', '0'); 
        commentItem.innerHTML = `
            <div class="comment-header">
                <div class="comment-author">
                    <span id="comment-name-${id}">${name}</span>
                </div>
            </div>
            <div class="comment-content">
                <textarea id="comment-text-${commentIdCounter}" rows="5" class="comment-textarea">${content}</textarea>
                <p>Comment or add others with @</p>
            </div>
            <div class="comment-footer">
                <div class="">
                    <button class="comment-delete-docs" id="delete-${commentIdCounter}">Delete</button>
                    <button class="comment-cancel-docs">Cancel</button>
                    <button class="comment-submit comment-submit-enable" id="submit-${commentIdCounter}">Comment</button>
                </div>
            </div>
        `;
        commentsContainer.appendChild(commentItem);
        const commentNameInput = document.querySelector(`#comment-name-${id}`);
        const commentTextarea = document.querySelector(`#comment-text-${commentIdCounter}`);
        const commentSubmitButton = document.querySelector(`#submit-${commentIdCounter}`);
        const cancelButton = commentItem.querySelector('.comment-cancel-docs');
        const deleteButton = document.querySelector(`#delete-${commentIdCounter}`);
        
        cancelButton.addEventListener('click', () => {
            commentsContainer.removeChild(commentItem);
        });

        commentTextarea.focus();

        commentTextarea.addEventListener('input', () => {
            if (commentTextarea.value.trim()) {
                commentSubmitButton.classList.remove('comment-submit-disabled');
                commentSubmitButton.classList.add('comment-submit-enable');
            } else {
                commentSubmitButton.classList.remove('comment-submit-enable');
                commentSubmitButton.classList.add('comment-submit-disabled');
            }
        });

        commentSubmitButton.addEventListener('click', () => {
            if (commentTextarea.value.trim()) {
                commentsArray.push({
                    id: id,
                    comment: commentTextarea.value.trim(),
                    name: commentNameInput.textContent.trim(),
                    active: true,
                });
                console.log(commentsArray);
                //range start
                var rangeStart = new Range();
                rangeStart.setStart(range.startContainer, range.startOffset);
                rangeStart.setEnd(range.startContainer, range.startContainer.textContent.length);

                // end
                var rangeEnd = new Range();
                rangeEnd.setStart(range.endContainer, 0);
                rangeEnd.setEnd(range.endContainer, range.endOffset);

                var spansInRange = [];
                if(range.startContainer == range.endContainer) {
                    var span = SpanCreate(range);
                    spansInRange.push(span);
                }
                else {
                    var startSpan = SpanCreate(rangeStart);
                    // console.log(startSpan);
                    var endSpan = SpanCreate(rangeEnd);
                    var spansInRange = getSpansInRange(document.getElementById('allvoice'), range.startContainer, range.endContainer);
                    // spansInRange.push(startSpan);
                    spansInRange.push(endSpan);
                }

                
                
                // spansInRange.push(endSpan);
                console.log(spansInRange);
                applyHighlightComment2([id, 'highlight'], spansInRange);
                findAndAddEventListeners();
                console.log("chạy xong hàm");
            }
        });

        deleteButton.addEventListener('click', () => {
            const elements = document.querySelectorAll(`.${id}`);
            // console.log(elements);
            elements.forEach(element => {
                element.classList.remove('highlight');  // Loại bỏ highlight
            });
            commentsContainer.removeChild(commentItem);
            // Xóa comment khỏi mảng
            const commentIndex = commentsArray.findIndex(c => c.id === id);
            if (commentIndex !== -1) {
                commentsArray.splice(commentIndex, 1);
            }
            console.log(commentsArray);
            // Loại bỏ sự kiện click trên các phần tử
            elements.forEach(element => {
                const clone = element.cloneNode(true);
                element.parentNode.replaceChild(clone, element);
            });
        });
    }
});

function applyHighlightComment2(classes, spans) {
    spans.forEach(span => {
        classes.forEach(cls => {
            span.classList.add(cls);
        });
    });
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

function SpanCreate(range){
    var span = document.createElement('SPAN');
    span.innerHTML = range.toString();
    range.deleteContents();
    range.insertNode(span);
    return span;
}

// window.onload = function () {
//     //     document.getElementById('highlight').addEventListener("click", function(){
//     //         applyTextFormatting('highlight');
//     //         this.classList.remove("state-off");
//     //         this.classList.add("state-on");
//     // });
//     // document.getElementById('allvoice').addEventListener("mouseup", function(){
//     //     handleTextClick();
//     // });
//     // document.getElementById('bold').addEventListener("click", function() {
//     //     applyTextFormatting('bold');
//     // });
//     // document.getElementById('italic').addEventListener("click", function() {
//     //     applyTextFormatting('italic');
//     // });
// }
//ko cần 
// function applyTextFormatting(mode) {
//     var selection = window.getSelection();
//     if (selection.rangeCount === 0) {
//         return;
//     }
//     var range = selection.getRangeAt(0);
//     if (range.collapsed) {
//         FullLine(range, mode);
//     } else if (range.startContainer == range.endContainer){
//         applyToRange(range, mode);
//     }else {
//         applySelection(range, mode);
//     }
// }

// function applyHightlightComment(mode, range) {
//     if (range.collapsed) {
//         FullLine(range, mode);
//     } else if (range.startContainer == range.endContainer){
//         applyToRange(range, mode);
//     }else {
//         applySelection(range, mode);
//     }
// }

// function handleTextClick() {
//     var selection = window.getSelection();
//     if (selection.rangeCount === 0) {
//         return;
//     }
//     var range = selection.getRangeAt(0);
//     var highlightButton = document.getElementById("highlight");
//     if (range.startContainer.parentElement.classList.contains("highlight")) {
//         highlightButton.classList.add("state-on");
//     } else {
//         highlightButton.classList.remove("state-on");
//         highlightButton.classList.add("state-off");
//     }
// }


// function FullLine(range, mode){
//     spans = findParentDivRecursive(range.startContainer).querySelectorAll('span');
//     for(i=0; i<spans.length; i++){
//         applyToSpan(spans[i], mode);
//     }
// }
// function applySelection(range, mode) {
//     var editableElement = document.activeElement;
//     console.log("Editable Element:", editableElement);

//     //start
//     var rangeStart = new Range();
//     rangeStart.setStart(range.startContainer, range.startOffset);
//     rangeStart.setEnd(range.startContainer, range.startContainer.textContent.length);

//     applyToRange(rangeStart, mode);

//     //end
//     var rangeEnd = new Range();
//     rangeEnd.setStart(range.endContainer, 0);
//     rangeEnd.setEnd(range.endContainer, range.endOffset);

//     applyToRange(rangeEnd, mode);

//     //middle
//     let spansInRange = getSpansInRange(document.getElementById('allvoice'), range.startContainer, range.endContainer);
//     console.log(spansInRange);
//     for(i=1; i<spansInRange.length-1; i++){
//         applyToSpan(spansInRange[i], mode);
//     }
// }


//node này cần dưới dạng benAkey3
// function applyToSpan(node, mode){
//     if (node.classList.contains(mode)) {
//         node.classList.remove(mode);
//     } else {
//         node.classList.add(mode);
//     }
// }

// function CreateRange(node, mode){
//     var range = new Range();
//     range.selectNodeContents(node);
//     applyToRange(range, mode);
// }

// function applyToRange(range, mode){
//     var span = document.createElement('SPAN');
//     span.innerHTML = range.toString();
//     span.className = mode;
//     range.deleteContents();
//     range.insertNode(span);
// }



// function enableEditMode_test() {
//     var allvoice = document.getElementById("allvoice");
//     if (allvoice) {
//         allvoice.contentEditable = true;
//     } else {
//         console.error("Element with id 'allvoice' not found.");
//     }
// }

// document.addEventListener("DOMContentLoaded", function() {
//     enableEditMode_test();
// });

// function findParentDivRecursive(element) {
//     if (!element) {
//         return null;
//     }

//     if (element.nodeName === 'DIV') {
//         return element;
//     } else {
//         return findParentDivRecursive(element.parentElement);
//     }
// }