export const generateNewUserObj = () => {
    var user = {
        name: generateRandomStringOfLength(10),
        email: `${generateRandomStringOfLength(8)}@${generateRandomStringOfLength(8)}.com`,
        password: generateRandomStringOfLength(8)
    }

    return user
}

export const generateInvalidEmail = () => {
    const includesDot = Math.random() < 0.5;
    switch(includesDot){
        case true:
            return `${generateRandomStringOfLength(5)}.${generateRandomStringOfLength(3)}`
        case false:
            return `${generateRandomStringOfLength(Math.floor(Math.random() * 11))}`
    }
}

export const generateValidEmail = () => {
    return `${generateRandomStringOfLength(5)}@${generateRandomStringOfLength(5)}.com`;
}


export const generateRandomStringOfLength = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

export const generateNewArticle = () => {
    const article = {
        title: generateRandomStringOfLength(5),
        desc: generateRandomStringOfLength(5),
        body: generateRandomStringOfLength(10),
        tag: generateRandomStringOfLength(5)
    };
    return article;
}



