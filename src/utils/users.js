let users = [];

const addUser = (id,username,room)=>{
    
    if(username == "" || room == ""){
        return {
            error : "username and room are required",
        }
    }
    username = username.trim();
    room = room.trim();
    
    const existingUser =  users.find((user)=>{
        return user.room === room && user.username === username;
    })
    if(existingUser){
        return {
            error : "The name is already in use"
        }
    }
    users.push({id,username,room})
    return {
        id,
        username,
        room,
    };
}

const removeUser = (id, username ,room)=>{
    const idx= users.findIndex((elem)=>{
        return elem.id === id;
    })
    if(idx!=-1){
        user = users.splice(idx , 1)[0];
        return user
    }
    return undefined;
}

const getUser = (id)=>{
    const user = users.find((elem)=>{
        return elem.id === id;
    });
    return user;
}

const getUsersInRoom = (room)=>{
    const roomUsers = users.filter((elem)=>{
        return elem.room === room;
    })
    return roomUsers;
}

module.exports = {
        addUser,
        removeUser,
        getUser,
        getUsersInRoom,
}