
// window.addEventListener('click',
var commentsContainer;
var commentIdCounter = 3;
var eventHandlers = {};
var processedElements = new Set();
var btn_comment;
let commentDiv;
var commentsArray = [
    { id: 'comment-box-1', comment: 'Sửa lại căn lề đi', name: 'Lý Công Thành' ,pID: null},
    { id: 'comment-box-2', comment: 'Đổi điện thoại thành phone', name: 'Nguyễn Hoàng Long', pID: null },
    { id: 'comment-box-3', comment: 'Đừng sửa chỗ này', name: 'Lưu Thị Lâm Oanh', pID:  'comment-box-1'}
];
var mousePosition;
var offset = [0,0];
var div;
var isDown = false;
var isDragging = false;

var newWord;
var new_range = new Range();

var doc;


document.addEventListener('mouseup', function(){
    isDown = false;
});

document.addEventListener('mousemove', function(event) {
    var div = document.querySelector('.comment-box');
    event.preventDefault();
    if (isDown) {
        isDragging = true;
        mousePosition = {
            x : event.clientX,
            y : event.clientY
        };
        div.style.left = (mousePosition.x + offset[0]) + 'px';
        div.style.top  = (mousePosition.y + offset[1]) + 'px';
    }
}, true);

document.addEventListener('DOMContentLoaded', () => {
    doc = document.getElementById('allvoice');
    doc.contentEditable = true;
    commentsContainer = document.getElementById("comment-list");
    btn_comment = document.getElementById("comment");
    var commentIdCounter = 3; // cách sửa tạm thời
    console.log(commentsArray);

    findAndAddEventListeners();
    btn_comment.addEventListener('click', () => {
        var selection = window.getSelection();
        if (selection.rangeCount > 0) {
            var range = selection.getRangeAt(0);
            addComment(null, null, null, range);
        }
    });


    //thêm mới thì đổi màu
    doc.addEventListener('mouseup', function() {
        if(newWord && newWord.textContent === '\u200B') {
            newWord.parentNode.removeChild(newWord);
            newWord = null;
        }
        var selection = window.getSelection();
        var range = selection.getRangeAt(0);
        if(range.collapsed){
            newWord = SpanCreate(range);
            newWord.classList.add('highlight');
            newWord.innerHTML = '&#8203;';
            range.collapse(false);
            new_range = range;
            var range_sub = new Range();
            range_sub.setStartBefore(newWord);
            range_sub.setEndBefore(newWord);
            selection.removeAllRanges();
            selection.addRange(range_sub);
        }
        
    }, true);
    
    doc.addEventListener('keydown', function(event) {
        var selection = window.getSelection();
        var range = selection.getRangeAt(0);
    
        const specialKeys = [ 'Alt', 'Shift', 'Control', 'Meta'];
        if (specialKeys.includes(event.key) || !selection.isCollapsed) {
            return;
        }

        //tạo lại newword nếu người dùng xoá
        if(event.key == 'Backspace'){
            if(newWord.textContent == '\u200B') {
                newWord.parentNode.removeChild(newWord);
                newWord = SpanCreate(range);
                newWord.classList.add('highlight');
                newWord.innerHTML = '&#8203;';
                range.collapse(false);
                new_range = range;
                var range_sub = new Range();
                range_sub.setStartBefore(newWord);
                range_sub.setEndBefore(newWord);
                selection.removeAllRanges();
                selection.addRange(range_sub);
            }
            return;
        }
    
        selection.removeAllRanges();
        selection.addRange(new_range);
    });
});



function createReply(commentElement, id, content, name) {
    const replyContainer = document.createElement('div');
    replyContainer.classList.add('reply-container-${id}');
    replyContainer.innerHTML = `
        <div class="reply-header" id="reply-header-${id}">
            <div class="reply-author">
                <span>${name}</span>
            </div>
        </div>
        <div class="reply-content" id="reply-content-${id}">
            <textarea id="reply-text-${id}" rows="2" class="comment-textarea" placeholder="Write a reply...">${content}</textarea>
        </div>
        <div class="reply-footer" style = "visibility: visible;">
            <button class="comment-cancel-docs" id="reply-cancel-${id}">Delete</button>
        </div>
    `;

    commentElement.appendChild(replyContainer);
    const deleteButton = commentElement.querySelector(`#reply-cancel-${id}`);

    deleteButton.addEventListener('click', () => {
        commentElement.removeChild(replyContainer);
    });
}

function addCommentDB(id = null, content = '', name = '') {
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
                <textarea id="comment-text-${id}" rows="5" class="comment-textarea">${content}</textarea>
                <p>Comment or add others with @</p>
            </div>
            <div class="comment-footer">
                <button class="comment-delete-docs" id="delete-${id}">Delete</button>
                <button class="comment-cancel-docs">Hide</button>
            </div>
            <div id = "reply-list-${id}"></div>
            <div class="reply-content">
                <textarea id="reply-text-${id}" rows="2" class="comment-textarea" placeholder="Write a reply..."></textarea>
            </div>
            <div class="reply-footer" id="reply-footer-${id}">
                <button class="comment-cancel-docs" id="reply-cancel-${id}">Cancel</button>
                <button class="comment-submit comment-submit-disabled" id="reply-submit-${id}">Reply</button>
            </div>
        `;
    commentsContainer.appendChild(commentItem);
    commentItem.addEventListener('click', () => {
        if (!isDragging) {
            console.log("Comment");
        document.getElementsByClassName(id)[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
    });
    commentItem.addEventListener('mousedown', function(e) {
        isDragging = false;
        isDown = true;
        offset = [
            commentItem.offsetLeft - e.clientX,
            commentItem.offsetTop - e.clientY
        ];
    }, true);
    var cancelButton = commentItem.querySelector('.comment-cancel-docs');
    var deleteButton = document.querySelector(`#delete-${id}`);
    var replyTextarea = commentItem.querySelector(`#reply-text-${id}`);
    var replyFooter = commentItem.querySelector(`#reply-footer-${id}`);
    var replyCancelButton = commentItem.querySelector(`#reply-cancel-${id}`);
    var replySubmitButton = commentItem.querySelector(`#reply-submit-${id}`);
    var reply_list_id = `reply-list-${id}`;
    const reply_list = document.getElementById(reply_list_id);

    // Event click vào textarea của reply
    replyTextarea.addEventListener('focus', () => {
        replyFooter.style.visibility = 'visible';
    });
    
    replyTextarea.addEventListener('blur', () => {
        if (!replyTextarea.value.trim()) {
            replyFooter.style.visibility = 'hidden';
        }
    });

    replyTextarea.addEventListener('input', () => {
        if (replyTextarea.value.trim()) {
            replySubmitButton.classList.remove('comment-submit-disabled');
            replySubmitButton.classList.add('comment-submit-enable');
        } else {
            replySubmitButton.classList.remove('comment-submit-enable');
            replySubmitButton.classList.add('comment-submit-disabled');
        }
    });

    cancelButton.addEventListener('click', () => {
        event.stopPropagation();
        commentsContainer.removeChild(commentItem);
        removeAllFocusClasses();
    });

    replyCancelButton.addEventListener('click', () => {
        replyFooter.style.visibility = 'hidden';
        replyTextarea.value = '';
    });

    replySubmitButton.addEventListener('click', () => {
        commentIdCounter++;
        var reply_id = `comment-box-${commentIdCounter}`;
        createReply(reply_list, reply_id, replyTextarea.value, "Lý Công Thành");
        //thêm vào mảng
        commentsArray.push({
            id: reply_id,
            comment: replyTextarea.value,
            name: "Lý Công Thành",
            pID: id,
        });
        //reset chỗ reply
        replyCancelButton.click();
    });


    //xoá: 
    deleteButton.addEventListener('click', () => {
        event.stopPropagation();
        const elements = document.querySelectorAll(`.${id}`);
        elements.forEach(element => {
            var textNode = document.createTextNode(element.textContent);
            element.parentNode.replaceChild(textNode, element);
        });
        commentsContainer.removeChild(commentItem);
        // Xóa comment khỏi mảng
        const commentIndex = commentsArray.findIndex(c => c.id === id);
        if (commentIndex !== -1) {
            commentsArray.splice(commentIndex, 1);
        }
        const replyIndex = commentsArray.findIndex(c => c.pID === id);
        if (replyIndex !== -1) {
            commentsArray.splice(replyIndex, 1);
        }
        removeAllFocusClasses();
    });

    //Thêm các cmt nếu có
    var addedReply = commentsArray.filter(comment => comment.pID === id);
    for(var i = 0; i < addedReply.length; i++) {
        createReply(reply_list, addedReply[i].id, addedReply[i].comment, addedReply[i].name);
    }
}

function findAndAddEventListeners() {
    commentsArray.forEach(comment => {
            const elements = document.querySelectorAll(`.${comment.id}`);
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                if (!processedElements.has(element)) {
                    processedElements.add(element);
                    element.addEventListener('click', () => {
                        console.log("chạy click");
                        event.stopPropagation();
                        if (!document.getElementById(comment.id)) {
                            if (element.classList.length == 2 || true) {
                                removeAllFocusClasses();
                                addCommentDB(comment.id, comment.comment, comment.name);
                                const elementfocus = document.querySelectorAll(`.${comment.id}`);
                                console.log(elementfocus);
                                const allFocusElements = findAndAddSpanElements(elementfocus);
                                applyHighlightComment2(['focus'], allFocusElements);
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
                }
        }
    });
}
function findAndAddSpanElements(elementfocus) {
    const allElements = [];

    elementfocus.forEach(element => {
        allElements.push(element);

        const spanElements = element.querySelectorAll('span');
        spanElements.forEach(span => {
            allElements.push(span);
        });
    });

    return allElements;
}
function removeAllFocusClasses() {
    const focusedElements = document.querySelectorAll('.focus');

    console.log(focusedElements);

    focusedElements.forEach(element => {
        element.classList.remove('focus');
    });
}
function addComment(id = null, content = '', name = '', range) {
    var existingCommentBox = document.querySelector('.comment-box');
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
            <textarea id="comment-text-${id}" rows="5" class="comment-textarea">${content}</textarea>
            <p>Comment or add others with @</p>
        </div>
        <div class="comment-footer">
            <div class="">
                <button class="comment-delete-docs" id="delete-${id}">Delete</button>
                <button class="comment-cancel-docs">Cancel</button>
                <button class="comment-submit comment-submit-disabled" id="submit-${id}">Comment</button>
            </div>
        </div>
    `;
    commentsContainer.appendChild(commentItem);
    const commentNameInput = document.querySelector(`#comment-name-${id}`);
    const commentTextarea = document.querySelector(`#comment-text-${id}`);
    const commentSubmitButton = document.querySelector(`#submit-${id}`);
    const cancelButton = commentItem.querySelector('.comment-cancel-docs');
    const deleteButton = document.querySelector(`#delete-${id}`);

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
                pID: null,
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
            if (range.startContainer == range.endContainer) {
                var span = SpanCreate(range);
                spansInRange.push(span);
            }
            else {
                var startSpan = SpanCreate(rangeStart);
                var endSpan = SpanCreate(rangeEnd);
                var spansInRange = getSpansInRange(document.getElementById('allvoice'), range.startContainer, range.endContainer);
                spansInRange.push(endSpan);
            }
            // spansInRange.push(endSpan);
            console.log(spansInRange);
            removeAllFocusClasses();
            applyHighlightComment2([id, 'highlight', 'focus'], spansInRange);
            findAndAddEventListeners();

            addCommentDB(id, commentTextarea.value, name);
            console.log("chạy xong hàm");
        }
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
        console.log(commentsArray);
        // Loại bỏ sự kiện click trên các phần tử
        elements.forEach(element => {
            const clone = element.cloneNode(true);
            element.parentNode.replaceChild(clone, element);
        });
    });
}

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

function SpanCreate(range) {
    var span = document.createElement('SPAN');
    span.innerHTML = range.toString();
    range.deleteContents();
    range.insertNode(span);
    return span;
}