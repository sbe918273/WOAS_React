function handleTransition(setShowComponents, componentsToHide, componentsToShow) {

    var updatedComponents = {}
    componentsToShow.forEach(component => (updatedComponents[component] = true))
    componentsToHide.forEach(component => (updatedComponents[component] = false))

    setShowComponents(prevShowComponents => ({
        ...prevShowComponents,
        ...updatedComponents
    }))

}

export default handleTransition