export function getRequirements(messageContent: string) {

    var requirements: { excluded: string[], included: string[][], authors: string[] } = {
        excluded: [],
        included: [],
        authors: []
    }

    if (messageContent.indexOf("{") == -1 || messageContent.indexOf("}") == -1) {
        return {
            excluded: ["all"],
            included: [],
            authors: []
        }
    }

    var tagString = messageContent.substring(messageContent.indexOf("{") + 1, messageContent.indexOf("}"))

    var tagParts = tagString.split('|')
    tagParts.forEach((part, index) => {
        var tagArray = part.split(",")

        var includedArray: string[] = []

        tagArray.forEach((tag, index) => {
            while (tag.startsWith(" ")) {
                tag = tag.substring(1)
            }
            while (tag.endsWith(" ")) {
                tag = tag.substring(0, tag.length - 1)
            }
            tagArray[index] = tag
            if (tag.startsWith("!")) {
                requirements.excluded.push(tag.substring(1))
            } else if (tag.startsWith("?")) {
                while (tag.startsWith(" ")) {
                    tag = tag.substring(1)
                }
                requirements.authors.push(tag.substring(5, tag.length - 1))
                console.log(requirements.authors)
            } else {
                includedArray.push(tag)
            }
        })

        requirements.included.push(includedArray)
    })

    console.log(requirements)
    return requirements
}

export function getQuotes(requirements: { excluded: string[], included: string[][], authors: string[] }, allQuotes: any[]) {
    if(requirements.excluded[0] == "all") {
        return allQuotes
    }


    var listQuotes = allQuotes.filter(quote => {
        var tags = [...quote.tags]
        if (quote.character != "none") {
            tags.push(quote.character.substring(0, quote.character.length - 1))
        }
        var meetsRequirements = false
        //check if has all required tags [works]
        requirements.included.forEach(part => {
            var meetsPart = true

            part.forEach(tag => {
                meetsPart = (tags as string[]).includes(tag) && meetsPart
            })

            if(part.length == 0){
                meetsPart = false
            }

            meetsRequirements = meetsRequirements || meetsPart
        })

        //check if has any of exluded tags [works]
        requirements.excluded.forEach(exclude => {
            meetsRequirements = !(tags as string[]).includes(exclude) && meetsRequirements
        })

        meetsRequirements = requirements.authors.includes(quote.reporter) || meetsRequirements
        return meetsRequirements
    })

    return listQuotes
}