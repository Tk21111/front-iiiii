function filterEntitiesByTag(entities, tagsToFilter, x) {
    let filteredEntities = {};
    
    try {
        if (!Array.isArray(tagsToFilter)) {
            tagsToFilter = [tagsToFilter];
        }
    
        for (let key in entities) {
            if (entities.hasOwnProperty(key)) {
                let entity = entities[key];
                if (Array.isArray(entity[x])){
                    if (entity[x] && entity[x].some(tag => tagsToFilter.includes(tag))) {
                        filteredEntities[key] = entity;
                    }
                } else {
                    if (entity[x] && tagsToFilter.includes(entity[x]))
                    filteredEntities[key] = entity
                }
                
            }
        }
    
    } catch (err) {
        console.log(err)
    }
    
    return filteredEntities;
}

export default filterEntitiesByTag