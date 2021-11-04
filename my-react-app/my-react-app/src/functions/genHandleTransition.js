import handleTransition from "./handleTransition.js"

function genHandleTransition(setShowComponents, componentsToHide) {
    return function (event) {
        const {name} = event.target
        handleTransition(setShowComponents, componentsToHide, [name])
    }
}

export default genHandleTransition