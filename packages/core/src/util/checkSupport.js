
function placeholder() { }

export default function checkSupport() {
    window.isSupportGScatter = window.isSupportGScatter || placeholder
    window.notSupportGScatterCallback = window.notSupportGScatterCallback || placeholder
    window.isSupportGScatter(window.notSupportGScatterCallback)
}