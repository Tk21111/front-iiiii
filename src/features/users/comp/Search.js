function filterEntitiesByTag(entities, wordTosearch, searchType , strict) {
    let filteredEntities = {};
    
    try {
        if (!Array.isArray(wordTosearch)) {
            wordTosearch = [wordTosearch];
        }
    
        for (let key in entities) {

            //check for key
            if (entities.hasOwnProperty(key)) {
                let entity = entities[key]; 

                //if the searchType of obj is arr
                if(searchType.split(".").length > 1){

                    const  [searchType1 , searchType2] = searchType.split(".")

                    if (Array.isArray(entity[searchType1][searchType2])){
                   
                        if ( strict && entity[searchType1][searchType2] && entity[searchType1][searchType2].some(tag => wordTosearch.includes(tag.toString()))) {
                            filteredEntities[searchType1][searchType2] = entity;
                        } else if (entity[searchType1][searchType2] && entity[searchType1][searchType2].some(tag => tag.toString().includes(wordTosearch))) {
                            filteredEntities[key] = entity;
                        }
                    } else {
                
                        if (strict && entity[searchType1][searchType2] && wordTosearch.includes(entity[searchType1][searchType2].toString())){
                            filteredEntities[key] = entity
                            } else if (entity[searchType1][searchType2] && entity[searchType1][searchType2].toString().includes(wordTosearch)){
                                filteredEntities[key] = entity
                            }
                    }
                } else {
                    
                    if  (Array.isArray(entity[searchType])){
                        if ( strict && entity[searchType] && entity[searchType].some(tag => wordTosearch.includes(tag.toString()))) {
                            filteredEntities[key] = entity;
                        } else if (entity[searchType] && entity[searchType].some(tag => tag.toString().includes(wordTosearch))) {
                            filteredEntities[key] = entity;
                        }
                    } else {
                        if (strict && entity[searchType] && wordTosearch.includes(entity[searchType].toString())){
                        filteredEntities[key] = entity
                        } else if (entity[searchType] && entity[searchType].toString().includes(wordTosearch)){
                            filteredEntities[key] = entity
                        }
                    }
                }
        
            }
        }

    } catch (err) {
        console.log(err)
    }
    
    //obj = { _id, {obj}}
    return filteredEntities;
}

export default filterEntitiesByTag