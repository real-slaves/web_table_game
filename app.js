const express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var TableManager = require('./table/findTableModule')

app.use(express.static('docs'))

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})

function chkToMulti(x){
    return x.count || (x.option ? x.option.stack : false)
}

var tableState = []
io.on('connection', (socket)=>{
    var changeTableState = (data) => {
        tableState[tableState.findIndex(x => x._id == data._id)] = data
    }
    socket.on('clearTable',data=>{
        tableState = []
        socket.broadcast.emit('clearTable', true)
    })
    tableState.forEach((x,idx)=>{
        tableState[idx]._id = idx
        if (chkToMulti(x)){
            socket.emit('createProps',x)
        }
        else{
            socket.emit('createProp',x)
        }
    })
    socket.on('decreaseZindexAll',data=>{
        socket.broadcast.emit('decreaseZindexAll',data)
    })
    socket.on('createProp',data=>{
        tableState.push(data)
        socket.broadcast.emit('createProp',data)
    })
    socket.on('reverse', data => {
        tableState[tableState.findIndex(x => x._id == data._id)].option.reverse = data.reverse
        socket.broadcast.emit('reverse', data)
    })
    socket.on('changeProp',data=>{
        changeTableState(data)
        socket.broadcast.emit('changeProp', data)
    })
    socket.on('removeProp',data=>{
        tableState.splice(tableState.findIndex(x => x._id == data._id), 1)
        socket.broadcast.emit('removeProp', data)
    })
    socket.on('createPropToServer',data=>{
        TableManager.getRequestProp(data.primalName)
        .then(propOriginal=>{
            propOriginal._id = data._id
            propOriginal.x = data.x || propOriginal.x
            propOriginal.y = data.y || propOriginal.y
            tableState.push(propOriginal)
            if (chkToMulti(propOriginal)) {
                io.sockets.emit('createProps', propOriginal)
            }
            else {
                io.sockets.emit('createProp', propOriginal)
            }
        })
        .catch(err =>{
            console.log("NO DATA")
        })
    })
});

http.listen(3000, () => {
    console.log("server open");
})