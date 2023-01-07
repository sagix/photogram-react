function cleanPageName(name) {
    if(name){
        return name.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|\d+/g, "{id}"); 
    }
    return name;
}

export {cleanPageName};