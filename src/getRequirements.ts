export function getRequirements(messageContent: string){

    var requirements: { excluded: string[], included: string[][] } = {
        excluded: [],
        included: []
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
            } else {
                includedArray.push(tag)
            }
        })

        requirements.included.push(includedArray)
    })

    return requirements
}