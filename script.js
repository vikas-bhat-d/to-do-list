function showDay(date,day){
    let li=document.createElement('li');
    li.classList.add('day');
    li.id=`${date}`
    li.setAttribute("draggable","false")
    li.innerHTML=`<P>${day}</P><P>${date}</P>`;
    document.querySelector('.daysList') .appendChild(li);
    data[date]={
        task:"",
        done:""
    }
}


function displayDates(){
    for(let i=0;i<3;i++){
        let temp=new Date(2024,4,currentDate-3+i)
        showDay(temp.getDate(),day[temp.getDay()]);
    }
    showDay(currentDate,day[currentDay])
    for(let i=0;i<3;i++){
        let temp=new Date(2024,4,currentDate+i+1)
        showDay(temp.getDate(),day[temp.getDay()]);
    }
    dayList.scrollLeft=(dayList.scrollWidth-dayList.clientWidth)/2
    document.getElementById(`${currentDate}`).classList.add('show-bg')
    // localStorage.setItem("data",JSON.stringify(data))
    if(getData()!=null){
    let tempData=getData();
    Object.keys(data).forEach((ele)=>{
        if(tempData[ele]==undefined) return
        if(tempData[ele].task!="" || tempData[ele].task!=undefined)
            data[ele].task=tempData[ele].task
        if(tempData[ele].done!="" || tempData[ele].done!=undefined)
            data[ele].done=tempData[ele].done
    })
    }
    showTasks(currentDate);
}

function addTask(desc,time,priority){
    li=document.createElement('li');
    li.classList.add("task")
    li.style.borderLeftColor=priority
    li.setAttribute('id',priority)
    li.innerHTML=`<div id="checkIcon"></div><p id="time">${time}</p><p id="desc">${desc}</p><div id="xMark">&#10005;</div>`
    taskList.appendChild(li)
}

function dragging(e){
    if(!draggable) return;
    dayListDragged=true
    dayList.classList.add("dragging")
    dayList.setAttribute("draggable","false")
    dayList.scrollLeft-=e.movementX;
}

function drag(e){
    dayList.scrollLeft+= (e.target.id==="right"?130:-130)
}

function setData(){
    let taskCount=taskList.querySelector('p')
    let doneCount=doneList.querySelector('p')
    taskList.removeChild(taskCount)
    doneList.removeChild(doneCount)
    data[selectedDate].task=taskList.innerHTML
    data[selectedDate].done=doneList.innerHTML
    taskList.innerHTML="<p>Task(0)</p>"+taskList.innerHTML
    doneList.innerHTML="<p>Done(0)</p>"+doneList.innerHTML
    localStorage.setItem("data",JSON.stringify(data))
    data=getData()
}

function getData(){
    return JSON.parse(localStorage.getItem("data"))
}

function add(e){
    list.classList.remove('no-task')
    list.classList.remove('empty-list')
    if(e.target.parentElement==rightButton || e.target==rightButton || e.target.tagName=="path"){
        let taskDescription=addContainer.querySelector('input[type="text"]').value
        let taskTime=addContainer.querySelector('input[type="time"]').value
        let taskPriority=addContainer.querySelector('input[type="radio"]:checked').value
        if(taskDescription!="")
            addTask(taskDescription,taskTime,taskPriority)
        else
            alert("Task field is empty")
        updateCount()
        addContainer.querySelector('input[type="text"]').value=""
        addContainer.querySelector('input[type="time"]').value="23:59"
        list.classList.toggle('hide')
        addContainer.classList.toggle('hide')
        rightButton.classList.toggle('hide')
        addButton.classList.toggle('hide')
        xButton.classList.add('hide')
    }
    if(e.target.parentElement==xButton || e.target==xButton){
        list.classList.remove('hide')
        addContainer.classList.add('hide')
        rightButton.classList.add('hide')
        xButton.classList.add('hide')
        addButton.classList.remove('hide')
    }
    else if(e.target.parentElement==addButton || e.target==addButton){
        list.classList.add('hide')
        addContainer.classList.remove('hide')
        rightButton.classList.toggle('hide')
        addButton.classList.add('hide')
        xButton.classList.remove('hide')
    }
    sortTasks();
    setData();
    updateCount();
    if((taskList.children.length==1 && doneList.children.length==1)||(taskList.children.length==0&& doneList.children.length==0))
        list.classList.add('empty-list')
    else{
        list.classList.remove('empty-list')
        list.classList.remove('no-task')
    }
    showScrollbar();
}

function updateCount(){
    doneList.querySelector('p').innerHTML=`Done(${doneList.children.length-1})`
    taskList.querySelector('p').innerHTML=`Task(${taskList.children.length-1})`
}


function check(e){
    let xClicked=false
    if(removable) return
    if(e.target.tagName=="P" || e.target.tagName=="DIV" && e.target.id!="xMark"){
        e.target.parentElement.classList.toggle('checked')
        if(e.target.parentElement.parentElement==taskList){
            taskList.removeChild(e.target.parentElement)
            doneList.appendChild(e.target.parentElement)
        }
        else if(e.target.parentElement.parentElement==doneList){
            doneList.removeChild(e.target.parentElement)
            taskList.appendChild(e.target.parentElement)
        }
    }
    else if(e.target.tagName=="LI"){
        if(dragged) return
        e.target.classList.toggle('checked')
        if(e.target.parentElement==taskList){
            taskList.removeChild(e.target)
            doneList.appendChild(e.target)
        }
        else if(e.target.parentElement==doneList){
            doneList.removeChild(e.target)
            taskList.appendChild(e.target)
        }
    }
    if(e.target.id==="xMark"){
        xClicked=true
        li=e.target.parentElement
        li.innerHTML=""
        li.style.height="0px"
        li.style.margin="0px"
        removable=true
        setTimeout(()=>{
        li.parentElement.removeChild(li)
        removable=false
        if(taskList.children.length==1)
            list.classList.remove('empty-list')
        if((taskList.children.length==1&& doneList.children.length==1)||(taskList.children.length==0&& doneList.children.length==0))
            list.classList.add('empty-list')
        sortTasks();
        setData();
        updateCount();
        showScrollbar();
        xClicked=false
        },300)
    }
    if((taskList.children.length==1 && doneList.children.length==1)||(taskList.children.length==0&& doneList.children.length==0))
        list.classList.add('empty-list')
    else{
        list.classList.remove('empty-list')
        list.classList.remove('no-task')
    }
    if(!xClicked){
        sortTasks();
        setData();
        showScrollbar()
    }
    updateCount();
}


function showTasks(date){
    if((data[date].task!=undefined&& data[date].task!="")||(data[date].done!=undefined&& data[date].done!="")){
        list.classList.remove('empty-list')
        taskList.innerHTML="<p>Task(0)</p>"+data[date].task
        doneList.innerHTML="<p>Done(0)</p>"+data[date].done
    }
    else{
        taskList.innerHTML="<p>Task(0)</p>"
        doneList.innerHTML="<p>Done(0)</p>"
        list.classList.add('empty-list')
    }
    showScrollbar();
    sortTasks();
    updateCount();
}

function showScrollbar(){
    if(list.scrollHeight!=list.clientHeight){
        scrollBar.classList.remove('hide-scrollbar')
        scrollBarThumb.style.height=`${scrollBar.clientHeight*list.clientHeight/list.scrollHeight}px`
    }
    else
        scrollBar.classList.add('hide-scrollbar')
}

function dragList(e){
    if(listDraggable==false) return
    list.classList.add('dragging')
    list.scrollTop-=e.movementY;
    dragged=true
}


function sortTasks(){
    priorityRank=["#ababaa","#9a70db","#68c660","#f2be57","#f16758"]
    let listToSort=[];
    Array.from(taskList.children).splice(1).forEach((ele)=>{
        taskList.removeChild(ele);
        listToSort.push({outerHtml:ele.outerHTML,priority:ele.id,time:ele.querySelector('#time').innerHTML})
    })
    listToSort=listToSort.sort((a,b)=>{
        aTime=a.time.split(":")[0]*10+a.time.split(":")[1]
        bTime=b.time.split(":")[0]*10+b.time.split(":")[1]
        if(aTime==bTime){
            return priorityRank.indexOf(b.priority)-priorityRank.indexOf(a.priority)
        }
        return aTime-bTime;
    })

    listToSort.forEach((ele)=>{
        taskList.insertAdjacentHTML("beforeend",ele.outerHtml);
    })
}

let d=new Date();
let currentDate=d.getDate();
let currentDay=d.getDay();
let dayList=document.querySelector('.daysList');
let ID;
let list=document.querySelector('.list');
day=["SUN","MON","TUE","WED","THU","FRI","SAT"]
let taskList=document.querySelector('.taskList')
let doneList=document.querySelector('.doneList')
scrollBar=document.querySelector('.scroll-bar')
scrollBarThumb=scrollBar.querySelector('.scroll-bar-thumb')
let thumbTop=0

data={
}
displayDates();
let selectedDate=currentDate.toString();
let draggable=false;
let dragged=false;
const icons=document.querySelectorAll('.icon')
let listDraggable=false;
let removable=false;
const addButton=document.querySelector('.add-button')
const rightButton=document.querySelector('.right-button')
const xButton=document.querySelector('.x-button')
const addContainer=document.querySelector('.add-container')
let dayListDragged=false
showScrollbar();
//event-listner for next and previous button
icons.forEach((button)=>{
    button.addEventListener("click",drag);
})

//dragging 
"mousedown touchdown".split(" ").forEach((eventName)=>{
    dayList.addEventListener(eventName,(e)=>draggable=true)
})

"mousemove touchmove".split(" ").forEach((eventName)=>{
    dayList.addEventListener(eventName,dragging)
})

"mouseup touchup".split(" ").forEach((eventName)=>{  
    document.addEventListener(eventName,(e)=>{
        draggable=false
        if(dayListDragged){
            setTimeout(() => {
                dayListDragged=false
            }, 50);
        }
        dayList.classList.remove("dragging")
    })
})

//to detect the click 
dayList.querySelectorAll('li').forEach((ele)=>{
    ele.addEventListener("click",(e)=>{
        if(draggable===true) return
        if(dayListDragged) return
        dayList.querySelector('.show-bg').classList.remove('show-bg')
        ele.classList.add('show-bg')
        selectedDate=ele.id;
        showTasks(selectedDate)
    })
})


//listeners to check for click on lists
doneList.addEventListener("click",check)
taskList.addEventListener("click",check)

//listener to check for click on add-buttons
addButton.addEventListener('click',add)
xButton.addEventListener('click',add)
rightButton.addEventListener('click',add)


"mousedown touchdown".split(" ").forEach((eventName)=>{
    list.addEventListener(eventName,(e)=>listDraggable=true)
})

"mousemove touchmove".split(" ").forEach((eventName)=>{
    list.addEventListener(eventName,dragList);
})

"mouseup touchup".split(" ").forEach((eventName)=>{  
    list.addEventListener(eventName,(e)=>{
        if(dragged){
            setTimeout(() => {
                dragged=false
            }, 50);
        }
        listDraggable=false
        list.classList.remove('dragging')
    })
})

let scrollable=false;
list.addEventListener('scroll',(e)=>{
    if(scrollable==true) return
    scrollBar.classList.add("scrolling")
    thumbTop=((scrollBar.clientHeight-scrollBarThumb.clientHeight)*list.scrollTop)/(list.scrollHeight-list.clientHeight)
    scrollBarThumb.style.top=`${thumbTop}px`
    setTimeout(()=>{
        scrollBar.classList.remove("scrolling")
    },100)
})

document.querySelectorAll('label').forEach((ele)=>{
    ele.style.backgroundColor=ele.getAttribute("for")
})

"mousedown touchdown".split(" ").forEach((eventName)=>{
    scrollBarThumb.addEventListener(eventName,(e)=>{
        scrollable=true
        scrollBar.classList.add("scrolling")
    })
})

"mousemove touchmove".split(" ").forEach((eventName)=>{
    scrollBarThumb.addEventListener(eventName,(e)=>{
        moving=true;
        if(scrollable==false) return
        thumbTop+=e.movementY;
        if(thumbTop<=(scrollBar.clientHeight-scrollBarThumb.clientHeight)&&thumbTop>0){
            scrollBarThumb.style.top=`${thumbTop}px`
            list.scrollTop=`${((list.scrollHeight-list.clientHeight)*thumbTop)/(scrollBar.clientHeight-scrollBarThumb.clientHeight)}`
        }
    })
})

"mouseup touchup".split(" ").forEach((eventName)=>{  
    document.addEventListener(eventName,(e)=>{
        scrollable=false
        scrollBar.classList.remove("scrolling")
    })
})
